"use strict";(self["webpackChunkapp"]=self["webpackChunkapp"]||[]).push([[3885],{24894:function(t,i,a){a.d(i,{Z:function(){return h}});var s=function(){var t=this,i=t._self._c;return i("div",{staticClass:"vue-uploader"},[t.sliderVisible?i("vue-slider",{attrs:{filelist:t.filelist,fdfsurl:t.fdfsurl,index:t.index},on:{getSlider:t.getSlider}}):t._e(),i("div",{staticClass:"upload"},[i("div",{staticClass:"imglist"},[t._l(t.filelist,(function(a,s){return i("div",{staticClass:"imgitem",on:{click:function(i){return t.deletepic(a.fileurl,s)}}},[i("img",{staticClass:"photos",attrs:{src:t.fdfsurl+a.fileurl}}),i("i",{directives:[{name:"show",rawName:"v-show",value:t.isupload,expression:"isupload"}],staticClass:"del",on:{click:function(i){return i.stopPropagation(),t.deleteitems(a.fileurl)}}})])})),i("div",{directives:[{name:"show",rawName:"v-show",value:t.isuploadflag&&t.isupload,expression:"isuploadflag&&isupload"}]},[i("div",[i("i",{staticClass:"icon",on:{click:function(i){return t.uploadimg(1)}}})])]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"pic",on:{click:function(i){t.nowurl=" ",t.show=!1}}},[i("img",{attrs:{src:t.fdfsurl+t.nowurl,alt:""}})])],2)])],1)},e=[],n=(a(70560),a(68934)),r=a(63822),l=function(){var t=this,i=t._self._c;return i("div",{ref:"canvas",attrs:{id:"canvas"},on:{click:t.cancelPic}},[i("ul",{attrs:{id:"outer"}},t._l(t.filelist,(function(a,s){return i("li",[i("img",{attrs:{src:t.fdfsurl+a.fileurl,alt:""}})])})),0)])},o=[],c={name:"vue_slide",props:{filelist:{type:Array,default(){return[]}},fdfsurl:{type:String,default:"http://"},sliderVisible:{type:Boolean,default:!1},index:{default:0}},data(){return{wrap:"",radio:"",scaleW:"",idx:0,isSlide:!1}},mounted(){this.slider()},components:{},watch:{filelist(t,i){console.log(t),this.filelist=t,this.slider()}},methods:{slider(t){this.init(),this.renderDom(),this.bindDOM()},cancelPic(){this.$emit("getSlider",!1)},init(){this.radio=window.innerHeight/window.innerWidth,this.scaleW=window.innerWidth,this.idx=0,this.canvas=document.getElementById("canvas"),this.outer=document.getElementById("outer");let t=this.filelist.length,i=this.outer.getElementsByTagName("li");for(let a=0;a<t;a++)i[a].style.width=window.innerWidth+"px",i[a].style.webkitTransform="translate3d("+a*this.scaleW+"px, 0, 0)",i[a].style.transform="translate3d("+a*this.scaleW+"px, 0, 0)",i[a].style.MozTransform="translate3d("+a*this.scaleW+"px, 0, 0)"},renderDom(){this.canvas=document.getElementById("canvas"),this.outer=document.getElementById("outer"),this.outer.style.width=window.innerWidth+"px",this.moveIndex(this.index)},moveIndex(t){let i=this;this.canvas=document.getElementById("canvas"),this.outer=document.getElementById("outer"),i.idx=t;let a=this.filelist.length,s=this.outer.getElementsByTagName("li");for(let e=0;e<a;e++)s[e]&&(s[e].style.webkitTransform="translate3d("+(e-i.idx)*i.scaleW+"px, 0, 0)"),s[e]&&(s[e].style.transform="translate3d("+(e-i.idx)*i.scaleW+"px, 0, 0)")},goIndex(t){let i,a=this.outer.getElementsByTagName("li"),s=a.length;"number"==typeof t?i=t:"string"==typeof t&&(i=this.idx+1*t),i>s-1?i=s-1:i<0&&(i=0),this.idx=i,a[i].style.webkitTransition="-webkit-transform 0.2s ease-out",a[i-1]&&(a[i-1].style.webkitTransition="-webkit-transform 0.2s ease-out"),a[i+1]&&(a[i+1].style.webkitTransition="-webkit-transform 0.2s ease-out"),a[i].style.transition="-webkit-transform 0.2s ease-out",a[i-1]&&(a[i-1].style.transition="-webkit-transform 0.2s ease-out"),a[i+1]&&(a[i+1].style.transition="-webkit-transform 0.2s ease-out"),a[i].style.webkitTransform="translate3d(0,0,0)",a[i-1]&&(a[i-1].style.webkitTransform="translate3d(-"+this.scaleW+"px,0,0)"),a[i+1]&&(a[i+1].style.webkitTransform="translate3d(+"+this.scaleW+"px,0,0)"),a[i].style.transform="translate3d(0,0,0)",a[i-1]&&(a[i-1].style.transform="translate3d(-"+this.scaleW+"px,0,0)"),a[i+1]&&(a[i+1].style.transform="translate3d(+"+this.scaleW+"px,0,0)")},bindDOM(){let t=this,i=function(i){t.startTime=1*new Date,t.startX=i.touches[0].pageX,t.offsetX=0;let a=i.target;while("LI"!=a.nodeName&&"BODY"!=a.nodeName)a=a.parentNode;t.target=a},a=function(i){t.isSlide=!0,t.offsetX=i.targetTouches[0].pageX-t.startX;let a=t.outer.getElementsByTagName("li"),s=t.idx-1,e=s+3;for(s;s<e;s++)a[s]&&(a[s].style.webkitTransition="-webkit-transform 0s ease-out"),a[s]&&(a[s].style.transition="-webkit-transform 0s ease-out"),a[s]&&(a[s].style.webkitTransform="translate3d("+((s-t.idx)*t.scaleW+t.offsetX)+"px, 0, 0)"),a[s]&&(a[s].style.transform="translate3d("+((s-t.idx)*t.scaleW+t.offsetX)+"px, 0, 0)")},s=function(i){let a=t.scaleW/6,s=1*new Date;t.outer.getElementsByTagName("li");s-t.startTime>300?t.offsetX>=a?t.goIndex("-1"):t.offsetX<0&&t.offsetX<-a?t.goIndex("1"):t.goIndex("0"):t.offsetX>50?t.goIndex("-1"):t.offsetX<-50?t.goIndex("+1"):t.goIndex("0")};this.outer.addEventListener("touchstart",i),this.outer.addEventListener("touchmove",a),this.outer.addEventListener("touchend",s)}}},d=c,u=a(1001),p=(0,u.Z)(d,l,o,!1,null,"44d41fc3",null),m=p.exports,f={name:"vue-upload",props:{fdfsurl:{type:String,default:"http://"},isupload:{type:Boolean,default:!0},imgList:{type:Array,default(){return[]}},imgMax:{type:Number,default:5}},data(){return{size:0,filelist:this.imgList,show:!1,nowurl:"",isuploadflag:!0,uploadflag:1,picShow:!1,sliderVisible:!1,index:""}},components:{vueSlider:m},created(){navigator.userAgent.toLowerCase();console.log(this.fdfsurl,this.imgList)},methods:{...n.Z,...(0,r.nv)(["showAlert","showConfirm","showLoading","hideLoading","toast"]),getSlider(t){this.sliderVisible=t},handClick(){alert(1)},callback(){},uploadimg(t){this.filelist.length>this.imgMax-1?this.toast("图片不能超过"+this.imgMax+"张"):1==this.uploadflag&&(1==t?this.invokeNative("TakeAndUploadPhoto",{imgMax:this.imgMax,currentImg:this.filelist.length},this.geturl):this.invokeNative("TakeAndUploadPhoto",{imgMax:this.imgMax,currentImg:this.filelist.length},this.geturlcase))},imgLength(){this.filelist.length>this.imgMax&&(this.isuploadflag=!1)},deleteitems(t){let i=this;this.showConfirm({title:"温馨提示",msg:"您是否要删除当前上传的图片？",theme:"modal-confirm modal-white",cancel:function(){},ok:function(){i.filelist&&i.filelist.map(((a,s)=>{a.fileurl==t&&(i.filelist.splice(s,1),i.imgLength())}))}})},deletepic(t,i){this.nowurl=t,this.sliderVisible=!0,this.index=i},geturl(t){let i=this,a=JSON.parse(t);a.data instanceof Array?a.data.forEach((t=>{i.filelist.push({fileurl:t.uri})})):i.filelist.push({fileurl:a.data.uri}),console.log(i.filelist,"-----")}},mounted(){this.imgLength()},watch:{show(t,i){t?$(".__panel").css({height:"100%"}):$(".__panel").css({height:"auto"})},imgList(t,i){this.filelist=this.imgList},fdfsurl(t,i){this.fdfsurl=t}}},v=f,g=(0,u.Z)(v,s,e,!1,null,"3c9a0a4e",null),h=g.exports},53885:function(t,i,a){a.r(i),a.d(i,{default:function(){return v}});var s=function(){var t=this,i=t._self._c;return i("div",{staticClass:"g-wrapper"},[i("c-header",[i("div",{attrs:{slot:"headerLeft"},slot:"headerLeft"},[i("a",{staticClass:"header-back-btn",on:{click:function(i){return t.back()}}},[i("img",{attrs:{src:a(88579)}})])]),t._v(" 第一年个人综合考评表 "),i("div",{class:{noclick:t.issubmit},staticStyle:{"font-size":"0.3rem"},attrs:{slot:"headerRight"},on:{click:function(i){return i.stopPropagation(),t.submit.apply(null,arguments)}},slot:"headerRight"},[t._v("编辑")])]),i("div",{staticClass:"performance_Evaluation_Wrap"},[i("h3",{staticClass:"base"},[t._v("个人基本信息")]),i("div",{staticClass:"baseContent"},[i("ul",{staticClass:"Ul"},[i("li",[i("label",{attrs:{for:""}},[t._v("姓 名：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.name)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("学号：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.username)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("专业基地：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.basename)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("学员类型：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.typename)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("导师：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.tutorname)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("学位性质：")]),i("span",[t._v(t._s(t.stuData.turndoctorinfobean.degreetypename))])]),i("li",[i("label",{attrs:{for:""}},[t._v("最高学历：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.educationalname)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("最高学位：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.degreename)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("本科毕业时间：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.bachelorgraduate)}})]),i("li"),i("li",[i("label",{attrs:{for:""}},[t._v("硕士毕业时间：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.mastergraduate)}})]),i("li",[i("label",{attrs:{for:""}},[t._v("博士毕业时间：")]),i("span",{domProps:{innerHTML:t._s(t.stuData.turndoctorinfobean.doctorgraduate)}})])])]),i("div",{staticClass:"bgLIne"}),i("div",{staticClass:"training_Situation"},[i("h3",{staticClass:"base"},[t._v("培训情况")]),i("div",{staticClass:"trainingItem"},[t._m(0),i("div",{staticClass:"num"},[i("p",[t._v("参加教学查房（次数）")]),i("p",[t._v(t._s(t.stuData.turndoctortraininfobean.teachingrounds))])])]),i("div",{staticClass:"trainingItem"},[t._m(1),i("div",{staticClass:"num"},[i("p",[t._v("参加病例讨论（次数）")]),i("p",[t._v(t._s(t.stuData.turndoctortraininfobean.lecturecasediscussioncount))])])]),i("div",{staticClass:"trainingItem"},[t._m(2),i("div",{staticClass:"num"},[i("p",[t._v("参加小讲课（次数）")]),i("p",[t._v(t._s(t.stuData.turndoctortraininfobean.lecturecount))])])]),i("div",{staticClass:"trainingItem"},[t._m(3),i("div",{staticClass:"num"},[i("p",[t._v("主讲病例讨论（次数）")]),i("p",[t._v(t._s(t.stuData.turndoctortraininfobean.lecturecasediscussioncount))])])]),i("div",{staticClass:"trainingItem"},[t._m(4),i("div",{staticClass:"num"},[i("p",[t._v("综合评价（科主任、护士长、带教老师、轮科医师、实习生等反馈，分为优、良、中、差）")]),i("p",[t._v(t._s(t.stuData.turndoctortraininfobean.comprehensiveevaluate?t.stuData.turndoctortraininfobean.comprehensiveevaluate:"未评论"))])])]),i("div",{staticClass:"trainingItem"},[t._m(5),i("div",{staticClass:"num"},[i("p",[t._v("护培生师培训专设讲座出勤率是否合格（要求100%）")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.speciallectureflag,expression:"speciallectureflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:1,checked:t._q(t.speciallectureflag,1)},on:{change:function(i){t.speciallectureflag=1}}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.speciallectureflag,expression:"speciallectureflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:0,checked:t._q(t.speciallectureflag,0)},on:{change:function(i){t.speciallectureflag=0}}}),i("label",{attrs:{for:""}},[t._v("否")])])])])])]),i("div",{staticClass:"inspect_Situation training_Situation"},[i("h3",{staticClass:"base"},[t._v("考核情况")]),i("div",{staticClass:"trainingItem"},[t._m(6),i("div",{staticClass:"num"},[i("p",[t._v("病历书写专项考核成绩")]),i("p",[t._v(t._s(t.stuData.turndoctorassessmentbean.basewritescore))])])]),i("div",{staticClass:"trainingItem"},[t._m(7),i("div",{staticClass:"num"},[i("p",[t._v("第一年中期考核成绩")]),i("p",[t._v(t._s(t.stuData.turndoctorassessmentbean.theoryscore))])])])]),i("div",{staticClass:"submissions training_Situation"},[i("h3",{staticClass:"base"},[t._v("以下内容需要学员填写")]),i("div",{staticClass:"trainingItem training_Situation_Item"},[t._m(8),i("div",{staticClass:"num"},[i("p",[t._v("矿工天数")]),i("p",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.absenteeismdays,expression:"absenteeismdays"}],staticClass:"commonText minersText",attrs:{type:"number"},domProps:{value:t.absenteeismdays},on:{input:function(i){i.target.composing||(t.absenteeismdays=i.target.value)}}})])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[t._m(9),i("div",{staticClass:"num"},[i("p",[t._v("医疗事故（要求“无”）")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.malpracticeflag,expression:"malpracticeflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:1,checked:t._q(t.malpracticeflag,1)},on:{change:function(i){t.malpracticeflag=1}}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.malpracticeflag,expression:"malpracticeflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:0,checked:t._q(t.malpracticeflag,0)},on:{change:function(i){t.malpracticeflag=0}}}),i("label",{attrs:{for:""}},[t._v("否")])])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[t._m(10),i("div",{staticClass:"num"},[i("p",[t._v("医疗纠纷和投诉（次数）")]),i("p",[i("input",{directives:[{name:"model",rawName:"v-model",value:t.medicaldisputescounts,expression:"medicaldisputescounts"}],staticClass:"minersText",attrs:{type:"number"},domProps:{value:t.medicaldisputescounts},on:{input:function(i){i.target.composing||(t.medicaldisputescounts=i.target.value)}}})])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[t._m(11),i("div",{staticClass:"num"},[i("p",[t._v("管理病人数、病种数、临床操作是否达到要求？")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.clinicaloperationflag,expression:"clinicaloperationflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:1,checked:t._q(t.clinicaloperationflag,1)},on:{change:function(i){t.clinicaloperationflag=1}}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.clinicaloperationflag,expression:"clinicaloperationflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:0,checked:t._q(t.clinicaloperationflag,0)},on:{change:function(i){t.clinicaloperationflag=0}}}),i("label",{attrs:{for:""}},[t._v("否")])])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[i("div",{staticClass:"trainingName publish"},[i("div",{staticClass:"num statistical"},[t._m(12),t._m(13),t._m(14),t._m(15),t._m(16),i("div",[i("p",[i("vue-uploader",{ref:"add_picture1",staticClass:"add_picture"})],1)])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[i("div",{staticClass:"trainingName publish statistical"},[i("div",{staticClass:"num statistical"},[t._m(17),t._m(18),t._m(19),t._m(20),t._m(21),t._m(22),i("div",[i("p",[i("vue-uploader",{ref:"add_picture2",staticClass:"add_picture"})],1)])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[i("div",{staticClass:"trainingName publish statistical"},[t._m(23),i("div",{staticClass:"num publish statistical"},[i("p"),t._m(24),t._m(25),t._m(26),t._m(27),t._m(28),i("div",[i("p",[i("vue-uploader",{ref:"add_picture3",staticClass:"add_picture"})],1)])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[i("div",{staticClass:"trainingName publish statistical"},[t._m(29),i("div",{staticClass:"num publish statistical"},[i("p"),t._m(30),t._m(31),t._m(32),t._m(33),t._m(34),i("div",[i("p",[i("vue-uploader",{ref:"add_picture4",staticClass:"add_picture"})],1)])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[i("div",{staticClass:"trainingName"},[i("div",{staticClass:"num publish"},[t._m(35),i("div",[i("p",[i("vue-uploader",{ref:"add_picture5",staticClass:"add_picture"})],1)])])])]),i("div",{staticClass:"trainingItem training_Situation_Item"},[t._m(36),i("div",{staticClass:"num"},[i("p",[t._v("执业医师通过情况")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.practitionerflag,expression:"practitionerflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:1,checked:t._q(t.practitionerflag,1)},on:{change:function(i){t.practitionerflag=1}}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.practitionerflag,expression:"practitionerflag"}],staticClass:"radio",attrs:{type:"radio"},domProps:{value:0,checked:t._q(t.practitionerflag,0)},on:{change:function(i){t.practitionerflag=0}}}),i("label",{attrs:{for:""}},[t._v("否")])])]),i("div",{staticClass:"certificateNumber",class:{ngActive:1===t.practitionerflag}},[i("label",{attrs:{for:""}},[t._v("医师资格证书号:")]),i("input",{directives:[{name:"model",rawName:"v-model",value:t.practitionercode,expression:"practitionercode"}],staticClass:"certificateNumberText",attrs:{type:"text"},domProps:{value:t.practitionercode},on:{input:function(i){i.target.composing||(t.practitionercode=i.target.value)}}})])])]),i("div",{staticClass:"identification"},[i("h3",{staticClass:"base"},[t._v("自我鉴定")]),i("div",{staticClass:"trainingItem identificationText"},[i("div",{staticClass:"num"},[i("p",[t._v("请填写关于政治思想、遵纪守法、医德医风、工作成绩：")]),i("div",{staticClass:"info"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:t.stdcontent,expression:"stdcontent"}],attrs:{maxlength:"500",name:"",id:"",cols:"30",rows:"10"},domProps:{value:t.stdcontent},on:{input:function(i){i.target.composing||(t.stdcontent=i.target.value)}}})])])])]),t._m(37),t._m(38)])])],1)},e=[function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("1：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("2：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("3：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("4：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("5：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("6：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("7：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("8：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("9：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("10：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("11：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("12：")])])},function(){var t=this,i=t._self._c;return i("p",[i("label",{attrs:{for:""}},[t._v("13：")]),t._v("发表相关论文数：全年统计源期刊篇， SCI篇（限第一作者，上传杂志封面、目录及全文照片。）")])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("SCI：")]),i("input",{staticClass:"sciText",attrs:{type:"number",detailtype:"1"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("统计源核心：")]),i("input",{staticClass:"sciText",attrs:{type:"number",name:"source_Core",detailtype:"2"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("其他（学术/非学术均可）：")]),i("input",{staticClass:"sciText",attrs:{type:"number",name:"other_Academic",detailtype:"3"}})])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"info"},[i("textarea",{staticClass:"academic_Text",attrs:{name:"academic_Text"}})])},function(){var t=this,i=t._self._c;return i("p",[i("label",{attrs:{for:""}},[t._v("14：")]),t._v("主持相关课题数量（前3者）：上传课题批准文件照片")])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("国家级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("省级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("校级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("院级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"info"},[i("textarea")])},function(){var t=this,i=t._self._c;return i("p",[i("label",{attrs:{for:""}},[t._v("15：参与相关课题数量（前3者）：上传课题批准文件照片")])])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("国家级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("省级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("校级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("院级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"info"},[i("textarea")])},function(){var t=this,i=t._self._c;return i("p",[i("label",{attrs:{for:""}},[t._v("16：所获奖励")])])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("国家级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("省级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("校级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",[i("span",[t._v("院级：")]),i("input",{staticClass:"sciText",attrs:{type:"number"}})])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"info"},[i("textarea")])},function(){var t=this,i=t._self._c;return i("p",[i("label",{attrs:{for:""}},[t._v("17：")]),t._v(":惩罚情况")])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"trainingName"},[i("label",{attrs:{for:""}},[t._v("17：")])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"identification"},[i("div",{staticClass:"base"},[i("span",[t._v("专业基地鉴定 ")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{staticClass:"radio",attrs:{type:"radio",name:"radio"}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{staticClass:"radio",attrs:{type:"radio",name:"radio"}}),i("label",{attrs:{for:""}},[t._v("否")])])])]),i("div",{staticClass:"trainingItem identificationText"},[i("div",{staticClass:"num"},[i("div",{staticClass:"info"},[i("textarea",{attrs:{maxlength:"500",name:"",id:"",cols:"30",rows:"10",placeholder:"可填写相关鉴定说明"}})])])])])},function(){var t=this,i=t._self._c;return i("div",{staticClass:"identification"},[i("div",{staticClass:"base"},[i("span",[t._v(" 教学办公室/护培办公室 ")]),i("div",{staticClass:"fillWrap"},[i("p",{staticClass:"yes"},[i("input",{staticClass:"radio",attrs:{type:"radio",name:"radio"}}),i("label",{attrs:{for:""}},[t._v("是")])]),i("p",{staticClass:"none"},[i("input",{staticClass:"radio",attrs:{type:"radio",name:"radio"}}),i("label",{attrs:{for:""}},[t._v("否")])])])]),i("div",{staticClass:"trainingItem identificationText"},[i("div",{staticClass:"num"},[i("div",{staticClass:"info"},[i("textarea",{attrs:{maxlength:"500",name:"",id:"",cols:"30",rows:"10",placeholder:"可填写相关鉴定说明"}})])])])])}],n=(a(70560),a(77387)),r=a.n(n),l=a(68934),o=a(22760),c=a(63822),d=a(24894),u={name:"",components:{cHeader:o.Z,vueUploader:d.Z},data(){return{title:"",filelist:[],isupload:!0,speciallectureflag:"",absenteeismdays:"",malpracticeflag:"",medicaldisputescounts:"",clinicaloperationflag:"",stdcontent:"",practitionercode:null,practitionerflag:"",id:"",issubmit:!1,uploadlist:[],uploaddescplist:[],stuData:{turndoctorinfobean:{},turndoctortraininfobean:{},turndoctorassessmentbean:{}}}},filters:{sexFilter:function(t){return 0==t?"男":1==t?"女":void 0},stdstatusFilter(t){return 0==t?"未完成":5==t?"已提交":void 0},basestatusFilter(t){return 0==t?"未完成":5==t?"不通过 ":10==t?"通过":void 0}},methods:{...l.Z,...(0,c.nv)(["showAlert","showConfirm","showLoading","hideLoading","toast"]),setStatistical(t){let i=document.getElementsByClassName("statistical");this.uploaddescplist=[];for(let a=0;a<i.length;a++){let s=i[a].getElementsByTagName("input");for(let i=0;i<s.length;i++){s[i].setAttribute("type",a+1),s[i].setAttribute("detailtype",i+1),s[i].setAttribute("value","");let e=s[i].getAttribute("type"),n=s[i].getAttribute("detailtype");for(let a=0;a<t.length;a++)e==t[a]["type"]&&n==t[a]["detailtype"]&&s[i].setAttribute("value",t[a].content)}}},getStatistical(){let t=document.getElementsByClassName("statistical");this.uploaddescplist=[];for(let i=0;i<t.length;i++){let a=t[i].getElementsByTagName("input");for(let t=0;t<a.length;t++)this.uploaddescplist.push({tpeuid:this.id,type:i+1,detailtype:t+1,content:a[t].value})}this.uploaddescplist=this.uploaddescplist.filter(((t,i,a)=>""!==t.content))},getPictureUrl(){this.uploadlist=[];let t=document.getElementsByClassName("add_picture");for(let i=0;i<t.length;i++){let t=this.$refs["add_picture"+(i+1)].filelist;for(let a=0;a<t.length;a++)this.uploadlist.push({tpeuid:this.id,type:i,fileurl:t[a]})}this.uploadlist=this.uploadlist.filter(((t,i,a)=>""!=t.fileurl))},submit(){this.getStatistical();let t=this;""===t.speciallectureflag?t.toast("请选择护培生师培训专设讲座出勤率"):""===t.absenteeismdays?t.toast("请填写旷工天数"):""===t.malpracticeflag?t.toast("请选择是否有医疗事故"):""===t.medicaldisputescounts?t.toast("请填写医疗纠纷和投诉次数"):""===t.clinicaloperationflag?t.toast("请选择管理病人数、病种数、临床操作是否达到要求"):""===t.practitionerflag?t.toast("请选择职业医师通过情况"):1===t.practitionerflag&&""===t.practitionercode?t.toast("请填写职业医师资格证号"):""===t.stdcontent?t.toast("请填写自我鉴定"):(t.issubmit=!0,t.post("/turnedoctormain/stdpersonalevaluatesub",{command:"turnedoctormain/stdpersonalevaluatesub",sessionid:r().cookie("sid"),loginid:r().cookie("uid"),absenteeismdays:t.absenteeismdays,id:t.id,speciallectureflag:t.speciallectureflag,absenteeismdays:t.absenteeismdays,malpracticeflag:t.malpracticeflag,medicaldisputescounts:t.medicaldisputescounts,clinicaloperationflag:t.clinicaloperationflag,practitionerflag:t.practitionerflag,uploaddescplist:this.uploaddescplist.length>0?this.uploaddescplist:null,practitionercode:t.practitionercode,stdcontent:t.stdcontent}).done((function(i){t.issubmit=!1,"0"==i.errcode?t.$route.query.message:t.toast(i.errdesc)})).fail((function(i){t.issubmit=!1,t.noContent=!0})))},init(){let t=this;this.post("/turnedoctormain/getuserpersonalevaluateinfo",{command:"turnedoctormain/getuserpersonalevaluateinfo",sessionid:r().cookie("sid"),loginid:r().cookie("uid"),stdid:r().cookie("uid"),yearflag:this.$route.query.yearflag}).done((i=>{t.id=i.result.turndoctorassessmentbean.id,console.log(t.id),t.stuData.turndoctorinfobean=i.result.turndoctorinfobean,t.stuData.turndoctortraininfobean=i.result.turndoctortraininfobean,t.stuData.turndoctorassessmentbean=i.result.turndoctorassessmentbean}))},back(){let t=this;t.showConfirm({title:"提醒",msg:"你当前评价尚未提交保存，是否确认返回？",theme:"modal-confirm modal-white",ok:function(){window.history.back()},cancel:function(){}})}},mounted(){this.init();let t=JSON.parse(localStorage.getItem("uploadList"));this.setStatistical(t)}},p=u,m=a(1001),f=(0,m.Z)(p,s,e,!1,null,"15496e40",null),v=f.exports},22760:function(t,i,a){a.d(i,{Z:function(){return u}});var s=function(){var t=this,i=t._self._c;return i("div",{staticClass:"header",attrs:{id:"header"}},[t._t("headerLeft",(function(){return[i("a",{staticClass:"header-back-btn",on:{click:function(i){return t.back()}}},[i("img",{attrs:{src:a(88579)}})])]})),i("div",{staticClass:"header-center-blank"}),i("div",{staticClass:"header-center"},[t._t("default",(function(){return[t._v(t._s(t.title))]}))],2),t._t("headerRight")],2)},e=[],n=(a(77387),a(68934)),r=a(63822),l={props:["title"],data(){return{}},created(){},mounted(){},computed:(0,r.rn)(["loginUser"]),methods:{...(0,r.nv)(["showAlert","showLoading","hideLoading","toast"]),...n.Z,back(){this.$router.go(-1)}}},o=l,c=a(1001),d=(0,c.Z)(o,s,e,!1,null,null,null),u=d.exports},88579:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAiCAYAAABfqvm9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzcxQUNDRDA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzcxQUNDRTA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI3NzFBQ0NCMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI3NzFBQ0NDMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XL81twAAAT5JREFUeNpi+P//PwOFmBGIK4D4AhCHUGoYMxDP+Y8AlygxjBOIN/5HBXnkGiYIxIeRDPoDxGkgOXIMkwbiy0iGfQfiQJg8qYZpAfEjJMPeA7E9shpSDLME4rdIhj0DYj10dcQa5gPEX5EMuw7E8tjUEmNYAhD/RjLsBBAL41JPyLByIP6HZNg2IObGpweXBBMQ96OlsUVAzErIR9gE2YB4BZphPdAsxkCqgbxAvAfJIJB3i0lJWsgccSA+g2TYTyCOJjXhwxhKQHwbybDPQOxGTrYEEQZA/BzJsFdAbEpuoQEi7iEZdh+I1Sgp0pgYGMCYeoAWXqZ6pOBLNlGUGIgrYRdQYiCurNdJbtajSeFAk+KLZgUsTaoAXJXUEyDWocRAbNXoOyC2ocRAqlf0NGmK0KSxRJPmHNYGJ0CAAQCI5DhjJbDsxgAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=3885.4f6104ea.js.map