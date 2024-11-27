<template>
    <div class="scoreItems">
        <div class="title">{{datalist.key}}（{{itemtotalscore}}分）</div>
        <div class="score-content" v-for="(item,index) of  datalist.value" :key=index>
            <p>{{index+1}}.{{item.rightoperation}}（{{item.maxscore}}分）。</p>
            <item-slider :innerItem="item" @getresult="getresult" :step="step"></item-slider>
        </div>
    </div>
</template>

<script>
    import itemSlider from './itemSlider'
    import methods from '@/methods'
    export default {
        name: "scoreItem",
        props:{
          datalist:{
          },
          step:{

          }
        },
        components:{
            itemSlider
        },
        data(){
            return{
                scorepercentage:100,
                itemtotalscore:0
            }
        },
        methods:{
            ...methods,

            getresult(val){
                let self = this;
                this.datalist.value.map(item => {
                       if(item.infoitemid==val.infoitemid){
                           item.gradeitemscore=val.score;
                       }
                });
                this.$emit('get_result_all', '')
            }
        },
        mounted(){
            this.datalist.value.map(item => {
                this.itemtotalscore += parseInt(item.gradeitemscore);
            });
        },
        watch:{
            datalist(val){
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../scss/mixin.scss";
    .scoreItems{
        font-size:0.22rem;
        .title{
            display:flex;
            font-size:0.24rem;
            padding-top: 0.1rem;
            padding-bottom: 0.1rem;
            background: $bgColor;
            display: flex;
            justify-content:flex-start;
            align-items: center;
            padding-left: 0.2rem;
            border-bottom: 1px solid $borderColor;
        }
        .score-content{
            background: #fff;
            padding: 0.2rem;
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
        }
    }
</style>
