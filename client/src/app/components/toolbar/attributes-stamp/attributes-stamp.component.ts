import { Component } from '@angular/core';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { Tools } from 'src/app/services/tools/tool-properties';

@Component({
  selector: 'app-attributes-stamp',
  templateUrl: './attributes-stamp.component.html',
  styleUrls: ['./attributes-stamp.component.scss'],
})
export class AttributesStampComponent {
  private selectedStamp: string;
  private scale: number;
  private rotate: number;

  constructor(private stampService: StampService) {
    this.stampService.tool = Tools.STAMP;
    this.selectedStamp = this.stampService.stamp;
    this.scale = this.stampService.scale;
    this.stampService.currentRotation.subscribe((rotation: number) => this.rotate = rotation);
  }

  private sendRotate(): void {
    this.stampService.updateRotation(this.rotate);
  }

  private sendScale(): void {
    this.stampService.scale = this.scale;
  }

  private sendStamp(): void {
    this.stampService.stamp = this.selectedStamp;
  }
}
