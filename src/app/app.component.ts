import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {AccountService} from '../services/account.service';
import {SettingsPage} from '../pages/settings/settings';
import {LoginPage} from '../pages/login/login';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {TabsControllerPage} from '../pages/tabs-controller/tabs-controller';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsControllerPage;

  @ViewChild(Nav) nav;

  constructor(platform: Platform, private accountService: AccountService, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openSettings(): void {
    this.nav.push(SettingsPage);
  }

  logout(): void {
    this.accountService.disconnect()
      .then(() => {
        this.nav.setRoot(LoginPage);
      })
  }
}
