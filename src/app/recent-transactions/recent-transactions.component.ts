import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../_services/transaction.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.sass']
})
export class RecentTransactionsComponent implements OnInit {

public transactions: any = [];
//private transactionsSubscription: Subscription;

IMG_ID_MAP: any = {
  'Backbase' : 'assets/icons/backbase.png',
  'The Tea Lounge': 'assets/icons/the-tea-lounge.png',
  'Texaco': 'assets/icons/texaco.png',
  'Amazon Online Store': 'assets/icons/amazon-online-store.png',
  '7-Eleven': 'assets/icons/7-eleven.png',
  'H&M Online Store': 'assets/icons/h&m-online-store.png',
  'Jerry Hildreth': 'assets/icons/jerry-hildreth.png',
  'Lawrence Pearson': 'assets/icons/lawrence-pearson.png',
  'Whole Foods': 'assets/icons/whole-foods.png',
  'Southern Electric Company': 'assets/icons/southern-electric-company.png'
}

form: FormGroup;
orderDescending: boolean;
sortByDateActive: boolean;
sortByBeneficiaryActive: boolean;
sortByAmountActive: boolean;

  constructor(private _transactionService: TransactionService,
              private http: HttpClient
            //  private transactionsSubscription: Subscription
            ) {
              this.form = new FormGroup({
                search: new FormControl('')
              })
              this.orderDescending = true
              this.sortByDateActive = false;
              this.sortByBeneficiaryActive = false;
              this.sortByAmountActive = false;
            }

  ngOnInit(): void {
    this.getTransactions();
    this.sortByDate();
  }

  ngAfterViewInit() {

  }

  getTransactions() {
    this._transactionService.getTransactionData();
    this._transactionService.getTransactionDataUpdateListener()
    .subscribe((transactions: any) => {
      this.transactions = transactions
      console.log(this.transactions);
    })
  }

  filterResults() {
  let transobject = this.transactions;
  let searchKey = this.form.get('search')!.value.toLowerCase();
  let filteredTransactions:any = []

    this.transactions.forEach((element:any) => {
      let flatObject = {}
      let currentObj = element
      flattenObj(currentObj,flatObject, '')
      let flatArr = Object.values(flatObject);
        for(let el of flatArr) {
          if(typeof el === 'string') {
          if(el.toString().toLowerCase().includes(searchKey)) {
            filteredTransactions.push(element)
            break;
          }
        }
        }

    });

    this.transactions = filteredTransactions;
    searchKey.length === 0 && this.getTransactions()

    function flattenObj(obj:any, newObj:any, prevKey:any) {
        for (let key in obj) {
            let value = obj[key];

        if (value.constructor !== Object) {
            if (prevKey == null || prevKey == '') {
                newObj[key] = value;
            } else {
                key == null || key == '' ? newObj[prevKey] = value
                : newObj[prevKey + '.' + key] = value;
              }
            }
          else {
            prevKey == null || prevKey == '' ? flattenObj(value, newObj, key)
            : flattenObj(value, newObj, prevKey + '.' + key)
           }
        }
    }
  }

  clearFilter() {
    this.form.get('search')!.patchValue('')
    this.getTransactions()
  }

  sortByDate() {

    this.transactions.forEach((el:any) => {
      if(typeof el.dates.valueDate === 'string') {
       el.dates.valueDate = Date.parse(el.dates.valueDate);
     }
    });
    if(this.sortByDateActive) { this.orderDescending = !this.orderDescending}
    this.sortByDateActive = true;
    this.sortByAmountActive = false;
    this.sortByBeneficiaryActive = false;
    if(this.orderDescending) {
    this.transactions.sort((a:any, b:any) => a.dates.valueDate > b.dates.valueDate ? 1 : -1)
  } else {
    this.transactions.sort((a:any, b:any) => a.dates.valueDate > b.dates.valueDate ? -1 : 1)
  }
  }

  sortByBeneficiary() {
    if (this.sortByBeneficiaryActive) { this.orderDescending = !this.orderDescending }
    this.sortByBeneficiaryActive = true;
    this.sortByDateActive = false;
    this.sortByAmountActive = false;
    if(this.orderDescending) {
    this.transactions.sort((a:any, b:any) => (a.merchant.name > b.merchant.name) ? 1 : -1)
  } else {
    this.transactions.sort((a:any, b:any) => (a.merchant.name > b.merchant.name) ? -1 : 1)
  }
  }

  sortByAmount() {
    if (this.sortByAmountActive) { this.orderDescending = !this.orderDescending }
    this.sortByAmountActive = true;
    this.sortByDateActive = false;
    this.sortByBeneficiaryActive = false;
    if(this.orderDescending) {
    this.transactions.sort((a:any, b:any) => (a.transaction.amountCurrency.amount > b.transaction.amountCurrency.amount) ? 1 : -1)
  } else {
    this.transactions.sort((a:any, b:any) => (a.transaction.amountCurrency.amount > b.transaction.amountCurrency.amount) ? -1 : 1)
  }
}


}
