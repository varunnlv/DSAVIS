import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import Description from "./components/Description";
import Home from "./components/Home";
import Sorting from "./components/Sorting";
import BubbleSort from "./components/BubbleSort";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to update the window width state
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shouldShowModal = windowWidth > 768 && isModalOpen;

  return (
    <Router>
      <div className="App">
        {/* Define the routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pathfinder" element={<PathfindingVisualizer />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/bubblesort" element={<BubbleSort />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
