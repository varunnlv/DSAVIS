// PathfindingVisualizer.jsx
import React, { useState, useRef } from "react";
import "./Home.css";
import { executeAlgorithm } from "../algorithms";
import Toolbar from "../utils/ToolBar";
import { useVisualization } from "../hooks/useVisualization";
import { useMazeGenerator } from "../hooks/useMazeGenerator";
import { initialGrid, findStartNode, findFinishNode, initialGrid2 } from "../utils/GridUtils";
import { dijkstra } from "../algorithms/dijkstra";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";
import { astar } from "../algorithms/astar";
import { gbfs } from "../algorithms/gbfs";
import { bidirectional } from "../algorithms/bidirectional";
import { useNavigate } from "react-router-dom";


const algorithms = [
  { label: "Dijkstra", actionKey: "dijkstra", func: dijkstra },
  { label: "A*", actionKey: "astar", func: astar },
  { label: "Greedy Best First Search", actionKey: "gbfs", func: gbfs },
  {
    label: "Bidirectional Search",
    actionKey: "bidirectional",
    func: bidirectional,
  },
  { label: "Breadth First Search", actionKey: "bfs", func: bfs },
  { label: "Depth First Search", actionKey: "dfs", func: dfs },
];

const mazeOptions = [
  { label: "Randomize Board", actionKey: "randomizeBoard" },
  {
    label: "Recursive Division Maze",
    actionKey: "generateRecursiveDivisionMaze",
  },
];


const Home = () => {

  const [grid, setGrid] = useState(initialGrid());
  const { visualize, clearBoard, resetForVisualization, resetForMaze } =
    useVisualization(grid, setGrid);

  const {
    randomizeBoard,
    generateWeightedMaze,
    generateRecursiveDivisionMaze,
  } = useMazeGenerator(grid, setGrid);

  const [ispathfinderEnabled, setpathfinderEnabled] = useState(false);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]); // Default to Dijkstra object

  const navigate = useNavigate();
  
  // Ref to access the dashboard div
  const dashboardRef = useRef(null);

  // Function to show the dashboard and scroll to it on button click
  const handleGetStartedClick = (e) => {
    e.preventDefault();
    setpathfinderEnabled(true);
    navigate("/pathfinder");

    setTimeout(() => {
      if (dashboardRef.current) {
        dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 3000); // Delay to ensure the div is rendered before scrolling
  };

  
  const handleToolbarAction = (actionKey) => {
    switch (actionKey) {
      case "clearBoard":
        clearBoard();
        break;
      case "clearPath":
        resetForVisualization();
        break;
      case "randomizeBoard":
        resetForMaze();
        randomizeBoard(); // Assuming this generates a random maze
        break;
      case "generateRecursiveDivisionMaze":
        resetForMaze();
        generateRecursiveDivisionMaze();
        break;
      case "generateWeightedMaze":
        resetForMaze();
        generateWeightedMaze();
        break;
      case "visualize":
        resetForVisualization();
        startVisualization(selectedAlgorithm.actionKey);
        break;
      default:
        if (actionKey.startsWith("algo-")) {
          const algorithmKey = actionKey.replace("algo-", "");
          const selected = algorithms.find(
            (algo) => algo.actionKey === algorithmKey
          );
          if (selected) {
            setSelectedAlgorithm(selected);
          }
        }
        break;
    }
  };

  const startVisualization = () => {
    const startNode = findStartNode(grid);
    const finishNode = findFinishNode(grid);
    const algorithmFunc = selectedAlgorithm.func;

    if (!algorithmFunc) {
      console.error(`Algorithm function not found.`);
      return;
    }

    const result = executeAlgorithm(algorithmFunc, grid, startNode, finishNode);


    if (
      !result ||
      !result.visitedNodesInOrder ||
      !result.nodesInShortestPathOrder
    ) {
      console.error("Algorithm did not return expected result.");
      return; // Exit to avoid calling visualize with undefined values
    }

    visualize(result.visitedNodesInOrder, result.nodesInShortestPathOrder);
  };

  return (
    <div className="main">

      <Toolbar
        onAction={handleToolbarAction}
        selectedAlgorithm={selectedAlgorithm.label}
        algorithmItems={algorithms.map((algo) => ({
          label: algo.label,
          actionKey: `algo-${algo.actionKey}`,
        }))}
        mazeItems={mazeOptions} // Pass the maze options here
        ispathfinderEnabled={ispathfinderEnabled}
      />


    <section id="hero" className="d-flex align-items-center">
    <div
        className="container position-relative"
        data-aos="fade-up"
        data-aos-delay="500"
    >
        <h1>Welcome to DSA VISUALIZER</h1>
        <h2>Your online algorithm visualization tool.</h2>
        <a
            href="/pathfinder"
            className="btn-get-started scrollto"
            onClick={handleGetStartedClick}
        >
            Get Started
        </a>
    </div>
</section>

    </div>
  );
};

export default Home;
