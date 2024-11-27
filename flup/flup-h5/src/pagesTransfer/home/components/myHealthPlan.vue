<template>
    <div class="health-plan" v-if="patient && planList.length > 0">
        <div class="health-plan__title health-plan__title_health_plan">
            <span class="health-plan__text">我的健康计划</span>
            <span class="more">
                <span class="more-text" @click="more">更多</span>
                <img src="../../../assets/images/home/more2.png" alt="">
            </span>
        </div>
        <div class="health-plan-tabs">
            <span class="health-plan-tabs-tab" v-for="(item, index) in planList"
                :class="{ 'health-plan-tabs-tab-active': index == planIndex }" :key="index" @click="tabClick(index)">{{
        item.planName }}</span>
        </div>
        <div class="health-plan-list">
            <div class="health-plan-list-item" v-for="(item, index) in plan" :key="index">
                <div class="health-plan-list-item-date">
                    <img src="../../../assets/images/home/calendar.png">
                    <span>{{ item.date }}</span>
                </div>
                <div class="health-plan-list-item-sug">
                    <span class="health-plan-list-item-sug-item" :class="{ read: iten.readStatus == '已读' }" v-for="(iten, indez) in item.tasks" :key="indez"
                        @click="viewMyPlan(iten)">
                        <span class="health-plan-list-item-sug-item-left">{{ iten.taskContent }}</span>
                        <span class="health-plan-list-item-sug-item-right">
                            <img src="../../../assets/images/home/arrow-read.png" alt="" v-if="iten.readStatus == '已读'">
                            <img src="../../../assets/images/home/arrow.png" alt="" v-else>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            patient: null,
            patientList: [],
            planList: [],
            plan: [],
            planIndex: 0,
        }
    },
    async created() {
        // !JSON.parse(sessionStorage.getItem("defaultClientNew")) &&
        if (localStorage.getItem('openId') || (JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).openId)) {
            sessionStorage.getItem("defaultClient") && (this.patient = JSON.parse(sessionStorage.getItem("defaultClient")));
            this.getPatientList();
        }
    },
    methods: {
        tabClick(index) {
            index !== this.planIndex ? (this.planIndex = index, this.plan = this.planList[index].tasks || []) : ''
        },
        getPatientList() {
            this.$apis.getPatientList().then(res => {
                console.log(res)
                if (res.retData.list.length) {
                    this.patientList = res.retData.list.map(item => {
                        return {
                            text:
                                item.patientName +
                                "   " +
                                item.idNo.substring(0, 4) +
                                "***********" +
                                item.idNo.substring(item.idNo.length - 4),
                            value: item.userId
                        };
                    });
                    if (!this.patient) {
                        let index = res.retData.list.findIndex(i => {
                            return i.isDefault == 1;
                        });
                        if (index != -1) {
                            this.patient = this.patientList[index];
                        } else {
                            this.patient = this.patientList[0];
                        }
                        sessionStorage.setItem(
                            "defaultClient",
                            JSON.stringify(this.patient)
                        );
                    }
                    console.log(this.patientList,this.patient)
                    this.getRecent3DaysPlanTaskList();
                } else {
                    sessionStorage.setItem("defaultClient", "");
                }
            });
        },
        getRecent3DaysPlanTaskList() {
            this.$apis
                .getRecent3DaysPlanTaskList({
                    patientId: this.patient.value,
                    hospitalId: this.$route.query.hospitalId
                })
                .then(res => {
                    if (res && res.retData) {
                        this.planList = res.retData
                        this.plan = res.retData[0].tasks
                    }
                });
        },
        viewMyPlan(item) {
            sessionStorage.setItem("defaultClientNew", false);
            if (item.flupType == "专科随访") {
                this.$router.push({
                    path: "/taskDetail",
                    query: {
                        title: item.flupContent,
                        flupStartTime: item.flupStartTime.slice(0, 10),
                        flupAddress: item.flupAddress
                    }
                });
                return;
            }
            window.open(item.flupAddress, "_self");
        },
        more() {
            this.$router.push({
                path: '/FollowUp',
                query: {
                    openId: localStorage.getItem('openId')
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.health-plan {
    margin-bottom: 13px;

    &__title {
        color: #111111;
        line-height: 22px;
        font-size: 17px;
        font-weight: 600;
    }

    &__title_health_plan {
        display: flex;
        justify-content: space-between;

        .more {
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 500;
            line-height: 22px;
            letter-spacing: 0px;
            margin-right: 6px;
            &-text {
                color: #666666;
            }

            img {
                width: 12px;
                height: 12px;
            }
        }
    }

    &__text {
        display: inline-block;
        background-image: url("../../../assets/images/home/line.png");
        background-repeat: no-repeat;
        background-position: 0 13px;
        background-size: contain;
        line-height: 17px;
        height: 22px;
    }

    &-tabs {
        padding: 13px 0 16px;
        overflow-x: scroll;

        white-space: nowrap;

        &-tab {
            color: #111111;
            background: #FFFFFF;
            margin-right: 8px;
            padding: 4px 12px;
            font-size: 14px;
            letter-spacing: 0.2px;
            border: 1px solid #fff;
        }

        &-tab-active {
            color: #347346;
            border: 1px solid #549F6A;
            border-radius: 4px;
        }
    }

    &-list {
        padding-right: 5px;
        &-item {
            background-color: #fff;
            padding: 9px 12px;
            border-radius: 8px;
            box-shadow: 0px 1px 3px 0px rgba(103, 158, 133, 0.2);
            margin-bottom: 8px;
            &-date {
                display: flex;
                align-items: center;
                margin: 5px 0 9px;

                img {
                    width: 13px;
                    height: 13px;
                }

                span {
                    color: #111111;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.2px;
                    margin-left: 8px;
                }
            }

            &-sug {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                &-item {
                    width: 42vw;
                    display: flex;
                    // align-items: center;
                    justify-content: space-between;
                    height: 40px;
                    background: rgba(213, 247, 223, 0.48);
                    margin-bottom: 6px;
                    padding: 0px 6px 0px 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    &:nth-last-child(1) {
                        margin-bottom: 0px;
                    }

                    &-left {
                        font-size: 14px;
                        font-weight: 500;
                        height: 40px;
                        line-height: 40px;
                        letter-spacing: 0.2px;
                        color: #347346;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    &-right {
                        line-height: 40px;
                        img {
                            height: 5px;
                            width: 4px;
                        }
                    }
                }
                .read {
                    background: rgba(208, 220, 211, 0.48);
                    .health-plan-list-item-sug-item-left {
                        color: #333333;
                    }
                }
            }
        }
    }

    ::-webkit-scrollbar {
        display: none;
    }
}
</style>