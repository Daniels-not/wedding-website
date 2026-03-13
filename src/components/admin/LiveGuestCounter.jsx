export default function LiveGuestCounter({ rsvps }) {
  const attending = rsvps
    .filter((r) => r.coming === "Yes")
    .reduce((sum, r) => sum + Number(r.guests || 1), 0);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center max-w-md sm:max-w-lg mx-auto">
      <h2 className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-5">
        Live Guest Counter
      </h2>

      <div className="text-5xl sm:text-7xl font-bold text-green-600">{attending}</div>

      <p className="text-gray-500 text-sm sm:text-base mt-2 sm:mt-3">Guests Attending</p>
    </div>
  );
}