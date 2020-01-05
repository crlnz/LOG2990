import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

const DEFAULT_SERVER_URL = 'http://localhost:3000/api/save';

@Injectable({
  providedIn: 'root',
})

export class SaveService {
  private url = DEFAULT_SERVER_URL;

  constructor(private httpClient: HttpClient) {}

  save(drawing: Drawing): Observable<boolean> {
    return this.httpClient.post<boolean>(this.url, drawing);
  }
}
