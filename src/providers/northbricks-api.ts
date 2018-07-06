import { Accounts } from '../interface/iAccount';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Banks, Bank } from '../interface/iBanks';
import { Transaction, TransactionsRoot } from '../interface/iTransaction';
import { User } from '../interface/iUser';
import { AuthServiceNorthbricksProvider } from './auth-service-northbricks/auth-service-northbricks';
import { Events } from 'ionic-angular';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';




@Injectable()
export class NorthbricksApi {


  // private accessTokenUrl = 'https://api.northbricks.io/oauth/token';
  private baseUrl = 'https://api.northbricks.io/api/v1'

  // private clientId = 'sampleClientId';
  // private clientSecret = 'secret';
  // private clientScope = 'read';


  // private token: string
  constructor(
    public httpClient: HttpClient,
    public events: Events) {
    console.log('Hello Northbricks API Provider');
    this.setHeaders2();
  }

  public addBankToUser(bankId: string): Observable<Bank> {
    let body = {
      bankId: bankId
    }
    return this.httpClient.post<Bank>(`${this.baseUrl}/me/banks`, JSON.stringify(body), { headers: this.setHeaders2() });
  }
  public removeBankFromUser(bankId: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/me/banks/${bankId}`, { headers: this.setHeaders2() });

  }



  public handleError(error: HttpErrorResponse) {

    // switch (error.status) {
    //   case 401:

    //     return new ErrorObservable(error);

    //   default:
    //     return new ErrorObservable(
    //       'Something bad happened; please try again later.');
    //     break;
    // }

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      // this.events.publish('http', error);
      return new ErrorObservable(error);
    } else {
      console.log(JSON.stringify(error));
      // this.events.publish('http', error);
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.error}`);

      return new ErrorObservable(error);



      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

    }
    // return an ErrorObservable with a user-facing error message

  };

  public login() {

  }
  public bankAuth(bankId: string): Observable<Response> {

    return this.httpClient.get<Response>(this.baseUrl + `/me/banks/${bankId}/auth?access_token=${AuthServiceNorthbricksProvider.devAccessToken}`, { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      )

  }



  public fetchAccounts(bankId: string): Observable<Accounts> {
    return this.httpClient.get<Accounts>(this.baseUrl + `/banks/${bankId}/accounts`, { headers: this.setHeaders2() })
      .retry(3)
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * Returns all transactions for user id
   * 
   * @param {number} userId 
   * @returns {Observable<Transaction[]>} 
   * 
   * @memberof NorthbricksApi
   */
  public fetchTransactions(accountId: string, bankId: string): Observable<TransactionsRoot> {
    // let myParams: URLSearchParams = new URLSearchParams();
    // myParams.set('userId', userId.toString());
    // this.options.search = myParams;

    // accountId = 'FI6593857450293470-EUR';
    //  https://api.northbricks.io/api/v1/banks/5707648880082944/accounts/FI6593857450293470-EUR/transactions
    return this.httpClient.get<TransactionsRoot>(this.baseUrl + `/banks/${bankId}/accounts/${accountId}/transactions`, { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );
  }
  public fetchTransaction(accountId: string, bankId: string, transactionId: string): Observable<Transaction> {

    return this.httpClient.get<Transaction>(this.baseUrl + `/banks/${bankId}/accounts/${accountId}/transactions/${transactionId}`, { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );
  }
  /**
   * Returns a transaction
   * 
   * @param {number} transactionId 
   * @returns {Observable<Transaction>} 
   * 
   * @memberof NorthbricksApi
   */
  public fetchUserTransaction(transactionId: number): Observable<Transaction> {
    let myParams: HttpParams = new HttpParams();
    myParams.set('transactionId', transactionId.toString());

    return this.httpClient.get<Transaction>(this.baseUrl + '/transactions/', { headers: this.setHeaders2(), params: myParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  public fetchBanks(): Observable<Banks> {

    return this.httpClient.get<Banks>(this.baseUrl + '/banks', { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );

  }
  public fetchMyBanks(): Observable<Banks> {
    console.log('Fetch my banks');
    return this.httpClient.get<Banks>(this.baseUrl + '/me/banks', { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );

  }



  public fetchBank(bankId: string): Observable<any> {

    // return this.http.get(this.baseUrl + `/banks/${bankId}`, this.setHeaders())
    //   .map(res => <any>res.json());
    return this.httpClient.get<any>(this.baseUrl + `/banks/${bankId}`, { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );
  }


  public setHeaders2(supplementalHeaders: Headers[] = null, accessToken: boolean = true): HttpHeaders {
    console.log('setHeaders2 method ' + AuthServiceNorthbricksProvider.devAccessToken);
    if (AuthServiceNorthbricksProvider.devAccessToken) {

      return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AuthServiceNorthbricksProvider.devAccessToken });
    } else {
      return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer f2d2c072-dcd1-44db-8103-bf1d356e87f9' });
    }
  }
  public fetchUser(): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + '/me/user', { headers: this.setHeaders2() })
      .pipe(
        catchError(this.handleError)
      );
  }



}

