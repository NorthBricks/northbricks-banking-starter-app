import { Account } from '../../interface/iAccount';
import { Transaction, TransactionsRoot } from '../../interface/iTransaction';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { Bank, Banks } from '../../interface/iBanks';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { ToastService } from '../../providers/utils/toast.service';


@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {
  accounts: Account[] = [];
  banks: Bank[];
  transactions: Transaction[] = [];
  transactionsRoot: TransactionsRoot;
  user: User;
  bank: Bank;
  countTransactions: number = 0;

  constructor(public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    public navParams: NavParams) {
    this.bank = <Bank>navParams.get('bank');
    this.user = <User>navParams.get('user');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
    // alert(this.bank);
    this.northbricksApi.fetchBank(this.bank.id).subscribe(bank => {
      // alert(JSON.stringify(bank));
      this.bank = bank;
    }, () => {
      alert('Error fetchBank');
    });


    this.northbricksApi.fetchAccounts(this.bank.id).subscribe(accounts => {
      console.log(JSON.stringify(accounts));
      this.accounts = accounts.accounts;
    }, () => {
      alert('Error accounts');
    });





  }

  fetchAccountsTransactions(account: Account) {
    // alert(JSON.stringify(account));
    this.northbricksApi.fetchTransactions(account.id, this.bank.id).subscribe(transactions => {
      // alert(JSON.stringify(transactions));
      this.countTransactions = transactions.transactions.length;
      this.transactions = transactions.transactions;
    }, () => {
      alert('Error transactions');
    });
  }

  showTransaction(transaction: Transaction) {
    this.toastCtrl.showTransaction(transaction,
      true,
      5000
    );
  }

}
