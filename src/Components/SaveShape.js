import ShapeStore from "../Store/ShapeStore";

function saveShapesToFile() {
    // Convert shapesHistory to a JSON string
    const jsonData = JSON.stringify(ShapeStore.shapesHistory, null, 2);

    // Create a Blob and a downloadable link
    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "shapes_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export default saveShapesToFile; // ✅ Default export
