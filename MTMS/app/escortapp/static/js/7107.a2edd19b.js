"use strict";(self["webpackChunkapp"]=self["webpackChunkapp"]||[]).push([[7107],{40361:function(t,e,s){s.d(e,{Z:function(){return o}});var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"progress",style:{height:t.strokeWidth+"px"}},[e("div",{staticClass:"progress-bar",style:{width:t.percentage+"%",height:t.strokeWidth+"px"}}),e("span",{staticClass:"progress-text",style:{left:(t.percentage>86?86:t.percentage)+"%",height:t.strokeWidth+"px",lineHeight:t.strokeWidth+"px"}},[t._v(t._s(t.percentage)+"%")])])},i=[],r={props:{percentage:{type:Number,default:0},strokeWidth:{type:Number,default:12}},data(){return{}},mounted(){},methods:{}},n=r,u=s(1001),A=(0,u.Z)(n,a,i,!1,null,"c192c8a2",null),o=A.exports},22760:function(t,e,s){s.d(e,{Z:function(){return c}});var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"header",attrs:{id:"header"}},[t._t("headerLeft",(function(){return[e("a",{staticClass:"header-back-btn",on:{click:function(e){return t.back()}}},[e("img",{attrs:{src:s(88579)}})])]})),e("div",{staticClass:"header-center-blank"}),e("div",{staticClass:"header-center"},[t._t("default",(function(){return[t._v(t._s(t.title))]}))],2),t._t("headerRight")],2)},i=[],r=(s(77387),s(68934)),n=s(63822),u={props:["title"],data(){return{}},created(){},mounted(){},computed:(0,n.rn)(["loginUser"]),methods:{...(0,n.nv)(["showAlert","showLoading","hideLoading","toast"]),...r.Z,back(){this.$router.go(-1)}}},A=u,o=s(1001),d=(0,o.Z)(A,a,i,!1,null,null,null),c=d.exports},47107:function(t,e,s){s.r(e),s.d(e,{default:function(){return p}});var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"g-wrapper"},[e("c-header",[e("div",{attrs:{slot:"headerLeft"},slot:"headerLeft"},[e("a",{staticClass:"header-back-btn",on:{click:function(e){return t.back()}}},[e("img",{attrs:{src:s(88579)}})])]),t._v(" "+t._s(t.title)+" "),0==t.isInter?e("div",{attrs:{slot:"headerRight"},slot:"headerRight"},[e("button",{staticStyle:{"font-size":"0.3rem"},on:{click:t.addCase}},[t._v("添加")])]):t._e()]),e("div",{staticClass:"g-main"},[e("div",{staticClass:"case-content-box"},t._l(t.caseList,(function(a,i){return e("div",{key:a.baseId,staticClass:"case-box",on:{click:function(e){return t.goDetailList(a)}}},[e("div",{staticClass:"case-name"},[t._v(t._s(a.content))]),e("div",{staticClass:"case-detail"},[e("div",{staticClass:"case-item"},[e("img",{attrs:{src:s(65924)}}),e("span",[t._v("要求例数")]),e("span",[t._v(t._s(a.count))])]),e("div",{staticClass:"case-item"},[e("img",{attrs:{src:s(44424)}}),e("span",[t._v("已审核例数")]),e("span",[t._v(t._s(a.alreadyCheck))])]),e("div",{staticClass:"case-item"},[e("img",{attrs:{src:s(44424)}}),e("span",[t._v("待审核例数")]),e("span",[t._v(t._s(a.waiteCheck))])])]),e("div",{staticClass:"progress-box"},[e("div",{staticClass:"progress-title"},[t._v(" 完成率 "),e("span",[t._v(t._s(a.finishRate)+"%")])]),e("cProgress",{attrs:{percentage:a.finishRate,strokeWidth:t.progeressWidth}})],1)])})),0)])],1)},i=[],r=(s(70560),s(77387)),n=s.n(r),u=s(68934),A=s(63822),o=s(22760),d=s(40361),c={data(){return{title:"",caseList:[],progeressWidth:18,isInter:this.$route.query.user}},components:{cHeader:o.Z,cProgress:d.Z},computed:{...(0,A.rn)(["turninfo","turnManual"])},methods:{...u.Z,...(0,A.nv)(["setTurnManual"]),queryAllCase(){this.post("/turnManual/queryTurnManualDiseaseStdDetail",{command:"turnManual/queryTurnManualDiseaseStdDetail",sessionid:n().cookie("sid"),loginid:n().cookie("uid"),turnTrainId:this.turnManual.turnTrainId,turnId:this.turnManual.turnId,deptId:this.turnManual.deptId,stdId:this.turnManual.stdId,stage:this.turnManual.stage,type:this.$route.query.type,turnManualId:this.$route.query.id}).done((t=>{t&&0==t.errcode&&(this.isLoading=!1,t.list.map((t=>t.finishRate=parseInt(t.finishRate))),this.caseList=t.list)})).fail((t=>{}))},goDetailList(t){let e=this;this.setTurnManual({k:"caseDetailName",v:t.content}),localStorage.setItem("caseDetail",JSON.stringify(t)),1==this.$route.query.isStu?this.$router.push({name:"checkTeaList",query:{id:t.turnManualId,type:t.type,isStu:this.isStu,baseId:t.baseId,businessid:e.$route.query.businessid,user:e.$route.query.user}}):this.$router.push({name:"caseDetailList",query:{id:e.$route.query.id,type:e.$route.query.type,validate:e.$route.query.validate,caseId:t.baseId,businessid:e.$route.query.businessid,user:e.$route.query.user}})},addCase(){let t=this;1==t.$route.query.validate?t.$router.push({name:"createCaseInfo",query:{id:t.$route.query.id,type:t.$route.query.type,name:t.title,businessid:t.$route.query.businessid}}):this.$toast("您已不在当前科室轮转")},back(){let t=this;2==t.$route.query.user?this.$router.push({name:"fdRotation_doctor_exam_director",query:{booking:0,id:t.$route.query.businessid,type:t.$route.query.type,where:t.$route.query.where,case:2}}):t.$router.push({name:"fdRotation_doctor_exam",query:{type:t.turninfo.type,id:t.turninfo.plandetailid,case:2}})}},mounted(){let t=this;t.title=this.turnManual.caseName,t.queryAllCase(),t.registerToNative("goBack",(function(e){t.back()}))}},l=c,h=s(1001),g=(0,h.Z)(l,a,i,!1,null,"6cb7835c",null),p=g.exports},65924:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFBElEQVR4Xu2bXWgcVRTH/2dyZxJrrVFqi9vMYmzSzGLARKiIeVBRqD4JBSU+Wj/AJ+uDUvGDUhUVii0+iVJ8UwqiQgU/8KGi9kGkaaF2JyaYOtPExiJN00ST+Toyibs7aWv3TtLZvZC5T9mZc8/Hb849986dG8Iqb7TK40cOIM+AJhFgQLc7DEtoCLscb4QAvxmuNHQIMKDZRf0pYjzDwG1EJOKgmTkgwgkG3rMc/wMCokbBaBiAsVvQNh8an4Lw0BWDY3zZ2uJt7zyFuUZAaBgA2zQ+B+FhmaCY8VnJ9bbLyK5UpiEAhk1jkAkfL3GWOQRwEvEwYN4CopbkfWIM9rjewZUGWK9/QwDYReM3AJ1VZxiHhOc92TWJP+NrowWYgTC+AWAlHB6zHO/WegGs9H7mAH7dpPdFLTRUcZQZI6Hr9fYCXtJ5twM3zpAxRIRi5TqF3Ncz7h9faZBX6p85ANvUd4DoQA1A9HzJDfZezim7Q7wATXu7lim8w3L9D5UDUC6Iu0nQVgbdEDunIZrrcYK3KunsC+OJmtM8QKAHEkEdZCL7ckERcwlEj1Zhgb8F6MfKbz3wDnRNwI1/l4viRUBrjf+mCKP6rHdo8zmcTwsrdQaUTf0dInpuqSGethz/+viaXRQDgPZDWkdk5DmIBkoTwZEFAKZ+gYjWJkDPMXhPyQnelNFVHWZphMum8RgRPrq0jwoAFr1KO3ukyoByUT9KoH6VATB4qOT4d8g+WGkA8dp92NTnQKTVChpGwfhE06Lz/18DZF2pL3dJDYi0dUR4BITNiRoT9bh+m+y7hTSA0Y3YELQak7UChd/Df7ze3rOYqe96dhInbsJacY3+PUB9FSstnreh+wzOylhdNgBw9KrlBq/JGMlaxjbFSyDt9cYCAD9rOf67WQcno98u6jsB2pcD+I9AY4ZAngH5EMhrwMVFcLhDvzMi7ARQkCleaWUIGBehv6vyPlDpr0wRLBf1MwTamDawlPKnLMer7S0svH8oMAtMFLBmWhizKYNZhjjPt2p+e3LPUAkAcSS2KV4BaXuWEZVUFwb+AHh3yfHfT3ZQBoBUFBkI5QBUqAEZPFhplXkG5BmgwDQona8ZCCozBMpF/WmAdhNwcwZxAowJRvR4yQ3ijyjVpgSAhS2zon4BoIWt6qwaM/9tuX57cstLGQC2qU8R0Zqsgo/1MnjScvxNBMTfFheaEgBiR8qm2EagXYzMjt5MaIz9Paf9n5QbAlk+9Xq6lcmAeo5mdT8HkC+E8oWQOtvi5Q5xr4hnq4xa9+ngu4tVK1MDyqZ+mIjuySj2RbXMhy3Xv0/JadAuGpk9+WTAluMt+aSnTAbYpn4MRLdnnAHHLdevfghVaiU41o72uXVGvC2eWWub9vZ3TmFKySGQWdR1FCszBHIATSKQZ0C+FG7GUpjxhuV6Lzcp65eYtU19H4iqs08mBySGC1jPwqgePIp3ZgTo/m7H+6WZEE6aRq9GfASg6yp+cOitL43jLxm/pA9JLe746DNEdG3VEHMA4GcA8zLGMpBpJWBr8qh9vGdYcv2qj/VspgJgm8ZXIGyrp7Sp9xlfW673oKwPqQCMFPT+UNBRWeXNkNNC7t8y7h+TtZ0KwOK6Wwww014iukvWSCPkmHkWFA2WnPCLNPZSA6goj//Lw9dE7YhqGqtXWVZjOqeN+3b3MmrRsgFc5Riapi4H0DT0ihhe9RnwL2DzZW60M7wXAAAAAElFTkSuQmCC"},88579:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAiCAYAAABfqvm9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzcxQUNDRDA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzcxQUNDRTA2RTQxMUU3OUMwRERCODQ1NkU4NTc5NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI3NzFBQ0NCMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI3NzFBQ0NDMDZFNDExRTc5QzBEREI4NDU2RTg1Nzk1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XL81twAAAT5JREFUeNpi+P//PwOFmBGIK4D4AhCHUGoYMxDP+Y8AlygxjBOIN/5HBXnkGiYIxIeRDPoDxGkgOXIMkwbiy0iGfQfiQJg8qYZpAfEjJMPeA7E9shpSDLME4rdIhj0DYj10dcQa5gPEX5EMuw7E8tjUEmNYAhD/RjLsBBAL41JPyLByIP6HZNg2IObGpweXBBMQ96OlsUVAzErIR9gE2YB4BZphPdAsxkCqgbxAvAfJIJB3i0lJWsgccSA+g2TYTyCOJjXhwxhKQHwbybDPQOxGTrYEEQZA/BzJsFdAbEpuoQEi7iEZdh+I1Sgp0pgYGMCYeoAWXqZ6pOBLNlGUGIgrYRdQYiCurNdJbtajSeFAk+KLZgUsTaoAXJXUEyDWocRAbNXoOyC2ocRAqlf0NGmK0KSxRJPmHNYGJ0CAAQCI5DhjJbDsxgAAAABJRU5ErkJggg=="},44424:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE9ElEQVR4Xu2bW2gcZRTH/2d200tM250ljXiFpDtDxYCJUBHzoKJQfRIKhvjYeqnZKTV9UCpeCFVRQWwRZteopW9KQVSooBYfKmofRJoWVOrOkCjFalqc2TRJTTa7c2SS7GYTa/LNJrMzkJm3mT3fufzmnO823xLW+EVrPH5EAKIMCIrAADfIhaHt1OCULEoZ2EvTQbhS3xLoZ0neajwJQi8YtxNR3A2amYsAfgLwrn1ZeR/95NQLRv0AHBveIP9T/ISAh5cKjoEv7I3xXdjdOlkPCHUDIOvGZ0R4RCgo5k8tTd0lJLtCoboAkLNmDzF/VO0rAyUwfiFwnIlUAmILYmHqsbTU8RXGt2zz+gDQc0NE1Fr2hhknpiV6Yrw3dcl9ltTNWwDnJIi2z8vwsK2pbctGsEIB3wEk9FyHRDRY5adhNU+1o7u9UO375g8uJGOFyUECbi0/d6RYR/7ptnMrjHHJ5v4DyBp7JMbRihdMz1pa6q1reSXrueeI6M0KAPCefFo9FjoASd28x4GzQwLJM8MYMGlryhvz6cyPV5wm7gLowUpqA8eJcf5aQTFwGxG653/jr8H0/fw9HbW01AX3Xs4YzxNj/Yx9gomYdMLeu23UKyzPGZDUjbdBOLCww8IVS1O2zDiWNbuI+TuvjgjJM3VZWur0LOjcGIiaqtpNMnDITiuvC+maE/IEQNZzjxHRh/8xwKEAMOuWx9HDG4CMcYaAzjADYGDQTit3imaBOAB37l40J4kgVeqZYQL4GMDo//YBop4IyS3sA8DYDMKjBGyr8smx46kNomsLYQBNWbNlHfNIlaHfbWxph9YyLuS7X0L6pSYZ+W+JqKNsolBEy/h+5bKIyZoBOMwv5zX1FREjfsvIuvkCEb9aXwDEz+R71Xf8Dk5EfyJj9EnA4QjAHIH6lECUAVEJRH3A4k5wc3borphT7APRjSKdVw0yfxDTwfJ6oNw+NJ1gUjf+AuH6GgITbsLg3+y0WtlbcBuGA8DAxcZkaWJCOJIaBZkxZTfGE9V7huEA4L4JPfeSRHSoxtgEmvGfDKnfTqfeqxYODQCBCHwRiQBEM8FoKhytBaLFUBhWg3LGfIrg9AN0gy/dPfPFEmj3qKacDN8wOLtlNkY0u1Xt43XViqUS1Vte4RgGB7ghWTLzABp9DN79CDFibU3dhG4qhW8tkDV2MuMg4NPRG7cEpPiRK71tP4SvBHx97UsrD0cJRACCIxBlQLQWCNFaIJE17gO7X8z9ufJp5ZvFmkNTAnLGOEXAvf6EPquVgVN2Wrk/lMNgMmP49uarA7bSyoJPeiHKgNxZAt3hbwbwOTutVj6EurZCAyBxeDghrSv2+QnAKcSP5A+0ulPuyhUaAH4GvpTuCEA0DwjRPCCIMohKIIgSYObXbE19MYg3vthmMmO4p0Mqo48vByQ2Dfza3FCS5g8eMUbAeMDap/wcJAQ5a7YTO6cB2lT2Y9rZ2Dy27+a/RfwSPiTlKkvquXEQXVdW7P7Tg4h+ZGBKxNhqyxCwnoEdi47aX7XSSsXH5Wx6A5AxvgSwczmlAf/+lZVWHhL1wROARNbolBhnRJUHIecwd+Y19ayobU8AXKVzh6Hd4+53ixqpixzzBEvosXvVz73Y8wygrNz9l4cjceWIqhejqy5LMTtfKJ3HfsVzX1QzgFUPIiCFEYCAwIfG7JrPgH8B2RTZbnwz7MwAAAAASUVORK5CYII="}}]);
//# sourceMappingURL=7107.a2edd19b.js.map