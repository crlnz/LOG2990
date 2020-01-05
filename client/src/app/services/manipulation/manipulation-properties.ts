export class ManipulationProperties {

    toolbarWidth: number;
    amountScrolledX = 0;
    amountScrolledY = 0;
    mousePosX: number;
    mousePosY: number;
    x1Element = 0;
    y1Element = 0;
    amountTranslatedX: number;
    amountTranslatedY: number;
    initAngle: number|undefined;
    rotation: number;
    boxCenterX: number;
    boxCenterY: number;
    boxWidth: number;
    boxHeight: number;
    boxX: number;
    boxY: number;
    elementX: number;
    elementY: number;
    elementHeight: number;
    elementWidth: number;
    elementCenterX: number[] = [];
    elementCenterY: number[] = [];
    stringTransform: string|null;
    initTranslate: string;
    initRotate = ' ';
    angleOfElement: number;
    initAngles: number[] = [];
    initTransform = ' ';
    enteredOnce: boolean[] = [];
}
