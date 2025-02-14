import * as THREE from "three";
import ShapeStore from '../Store/ShapeStore'

class Circle {
  constructor(scene) {
    this.scene = scene;
    this.drawing = false;
    this.center = null;
    this.circleMesh = null;
    this.sphere = null;
    this.radius = 0; // Track radius
  }

  startDrawing(center) {


    this.center = center.clone();
    this.drawing = true;

    // Create a Sphere at the center
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color:ShapeStore.currentColor });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.position.copy(this.center);
    // this.scene.add(this.sphere);  
  }

  updateDrawing(point) {
    if (!this.drawing || !this.center) return;

    this.radius = this.center.distanceTo(point);
    if (this.radius <= 0) return;

    // Remove previous circle before drawing a new one
    if (this.circleMesh) {
      this.scene.remove(this.circleMesh);
      this.circleMesh.geometry.dispose();
      this.circleMesh.material.dispose();
    }

    // Create a new ring for this circle
    const geometry = new THREE.CircleGeometry(this.radius, 64);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshBasicMaterial({ color: ShapeStore.currentColor, side: THREE.DoubleSide });

    this.circleMesh = new THREE.Mesh(geometry, material);
    this.circleMesh.position.copy(this.center);
    
    this.scene.add(this.circleMesh);
  }

  stopDrawing() {
    this.drawing = false;
  
    if (this.center && this.circleMesh) {

      
      ShapeStore.addToHistory({
        type: "Circle",
        center: this.center,
        radius: this.radius,
        shapeObject: this.circleMesh, // Store the THREE.js Circle Mesh
        spheres : this.sphere,
      });
      console.log("Circle stored:", { center: this.center, radius: this.radius });
    }
  }

}

export default Circle;
