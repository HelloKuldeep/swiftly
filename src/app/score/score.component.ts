import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  scores$: Object;
  changer : boolean;

  constructor( private data: DataService, private route: ActivatedRoute ) {
    
  }

  ngOnInit() {
    this.data.getScore().subscribe(
      data => this.scores$ = data
    );
    this.route.params.subscribe( params => this.changer = params.changer )
  }

}
