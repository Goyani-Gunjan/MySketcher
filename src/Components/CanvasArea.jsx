import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ShapeFactory from "../Shapes/ShapeFactory";
import shapeStore from "../Store/ShapeStore";

// eslint-disable-next-line react/prop-types
const CanvasArea = ({ drawShapes,setDrawShape }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const planeRef = useRef(null);
  const cameraRef = useRef(null);
  const [shape, setShape] = useState(drawShapes); //	Stores the currently selected shape object.
  const [clickCount, setClickCount] = useState(0); // For non-polyline shapes
  const [canDraw, setCanDraw] = useState(false); // ✅ Allow drawing only after navbar click
  const [isPolylineDrawing, setIsPolylineDrawing] = useState(false);

  

  useEffect(() => {
    const scene = sceneRef.current;
    shapeStore.setScene(scene)
    // Setup Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Plane for Raycasting
    const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    planeRef.current = plane;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    

    // Mouse Events
    const handleMouseDown = (event) => {
        if (!canDraw || !shape) return;
      
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      
        const intersects = raycaster.current.intersectObject(planeRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point.clone();
          point.y += 0.1;
      
          if (drawShapes === "PolyLine") {
            // 🟢 Let the PolyLine class handle clicks
            if (shape.handleClick) {
              shape.handleClick(point);
            }
          } else {
            // Other Shapes (Line, Circle, Ellipse)
            if (clickCount === 0) {
              if (shape.startDrawing) {
                shape.startDrawing(point);
              }
              setClickCount(1);
            } else if (clickCount === 1) {
              if (shape.stopDrawing) {
                shape.stopDrawing();
              }
              setClickCount(0);
              setCanDraw(null);
              setShape(null);
              setDrawShape(null);
      
              setTimeout(() => {
                setShape(ShapeFactory.createShape(drawShapes, sceneRef.current));
              }, 0);
            }
          }
        }
      };
      

    const handleMouseMove = (event) => {
        if (!shape) return;
      
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      
        const intersects = raycaster.current.intersectObject(planeRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point.clone();
      
          if (drawShapes === "PolyLine" && shape.handleMouseMove) {
            // 🚀 Call PolyLine's new preview method
            shape.handleMouseMove(point);
          } else if (shape.drawing && shape.updateDrawing) {
            shape.updateDrawing(point);
          }
        }
      };
      

    const handleDoubleClick = () => {
        if (drawShapes === "PolyLine" && shape) {
          if (shape.stopDrawing) {
            shape.stopDrawing();
          }
          setIsPolylineDrawing(false);

          setCanDraw(null); // ❌ Disable further drawing
          setShape(null); // ❌ Reset shape state
          setDrawShape(null); // ❌ Reset selected shape
      
          // ✅ Ensure new PolyLine is only created after clicking the navbar again
          setTimeout(() => {
            setShape(ShapeFactory.createShape(drawShapes, sceneRef.current));
          }, 0);
        }
      };

    // Attach event listeners
    window.addEventListener("click", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dblclick", handleDoubleClick);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("click", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dblclick", handleDoubleClick);

      return () => {
        renderer.dispose(); // Cleanup WebGL context
        document.body.removeChild(renderer.domElement);
    };
    };
  }, [drawShapes, shape, clickCount, isPolylineDrawing,canDraw]);

  useEffect(() => {
    if (drawShapes) {
      if (rendererRef.current) {
        rendererRef.current.state.reset(); // 🔥 Fix WebGL errors when switching
      }
      setShape(ShapeFactory.createShape(drawShapes, sceneRef.current));
      setCanDraw(true); // ✅ Allow drawing when a shape is selected from navbar
    }
  }, [drawShapes]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default CanvasArea;
