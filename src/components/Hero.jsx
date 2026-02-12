import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const WEDDING_DATE = new Date("2027-09-20T19:00:00");

const sections = [
  { id: "home", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "rsvp", label: "RSVP" },
  { id: "registry", label: "Registry" },
  { id: "information", label: "More Info" },
];

function getTimeLeft() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE.getTime() - now;

  return {
    days: Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0),
    hours: Math.max(Math.floor((distance / (1000 * 60 * 60)) % 24), 0),
    minutes: Math.max(Math.floor((distance / (1000 * 60)) % 60), 0),
    seconds: Math.max(Math.floor((distance / 1000) % 60), 0),
  };
}

export default function Hero({ dark, setDark }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const lastScroll = useRef(0);

  /* ------------------ Countdown ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------ Theme persistence ------------------ */
      /* Theme persistence */
      useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) setDark(saved === "dark");
      }, [setDark]);

      useEffect(() => {
        localStorage.setItem("theme", dark ? "dark" : "light");
      }, [dark]);

  /* ------------------ Scroll spy + navbar behavior ------------------ */
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      setScrolled(current > 40);
      setShowNav(current < lastScroll.current || current < 80);
      lastScroll.current = current;

      sections.forEach(section => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(section.id);
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/img/hero.jpeg')" }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition ${
          dark ? "bg-black/50" : "bg-white/20"
        }`}
      />

      {/* NAVBAR */}
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-0 w-full z-30 ${
              scrolled
                ? "backdrop-blur-md bg-white/70 dark:bg-black/40 shadow-sm"
                : "bg-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
              <span
                className={`text-xl tracking-wide ${
                  dark ? "text-white" : "text-slate-900"
                }`}
                style={{ fontFamily: "Playfair Display, serif text-3xl" }}
              >
                R&nbsp;&amp;&nbsp;K
              </span>

              <ul className="hidden md:flex gap-10 text-sm">
                {sections.map(s => (
                  <li
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`cursor-pointer transition text-lg ${
                      active === s.id
                        ? "underline underline-offset-8"
                        : "opacity-70 hover:opacity-100"
                    } ${dark ? "text-white" : "text-slate-900"}`}
                  >
                    {s.label}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4">
                {/* <motion.button
                  whileTap={{ rotate: 180 }}
                  onClick={() => setDark(!dark)}
                  className={dark ? "text-white" : "text-slate-900"}
                >
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button> */}

                <button
                  onClick={() => setMenuOpen(true)}
                  className={`md:hidden cursor-pointer ${dark ? "text-white" : "text-slate-900"}`}
                >
                  <Menu size={26} />
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur flex flex-col items-center justify-center gap-10 text-white"
          >
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-lg tracking-wide"
              >
                {s.label}
              </button>
            ))}

            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 cursor-pointer"
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className={`text-center max-w-3xl ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          <h1
            className="text-5xl md:text-6xl"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ramy & Kelsey
          </h1>

          <p className="mt-4 uppercase tracking-[0.3em] text-sm opacity-80">
            September 19, 2027 • Alabama
          </p>

          <div className="mt-12 grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl py-4 backdrop-blur bg-white/15"
              >
                <div className="text-3xl font-semibold">{value}</div>
                <div className="text-xs uppercase tracking-widest opacity-80 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
            <button
              onClick={() => scrollTo("rsvp")}
              className="mt-14 px-10 py-4 rounded-full bg-white text-slate-900 text-sm tracking-wide hover:bg-white/90 transition cursor-pointer"
            >
              RSVP
            </button>

        </motion.div>
      </div>
    </section>
  );
}
