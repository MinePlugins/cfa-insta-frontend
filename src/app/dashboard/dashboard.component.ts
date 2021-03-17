import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { groupBy } from 'rxjs/operators';
import { Category } from '../category/category';
import { CategoriesAPIService } from '../category/category.service';
import { Product } from '../product/product';
import { ProductsAPIService } from '../product/product.service';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as _ from 'lodash';
import * as  confetti from 'canvas-confetti';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public history;
  grouping;
  sections;
  benef;
  impot;
  selectedCategory = "all";
  @ViewChild('myDiv') myDiv: ElementRef;
  products: Product[];
  categories: Category[];
  constructor(private productsAPI:ProductsAPIService,
    private categoriesAPI:CategoriesAPIService,) { }
  public ca = 0;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };  
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public timefilter = '1l';
  public barChartLabels;
  public barChartType = 'bar';
  public barChartLegend = true;  
  public barChartData;
  public confeti = false;
  public subChartData;
  public colours;
  onChangeCategory(): void {
    this.loadData()

  }
  onChangeTime(): void {
    console.log(this.timefilter)
    this.loadData()

  }
  numAverage(a) {
    var b = a.length,
        c = 0, i;
    for (i = 0; i < b; i++){
      c += Number(a[i]);
    }
    return c/b;
  }
  
  groupBy(): void {
    this.grouping = _.groupBy(this.history, element => element.datetime.substring(0, 20))
    this.sections = _.map(this.grouping, (items, date) => ({
      datetime: date,
      value: items
    }));
    this.barChartLabels = this.sections.map(bill => { return bill.datetime})
    let subData = this.sections.map(bill => {
      return bill.value.map(data => { 
        return data.sell_price - data.purshase_price
      }).reduce((acc, bills) => acc + bills)
      })
      this.colours = subData.map((value) => value < 0 ? 'red' : 'green');
      this.subChartData = [
        {data: subData, label: 'Resultats', backgroundColor: this.colours , borderColor: this.colours}]
    var last = subData[subData.length - 1];
    subData.pop()

    if (last >= (this.numAverage(subData)*2)){
      // var myCanvas = document.createElement('canvas');
      // document.appendChild(myCanvas);

      var myConfetti = confetti.create(this.myDiv, {
        resize: true,
        useWorker: true
      });
      myConfetti({
        particleCount: 100,
        spread: 160
        // any other options from the global
        // confetti function
      });
    }

    
      
    this.barChartData = [
      {data: this.sections.map(bill => {
        return bill.value.map(data => { 
          return data.sell_price
        }).reduce((acc, bills) => acc + bills)
        }), label: 'Vente CA'},
        {data: this.sections.map(bill => {
          return bill.value.map(data => { 
            return data.purshase_price
          }).reduce((acc, bills) => acc + bills)
          }), label: 'Achat'}];
    console.log(this.barChartLabels)
    console.log(this.barChartData)
  }
  loadData(): void {
    this.productsAPI.getProductsHistory(this.timefilter, this.selectedCategory).subscribe(
      history => {
        this.history = history
        this.groupBy()
        var total_purshase_price = this.history.map(bill => {
          if (bill.purshase_price !== undefined){
            return bill.purshase_price * bill.stock_change
          }
        }).reduce((acc, bill) => acc + bill)
        console.log(total_purshase_price)
        var total_sell_price = this.history.map(bill => {
          if (bill.sell_price !== undefined){
            return bill.sell_price * bill.stock_change
          }
        }).reduce((acc, bill) => acc + bill)
        console.log(total_sell_price)
        this.ca = total_sell_price
        this.benef = total_sell_price - total_purshase_price 
        this.impot = Math.round(this.benef * 0.3)
      });
  }
  ngOnInit(): void {
    this.categoriesAPI.getCategories().subscribe(
      categories => this.categories = categories);
      this.productsAPI.getProducts().subscribe(
        products => this.products = products);
      this.loadData()
  }

}
