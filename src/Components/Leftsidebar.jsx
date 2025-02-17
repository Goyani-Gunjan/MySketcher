import { FaSearch } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GoEye } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState, useEffect } from "react";
import GeometryList from "./GeometryList";
import { TbLine, TbOvalVertical } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { MdPolyline } from "react-icons/md"; // Polyline Icon
import ShapeStore from "../Store/ShapeStore"; // Import shape store

// eslint-disable-next-line react/prop-types
function Leftsidebar({ setSelectedShape }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [shapes, setShapes] = useState([]); // Store shape history

  useEffect(() => {
    setShapes([...ShapeStore.shapesHistory]);
  }, [ShapeStore.shapesHistory.length]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleShapeClick = (shape) => {
    ShapeStore.setSelectedShape(shape);
    setSelectedShape(shape);
  };

  const handleVisibility = (id) => {
    console.log(id);
    ShapeStore.visible(id);
  };

  // Hide all shapes in the scene
  const handleFileVisibility = () => {
    shapes.forEach((shape) => ShapeStore.visible(shape.id, false)); // Make all shapes invisible
    setShapes([...ShapeStore.shapesHistory]); // Re-render shapes after making them invisible
  };

  const handleDelete = (id) => {
    console.log(id);
    ShapeStore.removeShape(id);
    setShapes([...ShapeStore.shapesHistory]); // Update UI after deletion
  };

   // Delete all shapes (clear all shapes in the file)
  // Delete all shapes (clear all shapes in the file)
  const handleDeleteFile = () => {
    shapes.forEach((shape) => {
      ShapeStore.removeShape(shape.id); // Remove each shape
    });
    setShapes([]); // Clear shapes array in UI after deletion
  };

  // Map shape types to icons
  const shapeIcons = {
    Line: TbLine,
    Circle: GoCircle,
    Ellipse: TbOvalVertical,
    PolyLine: MdPolyline,
  };

  return (
    <div className="min-h-screen bg-gray-100 border-0 rounded-lg w-[350px] h-screen z-20 mt-10 ml-4">
      <div className="flex justify-between items-center mt-3 ml-2 mr-2">
        <div className="text-xl">List of Created Objects</div>
        <button>
          <FaSearch />
        </button>
      </div>
      <hr className="h-px mt-3 bg-gray-300 border-0" />

      <div className="flex justify-between bg-white mt-4 ml-2 w-[335px] rounded-lg">
        <div className="flex">
          <button className="text-3xl" onClick={toggleDropdown}>
            <RiArrowDropDownLine />
          </button>
          <div className="text-lg">My file 1</div>
        </div>
        <div>
          <button className="text-2xl mr-2" onClick={handleFileVisibility}>
            <GoEye />
          </button>
          <button className="text-2xl mr-2"  onClick={handleDeleteFile}>
            <RiDeleteBin5Line />
          </button>
        </div>
      </div>

      {/* Dropdown with Shape History */}
      {isDropdownVisible && (
        <>
          {shapes.length > 0 ? (
            shapes.map((shape) => (
              <div
                key={shape.id}
                className="flex justify-between items-center w-[335px] ml-5 mt-3"
              >
                {/* Shape Icon & Title */}
                <GeometryList
                  type={shapeIcons[shape.type] || GoCircle} // Default to Circle icon if not found
                  title={shape.title}
                  classes="flex"
                  onClick={() => handleShapeClick(shape.id)}
                />

                {/* Eye & Delete Buttons */}
                <div className="flex">
                  <button className="text-2xl mr-2">
                    <GoEye onClick={() => handleVisibility(shape.id)} />
                  </button>
                  <button className="text-2xl mr-5">
                    <RiDeleteBin5Line onClick={() => handleDelete(shape.id)} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="ml-5 mt-3 text-gray-500">No shapes created yet.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Leftsidebar;
