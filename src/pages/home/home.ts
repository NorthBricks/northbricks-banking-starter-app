import { BankAuthPage } from '../bank/bank-auth/bank-auth';
import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';

import { Banks, Bank } from '../../interface/iBanks';
import { Transaction } from '../../interface/iTransaction';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Account } from '../../interface/iAccount';
import { ToastService } from '../../providers/utils/toast.service';
import { BankPage } from '../bank/bank';
import { LoginPage } from '../login/login';
import { NorthbricksStorage } from '../../providers/northbricks-storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedAccount: Account;
  transactions: Transaction[] = [];
  banks: Bank[] = [];
  bank: Banks;
  accountId: number;
  selectedBank: Bank;
  user: User;
  accounts: Account[] = [];
  countTransactions: number = 0;

  constructor(public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    private storage: NorthbricksStorage) {

  }

  public onItemSelection(selection) {
    console.log(JSON.stringify(selection));
    if (selection) {
      console.log("item selected: " + selection.iban);
      this.fetchAccountsTransactions(selection);
    } else {
      console.log("no item selected");
    }
  }
  getColor(value: string) {
    console.log('Value is ' + value);
    if (value.toString().startsWith("-")) {
      return "red";
    } else {
      return "green"
    }
  }
  getIcon(value: string) {

    if (value.toString().startsWith("-")) {
      return "arrow-dropdown";
    } else {
      return "arrow-dropup"
    }
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

  fetchAccounts(bank: Bank) {
    this.northbricksApi.fetchAccounts(bank.id).subscribe(account => {
      console.log(JSON.stringify(account.accounts));

      this.accounts = account.accounts;
      this.selectedAccount = this.accounts[0];
      if (this.selectedAccount != null) {
        this.fetchAccountsTransactions(this.selectedAccount);
      }
    }, () => {
      alert('Error accounts');
    });
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
      this.selectedBank = this.banks[0];
      this.fetchAccounts(this.selectedBank);
      loader.dismiss();
    }, (error) => {
      alert(error);
      loader.dismiss();
    });


  }

  fetchAccountsTransactions(account: Account) {
    // alert(JSON.stringify(account));
    this.northbricksApi.fetchTransactions(account.id, this.selectedBank.id).subscribe(transactions => {
      // alert(JSON.stringify(transactions));
      this.countTransactions = transactions.transactions.length;
      this.transactions = transactions.transactions;
    }, () => {
      alert('Error transactions');
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
