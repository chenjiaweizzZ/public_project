"use strict";(self["webpackChunkapp"]=self["webpackChunkapp"]||[]).push([[3929],{85965:function(t,e,i){i.d(e,{Z:function(){return l}});var s=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],staticClass:"addcontent"},[e("i",{staticClass:"shade",on:{click:t.close}}),e("ul",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],staticClass:"select",staticStyle:{"animation-duration":".1s"},style:{top:t.config.fixedtop,right:t.config.fixedright},attrs:{"enter-active-class":"animated fadeInDown","leave-active-class":"animated fadeOutUp"}},t._l(t.list,(function(i,s){return 1==i.isused?e("li",{on:{click:function(e){return t.select(i)}}},[t._v(" "+t._s(i.name)+" ")]):t._e()})),0)])},n=[],a={name:"addselect",props:{showAdd:{type:Boolean,default:!1},config:{default:function(){return{show:!1,label:"",fixedright:0,fixedtop:0}}},dataList:{type:Array,default:function(){return[]}}},data(){return{addButton:!1}},mounted:function(){this.addButton=this.showAdd},methods:{close(){this.config.show=!1},select(t){this.$emit("confirm",t)}},watch:{showAdd(t,e){this.addButton=t}},computed:{list(){let t=this.config.label||"";return this.dataList.length>0?(this.stopclick=!1,this.dataList.map((e=>{e.name=e[t],e.isused="fdAction_add"==e.router?this.addButton:e.isused})),this.dataList):(this.stopclick=!0,[{name:"当前暂无数据"}])}}},o=a,r=i(1001),c=(0,r.Z)(o,s,n,!1,null,"04a28040",null),l=c.exports},62266:function(t,e,i){i.d(e,{Z:function(){return l}});var s=function(){var t=this,e=t._self._c;return e("transition",{attrs:{"enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.config.show,expression:"config.show"}],attrs:{id:"picker"}},[e("div",{attrs:{id:"picker-main"}},[e("header",[e("span",{on:{click:t.cancle}},[t._v("取消")]),e("span",{class:{noclick:t.isdisabled},on:{click:t.sure}},[t._v("确定")])]),e("section",[e("div",{staticClass:"on"}),e("ul",{style:t.style,on:{touchstart:function(e){return e.preventDefault(),t.start.apply(null,arguments)},touchmove:function(e){return e.preventDefault(),t.move.apply(null,arguments)},touchend:function(e){return e.preventDefault(),t.end.apply(null,arguments)}}},t._l(t.list,(function(i,s){return e("li",{domProps:{innerHTML:t._s(i.txt)}})})),0)])])])])},n=[],a=(i(70560),{name:"picker",props:{config:{default:function(){return{show:!1,mainlist:{type:Array,default:[]},defaultVal:[String,Number],valueKey:{type:[Function,String],default:"name"}}}}},data(){return{isdisabled:!1,activeItem:0,itemLength:0,activeItemValue:0,curVal:"",style:{},Y:0,t:.1,touchStartTime:0,touchEndTime:0,eY:45,sY:90,itemHeight:45}},watch:{"config.mainlist":function(t,e){t!==e&&(this.activeItem=0,this.Y=0,this.eY=45,this.sY=90,this.style={transform:"translate3d(0px, "+this.sY+"px, 0px)",transition:"all ease "+this.t+"s"})}},filters:{},computed:{list(){let t=[],e=typeof this.config.valueKey;return 0==this.config.mainlist.length?(this.isdisabled=!0,this.config.mainlist=[{name:"暂无数据"}],this.config.mainlist.map((t=>{t.txt=t.name}))):(this.isdisabled=!1,this.config.mainlist.map((i=>{if("string"===e)i.txt=i[this.config.valueKey],t.push(i);else if("function"===e){let e=this.config.valueKey(i);i.txt=e,t.push(i)}}))),this.curVal=t[this.activeItem],this.itemLength=t.length,t}},mounted(){this.config.defaultVal?this.moveTo():this.style={transform:"translate3d(0px, "+this.sY+"px, 0px)",transition:"all ease "+this.t+"s"}},methods:{moveTo(t){this.list.map(((e,i)=>{e==(t||this.config.defaultVal)&&(this.activeItem=i,this.activeItemValue=e)})),this.Y=45*this.activeItem,this.eY=45*this.activeItem,this.style={transform:"translate3d(0px, "+this.Y+"px, 0px)",transition:"all ease "+this.t+"s"}},start(t){this.sY=t.touches[0].clientY,this.touchStartTime=t.timeStamp},move(t){this.Y=this.eY+t.touches[0].clientY-this.sY,this.t=.1,this.style={transform:"translate3d(0, "+this.Y+"px, 0)",transition:"all ease "+this.t+"s"}},end(t){let e=90,i=-45*(this.itemLength-1)+e;if(this.eY=this.Y,this.touchEndTime=t.timeStamp-this.touchStartTime,this.t=.1,this.sY==t.changedTouches[0].clientY)return;Math.abs(this.eY%45)<=22.5?this.eY=45*parseInt(this.eY/45):this.eY>0?this.eY=45*parseInt(this.eY/45)+45:this.eY=45*parseInt(this.eY/45)-45,this.eY>e&&(this.Y=0,this.eY=90,this.activeItem=0),this.eY<=i&&(this.Y=i,this.eY=i,this.activeItem=this.itemLength-1),this.style={transform:"translate3d(0, "+this.eY+"px, 0)",transition:"all ease "+this.t+"s"};let s=Math.abs((this.eY-e)/45);this.activeItem=Math.round(s),this.curVal=this.list[this.activeItem],this.$emit("changeCurVal",this.type,this.curVal)},cancle(){this.config.show=!1},sure(){this.$emit("confirm",this.curVal)}}}),o=a,r=i(1001),c=(0,r.Z)(o,s,n,!1,null,"e3fc68ee",null),l=c.exports},63929:function(t,e,i){i.r(e),i.d(e,{default:function(){return p}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"g-wrapper"},[e("c-header",[e("div",{attrs:{slot:"headerLeft"},slot:"headerLeft"},[e("a",{staticClass:"header-back-btn",on:{click:function(e){return t.back()}}},[e("img",{attrs:{src:i(88579)}})])]),t._v(" 查看历史 "),e("div",{attrs:{slot:"headerRight"},slot:"headerRight"},[e("router-link",{staticClass:"right-icon",attrs:{to:{name:"fdAttendance_analysis"}}},[e("img",{attrs:{src:i(13892)}})])],1)]),e("div",{staticClass:"header-date",on:{click:function(e){t.timeconfig.show=!0}}},[e("span",[t._v(t._s(t.yearmonth))]),e("span",[t._v("日期")])]),e("div",{staticClass:"g-main"},[e("ul",{directives:[{name:"show",rawName:"v-show",value:!t.noContent,expression:"!noContent"}]},[e("li",{staticClass:"date-flag"},[e("span",[t._v(t._s(t._f("substr")(t.yearmonth,0,4))+"年"+t._s(t._f("substr")(t.yearmonth,5,2))+"月")]),e("span",[t._v("平均签到率"+t._s(t._f("rate")(t.list.averagerate)))])]),t._m(0),t._l(t.list.list,(function(i,s){return e("li",{on:{click:function(e){return t.todetail(i.workdate)}}},[e("span",[t._v(t._s(t._f("substr")(i.workdate,0,4))+"年"+t._s(t._f("substr")(i.workdate,5,2))+"月"+t._s(t._f("substr")(i.workdate,8,2))+"日")]),e("span",{staticClass:"choice"},[t._v(t._s(t._f("rate")(i.signpercent)))])])}))],2)]),e("add-group",{attrs:{config:t.timeconfig,"data-list":t.timelist},on:{confirm:t.timeselect}}),t.noContent?e("no-content"):t._e()],1)},n=[function(){var t=this,e=t._self._c;return e("li",[e("span",[t._v("日期")]),e("span",{staticStyle:{"padding-right":".4rem"}},[t._v("签到率")])])}],a=(i(70560),i(68934)),o=i(63822),r=i(22760),c=i(62266),l=i(85965),h=i(84622),d={props:["active"],data(){return{yearmonth:"",averagerate:"",list:[],timeconfig:{show:!1,label:"name",fixedtop:"1.5rem",fixedright:".1rem"},timelist:[],noContent:!1}},components:{cPicker:c.Z,addGroup:l.Z,noContent:h.Z,cHeader:r.Z},watch:{},filters:{rate:function(t){return Number(t).toFixed(2)+"%"}},computed:{...(0,o.rn)(["turninfo","systype","singindept","turnstatus"])},created(){let t=(new Date).getFullYear(),e=(new Date).getMonth()+1,i=e<10?"0"+e:e,s=((new Date).getDate(),["01","02","03","04","05","06","07","08","09","10","11","12"]);this.yearmonth=this.turninfo.signindata?this.turninfo.signindata:t+"-"+i,""==this.turninfo.signindata&&this.setTurninfo({k:"signindata",v:this.yearmonth});for(let n=0;n<e;n++)this.timelist.push({name:t+"年"+s[n]+"月",value:t+"-"+s[n],isused:1})},mounted(){let t=this;this.init(),this.registerToNative("goBack",(function(e){t.back()}))},methods:{...a.Z,...(0,o.nv)(["showAlert","showConfirm","showLoading","hideLoading","toast","setTurninfo"]),init(){let t=this;this.post("/workattendance/getworkattendancedaysign",{command:"workattendance/getworkattendancedaysign",sessionid:$.cookie("sid"),loginid:$.cookie("uid"),systype:this.systype,deptid:this.singindept,yearmonth:this.yearmonth,stdtype:t.turnstatus}).done((e=>{e&&e.errcode?0==e.errcode?(t.list=e.result,t.timeconfig.show=!1,0==t.list.list.length?t.noContent=!t.noContent:t.noContent=!1):t.toast(e.errdesc):t.toast("系统错误，请联系管理员~")}))},timeselect(t){this.yearmonth=t.value,this.setTurninfo({k:"signindata",v:t.value}),this.init()},todetail(t){this.setTurninfo({k:"workdate",v:t}),this.$router.push({name:"fdAttendance_history_detail"})},toAnalysis(){},back(){this.setTurninfo({k:"signindata",v:""}),this.$router.push({name:"fdAttendance_main",query:{systype:this.systype,menutype:this.turnstatus}})}}},u=d,m=i(1001),f=(0,m.Z)(u,s,n,!1,null,"0266de0b",null),p=f.exports},22760:function(t,e,i){i.d(e,{Z:function(){return d}});var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"header",attrs:{id:"header"}},[t._t("headerLeft",(function(){return[e("a",{staticClass:"header-back-btn",on:{click:function(e){return t.back()}}},[e("img",{attrs:{src:i(88579)}})])]})),e("div",{staticClass:"header-center-blank"}),e("div",{staticClass:"header-center"},[t._t("default",(function(){return[t._v(t._s(t.title))]}))],2),t._t("headerRight")],2)},n=[],a=(i(77387),i(68934)),o=i(63822),r={props:["title"],data(){return{}},created(){},mounted(){},computed:(0,o.rn)(["loginUser"]),methods:{...(0,o.nv)(["showAlert","showLoading","hideLoading","toast"]),...a.Z,back(){this.$router.go(-1)}}},c=r,l=i(1001),h=(0,l.Z)(c,s,n,!1,null,null,null),d=h.exports},84622:function(t,e,i){i.d(e,{Z:function(){return l}});var s=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"no_content"}},[e("img",{attrs:{src:i(10745),alt:""}}),e("span",{domProps:{textContent:t._s(t.txtdescription||"当前没有内容哦~")}})])},n=[],a={props:["txtdescription"]},o=a,r=i(1001),c=(0,r.Z)(o,s,n,!1,null,null,null),l=c.exports},13892:function(t,e,i){t.exports=i.p+"static/img/analysis.a0fd67e0.png"},10745:function(t,e,i){t.exports=i.p+"static/img/icon-renwu.b85b73a3.png"},88579:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAiCAYAAABfqvm9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzcxQUNDRDA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzcxQUNDRTA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI3NzFBQ0NCMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI3NzFBQ0NDMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XL81twAAAT5JREFUeNpi+P//PwOFmBGIK4D4AhCHUGoYMxDP+Y8AlygxjBOIN/5HBXnkGiYIxIeRDPoDxGkgOXIMkwbiy0iGfQfiQJg8qYZpAfEjJMPeA7E9shpSDLME4rdIhj0DYj10dcQa5gPEX5EMuw7E8tjUEmNYAhD/RjLsBBAL41JPyLByIP6HZNg2IObGpweXBBMQ96OlsUVAzErIR9gE2YB4BZphPdAsxkCqgbxAvAfJIJB3i0lJWsgccSA+g2TYTyCOJjXhwxhKQHwbybDPQOxGTrYEEQZA/BzJsFdAbEpuoQEi7iEZdh+I1Sgp0pgYGMCYeoAWXqZ6pOBLNlGUGIgrYRdQYiCurNdJbtajSeFAk+KLZgUsTaoAXJXUEyDWocRAbNXoOyC2ocRAqlf0NGmK0KSxRJPmHNYGJ0CAAQCI5DhjJbDsxgAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=3929.10411112.js.map