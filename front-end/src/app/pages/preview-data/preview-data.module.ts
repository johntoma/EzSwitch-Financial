import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewDataPageRoutingModule } from './preview-data-routing.module';

import { PreviewDataPage } from './preview-data.page';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewDataPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  declarations: [PreviewDataPage]
})
export class PreviewDataPageModule {}
