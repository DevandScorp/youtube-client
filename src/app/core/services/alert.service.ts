import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Alert } from '../../interfaces';

@Injectable()
export class AlertService {
    public alert$ = new Subject<Alert>();

    success(text: string) {
        this.alert$.next({ type: 'success', text })
    }
    error(text: string) {
        this.alert$.next({ type: 'error', text })
    }
}