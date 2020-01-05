/* tslint:disable */

import { async, TestBed } from '@angular/core/testing';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ShortcutsService } from './shortcuts.service';

describe('ShortcutsService', () => {
  let service: ShortcutsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShortcutsService],
    });
    service = TestBed.get(ShortcutsService);
  });

  it('should be created', () => {
    const service: ShortcutsService = TestBed.get(ShortcutsService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable bool for getShortcutSave', async(() => {
    const bool: Observable<boolean> = service.getShortcutSave();
    spyOn(service, 'getShortcutSave').and.returnValue(of<any>(bool));
    expect(typeof service.getShortcutSave()).toEqual(typeof bool);
  }));

  it('should return an Observable bool for getShortcutSelect', async(() => {
    const bool: Observable<boolean> = service.getShortcutSelect();
    spyOn(service, 'getShortcutSelect').and.returnValue(of<any>(bool));
    expect(typeof service.getShortcutSelect()).toEqual(typeof bool);
  }));

  it('should return an Observable bool for getShortcutNew', async(() => {
    const bool: Observable<boolean> = service.getShortcutNew();
    spyOn(service, 'getShortcutNew').and.returnValue(of<any>(bool));
    expect(typeof service.getShortcutNew()).toEqual(typeof bool);
  }));

  it('should return an Observable bool for getShortcutOpen', async(() => {
    const bool: Observable<boolean> = service.getShortcutOpen();
    spyOn(service, 'getShortcutOpen').and.returnValue(of<any>(bool));
    expect(typeof service.getShortcutOpen()).toEqual(typeof bool);
  }));

  it('should return an Observable bool for getFillToolShortcut', async(() => {
    const bool: Observable<boolean> = service.getFillToolShortcut();
    spyOn(service, 'getFillToolShortcut').and.returnValue(of<any>(bool));
    expect(typeof service.getFillToolShortcut()).toEqual(typeof bool);
  }));

  it('should call the changeState method and return the correct state', () => {
    const state = true;
    service.changeState(state);
    expect(service.state).toEqual(state);
  });


  it('should call the increaseGrid method and return the correct gridSquareSize', () => {
    service.gridSquareSize = 10;
    service.increaseGrid();
    expect(service.gridSquareSize).toEqual(10 + 5 - service.gridSquareSize % 5);
  });

  it('should call the decreaseGrid method and return the correct gridSquareSize when the gridSquareSize is 10', () => {
    service.gridSquareSize = 10;
    service.decreaseGrid();
    expect(service.gridSquareSize).toEqual(10 - 5);
  });

  it('should call the decreaseGrid method and return the correct gridSquareSize when the gridSquareSize is 0', () => {
    service.gridSquareSize = 0;
    service.decreaseGrid();
    expect(service.gridSquareSize).toEqual(1);
  });

  it('should call the decreaseGrid method and return the correct gridSquareSize when the gridSquareSize is 5', () => {
    service.gridSquareSize = 5;
    service.decreaseGrid();
    expect(service.gridSquareSize).toEqual(1);
  });

  it('should call the decreaseGrid method and return the correct gridSquareSize when the gridSquareSize is -5', () => {
    service.gridSquareSize = -5;
    service.decreaseGrid();
    expect(service.gridSquareSize).toEqual(1);
  });

  it('should call the changeRotation method and return the correct rotation when  service.keyAlt=true and mouseScroll<0', () => {
    const number= new BehaviorSubject<number>(1) ;
    service['stampService']['rotation'] = number;
    service.keyAlt = true;
    const mouseScroll = -1;
    service.changeRotation(mouseScroll);
    expect(service['stampService']['rotation']).toEqual(number);
    expect(service.keyAlt).toBe(true);
  });

  it('should call the changeRotation method and return the correct rotation when  service.keyAlt=true and mouseScroll>0', () => {
    const number= new BehaviorSubject<number>(359) ;
    service['stampService']['rotation'] = number;
    service.keyAlt = true;
    const mouseScroll = 1;
    service.changeRotation(mouseScroll);
    expect(service['stampService']['rotation']).toEqual(number);
    expect(service.keyAlt).toBe(true);
  });

  it('should call the changeRotation method and return the correct rotation when  service.keyAlt=false and mouseScroll>0', () => {
    const number= new BehaviorSubject<number>(345) ;
    service['stampService']['rotation'] = number;
    service.keyAlt = false;
    const mouseScroll = 1;
    service.changeRotation(mouseScroll);
    expect(service['stampService']['rotation']).toEqual(number);
    expect(service.keyAlt).toBe(false);
  });

  it('should call the changeRotation method and return the correct rotation when  service.keyAlt=false and mouseScroll<0', () => {
    const number= new BehaviorSubject<number>(15) ;
    service['stampService']['rotation'] = number;
    service.keyAlt = false;
    const mouseScroll = -1;
    service.changeRotation(mouseScroll);
    expect(service['stampService']['rotation']).toEqual(number);
    expect(service.keyAlt).toBe(false);
  });

  it('should call the onKeyPress method, case Shortcuts.ONE_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Digit1"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['shapeService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  
  it('should call the onKeyPress method, case Shortcuts.TWO_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Digit2"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['shapeService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.THREE_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Digit3"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['shapeService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.C_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyC"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.A_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyA"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.P_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyP"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.W_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyW"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.L_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyL"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.T_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyT"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['toolsService'],'setToolChosen');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.Y_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyY"});
    const spy= spyOn(service,'setShortcutTool');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(service['toolsService'],'setToolName');
    const spy3= spyOn(service['drawingToolService'],'sendTool');
    const spy4= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.ESC_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Escape"});
    const spy= spyOn(service['toolsService'],'lineShortcuts');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.BACKSPACE_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Backspace"});
    const spy= spyOn(service['toolsService'],'pointShortcuts');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.I_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyI"});
    service['colorService'].pipetteTool=true;
    const spy= spyOn(service['colorService'],'changePipetteState');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.I_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyI"});
    service['colorService'].pipetteTool=false;
    const spy= spyOn(service['colorService'],'changePipetteState');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.MINUS_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Minus"});
    service['colorService'].pipetteTool=false;
    const spy= spyOn(service,'decreaseGrid');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.PLUS_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Equal",shiftKey:true});
    const spy= spyOn(service,'increaseGrid');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.ALT_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"AltLeft"});
    const spy= spyOn(event,'preventDefault');
    const spy1= spyOn(service['manipulationService'],'keyAlt');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(service['keyAlt']).toBe(true);
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.SHIFT_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"ShiftLeft"});
    const spy= spyOn(event,'preventDefault');
    const spy1= spyOn(service['manipulationService'],'keyShift');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(service['keyShift']).toBe(true);
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.G_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyG"});
    service['gridService'].gridState=true;
    const spy= spyOn(service['gridService'],'updateGridState');
    const spy1= spyOn(service,'setShortcutGrid');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.G_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyG"});
    service['gridService'].gridState=false;
    const spy= spyOn(service['gridService'],'updateGridState');
    const spy1= spyOn(service,'setShortcutGrid');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.S_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyS"});
    const spy= spyOn(service['iconService'],'updateSelectedIcon');
    const spy1= spyOn(service,'setShortcutSelect');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.DELETE_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"Delete"});
    const spy= spyOn(event,'preventDefault');
    const spy1= spyOn(service['selectionService'],'delete');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.R_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyR"});
    const spy= spyOn(service,'setFillToolShortcut');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyPress method, case Shortcuts.E_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keypress',{code:"KeyE"});
    const spy= spyOn(service,'setShortcutErase');
    const spy1= spyOn(service['iconService'],'updateSelectedIcon');
    const spy2= spyOn(event,'stopImmediatePropagation');
    service.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.C_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyC"});
    !service.turnOffShortcuts();
    const spy= spyOn(service['selectionService'],'copy');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.V_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyV"});
    !service.turnOffShortcuts();
    const spy= spyOn(service['selectionService'],'paste');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.X_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyX"});
    !service.turnOffShortcuts();
    const spy= spyOn(service['selectionService'],'cut');
    const spy1= spyOn(event,'stopImmediatePropagation');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.S_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyS"});
    !service.turnOffShortcuts();
    const spy= spyOn(service,'setShortcutSave');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.G_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyG"});
    !service.turnOffShortcuts();
    const spy= spyOn(service,'setShortcutOpen');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.E_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyE"});
    !service.turnOffShortcuts();
    const spy= spyOn(service,'setShortcutExport');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.O_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyO"});
    !service.turnOffShortcuts();
    const spy= spyOn(service,'setShortcutNew');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.A_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyA"});
    !service.turnOffShortcuts();
    const spy= spyOn(service['selectionService'],'selectAllElements');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.D_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyD"});
    !service.turnOffShortcuts();
    const spy= spyOn(service['selectionService'],'duplicate');
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the ctrlDown method, case Shortcuts.Z_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown',{code:"KeyZ",shiftKey:true});
    !service.turnOffShortcuts();
    const spy1= spyOn(event,'stopImmediatePropagation');
    const spy2= spyOn(event,'preventDefault');
    service.ctrlDown(event);
    expect(service['undoOn']).toEqual(service['drawingService'].sendUndo());
    expect(service['redoOn']).toEqual(service['drawingService'].sendRedo());
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call the onKeyUp method, case Shortcuts.ESC_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup',{code:"Escape"});
    const spy= spyOn(service['toolsService'],'lineShortcuts');
    service.onKeyUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the onKeyUp method, case Shortcuts.SHIFT_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup',{code:"ShiftLeft"});
    const spy= spyOn(service['manipulationService'],'keyShift');
    const spy1= spyOn(service['selectionService'],'updateCoordinates');
    service.onKeyUp(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(service['keyShift']).toBe(false);
    expect(service['enteredOnce']).toBe(false);
  });

  it('should call the onKeyUp method, case Shortcuts.ALT_KEY ', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup',{code:"AltLeft"});
    const spy= spyOn(service['manipulationService'],'keyAlt');
    const spy1= spyOn(service['selectionService'],'updateCoordinates');
    service.onKeyUp(event);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(service['keyAlt']).toBe(false);
    expect(service['enteredOnce']).toBe(false);
  });

  it('should call the setChoosenRotation method', () => {
    const rotation:string= '12';
    service.setChoosenRotation(rotation);
    expect(service.keyShift).toEqual(rotation==='element');
  });

  it('should call the newAngle method if mouseScroll>NULL and keyShift=true', () => {
    const mouseScroll:number= 10;
    let tempsRotation:number=10;
    service['keyShift']=true;
    service['newAngle'](mouseScroll,tempsRotation);
    expect(tempsRotation).toEqual(10);
  });

  it('should call the newAngle method if mouseScroll<NULL and keyShift=true', () => {
    const mouseScroll:number= -1;
    const tempsRotation:number=10;
    service['keyShift']=true;
    let a=service['newAngle'](mouseScroll,tempsRotation);
    expect(a).toEqual(25);
  });

  it('should call the newAngle method if mouseScroll<NULL and keyShift=false', () => {
    const mouseScroll:number= -1;
    const tempsRotation:number=10;
    service['keyShift']=false;
    let a=service['newAngle'](mouseScroll,tempsRotation);
    expect(a).toEqual(25);
  });

  it('should call the newAngle method if mouseScroll>NULL and keyShift=false', () => {
    const mouseScroll:number= 10;
    const tempsRotation:number=10;
    service['keyShift']=false;
    let a= service['newAngle'](mouseScroll,tempsRotation);
    expect(a).toEqual(355);
  });

  it('should call the decreaseGrid', () => {
    service['gridSquareSize']=10;
    spyOn<any>(service['gridService'],'updateSquareSize');
    service.decreaseGrid();
    expect(service['gridSquareSize']).toEqual(5);
  });

  it('should call the decreaseGrid', () => {
    service['gridSquareSize']=5;
    spyOn<any>(service['gridService'],'updateSquareSize');
    service.decreaseGrid();
    expect(service['gridSquareSize']).toEqual(1);
  });

  it('should call the decreaseGrid', () => {
    service['gridSquareSize']=-1;
    spyOn<any>(service['gridService'],'updateSquareSize');
    service.decreaseGrid();
    expect(service['gridSquareSize']).toEqual(1);
  });

  it('should call the increaseGrid', () => {
    service['gridSquareSize']=1;
    spyOn<any>(service['gridService'],'updateSquareSize');
    service.increaseGrid();
    expect(service['gridSquareSize']).toEqual(5);
  });


});
