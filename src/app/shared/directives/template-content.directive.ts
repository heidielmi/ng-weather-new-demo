import { Directive, TemplateRef } from '@angular/core';
@Directive({
    selector: '[appTemplateContent]'
  })
  export class TemplateContentDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
  }
