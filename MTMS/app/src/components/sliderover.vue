<template>
    <div class="progress">
        <div class="scale_panel">
            <div class="scale" id="bar" ref="bar">
                <div :style="'width:'+left+'px'"></div>
                <span id="btn" :style="'left:'+left+'px'" ref="btn">
                    <span id="title">{{selectNum}}</span>
                    <span class="triangle-down"></span>
                    <span class="slider-pointer"></span>
                </span>
            </div>
        </div>
        <div class="max-min">
            <span class="min-num">{{min}}</span>
            <span class="max-num">{{max}}</span>
        </div>
    </div>
</template>
<script type="text/javascript">

    export default {
        model: {
            prop: 'value',
            event: 'change'
        },
        props:{
            max: {
                type: Number,
                default: 100
            },
            min: {
                type: Number,
                default: 0
            },
            step: {
                type: Number,
                default: 1
            },
            value: {
                type: Number,
                default: this.min
            }
        },
        data() {
            return {
                // max: 100,
                // min: 0,
                percent: 0,
                moveX: 0,
                distance: 0,
                btnWidth: 0,
                width:0,
                left: 0,
                stepWidth:0,
                // step:1,
                selectNum: this.min
            }
        },
        mounted: function () {
            this.$nextTick(function(){
                this.distance = this.$refs.bar.getBoundingClientRect().left
                this.btnWidth = this.$refs.btn.offsetWidth
                this.width = this.$refs.bar.offsetWidth
                this.stepWidth = this.width * this.step / (parseInt(this.max) - parseInt(this.min))
                /*this.left = - this.btnWidth/2*/
                this.left = (this.value - this.min) * this.width / (this.max - this.min);
                this.selectNum = this.value;
                this.$emit('change', this.selectNum)
            })
        },
        methods: {
            start(ev){
                ev = ev || event;
                ev.preventDefault();
            },
            move(ev){
                ev = ev || event;
                ev.preventDefault();
                this.$nextTick(function(){
                    if(ev.touches.length == 1) {

                        this.moveX = ev.touches[0].clientX - this.distance;
                        this.left = this.moveX - this.btnWidth / 2
                        /*this.percent = this.moveX/this.width;
                        if(this.moveX >= this.width){
                            this.moveX = this.width;
                            this.percent = 1
                        }
                        if(this.moveX <= 0){
                            this.moveX = 0;
                            this.percent = 0
                        }

                        this.selectNum = Math.round((parseInt(this.max) - parseInt(this.min)) * this.percent) + parseInt(this.min)
                        console.log(this.selectNum)
                        var n = Math.round(this.selectNum / this.step)
                        console.log(n)
                        this.selectNum = n * this.step*/

                        var valueA = this.moveX *(parseInt(this.max)-parseInt(this.min))/this.width;
                        var value = Math.round(valueA / this.step) * this.step + parseInt(this.min);

                        if(value > this.max) {
                            value = this.max;
                        }
                        if(value < this.min) {
                            value = this.min;
                        }

                        this.selectNum = value;
                    }
                })
            },
            end(ev){
                ev = ev || event;
                ev.preventDefault();
                var valueA = this.moveX *(parseInt(this.max)-parseInt(this.min))/this.width;
                var value = Math.round(valueA / this.step) * this.step + parseInt(this.min);

                if(value > this.max) {
                    value = this.max;
                }
                if(value < this.min) {
                    value = this.min;
                }

                this.$nextTick(() => {
                    this.left = (value - this.min) * this.width / (this.max - this.min);
                    this.selectNum = value;
                    this.$emit('change', this.selectNum)
                });


                /*if((value%this.step)/this.step<0.5){
                    this.moveX = parseInt(value/this.step) * this.stepWidth
                    this.left = this.moveX - this.btnWidth/2
                }else{
                    this.moveX = (parseInt(value/this.step) + 1) * this.stepWidth
                    this.left = this.moveX - this.btnWidth/2
                }
                this.percent = this.moveX / this.width;
                if(this.moveX <= 0){
                    this.selectNum = this.min
                }else{
                    this.selectNum = Math.round((parseInt(this.max)-parseInt(this.min)) * this.percent + parseInt(this.min))
                }
                this.$emit('change', this.selectNum)*/
            }

        },
        watch: {

        },
        computed: {

        }
    }
</script>
<style lang="scss" scoped>
    .scale_panel{
        color:#999;
        width: 100%;
        position:absolute;
        left:0;top:0;
    }
    .scale>span#btn{
        display: inline-block;
        /*border: 1px solid #3499db;*/
        background-color: #fff;
        width:0.42rem;
        height:0.42rem;
        margin-left: -0.21rem;
        position:absolute;
        left:0;
        top:-0.21rem;
        cursor:pointer;
        border-radius: 50%;
        font-size: .24rem;
        /*box-shadow: 0px 0px 10px 5px #3499db;*/
    }
    .scale .slider-pointer{
        position:absolute;
        width:0.3rem;
        height:0.3rem;
        left:50%;
        top:50%;
        margin-left: -0.15rem;
        margin-top: -0.15rem;
        border: 1px solid #3499db;
        border-radius: 50%;
        box-shadow: 0px 0px 10px 5px #3499db;
    }
    .scale{
        background: #ddd;
        width: 100%;
        height: 0.05rem;
        position: relative;
    }
    .scale>div{
        background-repeat: repeat-x;
        background-color: #3499db; /*进度条颜色*/
        position: absolute;
        height: 0.05rem;
        width: 50%; left: 0; bottom: 0;
    }
    div.progress{
        position:relative;
        font-size: .24rem;
        margin: 45px 20px 10px 20px;
    }
    #title{
        position: absolute;
        top: -.53rem;
        left: 50%;
        background: #666;
        width: .4rem;
        color: #fff;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        border-radius: 3px;
        margin-left: -.2rem;
    }
    .triangle-down {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #666;
        position: absolute;
        top: -.14rem;
        left: 50%;
        margin-left: -6px;
    }
    div.max-min{
        padding-top: .3rem;
        color: #3499db;
    }
    div.max-min span.max-num{
        float: right;
    }
</style>
