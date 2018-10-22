import { Account } from '../../interface/iAccount';
import { Transaction, TransactionsRoot } from '../../interface/iTransaction';
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
// import * as moment from 'moment';
import { Bank } from '../../interface/iBanks';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { ToastService } from '../../providers/utils/toast.service';
import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';


@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {
  public accounts: Account[] = [];
  public banks: Bank[];
  public transactions: Transaction[] = [];
  public transactionsRoot: TransactionsRoot;
  public user: User;
  public bank: Bank;
  public countTransactions: number = 0;

  constructor(private northbricksApi: NorthbricksApi,
    private viewCtrl: ViewController,
    private toastCtrl: ToastService,
    public navParams: NavParams,
    private authService: AuthServiceNorthbricksProvider) {
    this.bank = <Bank>navParams.get('bank');
    this.user = <User>navParams.get('user');

  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
    // alert(JSON.stringify(this.user));
    this.northbricksApi.fetchBank(this.bank.bic).subscribe(bank => {
      // alert(JSON.stringify(bank));
      this.bank = bank;
    }, () => {
      alert('Error fetchBank');
      this.dismiss();
    });


    this.northbricksApi.fetchAccounts(this.bank.bic).subscribe(accounts => {
      console.log(JSON.stringify(accounts));
      this.accounts = accounts.accounts;
    }, () => {
      alert('Error accounts');
      this.dismiss();
    });





  }
  public dismiss() {
    this.viewCtrl.dismiss();
  }
  public navigateTo() {
    this.authService.navigateTo('http://www.nordea.com').then(done => {
      console.log(done);
    }, error => {
      console.log(error);
    });
  }

  public fetchAccountsTransactions(account: Account) {
    // alert(JSON.stringify(account));
    this.northbricksApi.fetchTransactions(account.id, this.bank.bic).subscribe(transactions => {
      // alert(JSON.stringify(transactions));
      this.countTransactions = transactions.transactions.length;
      this.transactions = transactions.transactions;
    }, () => {
      alert('Error transactions');
    });
  }

  public showTransaction(transaction: Transaction) {
    this.toastCtrl.showTransaction(transaction,
      true,
      5000
    );
  }

}
