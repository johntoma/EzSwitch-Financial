import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanDocPageRoutingModule } from './scan-doc-routing.module';

import { ScanDocPage } from './scan-doc.page';
import { FileUploadModule } from 'ng2-file-upload';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanDocPageRoutingModule,
    FileUploadModule
  ],
  declarations: [ScanDocPage]
})
export class ScanDocPageModule {}
