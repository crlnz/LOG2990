import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ShortcutsService } from '../shortcuts/shortcuts.service';

const DEFAULT_DRAWING_INDEX = -1;
const RESET = 0;
const EMPTY_STRING = '';
const NULL = 0;

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  @ViewChild('anchorSVJ', { static: false }) anchorSVJ: ElementRef;

  drawingArray: string[] = [];
  allDrawings: string[][] = [];
  drawingsIndex = DEFAULT_DRAWING_INDEX;
  undoWasClicked: boolean;
  created: boolean;
  undoOn: boolean;
  redoOn: boolean;
  nErasedElements = RESET;
  nPastedElements = 0;

  private undoClicked: Subject<Event> = new Subject<Event>();
  private redoClicked: Subject<Event> = new Subject<Event>();
  private showUndo: BehaviorSubject<boolean> = new BehaviorSubject(this.undoOn);
  private showRedo: BehaviorSubject<boolean> = new BehaviorSubject(this.redoOn);
  currentUndo: Observable<boolean> = this.showUndo.asObservable();
  currentRedo: Observable<boolean> = this.showRedo.asObservable();

  listenUndoClick(): Observable<Event> {
    return this.undoClicked.asObservable();
  }

  listenRedoClick(): Observable<Event> {
    return this.redoClicked.asObservable();
  }

  clickUndo(): void {

    this.drawingsIndex--;
    this.drawingsIndex === DEFAULT_DRAWING_INDEX ? this.updateUndo(false) : this.updateUndo(true);
    this.updateRedo(true);
    this.undoWasClicked = true;
    this.undoClicked.next();
    if (this.drawingsIndex === DEFAULT_DRAWING_INDEX) {
      this.drawingArray = [EMPTY_STRING];
    } else {
      this.drawingArray = JSON.parse(JSON.stringify(this.allDrawings[this.drawingsIndex]));
    }
  }

  clickRedo(): void {
    this.drawingsIndex++;
    this.drawingsIndex === this.allDrawings.length - 1 ? this.updateRedo(false) : this.updateRedo(true);
    this.updateUndo(true);
    this.redoClicked.next();
    this.drawingArray = JSON.parse(JSON.stringify(this.allDrawings[this.drawingsIndex]));
  }

  fillDrawingArray(element: SVGElement): void {
    this.drawingsIndex++;
    if (this.drawingArray[NULL] === EMPTY_STRING) {
        this.drawingArray[NULL] = element.outerHTML;
      } else {
      this.drawingArray.push(element.outerHTML);
    }
    this.updateUndo(true);
    const drawing: string[] = [];
    for (const drawingObject of this.drawingArray) {
      drawing.push(drawingObject);
    }

    if (this.undoWasClicked) {
      this.allDrawings.length = this.drawingsIndex + 1;
      this.undoWasClicked = false;
      this.updateRedo(false);
    }

    this.allDrawings[this.drawingsIndex] = drawing;
  }

  findDrawingArrayElementIndex(element: SVGElement): number {
    return this.drawingArray.indexOf(element.outerHTML);
  }

  eraseElementUpdateAllDrawings(element: SVGElement): void {
    const foundElementIndex = this.findDrawingArrayElementIndex(element);
    if (foundElementIndex > DEFAULT_DRAWING_INDEX) {
      this.drawingArray.splice(foundElementIndex, 1);
    }
    if (this.nErasedElements === NULL) {
      this.allDrawings.push(JSON.parse(JSON.stringify(this.drawingArray)));
      this.drawingsIndex++;
      this.nErasedElements++;
    } else {
      this.allDrawings[this.drawingsIndex] = JSON.parse(JSON.stringify(this.drawingArray));
    }
    if (this.undoWasClicked) {
      this.allDrawings.length = this.drawingsIndex + 1;
      this.undoWasClicked = false;
      this.updateRedo(false);
    }
  }

  pasteElementUpdateAllDrawings(element: SVGElement): void {
    if (this.nPastedElements === 0) {
      this.drawingsIndex++;
    }
    this.drawingArray.push(element.outerHTML);
    this.updateUndo(true);

    if (this.undoWasClicked) {
      this.allDrawings.length = this.drawingsIndex + 1;
      this.undoWasClicked = false;
      this.updateRedo(false);
    }

    this.allDrawings[this.drawingsIndex] = JSON.parse(JSON.stringify(this.drawingArray));
    this.nPastedElements++;
  }

  replaceMultipleDrawingArrayElements(selectedElements: SVGGraphicsElement[], indexArray: number[]): void {
    const drawing: string[] = [];
    this.drawingsIndex++;
    indexArray.reverse();
    selectedElements.forEach((element: SVGElement) => {
      this.drawingArray[indexArray.pop() as number] = element.outerHTML;
    });
    for (const drawingObject of this.drawingArray) {
      drawing.push(drawingObject);
    }
    this.allDrawings.push(drawing);
    this.allDrawings[this.drawingsIndex] = drawing;
    if (this.undoWasClicked) {
      this.allDrawings.length = this.drawingsIndex + 1;
      this.undoWasClicked = false;
      this.updateRedo(false);
    }
  }

  replaceDrawingArrayElement(element: SVGElement, index: number): void {
    this.drawingArray[index] = element.outerHTML;
    this.drawingsIndex++;
    const drawing: string[] = [];
    for (const drawingObject of this.drawingArray) {
      drawing.push(drawingObject);
    }
    this.allDrawings[this.drawingsIndex] = drawing;
    if (this.undoWasClicked) {
      this.allDrawings.length = this.drawingsIndex + 1;
      this.undoWasClicked = false;
      this.updateRedo(false);
    }
  }

  clearDrawingArray(): void {
    this.drawingArray = [];
  }

  updateUndo(undo: boolean): void {
    this.undoOn = undo;
    this.showUndo.next(undo);

  }

  sendUndo(): boolean {
    return this.undoOn;
  }
  updateRedo(redo: boolean): void {
    this.redoOn = redo;
    this.showRedo.next(redo);
  }
  sendRedo(): boolean {
    return this.redoOn;
  }
}
