import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Comics from "./pages/Comics";
import Characters from "./pages/Characters";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import RouteSlider from "./components/RouteSlider";
import "./styles/pokemon-cards.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteSlider />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/comics" element={<Comics />} />
      </Routes>
    </Router>
  );
}

export default App;
