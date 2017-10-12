import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController } from 'ionic-angular';
import { URLSearchParams } from "@angular/http";
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { NorthbricksApi } from "../../providers/northbricks-api";
import { Subscription } from "rxjs/Subscription";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };
  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };
  // browser: InAppBrowserObject;
  constructor(public iab: InAppBrowser, public toastCtrl: ToastController, public northbricksApi: NorthbricksApi,
    public viewCtrl: ViewController, public navParams: NavParams) {
    // this.browser = new InAppBrowser(NorthbricksApi.oAuthUrl, '_self', { location: 'no', clearsessioncache: 'yes', clearcache: 'yes' }).show();
    this.loginNorthbricks().then(response => {


      NorthbricksApi.accessToken = response.access_token;
      alert(response.access_token);
      alert(NorthbricksApi.accessToken);
      // this.northbricksApi.fetchBanks().subscribe(banks => {
      //   alert(JSON.stringify(banks));
      // });
      // alert(JSON.stringify(response));
    }, error => {
      alert('Error ' + JSON.stringify(error));
    });
  }

  handleLoadStart(event: InAppBrowserEvent) {
    alert(event.url);
    console.log(event);
  }

  loginNorthbricks(): Promise<OAuthResponse> {
    // alert(NorthbricksApi.oAuthUrl);
    return new Promise((resolve, reject) => {

      let browserRef: InAppBrowserObject = this.iab.create(NorthbricksApi.oAuthUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes")

      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        alert("The  sign in flow was canceled");
        reject(new Error("The Northbricks sign in flow was canceled"));
      });

      browserRef.on("loadstart").subscribe((event) => {
        // console.log(JSON.stringify(event));
        // console.log('Load start event url ' + JSON.stringify(event.url));
        // alert(JSON.stringify(event.url));
        // console.log('LOADSTART _ FIIIIIRRREEEE???');
        if ((event.url).indexOf(`https://localhost/oauth/token`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          exitSubscription.unsubscribe();
          browserRef.close();


          // let params = new URLSearchParams(event.url);
          // alert('Access token ' + event.url + params.get('access_token'));
          alert(event.url);
          console.log(event.url);
          var responseParameters = ((event.url).split("#")[1]).split("&");
          // var responseParameters = ((event.url).split("&"));
          // alert('Response parameters ' + responseParameters);
          var parsedResponse = {};
          // var parsedResponse: OAuthResponse;
          console.log('RESPONSE::: ' + responseParameters);
          // alert(responseParameters.length);
          for (var i = 0; i < responseParameters.length; i++) {
            alert(responseParameters[i]);
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          console.log('PARSED RESPONSE ' + JSON.stringify(parsedResponse));
          if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
            alert(parsedResponse);
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


  doLogin() {

    let toast = this.toastCtrl.create({
      message: 'Logged in...',
      duration: 1000,
      position: 'top'
    });
    toast.present();

    toast.onDidDismiss(() => {
      this.viewCtrl.dismiss();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}

export interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}