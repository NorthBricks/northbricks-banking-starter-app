import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class NorthbricksStorage {

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello Northbricks Storage Provider');
  }

  setValue(key: string, value: string): Promise<any> {
    return this.storage.set(key, value);
  }

  getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  setToken(value: string): Promise<any> {
    // alert(value);
    return this.storage.set('token', value);
  }
  getToken(): Promise<any> {
    return this.storage.get('token');
  }

  deleteAll(): Promise<any> {
    return this.storage.clear();
  }

}
