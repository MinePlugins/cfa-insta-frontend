import { Component, OnInit, Output } from '@angular/core';
import { Route } from '@angular/router';
import { Product } from '../product/product';
import { ProductsAPIService } from '../product/product.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { CategoriesAPIService } from '../category/category.service';
import { Category } from '../category/category';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  editing = {};
  rows = [];
  authenticated: boolean;
  isAdmin: boolean;
  username: string;
  
  @Output() public products:Product[];
  @Output() public categories:Category[];
  constructor(private productsAPI:ProductsAPIService, 
    private categoriesAPI:CategoriesAPIService,
    private auth: AuthService,
    private toastr: ToastrService) { }
  columns = [{ prop: 'name', name: "Nom" }, { prop: 'sale', name: "En Promo" },{ prop: 'unit', name: "Unité" },{ prop: 'stock', name: "Stock" }];
  ColumnMode = ColumnMode
  ngOnInit(): void {
    this.auth.subscribe(
      (authenticated) => {
        this.authenticated = authenticated;
        if (authenticated) {
          this.username = this.auth.getUsername();
          this.isAdmin = this.auth.isAdmin();
        } else {
          this.username = undefined;
          this.isAdmin = false;
        }
      }
    );
    this.productsAPI.getProducts().subscribe(
      products => this.products = products);
    this.categoriesAPI.getCategories().subscribe(
      categories => this.categories = categories);
  }
  updateValue(event, cell, rowIndex) {
    if(cell === "promo"){
      console.log('inline editing rowIndex', rowIndex);
      this.editing[rowIndex + '-' + cell] = false;
      this.products[rowIndex][cell] = event.target.value;
      this.productsAPI.updateProduct(this.products[rowIndex]).subscribe({
        next: val => this.toastr.success(val['message'], 'Update'),
        error: err => this.toastr.error(err['message'], 'Error'),
      });
      this.products = [...this.products];
      console.log('UPDATED!', this.products[rowIndex]);
    }
    else if(cell === "category"){
      console.log('inline editing rowIndex', rowIndex);
      this.editing[rowIndex + '-' + cell] = false;
      this.products[rowIndex][cell] = this.categories[event.target.value-1];
      this.productsAPI.updateProduct(this.products[rowIndex]).subscribe({
        next: val => this.toastr.success(val['message'], 'Update'),
        error: err => this.toastr.error(err['message'], 'Error'),
      });
      this.products = [...this.products];
      console.log('UPDATED!', this.products[rowIndex]);

    }else{
      console.log('inline editing rowIndex', rowIndex);
      let old_products = [...this.products]
      old_products[rowIndex][cell] = event.target.value;
      this.productsAPI.updateProduct(old_products[rowIndex]).subscribe({
        next: val => {
            this.toastr.success(val['message'], 'Update')
            this.products = [...old_products];
          },
        error: err => {
          if(err.error['message'] === String){
            this.toastr.error(err.error['message'], 'Error')
          } else {
            for (const [key, value] of Object.entries(err.error['message'])) {
              this.toastr.error(`${key}: ${value}`, 'Error')
            }
          }
        },
      });
      this.editing[rowIndex + '-' + cell] = false;
      this.products = [...old_products];

      console.log('UPDATED!', this.products[rowIndex]);
    }
  }
}
