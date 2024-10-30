import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import Description from "./components/Description";
import Home from "./components/Home";
import Sorting from "./components/Sorting";
import BubbleSort from "./components/BubbleSort";
import CocktailSort from "./components/CocktailSort";
import CombSort from "./components/CombSort";
import GnomeSort from "./components/GnomeSort";
import QuickSort from "./components/QuickSort";
import InsrtionSort from "./components/InsrtionSort";
import SelectionSort from "./components/SelectionSort";
import Datastructures from "./components/datastructures";
import Stack from "./components/Stack";
import Searching from "./components/Searching";


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
          <Route path="/searching" element={<Searching />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/bubblesort" element={<BubbleSort />} />
          <Route path="/cocktailsort" element={<CocktailSort />} />
          <Route path="/combsort" element={<CombSort />} />
          <Route path="/gnomesort" element={<GnomeSort />} />
          <Route path="/quicksort" element={<QuickSort />} />
          <Route path="/insertionsort" element={<InsrtionSort />} />
          <Route path="/selectionsort" element={<SelectionSort />} />
          <Route path="/datastructures" element={<Datastructures/>}/>
          <Route path="/stack" element={<Stack/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
