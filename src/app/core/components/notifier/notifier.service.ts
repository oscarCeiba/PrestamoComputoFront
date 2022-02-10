import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from './notifier.component';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar:MatSnackBar) { }

  showNotification(displayMessage:string, buttonMessage:string, messageType : string){
    this.snackBar.openFromComponent(NotifierComponent,{
      data: {
        message: displayMessage,
        buttonText: buttonMessage,
        type:messageType
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageType
    })
  } 
}
