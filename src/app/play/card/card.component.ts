import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from './card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  // model class reference 
  @Input() card : Card;

  // on click event listener
  @Output() onClickListener = new EventEmitter();

  // trigger game processing function in Game Component
  onClick(){
    if(this.card.hasColor){
      this.onClickListener.emit(true);
    }
    else{
      this.onClickListener.emit(false);
    }
  }
}
