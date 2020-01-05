import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefaultStampVariables } from './stamp-enum';

@Injectable({
  providedIn: 'root',
})
export class StampService {
  scale: number;
  stamp: string;
  tool: string;

  private rotation: BehaviorSubject<number> = new BehaviorSubject(Number(DefaultStampVariables.ROTATION));
  currentRotation: Observable<number> = this.rotation.asObservable();

  constructor() {
    this.tool = DefaultStampVariables.TOOL;
    this.scale = DefaultStampVariables.SCALE;
    this.stamp = DefaultStampVariables.STAMP;
  }

  updateRotation(rotation: number) {
    this.rotation.next(rotation);
  }
}
