/*  Auteur: Équipe 12
    Description: Cette composante gère les choix de couleurs choisis par l'utilisateur sur la palette de couleur
*/
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

const PALETTE_IMAGE_PATH = '../../../../assets/palette.png';
const WIDTH = 255;
const HEIGHT = 255;
const CANVAS_CONTEXT = '2d';
const ZERO = '0';
const HASHTAG = '#';
const NULL = 0;

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
})

export class ColorPaletteComponent implements AfterViewInit {
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @Output() outputColor: EventEmitter<string> = new EventEmitter();

  private context: CanvasRenderingContext2D;
  private hexValue: string;
  private width: number = WIDTH;
  private height: number = HEIGHT;

  ngAfterViewInit() {
    this.loadImage();
  }

  loadImage(): void {
    const image: HTMLImageElement = new Image();
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext(CANVAS_CONTEXT);

    this.context.clearRect(NULL, NULL, canvas.width, canvas.height);
    canvas.width = this.width;
    canvas.height = this.height;

    image.onload = () => {
      this.context.drawImage(image, NULL, NULL, canvas.width, canvas.height);
    };
    image.src = PALETTE_IMAGE_PATH;
  }

  getPixel(event: MouseEvent): void {
    const RGBA = 256;
    const CONVERSION = 65536;
    const PIXEL_DIMENSION = 1;
    const MAX_LENGTH = 6;
    const NB_BITS = 16;

    const boundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const x: number = event.clientX - boundingRect.left;
    const y: number = event.clientY - boundingRect.top;

    const pixels: ImageData = this.context.getImageData(x, y, PIXEL_DIMENSION, PIXEL_DIMENSION);
    const dateArray: Uint8ClampedArray = pixels.data;
    const color: number = dateArray[2] + RGBA * dateArray[1] + CONVERSION * dateArray[0];

    this.hexValue = (color.toString(NB_BITS));

    // for loop pour s'assurer que la couleur entrer et de longueur 6
    if (this.hexValue.length < MAX_LENGTH) {
      const k: number = MAX_LENGTH - this.hexValue.length;
      for (let i = NULL; i < k; i++) {
        this.hexValue = (ZERO + this.hexValue);
      }
    }
    this.hexValue = (HASHTAG + this.hexValue);
    this.outputColor.emit(this.hexValue);
  }
}
