import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NorthbricksApi } from '../providers/northbricks-api'
import { NorthbricksStorage } from '../providers/northbricks-storage'
import { AboutPage } from '../pages/about/about';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InputDebounceDirective } from '../directives/input-debounce/input-debounce';
import { Keyboard } from '@ionic-native/keyboard';
import { MomentPipe } from '../pipes/moment.pipe';
import { ToastService } from "../providers/utils/toast.service";
import { AlertService } from "../providers/utils/alert.service";
import { LoginPageModule } from "../pages/login/login.module";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AuthServiceNorthbricksProvider } from '../providers/auth-service-northbricks/auth-service-northbricks';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage,
    InputDebounceDirective,
    MomentPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    LoginPageModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot({
      name: '__Northbricksdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage


  ],
  providers: [
    StatusBar,
    InAppBrowser,
    NorthbricksApi,
    NorthbricksStorage,
    Keyboard,
    SplashScreen,
    ToastService,
    AlertService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    AuthServiceNorthbricksProvider,
  ]
})
export class AppModule { }
