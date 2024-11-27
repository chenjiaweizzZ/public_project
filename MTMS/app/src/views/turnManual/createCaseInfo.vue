<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{caseName}}
            <div slot="headerRight">
                <template v-if="caseCheck == 0">
                    <button style="font-size:0.3rem" @click="submitInfo">提交</button>
                </template>
                <template v-if="caseCheck == 2">
                    <button v-if="!reEditFlag" style="font-size:0.3rem" @click="reEdit">重新编辑</button>
                    <button v-if="reEditFlag" style="font-size:0.3rem" @click="submitInfo">提交</button>
                </template>
            </div>
        </c-header>
        <div class="g-main">
            <ul v-if="caseCheck != 1">
                <li class="item-box" v-if="type == 1 && addOrEdit && hasItemsFlag" @click="selectCase">
                    <div class="required item-name">{{caseNames}}</div>
                    <div class="item-content">{{virusName}}</div>
                    <div class="right-arrow"></div>
                </li>
                <li class="item-box" v-for="(item, index) in fillList" :key="item.id" @click="select(item, index)">
                    <div v-if="item.type" :class='[item.iswrite == 1 ? "required": "", "item-name"]'>{{item.writeInfo}}</div>
                    <!-- time -->
                    <div class="item-content" v-if="item.type == 1">{{submitArr[index].content}}</div>
                    <!-- radio -->
                    <div class="item-content" v-if="item.type == 3 && submitArr[index].content == '0'">否</div>
                    <div class="item-content" v-if="item.type == 3 && submitArr[index].content == '1'">是</div>
                    <!-- input -->
                    <div class="item-content" v-if="item.type == 2">
                        <input v-model="submitArr[index].content" placeholder="请输入"></input>
                    </div>
                    <!-- textarea -->
                    <div class="item-content" v-if="item.type == 4">
                        <textarea v-model="submitArr[index].content" placeholder="请输入"></textarea>
                    </div>
                    <!-- 审核意见 -->
                    <div class="item-name" v-if="item.checkType">审核意见</div>
                    <div class="item-content check-tip" v-if="item.checkType">
                        <div>{{item.checksuggestion}}</div>
                    </div>
                    <div class="right-arrow" v-if="item.type == 1 || item.type == 3"></div>
                </li>
            </ul>
            <ul v-else>
                <li class="item-box" v-for="(item, index) in fillList" :key="item.id">
                    <div v-if="item.type" :class='[item.iswrite == 1 ? "required": "", "item-name"]'>{{item.writeInfo}}</div>
                    <!-- time -->
                    <div class="item-content" v-if="item.type == 1">{{submitArr[index].content}}</div>
                    <!-- radio -->
                    <div class="item-content" v-if="item.type == 3 && submitArr[index].content == '0'">否</div>
                    <div class="item-content" v-if="item.type == 3 && submitArr[index].content == '1'">是</div>
                    <!-- input -->
                    <div class="item-content" v-if="item.type == 2">
                        <span>{{submitArr[index].content}}</span>
                    </div>
                    <!-- textarea -->
                    <div class="item-content" v-if="item.type == 4">
                        <span>{{submitArr[index].content}}</span>
                    </div>
                    <div class="item-name" v-if="item.checkType">审核意见</div>
                    <div class="item-content check-tip" v-if="item.checkType">
                        <div>{{item.checksuggestion}}</div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 选择病种名称 -->
        <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut">
            <div v-show="chooseCaseName" class="g-wrapper case-list">
                <c-header>
                    <div slot="headerLeft">
                        <a @click="chooseCaseName = false" class="header-back-btn">
                            <img src="../../assets/images/icon_fanhui.png" />
                        </a>
                    </div>
                    选择{{caseName}}
                    <div slot="headerRight"></div>
                </c-header>
                <van-search class="search-box" v-model="searchvalue" placeholder="请输入搜索关键词" show-action shape="round"
                    @search="onSearch">
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
                <div class="g-main container">
                    <ul>
                        <li @click="chooseCase(item)" v-for="item in allvirusList" :key="item.id">{{item.content}}</li>
                    </ul>
                </div>
            </div>
        </transition>
        <!-- 选择入院出院日期 -->
        <cDatepicker :config="setSelectRule" @confirm="selectDates"></cDatepicker>
        <!-- 选择子项 -->
        <c-picker :config="seltype" @confirm="selecttype"></c-picker>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '@/methods'
    import { mapState, mapActions } from 'vuex'
    import cHeader from '@/views/header'
    import cDatepicker from '@/components/timepicker'
    import cPicker from '../../components/default-picker'
    export default {
        data() {
            return {
                caseName: '添加病例',
                caseNames: '', // 添加时,名称选择 label
                hasItemsFlag: true,  // 默认true
                addOrEdit: true, // 添加,删除 Boolean
                caseCheck: '', // check 0待审核 1通过 2不通过  (待审核 添加 一致)
                reEditFlag: false,
                type: '',
                fillList: [],
                virusName: '',
                virusId: '',
                // 病种选择
                chooseCaseName: false,
                allvirusList: [],
                searchvalue: '',
                // 提交表单数据
                currentIndex: '',
                // 时间
                setSelectRule: {
                    show: false,//是否显示
                    istime: false,//是否需要时分
                    isday: true,//是否需要天
                },
                // 是否
                seltype: {
                    show: false,
                    mainlist: [{
                        id: 0,
                        name: '否'
                    }, {
                        id: 1,
                        name: '是'
                    }],
                    valueKey: 'name'
                },
                // 提交数据
                submitArr: [],
            }
        },
        components: {
            cHeader,
            cDatepicker,
            cPicker,
        },
        computed: {
            ...mapState([
                'turnManual'
            ]),
        },
        watch: {
            
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

            // 直接添加 查询填写信息列表
            queryAllInfo() {
                this.submitArr = [];
                this.post('/turnManual/queryTurnStdDisease', {
                    command: 'turnManual/queryTurnStdDisease',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    deptId: this.turnManual.deptId,
                    turnManualId: this.$route.query.id,
                }).done(data => {
                    if (data && data.errcode == 0) {
                        data.result.map(item => {
                            this.submitArr.push({
                                iswrite: item.iswrite,
                                itemId: item.id,
                                content: ''
                            });
                        });
                        this.fillList = data.result;
                    }
                }).fail(error => {

                })
            },

            // 重新编辑 信息列表
            editCaseInfo() {
                this.post('/turnManual/queryturnManualItemDetail', {
                    command: 'turnManual/queryturnManualItemDetail',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    detailId: this.$route.query.detailId,
                    check: this.$route.query.check,
                }).done(data => {
                    if (data && data.errcode == 0) {
                        data.itemList.map(item => {
                            // 过滤掉审核意见
                            if(item.type) {
                                this.submitArr.push({
                                    iswrite: item.iswrite,
                                    id: item.id,
                                    itemId: item.itemId,
                                    content: item.content
                                });
                            }
                        });
                        this.fillList = data.itemList;
                    }
                }).fail(error => {

                })
            },
        
            // 选择病种
            selectCase() {
                this.chooseCaseName = true;
                this.getAllCaseName();
            },
            // 获取所有的病种名称
            getAllCaseName() {
                this.post('/turnManual/queryTurnStdDiseaseContent', {
                    command: 'turnManual/queryTurnStdDiseaseContent',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    turnTrainId: this.turnManual.turnTrainId,
                    turnId: this.turnManual.turnId,
                    deptId: this.turnManual.deptId,
                    stage: this.turnManual.stage,
                    turnManualId: this.$route.query.id,
                    serchInfo: this.searchvalue,
                }).done(data => {
                    if (data && data.errcode == 0) {
                        this.allvirusList = data.result;
                    }
                }).fail(error => {

                })
            },
            // 搜索
            onSearch() { 
                this.getAllCaseName();
            },

            chooseCase(item) {
                this.virusName = item.content;
                this.virusId = item.id;
                this.chooseCaseName = false;
            },

            select(item, index) {
                if(this.caseCheck == 1) return;

                this.currentIndex = index;
                if (item.type == 1) {
                    this.setSelectRule.show = true;
                }

                if (item.type == 3) {
                    this.seltype.show = true;
                }
            },

            // 日期
            selectDates(data) {
                this.submitArr[this.currentIndex].content = data;
            },
            // 是否选中
            selecttype(data) {
                this.seltype.show = false;
                this.submitArr[this.currentIndex].content = data.id; // 0 否 1 是
            },

            // 重新编辑 需要隐藏老师审核意见,可以重新修改提交
            reEdit() {
                this.reEditFlag = true;
            },

            submitInfo() {
                // 判断必填项是否填写完整
                let judgeFlag = false;
                if(this.addOrEdit && this.type == 1 && this.hasItemsFlag) {
                    this.submitArr.forEach(value => {
                        if ((value.iswrite == 1 && String(value.content).trim().length == 0) || this.virusId == '') {
                            judgeFlag = true;
                        }
                    });
                } else {
                    this.submitArr.forEach(value => {
                        if (value.iswrite == 1 && String(value.content).trim().length == 0) {
                            judgeFlag = true;
                        }
                    });
                }
                if (!judgeFlag) {
                    var self = this;
                    this.showConfirm({
                        title: '温馨提示',
                        msg: '提交后信息不会更改，是否确认提交？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () { },
                        ok: function () {
                            // 判断是重新提交还是新增
                            if(self.addOrEdit) {
                                let caseId = self.type == 0 ? self.$route.query.baseId : self.virusId;
                                self.post('/turnManual/turnStdAddDisease', {
                                    command: 'turnManual/turnStdAddDisease',
                                    sessionid: $.cookie('sid'),
                                    loginid: $.cookie('uid'),
                                    deptId: self.turnManual.deptId,
                                    stdId: self.turnManual.stdId,
                                    baseId: caseId,
                                    detailList: self.submitArr,
                                    businessId: self.$route.query.businessid
                                }).done(data => {
                                    if (data && data.errcode == 0) {
                                        self.$toast('新增成功');
                                        self.$router.go(-1);
                                    }else {
                                        self.$toast(data.errdesc);
                                    }
                                }).fail(error => {

                                })
                            }
                            else {
                                self.post('/turnManual/editTurnManualItemDetail', {
                                    command: 'turnManual/editTurnManualItemDetail',
                                    sessionid: $.cookie('sid'),
                                    loginid: $.cookie('uid'),
                                    detailId: self.$route.query.detailId,
                                    check: self.$route.query.check,
                                    beanList: self.submitArr
                                }).done(data => {
                                    if (data && data.errcode == 0) {
                                        self.$toast('编辑成功');
                                        self.$router.go(-1);
                                    }
                                }).fail(error => {

                                })
                            }
                        }
                    });
                } else {
                    this.$toast('请将必填项填写完');
                }
            },
            back() {
                var self = this;
                if(this.caseCheck == 1) {
                    self.$router.go(-1);
                } else {
                    this.showConfirm({
                        title: '温馨提示',
                        msg: '你当前操作尚未提交保存，是否确认返回？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () { },
                        ok: function () {
                            self.$router.go(-1);
                        },
                    })
                }
            }
        },
        mounted() {
            // 是否有子项
            this.type = this.$route.query.type;
            // 判断是重新编辑 还是 添加
            if(this.$route.query.detailId) {
                this.addOrEdit = false;
                this.caseCheck = this.$route.query.check; // caseCheck 1审核通过的
                this.editCaseInfo();
                if(this.type == 0) {
                    this.caseName = this.turnManual.caseName;
                } else {
                    this.caseName = this.turnManual.caseDetailName;
                }
            } else {
                this.addOrEdit = true;
                this.caseName = "添加病例";
                if(this.$route.query.type == 1) {
                    this.caseNames = this.$route.query.name;
                }
                // 从有子项添加进入隐藏选择名称
                if(this.$route.query.nameFlag == 0) {
                    this.hasItemsFlag = false;
                    this.caseName = this.turnManual.caseDetailName;
                    this.virusId = this.$route.query.baseId;
                }
                this.queryAllInfo();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../scss/mixin.scss';

    .add-case-box {
        width: 100%;
        height: 100%;
    }

    .g-main>ul {
        margin-top: .1rem;
        padding-bottom: .6rem;
    }

    .item-box {
        background: #fff;
        min-height: .65rem;
        line-height: .65rem;
        padding: 0 .4rem;
        position: relative;
        color: #666;
        font-size: torem(14px);
        font-family: Microsoft YaHei;
        margin-bottom: .1rem;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
    }

    .item-box textarea {
        display: inline-block;
        height: 1.4rem;
        margin-top: .1rem;
    }

    .required::before {
        content: '*';
        color: red;
        margin-right: torem(4px);
    }

    .item-content {
        margin-left: torem(20px);
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .check-tip{
        white-space: normal;
        overflow: auto;
        padding: .1rem;
    }

    .right-arrow::after {
        content: "";
        display: inline-block;
        width: .3rem;
        height: .3rem;
        background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: .3rem;
        top: .15rem;
    }

    .item-name {
        width: 45%;
    }


    /* 选择病种名称 */
    .case-list {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: #f8f8f8;
        z-index: 999;
    }

    .search-box /deep/ .van-field__left-icon {
        margin-top: 3px;
    }

    .container {
        margin-bottom: .2rem;
    }

    .container ul li {
        height: torem(45px);
        line-height: torem(45px);
        border-bottom: 1px solid #e2e2e2;
        padding-left: .3rem;
    }
</style>