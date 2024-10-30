// PathfindingVisualizer.jsx
import React, { useState, useRef , useEffect } from "react";
import "./datastructures.css";
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
            {timeComplexity && (
              <>
                <br /><br />
                  <div>
                    <i>{timeComplexity}</i> {/* Trim to remove leading/trailing whitespace */}
                  </div>
              </>
            )}
          </p>
        </div>
      </a>
    </div>
  );
};


const Datastructures = () => {

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

      <section className="inner-page">

        <section id="comparison-sorts" className="pt-0">
          <div className="container-fluid w-90">
            <div className="w-100 p-2 row mt-3 mb-3 cd-hide">
              <div className="col-sm-1 col-md-1 col-lg-3"></div>
              <div className="explanation col-sm-10 col-md-10 col-lg-6">
                Data Structures
              </div>
              <div className="col-sm-1 col-md-1 col-lg-3"></div>
            </div>
            <div className="card-deck cd-hide">
              <Card 
                title="Stack" 
                subtitle="Comparison sort"
                text="A stack is an abstract data type that serves as a
                      collection of elements, with two main principal
                      operations: push, which adds an element to the collection, and pop, which removes the most recently added element"
                link="/stack" 
                timeComplexity="The order in which elements come off a stack gives rise to
                      its alternative name, LIFO (last in, first out)."
              />
              <Card 
                title="Linked List" 
                subtitle="Comparison sort"
                text="A linked list is a linear collection of data elements
                      whose order is not given by their physical placement in
                      memory. Instead, each element points to the next. It is a
                      data structure consisting of a collection of nodes which
                      together represent a sequence.This structure allows
                      for efficient insertion or removal of elements from any
                      position in the sequence during iteration."
                link="/linkedlist"
                timeComplexity=""
              />
              <Card 
                title="Doubly Linked List" 
                subtitle="Comparison sort"
                text=" A doubly linked list is a linked data structure that
                      consists of a set of sequentially linked records called
                      nodes. Each node contains three fields: two link fields
                      (references to the previous and to the next node in the
                      sequence of nodes) and one data field.The two node
                      links allow traversal of the list in either direction."
                link="/doublylinkedlist" 
                timeComplexity=""
              />
              <Card 
                title="Hashtable" 
                subtitle="Comparison sort"
                text=" A hash table is a data structure that implements an
                      associative array abstract data type, a structure that can
                      map keys to values. A hash table uses a hash function to
                      compute an index, also called a hash code, into an array
                      of buckets or slots, from which the desired value can be
                      found. During lookup, the key is hashed and the resulting
                      hash indicates where the corresponding value is stored."
                link="/hashtable" 
                timeComplexity=""
              />
              


            </div>
          </div>
        </section>
      </section>

    </div>
  );
};

export default Datastructures;
