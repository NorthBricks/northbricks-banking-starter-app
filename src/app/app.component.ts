import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, Platform, ModalController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { NorthbricksStorage } from '../providers/northbricks-storage';
// import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { LoginPage } from '../pages/login/login';

import { HttpErrorResponse } from '@angular/common/http';
import { AuthServiceNorthbricksProvider } from '../providers/auth-service-northbricks/auth-service-northbricks';
import { NorthbricksApi } from '../providers/northbricks-api';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // private ModalLogin(): any {
  //   console.log('Running ModalLogin()');
  //   let modal = this.modalCtrl.create(LoginPage);
  //   modal.present();
  //   modal.onDidDismiss(() => {
  //     this.events.publish('user:loggedIn', true);
  //   });
  // }
  public rootPage: any = TabsPage;

  constructor(keyboard: Keyboard,
    public events: Events,
    platform: Platform,
    statusBar: StatusBar,
    northbricksApi: NorthbricksApi,
    splashScreen: SplashScreen,
    storage: NorthbricksStorage,
    public modalCtrl: ModalController,
    private deeplinks: Deeplinks) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('ios')) {
        keyboard.disableScroll(true);
      }
      statusBar.styleDefault();
      splashScreen.hide();

      // this.deeplinks.route({
      //   '/': TabsPage,
      //   '/callback': LoginPage,
      //   '/universal-links-test': TabsPage
      // }).subscribe((match) => {
      //   // match.$route - the route we matched, which is the matched entry from the arguments to route()
      //   // match.$args - the args passed in the link
      //   // match.$link - the full link data
      //   console.log(match.$args);
      //   console.log(match.$route);
      //   console.log(match.$link);
      //   console.log('Successfully matched route', match);
      // }, (nomatch) => {
      //   // nomatch.$link - the full link data
      //   console.error('Got a deeplink that didn\'t match', nomatch);
      // });



      console.log(AuthServiceNorthbricksProvider.devAccessToken);
      // storage.getValue('hasSeenTutorial')
      //   .then((hasSeenTutorial) => {
      //     if (hasSeenTutorial) {
      //       this.rootPage = TabsPage;
      //     } else {
      //       // this.rootPage = SplashScreenPage;
      //       this.rootPage = TabsPage;
      //     }
      //   });

      // storage.deleteAll().then(del => {
      storage.getToken().then(token => {
        AuthServiceNorthbricksProvider.devAccessToken = token;
        // token = AuthServiceNorthbricksProvider.devAccessToken;
        // alert('Found token in storage - ' + token);
        if (token === null) {
          // alert(token);
          if (AuthServiceNorthbricksProvider.devAccessToken === '') {
            // this.rootPage = LoginPage;
            // this.ModalLogin()
            // events.publish('user:loggedIn', false);
          }
        } else {
          AuthServiceNorthbricksProvider.devAccessToken = token;
          northbricksApi.fetchUser().subscribe(user => {
            this.rootPage = TabsPage;
            storage.setUser(user);
            events.publish('user:loggedIn', true);

          });

        }

      });

      events.subscribe('user:loggedOut', () => {
        console.log('logged out');
        this.rootPage = LoginPage;
        events.unsubscribe('user:loggedOut');
      });
      events.subscribe('user:loggedIn', () => {
        console.log('logged -in');
        this.rootPage = TabsPage;
        events.unsubscribe('user:loggedIn');
      });

      events.subscribe('http', (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 401) {
          console.log('401 ' + JSON.stringify(httpErrorResponse));
          this.rootPage = LoginPage;
        } else if (httpErrorResponse.status === 404) {
          console.log('404 ' + JSON.stringify(httpErrorResponse));
        }



        // this.ModalLogin();
      });

      // events.subscribe('app:logged-out', (user, time) => {
      //   console.log('Goto login page.');
      //   let modal = this.modalCtrl.create(LoginPage);
      //   modal.present();
      // });

    });
  }
}
