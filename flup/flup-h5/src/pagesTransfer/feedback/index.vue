<template>
    <div class="feedback">
        <van-tabs v-model="activeName" @click="tabClick">
            <van-tab title="最新记录" name="1">
                <div style="height: 46px;"></div>
                <record :feedbackInfo="feedbackInfo" :imageList="imageList"></record>
                <div class="btn-box">
                    <van-button type="primary" block @click="add">新增</van-button>
                </div>
            </van-tab>
            <van-tab title="历史记录" name="2">
                <div style="height: 46px;"></div>
                <div class="feed-container">
                    <div v-for="(item, index) in feedbackList" :key="index" class="feedback-list" @click="feedbackDetail(item)">
                        <div class="feedback-list-time">{{ item.createTime }}</div>
                        <div class="feedback-list-advice">{{ item.advice }}</div>
                        <div class="bOr"></div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import { ImagePreview } from "vant";
import record from "./components/record.vue"
export default {
    data() {
        return {
            activeName: 1,
            feedbackInfo: null,
            feedbackList: [],
            imageList: []
        }
    },
    components: { record },
    filters: {
        unit(val) {
            if (!val) {
                return '0.00'
            }
            return (val / 100).toFixed(2);
        },
    },
    created() {
        this.getlist()
        this.getLastList()
    },
    methods: {
        tabClick(tab) {
            if(tab == 1) {
                this.getLastList()
            }else {
                this.getlist()
            }
        },
        add() {
            this.$router.push({
                path: '/feedbackAdd'
            })
        },
        getlist() {
            this.$apis.getFeedbackList().then(res => {
                this.feedbackList = res.retData

            })
        },
        feedbackDetail(item){
            this.$router.push({
                path: '/feedbackDetail',
                query: {
                    recordId: item.recordId,
                    activeName: 2
                }
            })
        },
        viewImg(index) {
            ImagePreview({
                images: this.imageList,
                startPosition: index,
            });
        },
        getLastList() {
            this.$apis.getLastFeedbackList().then(res => {
                this.feedbackInfo = res.retData
                let ids = []
                if (res.retData.fileIds) {
                    ids = res.retData.fileIds.split(",")
                }
                this.getImageList(ids)
            })
        },
        async getImageList(ids) {
            this.imageList = []
            for (let i = 0; i < ids.length; i++) {
                // let blob = await this.$apis.getImageInfo(ids[i])
                // let binaryData = [];
                // binaryData.push(blob);
                // let url = window.URL.createObjectURL(new Blob(binaryData));
                // this.imageList.push(url)
                this.imageList.push(this.$baseURL.ICDMApiUrl + "/file/image/" + ids[i])
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.feedback {
    .feedback-list {
        height: 78px;
        line-height: 78px;
        // padding: 17px 12px 0px;
        background: #fff;
        // height: 60px;
        &-time {
            font-size: 14px;
            font-weight: normal;
            line-height: 17px;
            letter-spacing: 0.2px;
            color: #333333; 
            padding: 17px 12px 0;
        }

        &-advice {
            font-size: 15px;
            font-weight: normal;
            line-height: 22px;
            letter-spacing: 0.2px;
            color: #111111;
            margin-bottom: 14px;
            padding: 2px 12px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .bOr {
            background: rgba(255, 255, 255, 0.01);
            box-shadow: inset 0px 0.5px 0px 0px #E2E2E2;
            height: 1px;
        }
    }
    .feed-container {
        // margin-top: 54px; 
    }
    .btn-box {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 10px;
        background: #fff;
    }
}
</style>

<style lang="scss">
.feedback {
    .van-tabs {
        .van-tabs__wrap {
            z-index: 999;
        }
    }
    .btn-box {
        .van-button  {
            border-radius: 100px;
        }
    }
}
</style>

