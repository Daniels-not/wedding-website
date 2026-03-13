export default function GuestCard({ guest, close }) {
  function printCard() {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div
        id="print-card"
        className="bg-white w-[450px] p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-serif text-center mb-6">Wedding RSVP</h2>

        <div className="space-y-2">
          <p>
            <b>Name:</b> {guest.fullName}
          </p>
          <p>
            <b>Guests:</b> {guest.guests}
          </p>
          <p>
            <b>Guest Names:</b> {guest.guestNames}
          </p>

          <p>
            <b>Family:</b> {guest.family}
          </p>

          <p>
            <b>Status:</b> {guest.coming}
          </p>

          <hr />

          <p>
            <b>Email:</b> {guest.email}
          </p>
          <p>
            <b>Phone:</b> {guest.phone}
          </p>

          <hr />

          <p>
            <b>Dietary:</b>
          </p>
          <p className="italic text-gray-600">{guest.dietary || "None"}</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={printCard}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Print
          </button>

          <button onClick={close} className="bg-gray-300 px-4 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
