import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  scores$: Object;  // To store the Get data from HttpClient
  c : string;
  changer : boolean; // For making Score component know the route

  //  To recieve query params
  playerScore : string;
  playerId : string;

  constructor( private data: DataService, private route: ActivatedRoute ) {
    this.route.queryParams.subscribe(params => {
      this.playerScore = params['playerscore'];
      // this.playerId = params['playerid'];
      // console.log(this.playerId);
    });
  }

  ngOnInit() {

    this.data.getScore().subscribe(
      data => this.scores$ = data
    );
    this.route.params.subscribe( params => this.c = params.changer )
    if( this.c == "false" ) this.changer = false;
    else this.changer = true;
  }

}
