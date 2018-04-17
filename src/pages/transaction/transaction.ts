import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Transaction, TransactionsRoot } from '../../interface/iTransaction';


@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
  bankId: string;
  transactionId: string;
  accountId: string;
  transaction: Transaction;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public northbricksApi: NorthbricksApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
    this.bankId = this.navParams.get('bankId');
    this.transactionId = this.navParams.get('transactionId');
    this.accountId = this.navParams.get('accountId');

    console.log(this.accountId);
    this.northbricksApi.fetchTransaction(this.accountId, this.bankId, this.transactionId).subscribe(transaction => {
      this.transaction = transaction;

      console.log(JSON.stringify(transaction));
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
