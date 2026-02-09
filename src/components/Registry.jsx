// src/components/Registry.jsx
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import db from "../db";

import "swiper/css";

export default function Registry() {
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // item pending confirmation
  const [toast, setToast] = useState(null);
  const sectionRef = useRef(null);

  // Confetti state + timer ref
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef(null);
  const { width, height } = useWindowSize();

  // Special id: do NOT allow marking as purchased (only view)
  const DISABLED_CHECK_ID = "bWqZ4mtKLk1TMhXnIF2F";

  useEffect(() => {
    const fetchRegistry = async () => {
      const snapshot = await getDocs(collection(db, "registry"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setItems(data);
    };

    fetchRegistry();
  }, []);

  // Cleanup confetti timer on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  // Open confirmation modal for an item
  const onClickCheck = (e, item) => {
    e?.stopPropagation?.();
    // guard: don't open for the special disabled ID or already purchased
    const alreadyPurchased = item.purchased || item.bought || false;
    if (alreadyPurchased || item.id === DISABLED_CHECK_ID) return;
    setActiveItem(item);
  };

  // Confirm and write to Firestore, then update local state
  const confirmPurchase = async () => {
    if (!activeItem) return;
    try {
      // set both keys to be safe: purchased and bought
      await updateDoc(doc(db, "registry", activeItem.id), {
        purchased: true,
        bought: true,
        purchasedAt: Date.now(),
      });

      setItems((prev) =>
        prev.map((p) =>
          p.id === activeItem.id ? { ...p, purchased: true, bought: true } : p
        )
      );

      // 🎉 Trigger confetti for successful purchase
      setShowConfetti(true);
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
        confettiTimeoutRef.current = null;
      }, 4000);

      setToast(`"${activeItem.title || activeItem.name || "Item"}" marked as purchased`);
      setActiveItem(null);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to mark purchased:", err);
      setToast("Something went wrong. Try again.");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <motion.section
      id="registry"
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-24"
    >
      {/* Confetti (full-screen) */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={180}
          gravity={0.18}
        />
      )}

      <div className="text-center mb-28">
        <h2 className="text-5xl font-serif mb-4 tracking-tight">Registry</h2>
        <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 text-xl">
          Your presence means the world to us. If you'd like to bless us with a gift, here are a few curated items we love.
        </p>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-neutral-500 italic"
        >
          No items yet — thank you for checking 💛
        </motion.div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={48}
          grabCursor
          centeredSlides
          loop
          speed={650}
          resistanceRatio={0.85}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          pagination={false}
          breakpoints={{
            0: { slidesPerView: 1.05 },
            768: { slidesPerView: 1.25 },
            1024: { slidesPerView: 1.7 },
          }}
        >
          {items.map((item) => {
            const bought = item.purchased || item.bought || false;
            const isDisabledCheck = item.id === DISABLED_CHECK_ID;

            return (
              <SwiperSlide key={item.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className={`
                    relative flex flex-col md:flex-row items-center gap-14
                    rounded-[2.75rem]
                    p-10 md:p-14
                    bg-gradient-to-br from-[#f6f4ef] to-[#e9e5dd]
                    shadow-[0_30px_80px_rgba(0,0,0,0.14)]
                    ${bought ? "opacity-70 pointer-events-none" : ""}
                  `}
                >
                  {/* Top-right controls (INSIDE card) */}
                  <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                    {bought && (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black text-white text-xs px-4 py-1 rounded-full tracking-wide"
                      >
                        Purchased
                      </motion.span>
                    )}

                    {/* CHECK BUTTON */}
                    {/* Only render clickable check when item is not purchased and not the disabled ID */}
                    {!bought && !isDisabledCheck && (
                      <button
                        onClick={(e) => onClickCheck(e, item)}
                        aria-label={`Mark ${item.title || item.name} as purchased`}
                        className="w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center cursor-pointer hover:scale-[1.03] transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-neutral-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}

                    {/* If check is intentionally disabled for this item, show a subtle info icon instead */}
                    {!bought && isDisabledCheck && (
                      <div
                        title="This item is view-only"
                        className="w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-xs text-neutral-600"
                      >
                        i
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative shrink-0 md:w-[26rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-3xl object-cover w-full h-[320px]"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-[1.3] text-center md:text-left pr-2 md:pr-6">
                    <h3 className="text-2xl font-semibold mb-4">{item.name}</h3>

                    {/* View button (always available unless you want to hide) */}
                    {!bought && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full px-8 py-3 text-sm tracking-wide bg-black text-white hover:opacity-90 transition"
                      >
                        View Gift
                      </a>
                    )}

                    {/* If purchased, still show the view button (disabled visually) */}
                    {bought && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full px-8 py-3 text-sm tracking-wide bg-white/30 text-neutral-700 transition pointer-events-none"
                      >
                        View Gift
                      </a>
                    )}
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Note */}
      <p className="mt-32 text-center text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
        If you have another gift in mind that isn't listed here, feel free to bring it — your presence is the greatest gift.
      </p>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setActiveItem(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center z-10"
            >
              <h3 className="text-lg mb-4">Mark this gift as purchased?</h3>
              <p className="text-sm opacity-70 mb-6">
                This will prevent others from buying the same gift.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveItem(null)}
                  className="flex-1 py-3 rounded-full border"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-3 rounded-full bg-black text-white"
                >
                  Yes, I bought it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
