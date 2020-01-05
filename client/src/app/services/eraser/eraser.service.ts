/* tslint:disable deprecation*/

import { ElementRef, Injectable, Renderer2, RendererFactory2, ViewChild } from '@angular/core';
import { SvgAttributes, SvgTypes } from 'src/app/components/svg-attributes';
import { ActiveToolService } from '../active-tool/active-tool.service';
import { DrawingService } from '../drawing/drawing.service';

const BORDERWIDTH = 5;
const ERASER_ID = 'eraser';
const ZERO = 0;
const RED = 'red';
const WHITE = 'white';
const DEFAULT_ERASER_SIZE = 10;
const RED_BORDER_FILTER = 'url(#filterEraser)';
const DEFAULT_CURSOR = 'default';
const HIDE_CURSOR = 'none';

@Injectable({
  providedIn: 'root',
})
export class EraserService implements ActiveToolService {
  @ViewChild('anchorSVJ', { static: false }) anchorSVJ: ElementRef;
  private svgElement: ElementRef;
  private renderer: Renderer2;
  private mousePressed = false;
  private toolbarWidth: number;
  private amountScrolledX = 0;
  private amountScrolledY = 0;
  private size = DEFAULT_ERASER_SIZE;
  private drawingService: DrawingService;
  private eraser: SVGSVGElement;
  private eraserCreated: boolean;
  private childs: NodeListOf<Node>;

  initialisation(rendererFactory: RendererFactory2, anchorSVJ: ElementRef, drawingService: DrawingService): void {
    this.drawingService = drawingService;
    this.svgElement = anchorSVJ;
    this.renderer = rendererFactory.createRenderer(null, null);
    this.childs = this.svgElement.nativeElement.childNodes;
    this.createEraser();
  }

  setAmountScrolled(scrollX: number, scrollY: number): void {
    this.amountScrolledX = scrollX;
    this.amountScrolledY = scrollY;
  }

  setToolbarWidth(toolbarWidth: number): void {
    this.toolbarWidth = toolbarWidth;
  }

  removeEraser() {
    if (this.eraserCreated) {
      this.eraser.style.cursor = DEFAULT_CURSOR;
      this.childs.forEach((child: SVGElement) => {
        this.renderer.removeAttribute(child, SvgAttributes.FILTER);
      });

      this.renderer.removeChild(this.svgElement.nativeElement, this.eraser);
      this.eraserCreated = false;
    }
  }

  eraserSize(size: number): void {
    this.size = size;
  }

  mouseDown(event: MouseEvent): void {
    this.mousePressed = true;
    this.removeElements();
  }

  mouseMove(event: MouseEvent): void {
    this.drawEraser(event);
    this.eraserCreated = true;
    if (this.mousePressed) {
      this.removeElements();
    } else {
      this.drawRedBox();
    }
  }

  private drawRedBox(): void {
    this.childs.forEach((child: SVGElement) => {
      if (this.intersectRect(child, this.eraser)) {
        if (child.id !== ERASER_ID) {
          this.renderer.setAttribute(child, SvgAttributes.FILTER, RED_BORDER_FILTER);
        }
      } else {
        this.renderer.removeAttribute(child, SvgAttributes.FILTER);
      }
    });
  }

  mouseUp(event: MouseEvent): void {
    this.mousePressed = false;
    this.drawingService.nErasedElements = ZERO;
  }

  doubleClick(event: MouseEvent): void { return; }

  private eraserAttributes(x: number, y: number, width: number, height: number): void {
    this.renderer.setAttribute(this.eraser, SvgAttributes.X, (x - this.size / 2).toString());
    this.renderer.setAttribute(this.eraser, SvgAttributes.Y, (y - this.size / 2).toString());
    this.renderer.setAttribute(this.eraser, SvgAttributes.WIDTH, width.toString());
    this.renderer.setAttribute(this.eraser, SvgAttributes.HEIGHT, height.toString());
    this.renderer.setAttribute(this.eraser, SvgAttributes.STROKE, RED);
    this.renderer.setAttribute(this.eraser, SvgAttributes.FILL, WHITE);
    this.renderer.setAttribute(this.eraser, SvgAttributes.ID, ERASER_ID);
  }

  private createEraser(): void {
    this.eraser = this.renderer.createElement(SvgTypes.RECT, SvgTypes.SVG_LINK);
    this.eraser.style.cursor = HIDE_CURSOR;
    this.renderer.appendChild(this.svgElement.nativeElement, this.eraser);
  }

  private intersectRect(elem1: SVGElement, elem2: SVGElement): boolean {
    const child1 = elem1.getBoundingClientRect();
    const child2 = elem2.getBoundingClientRect();
    return !(child2.left > child1.right || child2.right < child1.left || child2.top > child1.bottom || child2.bottom < child1.top);
  }

  private drawEraser(event: MouseEvent): void {
    const x2 = event.clientX - this.toolbarWidth + this.amountScrolledX - BORDERWIDTH;
    const y2 = event.clientY + this.amountScrolledY - BORDERWIDTH;

    this.renderer.removeChild(this.svgElement.nativeElement, this.eraser);
    this.createEraser();
    this.eraserAttributes(x2, y2, this.size, this.size);
  }

  private removeElements(): void {
    this.childs.forEach((child: SVGElement) => {
      if (this.intersectRect(child, this.eraser)) {
        if (child.id !== ERASER_ID) {
          this.drawingService.eraseElementUpdateAllDrawings(child);
          this.renderer.removeChild(this.svgElement.nativeElement, child);
        }
      }
    });
  }
}
