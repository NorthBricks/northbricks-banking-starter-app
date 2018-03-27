import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class AuthServiceNorthbricksProvider {
  private oAuthUrl = `https://api.northbricks.io/oauth/authorize?client_id=sampleClientId&redirect_uri=https://localhost/oauth/token&scope=read&response_type=token`;

  public static accessToken: string = '';
  public static devAccessToken: string = '02a136ed-212e-4e3c-b8be-5810fe0f9c9f';
  public tokenType: string = '';

  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };
  constructor(public iab: InAppBrowser, public http: Http) {
    console.log('Hello AuthServiceNorthbricksProvider Provider');

  }

  loginNorthbricks(): Promise<OAuthResponse> {

    return new Promise((resolve, reject) => {

      let browserRef: InAppBrowserObject = this.iab.create(this.oAuthUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes")

      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        alert("The  sign in flow was canceled");
        reject(new Error("The Northbricks sign in flow was canceled"));
      });

      browserRef.on("loadstart").subscribe((event) => {
        if ((event.url).indexOf(`https://localhost/oauth/token`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          exitSubscription.unsubscribe();
          browserRef.close();


          console.log(event.url);
          var responseParameters = ((event.url).split("#")[1]).split("&");
          var parsedResponse = {};
          console.log('RESPONSE::: ' + responseParameters);
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          console.log('PARSED RESPONSE ' + JSON.stringify(parsedResponse));
          if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
            console.log('Access token..');
            resolve(<OAuthResponse>parsedResponse);
          } else {
            console.log("Problem authenticating with Northbricks");
            reject(new Error("Problem authenticating with Northbricks"));
          }
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


