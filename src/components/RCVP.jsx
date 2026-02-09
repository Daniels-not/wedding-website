import { useEffect, useRef, useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RTDB_URL =
  "https://weddingrk-8c8cc-default-rtdb.firebaseio.com/rsvps.json";
const EMAIL_ENDPOINT =
  "https://formsubmit.co/ajax/ramydcampusanov@hotmail.com";

// Memoized InputGroup
const InputGroup = memo(
  ({ id, label, value, onChange, type = "text", textarea = false, maxW = "max-w-[400px]", disabled }) => {
    const isActive = value !== undefined && String(value).length > 0;
    const baseClass =
      "w-full rounded-[20px] border-2 px-5 py-4 bg-transparent outline-none transition-all duration-300 ease-in-out text-black placeholder-transparent text-lg";
    const borderClass = isActive ? "border-indigo-200" : "border-gray-400";

    return (
      <div className={`relative my-6 ${maxW}`} style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        {textarea ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            className={`${baseClass} ${borderClass} h-32 resize-y`}
            disabled={disabled}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className={`${baseClass} ${borderClass} ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`}
            disabled={disabled}
          />
        )}
        <label
          htmlFor={id}
          className={`absolute left-0 pointer-events-none transition-all duration-300 text-gray-500 ${
            isActive
              ? "-translate-y-1/2 scale-90 ml-5 py-1 px-2 bg-gray-200 rounded"
              : "py-4 ml-3"
          }`}
          style={{ transformOrigin: "left center" }}
        >
          {label}
        </label>
      </div>
    );
  }
);

