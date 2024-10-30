// PathfindingVisualizer.jsx
import React, { useEffect,useState, useRef } from "react";
import "./Stack.css";
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


const Stack = () => {

  const [data, setData] = useState([]);
  const [comparisons, setComparisons] = useState('');
  const [swaps, setSwaps] = useState(0);
  const [delay, setDelay] = useState(100);
  const visuRef = useRef(null);
  const screenWidth = window.screen.availWidth;
  const screenHeight = 550;
  const barPadding = 5;
  const [isSorting, setIsSorting] = useState(false);
  const [useOwnData, setUseOwnData] = useState(false);
  const [userData, setUserData] = useState(''); // State to track user's input
  const [userData2, setUserData2] = useState(''); // State to track user's input
  const [isInvalid, setIsInvalid] = useState(false); // State to track if input is invalid
  const [isInvalid2, setIsInvalid2] = useState(false); // State to track if input is invalid

  const [stackaction, setstackaction] = useState('push'); // State to track user's input

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
  const handleDataSubmit2 = (e) => {
    e.preventDefault();
  };


  // Event handler for user data input
  const handleInputChange2 = (e) => {
    let input = e.target.value;

    // Check for invalid characters (anything that is not a number or comma)
    const isValid = /^[0-9,]*$/.test(input);

    if (isValid) {
      // If valid, update the state and clear any error
      setUserData2(input);
      setIsInvalid2(false);
    } else {
      // If invalid, mark the input as invalid
      setIsInvalid2(true);
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
    
    const blockHeight = 50; // Height of each block
    const verticalSpacing = 60; // Space between blocks
    const totalHeight = dataset.length * verticalSpacing; // Total height covered by the bars
    
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, screenWidth]);
  
    // Join the data with existing rect elements
    const bars = d3.select(visuRef.current)
      .selectAll("rect")
      .data(dataset)
      .join(
        enter => enter.append("rect") // For new data points
          .attr("x", screenWidth+10) // Start off-screen for animation
          .attr("y", (d, i) => screenHeight - (i + 1) * verticalSpacing) // Starting from bottom to top
          .attr("width", 100)
          .attr("height", blockHeight)
          .attr("fill", "#fff")
          .attr("stroke", "#000")
          .attr("stroke-width", 4)
          .call(enter => enter.transition() // Animation for entering elements
            .duration(1000)
            .delay((d, i) => i * 300) // Add delay for each block based on its index
            .attr("x", screenWidth / 2)), // Slide into position
        update => update.call(update => update.transition() // Animation for updating elements
          .duration(1000)
          .attr("x", screenWidth / 2)),
        exit => exit.remove() // Remove old data points
      );
  
    // Join the data with existing text elements (labels)
    const labels = d3.select(visuRef.current)
      .selectAll("text")
      .data(dataset)
      .join(
        enter => enter.append("text") // For new data points
          .attr("x", screenWidth+10) // Start off-screen for animation
          .attr("y", (d, i) => screenHeight - (i + 1) * verticalSpacing + blockHeight / 2) // Text in the middle of the block
          .attr("fill", "#000")
          .attr("font-family", "sans-serif")
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text((d) => d)
          .call(enter => enter.transition() // Animation for entering elements
            .duration(1000)
            .delay((d, i) => i * 300) // Add delay for each label based on its index
            .attr("x", screenWidth / 2 + 50)), // Slide into position
        update => update.call(update => update.transition() // Animation for updating elements
          .duration(1000)
          .attr("x", screenWidth / 2 + 50)),
        exit => exit.remove() // Remove old data points
      );
  };
  
  
  

  // Clears the D3 blocks
  const clearBlocks = () => {
    d3.select(visuRef.current).selectAll("rect").remove();
    d3.select(visuRef.current).selectAll("text").remove();
  };

  const newSet = (inputData) => {
    let newData;
    
  
    if (inputData && typeof inputData === 'string') {
      // Parse the input string and convert it into an array of numbers
      newData = inputData.split(',').map(Number).filter(n => !isNaN(n));
       // Ensure the array length is not more than 50
      if (newData.length > 9) {
        newData = newData.slice(0, 9); // Trim to max 50 elements
      }
    }
    else{
      newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 119) + 1);
    }
  
    setData(newData);
    generateBlocks(newData); // Regenerate blocks with the new data
  };

  const handleStackAction = (action) => {
    switch(action) {
      case 'push':
        setstackaction('push');
        break;
      case 'pop':
        setstackaction('pop');
        break;
      case 'peek':
        setstackaction('peek');
        break;
      default:
        break;
    }
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

  const generateNewBlock = (newData, index) => {
    const blockHeight = 50; // Height of each block
    const verticalSpacing = 60; // Space between blocks
  
    // Join the new data with a rect element
    d3.select(visuRef.current)
      .append("rect")
      .data([newData])
      .attr("x", screenWidth + 10) // Start off-screen for animation
      .attr("y", screenHeight - (index + 1) * verticalSpacing) // Position at the bottom for new element
      .attr("width", 100)
      .attr("height", blockHeight)
      .attr("fill", "#fff")
      .attr("stroke", "red")
      .attr("stroke-width", 4)
      .transition()
      .duration(1000)
      .attr("x", screenWidth / 2); // Slide into position
  
    // Add label for the new element
    d3.select(visuRef.current)
      .append("text")
      .data([newData])
      .attr("x", screenWidth + 10) // Start off-screen for animation
      .attr("y", screenHeight - (index + 1) * verticalSpacing + blockHeight / 2) // Position at the bottom
      .attr("fill", "#000")
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .text(newData)
      .transition()
      .duration(1000)
      .attr("x", screenWidth / 2 + 50); // Slide into position
  };

  const generateBlocks2 = (dataset) => {
    // Clear previous blocks before generating new ones
    clearBlocks();
  
    const totalPadding = barPadding * (dataset.length - 1); // Total padding across all bars
    const barWidth = (screenWidth - totalPadding) / dataset.length; // Adjust bar width based on available width and padding
    
    const blockHeight = 50; // Height of each block
    const verticalSpacing = 60; // Space between blocks
    const totalHeight = dataset.length * verticalSpacing; // Total height covered by the bars
    
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, screenWidth]);
  
    // Join the data with existing rect elements
    const bars = d3.select(visuRef.current)
      .selectAll("rect")
      .data(dataset)
      .join(
        enter => enter.append("rect") // For new data points
          .attr("x", screenWidth/2) // Start off-screen for animation
          .attr("y", (d, i) => screenHeight - (i + 1) * verticalSpacing) // Starting from bottom to top
          .attr("width", 100)
          .attr("height", blockHeight)
          .attr("fill", "#fff")
          .attr("stroke", "#000")
          .attr("stroke-width", 4)
      );
  
    // Join the data with existing text elements (labels)
    const labels = d3.select(visuRef.current)
      .selectAll("text")
      .data(dataset)
      .join(
        enter => enter.append("text") // For new data points
          .attr("x", screenWidth / 2 + 50) // Start off-screen for animation
          .attr("y", (d, i) => screenHeight - (i + 1) * verticalSpacing + blockHeight / 2) // Text in the middle of the block
          .attr("fill", "#000")
          .attr("font-family", "sans-serif")
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text((d) => d)
      );
  };


  const removeblck = (index1, index2) => {
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index1 + 1})`).attr("fill", "transparent");
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index2 + 1})`).attr("fill", "transparent");
    d3.select(visuRef.current)
    .select(`rect:nth-child(${index2 + 1})`).attr("stroke", "red");
    d3.select(visuRef.current)
    .selectAll("rect")
    .filter((d, i) => i === index2) // Select rect at index2
    .attr("stroke", "red") // Change stroke to red
    .transition() // Apply transition
    .duration(1000) // Animation duration
    .attr("x", screenWidth + 50) // Move out of the screen
    d3.select(visuRef.current)
    .selectAll("text")
    .filter((d, i) => i === index2) // Select rect at index2
    .transition() // Apply transition
    .duration(1000) // Animation duration
    .attr("x", screenWidth + 50) // Move out of the screen
  };
  



  
  const bubbleSort = async () => {
    setIsSorting(true);
    setComparisons('');
    let tempData = [...data];
  
    if (stackaction == "push") {
      if (data.length > 8) {
        setComparisons("Reached the limit of 9 elemetns");
      } else {
        for (let i = 0; i < data.length - 1; i++) {
          highlightBars(i, i + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 700));
  
        // Push new data
        tempData.push(userData2);
        setData(tempData);
  
        // Generate the new block specifically for the newly added item
        generateNewBlock(tempData[tempData.length - 1], tempData.length - 1); // Only update the last element
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        for (let i = 0; i < data.length; i++) {
          resetHighlight(i, i + 1);
        }

        clearBlocks();
        generateBlocks2(tempData);
      }
    } else if (stackaction == "pop") {
      
      if (data.length < 1) {
        setComparisons("cannot pop the list of 0 elements");
      } 
      else {

        for (let i = 0; i < data.length - 2; i++) {
          highlightBars(i, i + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 700));
  

        removeblck(tempData.length-2, tempData.length-1); // Only update the last element
        tempData.pop(tempData[data.length]);
        setData(tempData);  
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        for (let i = 0; i < data.length-1; i++) {
          resetHighlight(i, i + 1);
        }

        clearBlocks();
        generateBlocks2(tempData);
      }

    } else if (stackaction == "peek") {


      setComparisons(`${tempData[tempData.length - 1]} is the next item`);
      highlightBars(data.length-1, data.length);

    }
  
    setIsSorting(false);
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
      .select(`rect:nth-child(${index1 + 1})`).attr("fill", "transparent");
    d3.select(visuRef.current)
      .select(`rect:nth-child(${index2 + 1})`).attr("fill", "transparent");
    d3.select(visuRef.current)
    .select(`rect:nth-child(${index2 + 1})`).attr("stroke", "#000");
  };






  const [grid, setGrid] = useState(initialGrid());
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
        ispathfinderEnabled={false}
      />

      <section className="inner-page pt-4">


        <div className="container-fluid px-0">
         
          <div className="">


            <span className="row mx-auto px-0 w-100">
              <span className="font-weight-bold">
                {comparisons}
              </span>
            </span>

            <div className="data-container px-1 mb-0 mt-0 w-100">
            </div>

            <svg ref={visuRef}></svg>

          </div>

          <div className="row mx-auto">
            <div className="col-sm-12 col-md-12 col-lg-6 ml-0 px-0">
              <div className="ide w-100 pl-0">
                <div className="row ml-auto mr-auto">
                  <span className="comment">SHORT EXPLANATION</span>
                </div>
                <div className="row ml-auto mr-auto mt-1">
                  <span className="comment">------------------</span>
                </div>
                <div className="row ml-auto mr-auto mt-1">
                  <span className="comment">
                    1. Starting at index 0, compare the current element with the next element
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1">
                  <span className="comment">
                    - If the current element is greater than the next element, swap them
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1">
                  <span className="comment">
                    - If the current element is less than the next element, move to the next element
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1">
                  <span className="comment">
                    2. Repeat Step 1 until the list is sorted
                  </span>
                </div>
              </div>
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
                  Your data (max. 9 elements):
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


          <div className="form-group row">
            <div className="col-sm-4 col-md-5 col-lg-6">
              <select
                className="form-select"
                id="stack-actions"
                onChange={(e) => handleStackAction(e.target.value)}
                disabled={isSorting} // Disabling the select when sorting
              >
                <option value="push" selected>Push</option>
                <option value="pop">Pop</option>
                <option value="peek">Peek</option>
              </select>
            </div>
            <div className="col-sm-8 col-md-7 col-lg-6">        
              <div className="form-group row">
                <label htmlFor="data-input" className="col-sm-5 col-form-label">
                  Element:
                </label>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    id="data-input"
                    value={userData2}
                    onChange={handleInputChange2}
                    placeholder="Enter number"
                  />
                   {isInvalid2 && (
                  <div className="invalid-feedback">
                    Only number is allowed.
                  </div>
              )}
                </div>
              </div>
            </div>
          </div>

          

          <div className="row mx-auto">
            <div className="col-4">
              <button
                id="sort-button"
                type="button"
                onClick={bubbleSort}
                className="btn btn-danger red w-100"
                disabled={isSorting}
              >
                    {isSorting ? 'Working...' : stackaction} {/* Conditional button text */}
              </button>
            </div>
            <div className="col-4"></div>
          </div>



        </div>


      </section>




    </div>
  );
};

export default Stack;
