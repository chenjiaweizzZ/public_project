<template>
    <div class="payAbnormal">
        <img class="payAbnormal-img" src="@/assets/images/error.png" alt="">
        <span class="payAbnormal-title">支付异常</span>
        <div class="payAbnormal-info">支付出现了一点问题，您可以点击下方订单管理，找到该订单重新支付。如果您已经扣款，款项将会在3-5个工作日内自动退还。</div>
        <div class="payAbnormal-btn" @click="jump">返回首页</div>
    </div>
</template>
<script>
export default{
    data(){
        return {

        }
    },
    mounted(){
        document.title = '支付异常'
    },
    methods:{
        jump(){
            this.$router.replace('/home');
        }
    }
}
</script>
<style lang="scss" scoped>
.payAbnormal{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:80px 20px 0px;
    &-img{
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
    }
    &-title{
        font-size: 20px;
        font-weight: normal;
        line-height: 24px;
        text-align: center;
        color: #111111;
        margin-bottom: 12px;
    }
    &-info{
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        text-align: center;
        color: #999999;
        margin-bottom:17px;
    }
    &-btn{
        width: 100%;
        height: 42px;
        border-radius: 23px;
        background: #32AE57;
        font-size: 16px;
        font-weight: 500;
        line-height: 42px;
        text-align: center;
        color: #FFFFFF;
    }
}
</style>