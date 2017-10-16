import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController, PopoverController } from 'ionic-angular';

import { Banks } from '../../interface/iBanks';
import { Transaction } from '../../interface/iTransaction';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { ToastService } from '../../providers/utils/toast.service';
import { BankPage } from '../bank/bank';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  transactions: Transaction[] = [];
  banks: Banks[] = [];
  constructor(public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService) {

  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.fetchBanks();
      refresher.complete();
    }, 2000);
  }
  showBank(bankId: number) {
    let popover = this.popoverCtrl.create(BankPage, { bankId: bankId });
    popover.present();
    // this.toastCtrl.create('Not implemented yet - ID- ' + transactionId, false, 1000);
  }
  ionViewCanEnter() {
    this.fetchBanks();
  }

  fetchBanks() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      spinner: 'circles'
    });
    loader.present();

    this.northbricksApi.fetchBanks().subscribe(banks => {
      this.banks = banks;
      // alert(JSON.stringify(banks));
      loader.dismiss();
    }, () => {
      loader.dismiss();
    });


  }

  openLogin() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(token => {
      // alert(token);
      this.fetchBanks();
    });
    modal.present();
  }



}
