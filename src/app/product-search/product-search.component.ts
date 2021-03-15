import { Component, OnInit, Output } from '@angular/core';
import { Product } from '../product/product';
import { ProductsAPIService } from '../product/product.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  public faSearch = faSearch;
  public search = "";
  @Output() public products:Product[];
  constructor(private productsAPI:ProductsAPIService, private route: ActivatedRoute, private router: Router) { 
    router.events.subscribe((val) => this.ngOnInit())
  }
  private id: number;
  private sub: any;
  @Output() public error: '';

  columns = [{ prop: 'name', name: "Nom" }, { prop: 'sale', name: "En Promo" },{ prop: 'unit', name: "Unité" },{ prop: 'stock', name: "Stock" }];
  public onSearch(){
    if (this.search.length > 0){
      this.router.navigate([`/product-search/${this.search}`])
    }
  }


  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.search = params['search']; 
   });
   if(this.search !== undefined){
   this.productsAPI.searchProducts(this.search).subscribe({
    next: products => {
      this.products = products;
      this.error = ''
      },
    error: err => {
      this.error = err.statusText
      this.search = '' ; 
      this.products = [];
      
    }

   });
   }
  }

}
