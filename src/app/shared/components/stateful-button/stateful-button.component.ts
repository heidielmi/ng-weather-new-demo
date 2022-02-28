import { Component, Input, Output, EventEmitter, ContentChild } from "@angular/core";
import { HttpStateEnum } from "../../../models/http-state.model";
import { TemplateContentDirective } from "../../directives/template-content.directive";

@Component({
  selector: "app-stateful-button",
  templateUrl: "./stateful-button.component.html",
  styleUrls: ["./stateful-button.component.css"],

})
export class StatefulButtonComponent {
  private _state: HttpStateEnum = HttpStateEnum.default;
  isDefaultMode = true;
  isInProgressMode = false;
  isCompletedMode = false;
  @ContentChild(TemplateContentDirective) content!: TemplateContentDirective;
  @Output() statefulButtonClicked = new EventEmitter();
  @Input() active = true;
  @Input()
  get httpState() {
    return this._state;
  }
  // the button gets a different background color and text upon completion of the action
  set httpState(state: HttpStateEnum) {
    this._state = state;
    switch (state) {
      case HttpStateEnum.default:
        this.isDefaultMode = true;
        this.isCompletedMode = false;
        this.isInProgressMode = false;
        break;
      case HttpStateEnum.inprogress:
        this.isDefaultMode = false;
        this.isCompletedMode = false;
        this.isInProgressMode = true;
        break;
      case HttpStateEnum.completed:
        this.isDefaultMode = false;
        this.isCompletedMode = true;
        this.isInProgressMode = false;
        break;
    }
  }

  button_click() {
    this.statefulButtonClicked.emit();
  }
}
