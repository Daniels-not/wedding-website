import { useState } from "react";
import Hero from "../components/Hero";
import OurStory from "../components/OurStory";
import Registry from "../components/Registry";
import RSVP from "../components/RCVP";
import MoreInfo from "../components/MoreInfo";
import Footer from "../components/Footer";

export default function Home() {
  const [dark, setDark] = useState(true);

  return (
    <main className="overflow-hidden">
      <Hero dark={dark} setDark={setDark} />
      <OurStory dark={dark} />
      <RSVP />
      <Registry />
      <MoreInfo />
      <Footer />
    </main>
  );
}
