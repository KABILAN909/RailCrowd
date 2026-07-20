import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchBox />
      <Features />
      <Stats />
      <Footer />
    </>
  );
}

export default Home;