import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { OpenDrawingService } from '../../services/open-drawing/open-drawing.service';

enum Tabs {
  Server,
  Local,
}

const EMPTY_STRING = '';
const ID = '_id';
const SVG_LIST = 'svgList';
const DRAWING_HEIGHT = 'drawingHeight';
const DRAWING_WIDTH = 'drawingWidth';
const ZERO = 0;

@Component({
  selector: 'app-open-drawing',
  templateUrl: './open-drawing.component.html',
  styleUrls: ['./open-drawing.component.scss'],
})

export class OpenDrawingComponent {
  @ViewChild('content', { static: false }) contentRef: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef;
  private serverDrawings: Drawing[];
  private drawings: Drawing[] = [];
  private displayedDrawings: Drawing[] = [];
  private filteredDrawings: Drawing[] = [];
  private localDrawing: Drawing = { _id: '', svgList: [], tags: [], drawingColor: '', drawingHeight: '', drawingWidth: '' };

  private tag = EMPTY_STRING;
  private fileName: string;
  private stateOpenDrawing: boolean;
  private drawingCreated: boolean;
  private localTabSelected: boolean;
  private openWarning: boolean;
  private deleteWarning: boolean;
  private openError: boolean;
  private localFileIsInvalid: boolean;
  private localDrawingLoaded = true;
  private loading = true;
  private noMatchTag = true;
  private drawing: Drawing;

  constructor(private openDrawingService: OpenDrawingService, private matDialog: MatDialog, private shortcutsService: ShortcutsService,
              private drawingService: DrawingService) {
    this.shortcutsService.getShortcutOpen().subscribe((value) => this.openDrawingShortcut(value));
  }

  private openDrawingShortcut(stateOpenModal: boolean): void {
    if (stateOpenModal && !this.stateOpenDrawing) {
      this.openModal(this.contentRef);
    }
  }

  private tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === Tabs.Local) {
      this.localTabSelected = true;
    } else {
      this.localTabSelected = false;
      this.resetAttributesOnOpen();
      this.retrieveDrawingsFromServer();
    }
  }

  private openServerDrawing(fileName: string): void {
    this.deleteWarning = false;
    if (!this.drawingCreated) {
      this.updateNoDrawing();
      this.updateCurrentDrawing(fileName);
    } else {
      this.updateExistingDrawing();
      this.fileName = fileName;
    }
  }

  private deleteServerDrawing(drawing: Drawing): void {
    this.drawing = drawing;
    this.deleteWarning = true;
  }

  private confirmDelete(): void {
    this.resetAttributesOnOpen();
    this.openDrawingService.deleteDrawing(this.drawing)
      .subscribe(
        (data) => {
          this.retrieveDrawingsFromServer();
        },
      );
  }

  private cancelDelete(): void {
    this.deleteWarning = false;
  }

  private openLocalDrawing(): void {
    if (!this.drawingCreated) {
      this.updateNoDrawing();
      this.openDrawingService.setCurrentDrawingData(this.localDrawing);
    } else {
      this.updateExistingDrawing();
      this.fileName = this.localDrawing._id;
    }
  }

  private updateExistingDrawing(): void {
    this.openWarning = true;
    this.drawingCreated = false;
  }

  private updateNoDrawing(): void {
    this.stateOpenDrawing = false;
    this.drawingService.created = true;
    this.loading = true;
    this.shortcutsService.changeModalStateOpenDrawing(this.stateOpenDrawing);
    this.matDialog.closeAll();
  }

  private confirmOpen(): void {
    if (this.localTabSelected) {
      this.openLocalDrawing();
    } else {
      this.openServerDrawing(this.fileName);
    }
  }

  private retrieveDrawingsFromServer(): void {
    this.setDisplayedDrawings([]);
    this.openDrawingService.retrieveDrawings()
      .subscribe(
        (data) => {
          this.openError = false;
          this.serverDrawings = data.reverse();
          this.drawings = [];
          this.updateDrawings(this.serverDrawings);
          this.setDisplayedDrawings(this.serverDrawings);
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.openError = true;
        },
      );
  }

  private openModal(content: any): void {
    this.resetAttributesOnOpen();
    this.drawingCreated = this.drawingService.created;
    this.tag = EMPTY_STRING;
    this.matDialog.open(content, { disableClose: true });
    this.shortcutsService.changeModalStateOpenDrawing(this.stateOpenDrawing);
    this.retrieveDrawingsFromServer();
  }

  private resetAttributesOnOpen(): void {
    this.localTabSelected = false;

    this.loading = true;
    this.openWarning = false;
    this.deleteWarning = false;
    this.noMatchTag = false;
    this.stateOpenDrawing = true;
    this.localDrawingLoaded = false;
    this.localFileIsInvalid = false;
  }

  private cancelOpen(): void {
    this.noMatchTag = false;
    this.stateOpenDrawing = false;
    this.tag = EMPTY_STRING;
    this.shortcutsService.changeModalStateOpenDrawing(this.stateOpenDrawing);
    this.matDialog.closeAll();
  }

  private sendTag(): void {
    if (this.tag === EMPTY_STRING) {
      this.displayedDrawings = this.drawings;
    } else {
      this.displayFilteredDrawings(this.serverDrawings);
    }
  }

  private updateDrawings(drawingArray: Drawing[]): void {
    this.drawings = [];
    if (drawingArray !== null) {
      for (const drawing of drawingArray) {
        if (this.tag === EMPTY_STRING) {
          this.drawings.push(drawing);
        }
      }
    }
  }

  private setDisplayedDrawings(drawingArray: Drawing[]): void {
    this.displayedDrawings = drawingArray;
  }

  private displayFilteredDrawings(drawingArray: Drawing[]): void {
    this.filteredDrawings = [];
    if (this.tag !== EMPTY_STRING) {
      for (const drawing of drawingArray) {
        for (const tag of drawing.tags) {
          if (tag.toUpperCase().indexOf(this.tag.toUpperCase()) === ZERO) {
            this.filteredDrawings.push(drawing);
          }
        }
      }
      this.noMatchTag = this.filteredDrawings.length === ZERO;
      this.setDisplayedDrawings(this.filteredDrawings);
    }
  }

  private updateCurrentDrawing(fileName: string): void {
    for (const drawing of this.displayedDrawings) {
      if (drawing._id === fileName) {
        this.openDrawingService.setCurrentDrawingData(drawing);
      }
    }
  }

  private readFile(fileList: FileList): void {
    let fileContent;
    if (fileList) {
      const file = fileList[0];
      const fileReader: FileReader = new FileReader();
      fileReader.onloadend = () => {
        fileContent = fileReader.result as string;
        try {
          this.localDrawing = JSON.parse(fileContent);
          this.localFileIsInvalid = !((ID in this.localDrawing) && (SVG_LIST in this.localDrawing)
                                    && (DRAWING_HEIGHT in this.localDrawing) && (DRAWING_WIDTH in this.localDrawing));
        } catch (error) {
          this.localFileIsInvalid = true;
        }
      };
      fileReader.readAsText(file);
      this.localDrawingLoaded = true;
    }
  }

  private resetFile() {
    this.fileInputRef.nativeElement.value = null;
  }
}
