import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

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
  public user: User;

  constructor(private northbricksApi: NorthbricksApi,
    private toastCtrl: ToastController,
    private navCtrl: NavController) {
  }
  public LinkBanks() {
    this.navCtrl.push(LinkBanksPage);
  }
  public EditProfile() {
    this.navCtrl.push(EditProfilePage);
  }
  public removeBank(bankId: string) {
    this.northbricksApi.removeBankFromUser(bankId).subscribe(removed => {
      this.presentToast('Bank was sucessfully removed');
    }, error => {
      this.presentToast('Could not remove bank - please try again');
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
  public ionViewCanEnter() {
    console.log('ionViewDidLoad ProfilePage');

    this.northbricksApi.fetchUser().subscribe(user => {
      // alert(JSON.stringify(user));
      this.user = user;
    });

    this.northbricksApi.fetchMyBanks().subscribe(banks => {
      // alert(JSON.stringify(user));
      this.banks = banks.banks;
    });

    // this.northbricksApi.fetchBanks().subscribe(banksNotAdded => {
    //   // alert(JSON.stringify(banks));
    //   this.banksNotAdded = banksNotAdded.banks;
    // });



  }

}
