/* tslint:disable deprecation*/

import { ElementRef, Injectable, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SvgAttributes, SvgTypes } from '../../components/svg-attributes';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { DrawingService } from '../drawing/drawing.service';
import { ManipulationService } from '../manipulation/manipulation.service';
import { MagneticPoints, SelectionProperties } from './selection-properties';

export interface Rectangle {
  x: number;
  y: number;
  height: number;
  width: number;
}

const CENTER_OF_ELEMENT = 2;
const FIND_MIDDLE = 2.0;
const PADDING = 5;
const DIVISION = 2;
const RIGHT_CLICK = 3;
const LEFT_CLICK = 1;
const ALLIGN = 1;
const ZERO = 0;
const CONTROL_SELECT_ID = 'controlSelect';
const CONTROL_POINT_ID = 'controlPoint';
const SELECTED_BOX_ID = 'selectedBox';
const DEFS = 'defs';
const CURSOR = 'crosshair';
const NONE = 'none';
const DEFAULT_MAG_POINT = 'topRight';

@Injectable({
  providedIn: 'root',
})

export class SelectionService extends ActiveToolService {
  private properties: SelectionProperties = new SelectionProperties();
  private selectedBox: Rectangle;
  private stateBox: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateArray: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private drawingService: DrawingService;
  private clipboardService: ClipboardService;

  controlsBoxCreated: boolean;
  magneticPoint: string;
  isMagnetised: boolean;
  rotate = 0;
  onRotate = false;
  wasTransformed = false;

  constructor(private manipulationService: ManipulationService) {
    super();
  }

  initialisation(rendererFactory: RendererFactory2, anchorSVJ: ElementRef, clipboardService: ClipboardService,
                 drawingService: DrawingService): void {
    this.properties.svgElement = anchorSVJ;
    this.properties.renderer = rendererFactory.createRenderer(null, null);
    this.clipboardService = clipboardService;
    this.drawingService = drawingService;
    this.properties.selectedElements = [];
    this.magneticPoint = DEFAULT_MAG_POINT;
  }

  setToolbarWidth(toolbarWidth: number): void {
    this.properties.toolbarWidth = toolbarWidth;
  }

  setAmountScrolled(scrollX: number, scrollY: number): void {
    this.properties.amountScrolledX = scrollX;
    this.properties.amountScrolledY = scrollY;
  }

  findSelectedElements(): void {
    this.properties.indexArray = [];
    this.properties.selectedElements.forEach((element: SVGElement) => {
      this.properties.indexArray.push(this.drawingService.findDrawingArrayElementIndex(element));
    });
  }

  replaceSelectedElements(): void {
    if (this.properties.selectedElements.length === 1) {
      this.drawingService.replaceDrawingArrayElement(this.properties.selectedElements[0],
        this.properties.indexArray.pop() as number);
    } else {
      this.drawingService.replaceMultipleDrawingArrayElements(this.properties.selectedElements, this.properties.indexArray);
    }
    this.findSelectedElements();
  }

  replaceRotateElements(onRotate: boolean): void {
    if (onRotate) {
      this.drawingService.replaceMultipleDrawingArrayElements(this.properties.selectedElements, this.properties.indexArray);
    } else {
      this.drawingService.allDrawings.pop();
      this.drawingService.drawingsIndex--;
      this.replaceSelectedElements();
    }
    this.onRotate = false;
    this.findSelectedElements();
  }

