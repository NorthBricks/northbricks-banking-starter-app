import { LoginPage } from '../login/login';

// import { GroupsRootObject } from '../../interface/iBubble';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';
import { NorthbricksStorage } from "../../providers/northbricks-storage";
import { Transaction } from "../../interface/iTransaction";
import { ToastService } from "../../providers/utils/toast.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  transactions: Transaction[] = [];
  constructor(public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public storage: NorthbricksStorage,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService) {

    this.northbricksApi.fetchBanks().subscribe(banks => {
      alert(JSON.stringify(banks));
    });

  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.fetchTransactions();
      refresher.complete();
    }, 2000);
  }
  showTransaction(transactionId: number) {
    this.toastCtrl.create('Not implemented yet - ID- ' + transactionId, false, 1000);
  }
  ionViewCanEnter() {
    // this.fetchTransactions();



  }

  fetchTransactions() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      spinner: 'circles'
    });
    loader.present();

    this.northbricksApi.fetchTransactions(1).subscribe(data => {
      console.log(JSON.stringify(data));
      this.transactions = data;
      loader.dismiss();
    }, () => {
      loader.dismiss();
    });

  }

  openLogin() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(dismissed => {
      alert(dismissed);
      this.northbricksApi.fetchBanks().subscribe(banks => {
        console.log(JSON.stringify(banks));
      }, error => {
        console.log(JSON.stringify(error));
      });
    });
    modal.present();
  }



}
