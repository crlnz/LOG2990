/*  Auteur: Équipe 12
    Description: Cette composante gère la grille de dessin
*/
import { Component, OnInit } from '@angular/core';
import { GridService } from 'src/app/services/grid/grid.service';

enum GridOptions {
  AFFICHER = 'Afficher',
  CACHER = 'Cacher',
}
const DEFAULT_TRANSPARENCY = 1;
@Component({
  selector: 'app-grid-options',
  templateUrl: './grid-options.component.html',
  styleUrls: ['./grid-options.component.scss'],
})
export class GridOptionsComponent implements OnInit {
  private buttonText = GridOptions.AFFICHER;
  private afficherGrille: boolean;
  private gridTransparency = DEFAULT_TRANSPARENCY;
  private transparencyValue: number;
  private gridSquareSize: number;

  constructor(private gridService: GridService) {}

  ngOnInit() {
    this.gridService.currentGridTransparency.subscribe((transparency) => this.transparencyValue = transparency);
    this.gridService.currentSquareSize.subscribe((squareSize) => (this.gridSquareSize) = squareSize);
    this.gridService.currentGridState.subscribe((state: boolean) => {
      this.afficherGrille = state;
      this.buttonText = this.afficherGrille ? GridOptions.CACHER : GridOptions.AFFICHER;
    });
  }

  private toggleGrid(): void {
    this.gridService.toggleGridClicked();
    this.afficherGrille = !this.afficherGrille;
    this.buttonText = this.afficherGrille ? GridOptions.CACHER : GridOptions.AFFICHER;
  }

  private updateTransparency(transparency: number): void {
    this.gridTransparency = transparency;
    this.transparencyValue = DEFAULT_TRANSPARENCY / (this.gridTransparency);
    this.gridService.updateTransparency(this.transparencyValue);
  }

  private updateSquareSize(squareSize: number): void {
    this.gridSquareSize = squareSize;
    this.gridService.updateSquareSize(this.gridSquareSize);
  }
}