export default function RSVPSection() {
  const [index, setIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [savedDbKey, setSavedDbKey] = useState(null);
  const timerRef = useRef(null);
  const { width, height } = useWindowSize();

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("rsvp-draft");
    return saved
      ? JSON.parse(saved)
      : {
          coming: "",
          fullName: "",
          bringingPlusOne: "",
          plusOneName: "",
          hasGuests: "",
          guestNames: "",
          hasDietary: "",
          dietary: "",
          email: "",
          phone: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("rsvp-draft", JSON.stringify(form));
  }, [form]);

  // 🔧 FIXED: removed unnecessary dependency
  const steps = useMemo(() => {
    if (form.coming === "No") {
      return ["coming", "fullName"];
    }

    const s = [];
    s.push("coming");
    s.push("fullName");
    s.push("plusOneQ");

    if (form.bringingPlusOne === "Yes") {
      s.push("plusOneName");
      s.push("dietary");
    } else {
      s.push("hasGuests");
      if (form.hasGuests === "Yes") {
        s.push("guestNames");
      }
      s.push("dietary");
    }

    if (form.hasDietary === "Yes") {
      s.push("dietaryText");
    }

    s.push("contact");
    return s;
  }, [form.coming, form.bringingPlusOne, form.hasGuests, form.hasDietary]);

  const summaryIndex = steps.length;

  const derivedGuestCount = useMemo(() => {
    const namesCount =
      form.guestNames?.split(",").map((n) => n.trim()).filter(Boolean).length || 0;
    const plusOneCount =
      form.bringingPlusOne === "Yes" && form.plusOneName?.trim() ? 1 : 0;
    return plusOneCount + namesCount;
  }, [form.guestNames, form.bringingPlusOne, form.plusOneName]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // validate current step key
  const validateKey = (key) => {
    switch (key) {
      case "coming":
        if (!form.coming) return (toast.error("Please choose if you are coming."), false);
        return true;
      case "fullName":
        if (!form.fullName || !form.fullName.trim()) return (toast.error("Please enter your full name."), false);
        return true;
      case "plusOneQ":
        if (!form.bringingPlusOne) return (toast.error("Please answer whether you're bringing a +1."), false);
        return true;
      case "plusOneName":
        if (form.bringingPlusOne === "Yes" && !(form.plusOneName ?? "").trim())
          return (toast.error("Please enter your +1's name."), false);
        return true;
      case "hasGuests":
        if (!form.hasGuests) return (toast.error("Please indicate if you have additional guests."), false);
        return true;
      case "guestNames":
        if (form.hasGuests === "Yes" && (!form.guestNames || !form.guestNames.trim()))
          return (toast.error("Please enter guest names (comma separated)."), false);
        return true;
      case "dietary":
        if (!form.hasDietary && form.coming === "Yes") return (toast.error("Please indicate if you have dietary restrictions."), false);
        return true;
      case "dietaryText":
        if (form.hasDietary === "Yes" && (!form.dietary || !form.dietary.trim()))
          return (toast.error("Please specify your dietary restrictions."), false);
        return true;
      case "contact":
        // if coming yes, require email; if coming no we don't require contact in this flow
        if (form.coming === "Yes" && (!form.email || !form.email.trim())) return (toast.error("Please enter your email."), false);
        return true;
      default:
        return true;
    }
  };

  // const goToIndex = (i) => {
  //   // clamp
  //   const clamped = Math.max(0, Math.min(summaryIndex, i));
  //   setIndex(clamped);
  // };

  const next = () => {
    const currentKey = index < steps.length ? steps[index] : null;
    if (currentKey && !validateKey(currentKey)) return;

    // advance to next index (summary included)
    if (index < summaryIndex) {
      setIndex((i) => Math.min(summaryIndex, i + 1));
    }
  };

  const back = () => {
    // if at summary, go to last step
    if (index === summaryIndex) {
      setIndex(Math.max(0, steps.length - 1));
      return;
    }
    // normal back
    setIndex((i) => Math.max(0, i - 1));
  };

  const formatPhoneInput = (raw) => {
    const nums = raw.replace(/\D/g, "").slice(0, 10);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6, 10)}`;
  };

  const submitRSVP = async () => {
    // validate all steps before final submit
    for (let i = 0; i < steps.length; i++) {
      const key = steps[i];
      if (!validateKey(key)) {
        setIndex(i);
        return;
      }
    }

    if (sending || submitted) return;
    setSending(true);

    const payload = {
      coming: form.coming,
      fullName: form.fullName,
      bringingPlusOne: form.bringingPlusOne,
      plusOneName: form.plusOneName,
      hasGuests: form.hasGuests,
      guestNames: form.guestNames,
      hasDietary: form.hasDietary,
      dietary: form.dietary,
      email: form.email,
      phone: form.phone,
      guests: derivedGuestCount,
      timestamp: Date.now(),
    };

    try {
      const res = await fetch(RTDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.name) setSavedDbKey(data.name);

      await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "New Wedding RSVP 💍",
          message: `
Name: ${payload.fullName}
Coming: ${payload.coming}
Bringing +1: ${payload.bringingPlusOne}
+1 name: ${payload.plusOneName}
Additional guests: ${payload.hasGuests}
Guest names: ${payload.guestNames}
Dietary: ${payload.dietary}
Email: ${payload.email}
Phone: ${payload.phone}
Total additional guests: ${payload.guests}
          `,
          email: payload.email,
        }),
      });

      if (payload.email) {
        await fetch(EMAIL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: payload.email,
            subject: "We received your RSVP 💖",
            message: "Thank you so much for your RSVP! We can’t wait to celebrate with you.",
          }),
        });
      }

      localStorage.removeItem("rsvp-draft");
      setSubmitted(true);
      setIndex(summaryIndex + 1); // show thank-you page
      if (form.coming === "Yes") {
        setShowConfetti(true);
        timerRef.current = setTimeout(() => setShowConfetti(false), 5000);
      }
      toast.success("RSVP submitted! 🎉");
    } catch (err) {
      console.error(err);
      toast.error("There was an error sending your RSVP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const undo = async () => {
    try {
      if (savedDbKey) {
        const delUrl = RTDB_URL.replace(/\.json$/, `/${savedDbKey}.json`);
        await fetch(delUrl, { method: "DELETE" });
        setSavedDbKey(null);
      }
    } catch (e) {
      console.error("Failed to delete RTDB record on undo:", e);
    } finally {
      localStorage.removeItem("rsvp-draft");
      setForm({
        coming: "",
        fullName: "",
        bringingPlusOne: "",
        plusOneName: "",
        hasGuests: "",
        guestNames: "",
        hasDietary: "",
        dietary: "",
        email: "",
        phone: "",
      });
      setSubmitted(false);
      setIndex(0);
      setShowConfetti(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      toast.info("Draft cleared.");
    }
  };

  // helpers for UI
  const btnPrimary = "px-6 py-3 rounded-xl bg-black text-white hover:opacity-90 transition text-lg";
  const btnGhost = "px-4 py-3 rounded-xl border border-gray-300 bg-white text-black hover:bg-gray-100 transition text-lg";
  const btnYesNo = (v, selected) =>
    v === "Yes"
      ? `${selected ? "bg-black text-white" : "bg-white text-black border border-gray-300"} px-6 py-3 rounded-xl transition text-lg font-medium`
      : `${selected ? "bg-gray-600 text-white" : "bg-white text-black border border-black"} px-6 py-3 rounded-xl transition text-lg font-medium`;

  const displayStep = Math.min(index, summaryIndex) + 1;
  const displayTotal = summaryIndex + 1;

  const SummaryRow = ({ label, value, stepKey }) => {
    const stepIdx = steps.indexOf(stepKey);
    const editHandler = () => {
      if (stepIdx >= 0) setIndex(stepIdx);
      else {
        // if stepKey isn't present because of branching, jump to a best-fit step
        // e.g., if plusOneName isn't present but you want to edit plusOneName, go to plusOneQ
        const fallback =
          stepKey === "plusOneName" ? steps.indexOf("plusOneQ") : steps.indexOf("contact");
        setIndex(Math.max(0, fallback));
      }
    };
    return (
      <div className="flex justify-between items-start gap-4 py-3 border-b last:border-b-0">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-base text-gray-900">{value ?? "—"}</div>
        </div>
        <button onClick={editHandler} className="text-sm text-indigo-600 underline">Edit</button>
      </div>
    );
  };

  const currentKey = index < steps.length ? steps[index] : index === summaryIndex ? "summary" : "thankyou";

  return (
    <section id="rsvp" className="py-16 relative overflow-hidden min-h-[550px] pt-50">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={160} gravity={0.18} recycle={false} />}

      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-center mb-6">RSVP for Our Wedding</h1>
        <p className="text-center text-lg mb-4 opacity-70">Step {displayStep} of {displayTotal}</p>
        <p className="text-center text-lg mb-12 opacity-70">
          We can’t wait to celebrate with you! Please answer the questions below.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey + String(index)}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-xl p-10"
          >
            {/* coming */}
            {currentKey === "coming" && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Are you coming?</h2>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        update("coming", v);
                        // reset branching answers if changing to No
                        if (v === "No") {
                          update("bringingPlusOne", "");
                          update("plusOneName", "");
                          update("hasGuests", "");
                          update("guestNames", "");
                          update("hasDietary", "");
                          update("dietary", "");
                          update("email", "");
                          update("phone", "");
                        }
                        next();
                      }}
                      className={btnYesNo(v, form.coming === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* fullName */}
            {currentKey === "fullName" && (
              <InputGroup
                id="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                maxW="max-w-full"
              />
            )}

            {/* plusOne question */}
            {currentKey === "plusOneQ" && form.coming === "Yes" && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Will you bring a +1?</h2>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        update("bringingPlusOne", v);
                        // when choosing Yes, we clear household fields; when choosing No we clear plusOneName
                        if (v === "Yes") {
                          update("hasGuests", "");
                          update("guestNames", "");
                        } else {
                          update("plusOneName", "");
                        }
                        // move to next naturally (steps[] is rebuilt based on form)
                        next();
                      }}
                      className={btnYesNo(v, form.bringingPlusOne === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* plusOneName */}
            {currentKey === "plusOneName" && form.bringingPlusOne === "Yes" && (
              <InputGroup
                id="plusOneName"
                label="+1's Full Name"
                value={form.plusOneName}
                onChange={(e) => update("plusOneName", e.target.value)}
                maxW="max-w-full"
              />
            )}

            {/* hasGuests (only when not bringing +1 and coming === Yes) */}
            {currentKey === "hasGuests" && form.coming === "Yes" && form.bringingPlusOne !== "Yes" && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Are you bringing any additional guests from your household?</h2>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        update("hasGuests", v);
                        if (v === "No") update("guestNames", "");
                        next();
                      }}
                      className={btnYesNo(v, form.hasGuests === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* guestNames */}
            {currentKey === "guestNames" && form.hasGuests === "Yes" && form.bringingPlusOne !== "Yes" && (
              <>
                <InputGroup
                  id="guestNames"
                  label="Guest Names (comma separated)"
                  value={form.guestNames}
                  onChange={(e) => update("guestNames", e.target.value)}
                  textarea
                  maxW="max-w-full"
                />
                <InputGroup
                  id="guests"
                  label="Additional guests count"
                  type="number"
                  value={(form.guestNames && form.guestNames.split(",").filter(Boolean).length) || 0}
                  onChange={() => {}}
                  disabled
                  maxW="max-w-[300px]"
                />
              </>
            )}

            {/* dietary question */}
            {currentKey === "dietary" && form.coming === "Yes" && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Do you have any dietary restrictions?</h2>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        update("hasDietary", v);
                        if (v === "No") update("dietary", "");
                        next();
                      }}
                      className={btnYesNo(v, form.hasDietary === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* dietaryText */}
            {currentKey === "dietaryText" && form.hasDietary === "Yes" && (
              <InputGroup
                id="dietary"
                label="Please specify your dietary restrictions"
                value={form.dietary}
                onChange={(e) => update("dietary", e.target.value)}
                textarea
                maxW="max-w-full"
              />
            )}

            {/* contact */}
            {currentKey === "contact" && (
              <>
                <InputGroup
                  id="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxW="max-w-full"
                />
                <InputGroup
                  id="phone"
                  label="Phone (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", formatPhoneInput(e.target.value))}
                  maxW="max-w-full"
                />
              </>
            )}

            {/* summary */}
            {currentKey === "summary" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Review your RSVP</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="text-sm text-gray-500">Attending</div>
                  <div className="text-base text-gray-900">{form.coming || "—"}</div>

                  <SummaryRow label="Full name" value={form.fullName || "—"} stepKey="fullName" />
                  <SummaryRow label="Bringing +1" value={form.bringingPlusOne || "—"} stepKey="plusOneQ" />
                  {form.bringingPlusOne === "Yes" && (
                    <SummaryRow label="+1's name" value={form.plusOneName || "—"} stepKey="plusOneName" />
                  )}

                  {form.bringingPlusOne !== "Yes" && (
                    <>
                      <SummaryRow label="Bringing household guests?" value={form.hasGuests || "—"} stepKey="hasGuests" />
                      {form.hasGuests === "Yes" && <SummaryRow label="Guest names" value={form.guestNames || "—"} stepKey="guestNames" />}
                    </>
                  )}

                  <SummaryRow label="Dietary restrictions?" value={form.hasDietary || "—"} stepKey="dietary" />
                  {form.hasDietary === "Yes" && <SummaryRow label="Dietary details" value={form.dietary || "—"} stepKey="dietaryText" />}

                  <SummaryRow label="Email" value={form.email || "—"} stepKey="contact" />
                  <SummaryRow label="Phone" value={form.phone || "—"} stepKey="contact" />

                  <div className="pt-2 text-sm text-gray-600">
                    Total additional guests recorded: {(form.guestNames && form.guestNames.split(",").filter(Boolean).length) + (form.bringingPlusOne === "Yes" && form.plusOneName ? 1 : 0)}
                  </div>
                </div>
              </div>
            )}

            {/* thank you */}
            {currentKey === "thankyou" && (
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold">Thank you — your RSVP was recorded.</h3>
                <p className="mt-3 text-gray-600">We appreciate you taking the time to respond. See you soon!</p>
                <div className="mt-6 flex justify-center gap-4">
                  <button onClick={() => { setIndex(0); }} className="px-4 py-2 rounded bg-white border">Fill again</button>
                  <button onClick={undo} className="px-4 py-2 rounded bg-rose-600 text-white">Undo last submission</button>
                </div>
              </div>
            )}

            {/* NAV */}
            {currentKey !== "thankyou" && (
              <div className="flex justify-between mt-8">
                {index > 0 ? <button onClick={back} className={btnGhost}>Back</button> : <div />}
                <div className="flex items-center gap-3">
                  {index < summaryIndex && (
                    <button onClick={next} className={btnPrimary}>Next</button>
                  )}

                  {index === summaryIndex && (
                    <button
                      onClick={submitRSVP}
                      disabled={sending || submitted}
                      className={`${btnPrimary} ${sending || submitted ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      {sending ? "Sending..." : submitted ? "Submitted ✓" : "Submit RSVP"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {submitted && index !== summaryIndex + 1 && (
              <div className="text-center mt-6">
                <button onClick={undo} className="text-sm underline opacity-70">Undo submission</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </section>
  );
}
