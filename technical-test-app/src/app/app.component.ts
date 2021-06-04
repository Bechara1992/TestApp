import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  NgForm
} from "@angular/forms";
import { ServerService } from './Services/server.service';
import {MatDialog} from '@angular/material/dialog';
import { ManageBrandsComponent } from './manage-brands/manage-brands.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'technical-test-app';
  @ViewChild('brandFrom') brandFrom: any;
  TextPattern = /^[a-zA-Z]*$/;
  BrandForm: FormGroup;
  BrandInfo: any = {};
  BrandsList: any = [];
  BrandsRatingList: any = [];

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private server: ServerService
  ){
    this.BrandForm = this.formBuilder.group({
      Brand: ['',{
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      Country: ['',{
        validators: [Validators.pattern(this.TextPattern), Validators.maxLength(2)],
        updateOn: 'submit'
      }],
      Rating: [null,{
        validators: [Validators.required],
        updateOn: 'submit'
      }]});
  }

  ngOnInit() {
    this.getBrands();
    this.getBrandsRatings();
  }

  getBrands(){
    this.server.getBr().subscribe((jsonCallback) => {
      var response    = jsonCallback;
      this.BrandsList = response.body
        }, (error) => {
      var errorMessage = error.message;
      }, () => {});
  }

  /*------------------------------------------------------------*/

  getBrandsRatings(){
    this.server.getBrandsRatings().subscribe((jsonCallback) => {
      var response: any = jsonCallback;
      var result = response.body.reduce(function (a: any, b: any) {
        a[b.Country] = a[b.Country] || [];
        a[b.Country].push(b);
        return a;
    }, Object.create(null));
    var RatingsArray: any = [];
    var RatingsArrayConst: any = [];
     Object.entries(result).forEach((el, index)=>{
      RatingsArray.push({
        Country: el[0],
        Ratings: el[1]
      })
    })
    RatingsArray.forEach((element: any) => {
      if(element.Ratings.length > 10){
        element.Ratings = element.Ratings.slice(0,10)
      }
      RatingsArrayConst.push({
        Country: element.Country,
        Ratings: element.Ratings
      })
    });
    
      this.BrandsRatingList = RatingsArrayConst
        }, (error) => {
      var errorMessage = error.message;
      }, () => {});
  }

  AddBrandRating(){
    var BrandRating = this.BrandInfo;
    if(this.BrandForm.valid){
    if(BrandRating.ID){
      BrandRating.Country = BrandRating.Country.toUpperCase();
      this.server.updateRating(BrandRating).subscribe((resp) => {
        var response    = resp;
        this.getBrandsRatings();
        this.ClearForm();
          }, (error) => {
        var errorMessage = error.message;
        }, () => {});
    }else{
      BrandRating.Country = BrandRating.Country.toUpperCase();
      this.server.createRating(BrandRating).subscribe((resp) => {
        var response    = resp;
        this.getBrandsRatings();
        this.ClearForm();
          }, (error) => {
        var errorMessage = error.message;
        }, () => {});
    }}
  }
  
  EditRating(BRating: any){
    this.BrandInfo = BRating
  }

  popupDeleteBrandRating(ID: number){
    Swal.fire({
      buttonsStyling: false,
    });
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to remove this rating?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((res: any) => {
      if (res.value) {
        this.DeleteBrandRating(ID);
      } else if (res.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  DeleteBrandRating(ID: number){
    this.server.deleteRating(ID).subscribe((resp) => {
      var response    = resp;
      this.getBrandsRatings();
        }, (error) => {
      var errorMessage = error.message;
      }, () => {});
  }

  OpenManageBrandsModal(){
    const BrandsDialog = this.dialog.open(ManageBrandsComponent, {
      data: {}, width: "60vw", height:"70vh"
    });
    BrandsDialog.afterClosed().subscribe(result => {
    });
  }

  ClearForm(){
    this.BrandInfo = {};
    this.BrandForm.reset({
      Brand: null,
      Country: '',
      Rating: null
    });
    this.brandFrom.submitted = false;
  }
}
