import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
export interface Cat {
  name: string
}
@Injectable({
  providedIn: 'root'
})
export class ServerService {


  headers: HttpHeaders

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
  });
  }

  private async request(method: string, url: string, data?: any) {

    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: {
      }
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }

  getBr() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(`http://localhost:8000/api/brand`, {observe: 'response', headers: headers})
  }

  createBr(brand: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`http://localhost:8000/api/brand`, brand, {observe: 'response', headers: headers})
  }

  updateBr(brand: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(`http://localhost:8000/api/brand`, brand, {observe: 'response', headers: headers})
  }

  deleteBr(ID: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.delete(`http://localhost:8000/api/brand/${ID}`, {observe: 'response', headers: headers})
  }
  
  /*---------------------------------------------------------------------*/

  
  getBrandsRatings() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(`http://localhost:8000/api/brandRating`, {observe: 'response', headers: headers})
  }

  createRating(brandRating: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`http://localhost:8000/api/brandRating`, brandRating, {observe: 'response', headers: headers})
  }

  updateRating(brandRating: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(`http://localhost:8000/api/brandRating`, brandRating, {observe: 'response', headers: headers})
  }

  deleteRating(ID: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.delete(`http://localhost:8000/api/brandRating/${ID}`, {observe: 'response', headers: headers})
  }
  
}
