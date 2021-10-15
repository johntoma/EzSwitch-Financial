import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'scan-doc',
    loadChildren: () => import('./pages/scan-doc/scan-doc.module').then( m => m.ScanDocPageModule)
  },
  {
    path: 'preview-data',
    loadChildren: () => import('./pages/preview-data/preview-data.module').then( m => m.PreviewDataPageModule)
  },
  {
    path: 'extract',
    loadChildren: () => import('./pages/extract/extract.module').then( m => m.ExtractPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
