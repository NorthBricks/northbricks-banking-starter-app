import { BankAuthPage } from '../bank/bank-auth/bank-auth';
import { Component, ViewChild } from '@angular/core';
import { LoadingController, ModalController, NavController, ActionSheetController, ActionSheetButton, ActionSheet, Events, ToastController, Slides } from 'ionic-angular';

import { Banks, Bank } from '../../interface/iBanks';
import { Transaction } from '../../interface/iTransaction';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Account } from '../../interface/iAccount';
import { ToastService } from '../../providers/utils/toast.service';
import { BankPage } from '../bank/bank';
import { LoginPage } from '../login/login';
import { NorthbricksStorage } from '../../providers/northbricks-storage';
import { LinkBanksPage } from '../link-banks/link-banks';
import { TransactionPage } from '../transaction/transaction';


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
  actionSheet: ActionSheet;
  @ViewChild(Slides) slides: Slides;

  constructor(public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private storage: NorthbricksStorage,
    private events: Events) {



  }

  onItemSelection(selection) {
    console.log(JSON.stringify(selection));
    if (selection) {
      // console.log("item selected: " + selection.iban);
      this.selectedAccount = selection;
      this.fetchAccountsTransactions(selection);
    } else {
      console.log("no item selected");
    }
  }

  loadActionSheet() {

    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Accounts'
    });
    console.log(JSON.stringify(this.accounts));
    this.accounts.forEach(element => {
      this.actionSheet.addButton({ text: element.iban, handler: () => { this.onItemSelection(element) } });
    });
    this.actionSheet.present();

  }


  getColor(value: string) {
    // console.log('Value is ' + value);
    if (value.toString().startsWith("-")) {
      return "red";
    } else {
      return "green"
    }
  }
  getIcon(value: string) {

    if (value.toString().startsWith("-")) {
      return "arrowred";
    } else {
      return "arrowgreen"
    }
  }
  ionViewDidEnter() {
    this.events.subscribe('user:loggedIn', (isLoggedIn) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      if (isLoggedIn) {
        this.northbricksApi.fetchUser().subscribe(user => {
          this.storage.setUser(user);
          this.user = user;
          this.fetchBanks();
        }, error => {
          this.events.publish('http', error);
        });
      }
    });


    // this.loadActionSheet();
  }
  showTransaction(transactionId: string) {
    let transactionModal = this.modalCtrl.create(TransactionPage, { bankId: this.selectedBank.id, transactionId: transactionId, accountId: this.selectedAccount.id });
    transactionModal.present();
  }

  toastTransaction(transaction: Transaction) {

    let toast = this.toastCtrl.create({
      message: JSON.stringify(transaction),
      showCloseButton: true,
      duration: 3000,
      position: 'top'
    });
    toast.present();

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

    let authModal = this.modalCtrl.create(BankPage, { bank: bank, user: this.user });
    authModal.present();
    // authModal.onDidDismiss(dismissed => {
    //   this.fetchBanks();
    // });
  }

  showActionsSheetAccounts() {
    this.loadActionSheet();

  }

  fetchAccounts(bank: Bank) {

    this.northbricksApi.fetchAccounts(bank.id).subscribe(account => {
      console.log(JSON.stringify(account.accounts));

      this.accounts = account.accounts;
      this.selectedAccount = this.accounts[0];
      console.log('Fetching accounts ' + this.selectedAccount);


      if (this.selectedAccount != null) {
        this.fetchAccountsTransactions(this.selectedAccount);
      }
    }, () => {
      alert('Error accounts');
    });
  }

  AddBank(bankId: string, name: string) {
    // alert(bankId);
    let authModal = this.modalCtrl.create(BankAuthPage, { bankId: bankId, name: name });
    authModal.present();
    authModal.onDidDismiss(dismissed => {
      this.fetchBanks();
    });

  }

  getRandom() {
    if (this.slides.getActiveIndex() === 0) {
      return "1200"
    } else {
      return "99212"
    }

  }
  slideChanged(slider) {
    // const currentSlide = this.slides[slider.getActiveIndex()];
    if (this.selectedBank !== this.banks[this.slides.getActiveIndex()]) {
      let currentIndex = this.slides.getActiveIndex();
      this.selectedBank = this.banks[this.slides.getActiveIndex()];
      this.countTransactions = 0;
      this.transactions = null;
      this.fetchAccounts(this.selectedBank);
      console.log('Load accounts ' + currentIndex);
    }


  }
  fetchBanks() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      spinner: 'circles'
    });
    loader.present();
    console.log(this.banks);
    if (this.banks.length === 0) {

      this.northbricksApi.fetchBanks().subscribe(banks => {
        // alert(JSON.stringify(banks));
        this.banks = banks.banks;
        console.log(JSON.stringify(this.bank));
        this.selectedBank = this.banks[this.slides.getActiveIndex()];
        this.fetchAccounts(this.selectedBank);
        loader.dismiss();
      }, (error) => {
        alert(error);
        loader.dismiss();
      });
    } else {
      loader.dismiss();
    }


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
    let modal = this.modalCtrl.create(LinkBanksPage);
    modal.onDidDismiss(token => {
      // alert(token);
      this.fetchBanks();
    });
    modal.present();
  }



}
