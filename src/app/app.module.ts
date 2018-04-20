import { BankAuthPageModule } from '../pages/bank/bank-auth/bank-auth.module';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// import { InputDebounceDirective } from '../directives/input-debounce/input-debounce';
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
import { LinkBanksPageModule } from '../pages/link-banks/link-banks.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { SplashScreenPageModule } from '../pages/splash-screen/splash-screen.module';
import { TermsAndConditionsPageModule } from '../pages/terms-and-conditions/terms-and-conditions.module';
import { TransactionPage } from '../pages/transaction/transaction';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage,
    TransactionPage,
    // InputDebounceDirective,
    MomentPipe
  ],
  imports: [
    BrowserModule,
    TermsAndConditionsPageModule,
    HttpModule,
    ProfilePageModule,
    BankPageModule,
    HttpClientModule,
    SplashScreenPageModule,
    LinkBanksPageModule,
    EditProfilePageModule,
    LoginPageModule,
    BankAuthPageModule,
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
    TabsPage,
    TransactionPage


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
