import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams } from 'ionic-angular';
import { StatisticDetailPage } from './statistic-detail/statistic-detail';

/**
 * Generated class for the StaticticPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html',
})
export class StatisticPage {
    constructor(public navCtrl: NavController,
                private app: App,
                private navParams: NavParams,
    ) {

    }
    /*
     * 跳转至统计界面
     * */
    gotoStatistic(type) {
        // alert("haha");
        this.app.getRootNav().push(StatisticDetailPage,{type:type});

    }

}
