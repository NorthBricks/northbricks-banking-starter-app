import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { Bank, Banks } from '../../interface/iBanks';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { BankAuthPage } from '../bank/bank-auth/bank-auth';
import { InAppBrowserObject, InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AuthServiceNorthbricksProvider, OAuthResponse } from '../../providers/auth-service-northbricks/auth-service-northbricks';

@IonicPage()
@Component({
  selector: 'page-link-banks',
  templateUrl: 'link-banks.html',
})
export class LinkBanksPage {
  public banks: Bank[] = [];
  public bank: Banks;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    public northbricksApi: NorthbricksApi,
    private viewCtrl: ViewController) {
  }

  public ionViewDidLoad() {
    this.fetchBanks();

  }
  public fetchBanks() {
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
  public AddBank(bankId: string, name: string) {
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
  public bankAuth(bankId: string) {
    let baseUrl = 'https://api.northbricks.io/api/v1'
    // return new Promise((resolve, reject) => {

    let urlAuth: string = baseUrl + `/me/banks/${bankId}/auth?access_token=${AuthServiceNorthbricksProvider.devAccessToken}`;
    let browserRef: InAppBrowserObject = this.iab.create(urlAuth, "_blank", "location=no,clearsessioncache=yes,clearcache=yes")


    // browserRef.on('loadstop').subscribe(event => {
    //   browserRef.insertCSS({ code: "body{color: red;" });
    //   browserRef.close();
    // });
    browserRef.on("loadstart").subscribe((event) => {
      alert(event);
      browserRef.close();
      if ((event.url).indexOf(`https://api.northbricks.io/api/v1`) === 0) {
        console.log('Fick tillbaka loadstart - redirect url');
        // exitSubscription.unsubscribe();
        browserRef.close();


        console.log(event.url);
        var responseParameters = ((event.url).split("#")[1]).split("&");
        var parsedResponse = {};
        console.log('RESPONSE::: ' + responseParameters);
        for (var i = 0; i < responseParameters.length; i++) {
          parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        }
        console.log('PARSED RESPONSE ' + JSON.stringify(parsedResponse));
        if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
          console.log('Access token..');
          // resolve(<OAuthResponse>parsedResponse);
        } else {
          console.log("Problem authenticating with Northbricks");
          // reject(new Error("Problem authenticating with Northbricks"));
        }
      }
      console.log("Outside" + JSON.stringify(event));
    });

    browserRef.on("exit").subscribe((event) => {
      alert("The  sign in flow was canceled");
      // reject(new Error("The Northbricks sign in flow was canceled"));
    });
    // });



  }



  public close() {
    this.viewCtrl.dismiss();
  }
}
