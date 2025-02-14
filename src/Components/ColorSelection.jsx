import { useState } from "react";
import { observer } from "mobx-react-lite";
import ShapeStore from "../Store/ShapeStore";

const ColorSelection = observer(() => {
  const [selectedColor, setSelectedColor] = useState(ShapeStore.currentColor);

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `RGB (${r}, ${g}, ${b})`;
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);

    if (ShapeStore.selectedShapeId) {
      ShapeStore.updateShapeColor(newColor); // ✅ Update only selected shape
    } else {
      ShapeStore.setCurrentColor(newColor); // ✅ Update global color for new shapes
    }
  };

  return (
    <div className="mt-4 w-80">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Color</h3>
      <div className="flex items-center">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="w-10 h-10 cursor-pointer"
        />
        <span className="ml-2 text-gray-700">{hexToRgb(selectedColor)}</span>
      </div>
    </div>
  );
});

export default ColorSelection;
