import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { Bank, Banks } from '../../interface/iBanks';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { BankAuthPage } from '../bank/bank-auth/bank-auth';

@IonicPage()
@Component({
  selector: 'page-link-banks',
  templateUrl: 'link-banks.html',
})
export class LinkBanksPage {
  banks: Bank[] = [];
  bank: Banks;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
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
      // alert(JSON.stringify(banks));
      this.banks = banks.banks;

      console.log(JSON.stringify(this.bank));
      loader.dismiss();
    }, (error) => {
      alert(error);
      loader.dismiss();
    });


  }
  AddBank(bankId: string, name: string) {
    alert(bankId);
    this.northbricksApi.addBankToUser(bankId).subscribe(addedBank => {
      let authModal = this.modalCtrl.create(BankAuthPage, { bankId: bankId, name: name });
      authModal.present();
    }, error => {
      alert(JSON.stringify(error));
      let authModal = this.modalCtrl.create(BankAuthPage, { bankId: bankId, name: name });
      authModal.present();
    });

  }
  close() {
    this.viewCtrl.dismiss();
  }
}
