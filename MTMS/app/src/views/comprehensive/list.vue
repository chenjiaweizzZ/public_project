<template>
    <div class="g-wrapper">
      <c-header>
          <div slot="headerLeft">
              <a @click="back()" class="header-back-btn">
                  <img src="../../assets/images/icon_fanhui.png"/>
              </a>
          </div>
          个人综合考评
        </c-header>
        <div class="performance_List">
            <div class="performance_List_Item"  v-for="(item ,index) in stuData.beanlist">
                <p>第{{item.yearflag == 1 ? "一":"二"}}年个人综合考评</p>
                <div class="process" @click='evaluation_Detail(item,index+1)'>
                    <div class="student">
                        <!--stdstatus 0 3属于未完成 5 完成-->
                        <img src="../../assets/images/cheak1.png" alt="" v-if="item.stdstatus!=5">
                        <img src="../../assets/images/p_ok.png" alt="" v-else>
                        <div class="role">学员</div>
                    </div>
                    <div class="lineBg"></div>
                    <!--0 未完成  5不通过 10通过-->
                    <div class="student">
                        <img src="../../assets/images/cheak1.png" alt="">
                        <!--<span class="jdjb_status" v-if="item.basestatus==0"></span>-->
                        <span class="jdjb_status btg_active" v-if="item.basestatus==5"></span>
                        <span class="jdjb_status tg_active" v-if="item.basestatus==10"></span>
                        <div class="role">基地</div>
                    </div>
                    <div class="lineBg"></div>
                    <div class="student">
                        <img src="../../assets/images/cheak1.png" alt="">
                        <!--<span class="jdjb_status" v-if="item.teachofficestatus==0"></span>-->
                        <span class="jdjb_status btg_active" v-if="item.teachofficestatus==5"></span>
                        <span class="jdjb_status tg_active" v-if="item.teachofficestatus==10"></span>
                        <div class="role">护培办</div>
                    </div>
                    <div class="guide"><img src="../../assets/images/bnt_xiangyou.png" alt=""></div>
                </div>
                <div class="sureSubmit" >
                       <span v-if="item.stdstatus==3" @click="submitCheck(item.id)">确认提交</span>
                       <!--基地状态		0：未完成	5：不通过	10：通过-->
                       <span v-if="item.basestatus==0&&item.stdstatus==5" @click="undo(item.id)">撤回</span>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import $ from 'jquery'
    import methods from '@/methods';
    import cHeader from '../header';
    import {mapState,mapActions} from 'vuex';
    export default {
        name: 'performance_list',
        components: {
            cHeader
        },
        data(){
            return{
                title:'',
                stuData:''
            }
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            //撤回
            undo(id){
                let self=this;
                 this.post('/turnedoctormain/stdpersonalevabackstatus', {
                    command: 'turnedoctormain/stdpersonalevabackstatus',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:id,
                    status:3
                }).done(data => {
                    console.log(data)
                    if (data.errcode == '0') {
                        self.toast("撤回成功");
                        this.init();

                    } else {
                        self.toast(data.errdesc);
                    }
                });
            },
            submitCheck(id){
                let self=this;
                this.post('/turnedoctormain/stdpersonalevastatussub', {
                    command: 'turnedoctormain/stdpersonalevastatussub',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:id,
                    type:1,
                    status:5
                }).done(data => {
                    if (data.errcode == '0') {
                        self.toast("提交成功");
                        self.init();
                    } else {
                        self.toast(data.errdesc)
                    }
                });
            },
            init(){
                let self = this;
                this.post('/turnedoctormain/getuserpersonalevaluatestd',{
                    command:'turnedoctormain/getuserpersonalevaluatestd',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stdid: $.cookie('uid'),
                    stdid: $.cookie('uid'),
                    requestflag: 1
                }).done( res => {
                   self.stuData=res.result;
                });
            },
            // 返回按钮
            back() {
            //    window.location.href='/pages/futuredoctorapp/todo.html?view=application';
            window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
    //         if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
            },
            evaluation_Detail(item,index){
                  this.$router.push({
                    //   path: "/comprehensive/evaluation",
                    name: "performance_evaluation",
                      query: {
                          id:item.id,
                          yearflag: item.yearflag,
                          stdstatus:item.stdstatus

                      }
                  });

            }
        },
        mounted(){
            let self=this;
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        }

    }

</script>
<style lang="scss" scoped>
     @import '../../scss/mixin.scss';
     .performance_List{
         height:100%;
         background:$bgColor;
         color:$wordColor;
         overflow-y:scroll;
         .performance_List_Item{
             position: relative;
             height:2rem;
             background:#fff;
             justify-content:center;
             font-size:0.22rem;
             padding-top:0.15rem;
             margin-bottom:0.15rem;
             .sureSubmit{
                 span{
                     width: 1.12rem;
                     height: 0.4rem;
                     border: 1px solid red;
                     text-align: center;
                     margin-top: 0.32rem;
                     line-height: 0.4rem;
                     font-size: 0.2rem;
                     color: $activeColor;
                     border: 1px solid $activeColor;
                     margin-left: 0.3rem;
                     @include sexy-radius(0.05rem);
                 }

             }
             p{
                 text-align: center;
             }
             .process{
                 padding-left:0.4rem;
                 @include sexy-flex();
                 margin-top:0.4rem;
                 text-align:center;
                 .student{
                     font-size:0.2rem;
                     text-align: left;
                     position:relative;
                     img{
                         width:0.3rem;
                         height:0.3rem;
                     }
                     .jdjb_status{
                         position: absolute;
                         left:50%;
                         top:50%;
                         margin-left:-0.4rem;
                         margin-top:-0.4rem;
                         width:0.8rem;
                         height:0.8rem;
                         background:url("../../assets/images/p_mwc.png") no-repeat;
                         background-size:0.8rem 0.8rem;
                         &.tg_active{
                             background:url("../../assets/images/p_tg.png") no-repeat;
                             background-size:0.8rem 0.8rem;
                         }
                         &.btg_active{
                             background:url("../../assets/images/p_btg.png") no-repeat;
                             background-size:0.8rem 0.8rem;
                         }
                     }
                     .role{
                         position:absolute;
                         width: 0.7rem;
                         left: 50%;
                         margin-left:-0.35rem;
                         text-align: center;
                     }
                 }
                 .lineBg{
                     width:1.8rem;
                     height:1px;
                     border-top:1px dashed #ccc;
                     position: relative;
                     top:0.15rem;
                 }
                 .guide{
                     position:absolute;
                     right:0.1rem;
                     top:50%;
                     margin-top:-0.1rem;
                     img{
                         width:0.3rem;
                         height:0.3rem;
                         vertical-align: top;
                         display: block;
                         margin-top:-0.05rem;
                     }
                 }
             }
         }
     }
</style>


