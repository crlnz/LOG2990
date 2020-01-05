export interface TextProperties {
    textSize: number;
    fontStyle: string;
    fontWeight: string;
    alignement: string;
    posX: number;
    posY: number;
    font: string;
    textColor: string;
}

export class TextVariables {
    isWriting: boolean;
    onFirstInput: boolean;
    otherToolChosen: boolean;
    functionWasExecuted: boolean;
    inputs: string[] = [];
    textboxes: SVGElement[] = [];
    acceptedKeys: boolean;
    newEnter: boolean;
}

export enum KeyboardCode {
    SHIFT_LEFT = 'ShiftLeft',
    SHIFT_RIGHT = 'ShiftRight',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_RIGHT = 'ArrowRight',
    ARROW_DOWN = 'ArrowDown',
    ARROW_UP = 'ArrowUp',
    CTRL_LEFT = 'ControlLeft',
    CTRL_RIGHT= 'ControlRight',
    ESC = 'Escape',
    INSERT = 'Insert',
    DELETE = 'Delete',
    PAGE_UP = 'PageUp',
    PAGE_DOWN = 'PageDown',
    HOME = 'Home',
    END = 'End',
    ALT_LEFT = 'AltLeft',
    ALT_RIGHT = 'AltRight',
    TAB = 'Tab',
    CAP_LOCK = 'CapsLock',
    SPACE = 'Space',
}
