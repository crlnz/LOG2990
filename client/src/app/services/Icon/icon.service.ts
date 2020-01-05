import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Icon } from '../../components/toolbar/icon';

const EMPTY_STRING = '';
@Injectable({
  providedIn: 'root',
})

export class IconService {
  private onOpenModalListener: Subject<Event> = new Subject<Event>();
  private onToolSelectListener: Subject<Event> = new Subject<Event>();

  icon: Icon = {
    name: EMPTY_STRING,
    iconImage: EMPTY_STRING,
    hover: EMPTY_STRING,
  };

  private selectedIcon: BehaviorSubject<Icon> = new BehaviorSubject<Icon>(this.icon);
  currentSelectedIcon: Observable<Icon> = this.selectedIcon.asObservable();

  height: string;
  width: string;

  updateSelectedIcon(icon: Icon): void {
    this.selectedIcon.next(icon);
  }

  listenCreateDrawing(): Observable<Event> {
    return this.onOpenModalListener.asObservable();
  }

  listenToolClick(): Observable<Event> {
    return this.onToolSelectListener.asObservable();
  }

  createDrawingClicked(): void {
    this.onOpenModalListener.next();
  }

  toolClicked(): void {
    this.onToolSelectListener.next();
  }

  setInitialDimensions(height: string, width: string): void {
    this.height = height;
    this.width = width;
  }

  sendIcon(): string {
    return this.icon.name;
  }
}
