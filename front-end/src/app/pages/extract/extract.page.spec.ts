import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ExtractPage } from './extract.page';
import { EditDataComponent } from 'src/app/edit-data/edit-data.component';

describe('ExtractPage', () => {
  let component: ExtractPage;
  let fixture: ComponentFixture<ExtractPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractPage],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(ExtractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


