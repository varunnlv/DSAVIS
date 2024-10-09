// PathfindingVisualizer.jsx
import React, { useState, useRef , useEffect } from "react";
import "./PathfindingVisualizer.css";
import { executeAlgorithm } from "../algorithms";
import Node from "./Node";
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
import AlgorithmStats from "./algorithmStats";
import Description from "./Description";


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


const PathfindingVisualizer = () => {

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

  const [numRows, setNumRows] = useState(30);
  const [numCols, setNumCols] = useState(60);

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
  const [isWeightedGraph, setIsWeightedGraph] = useState(false);

  const [runtime, setRuntime] = useState(0);
  const [pathCost, setPathCost] = useState(0);

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

  const startchekinggrid = (rows,columns) => {

    // setColsd(parseFloat((parseFloat(columns) / 60).toFixed(2)));
    // setRowsd(((parseFloat(rows))/30).toFixed(2));
    // setweight(Colsd * Rowsd);

    if(columns < 50){
      columns = 50;  
    }
    if(rows < 30){
      rows = 30;
    }


    if(columns > 120 ){
      columns = 120;  
    }

    if(rows > 70){
      rows = 70;
    }

    setGrid(initialGrid2(rows, columns));
  };

  const startVisualization = () => {
    const startNode = findStartNode(grid);
    const finishNode = findFinishNode(grid);
    const algorithmFunc = selectedAlgorithm.func;

    if (!algorithmFunc) {
      console.error(`Algorithm function not found.`);
      return;
    }

    const startTime = performance.now(); // Start timing
    const result = executeAlgorithm(algorithmFunc, grid, startNode, finishNode);
    const endTime = performance.now(); // End timing

    if (
      !result ||
      !result.visitedNodesInOrder ||
      !result.nodesInShortestPathOrder
    ) {
      console.error("Algorithm did not return expected result.");
      return; // Exit to avoid calling visualize with undefined values
    }

    const runtime = endTime - startTime;
    const pathCost = result.nodesInShortestPathOrder.reduce(
      (acc, node) => acc + node.weight,
      0
    );

    setRuntime(runtime);
    setPathCost(pathCost);

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
        ispathfinderEnabled={true}
      />

      {shouldShowModal && (
          <div className="modal">
            <Description />
          </div>
      )}

          <div className="dashboard">
        <AlgorithmStats runtime={runtime} pathCost={pathCost} />
        {/* <WeightLegend /> */}

        <div className="grid-settings">
          <div className="algorithm-stats">
            <div className="stat-item">
              {/* Optional: Icon for runtime */}
              <div className="stat-label">Distance ⟷ (Km)</div>
              <div className="stat-value">
              <input 
                  type="number" 
                  value={numCols} 
                  onChange={(e) => setNumCols(Number(e.target.value))} 
                  min={1}
                />
              </div>
            </div>
            <div className="stat-item">
              {/* Optional: Icon for path cost */}
              <div className="stat-label">Distance ↕ (Km)</div>
              <div className="stat-value">
                <input 
                  type="number" 
                  value={numRows} 
                  onChange={(e) => setNumRows(Number(e.target.value))} 
                  min={1}
                />
              </div>
            </div>
            <button onClick={() => startchekinggrid(numRows, numCols)}>
            Generate Grid
            </button>       
          </div>     
        </div>

          </div>
  
          <div className="grid-wrapper">
            {" "}
            {/* New wrapper for the grid */}
            <div className="grid">
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} className="row">
                  {row.map((node, nodeIdx) => (
                    <Node
                      key={nodeIdx}
                      col={node.col}
                      row={node.row}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      isWall={node.isWall}
                      isVisualized={node.isVisualized}
                      isPath={node.isPath}
                      distance={node.distance}
                      weight={node.weight}
                      // onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
                      onMouseDown={(event) =>
                        handleMouseDown(event, rowIdx, nodeIdx)
                      }
                      onMouseEnter={(event) => handleMouseEnter(rowIdx, nodeIdx)}
                      onMouseUp={handleMouseUp}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

    </div>
  );
};

export default PathfindingVisualizer;
