import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../interface/iUser';
import { Events } from 'ionic-angular';

@Injectable()
export class NorthbricksStorage {

  constructor(private events: Events, private storage: Storage) {
    console.log('Hello Northbricks Storage Provider');
  }

  public setValue(key: string, value: string): Promise<any> {
    return this.storage.set(key, value);
  }

  public getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  public setToken(value: string): Promise<any> {
    // alert(value);
    return this.storage.set('token', value);
  }
  public getToken(): Promise<any> {
    return this.storage.get('token');
  }

  public setUser(value: User): Promise<User> {
    // alert(value);
    this.events.publish('storage:user', value);
    return this.storage.set('user', JSON.stringify(value));
  }
  public getUser(): Promise<User> {
    return this.storage.get('user').then(user => {
      return JSON.parse(user);
    });

  }

  public deleteAll(): Promise<any> {
    return this.storage.clear();
  }

}
