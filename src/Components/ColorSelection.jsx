import { useState } from "react";
import { observer } from "mobx-react-lite";
import ShapeStore from "../Store/ShapeStore";

const ColorSelection = observer(() => {
  const [selectedColor, setSelectedColor] = useState(ShapeStore.currentColor);
  const [opacity, setOpacity] = useState(ShapeStore.currentOpacity || 1); // Default opacity is 1 (fully opaque)

  // Convert HEX to RGB for display
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `RGB (${r}, ${g}, ${b})`;
  };

  // Handle color change
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);

    if (ShapeStore.selectedShapeId) {
      ShapeStore.updateShapeColor(newColor, opacity); // Update color with current opacity for selected shape
    } else {
      ShapeStore.setCurrentColor(newColor); // Update global color for new shapes
    }
  };

  // Handle opacity change
  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);

    if (ShapeStore.selectedShapeId) {
      ShapeStore.updateShapeColor(selectedColor, newOpacity); // Update color with new opacity for selected shape
    } else {
      ShapeStore.setCurrentOpacity(newOpacity); // Update global opacity for new shapes
    }
  };

  return (
    <div className="mt-4 w-80">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Color & Opacity</h3>
      <div className="flex items-center mb-4">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="w-10 h-10 cursor-pointer"
        />
        <span className="ml-2 text-gray-700">{hexToRgb(selectedColor)}</span>
      </div>

      <div className="flex items-center">
        <label className="mr-2 text-gray-700">Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={handleOpacityChange}
          className="w-20"
        />
        <span className="ml-2 text-gray-700">{(opacity * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
});

export default ColorSelection;
