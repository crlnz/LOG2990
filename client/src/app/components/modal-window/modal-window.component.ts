/* tslint:disable */
/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';

const HAS_READ = 'hasRead';
const FALSE = 'false';
const TRUE = 'true';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
})

export class ModalWindowComponent implements AfterViewInit {

  constructor(public dialog: MatDialog, private shortcutsService:ShortcutsService) {
    if (window.localStorage.getItem(HAS_READ) === null ) {
      localStorage.setItem(HAS_READ, FALSE);
    }
  }

  ngAfterViewInit() {
    if (localStorage.getItem(HAS_READ) === FALSE) {
      this.openDialog();
    }
  }
  private openDialog(): void {
    const dialogRef = this.dialog.open(ModalWindowContentComponent, { disableClose: true });
    dialogRef.componentInstance.windowClosed = false;
    if (dialogRef.componentInstance.isChecked) {
      localStorage.setItem(HAS_READ, TRUE);
    }
    this.shortcutsService.stateFirstModal(true);

  }
}

@Component({
  selector: 'app-modal-window-content',
  templateUrl: './modal-window-content.component.html',
})
export class ModalWindowContentComponent {
  windowClosed = false;
  isChecked = false;

  @HostListener('window:keydown', ['$event'])
  disableKeyboard(event: KeyboardEvent): void {
    if (!this.windowClosed) {
      event.preventDefault();
    }
  }

  private toggleVisibility(): void {
    this.isChecked = !this.isChecked;
  }

  private saveData(): void {
    window.localStorage.setItem(HAS_READ, String(this.isChecked));
    this.windowClosed = true;
  }
}
