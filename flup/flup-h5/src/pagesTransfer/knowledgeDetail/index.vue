<template>
    <div class="knowledgeDetail">
        <img class="knowledgeDetail-img" v-if="iconUrl" :src="iconUrl" alt="">
        <img class="knowledgeDetail-img" v-else src="@/assets/images/bg.png" alt="">
        <div class="knowledgeDetail-info">
            <div class="knowledgeDetail-info__title">{{ knowledgeName }}</div>
            <div class="knowledgeDetail-info__time">
                <div>{{ updateTime }}</div>
                <div class="sight">
                    <img class="sight__img" src="@/assets/images/icon/yes.png" alt="">
                    <span>{{ clickNum }}</span>
                </div>
            </div>
            <div class="knowledgeDetail-info__summary">
                <span>{{ knowledgeDiscription }}</span>
            </div>
            <!-- 富文本 -->
            <div v-if="richText" class="knowledgeDetail-info__rich" @click="imageChgange($event)" v-html="richText"></div>
        </div>
    </div>
</template>
<script>
import { ImagePreview } from "vant";
export default{
    data(){
        return {
            serialNo:'',
            richText:'',
            knowledgeName:'',//标题
            createTime:'',//创建时间
            iconUrl:'',//image
            knowledgeDiscription:'',
            clickNum:'',
            updateTime:''
        }
    },
    mounted(){
        this.serialNo = this.$route.query.serialNo;
        this.init();
    },
    methods:{
        //图片预览
        imageChgange(e) {
            if (e.target.nodeName == "IMG") {
                ImagePreview({
                    images: [e.target.currentSrc], //e.target.currentSrc  当前图片src
                    showIndex: false,
                    loop: false,
                }); 
            } else {
                return;
            }
        },
        //初始化
        async init(){
            let params = {
                serialNo:this.serialNo,
            }
            let { retData } = await this.$apis.getKnowledgeContent(params);
            this.knowledgeName = retData.knowledgeName;
            this.createTime = retData.createTime;
            this.updateTime = retData.updateTime;
            this.richText = retData.knowledgeContentHtml;
            this.iconUrl = retData.iconUrl;
            this.knowledgeDiscription = retData.knowledgeDiscription;
            this.clickNum = retData.clickNum
        }
    }
}
</script>
<style lang="scss" scoped>
.knowledgeDetail{
    width: 100%;
    height: 100%;
    background-color:#fff;
    &-img{
        width: 100%;
        object-fit: contain;
    }
    &-info{
        padding:16px 14px;
        &__title{
            font-size: 17px;
            font-weight: 600;
            line-height: 19px;
            color: #111111;
        }
        &__time{
            margin-top:14px;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: normal;
            line-height: 14px;
            color: #999999;
            .sight{
                display: flex;
                align-items: center;
                &__img{
                    width:14px;
                    height: 10px;
                    margin:0 4px 0 18px;
                }
            }
        }
        &__summary{
            margin-top:24px;
            padding:10px;
            background: #F6F6F6;
            border-radius:4px;
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;
            color: #666666;
            span{
                text-overflow: ellopsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                word-break: break-all;
            }
        }
        &__rich{
            font-size: 15px;
            font-weight: normal;
            line-height: 30px;
            color: #111111;
            margin-top:16px;
        }
    }
}
</style>