import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ShapeFactory from "../Shapes/ShapeFactory";
import ShapeStore from "../Store/ShapeStore";


// eslint-disable-next-line react/prop-types
const CanvasArea = ({ drawShapes, setDrawShape, setSelectedShape }) => {
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
      side: THREE.DoubleSide, transparent: true,
      
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    planeRef.current = plane;

    ShapeStore.setScene(scene, camera, renderer);
    // Orbit Controls
  
    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
 
      renderer.render(scene, camera);
      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Mouse Events
    const handleMouseDown = (event) => {
      event.stopPropagation(); // Prevent interfering with OrbitControls
      if (!canDraw || !shape) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);

      // 🟢 Check if a shape was clicked (instead of just the plane)
      const intersectsShapes = raycaster.current.intersectObjects(
        sceneRef.current.children,
        true
      );

      if (intersectsShapes.length > 0) {
        const clickedObject = intersectsShapes[0].object;

        // ✅ Find the corresponding shape in ShapeStore
        const clickedShape = ShapeStore.shapesHistory.find(
          (s) => s.mesh === clickedObject
        );
        if (clickedShape) {
          console.log("Clicked:", clickedShape);

          // ✅ Pass the clicked shape ID to the properties panel
          ShapeStore.setSelectedShape(clickedShape.id);
          setSelectedShape(clickedShape.id);
          return; // Exit since we handled shape selection
        }
      }

      const intersects = raycaster.current.intersectObject(planeRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].point.clone();
        point.y = 0.1;

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
      event.stopPropagation(); // Prevent interfering with OrbitControls
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

    // Separate Click Handler for Raycasting (Checking Shape History)
    const handleClick = (event) => {
      event.stopPropagation(); // Prevent interfering with OrbitControls

      // Update mouse position
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;



      // Perform raycasting
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);

      console.log("Shapes in history:", ShapeStore.shapesHistory);

      for (let shape of ShapeStore.shapesHistory) {
        console.log("🟢 Checking shape:", shape);
    
        const mesh = shape.shapeObject; // Ensure we are using the correct mesh reference
        if (!mesh) {
          console.warn("⚠️ Missing mesh in shape:", shape);
          continue;
        }
    
        const intersects = raycaster.current.intersectObject(mesh, true);
        console.log("🎯 Intersects:", intersects[0]);
    
        if (intersects.length > 0) {
          console.log("✅ Shape clicked:", shape);
    
          // Extract ID correctly
          const shapeId = shape.id; // Ensure we get the correct ID
          console.log("📌 Passing ID to store:", shapeId);
    
          // Update selected shape in store
          ShapeStore.setSelectedShape(shapeId);
          setSelectedShape(shapeId);
          return;
        }
        
      }
    
    
      // Check for intersections with all objects in the scene
    };

    // Attach event listeners
    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("click", handleClick); // Separate click event for raycasting

    return () => {
      // Cleanup event listeners
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("click", handleClick); // Cleanup separate click event

      

      return () => {
        renderer.dispose(); // Cleanup WebGL context
        document.body.removeChild(renderer.domElement);
      };
    };
  }, [drawShapes, shape, clickCount, isPolylineDrawing, canDraw]);

  useEffect(() => {
    if (drawShapes) {
      if (rendererRef.current) {
        console.log("Resetting WebGL state to avoid shader errors...");
        rendererRef.current.state.reset(); // 🔥 Fix WebGL errors when switching
      }
      setShape(ShapeFactory.createShape(drawShapes, sceneRef.current));
      setCanDraw(true); // ✅ Allow drawing when a shape is selected from navbar
    }
  }, [drawShapes]);

  return (
    <canvas ref={canvasRef} className="absolute fixed top-0 left-0 w-full h-full" />
  );
};

export default CanvasArea;
