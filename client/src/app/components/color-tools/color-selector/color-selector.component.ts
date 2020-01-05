/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ColorTypes } from '../color-picker/color-types-enum';

enum PipetteStates {
  ON = 'On',
  OFF = 'Off',
}

const BACKGROUND_OFF = undefined;
const BACKGROUND_ON = 'red';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
})

export class ColorSelectorComponent implements OnInit  {
  private fillColor: string;
  private outlineColor: string;
  private backgroundColor: string;
  private pipetteTool = false;
  private statePipette = PipetteStates.OFF;
  private backgroundColorPipette: string | undefined;

  constructor(private dialog: MatDialog, private colorService: ColorService, private shortcutsService: ShortcutsService) {}

  ngOnInit() {
    this.colorService.currentPrimaryColor.subscribe((selectedPrimaryColor: string) => this.fillColor = selectedPrimaryColor);
    this.colorService.currentSecondaryColor.subscribe((selectedSecondaryColor: string) => this.outlineColor = selectedSecondaryColor);
    this.colorService.currentBackgroundColor.subscribe((backgroundColor: string) => this.backgroundColor = backgroundColor);
    this.colorService.currentPipette.subscribe((pipetteState: boolean) => {
      this.pipetteTool = pipetteState;
      this.statePipette = this.pipetteTool ? PipetteStates.ON : PipetteStates.OFF;
    });
    this.colorService.currentBackgroundPip.subscribe((backgroundPip: string) => this.backgroundColorPipette = backgroundPip);
  }

  private openDialog(): void {
    this.dialog.open(ColorPickerComponent, { disableClose: true });
    this.shortcutsService.stateColorPicker(true);
  }

  private openPrimaryColor(): void {
    this.colorService.chooseType = ColorTypes.PRIMARY;
    this.openDialog();
  }

  private openSecondaryColor(): void {
    this.colorService.chooseType = ColorTypes.SECONDARY;
    this.openDialog();
  }

  private openBackgroundColor(): void {
    this.colorService.chooseType = ColorTypes.BACKGROUND;
    this.openDialog();
  }

  private swapColors(): void {
    const tempColorHolder = this.fillColor;
    this.colorService.sendPrimaryColor(this.outlineColor);
    this.colorService.sendSecondaryColor(tempColorHolder);
  }

  private pipette(): void {
    this.pipetteTool = !this.pipetteTool;
    this.backgroundColorPipette = this.pipetteTool ? BACKGROUND_ON : BACKGROUND_OFF;
    this.statePipette = this.pipetteTool ? PipetteStates.ON : PipetteStates.OFF;
    this.colorService.changePipetteState(this.pipetteTool);
  }
}
