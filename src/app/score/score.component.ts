import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  scores$: Object;

  constructor( private data: DataService ) {
  }

  ngOnInit() {//console.log("oninit");
    this.data.getScore().subscribe(
      data => this.scores$ = data
    );
  }

}
