<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            反馈
            <div slot="headerRight" @click="submit" style="font-size: 0.3rem" v-if="!showDetail" :class="{noclick:issubmit}">
                提交
            </div>
             <div slot="headerRight" @click="submit" style="font-size: 0.3rem" v-if="showDetail&&updateflag==1" :class="{noclick:issubmit}" >
                提交
            </div>
        </c-header>
        <div class="g-main">
            <!--<div v-if='showDetail'>-->
                <!--&lt;!&ndash;查看詳情時顯示&ndash;&gt;-->
                <!--<div class="evaluateDetail">-->
                    <!--<ul>-->
                        <!--<li v-for='(item,index) in detaillist'>-->
                            <!--<p>{{index+1}}、{{item.title}}</p>-->
                            <!--<p>-->
                                <!--{{item.content}}-->
                            <!--</p>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->
                <!--<div class="advise" v-if = 'nocontent == false'>-->
                    <!--<p><span style="color: red">*</span> 收获及建议：</p>-->
                    <!--<textarea v-model='advise' disabled="disabled"></textarea>-->
                <!--</div>-->
            <!--</div>-->

            <!--評分時顯示-->
            <div class="evaluateDetail">
                <div class="explain">
                    <span>*</span>
                    各位同学你们好！请您花几分钟时间填写此调查表，对本次活动作出客观、直率的评价，以作为今后教学改革之依据。本调查表内容仅作为调查分析之用，个人资料绝对保密，请您放心填写。感谢您的配合。
                </div>
                <ul>
                    <li v-for='(item,index) in evaluationList'>
                        <p>{{index+1}}、{{item.title}}</p>
                        <p class="flex" style="justify-content: space-around;">
                            <label @click='check(v,index)' v-for='v in item.evaluationitems'><input type="radio" class="radio" :name="index" :value="v.id" :checked="v.checked">{{v.content}}</label>
                        </p>
                    </li>
                </ul>
                <div class="advise">
                    <p><span style="color: red">*</span>收获及建议：</p>
                    <textarea v-model='advise' @focus='textareaFocus' @blur='textareaBlur' placeholder="请输入本次活动主要内容、收获及建议!" @input="wordCount"></textarea>
                </div>
            </div>
            <!--<no-content v-show='nocontent'></no-content>-->
        </div>
    </div>
