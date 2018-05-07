import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { NorthbricksStorage } from '../../providers/northbricks-storage';
import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions';

/**
 * Generated class for the SplashScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash-screen',
  templateUrl: 'splash-screen.html',
})
export class SplashScreenPage {
  public account: { email: string } = {
    email: 'test@example.com'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private storage: NorthbricksStorage,
    private ngAuthProvider: AuthServiceNorthbricksProvider,
    public northbricksApi: NorthbricksApi) {
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad SplashScreenPage');
  }
  public doLogin() {
    this.ngAuthProvider.loginNorthbricks().then(response => {
      AuthServiceNorthbricksProvider.accessToken = response.access_token;
      this.northbricksApi.fetchUser().subscribe(user => {
        this.storage.setValue('user', JSON.stringify(user));
        this.closeModal();
      });


    }, error => {
      this.closeModal();
      alert('Error ' + JSON.stringify(error));
    });

  }

  public termsAndConditions() {
    this.navCtrl.push(TermsAndConditionsPage);
  }

  public closeModal() {
    this.storage.setToken(AuthServiceNorthbricksProvider.accessToken).then(token => {
      this.viewCtrl.dismiss(AuthServiceNorthbricksProvider.accessToken);
    });
  }
}
