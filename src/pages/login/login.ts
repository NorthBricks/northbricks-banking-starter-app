import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController } from 'ionic-angular';

import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksStorage } from '../../providers/northbricks-storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  constructor(public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private storage: NorthbricksStorage,
    public navParams: NavParams,
    private ngAuthProvider: AuthServiceNorthbricksProvider) {

  }




  doLogin() {
    this.ngAuthProvider.loginNorthbricks().then(response => {
      AuthServiceNorthbricksProvider.accessToken = response.access_token;
      this.closeModal();

    }, error => {
      this.closeModal();
      alert('Error ' + JSON.stringify(error));
    });

  }
  closeModal() {
    this.storage.setToken(AuthServiceNorthbricksProvider.accessToken).then(token => {
      this.viewCtrl.dismiss(AuthServiceNorthbricksProvider.accessToken);
    });
  }


  showToast() {
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

