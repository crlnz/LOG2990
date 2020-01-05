import { Injectable } from '@angular/core';
import { SvgAttributes, SvgTypes } from 'src/app/components/svg-attributes';
import { ColorService } from '../color/color.service';
import { DrawingService } from '../drawing/drawing.service';

const R_KEY = 'KeyR';
const NONE = 'none';

@Injectable({
  providedIn: 'root',
})

export class ColorApplicatorService {
  private primaryColor: string;
  private secondaryColor: string;
  private clickedObject: SVGElement;
  private fillToolShortcut: boolean;

  constructor(private colorService: ColorService, private drawingService: DrawingService) {
    this.colorService.currentPrimaryColor.subscribe((selectedPrimaryColor: string) => this.primaryColor = selectedPrimaryColor);
    this.colorService.currentSecondaryColor.subscribe((selectedSecondaryColor: string) => this.secondaryColor = selectedSecondaryColor);
  }

  keyShortcut(event: KeyboardEvent): void {
    this.fillToolShortcut = event.code === R_KEY;
  }

  onRightClick(event: MouseEvent, fillTool: boolean): void {
    event.preventDefault();
    if (event.target instanceof SVGElement) {
      this.clickedObject = event.target;
      const foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(this.clickedObject.parentNode as SVGElement);
      if (fillTool || this.fillToolShortcut) {
        if (this.clickedObject.tagName === SvgTypes.RECT || this.clickedObject.tagName === SvgTypes.POLYGON ||
          this.clickedObject.tagName === SvgTypes.ELLIPSE) {
          if (this.clickedObject.getAttribute(SvgAttributes.STROKE) !== NONE) {
            this.clickedObject.setAttribute(SvgAttributes.STROKE, this.secondaryColor);
            this.drawingService.replaceDrawingArrayElement(this.clickedObject.parentNode as SVGElement, foundDrawingIndex);
          }
        }
      }
    }
  }

  mouseClick(event: { target: SVGElement }, fillTool: boolean): void {
    this.clickedObject = event.target;
    const foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(this.clickedObject.parentNode as SVGElement);
    if (fillTool) {
      if (this.clickedObject.tagName === SvgTypes.RECT || this.clickedObject.tagName === SvgTypes.ELLIPSE) {
        if (this.clickedObject.getAttribute(SvgAttributes.FILL) !== NONE) {
          this.clickedObject.setAttribute(SvgAttributes.FILL, this.primaryColor);
          this.drawingService.replaceDrawingArrayElement(this.clickedObject.parentNode as SVGElement, foundDrawingIndex);
        }
      } else {
        this.pathElements();
      }
    }
  }

  pathElements(): void {
    let foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(this.clickedObject);
    const parentNode = this.clickedObject.parentNode as SVGElement;
    if (parentNode.parentNode) {
      if (parentNode.parentNode.nodeName === SvgTypes.G) {
        foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(parentNode.parentNode as SVGElement);
        const childArray = Array.from(parentNode.childNodes) as SVGElement[];
        childArray.forEach((svgElementNode) => {
          const svgElement = svgElementNode as SVGElement;
          svgElement.setAttribute(SvgAttributes.STROKE, this.primaryColor);
          if (this.clickedObject.tagName === SvgTypes.POLYGON) {
            svgElement.setAttribute(SvgAttributes.FILL, this.primaryColor);
          }
        });
        this.drawingService.replaceDrawingArrayElement(parentNode.parentNode as SVGElement, foundDrawingIndex);
      } else if (this.clickedObject.nodeName === SvgTypes.PATH) {
        foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(parentNode);
        this.clickedObject.setAttribute(SvgAttributes.STROKE, this.primaryColor);
        this.drawingService.replaceDrawingArrayElement(parentNode, foundDrawingIndex);
      } else if (this.clickedObject.nodeName === SvgTypes.TSPAN) {
        this.clickedObject.setAttribute(SvgAttributes.FILL, this.primaryColor);
        this.drawingService.replaceDrawingArrayElement(this.clickedObject, foundDrawingIndex);
      } else if (parentNode.nodeName === SvgTypes.TEXT) {
        if (parentNode) {
          foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(parentNode.parentNode as SVGElement);
          parentNode.setAttribute(SvgAttributes.FILL, this.primaryColor);
          if (parentNode.parentNode != null) {
            this.drawingService.replaceDrawingArrayElement(parentNode.parentNode as SVGElement, foundDrawingIndex);
          }
        }
      } else if (this.clickedObject.tagName === SvgTypes.POLYGON) {
        foundDrawingIndex = this.drawingService.findDrawingArrayElementIndex(this.clickedObject.parentNode as SVGElement);
        this.clickedObject.setAttribute(SvgAttributes.FILL, this.primaryColor);
        this.drawingService.replaceDrawingArrayElement(this.clickedObject.parentNode as SVGElement, foundDrawingIndex);
      }
    }
  }
}
