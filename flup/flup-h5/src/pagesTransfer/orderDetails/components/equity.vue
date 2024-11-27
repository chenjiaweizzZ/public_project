<template>
    <div :class="{ 'padd': padd }" class="equity">
        <span class="equity-title">使用权益/总权益</span>
        <div v-if="equityList.length">
            <div v-for="(item, index) in equityList" :key=index class="equity-container">
            <span class="equity-container-times">
                <span class="equity-container-times-left">{{ item.verifiedTimes }}</span>
                / {{ item.totalTimes }}次</span>
            <span class="equity-container-title">{{ item.verifyItemName }}</span>
        </div>
        </div>
        <div class="equity-noCart" v-else>
            <img src="../../../assets/images/bgNot.png">
            <div class="equity-noCart-text">暂无权益</div>
        </div>
        <span class="equity-entry" v-if="entry">记录及满意度评价</span>
    </div>
</template>

<script>
export default {
    props: {
        equityList: Array,
        padd: {
            type: Boolean,
            default: false
        },
        entry: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss" scoped>
.padd {
    padding: 11px 16px;
    border-radius: 10px;
}

.equity {
    background: #FFFFFF;
    padding-bottom: 11px;
    position: relative;

    &-title {
        display: inline-block;
        font-size: 14px;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
        margin-bottom: 8px;
    }

    &-noCart {
        display: flex;
        flex-direction: column;
        justify-content: center;
        &-text {
            display: flex;
            justify-content: center;
            font-size: 17px;
            font-weight: normal;
            text-align: center;
            letter-spacing: 0px;
            color: #6b8c75;
        }
    }

    &-container {
        height: 24px;
        line-height: 24px;

        &-times {
            display: inline-block;
            width: 60px;

            &-left {
                color: #FF5500;
            }
        }
    }

    & .equity-container:nth-child(2n + 1) {
        background: #fff;
    }

    & .equity-container:nth-child(2n) {
        background: #F4FDF7;
    }

    &-entry {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #0079FD;
    }
}
</style>