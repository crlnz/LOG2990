import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefaultTextVariables } from './text-enum';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  private switchTools: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentToolChosen: Observable<boolean> = this.switchTools.asObservable();

  private isWritting: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentIsWrittingState: Observable<boolean> = this.isWritting.asObservable();

  private isBold: BehaviorSubject<string> = new BehaviorSubject(DefaultTextVariables.BOLD.toString());
  currentBoldStatus: Observable<string> = this.isBold.asObservable();

  private isItalic: BehaviorSubject<string> = new BehaviorSubject(DefaultTextVariables.ITALIC.toString());
  currentItalicStatus: Observable<string> = this.isItalic.asObservable();

  private font: BehaviorSubject<string> = new BehaviorSubject(DefaultTextVariables.FONT.toString());
  currentFont: Observable<string> = this.font.asObservable();

  private alignement: BehaviorSubject<string> = new BehaviorSubject(DefaultTextVariables.ALIGNEMENT.toString());
  currentAlignement: Observable<string> = this.alignement.asObservable();

  private textSize: BehaviorSubject<number> = new BehaviorSubject(DefaultTextVariables.TEXTSIZE as number);
  currentTextSize: Observable<number> = this.textSize.asObservable();

  changeToolChosen(otherToolChosen: boolean): void {
    this.switchTools.next(otherToolChosen);
  }

  changeIsWritingState(isWriting: boolean): void {
    this.isWritting.next(isWriting);
  }

  changeBoldStatus(bold: string): void {
    this.isBold.next(bold);
  }

  changeItalicStatus(italic: string): void {
    this.isItalic.next(italic);
  }

  updateFont(font: string): void {
    this.font.next(font);
  }

  updateAlignement(alignment: string): void {
    this.alignement.next(alignment);
  }

  updateTextSize(textSize: number): void {
    this.textSize.next(textSize);
  }
}
