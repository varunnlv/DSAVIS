import React, { useState } from "react";
import "./ToolBar.css"; // Ensure your CSS file is set up for styling
import { useNavigate } from "react-router-dom";

// Button component
const Button = ({ label, onClick, className }) => (
  <button className={`button ${className}`} onClick={onClick}>
    {label}
  </button>
);

// DropdownMenu component
const DropdownMenu = ({ label, items, onActionSelect }) => (
  <div className="dropdown">
    <button className="dropbtn">{label}</button>
    <div className="dropdown-content">
      {items.map((item, index) => (
        <a
          key={index}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onActionSelect(item.actionKey);
          }}
        >
          {item.label}
        </a>
         
      ))}
    </div>
  </div>
);

const Sidebar = ({ isVisible, onClose }) => {
  const navigate = useNavigate(); // Get the navigate function

  const options = [
    // { label: "Data Structures", path: "/data-structures" },
    { label: "Search Algorithms", path: "/pathfinder" },
    { label: "Sorting Algorithms", path: "/sorting" },
    // { label: "Trees", path: "/trees" },
  ];

  const handleOptionClick = (path) => {
    onClose(); // Optional: Close the sidebar on option click
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className={`sidebar ${isVisible ? "visible" : "hidden"}`}>
      <div className="tile-container">
        {options.map((option, index) => (
          <div
            className="tile"
            key={index}
            onClick={() => handleOptionClick(option.path)} // Attach click handler
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Toolbar component accepting onAction as a prop for handling action selection
const Toolbar = ({
  onAction,
  selectedAlgorithm,
  algorithmItems,
  mazeItems,
  isWeightedGraph,
  ispathfinderEnabled
}) => {

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  let toolbarItems = [
   
    {
      type: "button",
      label: "Clear Board",
      actionKey: "clearBoard",
      className: "clear-board-button",
    },
    {
      type: "button",
      label: "Clear Path",
      actionKey: "clearPath",
      className: "clear-path-button",
    },
    {
      type: "dropdown",
      label: "Select Maze ▼",
      items: mazeItems,
      className: "maze-dropdown",
    },
    {
      type: "dropdown",
      label: "Select Algorithm ▼",
      items: algorithmItems,
      className: "algorithm-dropdown",
    },
    {
      type: "button",
      label: `Visualize ${selectedAlgorithm}`,
      actionKey: "visualize",
      className: "visualize-button",
    },

  ];

  return (  
      <div className="toolbar">
         <Button
            label="☰"
            className="sidebar-toggle-button"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        />


        {/* <Button
            label="Visual"
            className="sidebar-toggle-button2"
        /> */}

        {ispathfinderEnabled && (
          <div className="toolbar-center">
          {toolbarItems.map((item, index) => {
            switch (item.type) {
              case "button":
                return (
                  <Button
                    key={index}
                    label={item.label}
                    onClick={() => onAction(item.actionKey)}
                    className={item.className}
                  />
                );
              case "dropdown":
                return (
                  <DropdownMenu
                    key={index}
                    label={item.label}
                    items={item.items}
                    onActionSelect={(actionKey) => {
                      onAction(actionKey);
                    }}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        )}

        {isSidebarVisible && (
          <Sidebar
            isVisible={isSidebarVisible}
            onClose={() => setIsSidebarVisible(false)} // Close sidebar when ✖ clicked
          />
        )}
      </div>   
  );


};

export default Toolbar;
