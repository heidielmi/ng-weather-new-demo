import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatefulButtonComponent } from './components/stateful-button/stateful-button.component';
import { boldMatchingSectionPipe } from './pipes/bold.pipe';
import { TemplateContentDirective } from './directives/template-content.directive';



@NgModule({
  declarations: [ StatefulButtonComponent, boldMatchingSectionPipe, TemplateContentDirective],
  imports: [
    CommonModule
  ],
  exports: [
    StatefulButtonComponent, boldMatchingSectionPipe, TemplateContentDirective
  ]
})
export class SharedModule { }
