import { useState } from "react";

const RTDB_URL = "https://weddingrk-8c8cc-default-rtdb.firebaseio.com/rsvps";

export default function EditGuestModal({ guest, close }) {
  const [form, setForm] = useState(guest);

  async function save() {
    try {
      await fetch(`${RTDB_URL}/${guest.id}.json`, {
        method: "PATCH", // updates only the fields in form
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      close();
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      alert("Failed to save changes. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Edit RSVP
        </h2>

        <input
          className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Full Name"
        />

        <input
          className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <input
          className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
        />

        <select
          className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
          value={form.family}
          onChange={(e) => setForm({ ...form, family: e.target.value })}
        >
          <option>Yes</option>
          <option>No</option>
        </select>

        <textarea
          className="w-full border p-2 mb-2 rounded text-sm sm:text-base"
          value={form.dietary}
          onChange={(e) => setForm({ ...form, dietary: e.target.value })}
          placeholder="Dietary Restrictions"
        />

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
          <button
            onClick={save}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Save
          </button>

          <button
            onClick={close}
            className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}