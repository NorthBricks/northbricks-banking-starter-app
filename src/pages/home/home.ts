import { Component, ViewChild } from '@angular/core';
import { LoadingController, ModalController, NavController, ActionSheetController, ActionSheet, Events, ToastController, Slides } from 'ionic-angular';

import { Banks, Bank } from '../../interface/iBanks';
import { Transaction } from '../../interface/iTransaction';
import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { Account } from '../../interface/iAccount';
import { BankPage } from '../bank/bank';
import { NorthbricksStorage } from '../../providers/northbricks-storage';
import { LinkBanksPage } from '../link-banks/link-banks';
import { TransactionPage } from '../transaction/transaction';
import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';

import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public selectedAccount: Account;
  public transactions: Transaction[] = [];
  public banks: Bank[] = [];
  public bank: Banks;
  public loadingText = 'Loading accounts...';
  public accountId: number;
  public selectedBank: Bank;
  public user: User;
  public accounts: Account[] = [];
  public countTransactions: number = 0;
  public actionSheet: ActionSheet;
  public accountBalance: number = 0;
  private subscriptions: Array<Subscription> = [];
  @ViewChild(Slides) public slides: Slides;

  constructor(public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private storage: NorthbricksStorage,
    private events: Events,
    private auth: AuthServiceNorthbricksProvider) {



  }

  public onItemSelection(selection) {
    console.log(JSON.stringify(selection));
    if (selection) {
      console.log("item selected: " + selection.iban);
      this.selectedAccount = selection;
      this.fetchAccountsTransactions(selection);
    } else {
      console.log("no item selected");
    }
  }
  public LoadSafari() {
    this.auth.LoadSafari();
  }

  public loadActionSheet() {

    this.actionSheet = this.actionSheetCtrl.create({
      title: 'Accounts'
    });
    console.log(JSON.stringify(this.accounts));
    if (this.accounts) {

      this.accounts.forEach(element => {
        this.actionSheet.addButton({ text: element.iban, handler: () => { this.onItemSelection(element) } });
      });
      this.actionSheet.present();

    }
  }


  public getColor(value: string) {
    // console.log('Value is ' + value);
    if (value.toString().startsWith("-")) {
      return "red";
    } else {
      return "green"
    }
  }
  public getIcon(value: string) {

    if (value.toString().startsWith("-")) {
      return "arrowred";
    } else {
      return "arrowgreen"
    }
  }
  public ionViewDidLoad() {
    // this.events.subscribe('user:loggedIn', (isLoggedIn) => {
    //   // user and time are the same arguments passed in `events.publish(user, time)`
    //   if (isLoggedIn) {
    this.events.subscribe('disconnectedBank', disconn => {
      if (disconn) {
        this.fetchBanks();
      }
    });
    console.log('Did enter home');
    this.storage.getUser().then(user => {
      // alert(JSON.stringify(user));
      if (user) {
        this.user = user;
        this.fetchBanks();
      } else {
        console.log('Logging out home');
        this.events.publish('user:loggedOut', true);
      }
    }, error => {
      console.log('HTTP out home');
      // this.events.publish('http', error);
    });
    // }
    // });


    // this.loadActionSheet();
  }
  public showTransaction(transactionId: string) {
    let transactionModal = this.modalCtrl.create(TransactionPage, { bic: this.selectedBank.bic, transactionId: transactionId, accountId: this.selectedAccount.id });
    transactionModal.present();
  }

  public toastTransaction(transaction: Transaction) {

    let toast = this.toastCtrl.create({
      message: JSON.stringify(transaction),
      showCloseButton: true,
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

  public lowerCaseBank(bankName: string): string {

    if (bankName === 'Swedbank SE') {
      return 'swedbank';
    }
    return bankName.toLowerCase();
  }

  public doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.fetchBanks();
      refresher.complete();
    }, 2000);
  }
  public showBank(bank: Banks) {

    let authModal = this.modalCtrl.create(BankPage, { bank: bank, user: this.user });
    authModal.present();
    authModal.onDidDismiss(dismissed => {
      this.fetchBanks();
    });
  }

  public showActionsSheetAccounts() {
    this.loadActionSheet();

  }

  public fetchAccounts(bank: Bank) {
    // alert(bank.id);
    if (!bank) {
      return;
    }
    this.subscriptions.push(this.northbricksApi.fetchAccounts(bank.bic).subscribe(account => {
      alert(JSON.stringify(account.accounts));

      this.accounts = account.accounts;
      this.selectedAccount = this.accounts[0];
      console.log('Fetching accounts ' + this.selectedAccount);

      if (this.accounts.length !== 0) {
        console.log('Balance ' + this.selectedAccount.balance);
        if (this.selectedAccount.balance === null) {
          this.accountBalance = 0;
        } else {
          this.accountBalance = this.selectedAccount.balance;
        }
        console.log(JSON.stringify(this.selectedAccount));
        this.fetchAccountsTransactions(this.selectedAccount);
      } else {
        this.accounts = null;
        this.selectedAccount = null;
        this.loadingText = "No accounts found";
      }
    }, error => {
      this.events.publish('http', error);
      this.accounts = null;
      this.selectedAccount = null;
      this.loadingText = "There were issues loading accounts";
    }));
  }

  // private AddBank(bic: string, name: string) {
  //   // alert(bic);
  //   let authModal = this.modalCtrl.create(BankAuthPage, { bic: bic, name: name });
  //   authModal.present();
  //   authModal.onDidDismiss(dismissed => {
  //     this.fetchBanks();
  //   });

  // }

  public getRandom() {
    if (this.slides.getActiveIndex() === 0) {
      return "1200"
    } else {
      return "99212"
    }

  }
  public slideChanged(slider) {
    // const currentSlide = this.slides[slider.getActiveIndex()];
    this.subscriptions.forEach((subscription: Subscription) => {
      console.log('Cancel subscriptions ' + subscription);
      subscription.unsubscribe();
    });

    this.loadingText = "Loading accounts..."
    this.accountBalance = 0;
    this.transactions = [];
    this.selectedAccount = null;
    if (this.selectedBank !== this.banks[this.slides.getActiveIndex()]) {
      let currentIndex = this.slides.getActiveIndex();
      this.selectedBank = this.banks[this.slides.getActiveIndex()];
      this.countTransactions = 0;
      this.transactions = null;
      // alert(JSON.stringify(this.selectedBank));
      this.fetchAccounts(this.selectedBank);
      console.log('Load accounts ' + currentIndex);
    }


  }
  public fetchBanks() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      spinner: 'circles'
    });

    loader.present();
    console.log('Fetch banks ' + this.banks.length);
    // if (this.banks.length === 0) {

    this.subscriptions.push(this.northbricksApi.fetchMyBanks().subscribe(banks => {
      // alert('banks... ' + JSON.stringify(banks));

      if (banks.banks.length === 0) {
        alert('You dont have any connected banks yet to Northbricks. We open up page for you to connect to your bank.');
        this.openLogin();
      } else {
        console.log(JSON.stringify(banks));
        this.banks = banks.banks;
        console.log(JSON.stringify(this.bank));
        this.selectedBank = this.banks[this.slides.getActiveIndex()];
        this.fetchAccounts(this.selectedBank);
      }

      loader.dismiss();
    }, (error) => {
      alert(JSON.stringify(error));
      if (error.status === 401) {
        this.events.publish('http', error);

      }
      loader.dismiss();
    }));
    // } else {
    //   loader.dismiss();
    // }


  }

  public fetchAccountsTransactions(account: Account) {
    this.northbricksApi.fetchTransactions(account.id, this.selectedBank.bic).subscribe(transactions => {
      this.countTransactions = transactions.transactions.length;
      this.transactions = transactions.transactions;
    }, () => {

      this.transactions = [];
    });
  }

  public openLogin() {
    let modal = this.modalCtrl.create(LinkBanksPage);
    modal.onDidDismiss(token => {
      // alert(token);
      this.fetchBanks();
    });
    modal.present();
  }



}
