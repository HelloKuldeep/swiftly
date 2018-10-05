import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scores } from '../app/score/score.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http : HttpClient ) { }

  getScore(){
    return this.http.get('https://radiant-escarpment-32075.herokuapp.com/score');
  }

  postScores(score:Scores){
    return this.http.post('https://radiant-escarpment-32075.herokuapp.com/score',score);
  }

}