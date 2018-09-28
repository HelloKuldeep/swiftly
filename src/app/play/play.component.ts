import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Config } from 'ngx-countdown';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

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
        }
      });
    },
  };

}
