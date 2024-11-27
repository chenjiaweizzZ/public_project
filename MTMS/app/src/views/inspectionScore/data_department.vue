<template>
        <div class="g-wrapper" v-if="showDetails">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            科室搜索
        </c-header>
         <div class="search flex color" >
                <div class="searchLeft flex" @click="selCourseShow = true">
                    <img src="../../assets/images/bnt_shaixuan.png" alt="">
                </div>
                <div class="searchRight flex">
                    <input type="text" v-model="searchContent" placeholder="请输入科室名称查询" @input="search">
                    <span @click="search">搜索</span>
                </div>
        </div>
        <div class="g-main">
            <ul class="ulContent">
                <li v-for="item in deptList" @click="dept(item.id,item.name)">{{item.name}}</li>
            </ul>
        </div>
        <no-content v-if='noContent'></no-content>
    </div>

</template>
<script>
    import Vue from 'vue'
    import cHeader from '../header'
    import methods from '../../methods'
    import noContent from '../no_content'
    import { mapState,mapActions } from 'vuex'
    let bus = new Vue({})
    export default {
        name:'myTest',
        props:{
          showDetails:{
              type:Boolean,
              default:false
          }
        },
        components:{
            cHeader,
            noContent,
        },
        data(){
            return{
                searchName:'',
                deptList:[],
                searchContent:'',
                noContent:false,
                teacherList:[],
                type:""/*1看所有共享的，0。看指定共享的3.看自己上传的*/
            }
        },
        created:function(){
        	//alert(this.$router.query);
        	//this.type = this.$route.type;

        },
        mounted(){
            let self=this;
            this.registerToNative('goBack', function (data) {
                self.back();
            });
            this.init()
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
            back(){
                this.$emit("getDetails",{boolean:false});
            },
            init(){
                let self = this
                this.post('/turnbaseinfo/querydept', {
                    command: 'turnbaseinfo/querydept',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    searchinfo: self.searchContent,
                    deptcode: 'office'
                }).done(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                           self.deptList = res.deptlist;
                           if(self.deptList.length==0){
                              self.noContent=true;
                           }else{
                               self.noContent=false;
                           }
                        }
                    } else {
                        self.toast(res.errdesc)
                    }

                });
            },
            getTeacher(deptid){
                let self=this;
                this.post('/turnbaseinfo/queryteacherbydept', {
                    command: 'turnbaseinfo/queryteacherbydept',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    searchinfo: self.searchContent,
                    deptid: deptid
                }).done(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            self.teacherList = res.teacherinfolist;
                            if (self.deptList.length == 0) {
                                self.noContent = true;
                            } else {
                                self.noContent = false;
                            }
                        }
                    } else {
                        self.toast(res.errdesc)
                    }

                });
            },
            search(){
                this.init()
            },
            dept(id,name){
               this.$emit("getDetails",{boolean:false,query:{deptid:id,deptname:name}});
            },
            ok(){
                this.init()
                this.selCourseShow = false
            }
        }
    }
</script>
<style scoped lang="scss">
   @import '../../scss/mixin.scss';

   .flex {
       display:flex;
       align-items: center;
       justify-content: flex-start;
   }
   .flex-between {
       display: flex;
       justify-content: flex-between;
       align-items: center;
   }
   .search{
       width:100%;
       height:.88rem;
       /* border-bottom: solid 1px lightgray; */
       padding:0 .3rem;
       /* margin-bottom:.2rem; */
       background:rgb(255,255,255);
   }
   .searchLeft img{
       width:.35rem;
       margin-right: .3rem;
   }
   .searchRight{
       background:rgb(242,242,242);
       width:calc(100% - .35rem);
       height:.6rem;
       border-radius:.1rem;
       /* color:#999999; */
   }
   .searchRight span{
       padding-left:.18rem;
       color:rgb(140,140,140);
       border-left:solid 1px rgb(220,220,220);
   }
   .searchRight input{
       width:80%;
       outline: none;
       padding-left:.1rem;
       background:transparent;
   }
   input::-webkit-input-placeholder{
        color:#c3c3c3;
        opacity:1;
    }
    .ulContent{
        li{
            height: 0.6rem;
            line-height:0.6rem;
            padding-left:0.2rem;
            border-bottom:1px solid $borderColor;
            background: #fff;
            color:$wordColor;
        }
    }
    .g-wrapper{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        z-index: 1000;
    }
    .g-main{background: #f2f2f2!important;}







</style>
