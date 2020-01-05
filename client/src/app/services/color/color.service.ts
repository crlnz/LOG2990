/*
  Auteur: Équipe 12
  Description: Ce service permet de définir les couleurs choisies par l'utilisateur
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_TRANSPARENCY_HEX = 'FF';
const DEFAULT_PRIMARY = '#000000';
const DEFAULT_SECONDARY = '#000000';
const DEFAULT_BACKGROUND = '#ffffff';
const DEFAULT_TRANSPARENCY = 100;
const DEFAULT_LAST_TEN = [
  '#FFFFFF', '#FF0000', '#008000', '#800080', '#000000',
  '#FFA500', '#FFFF00', '#FFC0CB', '#0000FF', '#C0C0C0',
];

const BACKGROUND_OFF = undefined;
const BACKGROUND_ON = 'red';

@Injectable({
  providedIn: 'root',
})

export class ColorService {
  pipetteTool: boolean;
  chooseType: string;

  private backgroundColorPipette: BehaviorSubject<string | undefined> =  new BehaviorSubject(BACKGROUND_OFF);
  currentBackgroundPip: Observable<string | undefined> = this.backgroundColorPipette.asObservable();

  private transparency: BehaviorSubject<number> =  new BehaviorSubject(DEFAULT_TRANSPARENCY);
  currentTransparency: Observable<number> = this.transparency.asObservable();

  private transToHex: BehaviorSubject<string> =  new BehaviorSubject(DEFAULT_TRANSPARENCY_HEX);
  currentTransToHex: Observable<string> = this.transToHex.asObservable();

  private primary: BehaviorSubject<string> =  new BehaviorSubject(DEFAULT_PRIMARY);
  currentPrimaryColor: Observable<string> = this.primary.asObservable();

  private secondary: BehaviorSubject<string> = new BehaviorSubject(DEFAULT_SECONDARY);
  currentSecondaryColor: Observable<string> = this.secondary.asObservable();

  private background: BehaviorSubject<string> = new BehaviorSubject(DEFAULT_BACKGROUND);
  currentBackgroundColor: Observable<string> = this.background.asObservable();

  private createDrawingColor: BehaviorSubject<string> = new BehaviorSubject(DEFAULT_BACKGROUND);
  currentCreateDrawingColor: Observable<string> = this.createDrawingColor.asObservable();

  private pipetteSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentPipette: Observable<boolean> = this.pipetteSource.asObservable();

  private lastTen: BehaviorSubject<string[]> = new BehaviorSubject(DEFAULT_LAST_TEN);
  currentColorArray: Observable<string[]> = this.lastTen.asObservable();

  sendPrimaryColor(primary: string): void {
    this.primary.next(primary);
  }

  sendSecondaryColor(secondary: string): void {
    this.secondary.next(secondary);
  }

  sendBackgroundColor(message: string): void {
    this.background.next(message);
  }

  sendColorArray(colorArray: string[]): void {
    this.lastTen.next(colorArray);
  }

  sendCreateDrawingColor(createDrawingColor: string): void {
    this.createDrawingColor.next(createDrawingColor);
  }

  sendTransparency(transparency: number): void {
    this.transparency.next(transparency);
  }

  sendTransToHex(transToHex: string): void {
    this.transToHex.next(transToHex);
  }

  changePipetteState(pipette: boolean): void {
    this.pipetteTool = pipette;
    this.backgroundColorPipette.next(this.pipetteTool ? BACKGROUND_ON : BACKGROUND_OFF);
    this.pipetteSource.next(pipette);
  }
}
