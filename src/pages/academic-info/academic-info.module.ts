import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcademicInfoPage } from './academic-info';
import { PipesModule } from './../../app/pipes.module';

@NgModule({
  declarations: [
    AcademicInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AcademicInfoPage),
    PipesModule
  ],
  exports: [
    AcademicInfoPage
  ]
})
export class AcademicInfoPageModule {}
