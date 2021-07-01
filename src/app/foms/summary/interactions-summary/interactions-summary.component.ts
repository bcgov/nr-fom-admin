import { Component, Input, OnInit } from '@angular/core';
import { InteractionResponse } from 'core/api';
import { ConfigService } from 'core/services/config.service';

@Component({
  selector: 'app-interactions-summary',
  templateUrl: './interactions-summary.component.html',
  styleUrls: ['./interactions-summary.component.scss']
})
export class InteractionsSummaryComponent implements OnInit {

  interactions: InteractionResponse[] = [];

  @Input() 
  requestError: boolean
  
  constructor(private configSvc: ConfigService) { }

  ngOnInit(): void {
  }

  @Input() set interactionDetails(interactions: InteractionResponse[]) {
    this.interactions = interactions;
  }

  getAttachmentUrl(id: number): string {
    return id ? this.configSvc.getApiBasePath()+ '/api/attachment/file/' + id : '';
  }
}
