import { Component } from '@angular/core';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';

@Component({
  selector: 'app-attributes-paint-bucket',
  templateUrl: './attributes-paint-bucket.component.html',
  styleUrls: ['./attributes-paint-bucket.component.scss'],
})
export class AttributesPaintBucketComponent {
  tolerance: number;
  strokeWidth: number;
  selectedType: string;

  constructor(private paintBucketService: PaintBucketService) {
    this.tolerance = this.paintBucketService.tolerance;
    this.strokeWidth = this.paintBucketService.strokeWidth;
    this.selectedType = this.paintBucketService.traceType;
  }

  private sendTolerance(): void {
    this.paintBucketService.tolerance = this.tolerance;
  }

  private sendStrokeWidth(): void {
    this.paintBucketService.strokeWidth = this.strokeWidth;
  }

  private sendType(): void {
    this.paintBucketService.traceType = this.selectedType;
  }
}
