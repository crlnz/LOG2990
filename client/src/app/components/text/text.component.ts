import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { Shortcuts } from 'src/app/services/shortcuts/shortcuts.enum';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TextService } from 'src/app/services/text/text.service';
import { SvgAttributes, SvgTypes } from '../svg-attributes';
import { KeyboardCode, TextProperties, TextVariables } from './text-properties';

const EMPTY_CHAIN = '';
const DEFAULT_MESSAGE = 'Inserer texte ici!';
const LINE_SPACING = '1.5em';
const CHAR_LENGTH = 1;
const FONT_FAMILY = 'font-family:';
const TEXTBOX_OUTLINE = 'outline: 1.2px dashed gray';
const NONE = 'none';
const NEW_STRING = ' ';
const SUBSTRING_START = 0;
const ZERO = 0;
const PRE = 'pre';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  private text: SVGElement;
  private textbox: SVGElement;
  private properties: TextProperties;
  private textVariables: TextVariables = new TextVariables();
  private textInput: string = DEFAULT_MESSAGE;
  private shortcutService: ShortcutsService;
  private container: SVGElement;

  constructor(private renderer: Renderer2, private svgElement: ElementRef, private drawingService: DrawingService,
              private textService: TextService, private colorService: ColorService) {

    this.textService.currentToolChosen.subscribe((otherToolChosen: boolean) => {
      this.textVariables.otherToolChosen = otherToolChosen;
      if (this.textVariables.otherToolChosen && this.textVariables.functionWasExecuted && this.textVariables.isWriting) {
        this.removePreview();
      }
    });
    this.textService.currentIsWrittingState.subscribe((isWriting: boolean) => this.textVariables.isWriting = isWriting);
  }

  write(posX: number, posY: number, shortcutService: ShortcutsService, textColor: string): void {
    this.shortcutService = shortcutService;
    this.properties = {textSize: 0, fontStyle: '', fontWeight: '', alignement: '', posX, posY, font: '', textColor};
    this.textVariables.functionWasExecuted = true;

    if (!this.textVariables.isWriting) {
      this.reinitialiseArrays();
      this.textVariables.onFirstInput = true;
      this.shortcutService.changeState(true);
      this.textService.changeIsWritingState(true);
      this.createText();
      this.createTextbox();
      this.updateTextProperties();
      this.textbox.textContent = DEFAULT_MESSAGE;
    } else {
      this.removePreview();
    }
  }

  private reinitialiseArrays(): void {
    this.textVariables.inputs = [];
    this.textVariables.textboxes = [];
  }

  private removePreview(): void {
    this.shortcutService.changeState(false);
    this.textService.changeIsWritingState(false);

    if (this.textbox.textContent === DEFAULT_MESSAGE) {
      this.renderer.removeChild(this.svgElement.nativeElement, this.container);
      this.renderer.removeChild(this.container, this.text);
      this.renderer.removeChild(this.text, this.textbox);

    } else {
      this.renderer.setAttribute(this.text, SvgAttributes.STYLE, NONE);
      this.drawingService.fillDrawingArray(this.container);
    }
  }

  private createText(): void {
    this.container = this.renderer.createElement(SvgTypes.G, SvgTypes.SVG_LINK);
    this.text = this.renderer.createElement(SvgTypes.TEXT, SvgTypes.SVG_LINK);
    this.renderer.appendChild(this.svgElement.nativeElement, this.container);
    this.renderer.appendChild(this.container, this.text);
    this.textAttributes();
  }

  private createTextbox(): void {
    this.textbox = this.renderer.createElement(SvgTypes.TSPAN, SvgTypes.SVG_LINK);
    this.textbox.textContent = this.textInput;
    this.renderer.appendChild(this.text, this.textbox);
    this.textboxAttributes();
  }

  private textboxAttributes(): void {
    this.renderer.setAttribute(this.textbox, SvgAttributes.DY, LINE_SPACING);
    this.renderer.setAttribute(this.textbox, SvgAttributes.X, this.properties.posX.toString());
  }

  private textAttributes(): void {
    this.renderer.setAttribute(this.text, SvgAttributes.STYLE, TEXTBOX_OUTLINE);
    this.renderer.setAttribute(this.text, SvgAttributes.X, this.properties.posX.toString());
    this.renderer.setAttribute(this.text, SvgAttributes.Y, this.properties.posY.toString());
  }

  private updateTextProperties(): void {
    this.text.style.whiteSpace = PRE;
    this.updateFontWeight();
    this.updateFont();
    this.updateFontStyle();
    this.updateTextAlignment();
    this.updateTextSize();
    this.updateTextColor();
  }

  private updateFontStyle(): void {
    this.textService.currentItalicStatus.subscribe((fontStyle: string) => {
      if (this.textVariables.isWriting) {
        this.properties.fontStyle = fontStyle;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.FONT_STYLE, this.properties.fontStyle );
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.FONT_STYLE, this.properties.fontStyle );
      }
    });
  }

  private updateTextColor(): void {
    this.colorService.currentPrimaryColor.subscribe((color: string) => {
      if (this.textVariables.isWriting) {
        this.properties.textColor = color;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.FILL, this.properties.textColor);
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.FILL, this.properties.textColor);
      }
    });
  }

  private updateTextAlignment(): void {
    this.textService.currentAlignement.subscribe((alignement: string) => {
      if (this.textVariables.isWriting) {
        this.properties.alignement = alignement;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.TEXT_ANCHOR, this.properties.alignement);
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.TEXT_ANCHOR, this.properties.alignement);
      }
    });
  }

  private updateTextSize(): void {
    this.textService.currentTextSize.subscribe((textSize: number) => {
      if (this.textVariables.isWriting) {
        this.properties.textSize = textSize;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.FONT_SIZE, (this.properties.textSize).toString());
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.FONT_SIZE, (this.properties.textSize).toString());
      }
    });
  }

  private updateFontWeight(): void {
    this.textService.currentBoldStatus.subscribe((fontWeight: string) => {
      if (this.textVariables.isWriting) {
        this.properties.fontWeight = fontWeight;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.FONT_WEIGHT, this.properties.fontWeight );
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.FONT_WEIGHT, this.properties.fontWeight);
      }
    });
  }

  private updateFont(): void {
    this.textService.currentFont.subscribe((font: string) => {
      if (this.textVariables.isWriting) {
        this.properties.font = font;
        for (const element of this.textVariables.textboxes) {
          this.renderer.setAttribute(element, SvgAttributes.STYLE, FONT_FAMILY + this.properties.font);
        }
        this.renderer.setAttribute(this.textbox, SvgAttributes.STYLE, FONT_FAMILY + this.properties.font);
      }
    });
  }

  onWritingText(event: KeyboardEvent): void {
    this.updateTextProperties();
    this.isAcceptedKey(event);
    if (this.textVariables.onFirstInput && this.textVariables.acceptedKeys) {
      this.textInput = EMPTY_CHAIN;
      this.textbox.textContent = EMPTY_CHAIN;
    }
    if (this.textVariables.isWriting && this.textVariables.acceptedKeys) {
      if (event.key === Shortcuts.ENTER_KEY) {
        event.preventDefault();
        this.onEnter();
      } else if (event.key === Shortcuts.BACKSPACE_KEY) {
        this.onBackspace();
      } else {
        this.onTextInput(event);
      }
    }
  }

  private onTextInput(event: KeyboardEvent): void {
    if (this.textVariables.newEnter) {
      this.textVariables.newEnter = false;
      this.textInput = this.textInput.substring(SUBSTRING_START, this.textInput.length - CHAR_LENGTH);
      this.textbox.textContent = this.textInput;
    }
    this.textInput += event.key;
    this.textbox.textContent += event.key;
    this.textVariables.onFirstInput = false;
  }

  private isAcceptedKey(event: KeyboardEvent) {
    const code = event.code;
    const isShift = (code === KeyboardCode.SHIFT_LEFT) || (code === KeyboardCode.SHIFT_RIGHT);
    const isArrow = (code === KeyboardCode.ARROW_LEFT) || (code === KeyboardCode.ARROW_RIGHT) ||
      (code === KeyboardCode.ARROW_DOWN) || (code === KeyboardCode.ARROW_UP);
    const isCtrl = (code === KeyboardCode.CTRL_LEFT) || (code === KeyboardCode.CTRL_RIGHT);
    const isEsc = (code === KeyboardCode.ESC);
    const isInsert = (code === KeyboardCode.INSERT);
    const isDelete = (code === KeyboardCode.DELETE);
    const isPage = (code === KeyboardCode.PAGE_UP) || (code === KeyboardCode.PAGE_DOWN);
    const isHome = (code === KeyboardCode.HOME);
    const isEnd = (code === KeyboardCode.END);
    const isAlt = (code === KeyboardCode.ALT_LEFT) || (code === KeyboardCode.ALT_RIGHT);
    const isTab = (code === KeyboardCode.TAB);
    const isCapsLock = (code === KeyboardCode.CAP_LOCK);

    if (code === KeyboardCode.SPACE) {
      event.preventDefault();
    }

    if (isShift || isArrow || isCtrl || isEsc || isInsert || isDelete || isPage || isHome || isEnd || isAlt || isTab || isCapsLock) {
      event.preventDefault();
      this.textVariables.acceptedKeys = false;
    } else {
      this.textVariables.acceptedKeys = true;
    }
  }

  private onBackspace(): void {
    this.onCurrentLine();
    this.textInput = this.textInput.substring(SUBSTRING_START, this.textInput.length - CHAR_LENGTH);
    this.textbox.textContent = this.textInput;
  }

  private savePreviousInfo(): void {
    this.textVariables.inputs.push(this.textInput);
    this.textVariables.textboxes.push(this.textbox);
  }

  private onEnter(): void {
    this.savePreviousInfo();
    this.textInput = this.textInput.substring(this.textInput.length);
    this.createTextbox();
    if (this.textInput.length === ZERO) {
      this.textInput += NEW_STRING;
      this.textbox.textContent += NEW_STRING;
      this.textVariables.newEnter = true;
    }
  }

  private onCurrentLine(): void {
    if (this.textInput.length === ZERO && this.textVariables.inputs.length !== ZERO && this.textVariables.textboxes.length !== ZERO) {
      this.textInput = this.textVariables.inputs.pop() || EMPTY_CHAIN;
      this.renderer.removeChild(this.svgElement.nativeElement, this.textbox);
      this.textbox = (this.textVariables.textboxes.pop() as SVGElement);
    }
  }
}
