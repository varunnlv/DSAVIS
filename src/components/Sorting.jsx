// PathfindingVisualizer.jsx
import React, { useState, useRef , useEffect } from "react";
import "./Sorting.css";
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
                <b>Time complexity:</b>
                {timeComplexityItems.map((item, index) => (
                  <div key={index}>
                    <i>{item.trim()}</i> {/* Trim to remove leading/trailing whitespace */}
                  </div>
                ))}
              </>
            )}
          </p>
        </div>
      </a>
    </div>
  );
};


const Sorting = () => {

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
            <div className="w-100 p-2 row mt-3 mb-3 cd-hide">
              <div className="col-sm-1 col-md-1 col-lg-3"></div>
              <div className="explanation col-sm-10 col-md-10 col-lg-6">
                Comparison sort is a type of sorting algorithm that only reads
                the list elements through a single abstract comparison operation.
              </div>
              <div className="col-sm-1 col-md-1 col-lg-3"></div>
            </div>
            <div className="card-deck cd-hide">
              <Card 
                title="Bubblesort" 
                subtitle="Comparison sort"
                text="Bubblesort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
                link="/bubblesort" 
                timeComplexity="Best-case: O(n), Average-case: O(n²), Worst-case: O(n²)"
              />
              <Card 
                title="Cocktail shaker sort" 
                subtitle="Comparison sort"
                text="Cocktail shaker sort is an extension of bubble sort that operates in two directions."
                link="/cocktailsort"
                timeComplexity="Best-case: O(n), Average-case: O(n²), Worst-case: O(n²)"
              />
              <Card 
                title="Combsort" 
                subtitle="Comparison sort"
                text="Combsort is an extension of bubble sort that compares elements divided by a shrinking gap."
                link="/combsort" 
                timeComplexity="Best-case: O(n log n), Average-case: O(n²), Worst-case: O(n²)"
              />
              <Card 
                title="Gnomesort" 
                subtitle="Comparison sort"
                text="The gnome sort is a sorting algorithm that gets the item to the proper place by a series of swaps."
                link="/gnomesort" 
                timeComplexity="Best-case: O(n), Average-case: O(n²), Worst-case: O(n²)"
              />
              <Card 
                title="Insertionsort" 
                subtitle="Comparison sort"
                text="Insertion sort builds the final sorted list one item at a time."
                link="/insertionsort" 
                timeComplexity="Best-case: O(n), Average-case: O(n²), Worst-case: O(n²)"
              />
              <Card 
                title="Quicksort" 
                subtitle="Comparison sort"
                text="Quicksort is a divide-and-conquer algorithm that selects a pivot element and partitions the other elements."
                link="/quicksort" 
                timeComplexity="Best-case: O(n log n), Average-case: O(n log n), Worst-case: O(n²)"
              />
              <Card 
                title="Selection sort" 
                subtitle="Comparison sort"
                text="Selection sort divides the input list into a sorted sublist and an unsorted sublist."
                link="/selectionsort" 
                timeComplexity="Best-case: O(n), Average-case: O(n²), Worst-case: O(n²)"
              />


            </div>
          </div>
        </section>

        {/* <section id="non-comparison-sorts" className="pt-0">
          <div className="container-fluid w-100">
            <div className="w-50 p-2 rounded explanation row ml-auto mr-auto mt-2 mb-3 cd-hide">
              <div className="col-sm-12">
                Non-Comparison Sorts are sorting algorithms that sort a given input without comparing the elements.
              </div>
            </div>
            <div className="card-deck mb-4 cd-hide">
              <Card 
                title="Counting sort" 
                subtitle="Non-Comparison sort"
                text="Counting sort is an algorithm for sorting a collection of objects according to keys that are small integers."
                link="countingsort.html"
                timeComplexity="O(n+k)"
              />
              <Card 
                title="Radix sort" 
                subtitle="Non-Comparison sort"
                text="Radix sort avoids comparison by creating and distributing elements into buckets according to their radix."
                link="radixsort.html" 
                timeComplexity="O(nw)"
              />
            </div>
          </div>
        </section> */}

        {/* <section id="other-sorts" className="pt-0">
          <div className="container-fluid w-100">
            <div className="w-50 p-2 rounded explanation row ml-auto mr-auto mt-2 mb-3 cd-hide">
              <div className="col-sm-12">
                Algorithms in this category are impractical for real-life use due to poor performance.
              </div>
            </div>
            <div className="card-deck mb-4 cd-hide mx-auto">
              <Card 
                title="Bogosort" 
                subtitle="Other sort"
                text="Bogosort is a highly inefficient sorting algorithm based on the generate and test paradigm."
                link="bogosort.html" 
                timeComplexity="Best-case: O(n), Average-case: O((n+1)!), Worst-case: unbounded"
              />
            </div>
          </div>
        </section> */}














      </section>

    </div>
  );
};

export default Sorting;
