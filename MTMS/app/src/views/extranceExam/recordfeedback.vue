<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            记录反馈
            <div slot="headerRight">
                <span style="font-size: 0.3rem"  @click="submit" v-show="uploadflag">提交</span>
            </div>
        </c-header>
        <div class="g-main">
            <van-loading color="#1989fa" v-if="loading"/>
            <div class="inspection_Item" v-if="!loading">
                <div class="history_wrap">
                    <vue-uploader ref="add_picture"  class="add_picture" :imgList='pictureList' :fdfsurl="fdfsurl" :imgMax="100" :isupload="uploadflag"></vue-uploader>
                    <p>上传照片</p>
                    <div class="textarea_box">
                        <h3>备注</h3>
                        <textarea placeholder="请记录现场的问题"  v-model="content"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import cHeader from '@/views/header'
    import methods from '@/methods'
    import { mapState,mapActions } from 'vuex'
    import vueUploader from '@/components/vue-uploader';
    export default {
        name: "recordfeedback",
        components:{
            cHeader,
            vueUploader
        },
        data(){
          return{
              fdfsurl:'',
              pictureList:[],
              content:'',
              loading:true,
              uploadflag:false,
              contentId:'',
              picList:[],
              pictureListAdd:[],
              issignatureshow:false,//签名页面显示隐藏

          }
        },
        methods:{
            ...methods,
            getPicture(){
                this.pictureListAdd=[];
                for(let item of this.$refs.add_picture.filelist) {
                    this.picList.push({picurl:item.fileurl,tecId:$.cookie('uid'),teId:this.$route.query.teId})
                }
            },
            back(){
              window.history.back();
            },
            submit(){
                let self=this;
                if(this.pictureList.length==0){
                    this.$toast('请上传图片');
                    return;
                }
                if(!this.content){
                    this.$toast('请输入备注');
                    return;
                }
                this.getPicture();
                this.$toast('正在提交');
                this.post('/turnExamInfo/turnExamUploadpic', {
                    command: 'turnExamInfo/turnExamUploadpic',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    tecId:$.cookie('uid'),
                    teId:this.$route.query.teId,
                    contentId:this.contentId,
                    picList:this.picList,
                    content:this.content
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            window.history.back();
                        } else {
                            self.toast(res.errdesc)
                        }
                    } else {
                        self.toast('系统错误，请联系管理员~')
                    }

                });
            },
            init(){
                let self=this;
                this.post('/turnExamInfo/queryRecordFeedback', {
                    command: 'turnExamInfo/queryRecordFeedback',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    tecId:$.cookie('uid'),
                    teId:this.$route.query.teId,
                    // deptId:this.$route.query.deptId
                    deptList: this.$route.query.deptId
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            let data=res.dscpdetail;
                            this.uploadflag=res.uploadflag===0 ? false :true
                            this.fdfsurl=res.fdfsurl;
                            this.contentId=data.id;
                            for(let picture of res.piclist){
                                this.pictureList.push({fileurl:picture.picurl});
                            }
                            this.content=data.content;
                        } else {
                            self.$toast(res.errdesc)
                        }
                    } else {
                        self.$toast('系统错误，请联系管理员~')
                    }

                })
            },
        },
        mounted(){
            this.registerToNative('goBack', function (data) {
                this.back()
            });
            this.init();

        }
    }
</script>

<style scoped lang="scss">
    @import '../../scss/mixin.scss';
    body{
        .g-wrapper{
            background: #fff!important;
        }

    }
    .history_wrap{
        @include sexy-flex;
        flex-flow: column wrap;
        >p{
            padding-left:0.2rem;
        }
        >.textarea_box{
            padding: 0.2rem;
            textarea {
                border: 1px solid $borderColor;
                height: 1rem;
                width: 100%;
                padding: 0.2rem;
            }
            h3{margin-bottom:0.2rem;}
        }
    }
</style>
