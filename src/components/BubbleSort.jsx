// PathfindingVisualizer.jsx
import React, { useEffect,useState, useRef } from "react";
import "./BubbleSort.css";
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


const BubbleSort = () => {

  const [data, setData] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [delay, setDelay] = useState(100);
  const visuRef = useRef(null);
  const screenWidth = window.screen.availWidth;
  const screenHeight = 370;
  const barPadding = 5;
  const [isSorting, setIsSorting] = useState(false);


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

  // Function to create a new data set and trigger redraw
  const newSet = (num = 20) => {
    const newData = Array.from({ length: num }, () => Math.floor(Math.random() * 119) + 1);
    setData(newData);
    generateBlocks(newData); // Regenerate blocks based on new data
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

 
  // const bubbleSort = async () => {
    //   setComparisons(0);
    //   setSwaps(0);
    //   let swapped;

    //   for (let i = 0; i < data.length - 1; i++) {
    //     swapped = false;
    //     for (let j = 0; j < data.length - i - 1; j++) {
    //       const value1 = data[j];
    //       const value2 = data[j + 1];

    //       // Highlight compared bars
    //       d3.select(`rect:nth-child(${j + 1})`).attr("fill", "black");
    //       d3.select(`rect:nth-child(${j + 2})`).attr("fill", "black");

    //       setComparisons((prev) => prev + 1);

    //       // Adding a delay to allow the user to see the comparisons
    //       await new Promise(resolve => setTimeout(resolve, delay));

    //       if (value1 > value2) {
    //         // Swap values
    //         let temp = [...data];
    //         temp[j] = value2;
    //         temp[j + 1] = value1;
    //         setData(temp); // Update the state to trigger a re-render

    //         // Increment swap count
    //         setSwaps((prev) => prev + 1);
        
    //         await moveBars(j, j + 1);
    //         console.log("values", j , j+1);
    //         swapped = true;
    //         // Allow some time to see the swap effect
    //         await new Promise(resolve => setTimeout(resolve, delay));
    //       }else {
    //         await new Promise((resolve) =>
    //           setTimeout(() => {
    //             resolve();
    //           }, DELAY)
    //         );
    //       }

    //       // Reset color of bars
    //       d3.select(`rect:nth-child(${j + 1})`).attr("fill", "#CC1616");
    //       d3.select(`rect:nth-child(${j + 2})`).attr("fill", "#CC1616");
    //     }

    //     if (!swapped) {
    //       break; // No swaps means the array is sorted
    //     }
    //   }
    // };

    // // Function to move the bars visually during a swap
    // const moveBars = async (index1, index2) => {
    //   const xScale = d3.scaleLinear().domain([0, data.length]).range([0, screenWidth]);
    
    //   // Get the current positions of the rectangles
    //   const rect1 = d3.select(`#rect${index1}`);
    //   const rect2 = d3.select(`#rect${index2}`);
    
    //   const rect1X = xScale(index1);
    //   const rect2X = xScale(index2);
    
    //   // Animate the movement of both rectangles
    //   await Promise.all([
    //     rect1.transition()
    //       .duration(delay)
    //       .attr("transform", `translate(${rect2X - rect1X},0)`),
          
    //     rect2.transition()
    //       .duration(delay)
    //       .attr("transform", `translate(${rect1X - rect2X},0)`),
    //   ]);
    
    //   // Reset transforms after the animation
    //   rect1.attr("transform", `translate(0,0)`);
    //   rect2.attr("transform", `translate(0,0)`);
    // };
    

  //   const bubbleSort = async () => {
  //   setComparisons(0);
  //   setSwaps(0);
  //   let swapped;

  //   for (let i = 0; i < data.length - 1; i++) {
  //     swapped = false;
  //     for (let j = 0; j < data.length - i - 1; j++) {
  //       const value1 = data[j];
  //       const value2 = data[j + 1];

  //       // Highlight compared bars
  //       highlightBars(j, j + 1);
  //       setComparisons((prev) => prev + 1);
  //       await new Promise((resolve) => setTimeout(resolve, 200)); // Add delay for highlighting effect

  //       if (value1 > value2) {
  //         // Swap values
  //         let temp = [...data];
  //         temp[j] = value2;
  //         temp[j + 1] = value1;

  //         // Update the state and animate the blocks
  //         setData(temp);
  //         await animateSwap(j, j + 1);
  //         setSwaps((prev) => prev + 1);
  //         swapped = true;
  //       }

  //       // Reset color of bars
  //       resetHighlight(j, j + 1);
  //     }

  //     if (!swapped) {
  //       break;
  //     }
  //   }
  // };


  const bubbleSort = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    let swapped = true; // Initialize swapped to true to enter the loop
    let n = data.length; // Size of the list to sort
    let tempData = [...data]; // Use a local copy for immediate data manipulation

    while (swapped) {
      swapped = false;

      for (let i = 0; i < n - 1; i++) {
        const value1 = tempData[i];
        const value2 = tempData[i + 1];

        // Highlight compared bars
        highlightBars(i, i + 1);
        setComparisons((prev) => prev + 1);
        await new Promise((resolve) => setTimeout(resolve, delay)); // Add delay for highlighting effect

        if (value1 > value2) {
          // Swap values in the local tempData array
          let temp = tempData[i];
          tempData[i] = tempData[i + 1];
          tempData[i + 1] = temp;

          // Animate the blocks with the swapped data, passing the actual values
          console.log(value1, value2, tempData);
          await animateSwap(value1, value2, tempData); // Pass the actual values
          setSwaps((prev) => prev + 1);
          clearBlocks(); // Clear previous blocks
          setData(tempData); // Update the state with the new data
          generateBlocks(tempData); // Regenerate blocks with the updated data
          swapped = true; // Indicate that a swap occurred



          // Decrement i to recheck the swapped value with the next element
          i--; 
        }

        // Reset color of bars after comparison
        resetHighlight(i, i + 1);
      }

      // Reduce the range for the next pass, since the largest element is already sorted
      n--;
    }

    // After sorting, update the data state with the sorted array
    setData(tempData);
    setIsSorting(false);
  };



  // Animate swapping of blocks
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

  // Animate swapping of blocks
  // const animateSwap = async (index1, index2) => {
  //   const barWidth = screenWidth / data.length - barPadding;
  //   const xScale = d3.scaleLinear().domain([0, data.length]).range([0, screenWidth]);

  //   // Get the current positions
  //   const pos1 = xScale(index1);
  //   const pos2 = xScale(index2);

  //   console.log(pos1,pos2);

  //   // Animate moving the rectangles
  //   await new Promise((resolve) => {
  //     // d3.select(visuRef.current)
  //     //   .select(`rect:nth-child(${index1 + 1})`)
  //     //   .transition()
  //     //   .duration(200) // Adjust duration as needed
  //     //   .attr("transform", `translate(${pos2},0)`)
  //     //   .on("end", () => {
  //     //     d3.select(visuRef.current)
  //     //       .select(`rect:nth-child(${index2 + 1})`)
  //     //       .transition()
  //     //       .duration(200)
  //     //       .attr("transform", `translate(${pos1},0)`)
  //     //       .on("end", resolve);
  //     // });

  //     // d3.select(visuRef.current)
  //     //   .select(`text:nth-child(${index1 + 1})`)
  //     //   .transition()
  //     //   .duration(200) // Adjust duration as needed
  //     //   .attr("transform", `translate(${pos2},0)`)
  //     //   .on("end", () => {
  //     //     d3.select(visuRef.current)
  //     //       .select(`text:nth-child(${index2 + 1})`)
  //     //       .transition()
  //     //       .duration(200)
  //     //       .attr("transform", `translate(${pos1},0)`)
  //     //       .on("end", resolve);
  //     // });

  //     const rects = d3.select(visuRef.current).selectAll("rect");
  //     const texts = d3.select(visuRef.current).selectAll("text");

  //     console.log(texts);

  //     // Animate the first rectangle to the second position
  //     rects.filter((d, i) => i === index1)
  //       .transition()
  //       .duration(200) // Adjust duration as needed
  //       .attr("transform", `translate(${pos2},0)`)
  //       .on("end", () => {
  //         // Animate the second rectangle to the first position
  //         rects.filter((d, i) => i === index2)
  //           .transition()
  //           .duration(200)
  //           .attr("transform", `translate(${pos1},0)`)
  //           .on("end", resolve);
  //       });

  //     // Animate the text for the first index
  //     texts.filter((d, i) => i === index1)
  //     .transition()
  //     .duration(200) // Adjust duration as needed
  //     .attr("x", pos2 + barWidth / 2)
  //     .on("end", () => {
  //       // Animate the second label to the first position
  //       texts.filter((d, i) => i === index2)
  //         .transition()
  //         .duration(200)
  //         .attr("x", pos1 + barWidth / 2)
  //         .on("end", resolve);
  //     });

  //   });

  // };

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
                <div className="row ml-auto mr-auto 1">
                  <span>
                    <span className="op">while</span>(swapped)
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1 2">
                  <span>&emsp;&emsp;swapped = <span className="var">false</span></span>
                </div>
                <div className="row ml-auto mr-auto mt-1 3">
                  <span>
                    &emsp;&emsp;<span className="op">for</span> x = 0 to length(list)-1
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1 4">
                  <span>
                    &emsp;&emsp;&emsp;&emsp;<span className="op">if</span> list[x] &gt; list[x+1]
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1 5">
                  <span>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span className="op">swap</span>(list[x], list[x+1])
                  </span>
                </div>
                <div className="row ml-auto mr-auto mt-1 6">
                  <span>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;swapped = <span className="var">true</span>
                  </span>
                </div>
              </div>
            </div>
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

          <div className="scrollers"> {/* Aligns content to the left */}
            <div className="scrollers1">
              <label>Elements: {data.length}</label>
              
                  <Slider
                  min={5}
                  max={50}
                  step={1}
                  value={data.length}
                  onChange={(value) => newSet(value)}
                  handle={({ value }) => <div>{value}</div>} // Optional custom handle
                />
            </div>

            <div className="scrollers1">
              <label>Speed: {delay} ms</label>
              <Slider
                min={10}
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
              <form>
                <div className="form-group row">
                  <label htmlFor="data-input" className="col-sm-5 col-form-label">
                    Your data (max. 50 elements):
                  </label>
                  <div className="col-sm-7">
                    <input
                      disabled={true}
                      type="text"
                      className="form-control"
                      id="data-input"
                      placeholder="10,42,34,55,..."
                    />
                  </div>
                </div>
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

export default BubbleSort;
