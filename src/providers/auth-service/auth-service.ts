import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { NorthbricksStorage } from '../northbricks-storage';


/**
 * Auth0 Service Provider
 * NOT YET TESTED
 * @export
 * @class AuthServiceProvider
 */
@Injectable()
export class AuthServiceProvider {
  auth0 = new auth0.WebAuth({
    clientID: 'YnBYKi62ybloIhIo1x2qfxAG1I64320l',
    domain: 'northbricks.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://northbricks.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid'
  });
  constructor(private storage: NorthbricksStorage) {
    console.log('Hello AuthServiceProvider Provider');
  }


  public login(): void {
    this.auth0.authorize();
  }
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        // this.router.navigate(['/home']);
      } else if (err) {
        // this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }
  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this.storage.setValue('access_token', authResult.accessToken);
    this.storage.setValue('id_token', authResult.idToken);
    this.storage.setValue('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    this.storage.deleteAll();
    //  .removeItem('access_token');
    // localStorage.removeItem('id_token');
    // localStorage.removeItem('expires_at');
    // // Go back to the home route
    // this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
