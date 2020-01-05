/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { UserGuideComponent } from './user-guide.component';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGuideComponent ],
      imports: [TestingImportsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