  mouseDown(event: MouseEvent): void {
    this.onRotate = true;
    if (event.which === LEFT_CLICK) {
      const xPosition = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - PADDING + ALLIGN;
      const yPosition = event.clientY + this.properties.amountScrolledY - PADDING + ALLIGN;
      const clickedElement = event.target as SVGGraphicsElement;

      this.manipulationService.x1 = xPosition;
      this.manipulationService.y1 = yPosition;
      if (clickedElement === this.properties.topLeft || clickedElement === this.properties.topRight
        || clickedElement === this.properties.bottomLeft || clickedElement === this.properties.bottomRight) {
        this.properties.isResizeDiagonal = true;
        if (clickedElement === this.properties.topLeft || clickedElement === this.properties.bottomLeft) {
          this.manipulationService.isLeftControl = true;
        }
        if (clickedElement === this.properties.topLeft || clickedElement === this.properties.topRight) {
          this.manipulationService.isTopControl = true;
        }
      } else if (clickedElement === this.properties.midLeft || clickedElement === this.properties.midRight) {
        this.properties.isResizeHorizontal = true;
        if (clickedElement === this.properties.midLeft) {
          this.manipulationService.isLeftControl = true;
        }
      } else if (clickedElement === this.properties.topMid || clickedElement === this.properties.bottomMid) {
        this.properties.isResizeVertical = true;
        if (clickedElement === this.properties.topMid) {
          this.manipulationService.isTopControl = true;
        }
      } else if (this.controlsBoxCreated) {
        this.updateBox(xPosition, yPosition, event);
      } else {
        this.leftClick(event);
      }
    } else if (event.which === RIGHT_CLICK) {
      this.rightClick(event);
    }
    this.manipulationService.updateInitialCoordinates(this.properties.selectedElements);
  }

  private updateBox(xPosition: number, yPosition: number, event: MouseEvent): void {
    if (xPosition < this.selectedBox.x + this.selectedBox.width && xPosition > this.selectedBox.x
      && yPosition < this.selectedBox.y + this.selectedBox.height && yPosition > this.selectedBox.y) {
      this.manipulationService.initialTranslateCoordinates = [];
      this.manipulationService.initialTransformStringArray = [];
      this.manipulationService.initialRotateCoordinates = [];
      this.manipulationService.updateInitialCoordinates(this.properties.selectedElements);
      this.properties.isTranslate = true;
      this.updateMagneticPoint();
    } else {
      this.leftClick(event);
    }
  }

  leftClick(event: MouseEvent): void {
    if (this.controlsBoxCreated) {
      this.removeControls();
    }
    this.properties.selectedElements = [];
    const selectedElement = event.target as SVGGraphicsElement;
    if (selectedElement.parentNode !== null && selectedElement.nodeName !== SvgTypes.SVG
      && selectedElement.nodeName !== SvgTypes.TSPAN) {
      this.properties.selectedElements.push(selectedElement.parentNode as SVGGraphicsElement);
    } else if (selectedElement.nodeName === SvgTypes.TSPAN) {
      const parentSelectedElements = selectedElement.parentNode as SVGGraphicsElement;
      this.properties.selectedElements.push(parentSelectedElements.parentNode as SVGGraphicsElement);
    }
    this.createSelect();
    this.properties.selectCreated = true;
    this.properties.x1SelectionBox = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - PADDING + ALLIGN;
    this.properties.y1SelectionBox = event.clientY + this.properties.amountScrolledY - PADDING + ALLIGN;
  }

  private rightClick(event: MouseEvent): void {
    if (this.controlsBoxCreated) {
      this.removeControls();
    }
    const selectedElement = event.target as SVGGraphicsElement;
    if (selectedElement.parentNode !== null && selectedElement.nodeName !== SvgTypes.SVG) {
      if (selectedElement.id === SELECTED_BOX_ID || selectedElement.id === CONTROL_POINT_ID) {
        this.removeControls();
        this.switchElements(selectedElement);
        this.calculateRectangle();
      }
    }

    this.createSelect();
    this.properties.selectCreated = true;
    this.properties.x1SelectionBox = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - PADDING + ALLIGN;
    this.properties.y1SelectionBox = event.clientY + this.properties.amountScrolledY - PADDING + ALLIGN;
  }

  private switchElements(element: SVGGraphicsElement): void {
    const tempElement = element.parentNode as SVGGraphicsElement;
    if (tempElement.nodeName !== SvgTypes.SVG && tempElement.nodeName !== SvgTypes.DIV) {
      if (this.properties.selectedElements.includes(tempElement)) {
        const index = this.properties.selectedElements.indexOf(tempElement);
        if (index !== -1) {
          this.properties.selectedElements.splice(index, 1);
        }
      } else {
        this.properties.selectedElements.push(tempElement);
      }
    }
  }

