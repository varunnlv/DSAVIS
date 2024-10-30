// PathfindingVisualizer.jsx
import React, { useEffect,useState, useRef } from "react";
import "./GnomeSort.css";
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
import * as d3 from "d3";
import Slider from "react-slider"; // Assuming react-slider for Slider components


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


const GnomeSort = () => {

  const [data, setData] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [delay, setDelay] = useState(100);
  const visuRef = useRef(null);
  const screenWidth = window.screen.availWidth;
  const screenHeight = 370;
  const barPadding = 5;
  const [isSorting, setIsSorting] = useState(false);
  const [useOwnData, setUseOwnData] = useState(false);
  const [userData, setUserData] = useState(''); // State to track user's input
  const [isInvalid, setIsInvalid] = useState(false); // State to track if input is invalid


  const handleCheckboxChange = () => {
    setUseOwnData(!useOwnData);
  };
  
  // Event handler for user data input
  const handleInputChange = (e) => {
    let input = e.target.value;

    // Check for invalid characters (anything that is not a number or comma)
    const isValid = /^[0-9,]*$/.test(input);

    if (isValid) {
      // If valid, update the state and clear any error
      setUserData(input);
      setIsInvalid(false);
    } else {
      // If invalid, mark the input as invalid
      setIsInvalid(true);
    }

  };
  
  // Function to submit user's data
  const handleDataSubmit = (e) => {
    e.preventDefault();
    newSet(userData); // Call the newSet function with user's data
  };


  const generateBlocks = (dataset) => {
    // Clear previous blocks before generating new ones
    clearBlocks();

    const totalPadding = barPadding * (dataset.length - 1); // Total padding across all bars
    const barWidth = (screenWidth - totalPadding) / dataset.length; // Adjust bar width based on available width and padding

    const xScale = d3.scaleLinear()
      .domain([0, dataset.length])
      .range([0, screenWidth]);

    // Join the data with existing rect elements
    const bars = d3.select(visuRef.current)
      .selectAll("rect")
      .data(dataset)
      .join(
        enter => enter.append("rect"), // For new data points
        update => update, // For existing data points
        exit => exit.remove() // Remove old data points
      )
      .attr("transform", (d, i) => `translate(${xScale(i)},0)`)
      .attr("y", (d) => screenHeight - d * 3)
      .attr("width", barWidth) // Dynamically calculated width
      .attr("height", (d) => d * 3)
      .attr("fill", "#CC1616");

    // Join the data with existing text elements (labels)
    const labels = d3.select(visuRef.current)
      .selectAll("text")
      .data(dataset)
      .join(
        enter => enter.append("text"), // For new data points
        update => update, // For existing data points
        exit => exit.remove() // Remove old data points
      )
      .text((d) => d)
      .attr("x", (d, i) => xScale(i) + barWidth / 2) // Center the label
      .attr("y", (d) => screenHeight - d * 3 - 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  };

  // Clears the D3 blocks
  const clearBlocks = () => {
    d3.select(visuRef.current).selectAll("rect").remove();
    d3.select(visuRef.current).selectAll("text").remove();
  };

  const newSet1 = (num = 20) => {
    const newData = Array.from({ length: num }, () => Math.floor(Math.random() * 119) + 1);
    setData(newData);
    generateBlocks(newData); // Regenerate blocks based on new data
  };


  const newSet = (inputData) => {
    let newData;
  
    if (inputData && typeof inputData === 'string') {
      // Parse the input string and convert it into an array of numbers
      newData = inputData.split(',').map(Number).filter(n => !isNaN(n));
    } else {
      // Generate random data if no input is provided
      newData = Array.from({ length: 20 }, () => Math.floor(Math.random() * 119) + 1);
    }
  
    // Ensure the array length is not more than 50
    if (newData.length > 50) {
      newData = newData.slice(0, 50); // Trim to max 50 elements
    }
  
    setData(newData);
    generateBlocks(newData); // Regenerate blocks with the new data
  };
  

  // React useEffect to handle initial rendering
  useEffect(() => {
    d3.select(visuRef.current)
      .attr("width", "100%")
      .attr("height", screenHeight)
      .attr("viewBox", `0 0 ${screenWidth} ${screenHeight}`);

    // Initial setup for blocks
    newSet(15);

    // Cleanup function on unmount
    return () => {
      clearBlocks();
    };
  }, []);

 

  const highlightLine = async (lineId) => {
    const line = document.getElementById(lineId);
    line.style.backgroundColor = "#f0e68c"; // Highlight color
  
    // Wait for a short delay before resetting the background
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    line.style.backgroundColor = ""; // Reset color
  };
  
  const bubbleSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
  
    await highlightLine("line-1");
    
    let pos = 0; // Initialize position
    let tempData = [...data];
  
    await highlightLine("line-2"); 
    while (pos < tempData.length) {
      await highlightLine("line-3"); 
  
      // Highlight the current position and the previous one
      if (pos > 0) {
        highlightBars(pos, pos - 1); // Highlight the current and previous elements
      }
  
      // Check if we are at the start or the current element is greater than or equal to the previous
      if (pos === 0 || tempData[pos] >= tempData[pos - 1]) {
        await highlightLine("line-4"); 
        pos++; // Move to the next position
      } else {
        await highlightLine("line-5"); 
        // Swap the elements if they are in the wrong order
        let temp = tempData[pos];
        tempData[pos] = tempData[pos - 1];
        tempData[pos - 1] = temp;
  
        // Handle animations and state updates
        await animateSwap(tempData[pos], tempData[pos - 1], tempData);
        setSwaps((prev) => prev + 1);
        clearBlocks();
        setData(tempData);
        generateBlocks(tempData);
  
        await highlightLine("line-6"); 
        pos--; // Move back to the previous position
      }
  
      // Reset highlight for the current bars after processing
      resetHighlight(pos, pos - 1);
      await highlightLine("line-7"); 
    }
    setData(tempData);
    generateBlocks(tempData);
    setIsSorting(false);
  };


  
  const animateSwap = async (value1, value2, currentData) => {
    const index1 = currentData.indexOf(value1);
    const index2 = currentData.indexOf(value2);

    console.log("indexes",index1,index2);

    // If either index is -1, it means that the value was not found (this shouldn't happen).
    if (index1 === -1 || index2 === -1) {
      console.error("One of the elements not found in the current data:", value1, value2);
      return;
    }

    const barWidth = screenWidth / currentData.length - barPadding;
    const xScale = d3.scaleLinear().domain([0, currentData.length]).range([0, screenWidth]);

    // Calculate new positions based on the updated data
    const pos1 = xScale(index1);
    const pos2 = xScale(index2);
    console.log("positions",pos1,pos2);

    // Animate moving the rectangles and text labels
    await new Promise((resolve) => {
      const rects = d3.select(visuRef.current).selectAll("rect");
      const texts = d3.select(visuRef.current).selectAll("text");

      console.log("rects",rects);

      // Animate the first rectangle to the second position
      rects.filter((d, i) => i === index1)
        .transition()
        .duration(200)
        .attr("transform", `translate(${pos2},0)`)
        .on("end", () => {
          // Animate the second rectangle to the first position
          rects.filter((d, i) => i === index2)
            .transition()
            .duration(200)
            .attr("transform", `translate(${pos1},0)`)
            .on("end", resolve);
        });

      // Animate the text for the first index
      texts.filter((d, i) => i === index1)
        .transition()
        .duration(200) // Adjust duration as needed
        .attr("x", pos2 + barWidth / 2)
        .on("end", () => {
          // Animate the second label to the first position
          texts.filter((d, i) => i === index2)
            .transition()
            .duration(200)
            .attr("x", pos1 + barWidth / 2)
            .on("end", resolve);
        });
    });
  };


  // Function to highlight bars during comparison
  const highlightBars = (index1, index2) => {
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index1 + 1})`).attr("fill", "#9DBDC6");
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index2 + 1})`).attr("fill", "#9DBDC6");
  };

  // Function to reset the highlight of bars
  const resetHighlight = (index1, index2) => {
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index1 + 1})`).attr("fill", "#CC1616");
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index2 + 1})`).attr("fill", "#CC1616");
  };


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
        ispathfinderEnabled={false}
      />


      <section className="inner-page pt-4">


        <div className="container-fluid px-0">
          <div className="">


            <span className="row mx-auto px-0 w-100">
              <span className="font-weight-bold">
                No. of comparisons: {comparisons} 
              </span>
              <span className="font-weight-bold">
                No. of swaps: {swaps}
              </span>
            </span>

            <div className="data-container px-1 mb-0 mt-0 w-100">
            </div>

            <svg ref={visuRef}></svg>
         
          </div>


          


          <div className="row mx-auto">
            <div className="col-sm-12 col-md-12 col-lg-6 px-0 mr-0">
              <div className="ide w-100">
                <div className="row ml-auto mr-auto" id="line-1">
                  <span>pos = 0</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-2">
                  <span><span className="op">while</span>(pos &lt; length(list))</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-3">
                  <span>&emsp;&emsp;<span className="op">if</span>(pos == 0 || list[pos] &gt;= list[pos-1])</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-4">
                  <span>&emsp;&emsp;&emsp;&emsp;pos++</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-5">
                  <span>&emsp;&emsp;<span className="op">else</span></span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-6">
                  <span>&emsp;&emsp;&emsp;&emsp;<span className="op">swap</span>(list[pos], list[pos-1])</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-7">
                  <span>&emsp;&emsp;&emsp;&emsp;pos--</span>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 ml-0 px-0">
              <div className="ide w-100 pl-0">
                <div className="row ml-auto mr-auto" id="line-8">
                  <span className="comment">SHORT EXPLANATION</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-9">
                  <span className="comment">------------------</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-10">
                  <span className="comment">1. Starting at index 1, compare the current element with the previous element</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-11">
                  <span className="comment">a. If the current element is greater than the previous element, move to the next element</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-12">
                  <span className="comment">b. If the current element is less than the previous element, swap them and keep moving</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-13">
                  <span className="comment">&emsp;&emsp;&emsp;that element back until it can't be moved back any further.</span>
                </div>
                <div className="row ml-auto mr-auto mt-1" id="line-14">
                  <span className="comment">2. Repeat Step 1 until the list is sorted</span>
                </div>
              </div>
            </div>
          </div>







          <div className="scrollers"> {/* Aligns content to the left */}
            <div className="scrollers1">
              <label>Elements: {data.length}</label>
              
                  <Slider
                  min={5}
                  max={50}
                  step={1}
                  value={data.length}
                  onChange={(value) => newSet1(value)}
                  handle={({ value }) => <div>{value}</div>} // Optional custom handle
                />
            </div>

            <div className="scrollers1">
              <label>Speed: {delay} ms</label>
              <Slider
                min={1}
                max={1000}
                step={10}
                value={delay}
                onChange={(value) => setDelay(value)}
                handle={({ value }) => <div>{value}</div>} // Optional custom handle
              />
            </div>
          </div>


          <div className="row mx-auto">
            <div className="col-sm-12 col-md-12 col-lg-6">
              <form>
                <div className="form-group row">
                  <div className="col-sm-3">Data Generation</div>
                  <div className="col-sm-9">
                    <div className="form-check">
                      <input
                        id="own-data"
                        className="form-check-input"
                        type="checkbox"
                        checked={useOwnData}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="own-data">
                        Use own data
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <form onSubmit={handleDataSubmit}>
              <div className="form-group row">
                <label htmlFor="data-input" className="col-sm-5 col-form-label">
                  Your data (max. 50 elements):
                </label>
                <div className="col-sm-7">
                  <input
                    disabled={!useOwnData}
                    type="text"
                    className="form-control"
                    id="data-input"
                    value={userData}
                    onChange={handleInputChange}
                    placeholder="10,42,34,55,..."
                  />
                   {isInvalid && (
                  <div className="invalid-feedback">
                    Only numbers and commas are allowed.
                  </div>
              )}
                </div>
              </div>
              {useOwnData && (
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              )}
              </form>
            </div>
          </div>

          <div className="row mx-auto">
            <div className="col-4"></div>
            <div className="col-4">
              <button
                id="sort-button"
                type="button"
                onClick={bubbleSort}
                className="btn btn-danger red w-100"
                disabled={isSorting}
              >
                    {isSorting ? 'Sorting...' : 'Sort'} {/* Conditional button text */}
              </button>
            </div>
            <div className="col-4"></div>
          </div>



        </div>
      </section>




    </div>
  );
};

export default GnomeSort;
