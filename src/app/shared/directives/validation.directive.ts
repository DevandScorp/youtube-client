import { Direct } from "protractor/built/driverProviders";
import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, fromEvent } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Directive({
    selector: '[validation]'
})
export class ValidationDirective implements AfterViewInit, OnDestroy {

    private readonly _messageWrapper: HTMLElement;

    constructor(private element: ElementRef, private control: NgControl) {
        this._messageWrapper = document.createElement('div');
        this._messageWrapper.className = 'validation';
    }

    ngAfterViewInit() {
        merge(
            this.control.control.statusChanges,
            this.control.control.valueChanges,
            fromEvent(this.element.nativeElement, 'blur')
        ).pipe(
            tap(() => (this.control.control.valid || this.control.control.untouched) && this._clear()),
            filter(() => this.control.control.invalid && this.control.control.touched && !this._messageWrapper.isConnected),
            tap(() => this._display())
        ).subscribe()
    }

    private _transform(): string {
        let value = '';
        return value;
    }

    private _getError(): string {
        return (this.control.control.errors && Object.keys(this.control.control.errors)[0]) || '';
    }

    private _display(): void {
        this.element.nativeElement.parentNode.insertBefore(this._messageWrapper, this.element.nativeElement.nextSibling);
    }

    private _clear(): void {
        if (this._messageWrapper.isConnected) {
            this._messageWrapper.remove();
        }
    }
    ngOnDestroy(): void {
    }
}