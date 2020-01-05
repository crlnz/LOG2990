import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DrawingProperties } from '../../components/create-drawing/drawing-properties';

@Injectable({
  providedIn: 'root',
})

export class FormService {
  drawingProperties: DrawingProperties;
  private createDrawingListener: Subject<Event> = new Subject<Event>();
  private resizedDrawingListener: Subject<Event> = new Subject<Event>();

  listenResized(): Observable<Event> {
    return this.resizedDrawingListener.asObservable();
  }

  listen(): Observable<Event> {
    return this.createDrawingListener.asObservable();
  }

  drawingResized(): void {
    this.resizedDrawingListener.next();
  }

  createDrawingClicked(): void {
    this.createDrawingListener.next();
  }
}
