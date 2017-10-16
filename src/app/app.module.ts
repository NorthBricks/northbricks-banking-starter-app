import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { InputDebounceDirective } from '../directives/input-debounce/input-debounce';
import { AboutPage } from '../pages/about/about';
import { BankPageModule } from '../pages/bank/bank.module';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { TabsPage } from '../pages/tabs/tabs';
import { MomentPipe } from '../pipes/moment.pipe';
import { AuthServiceNorthbricksProvider } from '../providers/auth-service-northbricks/auth-service-northbricks';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { NorthbricksApi } from '../providers/northbricks-api';
import { NorthbricksStorage } from '../providers/northbricks-storage';
import { AlertService } from '../providers/utils/alert.service';
import { ToastService } from '../providers/utils/toast.service';
import { MyApp } from './app.component';

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
    ProfilePageModule,
    BankPageModule,
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
