import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { FormService } from 'src/app/services/form/form.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { SaveService } from '../../services/save/save.service';
import { DrawingProperties } from '../create-drawing/drawing-properties';

const EMPTY_STRING = '';
const JSON_BEGINNING = 'data:text/json;charset=utf-8,';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
  @ViewChild('content', { static: false }) contentRef: ElementRef;
  private drawingObject: Drawing;
  private drawingInfo: FormGroup;
  private drawingProperties: DrawingProperties;
  private stateSaveDrawing: boolean;
  private jsonUri: SafeUrl;
  private saved: boolean;
  private isLocalSave: boolean;
  private drawingCreated: boolean;
  private saveInProgress: boolean;
  private saveError: boolean;

  constructor(private saveService: SaveService, private matDialog: MatDialog, private drawingService: DrawingService,
              private shortcutsService: ShortcutsService, private formService: FormService, private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer) {
    this.shortcutsService.getShortcutSave().subscribe((value) => this.saveDrawingShortcut(value));
  }

  ngOnInit() {
    this.drawingInfo = this.formBuilder.group({
      name: new FormControl(EMPTY_STRING, [Validators.required]),
      tag: this.formBuilder.array([this.createTags()]),
    });
  }

  private saveDrawingShortcut(stateSaveModal: boolean): void {
    if (stateSaveModal && !this.stateSaveDrawing) {
      this.openDialog(this.contentRef);
    }
  }

  private onSubmit(): void {
    this.drawingProperties = this.formService.drawingProperties;
    this.drawingObject = {
      _id: this.drawingInfo.value.name,
      tags: [],
      svgList: this.drawingService.drawingArray,
      drawingColor: this.drawingProperties.color,
      drawingHeight: this.drawingProperties.height,
      drawingWidth: this.drawingProperties.width,
    };
    for (const tag of this.drawingInfo.value.tag) {
      this.drawingObject.tags.push(tag.tag);
    }
    (this.isLocalSave) ? this.saveLocally() : this.saveToServer();
  }

  private openDialog(content: any): void {
    this.saved = false;
    this.saveError = false;
    this.matDialog.open(content, { disableClose: true });
    this.stateSaveDrawing = true;
    this.shortcutsService.changeModalStateSaveDrawing(true);
    if (this.isLocalSave) {
      this.updateLocalSave();
    }
    this.drawingCreated = this.drawingService.created;
  }

  private cancel(): void {
    this.matDialog.closeAll();
    this.stateSaveDrawing = false;
    this.shortcutsService.changeModalStateSaveDrawing(false);
  }

  private saveToServer(): void {
    this.saveInProgress = true;
    this.saveService.save(this.drawingObject)
      .subscribe(
        (data) => {
          this.saveInProgress = false;
          this.saveError = false;
          this.saved = true;
        },
        (error) => {
          this.saveError = true;
          this.saveInProgress = false;
        },
      );
    this.shortcutsService.changeModalStateSaveDrawing(false);
  }

  private saveLocally(): void {
    this.drawingProperties = this.formService.drawingProperties;
    this.drawingObject = {
      _id: this.drawingInfo.value.name,
      tags: [],
      svgList: this.drawingService.drawingArray,
      drawingColor: this.drawingProperties.color,
      drawingHeight: this.drawingProperties.height,
      drawingWidth: this.drawingProperties.width,
    };
    this.saveJSON(this.drawingObject);
    this.cancel();
  }

  private saveJSON(drawing: Drawing): void {
    this.jsonUri = this.sanitizer.bypassSecurityTrustUrl(JSON_BEGINNING + encodeURIComponent(JSON.stringify(drawing)));
  }

  private addTag(): void {
    let tags: FormArray;
    tags = this.drawingInfo.controls.tag as FormArray;
    tags.push(this.createTags());
  }

  private createTags(): FormGroup {
    return this.formBuilder.group({
      tag: new FormControl(EMPTY_STRING, [Validators.required]),
    });
  }

  private removeTag(index: number): void {
    const control = this.drawingInfo.controls.tag as FormArray;
    control.removeAt(index);
  }

  private updateLocalSave(): void {
    this.isLocalSave = !this.isLocalSave;
  }
}
