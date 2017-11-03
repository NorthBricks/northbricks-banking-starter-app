import { Transaction } from '../../interface/iTransaction';
import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

    toast: Toast;
    constructor(public toastCtrl: ToastController) { }

    create(message: any, ok = false, duration = 2000) {
        if (this.toast) {
            this.toast.dismiss();
        }

        this.toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'top',
            // showCloseButton: ok,
            // closeButtonText: 'OK'
        });
        this.toast.present();
    }
    showTransaction(message: Transaction, ok = false, duration = 2000) {
        if (this.toast) {
            this.toast.dismiss();
        }

        this.toast = this.toastCtrl.create({
            message: `ID ${message.id} Related party ${message.relatedParty.name} Value date ${message.valueDate} Amount  ${message.amount.value} ${message.amount.currency} Booking date: ${message.bookingDate} Description ${message.description}`,
            duration: 0,
            position: 'top',
            showCloseButton: ok,
            // closeButtonText: 'OK'
        });
        this.toast.present();
    }
}