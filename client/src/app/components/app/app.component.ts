import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { EraserService } from 'src/app/services/eraser/eraser.service';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { FormService } from '../../services/form/form.service';
import { IconService } from '../../services/Icon/icon.service';

const TOOLBARWIDTH = 50;
const ATTRIBUTESPANELWIDTH = 200;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  @ViewChild('workZone', { static: false }) workZoneView: ElementRef;

  private showAttributesPanel = false;
  private drawingSurfaceCreated = false;

  private workZoneHeight = 0;
  private workZoneWidth = 0;
  private keyboard: KeyboardEvent;

  constructor(private iconService: IconService, private formService: FormService, private toolService: ToolsService,
              private selectionService: SelectionService, private pipetteService: PipetteService, private drawing: DrawingService,
              private shortcutService: ShortcutsService, private eraserService: EraserService,
              private paintBucketService: PaintBucketService, private manipulationService: ManipulationService) {
    this.drawing.created = this.drawingSurfaceCreated;

    this.iconService.listenCreateDrawing().subscribe((event: Event) => {
      if (this.showAttributesPanel) {
        this.toggleAttributesPanel();
      }
      this.getDimensions(event);
    });
    this.formService.listen().subscribe((event: Event) => {
      this.drawingSurfaceCreated = true;
      this.drawing.created = this.drawingSurfaceCreated;
    });
  }

  toggleAttributesPanel(): void {
    this.showAttributesPanel = !this.showAttributesPanel;
    this.showAttributesPanel ? this.setToolbarWidth(TOOLBARWIDTH + ATTRIBUTESPANELWIDTH) : this.setToolbarWidth(TOOLBARWIDTH);
  }

  setToolbarWidth(toolbarWidth: number): void {
    this.toolService.setToolbarWidth(toolbarWidth);
    this.selectionService.setToolbarWidth(toolbarWidth);
    this.pipetteService.setToolbarWidth(toolbarWidth);
    this.eraserService.setToolbarWidth(toolbarWidth);
    this.paintBucketService.setToolbarWidth(toolbarWidth);
    this.manipulationService.setToolbarWidth(toolbarWidth);
  }

  @HostListener('window:resize', ['$event'])
  getDimensions(event: Event): void {
    const height: number = window.innerHeight;
    const width: number = window.innerWidth - TOOLBARWIDTH;
    this.workZoneHeight = height;
    this.workZoneWidth = width;

    this.iconService.setInitialDimensions(this.workZoneHeight.toString(), this.workZoneWidth.toString());
    this.formService.drawingResized();
  }

  scroll(event: Event): void {
    const scrollDiv = event.target as HTMLDivElement;
    this.toolService.setAmountScrolled(scrollDiv.scrollLeft, scrollDiv.scrollTop );
    this.selectionService.setAmountScrolled( scrollDiv.scrollLeft, scrollDiv.scrollTop );
    this.pipetteService.setAmountScrolled(scrollDiv.scrollLeft, scrollDiv.scrollTop);
    this.eraserService.setAmountScrolled( scrollDiv.scrollLeft, scrollDiv.scrollTop );
    this.manipulationService.setAmountScrolled(scrollDiv.scrollLeft, scrollDiv.scrollTop);
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    this.keyboard = event;
    if (this.keyboard.ctrlKey) {
      this.shortcutService.ctrlDown(this.keyboard);
    } else {
      this.shortcutService.onKeyPress(this.keyboard);
    }
  }
}
