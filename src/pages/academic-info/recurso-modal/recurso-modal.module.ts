import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecursoModal } from './recurso-modal';

@NgModule({
  declarations: [
    RecursoModal,
  ],
  imports: [
    IonicPageModule.forChild(RecursoModal),
  ],
  exports: [
    RecursoModal
  ]
})
export class RecursoModalModule {}
