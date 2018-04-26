import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NorthbricksApi } from '../../providers/northbricks-api';
import { User } from '../../interface/iUser';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  public user: User;
  constructor(public navCtrl: NavController,
    private northbricksApi: NorthbricksApi,
    public navParams: NavParams) {
  }

  public ionViewDidLoad() {

    this.northbricksApi.fetchUser().subscribe(user => {
      // alert(JSON.stringify(user));
      this.user = user;

    });
  }

}
