import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Banks } from '../../interface/iBanks';
import { NorthbricksApi } from '../../providers/northbricks-api';

/**
 * Generated class for the BankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {
  bank: Banks;
  bankId: number;
  constructor(public northbricksApi: NorthbricksApi, public navCtrl: NavController, public navParams: NavParams) {
    this.bankId = navParams.get('bankId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankPage');
    this.northbricksApi.fetchBank(this.bankId).subscribe(bank => {
      // alert(JSON.stringify(bank));
      this.bank = bank;
    });

  }

}
