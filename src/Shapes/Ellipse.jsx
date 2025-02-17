import * as THREE from "three";
import ShapeStore from "../Store/ShapeStore";

class Ellipse {

  constructor(scene) {
    this.scene = scene;
    this.drawing = false;
    this.ellipseMesh = null;
    this.sphere = null; // Sphere for center
    this.center = null;
    this.majorAxis = 0;
    this.minorAxis = 0;
  }

  startDrawing(center) {
    // // Dispose of any previous ellipse and sphere
    // this.disposePrevious();

    this.center = center.clone();
    this.drawing = true;

    // Create a sphere at the center
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: ShapeStore.currentColor });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.copy(this.center);
    // this.scene.add(this.sphere);
  }

  updateDrawing(point) {
    if (!this.drawing || !this.center) return;

    // Calculate major and minor axis lengths
    this.majorAxis = Math.abs(point.x - this.center.x);
    this.minorAxis = Math.abs(point.z - this.center.z);
    
    // Remove previous ellipse before drawing a new one
    if (this.ellipseMesh) {
      this.scene.remove(this.ellipseMesh);
      this.ellipseMesh.geometry.dispose();
      this.ellipseMesh.material.dispose();
    }

    // Create ellipse curve
    const curve = new THREE.EllipseCurve(
      0, 0, // Center
      this.majorAxis, this.minorAxis, // Major and minor axis
      0, Math.PI * 2, // Start and end angle
      false, // Clockwise
      0 // Rotation
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: ShapeStore.currentColor });

    this.ellipseMesh = new THREE.Line(geometry, material);
    this.ellipseMesh.rotation.x = -Math.PI / 2;
    this.ellipseMesh.position.set(this.center.x, this.center.y, this.center.z);
  
    this.scene.add(this.ellipseMesh);
  }

  stopDrawing() {
    this.drawing = false;
  
    if (this.center && this.ellipseMesh) {
      ShapeStore.addToHistory({
        type: "Ellipse",
        center: this.center,
        majorAxis: this.majorAxis,
        minorAxis: this.minorAxis,
        shapeObject: this.ellipseMesh,
        spheres : this.sphere,
      });
 
      // console.log("Ellipse stored:", { center: this.center, majorAxis: this.majorAxis, minorAxis: this.minorAxis });
    }
  }
}

export default Ellipse;
