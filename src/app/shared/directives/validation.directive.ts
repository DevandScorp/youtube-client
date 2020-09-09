import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, fromEvent, Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Directive({
  selector: '[validation]'
})
export class ValidationDirective implements AfterViewInit, OnDestroy {

  private readonly _messageWrapper: HTMLElement;

  private subscription: Subscription;

  constructor(private element: ElementRef, private control: NgControl) {
    this._messageWrapper = document.createElement('div');
    this._messageWrapper.className = 'validation';
  }

  ngAfterViewInit() {
    this.subscription = merge(
      this.control.control.statusChanges,
      this.control.control.valueChanges,
      fromEvent(this.element.nativeElement, 'blur')
    ).pipe(
      tap(() => (this.control.control.valid || this.control.control.untouched) && this._clear()),
      filter(() => this.control.control.invalid && this.control.control.touched),
      tap(() => this._display())
    ).subscribe()
  }

  private _getError(): string {
    console.log(this.control.control.errors);
    return (this.control.control.errors && Object.keys(this.control.control.errors)[0]) || '';
  }

  private _display(): void {
    let value = '';
    switch(this._getError()) {
      case 'email':
        value = 'Неверный формат электронной почты'
        break;
      case 'required':
        value = 'Поле не должно быть пустым';
        break;
      case 'minlength':
        value = `Необходимая минимальная длина пароля: ${this.control.control.errors.minlength.requiredLength}.Текушая длина пароля: ${this.control.control.errors.minlength.actualLength}`
      default:
        break;
    }
    this._messageWrapper.innerText = value;
    this.element.nativeElement.parentNode.insertBefore(this._messageWrapper, this.element.nativeElement.nextSibling);
  }

  private _clear(): void {
    if (this._messageWrapper.isConnected) {
      this._messageWrapper.remove();
    }
  }
  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
