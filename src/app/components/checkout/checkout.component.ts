import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';

import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopForm: ShopFormService
  ) {}

  ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    //populate months

    const startMonth: number = new Date().getMonth() + 1;

    this.shopForm
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    this.shopForm
      .getCreditCardYears()
      .subscribe((data) => (this.creditCardYears = data));

    //populate countries and states

    this.shopForm.getCountries().subscribe((data) => (this.countries = data));

    
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')!.value);
  }

  handleMonthsAndYears() {
    const creditCardFromGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFromGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopForm
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      
      this.billingStates = this.shippingStates;

      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      console.log(this.checkoutFormGroup.get)

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  getStates(FormGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(FormGroupName);

    const countryCode = formGroup?.value.country.code;

    this.shopForm.getStates(countryCode).subscribe((data) => {
      if (FormGroupName === 'shippingAddress') {
        this.shippingStates = data;
      } else {
        this.billingStates = data;
      }
      formGroup?.get('state')?.setValue(data[1]);
    });
  }
}
