import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Injectable, Renderer2 } from '@angular/core';
import { SvgAttributes } from 'src/app/components/svg-attributes';
import { GridService } from '../grid/grid.service';
import { BORDERWIDTH, COMMA } from '../paintBucket/paint-bucket-properties';
import { ManipulationProperties } from './manipulation-properties';

interface TransformAttributes {
  name?: string;
  x: number;
  y: number;
  rotate?: number;
}
const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';
const ZERO = 0;
const MINUS_ONE = -1;
const ONE = 1;
const FIND_MIDDLE = 2;
const EMPTY_STRING = '';
const SPACE = ' ';
const ROTATE = 'r';
const SCALE = 's';

@Injectable({
  providedIn: 'root',
})
export class ManipulationService {
  private properties: ManipulationProperties = new ManipulationProperties();
  private index = ZERO;

  x1: number;
  y1: number;
  isLeftControl: boolean;
  isTopControl: boolean;
  x1SelectedBox: number;
  y1SelectedBox: number;
  initialTranslateCoordinates: TransformAttributes[] = [];
  initialRotateCoordinates: TransformAttributes[] = [];
  initialTransformStringArray: string[] = [];

  keyShiftOn: boolean;
  keyAltOn: boolean;

  constructor(private gridService: GridService) {}

  private calculateAmountTranslated(x2: number, y2: number): void {
    this.properties.amountTranslatedX = x2 - this.x1;
    this.properties.amountTranslatedY = y2 - this.y1;
  }

  setToolbarWidth(toolbarWidth: number): void {
    this.properties.toolbarWidth = toolbarWidth;
  }

  setAmountScrolled(scrollX: number, scrollY: number): void {
    this.properties.amountScrolledX = scrollX;
    this.properties.amountScrolledY = scrollY;
  }

  private initializeArrayForRotate(): void {
    this.properties.enteredOnce = [];
    this.properties.elementCenterX = [];
    this.properties.elementCenterY = [];
  }

  allignWithGrid(selectedElements: SVGGraphicsElement[], renderer: Renderer2): void {
    this.index = ZERO;
    const x2SelectedBox = this.x1SelectedBox + this.properties.amountTranslatedX;
    const y2SelectedBox = this.y1SelectedBox + this.properties.amountTranslatedY;
    let amountToTranslateX = -(x2SelectedBox % this.gridService.squareSize);
    let amountToTranslateY = -(y2SelectedBox % this.gridService.squareSize);

    if (Math.abs(amountToTranslateX) >= this.gridService.squareSize / FIND_MIDDLE) {
      amountToTranslateX = this.gridService.squareSize - Math.abs(amountToTranslateX);
    }
    if (Math.abs(amountToTranslateY) >= this.gridService.squareSize / FIND_MIDDLE) {
      amountToTranslateY = this.gridService.squareSize - Math.abs(amountToTranslateY);
    }
    amountToTranslateX -= BORDERWIDTH;
    amountToTranslateY -= BORDERWIDTH;
    this.findNewCoordinatesMag(selectedElements, amountToTranslateX, amountToTranslateY, renderer);
    this.updateInitialCoordinates(selectedElements);
  }

