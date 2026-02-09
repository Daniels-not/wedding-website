export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        {/* Top section */}
        <div className="pt-24 pb-12 max-w-4xl mx-auto text-center">
          
          {/* Initials Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center">
              <span className="text-2xl font-serif tracking-widest">
                R<span className="mx-1">&</span>K
              </span>
            </div>
          </div>

          {/* Optional subtitle */}
          <p className="text-gray-500 mb-10 italic">
            With love, gratitude, and joy 🤍
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <a
              href="#home"
              id="home"              
              className="text-lg text-gray-500 hover:text-black transition font-medium cursor-pointer"
            >
              Home
            </a>
            <a
              href="#story"
              id="story"
              className="text-lg text-gray-500 hover:text-black transition font-medium cursor-pointer"
            >
              Our Story
            </a>
            <a
              href="#rsvp"
              id="rsvp"
              className="text-lg text-gray-500 hover:text-black transition font-medium cursor-pointer"
            >
              RSVP
            </a>
            <a
              href="#registry"
              id="registry"
              className="text-lg text-gray-500 hover:text-black transition font-medium cursor-pointer"
            >
              Registry
            </a>
            <a
              href="#information"
              id="information"
              className="text-lg text-gray-500 hover:text-black transition font-medium cursor-pointer"
            >
              More Info
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Bottom */}
      <div className="container mx-auto px-6">
        <p className="py-10 text-md text-gray-400 font-medium text-center">
          © {new Date().getFullYear()} R & K Wedding. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
