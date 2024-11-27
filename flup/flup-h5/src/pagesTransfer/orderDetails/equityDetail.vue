<template>
    <div class="equityDetail">
        <div class="equityDetail-top">
            <div class="equityDetail-top-title">
                <div class="equityDetail-top-title-line">{{ packageName }}</div>
                <div class="equityDetail-top-title-line">{{ packageDiscription }}</div>
            </div>
            <equity :equityList="equityList" :padd=true></equity>
        </div>
        <div class="equityDetail-content">
            <div class="equityDetail-content-container todoTask" v-for="(item, index) in platOrderVerifyLogsList"
                :key="index">
                <u></u>
                <div class="tlsContent">
                    <div v-for="(iten, indez) in item.operateContentList" :key="indez" class="tlsContent-line">
                        <div class="tAg adjust" v-if="item.operateType == 1">核销</div>
                        <div class="tAg veri" v-if="item.operateType == 2">调整</div>
                        <span class="tlsContent-line-right">{{ iten.slice(2) }}</span>
                    </div>
                    <div v-if="item.remark" class="tlsContent-remark">备注: {{ item.remark }}</div>
                    <div v-if="item.operateTime || item.operatorUserName" class="tlsContent-time">{{ item.operateTime
                        }}{{ item.operatorUserName }}</div>
                    <div class="tlsContent-log" @click="grade(item)" v-if="item.operateType == 1">{{ item.isComplete ? "查看问卷" : "填写问卷" }}<van-icon
                            name="arrow" color="#0079FD" /></div>
                </div>
            </div>
        </div>
        <van-dialog v-model="gradeShow" title="满意度调查问卷" @confirm="gradeConform" :show-cancel-button="!gradeOnlyRead"
            theme="round-button" confirm-button-color="#32AE57" cancel-button-color="#FF9035"
            :confirm-button-text="gradeOnlyRead ? '确定' : '提交评价'">
            <grade ref="messageGrade"></grade>
        </van-dialog>
    </div>
</template>

<script>
import equity from "./components/equity.vue"
import grade from "../chat/message-list/message-elements/grade.vue"
export default {
    components: {
        equity,
        grade
    },
    data() {
        return {
            equityList: [],
            packageName: "",
            packageDiscription: "",
            platOrderVerifyLogsList: [],
            gradeShow: false,
            recordId: "",
            gradeOnlyRead: false
        }
    },
    created() {
        this.getOrderInfo()
    },
    methods: {
        async getOrderInfo() {
            let { retData } = await this.$apis.getOrderInfo({
                orderId: this.$route.query.serialNo,
            });
            this.equityList = retData.platOrderVerifyItemsList
            this.packageName = retData.packageName
            this.packageDiscription = retData.specName
            let arr = retData.platOrderVerifyLogsList
            arr.forEach(i => {
                i.operateContentList = i.operateContents.split("；")
            })
            this.platOrderVerifyLogsList = arr
        },
        grade(item) {
            this.gradeShow = true
            this.recordId = item.recordId
            this.$apis.getSatisfaction(item.recordId).then(res => {
                if (res.retData.sumValue) {
                    let gradeChild = this.$refs.messageGrade
                    this.gradeOnlyRead = true
                    this.$nextTick(() => {
                        gradeChild.init(res.retData.sumValue, res.retData.procedureValue, res.retData.serviceValue, res.retData.advice, true)
                    })
                } else {
                    this.gradeShow = true
                    let gradeChild = this.$refs.messageGrade
                    this.gradeOnlyRead = false
                    this.$nextTick(() => {
                        gradeChild.init()
                    })
                }
                console.log(this.gradeShow)
            })
        },
        gradeConform() {
            if (this.gradeOnlyRead) {
                this.gradeShow = false
            } else {
                let gradeChild = this.$refs.messageGrade
                this.$apis.submitSatisfaction({
                    sumValue: gradeChild.sumValue,
                    procedureValue: gradeChild.procedureValue,
                    serviceValue: gradeChild.serviceValue,
                    advice: gradeChild.advice,
                    recordId: this.recordId
                }).then(res => {
                    this.gradeShow = false
                    this.getOrderInfo()
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.equityDetail {
    &-top {
        background: linear-gradient(180deg, #39B95F 43%, rgba(150, 255, 181, 0) 100%);
        padding: 15px 12px;

        &-title {
            font-size: 20px;
            font-weight: 500;
            line-height: 19px;
            letter-spacing: 0.2px;
            color: #FFFFFF;
            margin-bottom: 16px;

            &-line {
                line-height: 30px;
            }
        }
    }

    &-content {
        padding: 14px;

        &-container {
            position: relative;
            padding-bottom: 14px;
            overflow: hidden;

            &::before {
                content: "";
                display: block;
                width: 1px;
                height: 1000px;
                position: absolute;
                top: 0;
                left: 11px;
                background: #c6c9ce;
            }

            u {
                display: block;
                width: 9px;
                height: 9px;
                border-radius: 9px;
                background: #c6c9ce;
                position: absolute;
                left: 7px;
                top: 50%;
                transform: translate(0, -11.5px);
            }

            .tlsContent {
                position: relative;
                padding: 11px 14px 8px;
                margin-left: 36px;
                border-radius: 8px;
                background: #ffffff;

                &-line {
                    font-size: 15px;
                    font-weight: 500;
                    // line-height: 9px;
                    letter-spacing: 0.2px;
                    color: #111111;
                    margin-bottom: 8px;
                    display: flex;

                    .tAg {
                        font-size: 12px;
                        font-weight: 500;
                        width: 30px;
                        height: 20px;
                        min-width: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 11px;
                    }

                    .adjust {
                        border: 1px solid #425F7E;
                        color: #425F7E;
                    }

                    .veri {
                        border: 1px solid #0079FD;
                        color: #0079FD;
                    }
                }

                &-remark {
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 17px;
                    letter-spacing: 0.2px;
                    color: #408755;
                    margin-bottom: 7px;
                }

                &-time {
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 17px;
                    letter-spacing: 0.2px;
                    color: #A0A5AD;
                }

                &-log {
                    position: absolute;
                    bottom: 8px;
                    right: 10px;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 19px;
                    letter-spacing: 0.2px;
                    color: #0079FD;
                }
            }

            &:first-child {
                &::before {
                    top: 50%;
                    transform: translate(0, -7px);
                }
            }

            &:last-child {
                &::before {
                    top: inherit;
                    bottom: 50%;
                    transform: translate(0, -7px);
                }
            }
        }

        .todoTask {
            u {
                width: 21px;
                height: 21px;
                border-radius: 0;
                background: url("../../assets/images/u-bg.png") no-repeat;
                left: 2px;
                top: 50%;
                transform: translate(0, -18.5px);
            }
        }
    }
}
</style>

<style lang="scss">
.equityDetail {
    .tlsContent {
        .van-tag {
            position: relative;
            bottom: 2px;
            height: 20px;
            max-height: 20px;
        }
    }
}
</style>