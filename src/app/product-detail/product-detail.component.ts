import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product/product';
import { ProductsAPIService } from '../product/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private id: number;
  private sub: any;
  @Output() public product:Product;
  constructor(private productsAPI:ProductsAPIService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
    this.productsAPI.getProduct(this.id).subscribe(
      product => this.product = product);
  }

}
