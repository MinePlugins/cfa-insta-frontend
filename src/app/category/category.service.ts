import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})

export class CategoriesAPIService {
  constructor(private http: HttpClient) { }
  
  public getCategories(): Observable<Category[]>{
    return this.http
    .get<Category[]>('/api/categories/')
    .pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Category.fromJson(jsonItem))
      )
    );
  }

  public searchCategories(name: string): Observable<Category[]>{
    return this.http
    .get<Category[]>(`/api/searchcategories/${name}`)
    .pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => Category.fromJson(jsonItem))
      )
    );
  }

  public getCategory(id:number): Observable<Category>{
    return this.http
    .get<Category>(`/api/category/${id}`)
  }
}