export default function AdminStats({ rsvps }) {
  const yes = rsvps.filter((r) => r.coming === "Yes");
  const no = rsvps.filter((r) => r.coming === "No");

  const totalYes = yes.reduce((sum, r) => sum + Number(r.guests || 1), 0);
  // const totalNo = no.reduce((sum, r) => sum + Number(r.guests || 1), 0);

  const familyCount = rsvps.filter((r) => r.family === "Yes").length;

  const Card = ({ title, value, color }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
      <p className="text-gray-500 text-sm sm:text-base">{title}</p>
      <h2 className={`text-2xl sm:text-3xl font-semibold mt-1 sm:mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card title="RSVP Yes" value={yes.length} color="text-green-600" />
      <Card title="RSVP No" value={no.length} color="text-red-500" />
      <Card title="Guests Attending" value={totalYes} color="text-green-700" />
      <Card title="Family RSVPs" value={familyCount} color="text-purple-600" />
    </div>
  );
}