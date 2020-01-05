/*
  Auteur: Équipe 12
  Description: Ce service permet de créer un lien entre les différents raccourcis du clavier
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from '../color/color.service';
import { DrawingToolService } from '../drawing-tools/drawing-tools.service';
import { DrawingService } from '../drawing/drawing.service';
import { GridService } from '../grid/grid.service';
import { IconService } from '../Icon/icon.service';
import { ManipulationService } from '../manipulation/manipulation.service';
import { SelectionService } from '../selection/selection.service';
import { ShapeService } from '../shape/shape.service';
import { StampService } from '../stamp/stamp.service';
import { ToolChosen, Tools } from '../tools/tool-properties';
import { ToolsService } from '../tools/tools.service';
import { TOPICONLIST } from './../../components/toolbar/icon-list';
import { Shortcuts } from './shortcuts.enum';

const DEFAULT_GRID_SIZE = 50;
const GRID_VAR = 5;
const NULL = 0;
const RESET_GRID = 1;
const ROTATION_ALT_VAR = 1;
const ROTATION_VAR = 15;
const MAX_ROTATION = 360;
const ELEMENT = 'element';

@Injectable({
  providedIn: 'root',
})
export class ShortcutsService {

  constructor(private shapeService: ShapeService, private drawingToolService: DrawingToolService, private toolsService: ToolsService,
              private gridService: GridService, private colorService: ColorService, private selectionService: SelectionService,
              private stampService: StampService, private iconService: IconService, private drawingService: DrawingService,
              private manipulationService: ManipulationService) {}
  state: boolean;
  grid: boolean;
  gridSquareSize = DEFAULT_GRID_SIZE;
  keyAlt: boolean;
  keyShift: boolean;
  rotationSelect = 0;

  private stateGrid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateSaveModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateOpenModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateExportModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateNewModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateSelectTool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateEraseTool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateFillShortcut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateTool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private stateUndo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private stateSource: BehaviorSubject<boolean> = new BehaviorSubject(this.state);
  currentState: Observable<boolean> = this.stateSource.asObservable();

  private modalStateSaveDrawingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentModalStateSaveDrawing: Observable<boolean> = this.modalStateSaveDrawingSource.asObservable();

  private modalStateExportDrawingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentModalStateExportDrawing: Observable<boolean> = this.modalStateSaveDrawingSource.asObservable();

  private modalStateOpenDrawingSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentModalStateOpenDrawing: Observable<boolean> = this.modalStateOpenDrawingSource.asObservable();

  private modalState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentModalState: Observable<boolean> = this.modalState.asObservable();

  private colorPickerModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentCoolorPickerModal: Observable<boolean> = this.colorPickerModal.asObservable();

  private firstModalState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentFirstModal: Observable<boolean> = this.firstModalState.asObservable();
  enteredOnce: boolean;

  private undoOn: boolean;
  private redoOn: boolean;

  onKeyPress(keyboard: KeyboardEvent): void {
    if (!this.turnOffShortcuts()) {
      switch (keyboard.code) {
        case Shortcuts.ONE_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[2]);
          this.toolsService.setToolName(ToolChosen.SHAPES);
          this.shapeService.sendTool(Tools.RECTANGLE);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.TWO_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[2]);
          this.toolsService.setToolName(ToolChosen.SHAPES);
          this.shapeService.sendTool(Tools.ELLIPSE);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.THREE_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[2]);
          this.toolsService.setToolName(ToolChosen.SHAPES);
          this.shapeService.sendTool(Tools.POLYGON);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.C_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[1]);
          this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
          this.drawingToolService.sendTool(Tools.PENCIL);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.A_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[1]);
          this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
          this.drawingToolService.sendTool(Tools.SPRAY_PAINT);
          keyboard.stopImmediatePropagation();
          break;
        case Shortcuts.P_KEY:
              this.setShortcutTool(true);
              this.iconService.updateSelectedIcon(TOPICONLIST[1]);
              this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
              this.drawingToolService.sendTool(Tools.FEATHER);
              keyboard.stopImmediatePropagation();
              break;

        case Shortcuts.W_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[1]);
          this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
          this.drawingToolService.sendTool(Tools.PAINTBRUSH);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.L_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[1]);
          this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
          this.drawingToolService.sendTool(Tools.LINE);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.T_KEY:
          this.setShortcutTool(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[6]);
          this.toolsService.setToolName(ToolChosen.TEXT);
          this.toolsService.setToolChosen(Tools.TEXT);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.Y_KEY:
            this.setShortcutTool(true);
            this.iconService.updateSelectedIcon(TOPICONLIST[1]);
            this.toolsService.setToolName(ToolChosen.DRAWING_TOOLS);
            this.drawingToolService.sendTool(Tools.PEN);
            keyboard.stopImmediatePropagation();
            break;

        case Shortcuts.ESC_KEY:
          this.toolsService.lineShortcuts(true);
          break;

        case Shortcuts.BACKSPACE_KEY:
          this.toolsService.pointShortcuts(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.I_KEY:
          if (this.colorService.pipetteTool) {
            this.colorService.changePipetteState(false);
          } else {
            this.colorService.changePipetteState(true);
          }
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.MINUS_KEY:
          this.decreaseGrid();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.PLUS_KEY:
          if (keyboard.shiftKey) {
            this.increaseGrid();
            keyboard.stopImmediatePropagation();
          }
          break;

        case Shortcuts.ALT_KEY:
            keyboard.preventDefault();
            this.keyAlt = true;
            this.manipulationService.keyAlt(true);

            break;

        case Shortcuts.SHIFT_KEY:
          keyboard.preventDefault();
          this.keyShift = true;
          this.manipulationService.keyShift(true);

          break;

        case Shortcuts.G_KEY:
          if (this.gridService.gridState) {
            this.gridService.updateGridState(false);
          } else {
            this.gridService.updateGridState(true);
          }
          this.setShortcutGrid(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.S_KEY:
          this.iconService.updateSelectedIcon(TOPICONLIST[0]);
          this.setShortcutSelect(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.DELETE_KEY:
          keyboard.preventDefault();
          this.selectionService.delete();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.R_KEY:
          this.setFillToolShortcut(true);
          this.iconService.updateSelectedIcon(TOPICONLIST[7]);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.E_KEY:
          this.iconService.updateSelectedIcon(TOPICONLIST[5]);
          this.setShortcutErase(true);
          keyboard.stopImmediatePropagation();
          break;
      }
    }
  }

  ctrlDown(keyboard: KeyboardEvent): void {
    if (!this.turnOffShortcuts()) {
      switch (keyboard.code) {
        case Shortcuts.C_KEY:
          this.selectionService.copy();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.V_KEY:
          this.selectionService.paste();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.X_KEY:
          this.selectionService.cut();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.S_KEY:
          keyboard.preventDefault();
          this.setShortcutSave(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.G_KEY:
          keyboard.preventDefault();
          this.setShortcutOpen(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.E_KEY:
          keyboard.preventDefault();
          this.setShortcutExport(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.O_KEY:
          keyboard.preventDefault();
          this.setShortcutNew(true);
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.A_KEY:
          keyboard.preventDefault();
          this.selectionService.selectAllElements();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.D_KEY:
          keyboard.preventDefault();
          this.selectionService.duplicate();
          keyboard.stopImmediatePropagation();
          break;

        case Shortcuts.Z_KEY:
          keyboard.preventDefault();
          this.undoOn = this.drawingService.sendUndo();
          this.redoOn = this.drawingService.sendRedo();
          if (keyboard.shiftKey) {
            if (this.redoOn) {
            this.drawingService.clickRedo(); }
          } else {
            if (this.undoOn) {
            this.drawingService.clickUndo(); }
          }
          keyboard.stopImmediatePropagation();
          break;
      }
    }
  }

  onKeyUp(keyboard: KeyboardEvent): void {
    if (keyboard.code === Shortcuts.ESC_KEY) {
      this.toolsService.lineShortcuts(false);
    } else if (keyboard.code === Shortcuts.SHIFT_KEY) {
      this.manipulationService.keyShift(false);
      this.keyShift = false;
      this.selectionService.updateCoordinates();
      this.enteredOnce = false;
    } else if (keyboard.code === Shortcuts.ALT_KEY) {
      this.manipulationService.keyAlt(false);
      this.keyAlt = false;
      this.selectionService.updateCoordinates();
      this.enteredOnce = false;
    }
  }

  changeState(state: boolean): void {
    this.state = state;
  }

  changeModalStateSaveDrawing(state: boolean): void {
    this.modalStateSaveDrawingSource.next(state);
  }

  changeModalStateExportDrawing(state: boolean): void {
    this.modalStateSaveDrawingSource.next(state);
  }

  changeModalStateOpenDrawing(state: boolean): void {
    this.modalStateOpenDrawingSource.next(state);
  }

  stateColorPicker(state: boolean): void {
    this.colorPickerModal.next(state);
  }

  changeModalState(modalState: boolean): void {
    this.modalState.next(modalState);
  }
  stateFirstModal(modalState: boolean): void {
    this.firstModalState.next(modalState);
  }

  turnOffShortcuts(): boolean {
    return (this.state || this.modalState.getValue() || this.firstModalState.getValue()
            || this.modalStateOpenDrawingSource.getValue() || this.modalStateSaveDrawingSource.getValue()
            || this.colorPickerModal.getValue() || this.modalStateExportDrawingSource.getValue());
  }

  setShortcutTool(stateTool: boolean): void {
    this.stateTool.next(stateTool);
  }

  getShortcutTool(): Observable<boolean> {
    return this.stateTool.asObservable();
  }

  setShortcutNew(stateNewModal: boolean): void {
    this.stateNewModal.next(stateNewModal);
  }

  getShortcutNew(): Observable<boolean> {
    return this.stateNewModal.asObservable();
  }

  setShortcutOpen(stateOpenModal: boolean): void {
    this.stateOpenModal.next(stateOpenModal);
  }

  getShortcutOpen(): Observable<boolean> {
    return this.stateOpenModal.asObservable();
  }

  setShortcutExport(stateOpenModal: boolean): void {
    this.stateExportModal.next(stateOpenModal);
  }

  getShortcutExport(): Observable<boolean> {
    return this.stateExportModal.asObservable();
  }
  setShortcutSave(stateSaveModal: boolean): void {
    this.stateSaveModal.next(stateSaveModal);
  }

  getShortcutSelect(): Observable<boolean> {
    return this.stateSelectTool.asObservable();
  }

  setFillToolShortcut(stateFillShortcut: boolean): void {
    this.stateFillShortcut.next(stateFillShortcut);
  }

  getFillToolShortcut(): Observable<boolean> {
    return this.stateFillShortcut.asObservable();
  }

  setShortcutSelect(stateSelectTool: boolean): void {
    this.stateSelectTool.next(stateSelectTool);
  }

  setShortcutErase(stateEraseTool: boolean): void {
    this.stateEraseTool.next(stateEraseTool);
  }

  getShortcutErase(): Observable<boolean> {
    return this.stateEraseTool.asObservable();
  }

  getShortcutSave(): Observable<boolean> {
    return this.stateSaveModal.asObservable();
  }

  setShortcutGrid(stateGrid: boolean): void {
    this.stateGrid.next(stateGrid);
  }

  getShortcutGrid(): Observable<boolean> {
    return this.stateGrid.asObservable();
  }

  increaseGrid(): void {
    this.gridSquareSize += GRID_VAR - this.gridSquareSize % GRID_VAR;
    this.gridService.updateSquareSize(this.gridSquareSize);
  }

  decreaseGrid(): void {
    if (this.gridSquareSize > GRID_VAR) {
      this.gridSquareSize -= GRID_VAR;
    } else {
      this.gridSquareSize = RESET_GRID;
    }
    if (this.gridSquareSize <= NULL) {
      this.gridSquareSize = RESET_GRID;
    }
    this.gridService.updateSquareSize(this.gridSquareSize);
  }

  changeRotation(mouseScroll: number): void {
    let tempRotation = 0;
    if (this.toolsService.getToolName() === ToolChosen.STAMP) {
      this.stampService.currentRotation.subscribe((rotation: number) => tempRotation = rotation);
      tempRotation = this.newAngle(mouseScroll, tempRotation);
      this.stampService.updateRotation(tempRotation);
    } else if (this.iconService.sendIcon() === ToolChosen.SELECT) {
      if (this.keyAlt) {
        if (!this.enteredOnce) {
          this.selectionService.updateCoordinates();
          this.enteredOnce = true;
        }
        this.selectionService.rotateAlt(mouseScroll);
      } else if (this.keyShift) {
        if (!this.enteredOnce) {
          this.selectionService.updateCoordinates();
          this.enteredOnce = true;
        }
        this.selectionService.rotateShift(mouseScroll);
      } else {
        this.selectionService.rotateNormal(mouseScroll);
      }
    } else if (this.toolsService.getToolName() === ToolChosen.DRAWING_TOOLS) {
      this.drawingToolService.currentAngle.subscribe((angle: number) => tempRotation = angle);
      tempRotation = this.newAngle(mouseScroll, tempRotation);
      this.drawingToolService.updateAngle(tempRotation);
    }
  }

  setChoosenRotation(rotationBy: string): void {
    this.keyShift = (rotationBy === ELEMENT);
  }

  private newAngle(mouseScroll: number, tempRotation: number): number {
    if (this.keyAlt) {
      if (mouseScroll < NULL) {
        tempRotation += ROTATION_ALT_VAR;
      } else if (mouseScroll > NULL) {
        tempRotation -= ROTATION_ALT_VAR;
      }
    } else {
      if (mouseScroll < NULL) {
        tempRotation += ROTATION_VAR;
      } else if (mouseScroll > NULL) {
        tempRotation -= ROTATION_VAR;
      }
    }

    if (tempRotation < NULL) {
      tempRotation += MAX_ROTATION;
    } else if (tempRotation > MAX_ROTATION) {
      tempRotation -= MAX_ROTATION;
    }
    return tempRotation;
  }
}
