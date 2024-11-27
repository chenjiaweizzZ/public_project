<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考核(综合)
            <div slot="headerRight">
                <span style="font-size: 0.3rem">提交</span>
            </div>
        </c-header>
        <div class="top">
            <ul>
                <li><label for="">姓名：</label>刘小黑</li>
                <li><label for="">护培学号：</label>0003432</li>
                <li><label for="">专业基地：</label>内科基地</li>
                <li><label for="">科室/病区：</label>消化内科</li>
                <li><label for="">轮转周期：</label>2018年3月1日——2018年5月31日</li>
            </ul>
            <div class="cw-count">分管床位数：</div>
            <div class="score">
                <div class="left">
                    <p>总分：100分</p>
                    <p>附加分：5分</p>
                </div>
                <div class="right">
                    <p>得分：96分</p>
                </div>
            </div>
        </div>
        <!--数字键盘-->
        <van-number-keyboard
            :show="keyboardshow"
            close-button-text="完成"
            @blur="keyboardshow = false"
            @input="onInput"
            @delete="onDelete"
        />
        <div class="g-main">
            <div class="score-content">
                <div class="scoreItem reset">
                    <score-item></score-item>
                    <score-item></score-item>
                    <score-item></score-item>
                    <score-item></score-item>
                    <score-item></score-item>
                </div>
                <div class="comment">
                    <p>评语：</p>
                    <div class="textarea_box">
                        <textarea v-model="comment" @focus='textareaFocus()' @blur='textareaBlur()'></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import cHeader from '@/views/header'
    import methods from '@/methods'
    import { mapState,mapActions } from 'vuex'
    import scoreItem from './components/scoreItem'
    export default {
        name: "comprehensivesheet",
        components:{
            cHeader,
            scoreItem
        },
        data(){
            return {
                comment:"",
                isHasComment:false,
                keyboardshow:false,
                totalscore:0
            }
        },
        methods:{
            ...methods,
            onInput(value) {
                this.$toast(value);
                this.totalscore=value+'分'
            },
            onDelete() {
                this.$toast('delete');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../scss/mixin.scss";
    div.top{
        background: $bgColor;
        font-size:0.22rem;
        border-bottom:1px solid $borderColor;

        .cw-count{
            height: 0.6rem;
            margin-top:0.2rem;
            padding: 0.2rem;
            background: #fff;
        }
        .noComment{
            background: #fff;
            p{
                height: 0.6rem;
                line-height: 0.6rem;
                padding: 0 0.2rem;
                border-bottom: 1px solid $borderColor;
            }
            p.score-zdy{
                display:flex;
                justify-content: space-between;
                span{margin-top:0.1rem}
                img{width: 0.3rem;height: 0.3rem;vertical-align: middle;}
            }
        }
        .score{
            background:#fff;
            margin-top:0.2rem;
            display:flex;
            flex-flow:row;
            &>div{
                flex:1;
                height: 0.6rem;
                justify-content: space-around;
            }
            &>div.left{
                display:flex;
                flex-flow:row nowrap;
                justify-content: space-around;
                p{
                    flex:1;
                    margin: 0;
                    padding-left:0.2rem;
                    display:flex;
                    align-items: center;
                }
            }
            &>div.right{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                p{padding-right: 0.2rem;}
            }


        }
        ul{
            display: flex;
            background: #fff;
            flex-flow:row wrap;
            padding:0.2rem;
            border-bottom:1px solid $borderColor;
            li{
                width: 50%;
                font-size: 0.22rem;
                display: flex;
                margin-bottom: 10px;
                label{
                    min-width: 70px;
                    text-align: right;
                }
                justify-content:left;
            }
            li:nth-child(2n){
                justify-content: flex-end;
            }
            li:nth-last-child(1){
                width: 100%;
            }
        }
    }
    .score-content{
        .comment{
            background: #fff;
            padding: 0.2rem;
            .textarea_box{
                border:1px solid $borderColor;
                height: 1rem;
                padding: 0.2rem;
            }
        }

    }
</style>

