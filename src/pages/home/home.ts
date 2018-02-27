import { BankAuthPage } from '../bank/bank-auth/bank-auth';
import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';

import { Banks, Bank } from '../../interface/iBanks';
import { Transaction } from '../../interface/iTransaction';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';

import { ToastService } from '../../providers/utils/toast.service';
import { BankPage } from '../bank/bank';
import { LoginPage } from '../login/login';
import { NorthbricksStorage } from '../../providers/northbricks-storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  transactions: Transaction[] = [];
  banks: Bank[] = [];
  bank: Banks;
  accountId: number;
  user: User;
  constructor(public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    private storage: NorthbricksStorage) {

  }

  ionViewDidLoad() {

    this.northbricksApi.fetchUser().subscribe(user => {
      this.storage.setUser(user);
      this.user = user;
      this.fetchBanks();
    }, error => {
      alert(error);
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.fetchBanks();
      refresher.complete();
    }, 2000);
  }
  showBank(bank: Banks) {
    // alert(bank.id);
    this.navCtrl.push(BankPage, { bank: bank, user: this.user });

  }
  ionViewCanEnter() {

  }
  AddBank(bankId: string, name: string) {
    alert(bankId);
    let authModal = this.modalCtrl.create(BankAuthPage, { bankId: bankId, name: name });
    authModal.present();

  }
  fetchBanks() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      spinner: 'circles'
    });
    loader.present();

    this.northbricksApi.fetchBanks().subscribe(banks => {
      // alert(JSON.stringify(banks));
      this.banks = banks.banks;
      console.log(JSON.stringify(this.bank));
      loader.dismiss();
    }, (error) => {
      alert(error);
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
