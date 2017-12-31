import { NorthbricksApi } from '../../../providers/northbricks-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the BankAuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bank-auth',
  templateUrl: 'bank-auth.html',
})
export class BankAuthPage {
  bankId: string;
  name: string;
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public northbricksApi: NorthbricksApi, ) {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BankAuthPage');
    this.bankId = this.navParams.get('bankId');
    this.name = this.navParams.get('name');
    this.northbricksApi.bankAuth(this.bankId).subscribe(auth => {

      alert(JSON.stringify(auth));
    }, error => {
      alert(JSON.stringify(error));
    });
  }

}
