/* tslint:disable */

import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TextService } from 'src/app/services/text/text.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { DrawingToolProperties } from '../drawing-tools/drawing-tool-properties';
import { TextComponent } from './text.component';
import { ColorService } from 'src/app/services/color/color.service';
@Component({
  template: `<path></path>`,
})
class MockLineComponent { }
@Component({
  template: `<SVG></SVG>`,
})
class MockSVGComponent {
}
class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
  appendChild(parent: any, child: any) {
    return;
  }
  createElement(name: string, element: string) {
    return new MockLineComponent();
  }
  setAttribute(element: any, element2: any, element3: any) {
    return true;
  }
  removeChild(parent: any, child: any) {
    return;
  }
}
describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;
  let renderer: Renderer2;
  let svgElement: ElementRef;
  let drawingService: DrawingService;
  let drawingToolProperties: DrawingToolProperties;
  let textService: TextService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextComponent],
      imports: [TestingImportsModule],
      providers: [TextService, DrawingService, { provide: ElementRef, useClass: MockSVGComponent }, { provide: Renderer2, useClass: MockRenderer }, DrawingService,
        ShortcutsService,],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write', () => {
    component['properties'] =  { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    component['createText']();
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['createTextbox']();
    component['textbox'] = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    component['shortcutService'] = TestBed.get(ShortcutsService);
    component.write(1, 1, component['shortcutService'], '');
    expect(component['textVariables'].onFirstInput).toBe(true);
    expect(component['textbox'].textContent).toEqual('Inserer texte ici!');
  });

  it('should reinitialiseArrays', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    const test = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['textVariables'].inputs = ['text'];
    component['textVariables'].textboxes = [test];
    spyOn<any>(component, 'reinitialiseArrays').and.callThrough();
    component['reinitialiseArrays']();
    expect(component['textVariables'].inputs).toEqual([]);
    expect(component['textVariables'].textboxes).toEqual([]);
  });

  it('should create text', () => {
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['text'] = text;
    spyOn<any>(component, 'createText').and.callThrough();
    spyOn<any>(component, 'textAttributes').and.callThrough();
    spyOn<any>(component, 'updateTextAlignment').and.callThrough();
    component['createText']();
    expect(component['text'].getAttribute('x')).toEqual(component['properties'].posX.toString());
  });

  it('should removePreview', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const shortcutService = TestBed.get(ShortcutsService);
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['shortcutService'] = shortcutService;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['text'] = text;
    component['textbox'] = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    spyOn<any>(component, 'removePreview').and.callThrough();
    component['container'] = document.createElementNS('http://www.w3.org/2000/svg','g') as SVGElement;
    component['removePreview']();
    expect(component['shortcutService'].state).toBe(false);
  });

  it('should verify if user is on current line', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['textInput'] = '';
    component['textVariables'].inputs.length = 1;
    component['textVariables'].textboxes.length = 1;
    const test = 'test';
    component['textVariables'].inputs.push(test);
    component['onCurrentLine']();
    expect(component['textInput']).toEqual('test');
  });

  it('should create a textbox when the enter button is pressed', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const userInput = 'userInput';
    component['textInput'] = userInput;
    spyOn<any>(component, 'onEnter').and.callThrough();
    component['onEnter']();
    expect(component['textVariables'].inputs.includes(userInput)).toBe(true);
    expect(component['textInput'].length).toEqual(1);
  });

  it('should remove a character of the textInput on backSpace', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const userInput = 'userInput';
    component['textInput'] = userInput;
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    spyOn<any>(component, 'onBackspace').and.callThrough();
    component['createText']();
    component['createTextbox']();
    component['onBackspace']();
    expect(component['textInput'].length).toBe(userInput.length - 1);
  });

  it('should change the acceptedKeys boolean to true if the we click a legitimate key', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'KeyA',
    });
    spyOn<any>(component, 'isAcceptedKey').and.callThrough();
    component['isAcceptedKey'](event);
    expect(component['textVariables'].acceptedKeys).toBe(true);
  });

  it('should change the acceptedKeys boolean to false if the we click a legitimate key', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'ShiftLeft',
    });
    spyOn<any>(component, 'isAcceptedKey').and.callThrough();
    component['isAcceptedKey'](event);
    expect(component['textVariables'].acceptedKeys).toBe(false);
  });

  it('should concatenate keyboard input into a text input', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'KeyA',
    });
    spyOn<any>(component, 'onTextInput').and.callThrough();
    component['createText']();
    component['createTextbox']();
    component['textInput'] = component['textInput'].substring(component['textInput'].length);
    component['onTextInput'](event);
    expect(component['textInput']).toEqual(event.key);
    expect(component['textVariables'].onFirstInput).toBe(false);
  });

  it('should set textInput and textContent to empty chain when onWritingText', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'KeyA',
    });
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['textVariables'].onFirstInput = true;
    component['textVariables'].acceptedKeys = true;
    spyOn<any>(component, 'onWritingText').and.callThrough();
    component['createTextbox']();
    component['onWritingText'](event);
    expect(component['textInput']).toEqual('');
  });

  it('should go onEnter if keypressed is the enter key', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    component['textVariables'].isWriting = true;
    component['textVariables'].acceptedKeys = true;
    component['textInput'] = '';
    const userInput = 'userInput';
    component['textInput'] = userInput;
    spyOn<any>(component, 'onWritingText').and.callThrough();
    spyOn<any>(component, 'onEnter').and.callThrough();
    component['createTextbox']();
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['onWritingText'](event);
    expect(component['textInput'].length).toEqual(1);
  });

  it('should go onBackspace if keypressed is the backspace key', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Backspace',
    });
    component['textVariables'].isWriting = true;
    component['textVariables'].acceptedKeys = true;
    component['textInput'] = '';
    const userInput = 'userInput';
    component['textInput'] = userInput;
    spyOn<any>(component, 'onWritingText').and.callThrough();
    spyOn<any>(component, 'onBackspace').and.callThrough();
    component['createTextbox']();
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['onWritingText'](event);
    expect(component['textInput'].length).toBe(userInput.length - 1);
  });

  it('should go onTextInput on any other alphanumerical key', () => {
    const mockSVGComponent = new MockSVGComponent();
    const elementRef = new ElementRef(mockSVGComponent);
    renderer = TestBed.get(Renderer2);
    drawingService = new DrawingService();
    textService = new TextService();
    const colorService = new ColorService();
    component = new TextComponent(renderer, elementRef, drawingService, textService, colorService);
    component['properties'] = { textSize: 1, fontStyle: '', fontWeight: '', alignement: '', posX: 1, posY: 1, font: '', textColor: '' };
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'KeyA',
    });
    component['textVariables'].isWriting = true;
    component['textVariables'].acceptedKeys = true;
    component['textInput'] = component['textInput'].substring(component['textInput'].length);
    spyOn<any>(component, 'onWritingText').and.callThrough();
    spyOn<any>(component, 'onTextInput').and.callThrough();
    component['createTextbox']();
    component['text'] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    component['onWritingText'](event);
    expect(component['textInput']).toEqual(event.key);
    expect(component['textVariables'].onFirstInput).toBe(false);
  });

});
