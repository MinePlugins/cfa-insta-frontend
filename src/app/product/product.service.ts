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

  public getProduct(id:number): Observable<Product>{
    return this.http
    .get<Product>(`/api/product/${id}`)
  }
}