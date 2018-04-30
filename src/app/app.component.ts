import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, Platform, ModalController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { NorthbricksStorage } from '../providers/northbricks-storage';
// import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { LoginPage } from '../pages/login/login';
import { User } from '../interface/iUser';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServiceNorthbricksProvider } from '../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksApi } from '../providers/northbricks-api';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  private ModalLogin(): any {
    console.log('Running ModalLogin()');
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
    modal.onDidDismiss(() => {
      this.events.publish('user:loggedIn', true);
    });
  }
  public rootPage: any = TabsPage;

  constructor(keyboard: Keyboard,
    public events: Events,
    platform: Platform,
    statusBar: StatusBar,
    northbricksApi: NorthbricksApi,
    splashScreen: SplashScreen,
    storage: NorthbricksStorage,
    public modalCtrl: ModalController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('ios')) {
        keyboard.disableScroll(true);
      }
      statusBar.styleDefault();
      splashScreen.hide();

      storage.getValue('hasSeenTutorial')
        .then((hasSeenTutorial) => {
          if (hasSeenTutorial) {
            this.rootPage = TabsPage;
          } else {
            // this.rootPage = SplashScreenPage;
            this.rootPage = TabsPage;
          }
        });

      // storage.deleteAll().then(del => {
      storage.getToken().then(token => {
        // alert('Found token in storage - ' + token);
        if (token === null) {
          if (AuthServiceNorthbricksProvider.devAccessToken === '') {
            this.rootPage = TabsPage;
            this.ModalLogin()
            events.publish('user:loggedIn', false);
          }
        } else {
          AuthServiceNorthbricksProvider.devAccessToken = token;
          northbricksApi.fetchUser().subscribe(user2 => {
            storage.setUser(user2);
            events.publish('user:loggedIn', true);

          });

        }

      });
      console.log('Dev access token set to - ' + AuthServiceNorthbricksProvider.devAccessToken);
      // });


      events.subscribe('http', (httpErrorResponse: HttpErrorResponse) => {
        console.log(httpErrorResponse.status);
        this.rootPage = TabsPage;
        this.ModalLogin();
      });

      // events.subscribe('storage:user', (user) => {

      //   storage.getUser()
      //     .then((user: User) => {
      //       if (user) {
      //         console.log(JSON.stringify(user));
      //         console.log(`Current user is ${user.firstName} ${user.lastName}`)
      //       }
      //     });
      // });
      events.subscribe('app:logged-out', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Goto login page.');
        let modal = this.modalCtrl.create(LoginPage);
        modal.present();
      });

    });
  }
}
