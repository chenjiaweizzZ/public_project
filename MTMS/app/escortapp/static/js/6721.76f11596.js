"use strict";(self["webpackChunkapp"]=self["webpackChunkapp"]||[]).push([[6721],{85965:function(t,e,i){i.d(e,{Z:function(){return l}});var s=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],staticClass:"addcontent"},[e("i",{staticClass:"shade",on:{click:t.close}}),e("ul",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],staticClass:"select",staticStyle:{"animation-duration":".1s"},style:{top:t.config.fixedtop,right:t.config.fixedright},attrs:{"enter-active-class":"animated fadeInDown","leave-active-class":"animated fadeOutUp"}},t._l(t.list,(function(i,s){return 1==i.isused?e("li",{on:{click:function(e){return t.select(i)}}},[t._v(" "+t._s(i.name)+" ")]):t._e()})),0)])},a=[],n={name:"addselect",props:{showAdd:{type:Boolean,default:!1},config:{default:function(){return{show:!1,label:"",fixedright:0,fixedtop:0}}},dataList:{type:Array,default:function(){return[]}}},data(){return{addButton:!1}},mounted:function(){this.addButton=this.showAdd},methods:{close(){this.config.show=!1},select(t){this.$emit("confirm",t)}},watch:{showAdd(t,e){this.addButton=t}},computed:{list(){let t=this.config.label||"";return this.dataList.length>0?(this.stopclick=!1,this.dataList.map((e=>{e.name=e[t],e.isused="fdAction_add"==e.router?this.addButton:e.isused})),this.dataList):(this.stopclick=!0,[{name:"当前暂无数据"}])}}},r=n,o=i(1001),c=(0,o.Z)(r,s,a,!1,null,"04a28040",null),l=c.exports},62266:function(t,e,i){i.d(e,{Z:function(){return l}});var s=function(){var t=this,e=t._self._c;return e("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],attrs:{id:"picker"}},[e("div",{attrs:{id:"picker-main"}},[e("header",[e("span",{on:{click:t.cancle}},[t._v("取消")]),e("span",{class:{noclick:t.isdisabled},on:{click:t.sure}},[t._v("确定")])]),e("section",[e("div",{staticClass:"on"}),e("ul",{style:t.style,on:{touchstart:function(e){return e.preventDefault(),t.start.apply(null,arguments)},touchmove:function(e){return e.preventDefault(),t.move.apply(null,arguments)},touchend:function(e){return e.preventDefault(),t.end.apply(null,arguments)}}},t._l(t.list,(function(i,s){return e("li",{domProps:{innerHTML:t._s(i.txt)}})})),0)])])])])},a=[],n=(i(70560),{name:"picker",props:{config:{default:function(){return{show:!1,mainlist:{type:Array,default:[]},defaultVal:[String,Number],valueKey:{type:[Function,String],default:"name"}}}}},data(){return{isdisabled:!1,activeItem:0,itemLength:0,activeItemValue:0,curVal:"",style:{},Y:0,t:.1,touchStartTime:0,touchEndTime:0,eY:45,sY:90,itemHeight:45}},watch:{"config.mainlist":function(t,e){t!==e&&(this.activeItem=0,this.Y=0,this.eY=45,this.sY=90,this.style={transform:"translate3d(0px, "+this.sY+"px, 0px)",transition:"all ease "+this.t+"s"})}},filters:{},computed:{list(){let t=[],e=typeof this.config.valueKey;return 0==this.config.mainlist.length?(this.isdisabled=!0,this.config.mainlist=[{name:"暂无数据"}],this.config.mainlist.map((t=>{t.txt=t.name}))):(this.isdisabled=!1,this.config.mainlist.map((i=>{if("string"===e)i.txt=i[this.config.valueKey],t.push(i);else if("function"===e){let e=this.config.valueKey(i);i.txt=e,t.push(i)}}))),this.curVal=t[this.activeItem],this.itemLength=t.length,t}},mounted(){this.config.defaultVal?this.moveTo():this.style={transform:"translate3d(0px, "+this.sY+"px, 0px)",transition:"all ease "+this.t+"s"}},methods:{moveTo(t){this.list.map(((e,i)=>{e==(t||this.config.defaultVal)&&(this.activeItem=i,this.activeItemValue=e)})),this.Y=45*this.activeItem,this.eY=45*this.activeItem,this.style={transform:"translate3d(0px, "+this.Y+"px, 0px)",transition:"all ease "+this.t+"s"}},start(t){this.sY=t.touches[0].clientY,this.touchStartTime=t.timeStamp},move(t){this.Y=this.eY+t.touches[0].clientY-this.sY,this.t=.1,this.style={transform:"translate3d(0, "+this.Y+"px, 0)",transition:"all ease "+this.t+"s"}},end(t){let e=90,i=-45*(this.itemLength-1)+e;if(this.eY=this.Y,this.touchEndTime=t.timeStamp-this.touchStartTime,this.t=.1,this.sY==t.changedTouches[0].clientY)return;Math.abs(this.eY%45)<=22.5?this.eY=45*parseInt(this.eY/45):this.eY>0?this.eY=45*parseInt(this.eY/45)+45:this.eY=45*parseInt(this.eY/45)-45,this.eY>e&&(this.Y=0,this.eY=90,this.activeItem=0),this.eY<=i&&(this.Y=i,this.eY=i,this.activeItem=this.itemLength-1),this.style={transform:"translate3d(0, "+this.eY+"px, 0)",transition:"all ease "+this.t+"s"};let s=Math.abs((this.eY-e)/45);this.activeItem=Math.round(s),this.curVal=this.list[this.activeItem],this.$emit("changeCurVal",this.type,this.curVal)},cancle(){this.config.show=!1},sure(){this.$emit("confirm",this.curVal)}}}),r=n,o=i(1001),c=(0,o.Z)(r,s,a,!1,null,"e3fc68ee",null),l=c.exports},69463:function(t,e,i){i.r(e),i.d(e,{default:function(){return g}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"g-wrapper"},[e("c-header",[e("div",{attrs:{slot:"headerLeft"},slot:"headerLeft"},[e("router-link",{staticClass:"header-back-btn",attrs:{to:{name:"fdAttendance_history"}}},[e("img",{attrs:{src:i(88579)}})])],1),t._v(" 考勤分析 ")]),e("div",{staticClass:"g-main"},[e("div",{staticClass:"trend"},[e("p",[e("span",[t._v(" 本科室近六个月"+t._s(t.trendSelect)+" ")]),e("span",{staticClass:"trend-select",on:{click:function(e){t.typeconfig.show=!0}}},[t._v(" "+t._s(t.trendSelect)+" ")])]),t._m(0)]),e("div",{staticClass:"rate"},[e("p",[e("span",[t._v(" "+t._s(t._f("substr")(t.currentmonth,0,4))+"年"+t._s(t._f("substr")(t.currentmonth,5,2))+"月 ")]),e("span",{staticClass:"rate-select",on:{click:function(e){t.gettime.show=!0}}},[e("img",{attrs:{src:i(18885),alt:""}})])]),t._m(1)])]),e("add-group",{attrs:{config:t.typeconfig,"data-list":t.typelist},on:{confirm:t.typeselect}}),e("c-timepicker",{attrs:{config:t.gettime,year:t.year,month:t.month},on:{confirm:t.selecttime}})],1)},a=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"trend-content"},[e("div",{attrs:{id:"echarts-trend"}})])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"rate-content"},[e("div",{attrs:{id:"echarts-rate"}})])}],n=(i(70560),i(68934)),r=i(63822),o=i(22760),c=i(62266),l=i(85965),h=i(49931),d=i(39405),u=i.n(d),m=(i(63604),i(4358),i(89174),i(44440),{props:["active"],data(){return{trendSelect:"签到率",selectStu:"签到",type:"",rate:{},i:0,list:[],rateOpinion:["签到","请假","缺勤","迟到","早退","其他"],rateOpinionData:[],lineXdata:[],linedata:[],currentmonth:"",typeconfig:{show:!1,label:"name",fixedtop:"1.7rem",fixedright:".1rem"},typelist:[],gettime:{show:!1,istime:!1,isday:!1,custom:!0},year:[2018,2028],month:[1,12]}},components:{cPicker:c.Z,addGroup:l.Z,cTimepicker:h.Z,cHeader:o.Z},watch:{},filters:{rate:function(t){return Number(t).toFixed(2)+"%"}},computed:{...(0,r.rn)(["turninfo","systype","singindept","turnstatus"])},created(){this.currentmonth=this.turninfo.signindata},mounted(){let t=this;this.inittypelist(),this.init(),this.registerToNative("goBack",(function(e){t.back()}))},methods:{...n.Z,...(0,r.nv)(["showAlert","showConfirm","showLoading","hideLoading","toast"]),inittypelist(){let t=this;this.post("/traineestudent/queryDictionaryList",{command:"traineestudent/queryDictionaryList",sessionid:$.cookie("sid"),loginid:$.cookie("uid"),code:"workattendancetype"}).done((e=>{if(e&&0==e.errcode){let i=e.dic_list;i.map((t=>{t.isused=1,t.name=t.name+"率"})),t.typelist=i,t.type=t.typelist[0].key,t.initline()}else e.errdesc?t.toast(e.errdesc):t.toast("服务器错误，请联系管理员。")}))},init(){let t=this;this.post("/workattendance/workattendancedayanalysis",{command:"workattendance/workattendancedayanalysis",sessionid:$.cookie("sid"),loginid:$.cookie("uid"),systype:t.systype,deptid:t.singindept,yearmonth:t.currentmonth,stdtype:t.turnstatus}).done((e=>{e&&0==e.errcode?(t.rateOpinionData="",t.rateOpinionData=[{value:e.bean.signpercent,name:"签到"},{value:e.bean.leavepercent,name:"请假"},{value:e.bean.absencepercent,name:"缺勤"},{value:e.bean.latepercent,name:"迟到"},{value:e.bean.earlyretreatpercent,name:"早退"},{value:e.bean.otherpercent,name:"其他"}],t.$nextTick((function(){t.drawGraph("echarts-rate")}))):e.errdesc?t.toast(e.errdesc):t.toast("服务器错误，请联系管理员。")}))},drawGraph:function(t){var e=this;e.chart=u().init(document.getElementById(t)),this.chart.showLoading(),e.chart.setOption({title:{text:"考勤分析",x:"center"},tooltip:{trigger:"item",show:!1,formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{bottom:0,left:"center",data:e.rateOpinion,itemHeight:10,itemWidth:10,itemGap:6,textStyle:{fontSize:12}},series:[{type:"pie",center:["50%","50%"],radius:["35%","50%"],data:e.rateOpinionData,label:{normal:{formatter:"{b}：{d}%  "}},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}],color:["#c7f316","#38ce9b","#ebb600","#00b4f4","#f97a1c","#a550f5"]}),this.chart.hideLoading()},initline(){let t=this;this.post("/workattendance/querydeptmonthattendancestats",{command:"workattendance/querydeptmonthattendancestats",sessionid:$.cookie("sid"),loginid:$.cookie("uid"),systype:t.systype,deptid:t.singindept,monthcount:6,attendancetype:t.type,stdtype:t.turnstatus}).done((e=>{e&&0==e.errcode?(t.lineXdata=[],t.linedata=[],e.monthattendanceratelist.map((e=>{t.lineXdata.push(e.month),t.linedata.push(e.attendancerate)})),t.$nextTick((function(){t.drawLine("echarts-trend")}))):e.errdesc?t.toast(e.errdesc):t.toast("服务器错误，请联系管理员。")}))},drawLine:function(t){var e=this;e.chart=u().init(document.getElementById(t)),this.chart.showLoading(),e.chart.setOption({xAxis:{type:"category",data:e.lineXdata,axisLine:{lineStyle:{color:"#666"}},axisLabel:{rotate:30,interval:0}},yAxis:[{type:"value",axisLabel:{formatter:"{value}%"}}],series:[{data:e.linedata,type:"line",color:["#3499db"],itemStyle:{normal:{label:{show:!0,formatter:"{c}%"}}}}]}),this.chart.hideLoading()},selecttime(t){this.currentmonth=t,this.init()},typeselect(t){this.trendSelect=t.name,this.type=t.key,this.typeconfig.show=!1,this.initline()},back(){this.$router.push({name:"fdAttendance_history"})}}}),p=m,f=i(1001),y=(0,f.Z)(p,s,a,!1,null,"42665dc8",null),g=y.exports},18885:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMDZEMjI2MTNFRDcxMUU3OEZGRThFMDRFNjdCQUFGNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMDZEMjI2MjNFRDcxMUU3OEZGRThFMDRFNjdCQUFGNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMwNkQyMjVGM0VENzExRTc4RkZFOEUwNEU2N0JBQUY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMwNkQyMjYwM0VENzExRTc4RkZFOEUwNEU2N0JBQUY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ROy+jgAAAqhJREFUeNrsmE1IFVEUx8dXoAuzDw0i8hW5UMSNYGRBRC1ChAwKiVLBog+M2gQRilH2QW0qWokYBQoPWrSosIUEfpJBtWpVbUJbCQn2RHJR9r/xv4/D5c7oHcIZZA78uG/ePXfuf+bOPefM5NX0fPUc7A64BM6CZ56bHQe94BG4ttxBKcdJToB1oMFztwaObXIZtNY4zgN7wS6Qb/HfyLYSXHUUWCnOYRu7AN6Dt2AxJ0gs8Q6QAXu8aG0CnATf5BJvAsMxEOdRg9JSLAW2g+38/Rikudwmk/TJ+PQHkeHYSZ/+NDeRRy3tUuAxth/BOTDlc3XTbGdD3JmfxjlMU3OeBx+kJr1J0mxH5QNqsWZQD/pCCOwEX8DrAB819xioAaVS4Bqxk4LsMwljP8DDZfgtSE0pL+amw8xiXPXF/g6ameQdGIlY035Q6ydwWMefCO2uFBj7JU4E/u9NYpoquw4wVyqbAy/Ad8OvHBwWAf83eGUJ6tvAEVAoMscQyyxngadYOKQsVfU+8InHh8BLS/14m0XqII+rwDhYb/j9AWfAU9cl7vDpVxO0iePLPsVtPvu0XbCI0xo6wjyDm9l2W8otOdFWtgPCb8Dok2NkudVtzLW6NskvXnW1eIcosvjNsy0TfmVGn7Qi4Ve9VBUVJFDVho2M6rVG37iRfXaDCnDP8Bsyxqh3jQ0Wv5EwAi/yQVe7tID/zYAnoEf43QRbwFG+VirLgufglvBTY3aC03wH0qs0yLmcBU4zZi1lahlbSZCpcHKFJJkkySRJJkkySZJJVlsmyfLkJTHIJCUi5uY2iQ6UjQy6UVk5NeQ06Tv4ABzkplCfv/oZDlbqk4j+Ptgissx9KVDFrS5wnQ5tEUeXLh1LZRy8AerAGz6TK21Zzl1HLf/srwADAIqGr7nYD0lLAAAAAElFTkSuQmCC"}}]);
//# sourceMappingURL=6721.76f11596.js.map