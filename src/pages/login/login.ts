import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController, Events, NavController } from 'ionic-angular';

import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { NorthbricksStorage } from '../../providers/northbricks-storage';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // account: { email: string, password: string } = {
  //   email: 'test@example.com',
  //   password: 'test'
  // };

  constructor(public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private storage: NorthbricksStorage,
    public navParams: NavParams,
    private ngAuthProvider: AuthServiceNorthbricksProvider,
    public northbricksApi: NorthbricksApi,
    private events: Events) {

  }


  public register() {

    this.ngAuthProvider.register().then(register => {
      console.log(register);
    }, error => {
      console.log(error);
    });
  }

  public doLogin() {
    this.ngAuthProvider.loginNorthbricks().then(response => {
      alert(JSON.stringify(response.access_token));
      AuthServiceNorthbricksProvider.devAccessToken = response.access_token;
      this.storage.setToken(AuthServiceNorthbricksProvider.devAccessToken).then(token => {
        this.northbricksApi.fetchUser().subscribe(user => {
          this.storage.setToken(token).then(setToken => {
            this.showToast('Logged in...').then(() => {
              this.closeModal();
              this.navCtrl.setRoot(TabsPage);
              this.storage.setUser(user).then(userSaved => {
                this.events.publish('user:loggedIn', user);
              });

            });
          });
          // this.storage.setValue('user', JSON.stringify(user));

        }, error => {
          AuthServiceNorthbricksProvider.devAccessToken = '';
          this.showToast(JSON.stringify(error));
          alert(JSON.stringify(error));
        });
      });

    }, error => {
      this.closeModal();
      alert('Error ' + JSON.stringify(error));
    });

  }
  private closeModal() {
    // this.viewCtrl.dismiss().then(() => {
    //   this.events.publish('user:loggedIn');
    // });

  }


  private showToast(message: string): Promise<any> {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
    return toast.present();

    // toast.onDidDismiss(() => {
    //   this.viewCtrl.dismiss();
    // })
  }
  public ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

}

