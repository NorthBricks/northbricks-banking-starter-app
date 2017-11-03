import { Transaction } from '../../interface/iTransaction';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Banks } from '../../interface/iBanks';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';


@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {
  bank: Banks;
  transactions: Transaction[] = [];
  user: User;
  constructor(public northbricksApi: NorthbricksApi, public navCtrl: NavController, public navParams: NavParams) {
    this.bank = <Banks>navParams.get('bank');
    this.user = <User>navParams.get('user');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
    alert(this.bank);
    this.northbricksApi.fetchBank(this.bank.id).subscribe(bank => {
      // alert(JSON.stringify(bank));
      this.bank = bank;
    }, () => {
      alert('Error fetchBank');
    });
    // alert(this.user.id + ' ' + this.bank.id);
    this.northbricksApi.fetchTransactions(this.user.id, this.bank.id).subscribe(transactions => {
      // alert(JSON.stringify(transactions));
      this.transactions = transactions;
    }, () => {
      alert('Error transactions');
    });



  }

}
