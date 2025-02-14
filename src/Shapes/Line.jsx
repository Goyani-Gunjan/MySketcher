import * as THREE from "three";
import ShapeStore from "../Store/ShapeStore"; // Import shapeStore

class Line {
    constructor(scene) {
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

    const points = this.line.geometry.attributes.position.array;
    points[3] = endPoint.x;
    points[4] = endPoint.y;
    points[5] = endPoint.z;
    this.line.geometry.attributes.position.needsUpdate = true;


    this.endPoint = endPoint.clone(); // Update end point
  }

  stopDrawing() {
    if (!this.line) return;
    console.log("🛑 stopDrawing() called!"); // Debug log
    this.drawing = false;
  
    // Add Sphere at End Point
      const endPoint = new THREE.Vector3(
        this.line.geometry.attributes.position.array[3],
        this.line.geometry.attributes.position.array[4],
        this.line.geometry.attributes.position.array[5]
      );
      this.endPoint = endPoint; // Store final end point
      this.addSphere(endPoint);

        // Save the shape to shapeStore
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
    }else {
      console.warn("⚠️ Spheres not added correctly:", this.spheres);
  }
  }
}

export default Line;
