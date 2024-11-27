<template>
    <div class="progress" :style="{height: strokeWidth+'px'}">
        <div class="progress-bar" :style="{width: percentage+'%',height: strokeWidth+'px'}">
        </div>
        <span class="progress-text" :style="{left:(percentage>86?86:percentage)+'%',height: strokeWidth+'px',lineHeight: strokeWidth + 'px'}">{{percentage}}%</span>
    </div>
</template>
<script type="text/javascript">

    export default {

        props:{
            percentage: {
                type: Number,
                default: 0,
            },
            strokeWidth: {
                type: Number,
                default: 12
            }
        },
        data() {
            return {

            }
        },
        mounted(){

        },
        methods: {


        },
    }
</script>
<style scoped>
    div.progress{
        width: 100%;
        height: 16px;
        background: #888;
        border-radius: 7px;
        position: relative;
        overflow: auto;
    }
    div.progress-bar{
        width: 100%;
        height: 16px;
        background: #409EFF;
        border-radius: 7px;
    }
    span.progress-text{
        height: 16px;
        line-height: 16px;
        color: #fff;
        font-size: 12px;
        position: absolute;
        text-indent: 0;
        margin-right: .7%;
        left: 0;
        top: 0;
        padding-left: 8px;
    }
</style>

