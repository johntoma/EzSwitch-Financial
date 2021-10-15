import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/ionic-module';

import { AppComponent } from './app.component';
import { EditDataComponent } from './edit-data/edit-data.component';

describe('AppComponent', () => {

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent, EditDataComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  // TODO: add more tests!

});

describe('EditDataComponent', () => {
  let component: EditDataComponent;
  let fixture: ComponentFixture<EditDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDataComponent],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(EditDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
