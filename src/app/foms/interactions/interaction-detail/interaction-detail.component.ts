import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { InteractionResponse } from 'core/api';
import { InteractionDetailForm } from './interaction-detail.form';

@Component({
  selector: 'app-interaction-detail',
  templateUrl: './interaction-detail.component.html',
  styleUrls: ['./interaction-detail.component.scss'],
  exportAs: 'interactionForm'
})
export class InteractionDetailComponent implements OnInit {

  today = new Date();
  interaction: InteractionResponse;
  interactionFormGroup: FormGroup;
  
  constructor(
    private formBuilder: RxFormBuilder
  ) { }

  ngOnInit(): void {
  }

  @Input() set selectedInteraction(interaction: InteractionResponse) {
    this.interaction = interaction;
    const interactionForm = new InteractionDetailForm(interaction)
    this.interactionFormGroup = this.formBuilder.formGroup(interactionForm);
  };
  
}
