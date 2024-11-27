<template>
    <div class="slider">
        <label for="">{{score}}</label>
        <div class="van-slider-div">
            <van-slider v-model="scorepercentage"  @change="onChange"  active-color="#3499db" :min="0" :max="100" :step="stepLength()"/>
        </div>
        <div class="icon-box">
            <div class="jian countIcon" @click="reduce"></div>
            <div class="jia countIcon" @click="increase" ></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "itemSlider",
        props:{
            innerItem:{},
            step:{
                default:0.5
            }
        },
        data(){
            return{
                scorepercentage:100,
                score:this.innerItem.gradeitemscore,
                maxscore:this.innerItem.maxscore
            }
        },
        methods:{
            onChange(value) {
                this.score=(this.maxscore*value/100).toFixed(1);
                this.$emit('getresult',{score:this.score,infoitemid:this.innerItem.infoitemid})
            },
            //减分
            reduce(){
                this.scorepercentage-=this.stepLength();
                this.scorepercentage=Math.min(100,Math.max(0,this.scorepercentage));
                this.score=(this.maxscore*this.scorepercentage/100).toFixed(1);
                this.$emit('getresult',{score:this.score,infoitemid:this.innerItem.infoitemid})
            },
            stepLength:function () {
                let stepcount = this.maxscore/this.step;
                let step = 100 / stepcount;
                return step;

            },
            //加分
            increase(){
                this.scorepercentage+=this.stepLength();
                this.scorepercentage=Math.min(100,Math.max(0,this.scorepercentage));
                this.score=(this.maxscore*this.scorepercentage/100).toFixed(1);
                this.$emit('getresult',{score:this.score,infoitemid:this.innerItem.infoitemid})
            }
        },
        mounted(){
          this.maxscore=Number(this.maxscore);
        },
        watch:{
            innerItem(val){
                this.scorepercentage=(val.gradeitemscore/Number(val.maxscore))*100;
                this.score=val.gradeitemscore;
            }
        }
    }
</script>

<style scoped lang="scss">
    .slider{
        display: flex;
        .van-slider-div{
            flex:1;
            display: flex;
            align-items: center;
        }
        label {
            width: 30px;
            margin-top: -0.1rem;
            display:flex;
            align-items: center;
        }
        .icon-box{
            padding-left: 20px;
            div.countIcon {
                width: 30px;
                display: inline-block;
                height: 30px;
                text-align: center;
                margin-right: 10px;
                background: url("../../../assets/images/jia.png") no-repeat;
                background-size: 30px 30px;
            }

            div.jian {
                background: url("../../../assets/images/jian.png") no-repeat;
                background-size: 30px 30px;
            }
        }

        .van-slider{
            flex:1;
            align-items: center;
            label{

            }
        }

    }
</style>
