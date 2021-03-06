import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {AccountService, FacebookCredentials, UserNotificationToken} from '../../services/account.service';
import {Facebook} from '@ionic-native/facebook';
import {TabsControllerPage} from '../tabs-controller/tabs-controller';
import {Firebase} from '@ionic-native/firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginProcess: boolean = false;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private firebase: Firebase,
              private facebook: Facebook,
              private accountService: AccountService) {
  }

  initPushNotification() {
      this.firebase.getToken()
        .then(token => {
          this.accountService.getCurrentUser().then(user => {
            this.accountService.updateNotificationToken(new UserNotificationToken(user.email, token));
          });
        })
        .catch(error => console.error('Error getting token', error));

      this.firebase.onTokenRefresh()
        .subscribe((token: string) => {
          this.accountService.getCurrentUser().then(user => {
            this.accountService.updateNotificationToken(new UserNotificationToken(user.email, token));
          });
        });
  }

  facebookLogin(): void {
    this.loginProcess = true;
    this.facebook.login(['public_profile', 'email', 'user_birthday', 'user_hometown'])
      .then(response => this.loginViaFacebook(response))
      .catch(error => {
        console.log(error);
        this.loginProcess = false;
      });
  }

  loginViaFacebook(response): void {
    this.accountService.facebookSignIn(new FacebookCredentials(response.authResponse.userID, response.authResponse.accessToken))
      .then(() => {
        this.initPushNotification();
        this.navCtrl.setRoot(TabsControllerPage)
      })
      .catch(() => {
        this.presentToastServerError();
        this.loginProcess = false
      })
  }

  presentToastServerError() {
    let toast = this.toastCtrl.create({
      message: 'Oh no! Something bad happened. Please come back later when we fixed that problem. Thanks.',
      duration: 4000,
    });
    toast.present();
  }
}