  mouseMove(event: MouseEvent): void {
    const xPosition = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - PADDING + ALLIGN;
    const yPosition = event.clientY + this.properties.amountScrolledY - PADDING + ALLIGN;

    this.properties.x2SelectionBox = xPosition;
    this.properties.y2SelectionBox = yPosition;
    if (event.which === LEFT_CLICK) {
      this.chooseManipulationType();
    }
    if (event.which === RIGHT_CLICK) {
      if (this.properties.selectCreated) {
        this.properties.x2SelectionBox = event.clientX - this.properties.toolbarWidth + this.properties.amountScrolledX - PADDING;
        this.properties.y2SelectionBox = event.clientY + this.properties.amountScrolledY - PADDING;
        this.drawSelect(this.properties.x1SelectionBox, this.properties.x2SelectionBox,
          this.properties.y1SelectionBox, this.properties.y2SelectionBox);
      }
    }
  }

  private chooseManipulationType(): void {
    if (this.properties.isTranslate) {
      this.removeControls();
      this.manipulationService.translate(this.properties.renderer, this.properties.selectedElements,
        this.properties.x2SelectionBox, this.properties.y2SelectionBox);
      this.wasTransformed = true;
    } else if (this.properties.isResizeDiagonal) {
      this.removeControls();
      this.manipulationService.resizeDiagonal(this.properties.renderer, this.properties.selectedElements,
        this.properties.x2SelectionBox, this.properties.y2SelectionBox);
      this.wasTransformed = true;
    } else if (this.properties.isResizeHorizontal) {
      this.removeControls();
      this.manipulationService.resizeHorizontal(this.properties.renderer, this.properties.selectedElements,
        this.properties.x2SelectionBox, this.properties.y2SelectionBox);
      this.wasTransformed = true;
    } else if (this.properties.isResizeVertical) {
      this.removeControls();
      this.manipulationService.resizeVertical(this.properties.renderer, this.properties.selectedElements,
        this.properties.x2SelectionBox, this.properties.y2SelectionBox);
      this.wasTransformed = true;
    } else if (this.properties.selectCreated) {
      this.properties.selectedElements = [];
      this.drawSelect(this.properties.x1SelectionBox, this.properties.x2SelectionBox,
        this.properties.y1SelectionBox, this.properties.y2SelectionBox);
      this.wasTransformed = true;
    }
  }

  mouseUp(event: MouseEvent): void {
    if (this.controlsBoxCreated) {
      this.removeControls();
    }

    if (!this.properties.isTranslate && !this.properties.isResizeDiagonal
      && !this.properties.isResizeHorizontal && !this.properties.isResizeVertical) {
      this.properties.selectCreated = false;
      this.properties.x1SelectionBox = this.properties.selectionBox.getBBox().x;
      this.properties.x2SelectionBox = this.properties.selectionBox.getBBox().x + this.properties.selectionBox.getBBox().width;
      this.properties.y1SelectionBox = this.properties.selectionBox.getBBox().y;
      this.properties.y2SelectionBox = this.properties.selectionBox.getBBox().y + this.properties.selectionBox.getBBox().height;

      if (event.which === LEFT_CLICK) {
        this.findOverlapedElements();
        this.properties.renderer.removeChild(this.properties.svgElement, this.properties.selectionBox);
        this.findSelectedElements();
      } else if (event.which === RIGHT_CLICK) {
        const element = event.target as SVGGraphicsElement;
        if (element.getAttribute(SvgAttributes.ID) !== DEFS && element.getAttribute(SvgAttributes.ID) !== CONTROL_POINT_ID
          && element.getAttribute(SvgAttributes.ID) !== CONTROL_SELECT_ID && element.getAttribute(SvgAttributes.ID) !== SELECTED_BOX_ID) {
          this.switchElements(element);
        }
        this.findOverlapedElementsRightClick();
        this.properties.renderer.removeChild(this.properties.svgElement, this.properties.selectionBox);
      }
    } else if ((this.properties.isTranslate || this.properties.isResizeDiagonal
      || this.properties.isResizeHorizontal || this.properties.isResizeVertical ) && this.wasTransformed && !this.isMagnetised) {
      this.replaceSelectedElements();
    }
    this.wasTransformed = false;
    this.resetParameters();
  }