  private findNewCoordinatesMag(selectedElements: SVGGraphicsElement[], amountToTranslateX: number, amountToTranslateY: number,
                                renderer: Renderer2): void {
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGElement) => {
        this.findTransformAttributeOfElement(this.index);
        let transformString = SPACE;
        const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x
          + COMMA + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
        transformString = this.initialTransformStringArray[this.index].replace(previousTranslateString,
          OPEN_PARENTHESIS + (this.initialTranslateCoordinates[this.index].x + amountToTranslateX) + COMMA
          + (this.initialTranslateCoordinates[this.index].y + amountToTranslateY) + CLOSE_PARENTHESIS);
        renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString);
        this.index++;
      });
    });
  }

  translate(renderer: Renderer2, selectedElements: SVGGraphicsElement[], x: number, y: number): void {
    this.calculateAmountTranslated(x, y);
    this.index = ZERO;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGElement) => {
        this.findTransformAttributeOfElement(this.index);
        const translateX = this.properties.amountTranslatedX + this.initialTranslateCoordinates[this.index].x;
        const translateY = this.properties.amountTranslatedY + this.initialTranslateCoordinates[this.index].y;
        let transformString = EMPTY_STRING;

        if (this.initialTransformStringArray[this.index].search(SvgAttributes.TRANSLATE) > MINUS_ONE) {
          const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x
            + COMMA + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
          transformString = this.initialTransformStringArray[this.index].replace(previousTranslateString,
            OPEN_PARENTHESIS + translateX + COMMA + translateY + CLOSE_PARENTHESIS);
          renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString);
        } else {
          renderer.setAttribute(child, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
            + this.properties.amountTranslatedX + COMMA + this.properties.amountTranslatedY
            + CLOSE_PARENTHESIS + this.initialTransformStringArray[this.index]);
        }

        this.index++;
      });
    });
  }

  updateInitialCoordinates(selectedElements: SVGGraphicsElement[]): void {
    this.initialTranslateCoordinates = [];
    this.initialTransformStringArray = [];
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGElement) => {
        const transform = child.getAttribute(SvgAttributes.TRANSFORM);
        if (transform) {
          const transformAttributes = this.parseTransform(transform);
          this.initialTransformStringArray.push(this.convertTransformToString(transformAttributes));
          this.initialTranslateCoordinates.push(this.findTranslateCoordinates(transformAttributes));
          this.initialRotateCoordinates.push(this.findRotateCoordinates(transformAttributes));
        } else {
          this.initialTranslateCoordinates.push({ x: ZERO, y: ZERO });
          this.initialTransformStringArray.push(EMPTY_STRING);
          this.initialRotateCoordinates.push({ x: ZERO, y: ZERO, rotate: ZERO });
        }
      });
    });
    this.initializeArrayForRotate();
  }

  findCenterBox(box: SVGGraphicsElement): void {
    this.properties.boxX = Number(box.getAttribute(SvgAttributes.X));
    this.properties.boxY = Number(box.getAttribute(SvgAttributes.Y));
    this.properties.boxHeight = Number(box.getAttribute(SvgAttributes.HEIGHT));
    this.properties.boxWidth = Number(box.getAttribute(SvgAttributes.WIDTH));
    this.properties.boxCenterX = (this.properties.boxX) + (this.properties.boxWidth / FIND_MIDDLE);
    this.properties.boxCenterY = (this.properties.boxY) + (this.properties.boxHeight / FIND_MIDDLE);
  }

  findCenterElement(child: SVGAElement): void {
    this.properties.elementX = Number(child.getBoundingClientRect().left) - this.properties.toolbarWidth
      + this.properties.amountScrolledX - BORDERWIDTH;
    this.properties.elementY = Number(child.getBoundingClientRect().top) + this.properties.amountScrolledY - BORDERWIDTH;
    this.properties.elementHeight = Number(child.getBoundingClientRect().height);
    this.properties.elementWidth = Number(child.getBoundingClientRect().width);
    this.properties.elementCenterX.push(((this.properties.elementWidth + this.properties.elementX)
      + this.properties.elementX) / FIND_MIDDLE);
    this.properties.elementCenterY.push(((this.properties.elementHeight + this.properties.elementY)
      + this.properties.elementY) / FIND_MIDDLE);
  }

  private findTransformAttributeOfElement(index: number): void {
    this.findRotateAttributes(index);
    if (this.initialTransformStringArray[index] !== undefined) {
      this.properties.initTransform = this.initialTransformStringArray[index];
    }
    this.findTranslateAttributes(index);
  }

  private findRotateAttributes(index: number): void {
    if (this.initialRotateCoordinates[index].rotate !== undefined) {
      this.properties.initAngle = this.initialRotateCoordinates[index].rotate;
      if (this.properties.initAngle !== undefined) {
        this.properties.initRotate = SvgAttributes.ROTATE + OPEN_PARENTHESIS + this.properties.initAngle.toString() + COMMA
          + this.initialRotateCoordinates[index].x.toString() + COMMA + this.initialRotateCoordinates[index].y.toString()
          + CLOSE_PARENTHESIS;
      }
    }
  }

  private findTranslateAttributes(index: number): void {
    if (this.initialTranslateCoordinates[index] !== undefined) {
      this.properties.initTranslate = SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + this.initialTranslateCoordinates[index].x
        + COMMA + this.initialTranslateCoordinates[index].y + CLOSE_PARENTHESIS;
    } else {
      this.properties.initRotate = SPACE;
      this.properties.initTranslate = SPACE;
      this.properties.initTransform = SPACE;
    }
  }

  private addTransformElement(child: SVGAElement, angle: number, centerX: number, centerY: number): void {
    this.properties.angleOfElement = angle;
    const startNumber = this.properties.initTransform.indexOf(CLOSE_PARENTHESIS);
    const startString = this.properties.initTransform.charAt(startNumber + ONE);
    if (startString === SCALE || startString === ROTATE) {
      const stringTransform = this.properties.initTransform.substring(startNumber + ONE);
      child.setAttribute(SvgAttributes.TRANSFORM, this.properties.initTranslate + SvgAttributes.ROTATE + OPEN_PARENTHESIS
        + this.properties.angleOfElement + COMMA + centerX.toString() + COMMA + centerY.toString() + CLOSE_PARENTHESIS
        + stringTransform);
    } else {
      child.setAttribute(SvgAttributes.TRANSFORM, this.properties.initTranslate + SvgAttributes.ROTATE + OPEN_PARENTHESIS
        + this.properties.angleOfElement + COMMA + centerX.toString() + COMMA + centerY.toString() + CLOSE_PARENTHESIS);
    }
  }

  rotateByBox(selectedElements: SVGGraphicsElement[], angle: number): void {
    this.initializeArrayForRotate();
    this.index = ZERO;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGAElement) => {
        this.findTransformAttributeOfElement(this.index);
        this.addTransformElement(child, angle, (this.properties.boxCenterX - this.initialTranslateCoordinates[this.index].x),
          (this.properties.boxCenterY - this.initialTranslateCoordinates[this.index].y));
        this.index++;
      });
    });
  }

  rotateByElement(selectedElements: SVGGraphicsElement[], angle: number): void {
    this.index = ZERO;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGAElement) => {
        if (!this.properties.enteredOnce[this.index]) {
          this.findCenterElement(child);
          this.properties.enteredOnce[this.index] = true;
        }
        this.findTransformAttributeOfElement(this.index);
        this.addTransformElement(child, angle, this.properties.elementCenterX[this.index]
          - this.initialTranslateCoordinates[this.index].x, this.properties.elementCenterY[this.index]
        - this.initialTranslateCoordinates[this.index].y);
        this.index++;
      });
    });
  }
  keyShift(keyShiftOn: boolean): boolean {
    return this.keyShiftOn = keyShiftOn;
  }
  keyAlt(keyAltOn: boolean): boolean {
    return this.keyAltOn = keyAltOn;
  }

  resizeDiagonal(renderer: Renderer2, selectedElements: SVGGraphicsElement[], x: number, y: number): void {
    console.log(x + '                ' + y);
    this.calculateAmountTranslated(x, y);
    console.log(Number(this.properties.amountTranslatedX));
    console.log((Number(this.properties.amountTranslatedY)));
    if (this.keyAltOn) {
      console.log('in shiftKetOn');
      let newNumber = 0;
      if (Math.sign(this.properties.amountTranslatedX) === -1 && Math.sign(this.properties.amountTranslatedY) === -1 ) {
        newNumber = Math.min((this.properties.amountTranslatedX), this.properties.amountTranslatedY);
        this.properties.amountTranslatedX = newNumber;
        this.properties.amountTranslatedY = newNumber;
      } else if (Math.sign(this.properties.amountTranslatedX) === 1 && Math.sign(this.properties.amountTranslatedY) === 1 ) {
        newNumber = Math.max((this.properties.amountTranslatedX), this.properties.amountTranslatedY);
        this.properties.amountTranslatedX = newNumber;
        this.properties.amountTranslatedY = newNumber;
      } else { // NE PAS EFFACER ENCORE ANA
        if (Math.abs(this.properties.amountTranslatedX) > Math.abs(this.properties.amountTranslatedY)) {
          if (Math.sign(this.properties.amountTranslatedY) === -1) {
            this.properties.amountTranslatedY = -(this.properties.amountTranslatedX);
          } else {
          this.properties.amountTranslatedY = this.properties.amountTranslatedX; }
        }
        if (Math.abs(this.properties.amountTranslatedX) < Math.abs(this.properties.amountTranslatedY)) {
          if (Math.sign(this.properties.amountTranslatedX) === -1) {
            this.properties.amountTranslatedX = -(this.properties.amountTranslatedY);
          } else {
          this.properties.amountTranslatedX = this.properties.amountTranslatedY; }
        }
      }

    }
    this.index = ZERO;
    let isFirstElement = true;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGGraphicsElement) => {
        const width = child.getBBox().width;
        const height = child.getBBox().height;
        let transformString = EMPTY_STRING;
        const translateX = child.getBBox().x + this.initialTranslateCoordinates[this.index].x;
        const translateY = child.getBBox().y + this.initialTranslateCoordinates[this.index].y;
        let offsetX = ZERO;
        let offsetY = ZERO;
        if (this.isLeftControl) {
          offsetX = this.properties.amountTranslatedX;
          isFirstElement ? this.properties.amountTranslatedX *= -ONE : offsetX *= -ONE;
        }
        if (this.isTopControl) {
          offsetY = this.properties.amountTranslatedY;
          isFirstElement ? this.properties.amountTranslatedY *= -ONE : offsetY *= -ONE;
        }
        let previousRotateString = EMPTY_STRING;
        transformString = this.initialTransformStringArray[this.index];
        if (this.initialTransformStringArray[this.index].search(SvgAttributes.ROTATE) > MINUS_ONE) {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.SCALE) === MINUS_ONE) {
            const start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.ROTATE + OPEN_PARENTHESIS);
            previousRotateString = this.initialTransformStringArray[this.index].substring(start,
              this.initialTransformStringArray[this.index].length);
            transformString = this.initialTransformStringArray[this.index].replace(previousRotateString, EMPTY_STRING);
          }
        }
        isFirstElement = false;
        if (this.initialTransformStringArray[this.index].search(SvgAttributes.SCALE) > MINUS_ONE) {
          const start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.SCALE + OPEN_PARENTHESIS);
          const previousScaleString = this.initialTransformStringArray[this.index].substring(start,
            this.initialTransformStringArray[this.index].indexOf(CLOSE_PARENTHESIS, start + ONE));
          const previousScaleX = parseFloat(previousScaleString.substring(previousScaleString.indexOf(OPEN_PARENTHESIS) + ONE,
            previousScaleString.indexOf(COMMA)));
          const previousScaleY = parseFloat(previousScaleString.substring(previousScaleString.indexOf(COMMA) + ONE,
            previousScaleString.length));
          const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x
            + COMMA + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;

          if (previousScaleX >= ZERO) {
            if (previousScaleY >= ZERO) {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x + offsetX) + COMMA
                + (this.initialTranslateCoordinates[this.index].y + offsetY) + CLOSE_PARENTHESIS);
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
                + (previousScaleX + (this.properties.amountTranslatedX / width)) + COMMA
                + (previousScaleY + (this.properties.amountTranslatedY / height)));
            } else {
              if (this.isTopControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x + offsetX) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
              } else {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x + offsetX) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y + this.properties.amountTranslatedY)
                  + CLOSE_PARENTHESIS);
              }
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
                + (previousScaleX + (this.properties.amountTranslatedX / width)) + COMMA
                + (previousScaleY - (this.properties.amountTranslatedY / height)));
            }
          } else if (previousScaleX < ZERO) {
            if (previousScaleY >= ZERO) {
              if (this.isLeftControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y + offsetY) + CLOSE_PARENTHESIS);
              } else {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x + this.properties.amountTranslatedX)
                  + COMMA + (this.initialTranslateCoordinates[this.index].y + offsetY) + CLOSE_PARENTHESIS);
              }
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
                + (previousScaleX - (this.properties.amountTranslatedX / width)) + COMMA + (previousScaleY
                  + (this.properties.amountTranslatedY / height)));
            } else {
              if (this.isLeftControl && this.isTopControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
              } else if (this.isLeftControl && !this.isTopControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y + this.properties.amountTranslatedY)
                  + CLOSE_PARENTHESIS);
              } else if (this.isTopControl && !this.isLeftControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x + this.properties.amountTranslatedX)
                  + COMMA + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
              } else {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x + this.properties.amountTranslatedX)
                  + COMMA + (this.initialTranslateCoordinates[this.index].y + this.properties.amountTranslatedY)
                  + CLOSE_PARENTHESIS);
              }
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE
                + OPEN_PARENTHESIS + (previousScaleX - (this.properties.amountTranslatedX / width))
                + COMMA + (previousScaleY - (this.properties.amountTranslatedY / height)));
            }
          }

          renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + previousRotateString);
        } else {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.TRANSLATE) > MINUS_ONE) {
            const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x
              + COMMA + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
            transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS + (translateX + offsetX)
              + COMMA + (translateY + offsetY) + CLOSE_PARENTHESIS);
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + SvgAttributes.SCALE
              + OPEN_PARENTHESIS + (ONE + (this.properties.amountTranslatedX) / (width))
              + COMMA + (ONE + (this.properties.amountTranslatedY) / (height)) + CLOSE_PARENTHESIS
              + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (-child.getBBox().x) + COMMA
              + (-child.getBBox().y) + CLOSE_PARENTHESIS + previousRotateString);
          } else {
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, this.initialTransformStringArray[this.index]
              + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (child.getBBox().x + offsetX)
              + COMMA + (child.getBBox().y + offsetY) + CLOSE_PARENTHESIS + SvgAttributes.SCALE
              + OPEN_PARENTHESIS + (ONE + (this.properties.amountTranslatedX) / (width)) + COMMA
              + (ONE + (this.properties.amountTranslatedY) / (height)) + CLOSE_PARENTHESIS
              + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (-child.getBBox().x) + COMMA
              + (-child.getBBox().y) + CLOSE_PARENTHESIS + previousRotateString);
          }
        }
        this.index++;
      });
    });
  }

  resizeVertical(renderer: Renderer2, selectedElements: SVGGraphicsElement[], x: number, y: number): void {
    let isFirstElement = true;
    this.calculateAmountTranslated(x, y);
    this.index = ZERO;
    let start: number = ZERO;
    let previousTranslateString: string = EMPTY_STRING;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGGraphicsElement) => {
        const height = child.getBBox().height;
        let transformString = EMPTY_STRING;
        const translateX = child.getBBox().x + this.initialTranslateCoordinates[this.index].x;
        const translateY = child.getBBox().y + this.initialTranslateCoordinates[this.index].y;
        let offsetY = ZERO;
        if (this.isTopControl) {
          offsetY = this.properties.amountTranslatedY;
          isFirstElement ? this.properties.amountTranslatedY *= -ONE : offsetY *= -ONE;
        }
        let previousRotateString = EMPTY_STRING;
        transformString = this.initialTransformStringArray[this.index];
        if (this.initialTransformStringArray[this.index].search(SvgAttributes.ROTATE) > MINUS_ONE) {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.SCALE) === MINUS_ONE) {
            start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.ROTATE + OPEN_PARENTHESIS);
            previousRotateString = this.initialTransformStringArray[this.index].substring(start,
              this.initialTransformStringArray[this.index].length);
            transformString = this.initialTransformStringArray[this.index].replace(previousRotateString, EMPTY_STRING);
          }
        }
        if (this.initialTransformStringArray[this.index].search(SvgAttributes.SCALE) > MINUS_ONE) {
          start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.SCALE + OPEN_PARENTHESIS);
          const previousScaleString = this.initialTransformStringArray[this.index].substring(start,
            this.initialTransformStringArray[this.index].indexOf(CLOSE_PARENTHESIS, start + ONE));
          const previousScaleX = parseFloat(previousScaleString.substring(previousScaleString.indexOf(OPEN_PARENTHESIS) + ONE,
            previousScaleString.indexOf(COMMA)));
          const previousScaleY = parseFloat(previousScaleString.substring(previousScaleString.indexOf(COMMA) + ONE,
            previousScaleString.length));
          previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x + COMMA
            + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
          if (this.initialTransformStringArray[this.index].indexOf(SvgAttributes.SCALE)
            <= this.initialTransformStringArray[this.index].indexOf(SvgAttributes.ROTATE)
            || this.initialTransformStringArray[this.index].search(SvgAttributes.ROTATE) === MINUS_ONE) {
            if (previousScaleY >= ZERO) {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x) + COMMA
                + (this.initialTranslateCoordinates[this.index].y + offsetY) + CLOSE_PARENTHESIS);
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
                + previousScaleX + COMMA + (previousScaleY + (this.properties.amountTranslatedY / height)));
            } else {
              if (this.isTopControl) {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
              } else {
                transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                  + (this.initialTranslateCoordinates[this.index].x) + COMMA
                  + (this.initialTranslateCoordinates[this.index].y + this.properties.amountTranslatedY)
                  + CLOSE_PARENTHESIS);
              }
              transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
                + previousScaleX + COMMA + (previousScaleY - (this.properties.amountTranslatedY / height)));
            }
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + previousRotateString);
          } else {
            start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.ROTATE + OPEN_PARENTHESIS);
            previousRotateString = this.initialTransformStringArray[this.index].substring(start,
              this.initialTransformStringArray[this.index].length);
            previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x + COMMA
              + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
            transformString = SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (this.initialTranslateCoordinates[this.index].x)
              + COMMA + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS;
            transformString += SvgAttributes.SCALE + OPEN_PARENTHESIS + ONE + COMMA
              + (ONE + (this.properties.amountTranslatedY) / (height)) + CLOSE_PARENTHESIS;
            transformString += previousRotateString;
            if (this.isTopControl && previousScaleY < ZERO) {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x) + COMMA
                + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
            } else if (!this.isTopControl && previousScaleY <= ZERO) {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x) + COMMA
                + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
            }
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString);
          }
        } else {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.TRANSLATE) > MINUS_ONE) {
            previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x + COMMA
              + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
            transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS + translateX + COMMA
              + (translateY + offsetY) + CLOSE_PARENTHESIS);
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + SvgAttributes.SCALE + OPEN_PARENTHESIS
              + ONE + COMMA + (ONE + (this.properties.amountTranslatedY) / (height)) + CLOSE_PARENTHESIS
              + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (-child.getBBox().x) + COMMA
              + (-child.getBBox().y) + CLOSE_PARENTHESIS + previousRotateString);
          } else {
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
              + (child.getBBox().x) + COMMA + (child.getBBox().y + offsetY) + CLOSE_PARENTHESIS
              + SvgAttributes.SCALE + OPEN_PARENTHESIS + ONE + COMMA + (ONE
                + (this.properties.amountTranslatedY) / (height)) + CLOSE_PARENTHESIS
              + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (-child.getBBox().x) + COMMA
              + (-child.getBBox().y) + CLOSE_PARENTHESIS + previousRotateString);
          }
        }
        this.index++;
        isFirstElement = false;
      });
    });
  }

  resizeHorizontal(renderer: Renderer2, selectedElements: SVGGraphicsElement[], x: number, y: number): void {
    let isFirstElement = true;
    this.calculateAmountTranslated(x, y);
    console.log(this.properties.amountTranslatedX);

    this.index = ZERO;
    selectedElements.forEach((element) => {
      element.childNodes.forEach((child: SVGGraphicsElement) => {
        const width = child.getBBox().width;
        let transformString = EMPTY_STRING;
        const translateX = child.getBBox().x + this.initialTranslateCoordinates[this.index].x;
        const translateY = child.getBBox().y + this.initialTranslateCoordinates[this.index].y;
        let offsetX = ZERO;
        if (this.isLeftControl) {
          offsetX = this.properties.amountTranslatedX;
          isFirstElement ? this.properties.amountTranslatedX *= -ONE : offsetX *= -ONE;
        }

        let previousRotateString = EMPTY_STRING;
        transformString = this.initialTransformStringArray[this.index];
        if (this.initialTransformStringArray[this.index].search(SvgAttributes.ROTATE) > MINUS_ONE) {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.SCALE) === MINUS_ONE) {
            const start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.ROTATE + OPEN_PARENTHESIS);
            previousRotateString = this.initialTransformStringArray[this.index].substring(start,
              this.initialTransformStringArray[this.index].length);
            transformString = this.initialTransformStringArray[this.index].replace(previousRotateString, EMPTY_STRING);
          }
        }
        if (transformString.search(SvgAttributes.SCALE) > MINUS_ONE) {
          const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x + COMMA
            + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
          const start = this.initialTransformStringArray[this.index].indexOf(SvgAttributes.SCALE + OPEN_PARENTHESIS);
          const previousScaleString = this.initialTransformStringArray[this.index].substring(start,
            this.initialTransformStringArray[this.index].indexOf(CLOSE_PARENTHESIS, start + ONE));

          const previousScaleX = parseFloat(previousScaleString.substring(previousScaleString.indexOf(OPEN_PARENTHESIS)
            + ONE, previousScaleString.indexOf(COMMA)));
          const previousScaleY = parseFloat(previousScaleString.substring(previousScaleString.indexOf(COMMA) + ONE,
            previousScaleString.length));
          if (previousScaleX >= ZERO) {
            transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
              + (this.initialTranslateCoordinates[this.index].x + offsetX) + COMMA
              + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
            transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
              + (previousScaleX + (this.properties.amountTranslatedX / width)) + COMMA + previousScaleY);
          } else {
            if (this.isLeftControl) {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x) + COMMA
                + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
            } else {
              transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS
                + (this.initialTranslateCoordinates[this.index].x + this.properties.amountTranslatedX)
                + COMMA + (this.initialTranslateCoordinates[this.index].y) + CLOSE_PARENTHESIS);
            }
            transformString = transformString.replace(previousScaleString, SvgAttributes.SCALE + OPEN_PARENTHESIS
              + (previousScaleX - (this.properties.amountTranslatedX / width)) + COMMA + previousScaleY);
          }

          transformString += previousRotateString;
          renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString);
        } else {
          if (this.initialTransformStringArray[this.index].search(SvgAttributes.TRANSLATE) > MINUS_ONE) {
            const previousTranslateString = OPEN_PARENTHESIS + this.initialTranslateCoordinates[this.index].x
              + COMMA + this.initialTranslateCoordinates[this.index].y + CLOSE_PARENTHESIS;
            transformString = transformString.replace(previousTranslateString, OPEN_PARENTHESIS + (translateX + offsetX)
              + COMMA + translateY + CLOSE_PARENTHESIS);
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + SvgAttributes.SCALE
              + OPEN_PARENTHESIS + (ONE + (this.properties.amountTranslatedX) / (width)) + COMMA + ONE
              + CLOSE_PARENTHESIS + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS + (-child.getBBox().x)
              + COMMA + (-child.getBBox().y) + CLOSE_PARENTHESIS + previousRotateString);
          } else {
            renderer.setAttribute(child, SvgAttributes.TRANSFORM, transformString + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
              + (child.getBBox().x + offsetX) + COMMA + (child.getBBox().y) + CLOSE_PARENTHESIS
              + SvgAttributes.SCALE + OPEN_PARENTHESIS + (ONE + (this.properties.amountTranslatedX) / (width))
              + COMMA + ONE + CLOSE_PARENTHESIS + SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
              + (-child.getBBox().x) + COMMA + (-child.getBBox().y) + CLOSE_PARENTHESIS
              + previousRotateString);
          }
        }
        this.index++;
        isFirstElement = false;
      });
    });

  }

  private findTranslateCoordinates(transformAttributes: TransformAttributes[]): TransformAttributes {
    let translation = transformAttributes.find((attribute) => {
      return attribute.name === SvgAttributes.TRANSLATE;
    });
    return translation ? translation : translation = { x: ZERO, y: ZERO };
  }

  private findRotateCoordinates(transformAttributes: TransformAttributes[]): TransformAttributes {
    let rotate = transformAttributes.find((attribute) => {
      return attribute.name === SvgAttributes.ROTATE;
    });
    return rotate ? rotate : rotate = { x: ZERO, y: ZERO, rotate: ZERO };
  }

  private parseTransform(transform: string): TransformAttributes[] {
    const X_INDEX = 1;
    const Y_INDEX = 2;
    const ROTATE_INDEX = 1;
    const X_INDEX_ROTATE = 2;
    const Y_INDEX_ROTATE = 3;
    const result = [];
    /*tslint:disable no-non-null-assertion*/
    const splitList = transform.match(/[\w\.\-]+/g)!;

    for (let t = ZERO; t < splitList.length; t += Y_INDEX_ROTATE) {
      const op: TransformAttributes = { name: EMPTY_STRING, x: ZERO, y: ZERO, rotate: ZERO };

      if (splitList[t] === SvgAttributes.ROTATE) {
        op.name = splitList[t];
        op.rotate = parseFloat(splitList[t + ROTATE_INDEX]);
        op.x = parseFloat(splitList[t + X_INDEX_ROTATE]);
        op.y = parseFloat(splitList[t + Y_INDEX_ROTATE]);
        result.push(op);
        t++;
      } else {
        op.name = splitList[t];
        op.x = parseFloat(splitList[t + X_INDEX]);
        op.y = parseFloat(splitList[t + Y_INDEX]);
        result.push(op);
      }
    }
    return result;
  }

  private convertTransformToString(transformAttributesArray: TransformAttributes[]): string {
    let transform = EMPTY_STRING;
    for (const transformAttribute of transformAttributesArray) {
      if (transformAttribute.name === SvgAttributes.TRANSLATE || transformAttribute.name === SvgAttributes.SCALE) {
        transform += transformAttribute.name + OPEN_PARENTHESIS + transformAttribute.x + COMMA
          + transformAttribute.y + CLOSE_PARENTHESIS;
      } else if (transformAttribute.name === SvgAttributes.ROTATE) {
        transform += transformAttribute.name + OPEN_PARENTHESIS + transformAttribute.rotate + COMMA
          + transformAttribute.x + COMMA + transformAttribute.y + CLOSE_PARENTHESIS;
      }
    }
    return transform;
  }
}
