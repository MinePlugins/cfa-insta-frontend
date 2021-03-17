import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product/product';
import { ProductsAPIService } from '../product/product.service';
import { AuthService } from '../services/auth.service';
import { faPercent, faEuroSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private id: number;
  private sub: any;
  faPercent = faPercent
  faEuroSign= faEuroSign

  authenticated: boolean;
  isAdmin: boolean;
  username: string;
  type = "in";
  show = true;
  price = 0;
  public stock = 0;
  public sale: number;

  @Output() public product:Product;
  constructor(private productsAPI:ProductsAPIService, 
    private route: ActivatedRoute, 
    private toastr: ToastrService,
    private auth: AuthService) { }

  onStock(): void {
    if(typeof this.stock === 'number'){
    } else {
      this.toastr.info("Le stock doit être un nombre", 'Info')
      this.stock = 0
    }
  }

  onInout(): void {
    if (this.type === "loss"){
      this.show = false
    } else {
      this.show = true

    }
  }
  onSale(): void {
    if(typeof this.sale === 'number'){
      if(this.sale < 0 || this.sale > 100){
        this.toastr.info("La promo doit être compris entre 0 et 100", 'Info')
      }
    } else {
      this.toastr.info("La promo doit être un nombre", 'Info')
      this.sale = 0
    }
  }
  refreshProduct(): void {
      this.productsAPI.getProduct(this.id).subscribe(
        product => this.product = product);
    }
  
  onValidateStock(): void {
    this.productsAPI.stockUpdateProduct(this.id, this.stock, this.type, this.price).subscribe({
      next: val => {
          this.toastr.success(val['message'], 'Update')
          this.refreshProduct()
        },
      error: err => {
        // if(err.error['message'] === String){
          this.toastr.error(err.error['message'], 'Error')
        // }
        // } else {
        //   for (const [key, value] of Object.entries(err.error['message'])) {
        //     this.toastr.error(`${key}: ${value}`, 'Error')
        //   }
        // }
      },
    });
  }
  onValidateSale(): void {
    this.productsAPI.saleUpdateProduct(this.id, this.sale).subscribe({
      next: val => {
          this.toastr.success(val['message'], 'Update')
          this.refreshProduct()
        },
      error: err => {
        // if(err.error['message'] === String){
          this.toastr.error(err.error['message'], 'Error')
        // }
        // } else {
        //   for (const [key, value] of Object.entries(err.error['message'])) {
        //     this.toastr.error(`${key}: ${value}`, 'Error')
        //   }
        // }
      },
    });
  }
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
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; 
   });
    this.productsAPI.getProduct(this.id).subscribe(
      product => {
        this.product = product
        this.sale = product.discount === 0 ? 0:Math.round(((product.price-product.discount)/product.price)*100)
      });
  }

}
