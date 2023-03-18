import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
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

  constructor(
    private productService: ProductService,
    private aRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aRoute.paramMap.subscribe(() => this.listProducts());

    
  }

  listProducts() {

    this.searchMode = this.aRoute.snapshot.paramMap.has('keyword');
    
    console.log(this.searchMode)

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
    

  }
  handleSearchProducts() {
    let theKeyword: string = this.aRoute.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(theKeyword).subscribe((data) => {
      this.products = data;
    });
  }

  handleListProducts() {
    let hasCategoryId: boolean = this.aRoute.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currrentCategoryId = +this.aRoute.snapshot.paramMap.get('id')!;
    } else {
      this.currrentCategoryId = 1;
    }

    this.productService.getProductList(this.currrentCategoryId).subscribe((data) => {
      this.products = data;
    });
  }



}
