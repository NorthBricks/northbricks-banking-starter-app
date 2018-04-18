import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class AuthServiceNorthbricksProvider {
  private oAuthUrl = `https://api.northbricks.io/oauth/authorize?client_id=sampleClientId&redirect_uri=https://localhost/oauth/token&scope=read&response_type=token`;

  public static accessToken: string = '';
  public static devAccessToken: string = '18c126d5-9a3d-4eab-beea-ca18f9df30b8';
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
  constructor(public iab: InAppBrowser) {
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

  bankAuth(bankId: string): Promise<OAuthResponse> {
    let baseUrl = 'https://api.northbricks.io/api/v1'
    return new Promise((resolve, reject) => {
      let urlAuth: string = baseUrl + `/me/banks/${bankId}/auth?access_token=${AuthServiceNorthbricksProvider.devAccessToken}`;
      let browserRef: InAppBrowserObject = this.iab.create(urlAuth, "_self", "location=no,clearsessioncache=yes,clearcache=yes")

      const exitSubscription: Subscription = browserRef.on("exit").subscribe((event) => {
        alert("The  sign in flow was canceled");
        reject(new Error("The Northbricks sign in flow was canceled"));
      });
      browserRef.on('loadstop').subscribe(event => {
        browserRef.insertCSS({ code: "body{color: red;" });
        browserRef.close();
      });
      browserRef.on("loadstart").subscribe((event) => {
        if ((event.url).indexOf(`https://api.northbricks.io/api/v1`) === 0) {
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
        console.log("Outside" + JSON.stringify(event));
      });
    });



  }
}
export interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}


