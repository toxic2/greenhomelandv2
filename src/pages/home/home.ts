import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpService } from '../../providers/http-service/http-service';
import { MapPage } from './map/map';
import { DevicePage } from './device/device';
import { UserInfoPage } from './user-info/user-info';
import { StatisticOfHomePage } from './statistic-of-home/statistic-of-home';
import { AccountService } from '../../providers/account-service/account-service';
import { TakePhotoPage } from '../upload/take-photo/take-photo';
import { TaskPage } from '../task/task';

import 'rxjs/add/operator/map';

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit{

    // @ViewChild('organSelect') organSelect:ElementRef;

    @Output() organizationOut = new EventEmitter();
    @Output() projectOut = new EventEmitter();
    organization:string;
    project:string;
    organData:Array<Object>;
    projectData:Array<Object>;
    collectionData:Array<Object>;
    attentionPoints:Array<Object> = [];//关注采集点列表

    NoiseDeviceData:Array<Object> = [];
    WellDeviceData:Array<Object> = [];
    LXWaterLevelData:Array<Object> = [];
    GDWaterLevelData:Array<Object> = [];
    showCollectionPoint:boolean = false;
    icon:string;
    isAttention:boolean = false;
    //noinspection TypeScriptUnresolvedVariable

    collectionPointShow: string = "noise";

    title:string = "";
    accountId: number = -1;

    constructor(public navParams: NavParams,
                public app: App,
                public menuCtrl: MenuController,
                public nav: NavController,
                public http: Http,
                private toastCtrl: ToastController,
                public httpService: HttpService,
                private accountService: AccountService,
                // private elementREf:ElementRef,
                // private appConfig: AppConfig,
    ){

    }

    //初始化数据
    setUp() {
        this.NoiseDeviceData = [];
        this.WellDeviceData = [];
        this.LXWaterLevelData = [];
        this.GDWaterLevelData = [];
    }

    doRefresh(refresher) {
        setTimeout(() => {
            this.getOrganization();
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }

    getOrganization() {
        let url = this.httpService.getUrl()+"/NoiseDust/getOrganizations.do";
        // var url = this.appConfig.getUrl()+'/NoiseDust/getOrganizations.do';
        let body= "";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
        this.http.post(url,body,options).map(res =>res.json()).subscribe(data => {
            // alert(data['name']);
            this.organData = data;

            if(typeof((this.accountService.getAccount() as any).accountId) !="undefined"){
                this.accountId = (this.accountService.getAccount() as any).accountId;
                this.selectAccountAttentionPoints(this.accountId);
            }
            // console.log(this.organData);
        });
    }

    ionViewDidLoad() {
        this.setUp();
        this.title = "选择操作";
        this.icon = "ios-heart-outline";
        console.log(this.navParams.data);

        this.getOrganization();
    }


    ngAfterViewInit() {

    }

    openMenu(): void{
        this.menuCtrl.open();
    }

    changeUserInfo(){
        //使用getRootNav方法可以去掉子页面的tabs

        this.app.getRootNav().push(UserInfoPage);
    }

    ngOnInit() {

    }

    organChange() {
        if(this.organData === null){
            this.getOrganization();
        }
        this.organizationOut.emit(this.organization);
        let url = this.httpService.getUrl()+"/NoiseDust/getProjectsByOrg.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "id="+this.organization;
        let options = new RequestOptions({
            headers: headers
        });

        // alert(this.organization);

        // alert(this.organization);

        this.http.post(url,body,options).map(res => res.json()).subscribe(data =>{
            // console.log(data);
            this.projectData = data;
        });
    }

    projectChange() {

        // alert(this.organization);
    }


    QueryOfHome() {

        this.projectOut.emit(this.project);
        this.setUp();
        let url = this.httpService.getUrl()+"/NoiseDust/getCollectionOfProject.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "id="+this.project;
        let options = new RequestOptions({
            headers: headers
        });

        this.http.post(url,body,options).map(res =>res.json()).subscribe(data =>{

            this.showCollectionPoint = true;
            // console.log(data);
            this.collectionData = data;
            for (let i =0; i<this.collectionData.length;i++){
                // console.log(this.collectionData[i].deviceId);
                this.getDeviceTypeById((this.collectionData[i] as any).deviceId,i);
            }
        });
        // console.log(this.project);
    }

    getDeviceTypeById(Id,i){
        let url = this.httpService.getUrl()+"/NoiseDust/getDeviceById.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "deviceId="+Id;
        let options = new RequestOptions({
            headers: headers
        });

        this.http.post(url,body,options).map(res =>res.json()).subscribe(result =>{

            // console.log(result);
            // console.log(this.collectionData[i]);
                if(result.model=='HL-Z-W-15') {
                    this.NoiseDeviceData.push(this.collectionData[i]);
                    // console.log(this.collectionData[i]);
                    // console.log(this.array_contain(this.attentionPoints,this.collectionData[i]));
                    // if (this.array_contain(this.attentionPoints,this.collectionData[i])){
                    //     console.log("========已关注======");
                    //     console.log(this.collectionData[i]);
                    // }
                }else if(result.model=='ZF-LX-01'){
                    this.LXWaterLevelData.push(this.collectionData[i]);
                }else if(result.model=='ZF-GD-01'){
                    this.GDWaterLevelData.push(this.collectionData[i]);
                }else if(result.model=='ZF-JG-01'){
                    this.WellDeviceData.push(this.collectionData[i]);
                }
                else if(result.dev_model==''){

                }
        });
    }


    // 判断是否关注
    array_contain(array, obj){
    for (let i = 0; i < array.length; i++){
        if (array[i].deviceId == obj.deviceId)//如果要求数据类型也一致，这里可使用恒等号===
            return true;
    }
    return false;
    }

    selectAccountAttentionPoints(accountId){
        this.attentionPoints = [];
        let url = this.httpService.getUrl()+"/NoiseDust/getAccountAttentionPoints.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "accountId="+accountId;
        let options = new RequestOptions({
            headers: headers
        });
        this.http.post(url,body,options).map(res =>res.json()).subscribe(result =>{
            this.attentionPoints = result;

            console.log("+++++++++attention+++++++++");
            console.log(this.attentionPoints);

        },err =>{

        });
    }

    gotoDeviceInfo(id){
        this.app.getRootNav().push(DevicePage,id);
    }



    gotoMap(latitude :number,longitude :number,projectName :string,pointName :string){
        this.app.getRootNav().push(MapPage,[latitude,longitude,projectName,pointName]);
    }


    gotoStatistic(point){
        this.app.getRootNav().push(StatisticOfHomePage,[point]);
    }

    gotoUpload(item){
        let orgName = "";
        for (let i =0;i<this.organData.length;i++){
            if ((this.organData[i] as any).id == this.organization){
                orgName = (this.organData[i] as any).name;
            }
        }
        console.log(item);
        this.app.getRootNav().push(TakePhotoPage,{
            isHomeToUpload:true,
            data:item,
            projectId:item.projectId,
            projectName:item.projectName,
            collectionPointName:item.name,
            collectionPointId:item.id,
            organizationId:this.organization,
            organizationName:orgName});
    }

    gotoTask(){
        let orgName = "";
        for (let i =0;i<this.organData.length;i++){
            if ((this.organData[i] as any).id == this.organization){
                orgName = (this.organData[i] as any).name;
            }
        }

        let prjName = "";
        for (let i =0;i<this.projectData.length;i++){
            if ((this.projectData[i] as any).id == this.project){
                prjName = (this.projectData[i] as any).name;
            }
        }
        console.log(orgName);

        this.app.getRootNav().push(TaskPage,{
            isHomeToTask:true,
            organizationId:this.organization,
            organizationName:orgName,
            prjId:this.project,
            prjName:prjName
        });

    }
    addAttention(item) {


        this.accountId = (this.accountService.getAccount() as any).accountId;

        let url = this.httpService.getUrl()+"/NoiseDust/setAccountAttentionPoint.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "accountId="+this.accountId+"&pointId="+(item as any).id;
        let options = new RequestOptions({
            headers: headers
        });
        this.http.post(url,body,options).subscribe(result =>{
            // this.attentionPoints = result;
            // console.log(this.attentionPoints);
            console.log("关注成功！！！！");
            this.selectAccountAttentionPoints(this.accountId);
        },err =>{

        });
    }

    delAttention(item) {

        this.accountId = (this.accountService.getAccount() as any).accountId;

        let url = this.httpService.getUrl()+"/NoiseDust/delAccountAttentionPoint.do";
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body = "accountId="+this.accountId+"&pointId="+(item as any).id ;
        let options = new RequestOptions({
            headers: headers
        });
        this.http.post(url,body,options).subscribe(result =>{
            // this.attentionPoints = result;
            // console.log(this.attentionPoints);
            this.selectAccountAttentionPoints(this.accountId);
            console.log("取消关注成功！！！！");
        },err =>{

        });
    }

    removeElement(arr, ele){
        let result  = [];
        if(arr instanceof Array){
            if(ele instanceof Array){
                result = arr.filter(function(item){
                    var isInEle = ele.some(function(eleItem){
                        return item === eleItem;
                    });
                    return !isInEle
                })
            }else{
                result = arr.filter(function(item){
                    return item !== ele
                })
            }
        }else{
            console.log('parameter error of function removeElement');
        }
        return result;
    }
}

