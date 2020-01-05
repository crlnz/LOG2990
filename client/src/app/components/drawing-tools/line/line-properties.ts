export class LineAttributes {
    xFirst: number;
    yFirst: number;
    xPointFirst: number;
    yPointFirst: number;
    currentLine: string;
    pattern: string;
    diameter: number;
    factor: number;
    isDragged = false;
    hasStarted = false;
    displayPoint: boolean;
    junction: string;
    pointArray: SVGElement[];
}
