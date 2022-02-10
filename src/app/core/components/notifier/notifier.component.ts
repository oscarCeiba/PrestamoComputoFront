import { Component, Inject, OnInit } from '@angular/core';
import {MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import { dataNotifier } from '@core/modelo/data-notifier'; 

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html'
})
export class NotifierComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: dataNotifier,
  public snackBarRef:MatSnackBarRef<NotifierComponent>) { }

  ngOnInit(): void {
  }

}
