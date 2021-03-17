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

  public getProductsHistory(delta, cat): Observable<Object>{
    return this.http
    .get(`/api/history/${delta}/${cat}`)
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
  public saleUpdateProduct(id: number, sale: number): Observable<Object> {
    let json = {
      sale: sale
    } 
    const headers = { 'content-type': 'application/json'}  
    return this.http
    .patch(`/api/productsale/${id}`, json, {'headers':headers})
  }

  public stockUpdateProduct(id: number,quantity: number, types: string, price: number): Observable<Object> {
    let json = {
      quantity: quantity,
      types: types,
      price: price,
    } 
    const headers = { 'content-type': 'application/json'}  
    return this.http
    .patch(`/api/productstock/${id}`, json, {'headers':headers})
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