import { Bank } from '../../interface/iBanks';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { LinkBanksPage } from '../link-banks/link-banks';
import { EditProfilePage } from '../edit-profile/edit-profile';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  banks: Bank[] = [];
  banksNotAdded: Bank[] = [];
  placeholderPicture = 'http://api.adorable.io/avatar/200/bob';
  paymentMethods = ['Paypal', 'Credit Card'];
  languages = ['English', 'Portuguese', 'Swedish'];
  currencies = ['USD', 'BRL', 'EUR', 'SEK'];
  // banks = [{ name: 'Nordea' }, { name: 'Skandia' }, { name: 'SEB' }, { name: 'ICA' }];

  constructor(private northbricksApi: NorthbricksApi,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }
  LinkBanks() {
    this.navCtrl.push(LinkBanksPage);
  }
  EditProfile() {
    this.navCtrl.push(EditProfilePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    this.northbricksApi.fetchUser().subscribe(user => {
      // alert(JSON.stringify(user));
      this.user = user;

    });

    this.northbricksApi.fetchMyBanks().subscribe(banks => {
      // alert(JSON.stringify(user));
      this.banks = banks.banks;

    });

    this.northbricksApi.fetchBanks().subscribe(banksNotAdded => {
      // alert(JSON.stringify(banks));
      this.banksNotAdded = banksNotAdded.banks;

    });



  }

}
