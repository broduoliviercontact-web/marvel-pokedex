import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ComicPageTransition.css";

const ComicPageTransition = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // On ne lance l’anim que si la route change vraiment
    if (prevPathRef.current !== location.pathname) {
      setIsActive(true);
      prevPathRef.current = location.pathname;

      const timeout = setTimeout(() => {
        setIsActive(false);
      }, 600); // durée de l’anim (doit matcher celle du CSS)

      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  if (!isActive) return null;

  return (
    <div className="comic-transition-overlay">
      <div className="comic-transition-page">
        <div className="comic-panel panel-1" />
        <div className="comic-panel panel-2" />
        <div className="comic-panel panel-3" />
        <div className="comic-panel panel-4" />
      </div>
    </div>
  );
};

export default ComicPageTransition;
