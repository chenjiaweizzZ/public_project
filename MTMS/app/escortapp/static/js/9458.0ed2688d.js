"use strict";(self["webpackChunkapp"]=self["webpackChunkapp"]||[]).push([[9458],{22760:function(e,t,i){i.d(t,{Z:function(){return r}});var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"header",attrs:{id:"header"}},[e._t("headerLeft",(function(){return[t("a",{staticClass:"header-back-btn",on:{click:function(t){return e.back()}}},[t("img",{attrs:{src:i(88579)}})])]})),t("div",{staticClass:"header-center-blank"}),t("div",{staticClass:"header-center"},[e._t("default",(function(){return[e._v(e._s(e.title))]}))],2),e._t("headerRight")],2)},c=[],a=(i(77387),i(68934)),n=i(63822),l={props:["title"],data(){return{}},created(){},mounted(){},computed:(0,n.rn)(["loginUser"]),methods:{...(0,n.nv)(["showAlert","showLoading","hideLoading","toast"]),...a.Z,back(){this.$router.go(-1)}}},o=l,h=i(1001),d=(0,h.Z)(o,s,c,!1,null,null,null),r=d.exports},49458:function(e,t,i){i.r(t),i.d(t,{default:function(){return m}});var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"g-wrapper"},[t("c-header",[t("div",{attrs:{slot:"headerLeft"},slot:"headerLeft"},[t("a",{staticClass:"header-back-btn",on:{click:function(t){return e.back()}}},[t("img",{attrs:{src:i(88579)}})])]),e._v("轮转手册审核历史 "),t("div",{attrs:{slot:"headerRight"},slot:"headerRight"},[e.allCheckFlag?e._e():t("button",{staticStyle:{"font-size":"0.3rem"},on:{click:e.handleCancel}},[e._v("取消")])])]),t("div",{staticClass:"search-box"},[t("form",{attrs:{action:"/"}},[t("van-search",{attrs:{placeholder:"请输入学员姓名模糊查询","show-action":"",shape:"round"},on:{cancel:e.onCancel,search:e.onSearch},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}},[t("div",{attrs:{slot:"action"},on:{click:e.onSearch},slot:"action"},[e._v("搜索")])])],1)]),t("div",{staticClass:"g-main container"},[t("van-tabs",{staticClass:"reset-style",on:{click:e.onClick}},[t("van-tab",{attrs:{title:"审核通过"}},[t("van-pull-refresh",{on:{refresh:function(t){return e.onRefresh(0)}},model:{value:e.list[0].isLoading,callback:function(t){e.$set(e.list[0],"isLoading",t)},expression:"list[0].isLoading"}},[t("van-list",{attrs:{"loading-text":e.text,"finished-text":"没有更多了",finished:e.list[0].finished,offset:10},on:{load:function(t){return e.onLoad(0)}},model:{value:e.list[0].loading,callback:function(t){e.$set(e.list[0],"loading",t)},expression:"list[0].loading"}},[t("ul",e._l(e.list[0].items,(function(i,s){return t("li",{key:s},[t("div",{class:[e.allCheckFlag?"checked-left-box":"check-left-box"]},[t("input",{directives:[{name:"model",rawName:"v-model",value:i.checked,expression:"item.checked"}],attrs:{type:"checkbox",id:"checkbox"},domProps:{checked:Array.isArray(i.checked)?e._i(i.checked,null)>-1:i.checked},on:{change:[function(t){var s=i.checked,c=t.target,a=!!c.checked;if(Array.isArray(s)){var n=null,l=e._i(s,n);c.checked?l<0&&e.$set(i,"checked",s.concat([n])):l>-1&&e.$set(i,"checked",s.slice(0,l).concat(s.slice(l+1)))}else e.$set(i,"checked",a)},function(t){return t.stopPropagation(),e.selectIt(i.checked,s)}]}})]),t("div",{class:[e.allCheckFlag?"checked-right-box":"check-right-box","check-box"],on:{click:function(t){return t.preventDefault(),e.choose(i)}}},[t("div",{staticClass:"check-title"},[e._v(e._s(i.userinfo[0].turnManualName))]),t("div",{staticClass:"check-content"},e._l(i.iteminfo,(function(i,s){return t("div",[3==i.type?[t("span",{staticClass:"lableTxt"},[e._v(e._s(i.writeInfo)+":")]),0==i.content?t("span",{staticClass:"contentTxt"},[e._v("否")]):e._e(),1==i.content?t("span",{staticClass:"contentTxt"},[e._v("是")]):e._e()]:[t("span",{staticClass:"lableTxt"},[e._v(e._s(i.writeInfo)+":")]),t("span",{staticClass:"contentTxt"},[e._v(e._s(i.content))])]],2)})),0),t("div",{staticClass:"check-footer"},[t("span",[e._v(e._s(i.userinfo[0].stdInfo))]),t("span",[e._v(e._s(i.userinfo[0].createTime))])])])])})),0)])],1)],1),t("van-tab",{attrs:{title:"审核不通过"}},[t("van-pull-refresh",{on:{refresh:function(t){return e.onRefresh(1)}},model:{value:e.list[1].isLoading,callback:function(t){e.$set(e.list[1],"isLoading",t)},expression:"list[1].isLoading"}},[t("van-list",{attrs:{"loading-text":e.text,"finished-text":"没有更多了",finished:e.list[1].finished,offset:10},on:{load:function(t){return e.onLoad(1)}},model:{value:e.list[1].loading,callback:function(t){e.$set(e.list[1],"loading",t)},expression:"list[1].loading"}},[t("ul",e._l(e.list[1].items,(function(i,s){return t("li",{key:s},[t("div",{class:[e.allCheckFlag?"checked-left-box":"check-left-box"]},[t("input",{directives:[{name:"model",rawName:"v-model",value:i.checked,expression:"item.checked"}],attrs:{type:"checkbox",id:"checkbox"},domProps:{checked:Array.isArray(i.checked)?e._i(i.checked,null)>-1:i.checked},on:{change:[function(t){var s=i.checked,c=t.target,a=!!c.checked;if(Array.isArray(s)){var n=null,l=e._i(s,n);c.checked?l<0&&e.$set(i,"checked",s.concat([n])):l>-1&&e.$set(i,"checked",s.slice(0,l).concat(s.slice(l+1)))}else e.$set(i,"checked",a)},function(t){return t.stopPropagation(),e.selectIt(i.checked,s)}]}})]),t("div",{class:[e.allCheckFlag?"checked-right-box":"check-right-box","check-box"],on:{click:function(t){return t.preventDefault(),e.choose(i)}}},[t("div",{staticClass:"check-title"},[e._v(e._s(i.userinfo[0].turnManualName))]),t("div",{staticClass:"check-content"},e._l(i.iteminfo,(function(i,s){return t("div",[3==i.type?[t("span",{staticClass:"lableTxt"},[e._v(e._s(i.writeInfo)+":")]),0==i.content?t("span",{staticClass:"contentTxt"},[e._v("否")]):e._e(),1==i.content?t("span",{staticClass:"contentTxt"},[e._v("是")]):e._e()]:[t("span",{staticClass:"lableTxt"},[e._v(e._s(i.writeInfo)+":")]),t("span",{staticClass:"contentTxt"},[e._v(e._s(i.content))])]],2)})),0),t("div",{staticClass:"check-footer"},[t("span",[e._v(e._s(i.userinfo[0].stdInfo))]),t("span",[e._v(e._s(i.userinfo[0].createTime))])])])])})),0)])],1)],1)],1)],1),t("div",{staticClass:"footer-box"},[e.isChecked?t("div",{staticClass:"operation-box"},[t("div",{staticClass:"footer-left-box"},[e.checkAll?t("van-checkbox",{on:{click:e.allCheck},model:{value:e.allChecked,callback:function(t){e.allChecked=t},expression:"allChecked"}},[e._v("全选")]):t("van-checkbox",{on:{click:e.allNoCheck},model:{value:e.allChecked,callback:function(t){e.allChecked=t},expression:"allChecked"}},[e._v("取消全选")])],1),t("div",{staticClass:"footer-right-box"},[t("van-button",{attrs:{square:"",type:"primary"},on:{click:e.cancel}},[e._v("撤销")])],1)]):t("div",{staticClass:"all-check-box"},[t("van-button",{attrs:{square:"",type:"primary"},on:{click:e.batchCheck}},[e._v("批量撤销")])],1)])],1)},c=[],a=(i(70560),i(77387)),n=i.n(a),l=i(68934),o=i(63822),h=i(22760),d=i(71038),r={data(){return{text:"加载中",searchValue:"",isload:!1,isLoad:!1,pagenum:1,pagesize:10,tabIndex:0,check:"1",list:[{isLoading:!1,loading:!1,items:[],finished:!1},{isLoading:!1,loading:!1,items:[],finished:!1}],allCheckFlag:!0,allChecked:!1,isChecked:!1,checkAll:!0,curIdList:[],validateList:[]}},components:{cHeader:h.Z},computed:{},methods:{...l.Z,...(0,o.nv)(["showAlert","showConfirm","showLoading","hideLoading","toast"]),selectIt(e,t){let i=this.list[this.tabIndex];this.validateList=[],e&&(this.validateList.push({id:i.items[t].iteminfo[0].id,createTime:i.items[t].userinfo[0].createTime}),d.Z.validateCheck(this.validateList).then((e=>{})).catch((e=>{this.$nextTick((()=>{i.items[t].checked=!1})),this.$toast("当前审核项已过审核时间")})))},allCheck(){this.allCheckFlag=!1,this.checkAll=!1;let e=this.list[this.tabIndex];this.validateList=[],e.items.forEach((e=>{e.checked=!0,this.validateList.push({id:e.iteminfo[0].id,createTime:e.userinfo[0].createTime})})),d.Z.validateCheck(this.validateList).then((e=>{})).catch((t=>{t.forEach((t=>{this.$nextTick((()=>{e.items.forEach(((e,i)=>{e.iteminfo[0].id==t&&(e.checked=!1)}))}))})),this.$forceUpdate(),this.$toast("时间已过的审核项已去除勾选")}))},allNoCheck(){this.curIdList=[],this.validateList=[],this.checkAll=!0;let e=this.list[this.tabIndex];e.items.forEach((e=>{e.checked=!1}))},cancel(){let e=this.list[this.tabIndex];this.curIdList=[],this.validateList=[],e.items.forEach((e=>{e.checked&&(this.curIdList.push(e.iteminfo[0].id),this.validateList.push({id:e.iteminfo[0].id,createTime:e.userinfo[0].createTime}))})),this.curIdList.length>0?this.showConfirm({title:"温馨提示",msg:"是否确认撤销该审核记录？",theme:"modal-confirm modal-white",cancel:function(){},ok:()=>{this.checkCase()}}):this.$toast("请至少选择一项")},checkCase(){this.post("/turnManual/turnManualCheck",{command:"turnManual/turnManualCheck",sessionid:n().cookie("sid"),loginid:n().cookie("uid"),uid:n().cookie("uid"),checksuggestion:"",checkType:0,list:this.curIdList}).done((e=>{e&&0==e.errcode&&(this.allChecked=!1,this.checkAll=!0,this.$toast("撤销成功"),this.onSearch())}))},handleCancel(){this.allCheckFlag=!0,this.isChecked=!1,this.checkAll=!0,this.allChecked=!1;let e=this.list[this.tabIndex];e.items.forEach((e=>{e.checked=!1}))},batchCheck(){this.isChecked=!0,this.allCheckFlag=!1},onSearch(){var e=this.list[this.tabIndex];this.pagenum=1,this.queryCheckList().then((t=>{e.items=[],this.pagenum++,e.finished=!1;let i=[];for(let e in t.list)i.push(t.list[e]);e.items=i,e.finished=!0}))},onCancel(){this.searchValue="",this.onSearch()},onClick(e){this.isload=!1;const t=this.list[e];this.pagenum=1,t.isLoading=!1,t.finished=!1,0==e&&(this.tabIndex=0,this.check=1),1==e&&(this.tabIndex=1,this.check=2)},queryCheckList(){return new Promise(((e,t)=>{this.post("/turnManual/turnManualCheckList",{command:"turnManual/turnManualCheckList",sessionid:n().cookie("sid"),loginid:n().cookie("uid"),uid:n().cookie("uid"),check:this.check,isdisplay:1,serchInfo:this.searchValue,pagenum:this.pagenum,pagesize:this.pagesize}).done((t=>{t&&0==t.errcode&&e(t)})).fail((e=>{t(e)}))}))},onRefresh(e){const t=this.list[e];this.pagenum=1,t.isLoading=!0,this.queryCheckList().then((e=>{if(t.items=[],this.pagenum++,t.finished=!1,t.isLoading){t.isLoading=!1;let i=[];for(let t in e.list)i.push(e.list[t]);t.items=i,t.finished=!0}}))},onLoad(e){this.isload||(this.isload=!0,this.queryCheckList().then((t=>{this.pagenum++;let i=this.list[e];i.items=[];for(let e in t.list)i.items.push(t.list[e]);i.loading=!1,console.log(i.items.length),console.log(i.items.length),console.log(this.list),(i.items.length>t.count||i.items.length==t.count)&&(i.finished=!0)})))},choose(e){this.$router.push({name:"checkTeaDetail",query:{id:e.iteminfo[0].id,name:e.userinfo[0].turnManualName,check:this.check,createTime:e.userinfo[0].createTime}})},back(){this.$router.go(-1)}},mounted(){let e=this;this.registerToNative("goBack",(function(t){e.back()}))}},u=r,k=i(1001),f=(0,k.Z)(u,s,c,!1,null,"744398c1",null),m=f.exports},71038:function(e,t,i){i(70560);var s=i(77387),c=i.n(s),a=i(68934);const n={validateCheck(e){return new Promise(((t,i)=>{a.Z.post("/turnManual/validateCheck",{command:"turnManual/validateCheck",sessionid:c().cookie("sid"),loginid:c().cookie("uid"),beanList:e}).done((e=>{if(e&&0==e.errcode)if(e.itemList.length>0){let t=[];e.itemList.map(((e,i)=>{let s=Object.keys(e);t.push(s[0])})),i(t)}else t(e)}))}))}};t.Z=n},88579:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAiCAYAAABfqvm9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzcxQUNDRDA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzcxQUNDRTA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI3NzFBQ0NCMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI3NzFBQ0NDMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XL81twAAAT5JREFUeNpi+P//PwOFmBGIK4D4AhCHUGoYMxDP+Y8AlygxjBOIN/5HBXnkGiYIxIeRDPoDxGkgOXIMkwbiy0iGfQfiQJg8qYZpAfEjJMPeA7E9shpSDLME4rdIhj0DYj10dcQa5gPEX5EMuw7E8tjUEmNYAhD/RjLsBBAL41JPyLByIP6HZNg2IObGpweXBBMQ96OlsUVAzErIR9gE2YB4BZphPdAsxkCqgbxAvAfJIJB3i0lJWsgccSA+g2TYTyCOJjXhwxhKQHwbybDPQOxGTrYEEQZA/BzJsFdAbEpuoQEi7iEZdh+I1Sgp0pgYGMCYeoAWXqZ6pOBLNlGUGIgrYRdQYiCurNdJbtajSeFAk+KLZgUsTaoAXJXUEyDWocRAbNXoOyC2ocRAqlf0NGmK0KSxRJPmHNYGJ0CAAQCI5DhjJbDsxgAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=9458.0ed2688d.js.map