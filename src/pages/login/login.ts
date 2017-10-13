import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController } from 'ionic-angular';
import { URLSearchParams } from "@angular/http";
// import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { NorthbricksApi } from "../../providers/northbricks-api";
import { Subscription } from "rxjs/Subscription";
import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  constructor(public toastCtrl: ToastController, public northbricksApi: NorthbricksApi,
    public viewCtrl: ViewController, public navParams: NavParams, private ngAuthProvider: AuthServiceNorthbricksProvider) {
    // this.browser = new InAppBrowser(NorthbricksApi.oAuthUrl, '_self', { location: 'no', clearsessioncache: 'yes', clearcache: 'yes' }).show();
    ngAuthProvider.loginNorthbricks().then(response => {


      NorthbricksApi.accessToken = response.access_token;
      // alert(response.access_token);
      // alert(NorthbricksApi.accessToken);
      // this.northbricksApi.fetchBanks().subscribe(banks => {
      //   alert(JSON.stringify(banks));
      // });
      // alert(JSON.stringify(response));
    }, error => {
      alert('Error ' + JSON.stringify(error));
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

