import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadPDFButton({ rsvps }) {
  function download() {
    const doc = new jsPDF();

    const rows = rsvps.map((r) => [
      r.fullName,
      r.guests,
      r.family,
      r.email,
      r.phone,
      r.coming,
      r.guestNames || "",
      r.dietary || "",
    ]);

    autoTable(doc, {
      head: [
        [
          "Name",
          "Guests",
          "Family",
          "Email",
          "Phone",
          "Status",
          "Guest Names",
          "Dietary",
        ],
      ],
      body: rows,
      styles: {
        fontSize: 8, // smaller font for better mobile PDF readability
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo header color
        textColor: 255,
        fontStyle: "bold",
      },
      margin: { top: 20 },
    });

    doc.save("Wedding-Guest-List.pdf");
  }

  return (
    <button
      onClick={download}
      className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-indigo-700 text-sm sm:text-base w-full sm:w-auto"
    >
      Download Guest List PDF
    </button>
  );
}