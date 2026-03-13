import { Eye, Pencil, Trash2 } from "lucide-react";

const RTDB_URL = "https://weddingrk-8c8cc-default-rtdb.firebaseio.com/rsvps";

export default function RSVPTable({ rsvps, onView, onEdit, onDelete }) {
  // Delete a guest from the Realtime Database
  async function deleteGuest(id) {
    if (!window.confirm("Delete RSVP?")) return;

    try {
      await fetch(`${RTDB_URL}/${id}.json`, { method: "DELETE" });
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Failed to delete RSVP:", error);
      alert("Failed to delete guest. Please try again.");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
      {/* Table for medium+ screens */}
      <table className="w-full hidden md:table">
        <thead className="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th>Guests</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Family</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rsvps.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{r.fullName}</td>
              <td>{r.guests}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    r.family === "Yes" ? "bg-purple-100 text-purple-700" : "bg-gray-100"
                  }`}
                >
                  {r.family}
                </span>
              </td>
              <td>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    r.coming === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.coming}
                </span>
              </td>
              <td className="flex gap-3 items-center">
                <button onClick={() => onView(r)} className="text-blue-600">
                  <Eye size={18} />
                </button>
                <button onClick={() => onEdit(r)} className="text-yellow-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteGuest(r.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4 p-2">
        {rsvps.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 bg-gray-50 shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{r.fullName}</span>
              <div className="flex gap-2">
                <button onClick={() => onView(r)} className="text-blue-600">
                  <Eye size={18} />
                </button>
                <button onClick={() => onEdit(r)} className="text-yellow-600">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteGuest(r.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p>
              <b>Guests:</b> {r.guests}
            </p>
            <p>
              <b>Email:</b> {r.email}
            </p>
            <p>
              <b>Phone:</b> {r.phone}
            </p>
            <p>
              <b>Family:</b>{" "}
              <span
                className={`px-2 py-1 text-xs rounded ${
                  r.family === "Yes" ? "bg-purple-100 text-purple-700" : ""
                }`}
              >
                {r.family}
              </span>
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  r.coming === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {r.coming}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}