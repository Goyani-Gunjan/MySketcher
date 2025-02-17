// intersection.js

import ShapeStore from "../Store/ShapeStore";

// Function to handle the intersection logic// intersection.js
// intersection.js
export function handleIntersection(raycaster, scene, renderer) {
    // Ensure renderer is valid before proceeding
    if (!renderer || !renderer.domElement) {
      console.error("Renderer is not initialized properly.");
      return null;
    }
  
    const intersectsShapes = raycaster.intersectObjects(scene.children, true);
  
    if (intersectsShapes.length > 0) {
      const clickedObject = intersectsShapes[0].object;
      const clickedShape = ShapeStore.shapesHistory.find(s => s.mesh === clickedObject);
  
      if (clickedShape) {
        return clickedShape;
      }
    }
  
    return null; // No intersection with shapes
  }
  
  
