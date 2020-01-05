/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import {Component, Input, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { ColorTypes } from './color-types-enum';

const NB_BITS = 16;
const NB_COLORS_SAVED = 10;
const MAX_TRANSPARENCY = 100;
const MIN_TRANSPARENCY = 0;
const NULL = 0;
const ZERO = '0';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})

export class ColorPickerComponent implements OnInit {
  @Input() color: string;
  @Input() paintInput: string;
  @Input() transInput: string;

  private state: boolean;
  private transparency: number;
  private transparentColor: string;
  private transToHex: string;
  lastTen: string[];
  private primary: string;
  private secondary: string;
  private background: string;
  private createDrawingColor: string;
  private hexError: boolean;
  private transparencyError: boolean;

  constructor(private dialogRef: MatDialogRef<ColorPickerComponent>, private shortcutsService: ShortcutsService,
              private colorService: ColorService) {}

  ngOnInit() {
    this.colorService.currentColorArray.subscribe((colorArray: string[]) => this.lastTen = colorArray);
    this.colorService.currentPrimaryColor.subscribe((primary: string) => this.primary = primary);
    this.colorService.currentSecondaryColor.subscribe((secondary: string) => this.secondary = secondary);
    this.colorService.currentBackgroundColor.subscribe((background: string) => this.background = background);
    this.colorService.currentCreateDrawingColor.subscribe((createDrawingColor: string) => this.createDrawingColor = createDrawingColor);
    this.colorService.currentTransparency.subscribe((transparency: number) => this.transparency = transparency);
    this.colorService.currentTransToHex.subscribe((transToHex: string) => this.transToHex = transToHex);

    this.transparentColor = this.lastTen[NULL];
    this.color = this.lastTen[NULL];
    this.shortcutsService.currentState.subscribe((state) => this.state = state);
  }

  private updateColorPalette(color: string): void {
    this.color = color.toUpperCase();
    let isSwitched = false;

    let i: number;
    for (i = NULL; i < NB_COLORS_SAVED; i++) {
      if (this.color === this.lastTen[i] && !isSwitched) {
        if (i !== NULL) {
          this.lastTen.unshift(this.color);
          for (let k = i; k < NB_COLORS_SAVED; k++) {
            this.lastTen[k + 1] = this.lastTen[k + 2];
          }
        }
        isSwitched = true;
      }
    }

    if (i === NB_COLORS_SAVED && !isSwitched) {
      this.lastTen.unshift(this.color);
    }
    this.lastTen.splice(NB_COLORS_SAVED);

    this.transparentColor = (this.color + this.transToHex);
    this.chooseColorType();
  }

  colorManual(color: string): void {
    const validColor: boolean = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    if (validColor) {
      this.hexError = false;
      this.updateColorPalette(color.toUpperCase());
    } else {
      this.hexError = true;
    }
  }

  private togglePalette(): void {
    if (!this.hexError && !this.transparencyError) {
      this.dialogRef.close();
      this.state = false;
      this.shortcutsService.stateColorPicker(this.state);
    }
  }

  private setTransparency(transparency: number): void {
    const MAX_COLOR_VALUE = 255;
    const PERCENT_DIVIDER = 100;
    this.transparencyError = false;
    if (transparency >= MIN_TRANSPARENCY && transparency <= MAX_TRANSPARENCY) {
      this.colorService.sendTransparency(transparency);
      const trans = Math.floor((this.transparency * MAX_COLOR_VALUE) / PERCENT_DIVIDER);
      const transString = trans.toString(NB_BITS);
      this.transToHex = trans < NB_BITS ? ZERO + transString : transString;
      this.colorService.sendTransToHex(this.transToHex);
      this.updateColor();
    } else {
      this.transparencyError = true;
    }
  }

  private updateColor(): void {
    switch (this.colorService.chooseType) {
      case ColorTypes.PRIMARY:
        this.transparentColor = this.primary + this.transToHex;
        break;
      case ColorTypes.SECONDARY:
        this.transparentColor = this.secondary + this.transToHex;
        break;
      case ColorTypes.BACKGROUND:
        this.transparentColor = this.background + this.transToHex;
        break;
      case ColorTypes.CREATE_DRAWING:
        this.transparentColor = this.createDrawingColor + this.transToHex;
        break;
    }
    this.chooseColorType();
  }

  private getColor(): string {
    return this.color;
  }

  private chooseColorType(): void {
    switch (this.colorService.chooseType) {
      case ColorTypes.PRIMARY:
        this.colorService.sendPrimaryColor(this.transparentColor);
        break;
      case ColorTypes.SECONDARY:
        this.colorService.sendSecondaryColor(this.transparentColor);
        break;
      case ColorTypes.BACKGROUND:
        this.colorService.sendBackgroundColor(this.transparentColor);
        break;
      case ColorTypes.CREATE_DRAWING:
        this.colorService.sendCreateDrawingColor(this.transparentColor);
        break;
    }
  }
}
