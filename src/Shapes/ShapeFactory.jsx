import Line from "./Line";
import Circle from "./Circle";
import Ellipse from './Ellipse';
import Polyline from "./PolyLine";

class ShapeFactory {
  static createShape(type, scene) {
    switch (type) {
      case "Line":
        return new Line(scene);
      case "Circle":
        return new Circle(scene);
        case "Ellipse":
        return new Ellipse(scene);
        case "PolyLine":
          return new Polyline(scene);
      default:
        return null;
    }
  }
}

export default ShapeFactory;
