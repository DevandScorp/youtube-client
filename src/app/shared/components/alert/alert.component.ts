import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() delay = 5000;

  public text: string;
  public type = 'success';

  alertSubscription: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alert$.subscribe(alert => {
      this.text = alert.text;
      this.type = alert.type;

      setTimeout(() => {
        this.text = '';
      }, this.delay)
    })
  }
  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

}
