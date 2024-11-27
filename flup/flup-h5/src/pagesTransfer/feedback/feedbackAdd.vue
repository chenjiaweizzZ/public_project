<template>
    <div class="feedbackAdd">
        <div class="form-container">
            <div class="feedbackAdd-line ccnter feedbackAdd-sta">
                <div class="feedbackAdd-line-title spce">
                    满意度
                    <span class="feedbackAdd-line-title-tip">*</span>
                </div>
                <div class="rate-box">
                    <van-rate v-model="satisfactionValue" :size="25" void-icon="star" void-color="#eee" 
                        @change="rateChange" />
                </div>
                <div class="rate-title">
                        {{ rateTitle }}
                    </div>
            </div>
            <div class="feedbackAdd-line feedbackAdd-feed">
                <div class="feedbackAdd-line-title fedd-title">
                    反馈与建议
                    <span class="feedbackAdd-line-title-tip">*</span>
                </div>
            </div>
            <div class="bOr"></div>
            <div class="feedbackAdd-line">
                <div class="textarea-box">
                    <van-field v-model="advice" rows="10" autosize label="" type="textarea" placeholder="请详细描述您的反馈内容"
                        maxlength="1000" show-word-limit />
                </div>
            </div>
            <div class="feedbackAdd-line feedbackAdd-img">
                <div class="feedbackAdd-line-title3">
                    图片信息
                </div>
                <div class="feedbackAdd-line-title2">
                    (上传问题相关的图片或截图)
                </div>
            </div>
            <div class="bOr"></div>
            <div class="feedbackAdd-line">
                <div class="feedbackAdd-line-imgs">
                    <div class="feedbackAdd-line-img" v-for="(item, index) in imageList" :key="index">
                        <img :src="item" @click="viewImg(index)">
                        <img src="../../assets/images/delect.png" class="delete-icon" @click="deleteImg(index)">
                    </div>
                    <div class="feedbackAdd-line-img" v-if="imageList.length < 6">
                        <img src="../../assets/images/addPhoto.png" alt="" @click="getImage()">
                    </div>
                </div>
            </div>
            <div class="feedbackAdd-line feedbackAdd-order">
                <div class="feedbackAdd-line-title">
                    订单信息
                </div>
                <div class="textarea-box">
                    <van-swipe-cell>
                        <van-cell :title="orderInfo.packageName"  is-link center @click="selectOrder()" class="van-cell2" />
                        <template #right>
                            <van-button square type="danger" text="删除" @click="del"/>
                        </template>
                    </van-swipe-cell>
                    <!-- <van-cell :title="orderInfo.packageName"  is-link center
                        @click="selectOrder()" class="van-cell2" /> -->
                    <!-- <p>如您的反馈与建议有相对应的订单,请选择</p> -->
                </div>
            </div>
            <transition name="fade">
                <div class="feedbackAdd-order-tip" v-if="orderInfo.serialNo">左滑可以取消订单<img src="@/assets/images/left-scroll.png" alt=""></div>
            </transition>
        </div>
        <van-action-sheet v-model="show" title="请选择订单">
            <div class="content">
                <div class="orderList-list__item" v-for="item in orderList" :key="item.serialNo" @click="select(item)">
                    <div class="title">
                        <div class="title-left">
                            <img class="title-left__img" src="@/assets/images/icon/hospital.png" alt="">
                            <span class="title-left__text">{{ item.sourceName }}</span>
                        </div>
                        <div class="title-right"
                            :class="{ 'gray': item.flowStatus == 1 || item.flowStatus == 2 || item.flowStatus == 3 || item.flowStatus == 5 || item.flowStatus == 6 || item.flowStatus == 7 }">
                            <van-count-down v-if="item.flowStatus == 0" class="title-right__time" format="mm:ss"
                                :time="item.countDown" @finish="downFinish(item.serialNo)" />
                            <span v-if="item.flowStatus == 0">待支付</span>
                            <span v-else-if="item.flowStatus == 1">待发货</span>
                            <span v-else-if="item.flowStatus == 2">待收货</span>
                            <span v-else-if="item.flowStatus == 3">待核销</span>
                            <span v-else-if="item.flowStatus == 4 || item.flowStatus == 11">退款中</span>
                            <span v-else-if="item.flowStatus == 5">完成</span>
                            <span v-else-if="item.flowStatus == 6">已取消</span>
                            <span v-else-if="item.flowStatus == 7">已退款</span>
                            <span v-else-if="item.flowStatus == 8">退款失败</span>
                        </div>
                    </div>
                    <div class="info">
                        <img class="info-img" :src="item.packagePreviewUrl" alt="">
                        <div class="info-right">
                            <div class="designation">
                                <div class="designation-text">{{ item.packageName }}</div>
                                <div class="designation-money">￥ {{ item.specPrice | unit }}</div>
                            </div>
                            <div class="suggest">
                                <div class="suggest-left">
                                    <span>{{ item.packageDiscription }}</span>
                                </div>
                                <div class="suggest-right">x {{ item.specName }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="operate">
                        <div class="operate-left">
                            <span class="operate-left__text">订单金额</span>
                            <div class="operate-left__num"><span class="text">¥</span><span>{{ item.fee | unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-action-sheet>
        <div class="btn-box">
            <van-button type="primary" block @click="submit2">提交</van-button>
        </div>
    </div>
</template>

<script>
import { ImagePreview } from "vant";
import wx from "weixin-js-sdk"
import axios from 'axios'
export default {
    data() {
        return {
            satisfactionValue: 0,
            advice: '',
            rateTitle: '',
            imageList: [],
            // imageList2: [],
            base64List: [],
            show: false,
            orderList: [],
            orderInfo: {
                packageName: '如您有相对应的订单，请选择',
                packageDiscription: '',
                serialNo: ''
            },
            viewShow: false,
            startPosition: 0
        }
    },
    mounted() {
        this.init();
        this.getOrderList()
    },
    filters: {
        unit(val) {
            if (!val) {
                return '0.00'
            }
            return (val / 100).toFixed(2);
        },
    },
    methods: {
        async init() {
            let res = await this.$apis.getWxConfigParam({
                url: window.location.href.split("#")[0],
            });
            let info = res.retData;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: info.appId, // 必填，公众号的唯一标识
                timestamp: info.timestamp, // 必填，生成签名的时间戳
                nonceStr: info.nonceStr, // 必填，生成签名的随机串
                signature: info.signature, // 必填，签名
                jsApiList: ["chooseImage", "getLocalImgData"], // 必填，需要使用的JS接口列表
            });
        },
        deleteImg(index) {
            console.log(index)
            console.log(this.imageList)
            this.imageList.splice(index, 1)
        },
        viewImg(index) {
            ImagePreview({
                images: this.imageList,
                startPosition: index,
            });
        },
        // onChange(index) {
        //     this.index = index;
        // },
        getOrderList() {
            let params = {
                pageNo: 1,
                pageSize: 999
            }
            this.$apis.getOrderList(params).then(res => {
                console.log(res)
                this.orderList = res.retData.list
                console.log(this.orderList)
            })
        },
        rateChange(rate) {
            switch (rate) {
                case 1:
                    this.rateTitle = "非常不满意"
                    break;
                case 2:
                    this.rateTitle = "不满意"
                    break;
                case 3:
                    this.rateTitle = "一般"
                    break;
                case 4:
                    this.rateTitle = "满意"
                    break;
                case 5:
                    this.rateTitle = "非常满意"
                    break;
                default:
                    break;
            }
        },
        getImage() {
            let that = this
            wx.chooseImage({
                count: 6 - that.imageList.length, // 默认9
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    let localIds = res.localIds
                    console.log("--------------------")
                    localIds.forEach(i => {
                        wx.getLocalImgData({
                            localId: i.toString(),
                            success: function (info) {
                                let localData = info.localData;
                                if (localData.indexOf("data:image") != 0) {
                                    //判断是否有这样的头部
                                    localData = "data:image/jpeg;base64," + localData;
                                }
                                localData = localData
                                    .replace(/\r|\n/g, "")
                                    .replace("data:image/jgp", "data:image/jpeg");
                                let file = that.base64toFile(localData);
                                let url = URL.createObjectURL(file)
                                that.base64List.push(file)
                                that.imageList.push(url)
                            }
                        })
                    })
                    console.log(that.base64List)
                    console.log(that.imageList)
                },
            });
        },
        toUrl(base64String, fileType = 'image/png') {
            const byteCharacters = atob(base64String);
            const byteArrays = [];

            // 将二进制数据分割成块，并将每个块转换为Uint8Array类型的字节数组
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            // 创建Blob对象
            const blob = new Blob(byteArrays, { type: fileType });
            // 创建Blob URL
            const url = URL.createObjectURL(blob);
            return url;
        },
        selectOrder() {
            this.show = true
            console.log(this.show)
        },
        select(item) {
            this.orderInfo = item
            this.show = false
        },
        base64toFile(dataurl, filename = "file") {
            let arr = dataurl.split(",");
            let mime = arr[0].match(/:(.*?);/)[1];
            let suffix = mime.split("/")[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${filename}.${suffix}`, {
                type: mime,
            });
        },
        base64toBlob(base64, type = 'application/octet-stream') {
            const bstr = atob(base64);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type });
        },
        del() {
            this.orderInfo = {
                packageName: '如您有相对应的订单，请选择',
                packageDiscription: '',
                serialNo: ''
            }
        },
        submit2() {
            if(this.satisfactionValue == 0 && !this.advice) {
                this.$toast('请填写满意度和反馈内容');
                return
            }
            if(this.satisfactionValue == 0) {
                this.$toast('请填写满意度');
                return
            }
            if(!this.advice) {
                this.$toast('请填写反馈内容');
                return
            }
            this.$toast.loading({
                message: '提交中...',
                forbidClick: true,
            })
            let that = this
            let formData = new FormData()
            if (this.base64List.length) {
                this.base64List.forEach(i => {
                    formData.append('pictures', i)
                })
            }
            formData.append('satisfactionValue', this.satisfactionValue)
            formData.append('advice', this.advice)
            formData.append('orderNo', this.orderInfo.serialNo)
            formData.append('patientUserId', JSON.parse(localStorage.getItem('userInfo')).userId)
            formData.append('patientName', JSON.parse(localStorage.getItem('userInfo')).patientName)
            axios({
                method: 'post',
                url: that.$baseURL.ICDMApiUrl + '/c/feedback/add',
                headers: {
                    openId: localStorage.getItem('openId') || (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).openId),
                    'content-type': 'multipart/form-data',
                },
                data: formData,
            }).then(res => {
                this.$toast.clear();
                this.$toast('新增成功');
                that.$router.go(-1)
            });
        },

    }
}
</script>

<style lang="scss" scoped>
.feedbackAdd {
    padding-bottom: 64px;
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
    .form-container {
        // padding: 30px 10px;
        margin-bottom: 100px;
        .bOr {
            background: rgba(255, 255, 255, 0.01);
            box-shadow: inset 0px 0.5px 0px 0px #E2E2E2;
            height: 1px; 
        }
    }

    &-line {
        display: flex;
        margin-bottom: 10px;
        background-color: #fff;

        .textarea-box {
            width: 100%;

            p {
                font-size: 11px;
                font-weight: normal;
                line-height: 19px;
                letter-spacing: 0px;
                color: #666666;
            }
        }

        &-title {
            width: 100px;
            min-width: 100px;
            // text-align: right;
            margin-left: 14px;
            font-size: 17px;
            font-weight: 600;
            line-height: 20px;
            letter-spacing: 0.2px;
            color: #111111;

            &-tip {
                color: #D9001B;
            }
        }
        &-title3 {
            // width: 100px;
            // min-width: 100px;
            // text-align: right;
            height: 47px;
            line-height: 47px;
            margin-left: 14px;
            font-size: 17px;
            font-weight: 600;
            letter-spacing: 0.2px;
            color: #111111;

            &-tip {
                color: #D9001B;
            }
        }
        &-title2 {
            font-size: 14px;
            font-weight: normal;
            letter-spacing: 0.2px;
            height: 47px;
            line-height: 47px;
            color: #999999;
            margin-left: 10px
        }

        // .spce {
        //     text-align: left;
        // }

        &-imgs {
            display: flex;
            flex-wrap: wrap;
            justify-content: start;
            width: 100%;

            .feedbackAdd-line-img {
                width: 30vw;
                height: 30vw;
                position: relative;
                margin: 6px;
                img {
                    width: 100%;
                    height: 100%;

                }

                .delete-icon {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 16px;
                    height: 16px;
                }
            }
        }



        .rate-title {
            font-size: 14px;
            font-weight: normal;
            line-height: 78px;
            height:74px;
            letter-spacing: 0px;
            color: #999999;
            margin-left: 30px;
        }
    }

    &-sta {
        height: 74px;
        line-height: 74px;
        display: flex;
        align-items: center;
        .rate-box {
            position: relative;
            top: 5px;
        }
    }

    &-feed {
       height: 46px; 
       line-height: 46px;
       margin-bottom: 0px;
       .fedd-title {
        height: 46px; 
        line-height: 46px;
       }
    }

    &-img {
        height: 46px;
        line-height: 46px;
        margin-bottom: 0px;
        .feedbackAdd-line-title {
            height: 46px;
            line-height: 46px;
        }
    }

    &-order {
        height: 54px;
        line-height: 54px;
        .feedbackAdd-line-title {
            height: 54px;
            line-height: 54px;
        }
    }

    &-order-tip {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #666666;
        margin-right: 16px;
        img {
            height: 24px;
            width: 24px;
        }
    }

    .ccnter {
        align-items: center;
    }

    .addImg {
        height: 30vw;
        width: 30vw;
    }

    .btn-box {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        padding: 10px;
        background: #fff;
    }

    .orderList-list__item {
        padding: 7px 12px 14px;
        border-radius: 8px;
        background: #FFFFFF;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
        margin-top: 12px;

        .title {
            display: flex;

            &-left {
                flex: 1;
                display: flex;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &__img {
                    width: 14px;
                    height: 14px;
                }

                &__text {
                    flex: 1;
                    margin: 0 6px;
                    font-size: 12px;
                    font-weight: normal;
                    line-height: 22px;
                    color: #111111;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            &-right {
                font-size: 15px;
                font-weight: 600;
                line-height: 22px;
                color: #DC8F13;
                display: flex;
                align-items: center;

                &__time {
                    font-size: 15px;
                    line-height: 22px;
                    margin-right: 6px;
                    color: #DC8F13;
                }
            }

            .gray {
                color: #999999;
            }
        }

        .info {
            margin-top: 13px;
            display: flex;

            &-img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 10px;
            }

            &-right {
                // flex:1;
                width: 237px;

                .designation {
                    margin-top: 4px;
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    line-height: 22px;
                    color: #111111;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &-text {
                        flex: 1;
                        font-size: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-right: 6px;
                    }

                    &-money {
                        flex-shrink: 0;
                        font-size: 14px;
                    }
                }

                .suggest {
                    width: 100%;
                    color: #666666;
                    display: flex;
                    margin-top: 9px;

                    &-left {
                        flex: 1;
                        font-size: 15px;
                        margin-right: 6px;

                        span {
                            font-size: 12px;
                            line-height: 16px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                            word-break: break-all;
                        }
                    }

                    &-right {
                        max-width: 100px;
                        flex-shrink: 0;
                        font-size: 12px;
                        font-weight: normal;
                        line-height: 16px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                    }
                }
            }
        }

        .operate {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 9px;

            &-left {
                font-weight: 600;
                display: flex;
                align-items: flex-end;

                &__text {
                    font-size: 12px;
                    color: #111111;
                    margin-right: 5px;
                    line-height: 16px;
                }

                &__num {
                    display: flex;
                    align-items: baseline;
                    font-size: 18px;
                    color: #FF5500;

                    .text {
                        font-size: 14px;
                        line-height: 14px;
                        margin-right: 2px;
                    }

                    span {
                        line-height: 18px;
                        vertical-align: bottom;
                    }
                }
            }

            &-btns {
                display: flex;
                align-items: center;

                .btn {
                    padding: 4px 12px;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 18px;
                    color: #333333;
                    border: 1px solid #BEBEBE;
                    border-radius: 13px;

                    &:active {
                        opacity: .8;
                    }
                }

                .orange {
                    border-color: #FF5500;
                    color: #FF5500;
                }

                .btn+.btn {
                    margin-left: 9px;
                }
            }

            &-btns-toright {
                margin-left: auto;
            }

            &-img {
                width: 20px;
                height: 20px;
            }

            &-spot {
                position: relative;

                &::before {
                    content: '';
                    position: absolute;
                    right: 0px;
                    top: 0px;
                    z-index: 10;
                    width: 6px;
                    height: 6px;
                    background-color: #f00;
                    border-radius: 50%;
                }
            }

            .left-10px {
                margin-left: 10px;
            }
        }
    }
}
</style>

<style lang="scss">
.feedbackAdd {
    .van-cell {
        padding: 12px 15px 16px;
    }

    .van-field__word-limit {
        top: auto;
        bottom: -10px;
    }

    .van-cell2 {
        height: 100%;
        padding: 10px 16px;
    }

    .btn-box {
        .van-button {
            height: 44px;
            border-radius: 100px;
        }
    }

    .van-rate__icon--full {
        -webkit-text-fill-color: transparent;
        color: transparent;
        background: linear-gradient(164deg, #FFD55F 27%, #FE8C00 94%);
        -webkit-background: linear-gradient(to bottom, #ffeed1, #daba82);
        -webkit-background-clip: text;
        background-clip: text;
    }
    .van-swipe-cell {
        height: 54px;
        .van-button {
            height: 54px;
            line-height: 54px;
            position: relative;
            top: -5px;
        }
    }
    .van-swipe-cell__wrapper {
        height: 54px;
    }
    .van-cell__title {
        display: flex;
        flex-direction: row-reverse;
    }
    .feedbackAdd-order {
        .van-cell2 {
            height: 56px;
        }
    }
}
</style>