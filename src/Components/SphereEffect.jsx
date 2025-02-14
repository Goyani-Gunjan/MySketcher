import * as THREE from "three";

class SphereEffect {
  constructor(scene) {
    this.scene = scene;
    this.spheres = [];
  }

  addSphere(position) {
    const geometry = new THREE.SphereGeometry(1, 16, 16); // Small sphere
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    this.scene.add(sphere);
    this.spheres.push(sphere);

    console.log(position)

  }
}

export default SphereEffect;
