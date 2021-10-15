import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanDocPage } from './scan-doc.page';

const routes: Routes = [
  {
    path: '',
    component: ScanDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanDocPageRoutingModule {}
