import * as THREE from "three";
import ShapeStore from "../Store/ShapeStore"; // Import shapeStore

class Line {
  constructor(scene) {
    this.scene = scene;
    this.drawing = false;
    this.line = null;
    this.startPoint = null;
    this.endPoint = null;
  }

  startDrawing(startPoint) {
    this.startPoint = startPoint.clone(); // Store start point
    const material = new THREE.LineBasicMaterial({ color: ShapeStore.currentColor , transparent:true});
    const points = [startPoint, startPoint.clone()]; // Line will start at this point
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(geometry, material);

    this.scene.add(this.line);
    this.drawing = true;
  }

  updateDrawing(endPoint) {
    if (!this.line) return;

    // Retrieve the existing positions array
    const positions = this.line.geometry.attributes.position.array;

    // Update the last point of the line (endPoint)
    positions[3] = endPoint.x;
    positions[4] = endPoint.y;
    positions[5] = endPoint.z;

    // Mark the geometry as needing an update
    this.line.geometry.attributes.position.needsUpdate = true;

    // Ensure we store the correct final endPoint
    this.endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);
  }

  stopDrawing() {
    if (!this.line) return;
    // console.log("🛑 stopDrawing() called!");

    this.drawing = false;

    // Get the exact last position of the line
    const positions = this.line.geometry.attributes.position.array;
    this.endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);

    // console.log("📌 Corrected End Point:", this.endPoint);

    // Save the shape without any spheres
    this.saveShape();
  }

  saveShape() {
    console.log("🔹 saveShape() called!"); // Debugging
    console.log("✅ Saving Line with shape object:", this.line); // Debug log

    if (this.startPoint && this.endPoint) {
      ShapeStore.addToHistory({
        type: "Line",
        start: this.startPoint,
        end: this.endPoint,
        shapeObject: this.line,
      });
    } else {
      console.warn("⚠️ Line not drawn correctly:", this.line);
    }
  }
}

export default Line;
