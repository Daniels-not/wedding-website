export default function PrintAllCards({ rsvps }) {
  return (
    <div id="print-all-cards" className="hidden print:block p-6">
      <h1 className="text-2xl text-center mb-8 font-serif">
        Wedding RSVP Cards
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {rsvps.map((guest) => (
          <div
            key={guest.id}
            className="border-2 border-gray-800 rounded-xl p-6 text-sm"
          >
            <h2 className="text-center font-semibold text-lg mb-4">
              Wedding RSVP
            </h2>

            <p>
              <b>Name:</b> {guest.fullName}
            </p>

            <p>
              <b>Guests:</b> {guest.guests}
            </p>

            <p>
              <b>Guest Names:</b>{" "}
              {Array.isArray(guest.guestNames)
                ? guest.guestNames.join(", ")
                : guest.guestNames || "None"}
            </p>

            <p className="mt-2">
              <b>Family:</b> {guest.family}
            </p>

            <p>
              <b>Status:</b> {guest.coming}
            </p>

            <hr className="my-3" />

            <p>
              <b>Email:</b> {guest.email}
            </p>

            <p>
              <b>Phone:</b> {guest.phone}
            </p>

            <hr className="my-3" />

            <p>
              <b>Dietary:</b>
            </p>

            <p className="italic">{guest.dietary || "None"}</p>
          </div>
        ))}
      </div>

      {/* Optional: Total guests */}
      <div className="mt-6 text-center font-semibold text-lg">
        Total Guests:{" "}
        {rsvps.reduce((sum, g) => sum + Number(g.guests || 1), 0)}
      </div>
    </div>
  );
}