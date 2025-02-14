import { FaSearch } from "react-icons/fa";
import PropertiesPanel from "./PropertiesPanel";
import { IoReload } from "react-icons/io5";
import { observer } from "mobx-react-lite";
import ColorSelection from "./ColorSelection";
import GeometryList from "./GeometryList";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEyeSlash } from "react-icons/fa";
import ShapeStore from "../Store/ShapeStore";

// eslint-disable-next-line react/prop-types
const RightBar = observer(({ selectedShape }) => {
  const shape = ShapeStore.shapesHistory.find((s) => s.id === selectedShape);

  const handleUpdateClick = () => {
    if (!selectedShape) return;
    ShapeStore.applyShapeUpdate(selectedShape); // ✅ Call update function
  };

  return (
    <div className=" z-20 bg-gray-100 p-4 min-h-screen ml-auto border-0 rounded-lg w-[350px] p-3 mt-10  ">
      {selectedShape ? (
        <div className="">
          <h2 className="text-lg font-bold">Properties:</h2>
          <p className="text-md mb-3">{shape.type} </p>

          <PropertiesPanel shapeId={selectedShape} />
          <GeometryList
            type={IoReload}
            title={"upload"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
            onClick={handleUpdateClick}  // ✅ Pass function to GeometryList
          />

          <ColorSelection />

          <GeometryList
            type={FaEyeSlash}
            title={"Hide"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
          />
          <GeometryList
            type={RiDeleteBin5Line}
            title={"Delete"}
            classes="mt-4 w-80 flex items-center justify-center gap-2 p-2 border rounded-md"
          />
        </div>
      ) : (
        <div className="flex flex-col align-center">
          <FaSearch className="text-4xl text-gray-500 mb-2" />
          <p className="text-lg text-gray-500">Search Object</p>
        </div>
      )}
    </div>
  );
});

export default RightBar;
