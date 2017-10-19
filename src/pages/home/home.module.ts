import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MapPage } from './map/map';
import { DevicePage } from './device/device';
import { UserInfoPage } from './user-info/user-info';
import { UserInfoEditPage } from './user-info-edit/user-info-edit';
import { StatisticOfHomePage } from  './statistic-of-home/statistic-of-home';
import { NameLengthPipe } from '../../pipes/name-length/name-length';
import { AccordionlistComponentModule } from '../../components/accordionlist/accordionlist.module';

@NgModule({


  declarations: [
    HomePage, MapPage, DevicePage, StatisticOfHomePage ,UserInfoPage, UserInfoEditPage, NameLengthPipe
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
      AccordionlistComponentModule
  ],
  exports: [
    HomePage
  ],
    entryComponents:[
        MapPage,DevicePage,UserInfoPage, UserInfoEditPage, StatisticOfHomePage
    ],

})
export class HomePageModule {}
