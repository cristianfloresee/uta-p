import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalInfoPage } from './personal-info';
import { PipesModule } from './../../app/pipes.module';

@NgModule({
  declarations: [
    PersonalInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalInfoPage),
    PipesModule
  ],
  exports: [
    PersonalInfoPage
  ]
})
export class PersonalInfoPageModule {}
