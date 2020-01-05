import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

export interface NameObject {
  name: string;
}

const DEFAULT_SERVER_OPEN = 'http://localhost:3000/api/open';
const DEFAULT_SERVER_DELETE = 'http://localhost:3000/api/delete';
@Injectable({
  providedIn: 'root',
})

export class OpenDrawingService {
  private onOpenDrawingListener: Subject<Event> = new Subject<Event>();
  url = DEFAULT_SERVER_OPEN;
  tag: string;
  currentDrawingData: Drawing;
  name: NameObject;

  constructor(private httpClient: HttpClient) {}

  retrieveData(fileName: string): Observable<Drawing[]> {
    this.name = {
      name: fileName,
    };
    return this.httpClient.post<Drawing[]>(this.url, this.name);
  }

  retrieveDrawings(): Observable<Drawing[]> {
    return this.httpClient.get<Drawing[]>(this.url);
  }

  setCurrentDrawingData(data: Drawing): void {
    this.currentDrawingData = data;
    this.openDrawingClicked();
  }

  getData(): Drawing {
    return this.currentDrawingData;
  }

  listenOpenDrawing(): Observable<Event> {
    return this.onOpenDrawingListener.asObservable();
  }

  openDrawingClicked(): void {
    this.onOpenDrawingListener.next();
  }

  deleteDrawing(drawing: Drawing): Observable<boolean> {
    return this.httpClient.post<boolean>(DEFAULT_SERVER_DELETE, drawing);
  }
}
