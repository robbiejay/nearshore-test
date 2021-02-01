import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common'

import { TransactionService } from './_services/transaction.service';


import { AppComponent } from './app.component';
import { TransferComponent } from './transfer/transfer.component';
import { RecentTransactionsComponent } from './recent-transactions/recent-transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    TransferComponent,
    RecentTransactionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [TransactionService,
              CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
