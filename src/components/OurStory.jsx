import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function OurStory({ dark }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  /* Section animation */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 20%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  /* Quote animation (triggered by image position) */
  // const { scrollYProgress: imageProgress } = useScroll({
  //   target: imageRef,
  //   offset: ["start 60%", "start 20%"],
  // });

  // const quoteOpacity = useTransform(imageProgress, [0.6, 1], [0, 1]);
  // const quoteY = useTransform(imageProgress, [0.6, 1], [20, 0]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className={`min-h-screen flex items-center px-3 pt-20 transition ${
        dark ? "bg-white-100 text-black" : "bg-neutral-50 text-slate-900"
      }`}
    >
      <motion.div
        style={{ opacity, y, scale }}
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center"
      >
        {/* Image + Quote */}
        <div ref={imageRef} className="relative">
          <img
            src="/img/about.jpeg"
            alt="Our Story"
            className="rounded-3xl shadow-xl"
          />

          {/* Quote Overlay
          <motion.div
            style={{ opacity: quoteOpacity, y: quoteY }}
            className={`absolute bottom-8 left-8 right-8 rounded-2xl px-6 py-4 backdrop-blur-md shadow-lg transition ${
              dark
                ? "bg-black/60 text-white"
                : "bg-white/80 text-slate-800"
            }`}
          >
            <p
              className="text-lg text-center"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              “Our forever begins here”
            </p>
          </motion.div> */}
        </div>

        {/* Text */}
        <div>
          <h2
            className="text-4xl mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Our Story
          </h2>

          <p className="leading-relaxed opacity-90 mb-4 tracking-wider text-lg md:text-xl">
            What started as a simple conversation slowly grew into something far beyond what we could have imagined—a journey filled with faith, friendship, and love. From laughter in the small moments to prayers whispered in quiet times, we discovered that our hearts were always being guided toward the same promise.
          </p>

          <p className="leading-relaxed opacity-90 tracking-wider text-lg md:text-xl">
            As we reflect on every step that led us here, we are filled with gratitude for the lessons, the joy, and the growth along the way. Today, we are overjoyed to celebrate the beginning of our forever with the people we love most—our family, friends, and everyone who has walked alongside us in this journey.
          </p>

        </div>
      </motion.div>
    </section>
  );
}
