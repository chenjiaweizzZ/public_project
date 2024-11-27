<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            活动详情
        </c-header>

        <div class="g-main">

            <ul class="main">
                <li>
                    <label>活动级别</label>
                    <span>{{detail.actionlevelname}}</span>
                </li>
                <li>
                    <label>{{detail.actionplanlevel | levelname}}</label>
                    <span>{{detail.showofficename}}</span>
                </li>
                <li>
                    <label>活动主题</label>
                    <span>{{detail.theme}}</span>
                </li>
                <li @click="seltype.show = true">
                    <label>活动类型</label>
                    <span>{{detail.typename}}</span>
                </li>
                <li>
                    <label>开始时间</label>
                    <span>{{ detail.starttimestr }}</span>
                </li>
                <li>
                    <label>结束时间</label>
                    <span>{{ detail.endtimestr }}</span>
                </li>
                <li>
                    <label>活动地点</label>
                    <span>{{detail.place}}</span>
                </li>
                <li @click="toshowlist(1)">
                    <label>主讲人</label>
                    <p class="choice">
                        <i v-for='(val,index) in detail.speakerlist'>{{val.uname}}</i>
                    </p>
                </li>
                <li @click="toshowlist(2)">
                    <label>参与人员</label>
                    <span class="choice">{{detail.attendercount}}人</span>
                </li>
                <li v-show="detail.remark">
                    <label>备注</label>
                    <span>{{detail.remark}}</span>
                </li>
                <li class="add" v-show="detail.fileuploadlist && detail.fileuploadlist.length>0">
                    <div class="all">
                        <label>附件</label>
                        <div>
                            <a v-for = '(val,index) in detail.fileuploadlist' v-if="val.type == 1"  @click="dowmload(fdfsurl + '/' + val.fileurl)">{{val.filename}}</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!--查看已选参与人员 -->
        <c-modal :config="showdetail">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <ul class="doctorupdata">
                        <li v-for="(val,index) in showlist" >
                            <span>
                                {{val.name}}
                                <span v-if="val.username">-{{val.username}}</span>
                                <span v-if="val.count">({{val.count}}人)</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </c-modal>

    </div>
</template>
<script>
    import methods from '../../../methods';
    import cHeader from '../../header';
    import $ from 'jquery';
    import cModal from '../../../components/modal';
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                detailid:'',
                detail:'',
                fdfsurl:'',
                showlist:[],
                showdetail: {
                    show: false,
                    title: '查看主讲人',
                    hideOnClickOut: true,
                },

            }
        },
        components: {
            cHeader,
            cModal
        },
        computed:{

        },
        watch:{

        },
        filters:{
            'levelname':function (val) {
                return val == 'hospital' ? '医院' : val == 'base' ? '基地' : '科室'
            },
            'name':function(val){
                return val == 'base' ? '正在该基地轮转的学员' : val == 'trun' ? '专业在该基地的学员' : ''
            }
        },
        created(){
            this.detailid = this.$route.query.id;
        },
        mounted(){
            let self = this;
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            init(){//获取详情
                let self = this;
                this.post('/actionplan/getactionplandetail',{
                    command:'actionplan/getactionplandetail',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    clientflag:1
                }).done( res => {
                    self.detail = res.bean;
                    self.fdfsurl = res.fdfsurl;
                });
            },
            toshowlist(param){
                this.showlist = [];
                if(param == 1){
                    this.showdetail.title = '查看主讲人';
                    this.detail.speakerlist.map(value => {
                        this.showlist.push({name:value.uname,username:value.username,id:value.uid})
                    });
                }else {
                    this.showdetail.title = '查看参与人员';
                    this.detail.attendinfolist.map(value => {
                        if(value.type == 1){
                            this.showlist.push({name:value.attendbusinfo.split('-')[0],count:value.attendbusinfo.split('-')[1],type:value.type,id:value.attendbusid})
                        }else {
                            this.showlist.push({name:value.attendbusinfo,type:value.type,id:value.attendbusid})
                        }
                    });
                }
                this.showdetail.show = true;
            },
            dowmload(param){//查看文件
                this.invokeNative('OpenDocument',{
                    url:param
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    name: "fdRotation_activitylist_director",
                    query: {
                        type:self.$route.query.type,
                        typeid:self.$route.query.typeid,
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .btn-group {
        height: .76rem;
        img {
            width: .4rem;
            height: .4rem;
            margin-top: .18rem;
            margin-left: .15rem;
        }
    }
    .g-main {
        margin-top:0.1rem;
        li:nth-child(2) , li:nth-child(4) , li:nth-child(7){
            border-bottom: 1px solid #eee;
            margin-bottom:0
        }
    }
    li {
        background:#fff;
        height: .65rem;
        line-height:.65rem;
        padding:0 0.4rem;
        position: relative;
        color: #666;
        font-size: 0.26rem;
        font-family: "Microsoft YaHei";
        margin-bottom:0.1rem;
        display: flex;
        label {
            flex: 1;
            line-height:0.65rem;
            text-align:justify;
            text-align-last:justify;
            margin-right:0.3rem;
            vertical-align: top;
        }
        >textarea {
            display: flex;
            flex: 3;
        }
        >div , >span , >input {
            display: flex;
            flex: 3;
            height: .62rem;
            line-height: .62rem;
            overflow: hidden;
            span {
                flex: 1;
                width: 0;
                line-height: .62rem;
            }
        }
        >p {
            flex: 3;
            height: .62rem;
            padding-right: .2rem;
            overflow: hidden;
            i {
                overflow: hidden;
            }
        }
        i {
            font-style: normal;
            line-height: .65rem;
            padding-right: .1rem;
        }
    }
    p {
        margin :0
    }
    s {
        text-decoration: none;
    }
    .students , .remark {
        height: auto;
        p {
            height: auto;
            min-width: 100%;
        }
        span {
            line-height:0.35rem;
        }
    }
    .codecontent {
        display: flex;
        width: 100%;
        height: calc(100% - .9rem);
        justify-content : center;
        align-items:center;
        position: absolute;
        z-index:1000;
        #code {
            background:#fff;
            padding:0.2rem;
            border-radius: 0.2rem;
        }

    }
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }

    .choice {
        padding-right: 0.4rem;
    }
    .choice:after {
        content: '';
        display: inline-block;
        flex:3;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0.2rem;
        top: 0.15rem;
    }
    .all>div {
        flex: 3;
    }
</style>
