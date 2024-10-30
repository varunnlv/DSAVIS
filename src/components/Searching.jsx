// PathfindingVisualizer.jsx
import React, { useState, useRef , useEffect } from "react";
import "./Searching.css";
import { executeAlgorithm } from "../algorithms";
import Toolbar from "../utils/ToolBar";
import { useGridHandler } from "../hooks/useGridHandler";
import { useVisualization } from "../hooks/useVisualization";
import { useMazeGenerator } from "../hooks/useMazeGenerator";
import { initialGrid, findStartNode, findFinishNode, initialGrid2 } from "../utils/GridUtils";
import { dijkstra } from "../algorithms/dijkstra";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";
import { astar } from "../algorithms/astar";
import { gbfs } from "../algorithms/gbfs";
import { bidirectional } from "../algorithms/bidirectional";



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


const Card = ({ title, subtitle, text, link, timeComplexity }) => {
  // Split the time complexity string into an array
  const timeComplexityItems = timeComplexity ? timeComplexity.split(',') : [];

  return (
    <div className="algorithm1 card">
      <a href={link} className="unstyled-link">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            {text}
          </p>
        </div>
      </a>
    </div>
  );
};


const Searching = () => {

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

  const [grid, setGrid] = useState(initialGrid());
  const { handleMouseDown, handleMouseEnter, handleMouseUp } = useGridHandler(
    grid,
    setGrid
  );
  const { visualize, clearBoard, resetForVisualization, resetForMaze } =
    useVisualization(grid, setGrid);

  const {
    randomizeBoard,
    generateWeightedMaze,
    generateRecursiveDivisionMaze,
  } = useMazeGenerator(grid, setGrid);


  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]); // Default to Dijkstra object

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
        // isWeightedGraph={isWeightedGraph}
        ispathfinderEnabled={false}
      />

      {/* {shouldShowModal && (
          // <div className="modal">
          //   <Description />
          // </div>
      )} */}


      <section className="inner-page">

        <section id="comparison-sorts" className="pt-0">
          <div className="container-fluid w-90">
            <div className="card-deck cd-hide">
              <Card 
                title="Grid based path finder" 
                subtitle="Comparison sort"
                text=""
                link="/pathfinder" 
                timeComplexity=""
              />
              <Card 
                 title="Real world path finder" 
                 subtitle="Comparison sort"
                 text=""
                 link="https://searchalgorithonrealmap1.vercel.app/" 
                 timeComplexity=""
              />
        
            </div>
          </div>
        </section>

      </section>

    </div>
  );
};

export default Searching
