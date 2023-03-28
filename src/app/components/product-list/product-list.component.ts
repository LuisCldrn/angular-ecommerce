import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currrentCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;
  previousCategoryId: number = 1;

  //search pagination
  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private aRoute: ActivatedRoute,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.aRoute.paramMap.subscribe(() => this.listProducts());
  }

  listProducts() {
    this.searchMode = this.aRoute.snapshot.paramMap.has('keyword');

    console.log(this.searchMode);

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    let theKeyword: string = this.aRoute.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword then previous then we should set back to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        theKeyword
      )
      .subscribe(this.processResult());
  }

  handleListProducts() {
    let hasCategoryId: boolean = this.aRoute.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currrentCategoryId = +this.aRoute.snapshot.paramMap.get('id')!;
    } else {
      this.currrentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currrentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currrentCategoryId;

    console.log(`current ${this.currrentCategoryId}, ${this.thePageNumber}}`);

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currrentCategoryId
      )
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem)

    
  }

}
