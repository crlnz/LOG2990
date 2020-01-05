/*  Auteur: Équipe 12
    Description: Cette composante gère le panel des attributs des formes.
*/
import { Component} from '@angular/core';
import { Tools } from 'src/app/services/tools/tool-properties';
import { ShapeService} from '../../../services/shape/shape.service';

@Component({
  selector: 'app-attributes-shapes',
  templateUrl: './attributes-shapes.component.html',
  styleUrls: ['./attributes-shapes.component.css'],
})

export class ShapeAttributesComponent {
  private width: number;
  private rectangle: boolean;
  private ellipse: boolean;
  private polygon: boolean;

  private selectedType: string;
  private selectedShape: string;
  private nbOfPoints: number;

  constructor(private shapeService: ShapeService) {
    this.shapeService.currentTool.subscribe((selectedShape: string) => {
      this.selectedShape = selectedShape;
      this.updateTool();
    });
    this.shapeService.sendTool(this.selectedShape);
    this.width = this.shapeService.strokeWidth;
    this.selectedType = this.shapeService.type;
    this.nbOfPoints = this.shapeService.nbPoints;
  }

  private sendWidth(): void {
    this.shapeService.strokeWidth = this.width;
  }

  private sendShape(): void {
    this.shapeService.sendTool(this.selectedShape);
    this.polygon = (this.selectedShape === Tools.POLYGON);
  }

  private sendNbOfPoints(): void {
    this.shapeService.nbPoints = this.nbOfPoints;
  }

  private sendType(): void {
    this.shapeService.type = this.selectedType;
  }

  private updateTool(): void {
    this.polygon = (this.selectedShape === Tools.POLYGON);
  }
}
