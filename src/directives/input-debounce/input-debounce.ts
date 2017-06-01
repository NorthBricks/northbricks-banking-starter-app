import { Directive, Output, EventEmitter, Input } from '@angular/core';
import { NgControl } from "@angular/forms";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Directive({
  selector: '[ngModel][debounce]' // Attribute selector
})
export class InputDebounceDirective {
  @Output()
  public onDebounce = new EventEmitter<any>();

  @Input('debounce')
  public debounceTime: number = 1000;

  private isFirstChange: boolean = true;
  constructor(public model: NgControl) {
    console.log('Hello InputDebounceDirective Directive');
  }
  ngOnInit() {
    this.model.valueChanges
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe(modelValue => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          console.log(modelValue);
          this.onDebounce.emit(modelValue);
        }
      });
  }

}
