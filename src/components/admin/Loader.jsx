export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-slate-100">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 sm:w-16 sm:h-16"></div>

        {/* Loading message */}
        <p className="text-gray-700 text-lg sm:text-xl font-medium">{message}</p>
      </div>
    </div>
  );
}