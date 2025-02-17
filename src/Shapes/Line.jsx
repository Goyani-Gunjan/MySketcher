import * as THREE from "three";
import ShapeStore from "../Store/ShapeStore"; // Import shapeStore

class Line extends THREE.Object3D{
    constructor(scene) {
      super();
    this.scene = scene;
    this.drawing = false;
    this.line = null;
    this.spheres = []; // Store sphere references
    this.startPoint = null;
    this.endPoint = null;
  }

  startDrawing(startPoint) {

    this.startPoint = startPoint.clone(); // Store start point
    const material = new THREE.LineBasicMaterial({ color: ShapeStore.currentColor });
    const points = [startPoint, startPoint.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(geometry, material);

    this.scene.add(this.line);
    this.drawing = true;

    // Add Sphere at Start Point
    this.addSphere(startPoint);
  }
  updateDrawing(endPoint) {
    if (!this.line) return;

    // Retrieve the existing positions array
    const positions = this.line.geometry.attributes.position.array;

    // Update the last point of the line
    positions[3] = endPoint.x;
    positions[4] = endPoint.y;
    positions[5] = endPoint.z;

    // Mark the geometry as needing an update
    this.line.geometry.attributes.position.needsUpdate = true;

    // **Ensure we store the correct final endPoint**
    this.endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);

}


stopDrawing() {
  if (!this.line) return;
  console.log("🛑 stopDrawing() called!");

  this.drawing = false;

  // ✅ Get the exact last position of the line
  const positions = this.line.geometry.attributes.position.array;
  this.endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);

  console.log("📌 Corrected End Point:", this.endPoint);

  // ✅ Make sure the sphere is exactly at the end of the line
  this.addSphere(this.endPoint);

  // ✅ Save the shape
  this.saveShape();
}


  addSphere(position) {
    const geometry = new THREE.SphereGeometry(1.5, 16, 16); // Sphere size
    const material = new THREE.MeshBasicMaterial({ color : ShapeStore.currentColor }); // Red color
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position); 
    this.scene.add(sphere);
    this.spheres.push(sphere);
  }

  saveShape() {

    console.log("🔹 saveShape() called!"); // Debugging
    console.log("✅ Saving Line with spheres:", this.spheres); // Debug log
    if (this.startPoint && this.endPoint && this.spheres.length === 2) {
      ShapeStore.addToHistory({
        type: "Line",
        start: this.startPoint,
        end: this.endPoint,
        shapeObject: this.line,
        spheres : this.spheres,
      });
      ShapeStore.entityArray.push(this.line)
    }else {
      console.warn("⚠️ Spheres not added correctly:", this.spheres);
  }
  }
}

export default Line;
