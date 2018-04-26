import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Subscription } from 'rxjs/Subscription';
import { Platform } from 'ionic-angular';


@Injectable()
export class AuthServiceNorthbricksProvider {
  private redirectUrl = 'https://localhost'
  private oAuthUrl = `https://api.northbricks.io/oauth/authorize?client_id=sampleClientId&redirect_uri=${this.redirectUrl}&scope=read&response_type=token`;

  public static accessToken: string = '';
  // public static devAccessToken: string = '4b86eb57-8e68-4863-a08e-dd2d1de40b4c1';
  public static devAccessToken: string = '';
  public tokenType: string = '';

  public options: InAppBrowserOptions = {
    location: 'yes',// Or 'no' 
    hidden: 'no', // Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',// Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', // Android only 
    closebuttoncaption: 'Close', // iOS only
    disallowoverscroll: 'no', // iOS only 
    toolbar: 'yes', // iOS only 
    enableViewportScale: 'no', // iOS only  
    allowInlineMediaPlayback: 'no',// iOS only 
    presentationstyle: 'pagesheet',// iOS only 
    fullscreen: 'yes' // Windows only    
  };
  constructor(public iab: InAppBrowser, public platform: Platform) {
    console.log('Hello AuthServiceNorthbricksProvider Provider');

  }

  public isAuthenticated(): boolean {
    return false;
  }

  public register(): Promise<any> {

    return new Promise((resolve, reject) => {

      let browserRef: InAppBrowserObject = this.iab.create('https://api.northbricks.io/signup', "_blank", this.options)

      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        alert("Reload page - check if there are a user.");
        reject(new Error("The Northbricks sign in flow was canceled"));
      });

      browserRef.on("loadstart").subscribe((event) => {
        console.log('loadstart');
        console.log(JSON.stringify(event));
        console.log(event.url);
        if ((event.url).indexOf(`https://api.northbricks.io/signup-success`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          exitSubscription.unsubscribe();
          browserRef.close();
          console.log(event.url);
        } else if ((event.url).indexOf(`https://api.northbricks.io/login-error`) === 0) {
          console.log('Here we can count logon errors');
        }
      });


    });


  }


  public navigateTo(url: string): Promise<any> {

    return new Promise((resolve, reject) => {

      let browserRef: InAppBrowserObject = this.iab.create(url, "_blank", this.options);

      // const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
      //   // alert("Reload page - check if there are a user.");
      //   exitSubscription.closed();
      //   reject(new Error("Cancel - back to app"));
      // });

      browserRef.on("loadstart").subscribe((event) => {
        console.log('Log this - event');
      });
    });
  }

  public loginNorthbricks(): Promise<OAuthResponse> {

    return new Promise((resolve, reject) => {

      let browserRef: InAppBrowserObject = this.iab.create(this.oAuthUrl, "_blank", this.options)

      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        alert("The  sign in flow was canceled");
        reject(new Error("The Northbricks sign in flow was canceled"));
      });
      browserRef.on("loaderror").subscribe((event) => {
        console.log('loaderror ' + event.url);
      });
      browserRef.on("loadstop").subscribe((event) => {
        console.log('loadstop ' + event.url);
      });



      browserRef.on("loadstart").subscribe((event) => {
        console.log('loadstart ' + event.url);

        if ((event.url).indexOf(`${this.redirectUrl}`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          console.log('URL:: ' + event.url);
          var responseParameters = ((event.url).split("#")[1]).split("&");
          console.log(responseParameters);
          var parsedResponse = {};
          console.log('RESPONSE::: ' + responseParameters);
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          console.log('PARSED RESPONSE ' + JSON.stringify(parsedResponse));
          if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
            console.log('Access token..');
            exitSubscription.unsubscribe();
            browserRef.close();

            resolve(<OAuthResponse>parsedResponse);
          } else {
            console.log("Problem authenticating with Northbricks");
            reject(new Error("Problem authenticating with Northbricks"));
          }
        } else if ((event.url).indexOf(`https://api.northbricks.io/login-error`) === 0) {
          console.log('Here we can count logon errors');
        }
      });
    });



  }


}
export interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}


