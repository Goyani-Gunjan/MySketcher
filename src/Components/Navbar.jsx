import { TbLine, TbOvalVertical } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import GeometryList from "./GeometryList";
import { MdOutlinePolyline } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";
import saveShapesToFile from "./SaveShape"; 
import uploadShapesFromFile from "./UploadShape"; 
import { useRef } from "react";

// eslint-disable-next-line react/prop-types
function Navbar({ setDrawShapes }) {
  const fileInputRef = useRef(null); // Ref to access file input

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Click hidden input when button is pressed
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadShapesFromFile(file); // Call upload function
    }
  };

  return (
    <div className="flex  mx-7 z-20 h-18 mt-10 ">
      <div className="flex  bg-gray-100 mr-7 rounded-lg">
        <GeometryList type={TbLine} title={"Line"} classes="p-2 mr-8 ml-2" onClick={() => setDrawShapes("Line")} />
        <GeometryList type={GoCircle} title={"Circle"} classes="p-2 mr-8 ml-2" onClick={() => setDrawShapes("Circle")} />
        <GeometryList type={TbOvalVertical} title={"Ellipse"} classes="p-2 mr-8 ml-2" onClick={() => setDrawShapes("Ellipse")} />
        <GeometryList type={MdOutlinePolyline} title={"PolyLine"} classes="p-2" onClick={() => setDrawShapes("PolyLine")} />
      </div>

      <div className="flex mx-6 rounded-lg">
        <GeometryList type={FaRegSave} title={"Save"} classes="p-2  mr-8 bg-gray-100 rounded-lg" onClick={saveShapesToFile} />
        
        {/* Upload Button */}
        <button className="p-2 mr-8 bg-gray-100 rounded-lg flex flex-col items-center " onClick={handleButtonClick}>
          <MdOutlineUploadFile className="mr-2 text-2xl " /> <div className="text-lg mt-1">Upload</div>
        </button>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}

export default Navbar;
