import { Accounts } from '../interface/iAccount';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Banks } from '../interface/iBanks';
import { Transaction, TransactionsRoot } from '../interface/iTransaction';
import { User } from '../interface/iUser';
import { AuthServiceNorthbricksProvider } from './auth-service-northbricks/auth-service-northbricks';
import { NorthbricksStorage } from './northbricks-storage';


@Injectable()
export class NorthbricksApi {

  // private static httpHeaders = new Headers();
  private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
  // private accessTokenUrl = 'https://api.northbricks.io/oauth/token';
  private baseUrl = 'https://api.northbricks.io/api/v1'

  // private clientId = 'sampleClientId';
  // private clientSecret = 'secret';
  // private clientScope = 'read';


  // private token: string
  constructor(public http: Http, public storage: NorthbricksStorage) {

    console.log('Hello Northbricks API Provider');
  }


  login() {

  }
  bankAuth(bankId: string) {
    return this.http.get(this.baseUrl + `/me/banks/${bankId}/auth/`, this.setHeaders())
      .map(res => <Transaction[]>res.json())
  }

  fetchAccounts(bankId: string): Observable<Accounts> {
    return this.http.get(this.baseUrl + `/banks/${bankId}/accounts`, this.setHeaders())
      .map(res => <Accounts>res.json())
  }


  /**
   * Returns all transactions for user id
   * 
   * @param {number} userId 
   * @returns {Observable<Transaction[]>} 
   * 
   * @memberof NorthbricksApi
   */
  fetchTransactions(accountId: string, bankId: string): Observable<TransactionsRoot> {
    // let myParams: URLSearchParams = new URLSearchParams();
    // myParams.set('userId', userId.toString());
    // this.options.search = myParams;

    // accountId = 'FI6593857450293470-EUR';
    //  https://api.northbricks.io/api/v1/banks/5707648880082944/accounts/FI6593857450293470-EUR/transactions
    return this.http.get(this.baseUrl + `/banks/${bankId}/accounts/${accountId}/transactions`, this.setHeaders())
      .map(res => <TransactionsRoot>res.json())
  }

  /**
   * Returns a transaction
   * 
   * @param {number} transactionId 
   * @returns {Observable<Transaction>} 
   * 
   * @memberof NorthbricksApi
   */
  fetchUserTransaction(transactionId: number): Observable<Transaction> {
    let myParams: URLSearchParams = new URLSearchParams();
    myParams.set('transactionId', transactionId.toString());
    this.options.search = myParams;
    return this.http.get(this.baseUrl + '/transactions/', this.setHeaders())
      .map(res => <Transaction>res.json())
  }

  fetchBanks(): Observable<Banks> {

    return this.http.get(this.baseUrl + '/banks', this.setHeaders())
      .map(res => <Banks>res.json())
      .catch(res => this._handle401(res));

  }


  private _handle401(response: HttpErrorResponse): Observable<any> {

    try {
      console.error(response.status);
      if (response.status === 401) {
        console.log(response.status);
        return Observable.throw(new Error(response.statusText));
      } else if (response.status === undefined) {
        console.log(response.status);
        return Observable.throw(new Error('Check your TFS url and token'));
      } else if (response.status === 404) {

        console.log('404 404');
        return Observable.throw(new Error('Check your TFS url and token'));
      } else if (response.status === 0) {

        console.log('Status 0 ' + response.statusText);
        return Observable.throw(new Error('Check your TFS url and token'));
      }
    } catch (err) {

      console.warn('AuthenticatedHttpService._handle401');
      console.error(err);
    }

    return Observable.of(response);
  }

  fetchBank(bankId: string) {

    // return this.http.get(this.baseUrl + `/banks/${bankId}`, this.setHeaders())
    //   .map(res => <any>res.json());
    return this.http.get(this.baseUrl + `/banks/${bankId}`, this.setHeaders())
      .map(res => <any>res.json());
  }



  setHeaders(supplementalHeaders: Headers[] = null): RequestOptions {
    let options = new RequestOptions();

    options.method = "GET";
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json')

    // if (AuthServiceNorthbricksProvider.accessToken !== '') {
    //   options.headers.append('Authorization', 'Bearer ' + AuthServiceNorthbricksProvider.accessToken);
    // } else {

    options.headers.append('Authorization', 'Bearer ' + AuthServiceNorthbricksProvider.devAccessToken);
    // alert(JSON.stringify(AuthServiceNorthbricksProvider.devAccessToken));
    // }
    return options;
  }
  fetchUser(): Observable<User> {
    return this.http.get(this.baseUrl + '/me/user', this.setHeaders())
      .map(res => <User>res.json())
      .catch(res => this._handle401(res));
  }





  /**
   * Generic post
   * 
   * @param {string} endpoint 
   * @param {*} body 
   * @param {RequestOptions} [options] 
   * @returns 
   * 
   * @memberof NorthbricksApi
   */
  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.baseUrl + '/' + endpoint, body, options);
  }

  /**
   * Generic put
   * 
   * @param {string} endpoint 
   * @param {*} body 
   * @param {RequestOptions} [options] 
   * @returns 
   * 
   * @memberof NorthbricksApi
   */
  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.baseUrl + '/' + endpoint, body, options);
  }

  /**
   * Generic delete
   * 
   * @param {string} endpoint 
   * @param {RequestOptions} [options] 
   * @returns 
   * 
   * @memberof NorthbricksApi
   */
  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.baseUrl + '/' + endpoint, options);
  }

  /**
   * Generic patch
   * 
   * @param {string} endpoint 
   * @param {*} body 
   * @param {RequestOptions} [options] 
   * @returns 
   * 
   * @memberof NorthbricksApi
   */
  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.baseUrl + '/' + endpoint, body, options);
  }
}

