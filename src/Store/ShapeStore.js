import { makeAutoObservable, observable, action, runInAction } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { toJS } from "mobx";
import * as THREE from 'three'

class ShapeStore {
  drawShapes = null;
  currentShape = null;
  clickCount = 0;
  canDraw = false;
  isPolylineDrawing = false;
  scene = null;
  camera = null;
  entityArray = [];
  renderer = null
  shapesHistory = [];
  currentColor = "#FF0000"; // 🔴 Default color (Red)
  selectedShapeId = null; // ✅ Track selected shape

  constructor() {
    makeAutoObservable(this, {
      shapesHistory: observable,
      updateShape: action, // Ensure updateShape is an action
      setCurrentColor: action, // ✅ Allow modifying color
      updateShapeColor: action, // ✅ Action to update color
    });
  }

  setScene(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  // ✅ Set selected shape ID
  setSelectedShape(shapeId) {
    console.log(shapeId);
    
    this.selectedShapeId = shapeId;
    console.log(`Selected shape ID: ${this.selectedShapeId}`);
  }

  setCurrentColor(color) {
    this.currentColor = color;
  }

  setDrawShapes(shape) {
    this.drawShapes = shape;
  }

  setCurrentShape(shape) {
    this.currentShape = shape;
    if (shape) {
      this.addToHistory(shape);
    }
  }

  setClickCount(count) {
    this.clickCount = count;
  }

  setCanDraw(value) {
    this.canDraw = value;
  }

  setIsPolylineDrawing(value) {
    this.isPolylineDrawing = value;
  }

  addToHistory(shape) {
    if (!shape || !shape.type) return; // Prevent invalid entries
    console.log("📝 addToHistory() called!", shape);
    const shapeData = {
      id: uuidv4(),
      type: shape.type,
      title: shape.type,
      shapeObject: shape.shapeObject, // Store the THREE.js object
      spheres: shape.spheres, // ✅ Fix: store as "spheres"
      color: this.currentColor, // ✅ Store shape color
    };


    if (shape.type === "Line") {
      shapeData.startPoint = { x: shape.start.x, y: shape.start.y, z: shape.start.z };
      shapeData.endPoint = { x: shape.end.x, y: shape.end.y, z: shape.end.z };

    } else if (shape.type === "Circle") {
      shapeData.center = { x: shape.center.x, y: shape.center.y, z: shape.center.z };
      shapeData.radius = shape.radius;
    } else if (shape.type === "Ellipse") {
      shapeData.center = { x: shape.center.x, y: shape.center.y, z: shape.center.z };
      shapeData.majorAxis = shape.majorAxis;
      shapeData.minorAxis = shape.minorAxis;
    } else if (shape.type === "PolyLine") {
      shapeData.points = shape.points; // Store all polyline points
    }

    this.shapesHistory.push(shapeData);
    console.log(`${shape.type} added to history:`, shapeData);
    console.log("his", toJS(this.shapesHistory))
    // console.log("📜 Full Shape Store:", JSON.stringify(this.shapesHistory, null, 2));
  }


  removeShape(id) {

    const shapeDelete = this.shapesHistory.find(shape => shape.id === id);
    if (shapeDelete) {
      if (shapeDelete.shapeObject) {
        this.scene.remove(shapeDelete.shapeObject);
      }
      if (shapeDelete.shapeObject.geometry) {
        shapeDelete.shapeObject.geometry.dispose();
      }
      if (shapeDelete.shapeObject.material) {
        shapeDelete.shapeObject.material.dispose();
      }

      // Remove the spheres if they exist
      if (shapeDelete.spheres && Array.isArray(shapeDelete.spheres)) {
        shapeDelete.spheres.forEach(sphere => {
          this.scene.remove(sphere);

          // Dispose of sphere geometry and material
          if (sphere.geometry) {
            sphere.geometry.dispose();
          }
          if (sphere.material) {
            sphere.material.dispose();
          }
        });
      }
      this.shapesHistory = this.shapesHistory.filter(shape => shape.id !== id);
    }


  }

  visible(id) {
    const shapeVisible = this.shapesHistory.find(shape => shape.id === id);

    if (shapeVisible) {
      // Toggle shapeObject visibility
      shapeVisible.shapeObject.visible = !shapeVisible.shapeObject.visible;

      // Toggle spheres visibility properly
      if (shapeVisible.spheres && Array.isArray(shapeVisible.spheres)) {
        shapeVisible.spheres.forEach(sphere => {
          sphere.visible = shapeVisible.shapeObject.visible; // Match sphere visibility to line
        });
      }
    }
  }
  
    // Toggle visibility of shapes based on fileId
    toggleFileVisibility(fileId) {
      // Loop through all shapes in history and toggle visibility if they match the fileId
      this.shapesHistory.forEach(shape => {
        if (shape.fileId === fileId) {
          shape.shapeObject.visible = !shape.shapeObject.visible;
          if (shape.spheres && Array.isArray(shape.spheres)) {
            shape.spheres.forEach(sphere => {
              sphere.visible = shape.shapeObject.visible;
            });
          }
        }
      });
    }

  

  // ✅ **Fix: Ensure updates happen inside an action**
  updateShape(shapeId, updatedData) {
    runInAction(() => {
      const shapeIndex = this.shapesHistory.findIndex((s) => s.id === shapeId);
      if (shapeIndex === -1) return;

      // Merge updated properties
      this.shapesHistory[shapeIndex] = {
        ...this.shapesHistory[shapeIndex],
        ...updatedData,
      };

      console.log("Updated Shape:", toJS(this.shapesHistory[shapeIndex]));
      // ✅ Apply changes to the scene

    });
  }

  applyShapeUpdate(shapeId) {
    runInAction(() => {
      const shape = this.shapesHistory.find((s) => s.id === shapeId);
      if (!shape || !shape.shapeObject) return;

      console.log("🔍 Retrieved shape:", shape);
      console.log("🔍 Spheres before update:", shape.spheres); // ✅ Fix

      // ✅ Update geometry based on shape type
      if (shape.type === "Line") {
        const positions = shape.shapeObject.geometry.attributes.position.array;
        positions[0] = shape.startPoint.x;
        positions[1] = shape.startPoint.y;
        positions[2] = shape.startPoint.z;
        positions[3] = shape.endPoint.x;
        positions[4] = shape.endPoint.y;
        positions[5] = shape.endPoint.z;
        shape.shapeObject.geometry.attributes.position.needsUpdate = true;

        // 🔍 Debugging: Check if spheres exist
        console.log("Updating Spheres:", shape.spheres);

        // ✅ Update sphere positions
        if (shape.spheres && shape.spheres.length === 2) {
          console.log("✅ Before update:", shape.spheres[0].position, shape.spheres[1].position);
          shape.spheres[0].position.set(shape.startPoint.x, shape.startPoint.y, shape.startPoint.z);
          shape.spheres[1].position.set(shape.endPoint.x, shape.endPoint.y, shape.endPoint.z);
          console.log("✅ After update:", shape.spheres[0].position, shape.spheres[1].position);
        } else {
          console.warn("⚠️ Spheres not found or incorrect length:", shape.spheres);
        }
      } else if (shape.type === "Circle") {
        console.log("🔄 Updating Circle:", shape.radius);

        // Create new CircleGeometry
        shape.shapeObject.geometry = new THREE.CircleGeometry(shape.radius, 64);
        shape.shapeObject.geometry.rotateX(-Math.PI / 2); // Ensure correct rotation


        // Ensure position is correctly updated
        shape.shapeObject.position.set(shape.center.x, shape.center.y, shape.center.z);
      } else if (shape.type === "Ellipse") {
        shape.shapeObject.position.set(shape.center.x, shape.center.y, shape.center.z);

        // ✅ Create an EllipseCurve (since there's no EllipseGeometry)
        const ellipseCurve = new THREE.EllipseCurve(
          0, 0,  // Center at (0,0) because we position it later
          shape.majorAxis, shape.minorAxis,
          0, 2 * Math.PI,
          false, 0
        );

        // ✅ Convert the curve into a geometry
        const points = ellipseCurve.getPoints(50); // Increase for smoother ellipse
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // ✅ Assign new geometry
        shape.shapeObject.geometry.dispose(); // Clean up old geometry
        shape.shapeObject.geometry = geometry;
      }
      else if (shape.type === "PolyLine" && Array.isArray(shape.points)) {
        // ✅ Update Polyline Geometry
        const positions = shape.shapeObject.geometry.attributes.position.array;
        shape.points.forEach((point, index) => {
          positions[index * 3] = point.x;
          positions[index * 3 + 1] = point.y;
          positions[index * 3 + 2] = point.z;
        });
        shape.shapeObject.geometry.attributes.position.needsUpdate = true;

        // ✅ Update Spheres
        if (shape.spheres && shape.spheres.length === shape.points.length) {
          shape.points.forEach((point, index) => {
            shape.spheres[index].position.set(point.x, point.y, point.z);
            shape.spheres[index].geometry.attributes.position.needsUpdate = true;
          });

          console.log("✅ Spheres updated:", shape.spheres);
        } else {
          console.warn("⚠️ Spheres not found or incorrect length:", shape.spheres);
        }
      }



      console.log(`✅ Shape ${shapeId} updated in the scene!`, shape);
    });
  }

  

  updateShapeColor(newColor) {
    runInAction(() => {
      if (!this.selectedShapeId) return;

      const shape = this.shapesHistory.find((s) => s.id === this.selectedShapeId);
      if (!shape || !shape.shapeObject) return;

      shape.color = newColor; // ✅ Update color in history
      shape.shapeObject.material.color.set(newColor); // ✅ Change color in THREE.js
      shape.shapeObject.material.needsUpdate = true;

      // ✅ Update spheres (if any)
      if (shape.spheres && Array.isArray(shape.spheres)) {
        shape.spheres.forEach((sphere) => {
          sphere.material.color.set(newColor);
          sphere.material.needsUpdate = true;
        });
      }

      console.log(`✅ Updated shape ${this.selectedShapeId} to color ${newColor}`);
    });
  }

  getShapesData() {
    return this.shapesHistory.map(shape => ({
      id: shape.id,
      type: shape.type,
      color: shape.color || "#000000", // Default to black if no color
      position: shape.shapeObject.position,
      radius: shape.radius || null,
      majorAxis: shape.majorAxis || null,
      minorAxis: shape.minorAxis || null,
      points: shape.points || [],
    }));
  }

  addShapeFromFile(shapeData) {
    console.log("📥 Loading shape:", shapeData);

    let shapeObject;
  

    if (shapeData.type === "Line") {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(shapeData.startPoint.x, shapeData.startPoint.y, shapeData.startPoint.z),
        new THREE.Vector3(shapeData.endPoint.x, shapeData.endPoint.y, shapeData.endPoint.z)
      ]);
      const material = new THREE.LineBasicMaterial({ color: shapeData.color });
      shapeObject = new THREE.Line(geometry, material);



    } else if (shapeData.type === "Circle") {
      const geometry = new THREE.CircleGeometry(shapeData.radius, 64);
      geometry.rotateX(-Math.PI / 2); // Correct orientation
      const material = new THREE.MeshBasicMaterial({ color: shapeData.color, side: THREE.DoubleSide });
      shapeObject = new THREE.Mesh(geometry, material);
      shapeObject.position.set(shapeData.center.x, shapeData.center.y, shapeData.center.z);

    } else if (shapeData.type === "Ellipse") {
      const ellipseCurve = new THREE.EllipseCurve(
        0, 0, shapeData.majorAxis, shapeData.minorAxis, 0, 2 * Math.PI, false, 0
      );
      const points = ellipseCurve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.rotateX(-Math.PI / 2); // Correct orientation
      const material = new THREE.LineBasicMaterial({ color: shapeData.color });
      shapeObject = new THREE.Line(geometry, material);
      shapeObject.position.set(shapeData.center.x, shapeData.center.y, shapeData.center.z);

    } else if (shapeData.type === "PolyLine") {
      const points = shapeData.points.map(p => new THREE.Vector3(p.x, p.y, p.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: shapeData.color });
      shapeObject = new THREE.Line(geometry, material);


    
    }

    if (shapeObject) {
      shapeObject.name = shapeData.type;
      this.scene.add(shapeObject);
      this.shapesHistory.push({ ...shapeData, shapeObject });
    }

    console.log("✅ Shape added:", shapeObject);
  }




}




export default new ShapeStore();