/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { AttributesStampComponent } from './attributes-stamp.component';

describe('AttributesStampComponent', () => {
  let component: AttributesStampComponent;
  let fixture: ComponentFixture<AttributesStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesStampComponent ],
      imports: [TestingImportsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});