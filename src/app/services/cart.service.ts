import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems=data;
    }

    this.computeCartTotal();

  }

  addToCart(theCartItem: CartItem) {
    //check if already in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );
    }

    //fidn the item i nthe cart with id
    alreadyExistsInCart = existingCartItem != undefined;
    //check if found
    if (alreadyExistsInCart) {
      existingCartItem?.quantity ? existingCartItem.quantity++ : 0;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotal();
  }
  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //persist cart data to session storage
    this.persistCartItems();

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for (let tempCartItem of this.cartItems) {
      let subtotal = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(tempCartItem, subtotal);
    }
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem)
    }

    else (
      this.computeCartTotal()
    )

  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)

    if (itemIndex > -1 ) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotal();
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

}
