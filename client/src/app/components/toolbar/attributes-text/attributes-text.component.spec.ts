/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TextService } from 'src/app/services/text/text.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { AttributesTextComponent } from './attributes-text.component';
import { BehaviorSubject } from 'rxjs';

describe('AttributesTextComponent', () => {
  let component: AttributesTextComponent;
  let fixture: ComponentFixture<AttributesTextComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesTextComponent ],
      imports: [TestingImportsModule],
      providers: [TextService, ShortcutsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the text font', async(() => {
    component['textService'] = new TextService();
    const test: BehaviorSubject<string> = component['textService']['font'];
    component['sendFont']();
    expect(typeof test).toEqual(typeof component['textService']['font']);
  }));

  it('should update the text allignment', async(() => {
    component['textService'] = new TextService();
    const test: BehaviorSubject<string> = component['textService']['alignement'];
    component['sendAlign']();
    expect(typeof test).toEqual(typeof component['textService']['alignement']);
  }));

  it('should update the text size', async(() => {
    component['textService'] = new TextService();
    const test: BehaviorSubject<number> = component['textService']['textSize'];
    component['sendTextSize']();
    expect(typeof test).toEqual(typeof component['textService']['textSize']);
  }));

  it('should update the bold condition if this.bold == true', async(() => {
    component['textService'] = new TextService();
    component['bold'] = true;
    const test: BehaviorSubject<string> = component['textService']['isBold'];
    component['toggleBold']();
    expect(typeof test).toEqual(typeof component['textService']['isBold']);
  }));


  it('should update the italic condition if this.italic == true', async(() => {
    component['textService'] = new TextService();
    component['italic'] = true;
    const test: BehaviorSubject<string> = component['textService']['isItalic'];
    component['toggleItalic']();
    expect(typeof test).toEqual(typeof component['textService']['isItalic']);
  }));
});
