import { Component } from '@angular/core';
import { TextService } from 'src/app/services/text/text.service';

const BOLD = 'bold';
const NONE = '';
const ITALIC = 'italic';

@Component({
  selector: 'app-attributes-text',
  templateUrl: './attributes-text.component.html',
  styleUrls: ['./attributes-text.component.scss'],
})
export class AttributesTextComponent {
  private selectedFont: string;
  private selectedAlign: string;
  private textSize: number;
  private bold: boolean;
  private italic: boolean;

  constructor(private textService: TextService) {
    this.textService.currentFont.subscribe((font: string) => this.selectedFont = font);
    this.textService.currentAlignement.subscribe((alignement: string) => this.selectedAlign = alignement);
    this.textService.currentTextSize.subscribe((textSize: number) => this.textSize = textSize);
    this.bold = false;
    this.italic = false;
  }

  private sendFont(): void {
    this.textService.updateFont(this.selectedFont);
  }

  private toggleBold(): void {
    this.bold = !this.bold;
    this.textService.changeBoldStatus((this.bold) ? BOLD : NONE);
  }

  private toggleItalic(): void {
    this.italic = !this.italic;
    this.textService.changeItalicStatus((this.italic) ? ITALIC : NONE);
  }

  private sendAlign(): void {
    this.textService.updateAlignement(this.selectedAlign);
  }

  private sendTextSize(): void {
    this.textService.updateTextSize(this.textSize);
  }
}
