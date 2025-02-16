import ShapeStore from "../Store/ShapeStore"; 

function uploadShapesFromFile(file) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const jsonData = JSON.parse(event.target.result); // Parse JSON file
            if (Array.isArray(jsonData)) {
                jsonData.forEach((shape) => {
                    ShapeStore.addShapeFromFile(shape); // Add each shape to the store
                });
                console.log("✅ Shapes uploaded successfully!", jsonData);
            } else {
                console.error("❌ Invalid file format! Expected an array.");
            }
        } catch (error) {
            console.error("❌ Error parsing JSON file:", error);
        }
    };

    reader.readAsText(file);
}

export default uploadShapesFromFile;
