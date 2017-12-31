import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankAuthPage } from './bank-auth';

@NgModule({
  declarations: [
    BankAuthPage,
  ],
  imports: [
    IonicPageModule.forChild(BankAuthPage),
  ],
})
export class BankAuthPageModule {}
