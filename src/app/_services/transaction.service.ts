import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }


  transactions: any = [];
  private transactionDataUpdated = new Subject<any>();

  getTransactionData() {
  this.http.get<{data: any}>(
      '/api/data'
    ).pipe(
      map(transactionData => {
          console.log(transactionData)
        return transactionData;
      })
    ).subscribe(updatedTransactions => {
      this.transactions = updatedTransactions;
      this.transactionDataUpdated.next([...this.transactions])
    })
  }

  getTransactionDataUpdateListener() {
  return this.transactionDataUpdated.asObservable();
  }

  addTransaction(transaction: object) {
    this.transactions.push(transaction);
    this.transactionDataUpdated.next([...this.transactions])
  }
}
