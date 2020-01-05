/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { FormService } from '../../services/form/form.service';
import { IconService } from '../../services/Icon/icon.service';
import { ColorPickerComponent } from '../color-tools/color-picker/color-picker.component';
import { ColorTypes } from '../color-tools/color-picker/color-types-enum';
import { DrawingProperties } from './drawing-properties';

const DEFAULT_COLOR = '#FFFFFF';
const DEFAULT_WIDTH = '';
const DEFAULT_HEIGHT = '';
const DEFAULT_RGBA_RED = '255';
const DEFAULT_RGBA_GREEN = '255';
const DEFAULT_RGBA_BLEU = '255';
const DEFAULT_RGBA_ALPHA = '0';
const COMMA = ', ';
const FULL_ALPHA = '1';
const OPEN_PARENTHESIS = '(';
const CLOSE_PARENTHESIS = ')';
const RGBA = 'rgba';

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.css'],
})

export class CreateDrawingModalComponent {
  @ViewChild('content', { static: false }) contentRef: ElementRef;
  @Output() creatingDrawing: EventEmitter<Event> = new EventEmitter();

  private allowCreate = true;
  private changeValueWidth: boolean;
  private changeValueHeight: boolean;
  private showRgba: boolean;
  private createWarning: boolean;
  private modalOpened: boolean;
  private color: string;
  private height: string;
  private width: string;
  private drawingForm: FormGroup;

  constructor(private colorDialog: MatDialog, private createDrawinDialog: MatDialog, private formService: FormService,
              private iconService: IconService, private shortcutService: ShortcutsService, private drawingService: DrawingService,
              private colorService: ColorService, private shortcutsService: ShortcutsService) {

    this.formService.listenResized().subscribe(() => this.updateDimensions());
    this.colorService.currentCreateDrawingColor.subscribe((color: string) => this.color = color);
    this.shortcutsService.getShortcutNew().subscribe((value) => this.openModalKeyboard(value));

    this.drawingForm = new FormGroup({
      color: new FormControl(DEFAULT_COLOR, [Validators.required]),
      width: new FormControl(DEFAULT_WIDTH, Validators.compose([Validators.required, Validators.min(20), Validators.max(5000)])),
      height: new FormControl(DEFAULT_HEIGHT, Validators.compose([Validators.required, Validators.min(20), Validators.max(5000)])),

      red: new FormControl(DEFAULT_RGBA_RED, Validators.compose([Validators.required, Validators.min(0), Validators.max(255)])),
      green: new FormControl(DEFAULT_RGBA_GREEN, Validators.compose([Validators.required, Validators.min(0), Validators.max(255)])),
      blue: new FormControl(DEFAULT_RGBA_BLEU, Validators.compose([Validators.required, Validators.min(0), Validators.max(255)])),
      alpha: new FormControl(DEFAULT_RGBA_ALPHA, Validators.compose([Validators.required, Validators.min(0), Validators.max(1)])),
    });
  }

  get rgbaColor() {
    return this.transformToRGBA();
  }

  private openModalKeyboard(stateNewModal: boolean): void {
    if (stateNewModal && !this.modalOpened) {
      this.openDialog(this.contentRef);
    }
  }

  private openColorPicker(): void {
    this.colorService.chooseType = ColorTypes.CREATE_DRAWING;
    this.colorDialog.open(ColorPickerComponent);
  }

  private openDialog(content: any): void {
    if (!this.modalOpened) {
      this.colorService.sendCreateDrawingColor(DEFAULT_COLOR);
      this.createDrawinDialog.open(content, { disableClose: true });
      this.iconService.createDrawingClicked();
      this.drawingForm.reset({
        color: DEFAULT_COLOR, width: this.width, height: this.height,
        red: DEFAULT_RGBA_RED, green: DEFAULT_RGBA_GREEN, blue: DEFAULT_RGBA_BLEU, alpha: FULL_ALPHA,
      });
      this.showRgba = false;
      this.createWarning = false;
      this.modalOpened = true;
      this.shortcutService.changeModalState(this.modalOpened);
    }
  }

  private onSubmit(): void {
    this.drawingForm.value.color = this.showRgba ? this.transformToRGBA() : this.color;
    this.drawingService.clearDrawingArray();

    const data: DrawingProperties = {
      color: this.drawingForm.value.color,
      width: this.drawingForm.value.width,
      height: this.drawingForm.value.height,
    };

    if (this.allowCreate) {
      this.formService.drawingProperties = data;
      this.formService.createDrawingClicked();
      this.createDrawinDialog.closeAll();
      this.colorService.sendBackgroundColor(this.drawingForm.value.color);
      this.allowCreate = false;
      this.drawingService.updateUndo(false);
      this.drawingService.updateRedo(false);
    } else {
      this.createWarning = true;
      this.allowCreate = true;
    }
    this.modalOpened = false;
    this.shortcutService.changeModalState(this.modalOpened);
  }

  private transformToRGBA(): string {
    return RGBA + OPEN_PARENTHESIS + this.drawingForm.value.red + COMMA + this.drawingForm.value.green + COMMA
      + this.drawingForm.value.blue + COMMA + this.drawingForm.value.alpha + CLOSE_PARENTHESIS;
  }

  private resetForm(): void {
    this.drawingForm.reset({
      color: DEFAULT_COLOR, height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH,
      red: DEFAULT_RGBA_RED, green: DEFAULT_RGBA_GREEN, blue: DEFAULT_RGBA_BLEU, alpha: FULL_ALPHA,
    });
  }

  private cancel(): void {
    this.createDrawinDialog.closeAll();
    this.modalOpened = false;
    this.shortcutService.changeModalState(this.modalOpened);
  }

  private toggleRgba(): void {
    this.showRgba = !this.showRgba;
    if (this.showRgba) {
      this.drawingForm.controls.red.enable();
      this.drawingForm.controls.green.enable();
      this.drawingForm.controls.blue.enable();
      this.drawingForm.controls.alpha.enable();
    } else {
      this.drawingForm.controls.red.disable();
      this.drawingForm.controls.green.disable();
      this.drawingForm.controls.blue.disable();
      this.drawingForm.controls.alpha.disable();
    }
  }

  private updateDimensions(): void {
    this.changeValueWidth = this.drawingForm.controls.width.value !== this.width;
    this.changeValueHeight = this.drawingForm.controls.height.value !== this.height;

    this.height = this.iconService.height;
    this.width = this.iconService.width;

    if (this.changeValueWidth) {
      this.drawingForm.controls.width.reset(this.width);
    }

    if (this.changeValueHeight) {
      this.drawingForm.controls.height.reset(this.height);
    }
  }
}
