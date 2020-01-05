import { Component } from '@angular/core';
import { EraserService } from 'src/app/services/eraser/eraser.service';

const DEFAULT_ERASER_SIZE = 10;
@Component({
  selector: 'app-attributes-eraser',
  templateUrl: './attributes-eraser.component.html',
  styleUrls: ['./attributes-eraser.component.scss'],
})
export class AttributesEraserComponent {
  private eraserSize = DEFAULT_ERASER_SIZE;

  constructor(private eraserService: EraserService) {}

  private updateSize(): void {
    this.eraserService.eraserSize(this.eraserSize);
  }
}
