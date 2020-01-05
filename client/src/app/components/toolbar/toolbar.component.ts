/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ToolChosen } from 'src/app/services/tools/tool-properties';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { IconService } from '../../services/Icon/icon.service';
import { Icon } from './icon';
import { BOTTOMICONLIST, TOPICONLIST } from './icon-list';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})

export class ToolbarComponent implements OnInit {
  @Output() attributesPanelToggled: EventEmitter<MouseEvent> = new EventEmitter();
  private selectedIcon: Icon;
  private showPanel: boolean;
  private undoOn: boolean;
  private redoOn: boolean;
  private topIconList: Icon[] = TOPICONLIST;
  private bottomIconList: Icon[] = BOTTOMICONLIST;

  constructor(private iconService: IconService, private drawingService: DrawingService, private toolService: ToolsService,
              private selectionService: SelectionService) {
    this.iconService.listenCreateDrawing().subscribe(() => this.showPanel = false);
    this.iconService.currentSelectedIcon.subscribe((selectedIcon: Icon) => {
      this.selectedIcon = selectedIcon;
      if (!this.showPanel && this.drawingService.created) {
        this.toggleAttributesPanel();
      }
    });
  }

  ngOnInit() {
    this.drawingService.currentUndo.subscribe((undoOn) => this.undoOn = undoOn);
    this.drawingService.currentRedo.subscribe((redoOn) => this.redoOn = redoOn);
  }

  private clickUndo(): void {
    if (this.undoOn) {
     this.drawingService.clickUndo();
    }
  }

  private clickRedo(): void {
    if (this.redoOn) {
      this.drawingService.clickRedo();
    }
  }

  private onSelect(icon: Icon): void {
    if (this.drawingService.created) {
      if (icon === this.selectedIcon) {
        this.toggleAttributesPanel();
      } else if (icon !== this.selectedIcon && !this.showPanel) {
        this.toggleAttributesPanel();
      }
      this.selectedIcon = icon;
      this.toolService.setToolChosen(this.selectedIcon.name);
      if (this.selectedIcon.name !== ToolChosen.SELECT) {
        this.selectionService.removeControlsForPanel();
      }
      this.iconService.icon  = this.selectedIcon;
      this.iconService.toolClicked();
    }
  }

  private toggleAttributesPanel(): void {
    this.attributesPanelToggled.emit();
    this.showPanel = !this.showPanel;
  }
}
