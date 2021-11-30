import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

interface Order {
  // foodName: string;
  name: string;
  phoneNumber: string;
  location: string;
  paymentoption: string;
  amount: string;
  extraComments?: string;
}

interface PaymentResponse {
  status: string;
  reason: string;
  transactionid: number;
  clienttransid: string;
  clientreference: string | null;
  statusdate: string;
  brandtransid: string | null;
}

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    location: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    paymentoption: new FormControl('MTN', Validators.required),
  });

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}
  number = '233501658639';
  url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  paymentError = false;
  submitted = false;
  error = 'An unexpected error occured. Please try again';

  ngOnInit(): void {}

  // async onSubmit(): Promise<void> {
  //   try {
  //     await this.createOrder(this.orderForm.value);
  //     this.router.navigate(['']);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  // convenience getter for easy access to form fields
  get f() {
    return this.orderForm.controls;
  }

  onSubmit(): void {
    // window.open(
    //   `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
    //   '_blank'
    // );
    // this.router.navigate(['']);
    this.submitted = true;

    if (this.orderForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    const body = {
      amount: this.orderForm.value.amount,
      paymentoption: this.orderForm.value.paymentoption,
      walletnumber: `233${this.orderForm.value.phoneNumber.substring(
        1,
        this.orderForm.value.phoneNumbernumber
      )}`,
    };

    this.http
      .post<PaymentResponse>(this.url, body, httpOptions)
      .subscribe((res: PaymentResponse) => {
        console.log(res);
        if (res.status === 'FAILED') {
          this.paymentError = true;
          this.error = res.reason;
          setTimeout(() => {
            this.paymentError = false;
          }, 5000);
        }
      });
  }

  createOrder(data: Order) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('orders')
        .add(data)
        .then(
          (res) => {
            resolve(res);
          },
          (err) => reject(err)
        );
    });
  }
}
