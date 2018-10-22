import { NorthbricksApi } from '../../../providers/northbricks-api';
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { AuthServiceNorthbricksProvider, OAuthResponse } from '../../../providers/auth-service-northbricks/auth-service-northbricks';
import { Subscription } from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-bank-auth',
  templateUrl: 'bank-auth.html',
})
export class BankAuthPage {
  public bic: string;
  public name: string;
  public response: OAuthResponse;
  private baseUrl = 'https://api.northbricks.io/api/v1'
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public northbricksApi: NorthbricksApi,
    private iab: InAppBrowser,
    private platform: Platform) {

    this.bic = navParams.get("bic");
  }
  public dismiss() {
    this.viewCtrl.dismiss();
  }
  public ionViewDidLoad() {
    this.platform.ready().then(() => {
      console.log('ionViewDidLoad BankAuthPage');
      this.bankAuth(this.bic)
      // .then(response => {
      //   console.log(JSON.stringify(response));

      //   this.response = response;
      // }, error => {
      //   alert(JSON.stringify(error));
      // });
    });
    // this.authBank().then(callback => {
    //   alert(JSON.stringify(callback));
    // }, error => {
    //   console.log(JSON.stringify(error));
    // });
  }
  public bankAuth(bic: string) {
    let baseUrl = 'https://api.northbricks.io/api/v1'
    // return new Promise((resolve, reject) => {
    alert(AuthServiceNorthbricksProvider.devAccessToken);
    alert('e2857d3c-0216-4f2f-8629-387de1940472');
    alert(bic);
    let urlAuth: string = baseUrl + `/me/banks/${bic}/auth?access_token=${AuthServiceNorthbricksProvider.devAccessToken}`;
    let browserRef: InAppBrowserObject = this.iab.create(urlAuth, "_self", "location=no,clearsessioncache=yes,clearcache=yes")

    browserRef.on("exit").subscribe((event) => {
      console.log("The  sign in flow was canceled");
      // reject(new Error("The Northbricks sign in flow was canceled"));
    });
    browserRef.on('loadstop').subscribe(event => {
      browserRef.insertCSS({ code: "body{color: red;" });
      browserRef.close();
    });
    browserRef.on("loadstart").subscribe((event) => {
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
    // });



  }
  public authBank(): Promise<OAuthResponse> {

    return new Promise((resolve, reject) => {
      this.bic = this.navParams.get('bic');
      this.name = this.navParams.get('name');
      let urlAuth: string = this.baseUrl + `/me/banks/${this.bic}/auth?access_token=${AuthServiceNorthbricksProvider.devAccessToken}`;
      let browserRef: InAppBrowserObject = this.iab.create(urlAuth, "_blank", "location=no,clearsessioncache=yes,clearcache=yes")
      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        console.log("The  sign in flow was canceled");
        browserRef.close();
        reject(new Error("The Northbricks sign in flow was canceled"));
      }, error => {
        console.log(JSON.stringify(error));
      });
      browserRef.on("loadstart").subscribe((event) => {
        console.log(JSON.stringify(event));

        if ((event.url).indexOf(`https://api.northbricks.io/api/v1/`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          exitSubscription.unsubscribe();
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
            resolve(<OAuthResponse>parsedResponse);
          } else {
            console.log("Problem authenticating with Northbricks");
            reject(new Error("Problem authenticating with Northbricks"));
          }
        }
      });
    });
  }

}

