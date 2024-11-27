<template>
    <div class="message-score" @click="grade">
        <div class="message-score-text">{{ JSON.parse(message.payload.extension).attentionText }}</div>
        <div class="message-score-back">
            <div class="message-score-container">
                <div class="message-score-left">
                    <img src="@/assets/images/chat/grade.png">
                    <span>满意度调查</span>
                </div>
                <div class="message-score-right">
                    <span>点击前往</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: Object
    },
    methods: {
        grade() {
            this.$emit("grade",this.message)
        }
    }
}
</script>

<style scoped lang="scss">
.message-score {
    padding: 3px;
    &-grade {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    &-text {
        display: flex;
        justify-content: center;
        color: #333;
        margin-bottom: 10px;
        padding: 0 20px;
    }

    &-back {
        display: flex;
        justify-content: center;
        border-radius: 6px;
    }

    &-container {
        width: 70vw;
        display: flex;
        background-color: #FFF;
        // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
        justify-content: space-between;
        align-items: center;
        border: 1px solid #A7D8B5;
        padding: 10px;
        border-radius: 6px;
        position: relative;
    }

    &-left {
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.5px;
        font-variation-settings: "opsz" auto;
        color: #111111;
        display: flex;
        align-items: center;

        img {
            width: 42px;
            height: 30px;
        }
    }

    &-right {
        font-size: 12px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #017925;
        display: flex;
        align-items: center;
    }
}
</style>
