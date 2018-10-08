import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Scores } from '../app/score/score.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient ) { }

  getScore() {
    return this.http.get('http://localhost:3000/score');
  }

  postScores(score: Scores) {
    return this.http.post('http://localhost:3000/score', score);
  }

}
