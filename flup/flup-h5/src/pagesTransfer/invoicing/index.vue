<template>
    <div class="invoicing">
        <div class="invoicing-course">
            <div class="invoicing-course-container">
                <div class="invoicing-course-container-hos">
                    <img src="@/assets/images/icon/hos.png" alt="" />
                    <span>{{ packageInfo.sourceName }}</span>
                </div>
                <div class="invoicing-course-container-info">
                    <img :src="packageInfo.previewUrl" alt="" />
                    <div class="info2">
                        <div class="info2-title">{{ packageInfo.packageName }}</div>
                        <!-- <div class="info2-desc">开票信息开1票信息开票信息开票信息开票信息开票信息开票信息开票信息开票信息开票信息</div> -->
                        <div class="info2-desc">{{ packageInfo.packageDiscription }}</div>
                    </div>
                    <div class="cyc">
                        <div class="cyc-price">￥ {{ packageInfo.goodsFee | unit }}</div>
                        <div class="cyc-time">x {{ packageInfo.specName }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="invoicing-title">开票信息</div>
        <div class="invoicing-form" v-if="!invoiceInfo">
            <van-field v-model="invoicingType" label="发票类型" readonly input-align="right" />
            <van-field v-model="invoicingCourse" label="发票项目" readonly input-align="right" />
            <van-field label="抬头类型" label-width="168px" input-align="right">
                <template #input>
                    <van-radio-group v-model="titleType" direction="horizontal" @change="titleTypeChange">
                        <van-radio :name="1" checked-color="#32AE57">个人</van-radio>
                        <van-radio :name="2" checked-color="#32AE57">单位</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field v-model="titleName" required label="抬头名称" placeholder="请输入" input-align="right" />
            <transition name="fade">
                <div v-if="titleType == 2">
                    <van-field v-model="unitNo" required label="单位税号" placeholder="请输入" input-align="right" />
                    <transition name="fade">
                        <div v-show="expand">
                            <van-field v-model="address" label="注册地址" placeholder="请输入" input-align="right" />
                            <van-field v-model="registerPhone" label="注册电话" placeholder="请输入" input-align="right" />
                            <van-field v-model="bankName" label="开户银行" placeholder="请输入" input-align="right" />
                            <van-field v-model="bankNo" label="银行账号" placeholder="请输入" input-align="right" />
                        </div>
                    </transition>
                    <div class="invoicing-form-more">
                        <div class="invoicing-form-more-btn" @click="more">
                            <van-icon name="arrow-down" class="rotatable" :class="{ 'rotated': expand }" />
                            <span v-if="!expand">更多选填项</span>
                            <span v-if="expand">收起选填项</span>
                        </div>
                    </div>
                </div>
            </transition>
            <van-field v-model="email" required label="收票邮箱" placeholder="请输入" input-align="right" />
            <div class="invoicing-form-confirm">
                <van-button type="primary" block color="#32AE57" round :disabled="calcSubmitState" @click="submit">确定</van-button>
            </div>
        </div>
        <div class="invoicing-info" v-if="invoiceInfo">
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">发票类型</span>
                <span class="invoicing-info-item-content">电子普通发票</span>
            </div>
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">发票项目</span>
                <span class="invoicing-info-item-content">*现代服务*服务费</span>
            </div>
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">抬头类型</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.titleType == 1 ? '个人' : '单位' }}</span>
            </div>
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">抬头名称</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.titleName }}</span>
            </div>
            <div class="invoicing-info-item" v-if="invoiceInfo.taxId">
                <span class="invoicing-info-item-title">单位税号</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.taxId }}</span>
            </div>
            <div class="invoicing-info-item" v-if="invoiceInfo.registerAddress">
                <span class="invoicing-info-item-title">注册地址</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.registerAddress }}</span>
            </div>
            <div class="invoicing-info-item" v-if="invoiceInfo.registerPhone">
                <span class="invoicing-info-item-title">注册电话</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.registerPhone }}</span>
            </div>
            <div class="invoicing-info-item" v-if="invoiceInfo.depositBank">
                <span class="invoicing-info-item-title">开户银行</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.depositBank }}</span>
            </div>
            <div class="invoicing-info-item" v-if="invoiceInfo.bankAccount">
                <span class="invoicing-info-item-title">银行账号</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.bankAccount }}</span>
            </div>
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">收票邮箱</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.email }}</span>
            </div>
            <div class="invoicing-info-item">
                <span class="invoicing-info-item-title">申请时间</span>
                <span class="invoicing-info-item-content">{{ invoiceInfo.createTime }}</span>
            </div>
        </div>
        <invocing-questions v-if="invoiceInfo"></invocing-questions>
    </div>
</template>

