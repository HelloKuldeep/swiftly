import { Component, OnInit, ViewEncapsulation, AfterViewInit  } from '@angular/core';
import { Config } from 'ngx-countdown';
import { Router } from '@angular/router';
import { Card } from './card/card.model';
import { Scores } from '../score/score.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayComponent implements OnInit, AfterViewInit {

  constructor(private scoreService: DataService, private router: Router) {
    this.CardSetupInitial();
    const gameTime = new Date();
    this.timePlayedAt = gameTime.toLocaleDateString() + ' ' + gameTime.toLocaleTimeString();
  }

  // let score page know the route
  changer = false;

  // -----------------

  // this number can be altered to change first random box selection
  private lastRandomNumber = 1;

  // time to change the active card
  private initialTimeToRandom = 2000;

  // maximum gameSpeed
  private minTimeToRandom = 250;
  private timeStep = 250;

  // to clear setInterval() calls
  private randomCardIntervalId: any;

  // score multiplier for correct and wrong clicks
  private scoreFactor = 1;
  private maxScoreFactor: number = this.scoreFactor;
  private baseScore = 5;
  private penaltyScore = 5;

  // count after which gameSpeed increases
  private gameSpeedIncrementClicks = 5;

  // time game session started at
  private timePlayedAt: string;

  // other variables for score and time
  score = 0;
  timerInMs = 10;

  // intial card count
  cardcount = 4;
  cards: Card[] = new Array(this.cardcount).fill({ id: 0, hasColor: false });

  // default time of changing color in case of click is missed
  timeToRandomInMs: number = this.initialTimeToRandom;

  // factor for speed of game
  countSuccessClicks = 0;

  // To store and route - Id and Score
  scores$: Object;

  // ------------------------------------------------------------------------------------------------------

  // ------------------------------------Game Timer - Game Ending Trigger----------------------------------

  config: Config = {
    leftTime: 5,
    repaint: function() {
      const me: any = this;
      let content: string;

      me.hands.forEach((hand: any) => {
        if (hand.lastValue !== hand.value) {
          content = '';
          const cur = me.toDigitals(hand.value + 1, hand.bits).join(''),
                next = me.toDigitals(hand.value, hand.bits).join('');

          hand.node.innerHTML = `
            <span class="count curr top">${cur}</span>
            <span class="count next top">${next}</span>
            <span class="count next bottom">${next}</span>
            <span class="count curr bottom">${cur}</span>
          `;
          hand.node.parentElement.className = 'time';
          setTimeout(() => {
            hand.node.parentElement.className = 'time flip';
          });
        } else {
        }
      });
    },
  };

  ngOnInit() {
  }

  //  sets initial values to all cards
  CardSetupInitial() {
    this.chooseRandomCard();
    for (let card = 0; card < this.cards.length; card++) {
      this.cards[card] = {
        id: card + 1,
        hasColor: (card == this.lastRandomNumber - 1) ? true : false
      };
    }
  }

  // randomly choosing a card
  chooseRandomCard() {
    let randomNumber: number = this.getRandonNumber(this.cardcount);
    while (randomNumber == this.lastRandomNumber) {
      randomNumber = this.getRandonNumber(this.cardcount);
    }
    this.lastRandomNumber = randomNumber;
    return randomNumber;
  }

  // get any random number between 0 and 'num'
  getRandonNumber(num: number) {
    return Math.floor(Math.random() * (num) + 1);
  }

  // ----------------Pre Processing Game (Randomising Card Selection After Loading View)-------------------

  // called after all views are initialised
  ngAfterViewInit() {
    this.randomWithNewTime();
  }

  // randomise cards on certain intervals
  private randomWithNewTime() {
    // randomly select a card at 0th sec
    this.randomiseCards();
    // now at every timeToRandomInMs milliseconds cards are being randomised
    this.randomCardIntervalId = setInterval(() => { this.randomiseCards(); }, this.timeToRandomInMs);
  }

  // select a card randomly and changes old card to white and new card to blue
  randomiseCards() {
    if (this.timerInMs <= 0) {
      this.endGame();
    }
    this.cards[this.lastRandomNumber - 1].hasColor = false;
    let elem = document.getElementById('card_' + this.cards[this.lastRandomNumber - 1].id);
    elem.style.backgroundColor = 'white';
    const randomId: number = this.chooseRandomCard();
    this.cards[randomId - 1].hasColor = true;
    elem = document.getElementById('card_' + this.cards[randomId - 1].id);
    elem.style.backgroundColor = '#3C1742';
  }

  // ----------------------------------------------------------------------------------------------------

  // ------------------------------Post Processing After Game Is Over------------------------------------

  // stops the interval for random cards
  endGame() {
    // stoping SetInterval calls
    clearInterval(this.randomCardIntervalId);
    // disabling cards
    for (let i = 0; i < this.cards.length; i++) {
      const id = i + 1;
      const btn = <HTMLInputElement> document.getElementById('button_' + id);
      btn.disabled = true;
    }
    // storing game data
    const scores: Scores = {
      playedat: this.timePlayedAt,
      maxscorefactor: this.maxScoreFactor,
      scorepoint: this.score
    };
    this.scoreService.postScores(scores).subscribe(() => {
      // this.scoreService.getScore().subscribe(
      //   data => this.scores$ = data
      // );
      this.router.navigate(['/score', !this.changer],
       { queryParams: { /*playerid : this.scores$[ Object.keys(this.scores$).length - 1 ].id,*/
                        playerscore : this.score/*this.scores$[ Object.keys(this.scores$).length - 1 ].scorepoint*/ } }
      );
    });
  }

  // ----------------------------------------------------------------------------------------------------

  // ---------------------------------Game Processing While Playing--------------------------------------

  cardClickProcess(isClickedGreen: boolean) {
    console.log('CurrentScore: ' + this.score + '\nGameSpeed: ' + this.timeToRandomInMs + '\nClickingFactor: ' + this.scoreFactor);
    if (isClickedGreen) {
      this.countSuccessClicks++;
      if (this.countSuccessClicks >= this.gameSpeedIncrementClicks) {
        this.timeToRandomInMs -= this.timeStep;
        if (this.timeToRandomInMs <=  this.minTimeToRandom) {
          this.timeToRandomInMs = this.minTimeToRandom;
        }
        this.gameIncrementFactorer();
      }
      clearInterval(this.randomCardIntervalId);
      this.randomWithNewTime();
      this.score += this.baseScore * this.scoreFactor;
    } else {
      this.gameResetFactorer();
      clearInterval(this.randomCardIntervalId);
      this.timeToRandomInMs = this.timeToRandomInMs >= this.initialTimeToRandom ? this.initialTimeToRandom : this.timeToRandomInMs + this.timeStep;
      this.randomWithNewTime();
      this.score -= this.penaltyScore;
      if (this.score <= 0) {
        this.score = 0;
      }
    }
  }

  private gameIncrementFactorer() {
    // increases multiplier for increase game score faster
    this.scoreFactor++;
    // replaces maxScoreFactor
    if (this.scoreFactor > this.maxScoreFactor) {
      this.maxScoreFactor = this.scoreFactor;
    }
    // reset click count
    this.countSuccessClicks = 0;
  }

  private gameResetFactorer() {
    this.countSuccessClicks = 0;
    // this.scoreFactor = 1;
    this.scoreFactor > 1 ? this.scoreFactor-- : this.scoreFactor = 1;
  }

  onComplete() {
    // this.router.navigate(['/score',!this.changer]);
    this.timerInMs = 0;
  }

}
