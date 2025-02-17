import PropTypes from "prop-types";
import {  useState } from "react";
import { observer } from "mobx-react-lite"; // Import observer for reactivity
import ShapeStore from "../Store/ShapeStore"; // Import ShapeStore

const PropertiesPanel = observer(({ shapeId }) => {
  if (!shapeId) return null; // Prevent rendering issues if no shape is selected

  let shape;
  // Find the shape in the history
  if(ShapeStore.shapesHistory.find((s) => s.id === shapeId)){
    shape = ShapeStore.shapesHistory.find((s) => s.id === shapeId);
    console.log("shape : ",shape);
  }



  // const shape = ShapeStore.shapesHistory.find((s) => s.id === shapeId);
  if (!shape) return <p>No shape found</p>;

  // Local state for inputs
  const [inputValues, setInputValues] = useState({});

  // Function to handle input changes and update ShapeStore
  const handleInputChange = (sectionIndex, fieldIndex, newValue) => {
    if (!shape) return;
  
    let updatedShape = { ...shape }; // Copy the shape object
    let sectionKey = null;
  
    if (shape.type === "Line") {
      sectionKey = sectionIndex === 0 ? "startPoint" : "endPoint";
    } else if (shape.type === "Circle") {
      sectionKey = sectionIndex === 0 ? "center" : "radius";
    } else if (shape.type === "Ellipse") {
      sectionKey = sectionIndex === 0 ? "center" : sectionIndex === 1 ? "majorAxis" : "minorAxis";
    } else if (shape.type === "PolyLine" && Array.isArray(shape.points)) {
      sectionKey = "points";
    }
  
    const fieldKey = ["x", "y", "z", "radius", "majorAxis", "minorAxis"][fieldIndex];
    if (!fieldKey) return;
  
    const updatedValue = parseFloat(newValue) || 0;
  
    // ✅ Update local state for UI responsiveness
    setInputValues((prevValues) => ({
      ...prevValues,
      [`${sectionIndex}-${fieldIndex}`]: updatedValue,
    }));
  
    // ✅ Correctly update shape without modifying MobX observable directly
    if (sectionKey === "points") {
      updatedShape.points = updatedShape.points.map((p, idx) => 
          idx === sectionIndex ? { ...p, [fieldKey]: updatedValue } : p
      );
  } else if (sectionKey === "radius" || sectionKey === "majorAxis" || sectionKey === "minorAxis") {
      updatedShape[sectionKey] = updatedValue;
  } else {
      updatedShape[sectionKey] = {
          ...updatedShape[sectionKey],
          [fieldKey]: updatedValue,
      };
  }
  
    // ✅ Call ShapeStore to update MobX state
    ShapeStore.updateShape(shape.id, updatedShape);
  };
  
  

  let sections = [];

  if (shape.type === "Line") {
    sections = [
      {
        heading: "Starting Point",
        fields: [
          { label: "X1", value: shape.startPoint?.x },
          { label: "Y1", value: shape.startPoint?.y },
          { label: "Z1", value: shape.startPoint?.z },
        ],
      },
      {
        heading: "Ending Point",
        fields: [
          { label: "X2", value: shape.endPoint?.x },
          { label: "Y2", value: shape.endPoint?.y },
          { label: "Z2", value: shape.endPoint?.z },
        ],
      },
    ];
  } else if (shape.type === "Circle") {
    sections = [
      {
        heading: "Center",
        fields: [
          { label: "X", value: shape.center?.x },
          { label: "Y", value: shape.center?.y },
          { label: "Z", value: shape.center?.z },
        ],
      },
      { heading: "Radius", fields: [{ label: "Radius", value: shape.radius }] },
    ];
  } else if (shape.type === "Ellipse") {
    sections = [
      {
        heading: "Center",
        fields: [
          { label: "X", value: shape.center?.x },
          { label: "Y", value: shape.center?.y },
          { label: "Z", value: shape.center?.z },
        ],
      },
      {
        heading: "Axes",
        fields: [
          { label: "Major Axis", value: shape.majorAxis },
          { label: "Minor Axis", value: shape.minorAxis },
        ],
      },
    ];
  } else if (shape.type === "PolyLine" && Array.isArray(shape.points)) {

    sections = shape.points.map((point, index) => ({
      heading: `Point ${index + 1}`,
      fields: [
        { label: "X", value: point?.x ?? "N/A" },
        { label: "Y", value: point?.y ?? "N/A" },
        { label: "Z", value: point?.z ?? "N/A" },
      ],
      
    }));
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-80">
      {sections.map((section, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-md font-bold text-gray-700">{section.heading}</h3>
          <div className="flex flex-col">
            {section.fields.map((field, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mt-2">{field.label}</label>
                <input
                  type="number"
                  className="border rounded-md p-1 w-full"
                  value={inputValues[`${index}-${i}`] ?? field.value ?? ""}
                  onChange={(e) => handleInputChange(index, i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

PropertiesPanel.propTypes = {
  shapeId: PropTypes.string, // Expecting a shape ID
};

export default PropertiesPanel;
