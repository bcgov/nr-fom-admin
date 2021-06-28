import { Component, Input, OnInit } from '@angular/core';
import { InteractionResponse } from 'core/api';

@Component({
  selector: 'app-interactions-summary',
  templateUrl: './interactions-summary.component.html',
  styleUrls: ['./interactions-summary.component.scss']
})
export class InteractionsSummaryComponent implements OnInit {

  interactions: InteractionResponse[] = [];

  @Input() 
  requestError: boolean
  
  constructor() { }

  ngOnInit(): void {
  }

  @Input() set interactionDetails(interactions: InteractionResponse[]) {
    this.interactions = interactions;
  }
}
