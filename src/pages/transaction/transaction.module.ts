import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionPage } from './transaction';

@NgModule({
  declarations: [
    TransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionPage),
  ],
})
export class TransactionPageModule {}
