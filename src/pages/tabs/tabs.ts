import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
// import { BankPage } from '../bank/bank';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public homeRoot = HomePage;
  public banksRoot = HomePage;
  // transactionsRoot = BankPage;
  public profileRoot = ProfilePage;

  constructor() {

  }
}
