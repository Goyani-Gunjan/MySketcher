import Leftsidebar from './Components/Leftsidebar';
import Navbar from './Components/Navbar';
import RightBar from './Components/RightBar';
import CanvasArea from './Components/CanvasArea'; // Import Canvas Component
import { useEffect, useState } from 'react';

function App() {
  const [selectedShape, setSelectedShape] = useState(null);
 const[drawShapes , setDrawShapes] = useState(null);

 useEffect(()=>{
 console.log(drawShapes)
 },[drawShapes])

  return (
       <div className='min-h-screen flex min-w-[98.8vw] absolute'>
          <CanvasArea drawShapes={drawShapes} setDrawShape={setDrawShapes} />
          <Leftsidebar setSelectedShape={setSelectedShape}/>
          <Navbar setDrawShapes={setDrawShapes} />
          <RightBar selectedShape={selectedShape}/>
       </div>
  ); 
}

export default App;
