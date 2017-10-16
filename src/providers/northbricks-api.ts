import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Banks } from '../interface/iBanks';
import { Transaction } from '../interface/iTransaction';
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

  /**
   * Returns all transactions for user id
   * 
   * @param {number} userId 
   * @returns {Observable<Transaction[]>} 
   * 
   * @memberof NorthbricksApi
   */
  fetchTransactions(userId: number): Observable<Transaction[]> {
    let myParams: URLSearchParams = new URLSearchParams();
    myParams.set('userId', userId.toString());
    this.options.search = myParams;
    return this.http.get(this.baseUrl + '/transactions/', this.setHeaders())
      .map(res => <Transaction[]>res.json())
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

  fetchBanks(): Observable<Banks[]> {
    if (AuthServiceNorthbricksProvider.accessToken === '') {
      return this.http.get('assets/dummydata/banks.json', this.setHeaders())
        .map(res => <Banks[]>res.json());
    } else {
      return this.http.get(this.baseUrl + '/banks', this.setHeaders())
        .map(res => <Banks[]>res.json());
    }
  }

  fetchBank(bankId: number) {

    return this.http.get(this.baseUrl + `/banks/${bankId}`, this.setHeaders())
      .map(res => <any>res.json())
  }

  setHeaders(supplementalHeaders: Headers[] = null): RequestOptions {
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json')

    if (AuthServiceNorthbricksProvider.accessToken !== '') {
      options.headers.append('Authorization', 'Bearer ' + AuthServiceNorthbricksProvider.accessToken);
    } else {
      options.headers.append('Authorization', 'Bearer ' + AuthServiceNorthbricksProvider.devAccessToken);
    }
    return options;
  }
  fetchUser(): Observable<User> {
    return this.http.get(this.baseUrl + '/me/user', this.setHeaders())
      .map(res => <User>res.json())
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

