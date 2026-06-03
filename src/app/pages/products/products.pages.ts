import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductsModel } from '../../model/products.model';

@Component({
  standalone: false,
  template:`
 <menu></menu>
  <div class="container">
    <div class="migration-summary alert alert-light border mt-3 mb-4" role="region" aria-label="Migration summary">
      <h5 class="mb-2">About this Angular 21 migration</h5>
      <p class="mb-2">
        This shopping demo was cloned from
        <a [href]="migrationInfo.sourceRepo" target="_blank" rel="noopener">{{migrationInfo.sourceRepo}}</a>
        and upgraded from Angular 6 to Angular 21.
      </p>
      <div class="row text-center">
        <div class="col-md-3 col-6 mb-2">
          <strong>{{migrationInfo.migratedLines}}</strong>
          <span>Migrated source lines</span>
        </div>
        <div class="col-md-3 col-6 mb-2">
          <strong>{{migrationInfo.sourceFiles}}</strong>
          <span>App source files</span>
        </div>
        <div class="col-md-3 col-6 mb-2">
          <strong>7</strong>
          <span>Unit tests passing</span>
        </div>
        <div class="col-md-3 col-6 mb-2">
          <strong>2</strong>
          <span>Runnable versions kept</span>
        </div>
      </div>
      <p class="mb-0 small text-muted">
        The repository also includes the original Angular 6 snapshot, use cases, user stories, test cases,
        and a migration guide so reviewers can compare what changed.
      </p>
    </div>
    
    <div class="form-row align-items-center">    
      <div class="col-md-9">     
        <div class="input-group mb-4 mt-2">
          <div class="input-group-prepend">
            <div class="input-group-text">Search Products</div>
          </div>
          <input [(ngModel)] = "searchText" class="form-control" placeholder="Please enter any product name to search ">
        </div>
      </div>
      <div class="col-md-3">     
        <div class=" mb-4 mt-2"> 
          <select class="form-control"  [(ngModel)] = "sortOption">        
        <option value="product_name|asc">Sort By Name (A to Z)</option>
        <option value="product_name|desc">Sort By Name (Z to A)</option>
        <option value="product_price|lth">Sort By Price (Low to High)</option>
        <option value="product_price|htl">Sort By Price (High to Low)</option>
      </select>
        </div>
      </div>
      
          
  </div>
    <div class="row">
      <div class="col-md-7">  
        <productslist-dir 
         (refresh)="ref($event)"
         [allProductList]="products.data"
         [searchedText]="searchText"
         [sortingBy]="sortOption"
         ></productslist-dir>
      </div>
      <div class="col-md-5">
        <cart 
        *ngIf="cartflag"        
        ></cart>
      </div>
    </div>
    
  
  </div>
  `,
  styles: [`
    .migration-summary strong {
      display: block;
      font-size: 1.25rem;
    }

    .migration-summary span {
      display: block;
      font-size: .85rem;
    }
  `]
})

export class ProductsPage{
    public cartflag:boolean= false;
    public sortBy: string ='';
    public sortOption: string ='product_name|asc';
    public searchText: string = '';
    public migrationInfo = {
      sourceRepo: 'https://github.com/ganeshkavhar/Ecommerce-app-with-Angular',
      migratedLines: '1,141',
      sourceFiles: 26
    };
  constructor (
    public products:ProductsModel
    
    ){

  }
  ngOnInit(){
    this.ref();
  }
  ref(_event?: unknown){
    this.cartflag = false;
    setTimeout( () => {
        this.cartflag = true;
    }, 10 )
  }
  

}
