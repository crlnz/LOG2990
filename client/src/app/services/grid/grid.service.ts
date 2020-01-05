import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const DEFAULT_GRID_SIZE = 50;
const DEFAULT_GRID_TRANSPARENCY = 1;

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private gridTransparency = DEFAULT_GRID_TRANSPARENCY;
  squareSize = DEFAULT_GRID_SIZE;
  gridState = false;

  private gridTransparencySubject: BehaviorSubject<number> = new BehaviorSubject(this.gridTransparency);
  currentGridTransparency: Observable<number> = this.gridTransparencySubject.asObservable();

  private squareSizeSubject: BehaviorSubject<number> = new BehaviorSubject(this.squareSize);
  currentSquareSize: Observable<number> = this.squareSizeSubject.asObservable();

  private gridStateSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentGridState: Observable<boolean> = this.gridStateSubject.asObservable();

  private onButtonClick: Subject<Event> = new Subject<Event>();

  listenGridClick(): Observable<Event> {
    return this.onButtonClick.asObservable();
  }

  toggleGridClicked(): void {
    return this.onButtonClick.next();
  }

  updateGridState(gridState: boolean): void {
    this.gridState = gridState;
    this.gridStateSubject.next(this.gridState);
  }
  updateTransparency(transparency: number): void {
    this.gridTransparency = transparency;
    this.gridTransparencySubject.next(this.gridTransparency);
  }

  updateSquareSize(squareSize: number): void {
    this.squareSize = squareSize;
    this.squareSizeSubject.next(squareSize);
  }
}