</template>
<script>
    import cHeader from '../header';
    import methods from '../../methods';
    import noContent from '../no_content'
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                showDetail: false,
                showEvaluate: false,
                answer: [],
                evaluationList: [],
                checkedlist: [],
                date: '',
                advise:'',
                advantage:'',
                detaillist:[],
                from:'',
                wordStandard:false,
                nocontent: false,
                updateflag:false,
                evaluateresultid:'',
                issubmit:false
            }
        },
        components: {
            cHeader,
            noContent
        },
        computed:{

        },
        watch:{

        },
        created(){
            this.detailid = this.$route.query.id;
            this.from = this.$route.query.from;
            // from = true;是查看详情
            // from = false;是评分页
        },
        mounted() {

            let self = this;
            if (this.from) {
                 self.showDetail = true;
                 self.evaluateScore();
            } else{
                self.showEvaluate = true;
                self.evaluateScore();
            }
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            evaluateScore: function (type) {
                let self = this;
                self.post('/turn/queryevaluationitems', {
                    command: 'turn/queryevaluationitems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type: 6
                }).done(function (data) {
                    self.evaluationList = data.evaluationList;
                    console.log(self.evaluationList)
                    self.queryevaluateditems()
                }).fail(function (error) {
                    self.nocontent = true
                })
            },
            wordCount () {
               if(this.advise.length>0&&this.advise.length<1000){
                   this.wordStandard=true;
               }else{
                   this.wordStandard=false;
               }
            },
            queryevaluateditems(){
                let self = this;
                this.post('/turn/queryevaluateditems',{
                    command:'turn/queryevaluateditems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    id:self.detailid,
                    type:6
                }).done(function(data){
                    self.advise = data.advise;
                    self.advantage = data.advantage;
                    self.detaillist = data.detaillist;
                    self.updateflag=data.updateflag;
                    self.evaluateresultid=data.id;
                    if(self.detaillist == null){
                        self.nocontent = true
                    }
                    self.detaillist.map(function (item0,index) {
                        self.evaluationList.map(function (item, index, arr) {
                            item.evaluationitems.map(function (item1, index1, arr1) {
                                if (item0.itemid==item1.id) {
                                    self.$set(item1,'checked',true);
                                }
                            })
                        })
                    });
                    console.log(self.evaluationList)

                }).fail(function(error){
                    self.nocontent = true
                })
            },
            // 点击评分的时候点击每个选项的时候
            check(item, index) {
                let self = this;
                self.evaluationList[index].evaluationitems.map(function (item, index, arr) {
                    if (item.checked) {
                        delete item.checked
                    }
                });
                if (typeof item.checked == 'undefined') {
                    self.$set(item, 'checked', true)
                }
            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'5rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            // 点击提交的时候
            submit: function () {
                let self = this
                let date = new Date()
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()

                self.checkedlist = []
                self.evaluationList.map(function (item, index, arr) {
                    item.evaluationitems.map(function (item1, index1, arr1) {
                        if (item1.checked) {
                            self.checkedlist.push({
                                id: item1.id,
                                score: item1.score
                            })
                        }
                    })
                })
                if (self.checkedlist.length != self.evaluationList.length) {
                    self.toast('还有' + (self.evaluationList.length - self.checkedlist.length) + '项没有评')
                }else if(!this.advise){
                    self.toast('收获及建议不能为空')
                }else if(this.advise.length>1000){
                    self.toast('收获及建议的字数不能大于1000')
                }else {
                    self.issubmit = true;
                    if(self.evaluateresultid){
                         self.post('/turn/updateevaluationitems', {
                            command: 'turn/updateevaluationitems',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            type: 6,
                            id:self.evaluateresultid,
                            uid: $.cookie('uid'),
                            evaluatedid: self.detailid,
                            businessid: self.detailid,
                            items: self.checkedlist,
                            month: year + '-' + month + '-' + day,
                            advise: self.advise,
                            advantage: self.advantage
                        }).done(function (data) {
                            self.issubmit = false;
                            if (data.errcode == '0') {
                                self.toast('提交成功！')
                                self.$router.push({
                                    name: 'fdAction_detail',
                                    query: {
                                        id: self.detailid,
                                        ishistory: self.$route.query.ishistory
                                    }
                                })
                            } else {
                                self.toast(data.errdesc)
                            }
                        }).fail(function (error) {
                            self.issubmit = false;
                            self.nocontent = true
                        })
                    }else{
                        self.post('/turn/submitevaluationitems', {
                            command: 'turn/submitevaluationitems',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            type: 6,
                            uid: $.cookie('uid'),
                            evaluatedid: self.detailid,
                            businessid: self.detailid,
                            items: self.checkedlist,
                            month: year + '-' + month + '-' + day,
                            advise: self.advise,
                            advantage: self.advantage
                        }).done(function (data) {
                            self.issubmit = false;
                            if (data.errcode == '0') {
                                self.toast('提交成功！')
                                self.$router.push({
                                    name: 'fdAction_detail',
                                    query: {
                                        id: self.detailid,
                                        ishistory: self.$route.query.ishistory
                                    }
                                })
                            } else {
                                self.toast(data.errdesc)
                            }
                        }).fail(function (error) {
                            self.issubmit = false;
                            self.nocontent = true
                        })
                    }
                }

            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'6rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
            back(){
                let self = this;
                if(this.from == true){
                    self.$router.push({
                        name: 'fdAction_detail',
                        query: {
                            id: self.detailid,
                            ishistory:self.$route.query.ishistory
                        }
                    })
                }else {
                    this.showConfirm({
                        title: '温馨提示',
                        msg: '你当前操作尚未提交保存，是否确认返回？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () {},
                        ok: function () {
                            self.$router.push({
                                name: 'fdAction_detail',
                                query: {
                                    id: self.detailid,
                                    ishistory:self.$route.query.ishistory
                                }
                            })
                        },
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
        border-radius: .15rem;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;

        background-image: url('../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }

    .radio:checked {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
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

</style>
