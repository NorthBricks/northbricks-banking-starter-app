import { BankAuthPage } from '../bank/bank-auth/bank-auth';
import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController, ActionSheetController, ActionSheetButton, ActionSheet } from 'ionic-angular';

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
  constructor(public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastService,
    private storage: NorthbricksStorage) {



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
    // if (this.actionSheet) {
    //   console.log('Action sheet exists');
    //   this.actionSheet.present();

    // } else {
    //   console.log('Action does not  exists');

    //   if (this.selectedBank) {
    //     this.fetchAccounts(this.selectedBank);
    //   } else {
    //     this.fetchBanks();
    //   }
    // }
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
  ionViewDidLoad() {

    this.northbricksApi.fetchUser().subscribe(user => {
      this.storage.setUser(user);
      this.user = user;
      this.fetchBanks();
    }, error => {
      alert(error);
    });

    // this.loadActionSheet();
  }
  showTransaction(transactionId: string) {
    let transactionModal = this.modalCtrl.create(TransactionPage, { bankId: this.selectedBank.id, transactionId: transactionId, accountId: this.selectedAccount.id });
    transactionModal.present();
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
  showActionsSheetAccounts() {
    this.loadActionSheet();

  }

  fetchAccounts(bank: Bank) {

    this.northbricksApi.fetchAccounts(bank.id).subscribe(account => {
      console.log(JSON.stringify(account.accounts));

      this.accounts = account.accounts;
      this.selectedAccount = this.accounts[0];
      console.log('Fetching accounts');


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
    let modal = this.modalCtrl.create(LinkBanksPage);
    modal.onDidDismiss(token => {
      // alert(token);
      this.fetchBanks();
    });
    modal.present();
  }



}
