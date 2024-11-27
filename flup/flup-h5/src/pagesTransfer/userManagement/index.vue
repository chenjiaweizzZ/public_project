<template>
    <div class="userManagement" :class="{'bguserManagement': list.length == 0}">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getPatientList"
            class="userManagement-list"
            :immediate-check="false"
            v-if="list.length > 0"
        >
        <!-- <div class="userManagement-list"> -->
            <div class="userManagement-list__item" v-for="item in list" :key="item.userId" @click="goUserDetails(item.userId)">
                <div class="left">
                    <div class="left-info">
                        <span class="left-info__name">{{ item.patientName }}</span>
                        <div class="left-info__sex"><span>／{{ item.sex }}</span><span> {{item.age}}岁</span></div>
                        <div class="left-info__tag" v-if="item.isDefault == 1">默认</div>
                    </div>
                    <div class="left-idcode">
                        <span class="left-idcode__text">身份证</span>
                        <span class="left-idcode__num">{{ item.idNo | hiddenCardId(4)}}</span>
                    </div>
                </div>
                <div class="right">
                    <!-- <img class="right-img" src="https://puui.qpic.cn/qqvideo_ori/0/z3318063tl0_1280_720/0" alt=""> -->
                    <div class="right-img">
                        <qrcode :text="item.idNo"></qrcode>
                    </div>
                    <div class="right-text">刷码出示</div>
                </div>
            </div>
        <!-- </div> -->
        </van-list>
        <div class="userManagement__emty" v-else>
            <img class="img" src="@/assets/images/emty.png" alt="">
            <div class="text">暂无用户</div>
        </div>
        <div class="userManagement-floor" v-if="list.length == 0 && requestEnd">
            <div class="userManagement-floor__btn" @click="jump"><van-icon name="plus" /><span class="text">新增</span></div>
        </div>
    </div>
</template>
<script>
import qrcode from './components/qrcode.vue';
export default{
    components:{
        qrcode
    },
    filters:{
        hiddenCardId(str,frontLen = 3,endLen = 4){
            if(!str){
                return str;
            }
            let len = str.length-frontLen-endLen;
            let start = '';   
            for (let i=0;i<len;i++) {
                start+='*';
            }
            return str.substring(0,frontLen)+start+str.substring(str.length-endLen);
        }
    },
    data(){
        return {
            list:[],
            pageNo:1,
            pageSize:20,
            loading: false,
            finished: true,
            requestEnd: false,
        }
    },
    mounted(){
        this.getPatientList()
    },
    methods:{
        //获取用户列表
        async getPatientList(){
            let res = await this.$apis.getPatientList({
                pageNo:this.pageNo,
                pageSize:this.pageSize
            });
            this.loading = false;
            this.pageNo++;
            this.list.push(...res.retData.list);
            this.requestEnd = true;
            if(res.retData.list.length != this.pageSize){
                this.finished = true;
            }else{
                this.finished = false;
            }
        },
        goUserDetails(userId){
            this.$router.push({
                path:'/userDetails',
                query:{
                    userId
                }
            })
        },
        jump(){
            this.$router.push({
                path:'/addUserManagement'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.userManagement{
    width: 100%;
    height: 100%;
    background: #F3F7F5;
    &-list{
        width: 100%;
        height: calc(100vh - 75px);
        padding:17px 12px 0px;
        overflow-y: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &__item{
            &::before{
                content:'';
                position: absolute;
                left:0px;
                top:0px;
                height: 100%;
                width: 4px;
                background: #00982D;
                z-index:1;
            }
            &:active{
                background-color: #eee;
            }
            width: 100%;
            padding:12px 14px 16px 18px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
            display: flex;
            position: relative;
            overflow: hidden;
            margin-bottom:12px;
            .left{
                flex:1;             
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &-info{
                    margin-top:4px;
                    display: flex;
                    align-items: center;
                    &__name{
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 27px;
                        color: #111111;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    &__sex{
                        flex-shrink: 0;
                        font-size: 15px;
                        font-weight: normal;
                        line-height: 23px;
                        color: #111111;
                        margin-left:10px;           
                    }
                    &__tag{
                        flex-shrink: 0;
                        width: 33px;
                        height: 16px;
                        border-radius: 2px;
                        background: #EEF5FF;
                        font-size: 12px;
                        font-weight: normal;
                        line-height: 16px;
                        color: #0E78EB;
                        text-align: center;
                        margin:0 5px 0 14px;
                    }
                }
                &-idcode{
                    margin-top:12px;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-weight: normal;
                    line-height: 24px;
                    &__text{
                        color: #999999;
                    }
                    &__num{
                        color: #666666;
                        margin-left:20px;
                    }
                }
            }
            .right{
                flex-shrink: 0;
                padding-left:16px;
                // border-left: 1px dashed #E2E2E2;
                position: relative;
                &::before{
                    content: '';
                    position: absolute;
                    left:0;
                    top:0;
                    z-index: 1;
                    width: 1px;
                    height: 100%;
                    background-image: url('../../assets/images/line.png');
                    background-repeat: repeat-y;
                }
                &-img{
                    width:48px;
                    height: 48px;
                    margin-top:2px;
                }
                &-text{
                    font-size: 12px;
                    font-weight: normal;
                    line-height: 14px;
                    color: #999999;
                    margin-top:8px;
                }
            }
        }
    }
    &__emty{
        padding:140px 48px 0;
        .img{
            width: 100%;
            object-fit: contain;
        }
        .text{
            font-size: 17px;
            font-weight: normal;
            line-height: 20px;
            text-align: center;
            color: #6B8C75;
        }
    }
    &-floor{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 75px;
        background-color: #fff;
        padding:8px 14px 0;
        z-index: 100;
        &__btn{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            line-height: 19px;
            text-align: center;
            color: #FFFFFF;
            height: 42px;
            border-radius: 21px;
            background: #32AE57;
            &:active{
                opacity: .8;
            }
            .text{
                margin-left:12px;
            }
        }
    }
}
.bguserManagement{
    background-color: #fff;
}
</style>