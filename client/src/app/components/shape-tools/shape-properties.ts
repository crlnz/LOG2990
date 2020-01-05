export interface ShapeProperties {
    width?: number;
    height?: number;
    strokeWidth: number;
    secondaryColor: string;
    primaryColor: string;
    type: string;
}

export enum TraceType {
    FILL = 'Fill',
    OUTLINE = 'Outline',
    FILLOUTLINE = 'FillOutline',
}
