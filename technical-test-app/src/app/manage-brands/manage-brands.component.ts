import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  NgForm
} from "@angular/forms";
import { ServerService } from '../Services/server.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-brands',
  templateUrl: './manage-brands.component.html',
  styleUrls: ['./manage-brands.component.scss']
})
export class ManageBrandsComponent implements OnInit {

  @ViewChild('brForm') brForm: any;
  BrandForm: FormGroup;
  alphaNumPattern = /^[a-zA-Z0-9_]*$/;
  Brand: any = {};
  BrandsList: any = [];
  
  constructor(
    public OfferDetails: MatDialogRef<ManageBrandsComponent>,
    private formBuilder: FormBuilder,
    private server: ServerService
  ) {
    this.BrandForm = this.formBuilder.group({
      BrandName: ['',{
        validators: [Validators.required, Validators.pattern(this.alphaNumPattern), Validators.maxLength(64)],
        updateOn: 'submit'
      }],
      BrandDesc:  ['',{
        validators: [Validators.maxLength(256)],
        updateOn: 'submit'
      }]});
  }

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(){
    this.server.getBr().subscribe((jsonCallback) => {
      var response    = jsonCallback;
      this.BrandsList = response.body
        }, (error) => {
      var errorMessage = error.message;
      }, () => {});
  }

  AddBrand(){
    var Brand = this.Brand;
    var BNValid = true;
    var BID = Brand.ID == null ? -1 : Brand.ID
    var fil = this.BrandsList.filter((el:any) => {
      return (el.BrandName == Brand.BrandName && parseInt(el.ID,10) != parseInt(BID,10))
    })
    if(fil.length > 0) BNValid = false;
    if(this.BrandForm.valid && BNValid)
    {if(Brand.ID){
      this.server.updateBr(Brand).subscribe((resp) => {
        var response    = resp;
        this.getBrands();
        this.ClearForm();
          }, (error) => {
        var errorMessage = error.message;
        }, () => {});
    }else{
      this.server.createBr(Brand).subscribe((resp) => {
        var response    = resp;
        this.getBrands();
        this.ClearForm();
          }, (error) => {
        var errorMessage = error.message;
        }, () => {});
    }
  }else if(this.BrandForm.valid && !BNValid){
    Swal.fire({
      buttonsStyling: false,
    });
    Swal.fire({
      title: "Alert",
      text: "Brand Name Already Exists!!",
      confirmButtonText: "Okay",
      reverseButtons: true,
    }).then((res: any) => {
      if (res.value) {
      } else if (res.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  }

  editBrand(brand: any){
    this.Brand = brand;
  }

  popupDeleteBrand(ID: number){
    Swal.fire({
      buttonsStyling: false,
    });
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to remove this brand?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((res: any) => {
      if (res.value) {
        this.DeleteBrand(ID);
      } else if (res.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  DeleteBrand(ID: number){
    this.server.deleteBr(ID).subscribe((resp) => {
      var response    = resp;
      this.getBrands();
        }, (error) => {
      var errorMessage = error.message;
      }, () => {});
  }


  ClearForm(){
    this.BrandForm.reset({
      BrandName: '',
      BrandDesc: ''
    });
    this.Brand = {};
    this.brForm.submitted = false;
  }

}
