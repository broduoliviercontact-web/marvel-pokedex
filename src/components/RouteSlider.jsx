import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./RouteSlider.css";

const getIndexFromPath = (pathname) => {
  if (pathname.startsWith("/characters")) return 1;
  if (pathname.startsWith("/comics")) return 2;
  return 0; // Home
};

const RouteSlider = () => {
  const location = useLocation();
  const index = getIndexFromPath(location.pathname); // 0, 1, 2

  // On garde l'index précédent pour savoir si on va "en avant" ou "en arrière"
  const prevIndexRef = useRef(index);

  let direction = "none"; // "forward" | "backward" | "none"
  const prevIndex = prevIndexRef.current;

  if (index > prevIndex) direction = "forward";
  else if (index < prevIndex) direction = "backward";

  useEffect(() => {
    prevIndexRef.current = index;
  }, [index]);

  const offsetVw = -index * 100; // 0, -100, -200

  const dest =
    index === 0 ? "home" : index === 1 ? "characters" : "comics";

  const outerClassName = [
    "route-slider-outer",
    `route-slider-outer--${direction}`,
    `route-slider-outer--to-${dest}`,
  ].join(" ");

  return (
    <div className="route-slider">
      <div className={outerClassName}>
        <div
          className="route-slider-inner"
          style={{
            transform: `translate3d(${offsetVw}vw, 0, 0)`,
          }}
        >
          {/* Ordre : Home (0) → Characters (1) → Comics (2) */}
          <section className="route-panel route-panel-home" />
          <section className="route-panel route-panel-characters" />
          <section className="route-panel route-panel-comics" />
        </div>
      </div>
    </div>
  );
};

export default RouteSlider;