  updateCoordinates(): void {
    this.manipulationService.initialTranslateCoordinates = [];
    this.manipulationService.initialTransformStringArray = [];
    this.manipulationService.initialRotateCoordinates = [];
    this.manipulationService.updateInitialCoordinates(this.properties.selectedElements);
    this.rotate = 0;
  }

  private resetTransforms(): void {
    this.properties.isTranslate = false;
    this.properties.isResizeDiagonal = false;
    this.properties.isResizeHorizontal = false;
    this.properties.isResizeVertical = false;
  }

  private resetControls(): void {
    this.manipulationService.isLeftControl = false;
    this.manipulationService.isTopControl = false;
  }

  private drawSelect(x1: number, x2: number, y1: number, y2: number): void {
    const SELECT_FILL = 'black';
    const SELECT_OPACITY = '0.1';
    const SELECT_STROKE = 'grey';
    const SELECT_STROKE_WIDTH = '1';
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    const x: number = Math.min(x1, x2);
    const y: number = Math.min(y1, y2);

    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.X, (x).toString());
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.Y, (y).toString());
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.WIDTH, width.toString());
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.HEIGHT, height.toString());
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.FILL, SELECT_FILL);
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.ID, CONTROL_SELECT_ID);
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.FILL_OPACITY, SELECT_OPACITY);
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.STROKE, SELECT_STROKE);
    this.properties.renderer.setAttribute(this.properties.selectionBox, SvgAttributes.STROKE_WIDTH, SELECT_STROKE_WIDTH);
  }

  selectAllElements() {
    if (this.controlsBoxCreated) {
      this.removeControls();
    }

    this.properties.svgElement.nativeElement.childNodes.forEach((element: SVGGraphicsElement) => {
      if (element.getAttribute(SvgAttributes.ID) !== DEFS && element.getAttribute(SvgAttributes.ID) !== CONTROL_POINT_ID
        && element.getAttribute(SvgAttributes.ID) !== CONTROL_SELECT_ID && element.getAttribute(SvgAttributes.ID) !== SELECTED_BOX_ID) {
        this.properties.selectedElements.push(element);
      }
    });
    this.resetParameters();
  }

  private resetParameters(): void {
    this.updateCoordinates();
    this.resetControls();
    if (this.properties.isTranslate && this.isMagnetised) {
      this.manipulationService.allignWithGrid(this.properties.selectedElements, this.properties.renderer);
      this.replaceSelectedElements();
    }
    this.resetTransforms();
    this.calculateRectangle();
    this.manipulationService.findCenterBox(this.properties.selectedElementsBox);
  }

  private createSelect(): void {
    this.properties.selectionBox = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.selectionBox);
  }

  private findOverlapedElementsRightClick(): void {
    this.properties.svgElement.nativeElement.childNodes.forEach((element: SVGGraphicsElement) => {
      if ((element !== this.properties.selectionBox) && element.getAttribute(SvgAttributes.ID) !== DEFS
        && element !== this.properties.selectionBox) {
        const x1Element = element.getBBox().x;
        const x2Element = element.getBBox().x + element.getBBox().width;
        const y1Element = element.getBBox().y;
        const y2Element = element.getBBox().y + element.getBBox().height;
        if ((x1Element >= this.properties.x1SelectionBox && x1Element <= this.properties.x2SelectionBox)
          || (x2Element >= this.properties.x1SelectionBox && x2Element <= this.properties.x2SelectionBox)) {
          if ((this.properties.y1SelectionBox >= y1Element) && (this.properties.y1SelectionBox <= y2Element)
            || (this.properties.y2SelectionBox >= y1Element) && (this.properties.y2SelectionBox <= y2Element)
            || ((y1Element >= this.properties.y1SelectionBox) && (y1Element <= this.properties.y2SelectionBox)
              || (y2Element >= this.properties.y1SelectionBox) && (y2Element <= this.properties.y2SelectionBox))) {
            this.switchElements(element);
          }
        } else if ((y1Element >= this.properties.y1SelectionBox && y1Element <= this.properties.y2SelectionBox)
          || (y2Element >= this.properties.y1SelectionBox && y2Element <= this.properties.y2SelectionBox)) {
          if ((this.properties.x1SelectionBox >= x1Element) && (this.properties.x1SelectionBox <= x2Element)
            || (this.properties.x2SelectionBox >= x1Element) && (this.properties.x2SelectionBox <= x2Element)
            || ((x1Element >= this.properties.x1SelectionBox && x1Element <= this.properties.x2SelectionBox)
              || (x2Element >= this.properties.x1SelectionBox && x2Element <= this.properties.x2SelectionBox))) {
            this.switchElements(element);
          }
        } else if (((this.properties.x1SelectionBox >= x1Element && this.properties.x1SelectionBox <= x2Element)
          || (this.properties.x2SelectionBox >= x1Element && this.properties.x2SelectionBox <= x2Element))
          && ((this.properties.y1SelectionBox >= y1Element) && (this.properties.y1SelectionBox <= y2Element)
            || (this.properties.y2SelectionBox >= y1Element) && (this.properties.y2SelectionBox <= y2Element))) {
          this.switchElements(element);
        }
      }
    });
  }

  private findOverlapedElements(): void {
    this.properties.svgElement.nativeElement.childNodes.forEach((element: SVGGraphicsElement) => {
      if ((element !== this.properties.selectionBox) && element.getAttribute(SvgAttributes.ID) !== DEFS
        && element !== this.properties.selectionBox) {
        const x1Element = element.getBBox().x;
        const x2Element = element.getBBox().x + element.getBBox().width;
        const y1Element = element.getBBox().y;
        const y2Element = element.getBBox().y + element.getBBox().height;
        if ((x1Element >= this.properties.x1SelectionBox && x1Element <= this.properties.x2SelectionBox)
          || (x2Element >= this.properties.x1SelectionBox && x2Element <= this.properties.x2SelectionBox)) {
          if ((this.properties.y1SelectionBox >= y1Element) && (this.properties.y1SelectionBox <= y2Element)
            || (this.properties.y2SelectionBox >= y1Element) && (this.properties.y2SelectionBox <= y2Element)
            || ((y1Element >= this.properties.y1SelectionBox) && (y1Element <= this.properties.y2SelectionBox)
              || (y2Element >= this.properties.y1SelectionBox) && (y2Element <= this.properties.y2SelectionBox))) {
            this.properties.selectedElements.push(element);
          }
        } else if ((y1Element >= this.properties.y1SelectionBox && y1Element <= this.properties.y2SelectionBox)
          || (y2Element >= this.properties.y1SelectionBox && y2Element <= this.properties.y2SelectionBox)) {
          if ((this.properties.x1SelectionBox >= x1Element) && (this.properties.x1SelectionBox <= x2Element)
            || (this.properties.x2SelectionBox >= x1Element) && (this.properties.x2SelectionBox <= x2Element)
            || ((x1Element >= this.properties.x1SelectionBox && x1Element <= this.properties.x2SelectionBox)
              || (x2Element >= this.properties.x1SelectionBox && x2Element <= this.properties.x2SelectionBox))) {
            this.properties.selectedElements.push(element);
          }
        } else if (((this.properties.x1SelectionBox >= x1Element && this.properties.x1SelectionBox <= x2Element)
          || (this.properties.x2SelectionBox >= x1Element && this.properties.x2SelectionBox <= x2Element))
          && ((this.properties.y1SelectionBox >= y1Element) && (this.properties.y1SelectionBox <= y2Element)
            || (this.properties.y2SelectionBox >= y1Element) && (this.properties.y2SelectionBox <= y2Element))) {
          this.properties.selectedElements.push(element);
        }
      }
    });
  }

  copy(): void {
    this.clipboardService.copy(this.properties.selectedElements);
    this.setClipboardArray(true);
  }

  paste(): void {
    this.removeControls();
    this.clipboardService.paste();
  }

  rotateAlt(angle: number) {
    this.findSelectedElements();
    const DEFAULT_ROTATION_ALT = 1;
    if (this.controlsBoxCreated) {
      this.rotate = (angle < ZERO) ? this.rotate + DEFAULT_ROTATION_ALT : this.rotate - DEFAULT_ROTATION_ALT;
      this.manipulationService.rotateByBox(this.properties.selectedElements, this.rotate);
      this.removeControls();
      this.calculateRectangle();
    }
    this.replaceRotateElements(this.onRotate);
  }

  rotateNormal(angle: number) {
    this.findSelectedElements();
    const DEFAULT_ROTATION_NORMAL = 15;
    if (this.controlsBoxCreated) {
      this.rotate = (angle < ZERO) ? this.rotate + DEFAULT_ROTATION_NORMAL : this.rotate - DEFAULT_ROTATION_NORMAL;
      this.manipulationService.rotateByBox(this.properties.selectedElements, this.rotate);
      this.removeControls();
      this.calculateRectangle();
    }
    this.replaceRotateElements(this.onRotate);
  }

  rotateShift(angle: number): void {
    this.findSelectedElements();
    const DEFAULT_ROTATION_SHIFT = 15;
    if (this.controlsBoxCreated) {
      this.rotate = (angle < ZERO) ? this.rotate + DEFAULT_ROTATION_SHIFT : this.rotate - DEFAULT_ROTATION_SHIFT;
      this.manipulationService.rotateByElement(this.properties.selectedElements, this.rotate);
      this.removeControls();
      this.calculateRectangle();
    }
    this.replaceRotateElements(this.onRotate);
  }

  duplicate(): void {
    this.removeControls();
    this.clipboardService.duplicate(this.properties.selectedElements);
  }

  cut(): void {
    this.clipboardService.cut(this.properties.selectedElements);
    this.setClipboardArray(true);
    this.drawingService.nErasedElements = 0;
    this.removeControls();
    this.properties.selectedElements.forEach((element) => {
      this.drawingService.eraseElementUpdateAllDrawings(element as SVGElement);
      this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, element);
    });
  }

  delete(): void {
    this.removeControls();
    this.clipboardService.delete(this.properties.selectedElements);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.selectedElementsBox);
  }

  private findRectangleXMin(): number {
    /*tslint:disable only-arrow-functions*/
    return Math.min.apply(Math, this.properties.selectedElements.map(function(element) {
      if (element.nodeName === SvgTypes.G) {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null
          && element.getAttribute(SvgAttributes.STROKE_WIDTH) !== null) {
          return (element.getBBox().x - Number((element.firstChild as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)));
        } else {
          return element.getBBox().x;
        }
      } else {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null
          && element.getAttribute(SvgAttributes.STROKE_WIDTH) !== null) {
          return (element.getBBox().x - Number((element as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)));
        } else {
          return element.getBBox().x;
        }
      }
    }));
  }

  private findRectangleYMin(): number {
    /*tslint:disable only-arrow-functions*/
    return Math.min.apply(Math, this.properties.selectedElements.map(function(element) {
      if (element.nodeName === SvgTypes.G) {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().y -
            Number((element.firstChild as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT);
        } else {
          return element.getBBox().y;
        }
      } else {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().y - Number((element as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT);
        } else {
          return element.getBBox().y;
        }
      }
    }));
  }

  private findRectangleHeight(yMin: number): number {
    /*tslint:disable only-arrow-functions*/
    return Math.max.apply(Math, this.properties.selectedElements.map(function(element) {
      if (element.nodeName === SvgTypes.G) {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().height + element.getBBox().y)
            + Number((element.firstChild as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT - yMin;
        } else {
          return (element.getBBox().height + element.getBBox().y) - yMin;
        }
      } else {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().height + element.getBBox().y)
            + Number((element as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT - yMin;
        } else {
          return (element.getBBox().height + element.getBBox().y) - yMin;
        }
      }
    }));
  }

  private findRectangleWidth(xMin: number): number {
    /*tslint:disable only-arrow-functions*/
    return Math.max.apply(Math, this.properties.selectedElements.map(function(element) {
      if (element.nodeName === SvgTypes.G) {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().width + element.getBBox().x)
            + Number((element.firstChild as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT - xMin;
        } else {
          return (element.getBBox().width + element.getBBox().x) - xMin;
        }
      } else {
        if (element.getAttribute(SvgAttributes.STROKE_WIDTH) !== undefined && element !== null) {
          return (element.getBBox().width + element.getBBox().x)
            + Number((element as SVGAElement).getAttribute(SvgAttributes.STROKE_WIDTH)) / CENTER_OF_ELEMENT - xMin;
        } else {
          return (element.getBBox().width + element.getBBox().x) - xMin;
        }
      }
    }));
  }

  private calculateRectangle(): void {
    const xMin = this.findRectangleXMin();
    const yMin = this.findRectangleYMin();
    const width = this.findRectangleWidth(xMin);
    const height = this.findRectangleHeight(yMin);
    this.selectedBox = { x: xMin, y: yMin, width, height };
    if (this.properties.selectedElements.length > 0) {
      this.createControls();
    }
  }

  private setControlProperties(control: SVGElement): void {
    const CONTROL_POINT_HEIGHT = '5';
    const CONTROL_POINT_FILL = 'white';
    const CONTROL_POINT_STROKE = 'blue';
    const CONTROL_POINT_WIDTH = '5';
    this.properties.renderer.setAttribute(control, SvgAttributes.WIDTH, CONTROL_POINT_WIDTH);
    this.properties.renderer.setAttribute(control, SvgAttributes.HEIGHT, CONTROL_POINT_HEIGHT);
    this.properties.renderer.setAttribute(control, SvgAttributes.FILL, CONTROL_POINT_FILL);
    this.properties.renderer.setAttribute(control, SvgAttributes.STROKE, CONTROL_POINT_STROKE);
    this.properties.renderer.setAttribute(control, SvgAttributes.ID, CONTROL_POINT_ID);
  }

  private createControls(): void {
    this.properties.topLeft = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.topLeft, SvgAttributes.X, (this.selectedBox.x).toString());
    this.properties.renderer.setAttribute(this.properties.topLeft, SvgAttributes.Y, (this.selectedBox.y).toString());
    this.properties.topLeft.style.cursor = CURSOR;
    this.setControlProperties(this.properties.topLeft);

    this.properties.topRight = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.topRight, SvgAttributes.X,
      (this.selectedBox.width + this.selectedBox.x - PADDING).toString());
    this.properties.renderer.setAttribute(this.properties.topRight, SvgAttributes.Y, (this.selectedBox.y).toString());
    this.properties.topRight.style.cursor = CURSOR;
    this.setControlProperties(this.properties.topRight);

    this.properties.bottomLeft = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.bottomLeft, SvgAttributes.X, (this.selectedBox.x).toString());
    this.properties.renderer.setAttribute(this.properties.bottomLeft, SvgAttributes.Y,
      (this.selectedBox.y + this.selectedBox.height - PADDING).toString());
    this.properties.bottomLeft.style.cursor = CURSOR;
    this.setControlProperties(this.properties.bottomLeft);

    this.properties.bottomRight = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.bottomRight, SvgAttributes.X,
      (this.selectedBox.x + this.selectedBox.width - PADDING).toString());
    this.properties.renderer.setAttribute(this.properties.bottomRight, SvgAttributes.Y,
      (this.selectedBox.y + this.selectedBox.height - PADDING).toString());
    this.properties.bottomRight.style.cursor = CURSOR;
    this.setControlProperties(this.properties.bottomRight);

    this.properties.topMid = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.topMid, SvgAttributes.X,
      ((this.selectedBox.x + (this.selectedBox.width) / DIVISION)).toString());
    this.properties.renderer.setAttribute(this.properties.topMid, SvgAttributes.Y, (this.selectedBox.y).toString());
    this.properties.topMid.style.cursor = CURSOR;
    this.setControlProperties(this.properties.topMid);

    this.properties.bottomMid = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.bottomMid, SvgAttributes.X,
      ((this.selectedBox.x + (this.selectedBox.width) / DIVISION)).toString());
    this.properties.renderer.setAttribute(this.properties.bottomMid, SvgAttributes.Y,
      (this.selectedBox.y + this.selectedBox.height - PADDING).toString());
    this.properties.bottomMid.style.cursor = CURSOR;
    this.setControlProperties(this.properties.bottomMid);

    this.properties.midLeft = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.midLeft, SvgAttributes.X, (this.selectedBox.x).toString());
    this.properties.renderer.setAttribute(this.properties.midLeft, SvgAttributes.Y,
      (this.selectedBox.y + (this.selectedBox.height / DIVISION)).toString());
    this.properties.midLeft.style.cursor = CURSOR;
    this.setControlProperties(this.properties.midLeft);

    this.properties.midRight = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.properties.renderer.setAttribute(this.properties.midRight, SvgAttributes.X,
      (this.selectedBox.x + this.selectedBox.width - PADDING).toString());
    this.properties.renderer.setAttribute(this.properties.midRight, SvgAttributes.Y,
      (this.selectedBox.y + (this.selectedBox.height / DIVISION)).toString());
    this.properties.midRight.style.cursor = CURSOR;
    this.setControlProperties(this.properties.midRight);


    this.properties.selectedElementsBox = this.properties.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.updateSelectedElementBoxAttributes();
    this.appendControlPoints();
    this.controlsBoxCreated = true;
    this.setBoxCreated(true);
  }

  private updateSelectedElementBoxAttributes(): void {
    const FINAL_SELECT_STROKE = 'black';

    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.X, (this.selectedBox.x).toString());
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.Y, (this.selectedBox.y).toString());
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.WIDTH, this.selectedBox.width.toString());
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.HEIGHT, this.selectedBox.height.toString());
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.FILL_OPACITY, ZERO.toString());
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.FILL, NONE);
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.STROKE, FINAL_SELECT_STROKE);
    this.properties.renderer.setAttribute(this.properties.selectedElementsBox, SvgAttributes.ID, SELECTED_BOX_ID);
  }
  private appendControlPoints(): void {
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.selectedElementsBox);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.topLeft);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.topRight);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.bottomLeft);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.bottomRight);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.topMid);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.bottomMid);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.midLeft);
    this.properties.renderer.appendChild(this.properties.svgElement.nativeElement, this.properties.midRight);
  }

  removeControlsForPanel() {
    if (this.controlsBoxCreated) {
      this.removeControls();
    }
  }

  removeControls(): void {
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.topLeft);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.topRight);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.bottomLeft);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.bottomRight);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.topMid);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.bottomMid);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.midLeft);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.midRight);
    this.properties.renderer.removeChild(this.properties.svgElement.nativeElement, this.properties.selectedElementsBox);
    this.controlsBoxCreated = false;
    this.setBoxCreated(false);
  }

  setBoxCreated(stateBox: boolean): void {
    this.stateBox.next(stateBox);
  }

  getBoxCreated(): Observable<boolean> {
    return this.stateBox.asObservable();
  }

  setClipboardArray(stateArray: boolean): void {
    this.stateArray.next(stateArray);
  }

  getClipboardArray(): Observable<boolean> {
    return this.stateArray.asObservable();
  }

  updateMagneticPoint() {
    switch (this.magneticPoint) {
      case MagneticPoints.TOP_LEFT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x;
        this.manipulationService.y1SelectedBox = this.selectedBox.y;
        break;

      case MagneticPoints.TOP_RIGHT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width;
        this.manipulationService.y1SelectedBox = this.selectedBox.y;
        break;

      case MagneticPoints.TOP_MID:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width / FIND_MIDDLE;
        this.manipulationService.y1SelectedBox = this.selectedBox.y;
        break;

      case MagneticPoints.CENTER:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width / FIND_MIDDLE;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height / FIND_MIDDLE;
        break;

      case MagneticPoints.MID_RIGHT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height / FIND_MIDDLE;
        break;

      case MagneticPoints.MID_LEFT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height / FIND_MIDDLE;
        break;
      case MagneticPoints.BOTTOM_LEFT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height;
        break;

      case MagneticPoints.BOTTOM_RIGHT:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height;
        break;

      case MagneticPoints.BOTTOM_MID:
        this.manipulationService.x1SelectedBox = this.selectedBox.x + this.selectedBox.width / FIND_MIDDLE;
        this.manipulationService.y1SelectedBox = this.selectedBox.y + this.selectedBox.height;
        break;
    }
  }
}
