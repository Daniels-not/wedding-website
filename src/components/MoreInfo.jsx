// MoreInfo.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export default function MoreInfo({
  venueName = "Our Wedding Venue",
  lat = 34.540055,
  lng = -86.599639,
  address = "237 Hough Road, Laceys Spring AL 35754",
  hotelsUrl = "", // unused — we open modal instead
}) {
const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;


  // Modal states
  const [showHotels, setShowHotels] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [lastOpenedHotel, setLastOpenedHotel] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  // List of hotels (user-provided). Each has a friendly Expedia search link (encoded)
  const hotels = [
    {
      name: "Hilton Garden Inn Huntsville",
      minutes: 10,
      // unsplash query gives a reasonable photo; fallback if blocked by CSP
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdaJrbxS5sw0tIQN8pPdVwsiLXtBRxsZx8Bg&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Hilton Garden Inn Huntsville, AL"
      )}`,
    },
    {
      name: "Homewood Suites by Hilton Huntsville",
      minutes: 11,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToDAUN_6FRs8Uf7XGZ-sSwZH2-W0Fyh3n18w&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Homewood Suites by Hilton Huntsville, AL"
      )}`,
    },
    {
      name: "SpringHill Suites by Marriott",
      minutes: 9,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy71DYPJbAa0GTut_1vLi7ml4kX3DbjCdnvg&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "SpringHill Suites Huntsville, AL"
      )}`,
    },
    {
      name: "Embassy Suites by Hilton",
      minutes: 12,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDAH91eJFBMyRgxwKQm0M_yZZzNYhrAcGuSg&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Embassy Suites Huntsville, AL"
      )}`,
    },
    {
      name: "Candlewood Suites",
      minutes: 8,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU3TImWP5UDJah6NxMzyAXmJDDu2uC5Cp2nA&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Candlewood Suites Huntsville, AL"
      )}`,
    },
    {
      name: "Huntsville Marriott at the Space & Rocket Center",
      minutes: 18,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV2E5wTrWoRZkpEnQ3n2NhB4umQrDnLA7fXA&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Huntsville Marriott at the Space & Rocket Center, Huntsville, AL"
      )}`,
    },
    {
      name: "Holiday Inn Express & Suites Huntsville",
      minutes: 14,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqYMWOQtK3D8WIJmpemdBV7gOZmhnpuDfXPA&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Holiday Inn Express & Suites Huntsville, AL"
      )}`,
    },
    {
      name: "Drury Inn & Suites Huntsville at the Space & Rocket Center",
      minutes: 16,
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDkxtZMeVjb9aosu6K3uuOyM_v5GnGA8IYsA&s`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
        "Drury Inn & Suites Huntsville, AL"
      )}`,
    },
  ];

  // open expedia and keep a small confirmation message
  const openExpedia = (hotel) => {
    window.open(hotel.expedia, "_blank", "noopener,noreferrer");
    setLastOpenedHotel(hotel.name);
    // small timed clear of message
    setTimeout(() => setLastOpenedHotel(null), 3500);
  };

  // copy address to clipboard and show confirmation / offer to open Google Maps
  const handleGetLocation = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
        setCopySuccess("Address copied to clipboard!");
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = address;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        setCopySuccess("Address copied to clipboard!");
      }
      setShowLocationPopup(true);
      setTimeout(() => setCopySuccess(""), 3500);
    } catch (err) {
      console.error("copy failed", err);
      setCopySuccess("Couldn't copy automatically — you can highlight and copy: " + address);
      setShowLocationPopup(true);
    }
  };

  return (
    <motion.section
      id="information"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* MAP */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] md:h-[580px]"
        >
          <iframe
            title={`${venueName} location`}
            src={mapSrc}
            className="w-full h-full border-0"
            loading="lazy"
          />

          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
            <div className="text-sm font-medium">{venueName}</div>
            <div className="text-xs text-gray-500">{address}</div>
          </div>

          <div className="absolute bottom-6 left-6 flex gap-3">
            <button
              onClick={handleGetLocation}
              className="px-4 py-2 rounded-full bg-black text-white text-sm shadow"
            >
              Get location
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm shadow"
            >
              Open in Maps
            </a>
          </div>
        </motion.div>

        {/* TEXT */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="px-2 md:px-6"
        >
          <h3 className="text-4xl font-serif mb-6">More information</h3>

          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            We’ve pinned the venue on the map so you can easily explore the area.
            We hope this helps you plan your visit and enjoy the celebration comfortably.
          </p>

          <p className="text-gray-600 mb-10 text-lg">
            If you’re traveling from out of town, there are several lovely hotels nearby.
            Click below to browse curated options close to the venue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* PRIMARY: open hotels modal */}
            <motion.button
              onClick={() => setShowHotels(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 rounded-full bg-black text-white text-lg font-medium hover:bg-gray-900 transition shadow-lg text-center"
            >
              View nearby hotels
            </motion.button>

            {/* SECONDARY: open directions */}
            <motion.a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 rounded-full border border-gray-300 text-gray-700 text-lg hover:bg-gray-50 transition text-center"
            >
              Get directions
            </motion.a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Booking early is recommended, especially for weekend stays.
          </p>
        </motion.div>
      </div>

      {/* --- Hotels modal --- */}
      <AnimatePresence>
        {showHotels && (
          <motion.div
            key="hotels-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-6"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowHotels(false)}
            />

            <motion.div
              initial={{ y: 40, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h4 className="text-lg font-semibold">Nearby hotels</h4>
                  <p className="text-sm text-gray-500">Hand-picked options close to the venue.</p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-800 p-2 rounded"
                  onClick={() => setShowHotels(false)}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
                {hotels.map((h) => (
                  <div
                    key={h.name}
                    className="flex gap-4 items-center rounded-xl p-4 shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-lg">{h.name}</div>
                          <div className="text-sm text-gray-500">{h.minutes} minutes from venue (approx.)</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => openExpedia(h)}
                            className="px-3 py-2 rounded-full bg-black text-white text-sm"
                          >
                            Expedia
                          </button>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ", Huntsville, AL")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 underline"
                          >
                            See on map
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {lastOpenedHotel ? `Opened Expedia for "${lastOpenedHotel}".` : "Select a hotel to open on Expedia."}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHotels(false)}
                    className="px-4 py-2 rounded-full border"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Location popup (copy confirmation + quick open) --- */}
      <AnimatePresence>
        {showLocationPopup && (
          <motion.div
            key="location-popup"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 w-80">
              <div className="text-sm text-gray-700 mb-2">Venue address</div>
              <div className="text-sm font-medium">{address}</div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    // open Google Maps directions
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, "_blank", "noopener,noreferrer");
                  }}
                  className="px-3 py-2 rounded-full bg-black text-white text-sm"
                >
                  Open directions
                </button>
                <button
                  onClick={() => {
                    // copy again if they want
                    navigator.clipboard?.writeText?.(address);
                    setCopySuccess("Address copied to clipboard!");
                    setTimeout(() => setCopySuccess(""), 2200);
                  }}
                  className="px-3 py-2 rounded-full border text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() => setShowLocationPopup(false)}
                  className="px-3 py-2 rounded-full border text-sm"
                >
                  Close
                </button>
              </div>
              {copySuccess && <div className="mt-2 text-xs text-green-600">{copySuccess}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
