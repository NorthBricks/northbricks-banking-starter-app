import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, Events, ModalController } from 'ionic-angular';

import { User } from '../../interface/iUser';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { LinkBanksPage } from '../link-banks/link-banks';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Bank } from '../../interface/iBanks';
import { AuthServiceNorthbricksProvider } from '../../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksStorage } from '../../providers/northbricks-storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public user: User;
  public banks: Bank[];
  constructor(
    private northbricksApi: NorthbricksApi,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private storage: NorthbricksStorage,
    private events: Events,
    private modalCtrl: ModalController) {
  }
  public LinkBanks() {
    let modal = this.modalCtrl.create(LinkBanksPage);
    modal.onDidDismiss(token => {
      // alert(token);
      this.events.publish('disconnectedBank', true);
    });
    modal.present();
  }
  public EditProfile() {
    this.navCtrl.push(EditProfilePage);
  }
  public removeBank(bankId: string) {
    this.northbricksApi.removeBankFromUser(bankId).subscribe(removed => {
      this.events.publish('disconnectedBank', true);
      this.fetchMyBanks();
      this.presentToast('Bank was sucessfully removed from your account in Northbricks.');
    }, error => {
      this.presentToast('Could not remove bank - please try again');
    });
  }

  public SignOut() {
    AuthServiceNorthbricksProvider.devAccessToken = '';
    this.storage.deleteAll().then(() => {
      console.log('Sigin out...');
      this.events.publish('user:loggedOut', true);
    });
  }

  public presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  public ionViewDidEnter() {
    console.log('ionViewDidLoad ProfilePage');

    this.northbricksApi.fetchUser().subscribe(user => {
      // alert(JSON.stringify(user));
      this.user = user;
    });

    this.fetchMyBanks();

    // this.northbricksApi.fetchBanks().subscribe(banksNotAdded => {
    //   // alert(JSON.stringify(banks));
    //   this.banksNotAdded = banksNotAdded.banks;
    // });
  }

  private fetchMyBanks() {
    this.northbricksApi.fetchMyBanks().subscribe(banks => {
      // alert(JSON.stringify(user));
      this.banks = banks.banks;
    });
  }

}
