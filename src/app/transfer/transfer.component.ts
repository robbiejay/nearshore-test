import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { TransactionService } from '../_services/transaction.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.sass']
})
export class TransferComponent implements OnInit {

previewActive: boolean;
form!: FormGroup;
accountBalance: number;

  constructor(private _transactionService: TransactionService,
              private _currencyPipe: CurrencyPipe) {
  this.previewActive = false
  this.accountBalance = 5824.75

}


  ngOnInit(): void {
    this.form = new FormGroup({
      from: new FormControl({disabled: true, value: "Free Checking(4692) - $" + this.accountBalance}, { validators: [ Validators.required ] }),
      to: new FormControl(null, {validators: [ Validators.required ] }),
      amount: new FormControl("", { validators: [ Validators.required, Validators.min(0.01), Validators.max(this.accountBalance + 500), Validators.pattern("^\\d+(\\.\\d+)?") ] })
    })
  }

  previewTransfer() {

    !this.form.valid ? alert('Please fill in the form correctly') : this.previewActive = true

  }

  onFormSubmit() {
const transactionData = {
  categoryCode: "#1180aa",
  dates: {
    valueDate: Date.now()
  },
  merchant: {
    accountNumber: "SIXXXXXXXXXXXXXXXXXXXX",
    name: this.form.get('to')!.value,
  },
  transaction: {
    amountCurrency: {
      currencyCode: "EUR",
      amount: this._currencyPipe.transform(this.form.get('amount')!.value)
    },
    creditDebitIndicator: "DBIT",
    type: "Online Transfer"
  }
}
  this._transactionService.addTransaction(transactionData)
  this.accountBalance = this.accountBalance - this.form.get('amount')!.value
  this.form.reset()
  this.form.get('from')!.patchValue("Free Checking(4692) - $" + this.accountBalance);
  this.previewActive = false
  }
}
