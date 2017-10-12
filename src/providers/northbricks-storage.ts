import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class NorthbricksStorage {

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello Northbricks Storage Provider');
  }

  setValue(key: string, value: string) {
    this.storage.set(key, value);
  }

  getValue(key: string) {
    return this.storage.get(key);
  }

  setToken(value: string) {
    // alert(value);
    this.storage.set('token', value);
  }
  getToken(): Promise<string> {
    return this.storage.get('token');
  }

  deleteAll(): Promise<any> {
    return this.storage.clear();
  }

}
