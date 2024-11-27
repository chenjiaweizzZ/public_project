<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{caseName}}
        </c-header>
        <div class="g-main">
            <ul>
                <li class="item-box" v-for="(item, index) in items" :key="item.id">
                    <div v-if="item.type" :class='[item.iswrite == 1 ? "required": "", "item-name"]'>{{item.writeInfo}}
                    </div>
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
        <div class="footer-box">
            <div class="footer-right-box" v-if="checkType == 0">
                <van-button @click="noPass" square type="primary" style="color:#323232; border:1px solid #323232">不通过
                </van-button>
                <van-button @click="pass" square type="primary">通过</van-button>
            </div>
            <div class="footer-right-box" v-else>
                <van-button @click="cancel" square type="primary">撤销</van-button>
            </div>
        </div>
        <reason :show-flag="show" @cancel="cancelSubmit" @save="saveSubmit"></reason>
    </div>
</template>

<script>
    import $ from 'jquery'
    import methods from '@/methods'
    import { mapState, mapActions } from 'vuex'
    import cHeader from '@/views/header'
    import reason from './components/noPassReason.vue';
    import api from './js/common.js'
    export default {
        data() {
            return {
                caseName: '',
                check: '', // check 0待审核 1审核通过 2未通过
                checkType: '', // 用户进入时类型
                items: [],
                submitArr: [],
                curIdList: [],
                validateList: [],
                // 弹出层
                show: false,
                message: '',
                disabled: true,
            }
        },
        components: {
            cHeader,
            reason
        },
        computed: {
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

            // 审核
            checkCase(type) {
                this.curIdList.push(this.$route.query.id);
                this.validateList.push({
                    id: this.$route.query.id,
                    createTime: this.$route.query.createTime,
                });
                api.validateCheck(this.validateList).then(res => {
                    this.post('/turnManual/turnManualCheck', {
                        command: 'turnManual/turnManualCheck',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        uid: $.cookie('uid'),
                        checksuggestion: this.message,
                        checkType: type, // 0待审核 1 审核通过 2 审核不通过
                        list: this.curIdList
                    }).done((data) => {
                        if (data && data.errcode == 0) {
                            // 待审核 0
                            if(type == 0) {
                                this.$toast('撤销成功');
                            }else {
                                this.$toast("审核完成");
                            }
                            setTimeout(() => {
                                this.back();
                            }, 500)
                        }
                    })
                }).catch(data => {
                    this.$toast("当前审核项已过审核时间");
                })
            },

            noPass() {
                var self = this;
                self.showConfirm({
                    title: '温馨提示',
                    msg: '是否确认不通过该审核记录？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () { },
                    ok: function () {
                        self.check = 2;
                        self.show = true;
                    },
                })
            },

            cancelSubmit() {
                this.show = false;
            },

            saveSubmit(message) {
                this.show = false;
                this.message = message;
                this.checkCase(this.check);
            },

            pass() {
                var self = this;
                self.showConfirm({
                    title: '温馨提示',
                    msg: '是否确认通过该审核记录？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () { },
                    ok: function () {
                        self.check = 1;
                        self.checkCase(self.check);
                    },
                })
            },

            cancel() {
                var self = this;
                self.showConfirm({
                    title: '温馨提示',
                    msg: '是否确认撤销该审核记录？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () { },
                    ok: function () {
                        self.check = 0;
                        self.checkCase(self.check);
                    },
                })
            },

            // 查看当前病例详情
            detail() {
                this.post('/turnManual/queryturnManualItemDetail', {
                    command: 'turnManual/queryturnManualItemDetail',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    detailId: this.$route.query.id,
                    check: this.$route.query.check,
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        data.itemList.map(item => {
                            this.submitArr.push({
                                iswrite: item.iswrite,
                                id: item.id,
                                content: item.content
                            });
                        });
                        this.items = data.itemList;
                    }
                })
            },

            back() {
                this.$router.go(-1);
            }
        },
        mounted() {
            this.caseName = this.$route.query.name;
            this.checkType = this.$route.query.check;
            this.detail();

            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
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

    .check-tip {
        white-space: normal;
        overflow: auto;
        padding: .1rem;
    }

    .item-name {
        width: 45%;
    }

    .footer-box {
        width: 100%;
        height: 40px;
        background: #fff;
        border: 1px solid #3499db;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 999;
        display: flex;
        align-items: center;
    }

    .van-button--primary {
        background: #fff;
        color: #3499db;
        border: 1px solid #3499db;
        border-radius: 5px;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        margin: .4px .1rem 0 0;
    }

    .footer-right-box {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
</style>