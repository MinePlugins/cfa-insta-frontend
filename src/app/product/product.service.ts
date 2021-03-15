import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProductsAPIService {
  constructor(private http: HttpClient) { }
  
  public getProducts(): Observable<Product[]>{
    return this.http
    .get<Product[]>('/api/products/')
    .pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Product.fromJson(jsonItem))
      )
    );
  }

  public searchProducts(name: string): Observable<Product[]>{
    return this.http
    .get<Product[]>(`/api/searchproduct/${name}`)
    .pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Product.fromJson(jsonItem))
      )
    );
  }

  public updateProduct(product: Product): Observable<Object>{
   
    return this.http
    .patch(`/api/product/${product.id}`, product)
  }

  public getProduct(id:number): Observable<Product>{
    return this.http
    .get<Product>(`/api/product/${id}`)
  }
}