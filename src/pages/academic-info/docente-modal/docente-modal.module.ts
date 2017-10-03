import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocenteModal } from './docente-modal';

@NgModule({
  declarations: [
    DocenteModal,
  ],
  imports: [
    IonicPageModule.forChild(DocenteModal),
  ],
  exports: [
    DocenteModal
  ]
})
export class DocenteModalPageModule {}
