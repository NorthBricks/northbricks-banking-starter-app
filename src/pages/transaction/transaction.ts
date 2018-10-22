import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Transaction } from '../../interface/iTransaction';


@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
  public bic: string;
  public transactionId: string;
  public accountId: string;
  public transaction: Transaction;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public northbricksApi: NorthbricksApi) {

  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
    this.bic = this.navParams.get('bic');
    this.transactionId = this.navParams.get('transactionId');
    this.accountId = this.navParams.get('accountId');

    console.log(this.accountId);
    this.northbricksApi.fetchTransaction(this.accountId, this.bic, this.transactionId).subscribe(transaction => {
      this.transaction = transaction;

      console.log(JSON.stringify(transaction));
    });
  }
  // private close() {
  //   this.viewCtrl.dismiss();
  // }
}
