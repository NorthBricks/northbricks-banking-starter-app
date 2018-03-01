import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, Platform } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { NorthbricksStorage } from '../providers/northbricks-storage';
import { SplashScreenPage } from '../pages/splash-screen/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(keyboard: Keyboard, public events: Events,
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: NorthbricksStorage) {
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

    });
  }
}
