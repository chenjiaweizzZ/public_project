<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a class="header-back-btn" @click="back()">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            护士长评价表
            <div slot='headerRight' v-if='showEvaluate' :class="{noclick:issubmit}" style="font-size: 0.3rem;" @click='submit' >提交</div>
        </c-header>
        <div class="g-main" v-if='!noContent'>
            <div class="title">
                <!--<p>{{hospital}}</p>-->
                <p>{{title}}</p>
            </div>
            <div class="explain" v-if='showEvaluate'>
                <span>*</span>此评价表为各位护培生师日常考核所用，并存入护培学档案，请大家认真填写。
            </div>
            <div class="evaluateDetail">
                <ul>
                    <li v-for='(item,mainindex) in evaluationList'>
                        <p><span v-if="item.category">{{item.category}}</span>{{item.title}}</p>
                        <ul class="small">
                            <li v-if="item.itemlist">
                                <div>
                                    <span @click='check(v,mainindex)' :class="{noclick:showDetail}" v-for='v in item.itemlist'><input type="radio" class="radio" :name="item.id" :value="v.evascore" :checked="v.checkflag" :disabled ='showDetail'>{{v.content}}</span>
                                </div>
                            </li>
                            <li v-else-if="item.multiselect == 4">
                                <input class="pack" type="text" v-model="item.evacontent" :disabled ='showDetail'>
                            </li>
                            <li v-else v-for="(val,childindex) in item.childbean">
                                <p>{{val.title}}</p>
                                <div>
                                    <span @click='check(v,mainindex,childindex)' :class="{noclick:showDetail}" v-for='v in val.itemlist'><input type="radio" class="radio" :name="val.id" :value="v.evascore" :checked="v.checkflag" :disabled ='showDetail'>{{v.content}}</span>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="advise">
                <p><span style="color: red">*</span> 意见和建议（必填）</p>
                <textarea v-model='advise' placeholder="请填写您的建议或意见..." @focus='textareaFocus' @blur='textareaBlur' :disabled = 'showDetail'></textarea>
            </div>
        </div>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import cHeader from '../../header'
    import methods from '../../../methods'
    import noContent from '../../no_content'
    import { mapState,mapActions } from 'vuex'
    export default {
        name: 'rd_evaluate_score',
        components: {
            cHeader,
            noContent
        },
        data() {
            return {
                deptid:'',
                showDetail: false,
                showEvaluate: false,
                hospital: '哈医大附四院',
                title: `哈医大附四院护士长对护培生师评价表`,
                answer: [],
                evaluationList: [],
                checkedlist: [],
                date: '',
                recommend:'',
                advise:'',
                detaillist:[],
                noContent: false,
                type:'',
                issubmit:false
            }
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        mounted() {
            let self = this
            // booking = 0;是查看详情
            // booking = 1;是评分页
            if (self.$route.query.booking == 0) {
                self.showDetail = true;
                self.queryevaluateditems(12)
            } else if (self.$route.query.booking == 1 || self.$route.query.message == 1) {
                self.showEvaluate = true;
                self.evaluateScore(12);
            }
            self.registerToNative('goBack', function (data) {
                self.back();
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
            // 点击提交的时候
            submit: function () {
                let self = this;
                let options = {};
                if(self.$route.query.message){
                    options.evaluateid = self.$route.query.uid;
                    options.businessid = self.$route.query.businessid;
                }else {
                    options.evaluateid = this.turninfo.stuid;
                    options.businessid = this.turninfo.businessid;
                }
                let allitems = 0 ;
                self.checkedlist = [];
                self.evaluationList.map(function (item, index, arr) {
                    if(item.itemlist){
                        allitems++;
                        item.itemlist.map(val => {
                            if (val.checkflag) {
                                self.checkedlist.push({
                                    submitsourceflag: val.submitsourceflag,
                                    evaluationitemid: val.id,
                                    evascore: val.evascore,
                                    evacontent:val.content,
                                    weightratio:val.weightratio,
                                })
                            }
                        })
                    }else if(item.multiselect == 4){
                        allitems++;
                        self.checkedlist.push({
                            submitsourceflag: item.submitsourceflag,
                            evaluationitemid: item.id,
                            evascore: item.evascore,
                            evacontent:item.evacontent,
                            weightratio:item.weightratio,
                        })
                    }else {
                        item.childbean.map(function (item1, index1, arr1) {
                            allitems++;
                            item1.itemlist.map(val => {
                                if (val.checkflag) {
                                    self.checkedlist.push({
                                        submitsourceflag: val.submitsourceflag,
                                        evaluationitemid: val.id,
                                        evascore: val.evascore,
                                        evacontent:val.content,
                                        weightratio:val.weightratio,
                                    })
                                }
                            })
                        })
                    }
                })
                if (self.checkedlist.length != allitems) {
                    self.toast('还有' + (allitems - self.checkedlist.length) + '项没有评')
                }else if(self.advise == ''){
                    self.toast('请填写您的建议或意见！')
                }else {
                    self.issubmit = true;
                    self.post('/turnevaluate/submitevaluate', {
                        command: 'turnevaluate/submitevaluate',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        advise: self.advise,
                        type: 12,
                        detaillist:self.checkedlist,
                        ...options
                    }).done(function (data) {
                        self.issubmit = false;
                        if(data.errcode == '0'){
                            if(self.$route.query.message){
                                self.changestatu();
                            }else {
                                self.toast('提交成功！')
                                setTimeout(function(){
                                    window.history.back()
                                },2000)
                            }
                        }else if(data.errdesc){
                            self.toast(data.errdesc)
                        }else {
                            self.toast('系统错误，请联系管理员！')
                        }
                    }).fail(function (error) {
                        self.issubmit = false;
                        self.noContent = true;
                    })
                }
            },
            evaluateScore: function (type) {
                let self = this;
                self.post('/turnevaluate/getevaluatebytype', {
                    command: 'turnevaluate/getevaluatebytype',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type: type
                }).done(function (data) {
                    self.evaluationList = data.beanlist
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            // 修改任务状态
            changestatu(){
                let self = this;
                self.post('/task/updatetaskinfostate', {
                    command: 'task/updatetaskinfostate',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    sourceid:self.$route.query.taskid,
                    predefine1: 1
                }).done(function (data) {
                    if (data.errcode == 0) {
                        // location.href = '/pages/futuredoctorapp/todo.html?view=task';
    //                     if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
    window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
                    } else {
                        self.toast(data.errdesc)
                    }
                })
            },
            queryevaluateditems(param){
                let self = this
                this.post('/turnevaluate/evaluateresultview',{
                    command:'turnevaluate/evaluateresultview',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:self.$route.query.id,
                    type:param,
                    businessid: this.turninfo.businessid,
                }).done(function(data){
                    if(data && data.errcode == 0){
                        self.advise = data.advise
                        self.evaluationList = data.beanlist
                    }else {
                        self.toast(date.errdesc)
                    }

                })
            },
            // 点击评分的时候点击每个选项的时候
            check(item, mainindex, childindex) {
                let self = this;
                if(self.evaluationList[mainindex].itemlist){
                    self.evaluationList[mainindex].itemlist.map(val => {
                        if (val.checkflag) {
                            val.checkflag = 0;
                        }
                    })
                }else {
                    self.evaluationList[mainindex].childbean[childindex].itemlist.map(val => {
                        if (val.checkflag) {
                            val.checkflag = 0;
                        }
                    })
                }
                if (!item.checkflag ){
                    // self.$set(item, 'checkflag', true)
                    item.checkflag = true;
                }
            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'5rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            back() {
                let self = this
                if(self.showEvaluate){
                    self.showConfirm({
                        title: '提醒',
                        msg: '你当前评价尚未提交保存，是否确认返回？',
                        theme: 'modal-confirm modal-white',
                        ok: function () {
                            if(self.$route.query.message){
                                // location.href = '/pages/futuredoctorapp/todo.html?view=task';
    //                             if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
    window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
                            } else {
                                self.$router.push({
                                    name: "fdRotation_nurse_director",
                                    query: {
                                        type:self.$route.query.type,
                                        where:self.$route.query.where,
                                        date:self.$route.query.date,
                                    }
                                })
                            }
                        },
                        cancel: function () {

                        }
                    })
                }else if(self.$route.query.booking && !self.$route.query.date || self.$route.query.booking == '0' && !self.$route.query.date){
                    self.$router.push({
                        name: "fdRotation_doctor_exam_date_director",
                        query: {
                            type:self.$route.query.type,
                            where:self.$route.query.where,
                            from:self.$route.query.from,
                            booking:self.$route.query.booking,
                        }
                    })
                }else{
                    self.$router.push({
                        name: "fdRotation_nurse_director",
                        query: {
                            type:self.$route.query.type,
                            where:self.$route.query.where,
                            date:self.$route.query.date,
                        }
                    })
                }
            }
        }
    }

</script>
<style lang="scss" scoped>
    .g-main{
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .title {
        color: black;
        text-align: center;
        /*height: 1rem;*/
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*padding-top: 0.1rem;*/
        margin-bottom: 0;
        font-size: 0.26rem;
        p {
            padding: .2rem 0;
        }
    }

    .explain {
        /*margin-top: 0.2rem;*/
        height: auto;
        /*background: #ffa81d;*/
        padding: 0.1rem;
        font-size: 0.24rem;
        background: rgb(244,226,198);
        /*opacity: 0.2;*/
    }

    .explain span {
        color: red;
    }

    .evaluateDetail {
        margin-top: 0.1rem;
        background: white;
        padding: 0 0.2rem;
        /*font-size: 0.24rem;*/
    }

    .evaluateDetail ul li{
        border-bottom: solid 0.01rem rgb(240,240,240);
        padding: 0.1rem 0;
        font-size: 0.22rem;
    }
    .evaluateDetail ul li:nth-last-of-type(1){
        border: none;
    }
    .evaluateDetail ul li p:nth-last-of-type(1) input {
        position: relative;
        top: 0.06rem;
        /*left:0.05rem;*/
    }
    .radio {
        width: .25rem;
        height: .25rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;

        background-image: url('../../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }

    .radio:checked {
        background-image: url('../../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    .teacher{
        margin: 0.1rem 0;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*height: 1rem;*/
        /*align-items: center;*/
        /*border-bottom: solid 0.01rem #c3c3c3;*/
        padding: 0.1rem;
        background: white;
    }
    .teacher label{
        position: relative;
        top:-0.08rem;
        margin-top: 0.1rem;
        margin-left: 0.2rem;
    }
    .teacher label:nth-last-of-type(1){
        margin-left: 1.2rem;
    }
    .teacher label input{
        position: relative;
        top: 0.08rem;
    }
    .advise{
        padding: 0.1rem;
        background: white;
    }
    .advise textarea{
        width: 100%;
        height: 2rem;
        border: solid 0.01rem #c3c3c3;
        padding: 0.1rem;
    }
    .remark{
        padding: 0.1rem;
        font-size: 0.2rem;
    }
    .remark div{
        padding-left: 0.5rem;
        display: flow-root;
    }
    .remark div p{
        width: 50%;
        float: left;
        /*color: #666666;*/
    }
    .noclick {
        pointer-events: none;
    }
    .pack {
        width: 100%;
        padding: .1rem;
        border: .01rem solid #c3c3c3;
    }
    .small li div {
        display: flex;
        span {
            width: 0;
            flex: 1;
        }
    }
</style>
