import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.luv2shopApiUrl;
  private categoryUrl = this.apiUrl + '/product-category';
  private baseUrl = this.apiUrl + '/products';

  constructor(private httpClient: HttpClient) {}

  getAllProducts(
    thePage: number,
    thePageSize: number,
  ):Observable<GetResposeProducts> {
    return this.httpClient.get<GetResposeProducts>(`${this.baseUrl}?page=${thePage}&size=${thePageSize}` )
  }

  getProductList(categoryId: number): Observable<Product[]> {
    let searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    categoryId: number
  ): Observable<GetResposeProducts> {
    let searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResposeProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResposeProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    let searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  //Seach products implements pagination

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string,
  ): Observable<GetResposeProducts> {
    let searchUrl =
      `${this.baseUrl}/search/findByDescriptionContaining?description=${theKeyword}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResposeProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResposeProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProduct(theProductId: number): Observable<Product> {
    let searchUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(searchUrl);
  }
}

interface GetResposeProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResposeProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
