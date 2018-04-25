import { Bank } from '../../interface/iBanks';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { LinkBanksPage } from '../link-banks/link-banks';
import { EditProfilePage } from '../edit-profile/edit-profile';

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
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams) {
  }
  LinkBanks() {
    this.navCtrl.push(LinkBanksPage);
  }
  EditProfile() {
    this.navCtrl.push(EditProfilePage);
  }
  removeBank(bankId: string) {
    this.northbricksApi.removeBankFromUser(bankId).subscribe(removed => {
      this.presentToast('Bank was sucessfully removed');
    }, error => {
      this.presentToast('Could not remove bank - please try again');
    });
  }
  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  }
  ionViewCanEnter() {
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
