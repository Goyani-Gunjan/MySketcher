import { useState, useEffect } from "react";
import { FaSearch, FaEyeSlash } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { observer } from "mobx-react-lite";
import PropertiesPanel from "./PropertiesPanel";
import ColorSelection from "./ColorSelection";
import GeometryList from "./GeometryList";
import ShapeStore from "../Store/ShapeStore";

const RightBar = observer(({ selectedShape, setSelectedShape }) => {
  const [shape, setShape] = useState(null);

  // Update shape whenever selectedShape changes
  useEffect(() => {
    const foundShape = ShapeStore.shapesHistory.find((s) => s.id === selectedShape);
    setShape(foundShape);
  }, [selectedShape, ShapeStore.shapesHistory.length]);

  const handleUpdateClick = () => {
    if (!selectedShape) return;
    ShapeStore.applyShapeUpdate(selectedShape);
  };

  const toggleVisibility = () => {
    if (!shape) return;

    // Find the shape object in the scene
    const shapeObject = shape.shapeObject;

    if (shapeObject) {
      shapeObject.visible = !shapeObject.visible; // ✅ Toggle shape visibility
    }
  };

  const handleDeleteClick = () => {
    if (!selectedShape) return;
    ShapeStore.removeShape(selectedShape);
    setShape(null); // Reset shape state
    setSelectedShape(null); // Clear selected shape in parent component
  };

  return (
    <div className="z-20 bg-gray-100 p-4 min-h-screen overflow-y-auto ml-auto border-0 rounded-lg w-[350px] p-3 mt-10 position-relative">
      {!shape ? (
        <div className="flex flex-col align-center cursor-pointer justify-center">
          <FaSearch className="text-4xl text-gray-500 mb-2" />
          <p className="text-lg text-gray-500">Search Object</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold">Properties:</h2>
          <p className="text-md mb-3">{shape?.type}</p>
          <PropertiesPanel shapeId={selectedShape} />
          <GeometryList
            type={IoReload}
            title={"Update"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
            onClick={handleUpdateClick}
          />
          <ColorSelection />
          <GeometryList
            type={FaEyeSlash}
            title={"Hide"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
            onClick={toggleVisibility} // ✅ Only hides the shape, not the panel
          />
          <GeometryList
            type={RiDeleteBin5Line}
            title={"Delete"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
            onClick={handleDeleteClick}
          />
        </div>
      )}
    </div>
  );
});

export default RightBar;
