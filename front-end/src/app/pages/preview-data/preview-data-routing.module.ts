import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewDataPage } from './preview-data.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewDataPageRoutingModule {}