<script>
import invocingQuestions from "./components/questions.vue"
export default {
    components: {
        invocingQuestions
    },
    data() {
        return {
            packageInfo: {},
            invoiceInfo: {},
            invoicingType: '电子普通发票',
            invoicingCourse: '*现代服务*服务费',
            titleType: 1,
            titleName: '',
            unitNo: '',
            address: '',
            bankName: '',
            bankNo: '',
            email: '',
            registerPhone: '',
            expand: false,
        }
    },
    computed: {
        calcSubmitState() {
            if (this.titleType == 2) {
                if (this.titleName && this.unitNo && this.email) {
                    return false
                } else {
                    return true
                }
            }else if (this.titleType == 1) {
                if (this.titleName && this.email) {
                    return false
                } else {
                    return true
                }
            }else {
                return false
            }

        }
    },
    filters: {
        unit(val) {
            if (!val) {
                return '0.00'
            }
            return (val / 100).toFixed(2);
        },
    },
    created() {
        this.getOrderInfo()
    },
    methods: {
        getOrderInfo() {
            this.$apis.getOrderInfo({
                orderId: this.$route.query.orderId
            }).then(res => {
                this.packageInfo = res.retData
                this.invoiceInfo = res.retData.platOrderInvoiceTitleDto
            })
        },
        more() {
            this.expand = !this.expand
        },
        titleTypeChange(type) {
            if (type == 1) {
                this.expand = false,
                    this.unitNo = '',
                    this.address = '',
                    this.bankName = '',
                    this.bankNo = ''
            }
        },
        submit() {
            this.$apis.issueInvoices({
                payOrderId: this.$route.query.orderId,
                titleType: this.titleType,
                titleName: this.titleName,
                email: this.email,
                taxId: this.unitNo,
                registerAddress: this.address,
                registerPhone: this.registerPhone,
                depositBank: this.bankName,
                bankAccount: this.bankNo,
                createId: '',
                createTime: '',
                updateId: '',
                updateTime: '',
                titleId: ''
            }).then(res => {
                this.getOrderInfo()
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.invoicing {
    // touch-action: none;

    &-course {
        height: 195px;
        background: linear-gradient(180deg, #FFAC41 1%, #f8f9fc 100%);
        padding: 24px 12px;

        &-container {
            height: 142px;
            background-color: #FFF;
            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
            border-radius: 8px;
            padding: 7px 12px 18px;
            // display: flex;
            // justify-content: space-between;
            &-hos {
                height: 22px;
                line-height: 22px;
                display: flex;
                align-items: center;
                margin-bottom: 15px;

                img {
                    height: 14px;
                    width: 14px;
                }

                span {
                    display: inline-block;
                    height: 22px;
                    font-size: 12px;
                    font-weight: normal;
                    line-height: 22px;
                    letter-spacing: 0.2px;
                    color: #111111;
                    margin-left: 6px;
                    position: relative;
                    top: 1px;
                }
            }

            &-info {
                display: flex;
                justify-content: space-between;
                // white-space: nowrap;
                // overflow: hidden;
                // text-overflow: ellipsis;
                width: calc(100%);

                img {
                    height: 80px;
                    width: 80px;
                    min-width: 80px;
                }

                .info2 {
                    padding-left: 10px;
                    margin-right: auto;
                    width: 80px;
                    flex: 1;
                    // white-space: nowrap;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // word-break: break-all;

                    &-title {
                        font-size: 15px;
                        font-weight: 500;
                        line-height: 22px;
                        letter-spacing: 0.2px;
                        color: #111111;
                        margin-bottom: 9px;
                    }

                    &-desc {
                        // display: inline-block;
                        // width: calc(100%);
                        font-size: 12px;
                        font-weight: normal;
                        // line-height: 16px;
                        letter-spacing: 0.2px;
                        color: #666666;
                        // -webkit-line-clamp: 2;
                        // -webkit-box-orient: vertical;
                        // overflow: hidden;
                        // text-overflow: ellipsis;
                        // word-break: break-all;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        word-break: break-all;
                        line-height: 20px;
                        height: 40px;
                    }
                }

                .cyc {
                    min-width: 71px;
                    width: 71px;

                    &-price {
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 22px;
                        text-align: right;
                        letter-spacing: 0.2px;
                        color: #111111;
                    }

                    &-time {
                        font-size: 12px;
                        font-weight: normal;
                        line-height: 22px;
                        text-align: right;
                        letter-spacing: 0.2px;
                        color: #666666;
                    }
                }
            }
        }
    }

    &-title {
        padding: 0px 14px 11px 14px;
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.2px;
        color: #333333;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            width: 3px;
            height: 16px;
            border-radius: 1.5px;
            background: #32AE57;
            display: inline-block;
            margin-right: 7px;
        }
    }

    &-form {
        padding-bottom: 80px;

        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.5s;
        }

        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }

        &-more {
            height: 64px;
            display: flex;
            justify-content: center;
            align-items: center;

            &-btn {
                height: 24px;
                width: 105px;
                border: 1px solid #32AE57;
                border-radius: 353px;
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                letter-spacing: 0.2px;
                color: #00982D;
                display: flex;
                justify-content: center;
                align-items: center;

                .rotatable {
                    transition: transform 0.3s ease;
                }

                .rotated {
                    transform: rotate(180deg);
                }
            }
        }

        &-confirm {
            height: 60px;
            background-color: #FFF;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding-left: 14px;
            padding-right: 14px;
        }
    }

    &-info {
        padding: 10px 12px;
        margin: 0px 11px;
        background-color: #FFF;

        &-item {
            display: flex;
            justify-content: space-between;
            line-height: 25px;
            height: 25px;

            &-title {
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                letter-spacing: 0px;
                color: #666666;
            }

            &-content {
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                text-align: right;
                letter-spacing: 0px;
                color: #111111;
            }
        }
    }
}
</style>

<style lang="scss">
.invoicing {
    .van-cell__title {
        color: #333333;
    }

    .van-button--normal {
        font-size: 16px;
    }
}
</style>