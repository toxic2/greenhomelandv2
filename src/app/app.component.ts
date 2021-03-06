import { Component, ViewChild} from '@angular/core';
import { Platform, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HelpPage } from  '../pages/menu/help/help';
import { AboutPage } from  '../pages/menu/about/about';
import { Http, RequestOptions, Headers} from '@angular/http';
// import { AboutPage } from '../pages/about/about';
import { HttpService } from '../providers/http-service/http-service';
import { AccountService } from '../providers/account-service/account-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav;
  rootPage:any = LoginPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public http: Http,
              public httpService: HttpService,
              public accountService: AccountService,
              private storage: Storage,
              private menuCtrl: MenuController ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkPreviousAuthorization();
    });
  }

    checkPreviousAuthorization(): void {

        this.storage.get('username').then((username) =>{
            this.storage.get('password').then((password) =>{

                if(username === null || username === "undefined" || password === null || password === "undefined" ){
                    this.rootPage = LoginPage;
                }else{

                    let url = this.httpService.getUrl() + "/NoiseDust/mainOfApp.do";
                    let body= "name="+username+"&password="+password;
                    let headers = new Headers({
                        'Content-Type': 'application/x-www-form-urlencoded'
                    });
                    let options = new RequestOptions({
                        headers: headers
                    });
                    this.http.post(url,body,options).map(res =>res.json()).subscribe(data => {
                                console.log(data);
                                this.accountService.setAccount(data);
                            },
                            err =>{
                            });

                    this.rootPage = TabsPage;
                }
            });
        });
    }

    logout() {
        // this.navCtrl.push(LoginPage);
        this.storage.remove('username');
        this.storage.remove('password');
        this.nav.setRoot(LoginPage);
        this.menuCtrl.close();

    }

    poweredBy() {
        // let url = 'https://darksky.net/poweredby/';
        // this.browserTab.isAvailable()
        //     .then((isAvailable: boolean) => {
        //         if (isAvailable) {
        //             this.browserTab.openUrl(url);
        //         }
        //     })
        //     .catch(err => console.error(err));
    }

    gotoPageAbout() {
        this.nav.push(AboutPage);
    }
    gotoPageNotice () {
        // this.nav.push(AboutPage);

    }
    gotoPageHelp() {
        this.nav.push(HelpPage);

    }

}
