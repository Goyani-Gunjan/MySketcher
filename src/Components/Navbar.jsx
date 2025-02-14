import { TbLine, TbOvalVertical } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import GeometryList from "./GeometryList";
import { MdOutlinePolyline } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { MdOutlineUploadFile } from "react-icons/md";


// eslint-disable-next-line react/prop-types
function Navbar({setDrawShapes}) {
  return (
    <div className="flex  mx-7 z-20 h-18 mt-10 ">
      <div className="flex  bg-gray-100 mr-7 rounded-lg" >
        <GeometryList type={TbLine} title={"line"} classes="p-2 mr-8 ml-2" onClick={()=>setDrawShapes('Line')} />
        <GeometryList type={GoCircle} title={"Circle"} classes="p-2 mr-8 ml-2" onClick={() =>setDrawShapes('Circle')} />

        <GeometryList type={TbOvalVertical} title={"Ellipse"} classes="p-2 mr-8 ml-2" onClick={() =>setDrawShapes('Ellipse')}/>
        <GeometryList  type={MdOutlinePolyline}  title={"PolyLine"} classes="p-2" onClick={() =>setDrawShapes('PolyLine')}  />
      </div>

      <div className="flex mx-6 rounded-lg">
        <GeometryList type={FaRegSave} title={"Save"} classes="p-2  mr-8 bg-gray-100 rounded-lg" />
        <GeometryList type={MdOutlineUploadFile} title={"Upload"} classes="p-2 mr-8  bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}
export default Navbar;
