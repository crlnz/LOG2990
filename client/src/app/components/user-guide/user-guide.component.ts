/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
})

export class UserGuideComponent {

  constructor(private userGuide: MatDialog) {}

  private openDialog(content: any): void {
    this.userGuide.open(content);
  }
}
