/* tslint:disable */

import { async, TestBed } from '@angular/core/testing';
import { TestingImportsModule } from '../../testing-imports/testing-imports';
import { ModalWindowComponent, ModalWindowContentComponent } from './modal-window.component';
import { ModalTestImportsModule } from './modalTestImport';

describe('ModalWindowComponent', () => {
  let modalComponent: ModalWindowComponent;
  let modalContentComponent: ModalWindowContentComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWindowComponent, ModalWindowContentComponent, ModalWindowContentComponent],
      imports: [TestingImportsModule, ModalTestImportsModule, ],
      providers: [ModalWindowComponent, ModalWindowContentComponent],

    });
    modalComponent = TestBed.get(ModalWindowComponent);
    modalContentComponent = TestBed.get(ModalWindowContentComponent);
  }));

  it('should create', () => {
    expect(modalComponent).toBeTruthy();
  });

  it('should toggleVisibility', () => {
    modalContentComponent = new ModalWindowContentComponent();
    modalContentComponent.isChecked = true;
    modalContentComponent['toggleVisibility']();
    expect(modalContentComponent.isChecked).toEqual(false);
  });
});
