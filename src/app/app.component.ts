import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, Platform, ModalController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { NorthbricksStorage } from '../providers/northbricks-storage';
import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { LoginPage } from '../pages/login/login';
import { User } from '../interface/iUser';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(keyboard: Keyboard,
    public events: Events,
    platform: Platform, statusBar: StatusBar,
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


      events.subscribe('storage:user', (user) => {

        storage.getUser()
          .then((user: User) => {
            if (user) {
              console.log(JSON.stringify(user));
              console.log(`Current user is ${user.firstName} ${user.lastName}`)
            }
          });
      });
      events.subscribe('app:logged-out', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Goto login page.');
        let modal = this.modalCtrl.create(LoginPage);
        modal.present();
      });

    });
  }
}
