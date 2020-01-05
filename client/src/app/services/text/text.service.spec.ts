/* tslint:disable */

import { async, TestBed } from '@angular/core/testing';
import { Subject, BehaviorSubject } from 'rxjs';
import { TextService } from './text.service';

describe('TextService', () => {
  let service: TextService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextService],
    });
    service = TestBed.get(TextService);
  });

  it('should be created', () => {
    const service: TextService = TestBed.get(TextService);
    expect(service).toBeTruthy();
  });
  it('should call the next method when changeToolChosen() is called', async(() => {
    const otherToolChosen = true;
    const event: Subject<Boolean> = service['switchTools'];
    service.changeToolChosen(otherToolChosen);
    spyOn(service['switchTools'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['switchTools']);
  }));
  it('should call the next method when changeIsWritingState() is called', async(() => {
    const isWritting = true;
    const event: Subject<Boolean> = service['isWritting'];
    service.changeIsWritingState(isWritting);
    spyOn(service['isWritting'], 'next').and.callThrough();
    expect(typeof event).toEqual(typeof service['isWritting']);
  }));

  it('should update the text size', async(()=>{
    const test: BehaviorSubject<number> = service['textSize'];
    const size: number = 1;
    service.updateTextSize(size);
    expect(typeof test).toEqual(typeof service['textSize']);
  }));

  it('should update the allignment', async(()=>{
    const test: BehaviorSubject<string> = service['alignement'];
    const allign: string = '';
    service.updateAlignement(allign);
    expect(typeof test).toEqual(typeof service['alignement']);
  }));

  it('should update the font', async(()=>{
    const test: BehaviorSubject<string> = service['font'];
    const font: string = '';
    service.updateFont(font);
    expect(typeof test).toEqual(typeof service['alignement']);
  }));

  it('should update the bold state', async(()=>{
    const test: BehaviorSubject<string> = service['isBold'];
    const bold: string = '';
    service.changeBoldStatus(bold);
    expect(typeof test).toEqual(typeof service['isBold']);
  }));

  it('should update the italic state', async(()=>{
    const test: BehaviorSubject<string> = service['isItalic'];
    const italic: string = '';
    service.changeItalicStatus(italic);
    expect(typeof test).toEqual(typeof service['isItalic']);
  }));
});
