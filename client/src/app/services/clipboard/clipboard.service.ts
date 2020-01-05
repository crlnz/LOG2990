import { ElementRef, Injectable, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { SvgAttributes, SvgTypes } from 'src/app/components/svg-attributes';
import { DrawingService } from '../drawing/drawing.service';
import { EMPTY_STRING, SPACE } from '../paintBucket/paint-bucket-properties';
import { ClipboardProperties } from './clipboard-properties';

const COMMA = ',';
const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';
const MOVE_BY = 5;
const ZERO = 0;
const FIND_ELEMENT_BEFORE = 1;
const FIND_ELEMENT_AFTER = 1;
const SCALE = 's';
const ROTATE = 'r';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  @ViewChild('anchorSVJ', { static: false }) anchorSVJ: ElementRef;
  private properties: ClipboardProperties = new ClipboardProperties();
  private renderer: Renderer2;
  private svgElement: ElementRef;
  private clipBoardArray: Node[];
  private duplicateArray: Node[];
  private copySvg: SVGAElement;
  private textbox: SVGElement;
  private drawingSurface: SVGElement;
  private drawingService: DrawingService;
  private lastElement: SVGAElement;
  private copyChild: SVGAElement;

  initialisation(rendererFactory: RendererFactory2, anchorSVJ: ElementRef, drawingService: DrawingService): void {
    this.drawingService = drawingService;
    this.svgElement = anchorSVJ;
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initialisationClipboard(selectedElementsArray: Node[]): void {
    this.clipBoardArray = [];
    this.clipBoardArray = selectedElementsArray;
    this.properties.length = this.clipBoardArray.length;
    this.lastElement = (this.clipBoardArray[this.properties.length - FIND_ELEMENT_BEFORE] as SVGAElement);
  }

  initialisationDrawingSurface(): void {
    this.drawingSurface = this.svgElement.nativeElement;
    this.properties.maxX = this.drawingSurface.getBoundingClientRect().width;
    this.properties.maxY = this.drawingSurface.getBoundingClientRect().height;
  }

  copy(selectedElementsArray: Node[]): void {
    this.initialisationClipboard(selectedElementsArray);
    this.initialisationDrawingSurface();
    this.properties.moveTo = ZERO;
  }
  paste(): void {
    const ELEMENT_NB  = 2;
    const FIRST_ELEMENT = 1;
    let elementNumber: number = ZERO;
    this.clipBoardArray.forEach((element) => {
      this.copySvg = element as SVGAElement;
      this.properties.index = this.copySvg.tabIndex;
      const xFinal = this.copySvg.getBBox().width + this.copySvg.getBBox().x;
      const yFinal = this.copySvg.getBBox().width + this.copySvg.getBBox().y;

      this.copySvg = this.renderer.createElement(element.nodeName, SvgTypes.SVG_LINK);
      this.copySvg = element.cloneNode(false) as SVGAElement;
      if (elementNumber % ELEMENT_NB === ZERO) {
        if (elementNumber >= ELEMENT_NB) {
          this.properties.moveTo -= MOVE_BY;
        } else {
          this.properties.moveTo += MOVE_BY;
        }
      }
      if (elementNumber % ELEMENT_NB === FIRST_ELEMENT) {
        this.properties.moveTo -= MOVE_BY;
      }
      if ((xFinal + this.properties.moveTo) <= this.properties.maxX
          && (yFinal + this.properties.moveTo) <= this.properties.maxY) {
        this.properties.moveTo += MOVE_BY;
      } else {
        this.properties.moveTo = ZERO;
      }
      elementNumber++;
      if (element.nodeName === SvgTypes.G) {
        element.childNodes.forEach((child) => {
          if (child.nodeName === SvgTypes.TEXT) {
            this.textNode(child);
          } else {
            this.gNode(child); }
        });
        this.renderer.appendChild(this.svgElement.nativeElement, this.copySvg);
      }
      this.drawingService.pasteElementUpdateAllDrawings(this.copySvg as SVGElement);
    });
    this.drawingService.nPastedElements = ZERO;
  }

  textNode(child: ChildNode): void {
    this.textbox = (child.cloneNode(true) as SVGElement);
    const stringTransform: string|null = this.textbox.getAttribute(SvgAttributes.TRANSFORM);
    if (stringTransform !== null && stringTransform !== undefined) {
      const translateTrue = stringTransform.search(SvgAttributes.TRANSLATE);
      if (translateTrue !== -1) {
        const value1 = (Number(stringTransform.substring(stringTransform.indexOf(OPEN_PARENTHESIS) + FIND_ELEMENT_AFTER,
                              stringTransform.indexOf(COMMA))));
        const value2 = (Number(stringTransform.substring(stringTransform.indexOf(COMMA) + FIND_ELEMENT_AFTER,
                              stringTransform.indexOf(CLOSE_PARENTHESIS))));
        const indexOfTranslate = stringTransform.indexOf(CLOSE_PARENTHESIS) + FIND_ELEMENT_AFTER;
        let newstringTransform: string = EMPTY_STRING;
        if (stringTransform.charAt(indexOfTranslate) === SCALE || stringTransform.charAt(indexOfTranslate) === ROTATE) {
          newstringTransform = stringTransform.substring((stringTransform.indexOf(CLOSE_PARENTHESIS) + FIND_ELEMENT_AFTER));
        } else {
          newstringTransform = SPACE;
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + (this.properties.moveTo + value1).toString() + COMMA
                                  + (this.properties.moveTo + value2).toString() + CLOSE_PARENTHESIS + newstringTransform);
      } else {
        this.renderer.setAttribute(this.textbox, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + this.properties.moveTo.toString() + COMMA + this.properties.moveTo.toString()
                                  + CLOSE_PARENTHESIS + stringTransform);
      }
    } else {
      this.renderer.setAttribute(this.textbox, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + this.properties.moveTo.toString() + COMMA + this.properties.moveTo.toString()
                                  + CLOSE_PARENTHESIS);
    }

    this.renderer.appendChild(this.copySvg, this.textbox);

    this.renderer.insertBefore(this.svgElement.nativeElement, this.copySvg,
                              this.svgElement.nativeElement.childNodes[this.properties.index]);
  }

  gNode(child: ChildNode): void {
    if (child.firstChild) {
      if (child.firstChild.nodeName === SvgTypes.POLYGON || child.firstChild.nodeName === SvgTypes.PATH) {
        this.copyChild = child.cloneNode(true) as SVGAElement;
      }
    } else {
      this.copyChild = child.cloneNode(false) as SVGAElement;
    }
    
    const stringTransform: string|null = this.copyChild.getAttribute(SvgAttributes.TRANSFORM);
    if (stringTransform !== null && stringTransform !== undefined) {
      const translateTrue = stringTransform.search(SvgAttributes.TRANSLATE);
      if (translateTrue !== -1) {
        const value1 = (Number(stringTransform.substring(stringTransform.indexOf(OPEN_PARENTHESIS) + FIND_ELEMENT_AFTER,
                              stringTransform.indexOf(COMMA))));
        const value2 = (Number(stringTransform.substring(stringTransform.indexOf(COMMA) + FIND_ELEMENT_AFTER,
                              stringTransform.indexOf(CLOSE_PARENTHESIS))));
        const indexOfTranslate = stringTransform.indexOf(CLOSE_PARENTHESIS) + FIND_ELEMENT_AFTER;
        let newstringTransform: string = EMPTY_STRING;
        if (stringTransform.charAt(indexOfTranslate) === SCALE || stringTransform.charAt(indexOfTranslate) === ROTATE) {
          newstringTransform = stringTransform.substring((stringTransform.indexOf(CLOSE_PARENTHESIS) + FIND_ELEMENT_AFTER));
        } else {
          newstringTransform = SPACE;
        }
        this.renderer.setAttribute(this.copyChild, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + (this.properties.moveTo + value1).toString() + COMMA
                                  + (this.properties.moveTo + value2).toString() + CLOSE_PARENTHESIS + newstringTransform);
      } else {
        this.renderer.setAttribute(this.copyChild, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + this.properties.moveTo.toString() + COMMA + this.properties.moveTo.toString()
                                  + CLOSE_PARENTHESIS + stringTransform);
      }
    } else {
      this.renderer.setAttribute(this.copyChild, SvgAttributes.TRANSFORM, SvgAttributes.TRANSLATE + OPEN_PARENTHESIS
                                  + this.properties.moveTo.toString() + COMMA + this.properties.moveTo.toString()
                                  + CLOSE_PARENTHESIS);
    }
    this.renderer.appendChild(this.copySvg, this.copyChild);
  }

  duplicate(selectedElementsArray: Node[]): void {
    this.duplicateArray = [];
    this.duplicateArray = selectedElementsArray;
    this.initialisationDrawingSurface();
    this.properties.length = this.duplicateArray.length;
    const ELEMENT_NB  = 2;
    const FIRST_ELEMENT = 1;
    let elementNumber: number = ZERO;
    console.log(this.duplicateArray);

    this.duplicateArray.forEach((element) => {
      this.copySvg = element as SVGAElement;
      this.properties.index = this.copySvg.tabIndex;
      const xFinal = this.copySvg.getBBox().width + this.copySvg.getBBox().x;
      const yFinal = this.copySvg.getBBox().width + this.copySvg.getBBox().y;
      this.copySvg = element.cloneNode(false) as SVGAElement;
      if (elementNumber % ELEMENT_NB === ZERO) {
        if (elementNumber >= ELEMENT_NB) {
          this.properties.moveTo -= MOVE_BY;
        } else {
          this.properties.moveTo += MOVE_BY;
        }
      }
      if (elementNumber % ELEMENT_NB === FIRST_ELEMENT) {
        this.properties.moveTo -= MOVE_BY;
      }
      if ((xFinal + this.properties.moveTo) <= this.properties.maxX
          && (yFinal + this.properties.moveTo) <= this.properties.maxY) {
        this.properties.moveTo += MOVE_BY;
      } else {
        this.properties.moveTo = ZERO;
      }
      elementNumber++;
      console.log(element.nodeName);
      element.childNodes.forEach((child)=>{
        if(child.nodeName===SvgTypes.TEXT){
          this.textNode(child);
        }
        else{
          this.gNode(child);
        }
      })
      
      this.renderer.appendChild(this.svgElement.nativeElement, this.copySvg);
      this.drawingService.pasteElementUpdateAllDrawings(this.copySvg as SVGElement);
  });
    this.drawingService.nPastedElements = ZERO;
}

  cut(selectedElementsArray: Node[]): void {
    this.initialisationClipboard(selectedElementsArray);
    this.initialisationDrawingSurface();
    this.properties.moveTo = ZERO;
  }

  delete(selectedElementsArray: Node[]): void {
    this.drawingService.nErasedElements = ZERO;
    selectedElementsArray.forEach((element) => {
      this.drawingService.eraseElementUpdateAllDrawings(element as SVGElement);
      this.renderer.removeChild(this.svgElement.nativeElement, element);
    });
  }
}
