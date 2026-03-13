import { useEffect, useState } from "react";

import AdminStats from "../components/admin/AdminStats";
import LiveGuestCounter from "../components/admin/LiveGuestCounter";
import RSVPTable from "../components/admin/RSVPTable";
import GuestCard from "../components/admin/GuestCard";
import EditGuestModal from "../components/admin/EditGuestModal";
import DownloadPDFButton from "../components/admin/DownloadPDFButton";
import PrintAllCards from "../components/admin/PrintAllCards";
import Loader from "../components/admin/Loader"; 

// Realtime DB URL
const RTDB_URL = "https://weddingrk-8c8cc-default-rtdb.firebaseio.com/rsvps.json";

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true); // NEW: loader state
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  // Fetch RSVPs from Realtime Database
  useEffect(() => {
    async function fetchRsvps() {
      setLoading(true); // start loading
      try {
        const res = await fetch(RTDB_URL);
        if (!res.ok) throw new Error("Failed to fetch RSVPs");
        const data = await res.json();

        if (!data) {
          setRsvps([]);
        } else {
          const list = Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }));
          setRsvps(list);
        }
      } catch (error) {
        console.error(error);
        setRsvps([]);
      } finally {
        setLoading(false); // stop loading
      }
    }

    fetchRsvps();
  }, []);

  // Update state after deletion
  function handleDelete(id) {
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  }

  function printCards() {
    window.print();
  }

  // Show loader while fetching
  if (loading) {
    return <Loader message="Loading RSVPs... 😊" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-800 tracking-wide">
            Wedding RSVP Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <DownloadPDFButton rsvps={rsvps} />
            <button
              onClick={printCards}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base"
            >
              Print RSVP Cards
            </button>
          </div>
        </div>

        {/* LIVE COUNTER */}
        <div className="w-full max-w-md mx-auto sm:mx-0">
          <LiveGuestCounter rsvps={rsvps} />
        </div>

        {/* STATISTICS */}
        <div className="w-full">
          <AdminStats rsvps={rsvps} />
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            Guest List
          </h2>

          <RSVPTable
            rsvps={rsvps}
            onView={setSelected}
            onEdit={setEditing}
            onDelete={handleDelete} // Pass delete callback
          />
        </div>

        {/* VIEW CARD */}
        {selected && (
          <GuestCard guest={selected} close={() => setSelected(null)} />
        )}

        {/* EDIT MODAL */}
        {editing && <EditGuestModal guest={editing} close={() => setEditing(null)} />}

        {/* PRINT ALL CARDS */}
        <PrintAllCards rsvps={rsvps} />
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #print-all-cards,
          #print-all-cards * {
            visibility: visible;
          }

          #print-all-cards {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}