import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsAndConditionsPage } from './terms-and-conditions';

@NgModule({
  declarations: [
    TermsAndConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsAndConditionsPage),
  ],
})
export class TermsAndConditionsPageModule {}
