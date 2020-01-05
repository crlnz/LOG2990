import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ExportService } from 'src/app/services/export/export.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss'],
})

export class ExportDrawingComponent {
  @ViewChild('content', { static: false }) contentRef: ElementRef;
  private fileName: string;
  private drawingCreated = false;
  private stateExportDrawing: boolean;

  constructor(private matDialog: MatDialog, private exportService: ExportService, private drawingService: DrawingService,
              private shortcutsService: ShortcutsService) {
      this.shortcutsService.getShortcutExport().subscribe((value) => this.exportDrawingShortcut(value));
    }

  private exportDrawingShortcut(stateOpenModal: boolean): void {
    if (stateOpenModal && !this.stateExportDrawing) {
      this.openDialog(this.contentRef);
    }
  }

  private openDialog(content: any): void {
    this.stateExportDrawing = true;
    this.shortcutsService.changeModalStateOpenDrawing(this.stateExportDrawing);
    this.matDialog.open(content, { disableClose: true });
    this.drawingCreated = this.drawingService.created;
  }

  private cancel() {
    this.stateExportDrawing = false;
    this.shortcutsService.changeModalStateOpenDrawing(this.stateExportDrawing);
    this.matDialog.closeAll();
  }

  private export(fileType: string): void {
    this.exportService.exportFileType = fileType;
    this.exportService.exportFileName = this.fileName;
    this.exportService.exportClicked();
  }
}
