<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png"/>
                </a>
            </div>
            出科报名人员
            <div slot='headerRight' style="font-size: 0.3rem;">录入成绩
            </div>
        </c-header>
        <vue-scroll>
            <div class="g-main exam_results_content">
                <div class="subject_title">
                    <span>补考科目：</span>
                    <span>理论考试</span>
                </div>
                <ul class="base_info">
                    <li>程大哥-2016</li>
                    <li>1896745786</li>
                    <li>2016级</li>
                    <li>内科基地</li>
                </ul>
                <div class="subject_info">
                    <div>出科科室：消化内科（2018-01-01—208-02-28）</div>
                    <div>报名时所在科室：呼吸内科</div>
                    <div>报名日期：2018-03-06</div>
                    <div>
                        <p>备注：</p>
                        <textarea name="" id="" >

                        </textarea>
                    </div>
                </div>
                <div class="subject_title subject_results_title">
                   出科考试成绩
                </div>
                <div class="subject_items_results">
                    <div><label for="">理论成绩：</label> <input type="text" value="98"></div>
                    <div><label for="">技能成绩：</label> <input type="text" value="98"></div>
                    <div><label for="">综合成绩：</label> <input type="text" value="98"></div>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    import methods from '@/methods'
    import cHeader from '../header'
    import {mapState, mapActions} from 'vuex'
    export default {
        name: 'exam_results',
        components: {
            cHeader
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ])
        },
        mounted(){
            this.$nextTick(()=>{
               this.textResize();
            });
        }
    }
</script>

<style scoped lang="scss">
@import '../../scss/mixin.scss';
    .exam_results_content{
        @include sexy-flex();
        flex-flow:column wrap;
        font-size:0.25rem;
        textarea{
            overflow:hidden;
        }
        .subject_title{
            height: 0.6rem;
            border-bottom:1px solid $borderColor;
            line-height:0.6rem;
            padding-left:0.3rem;
            margin-bottom:0.15rem;
            background: #fff;
        }
        .base_info{
            @include sexy-flex();
            flex-flow:row wrap;
            padding: 0.4rem 0.3rem;
            border-bottom:1px solid $borderColor;
            border-top:1px solid $borderColor;
            margin-bottom:0.15rem;
            background: #fff;
            &>li{
                width:50%;
                font-size:0.25rem;
                margin-bottom:0.3rem;
            }
            &>li:nth-child(2n){
                text-align: right;
                margin-bottom: 0;
            }
            &>li:nth-child(3){
                margin-bottom: 0;
            }
        }
        .subject_info{
              padding: 0.4rem 0.3rem;
              background:#fff;
              &>div{
                  margin-bottom:0.15rem;
                  textarea{
                      min-height:1rem;
                      border:1px solid $borderColor;
                      width: 100%;
                      padding: 0.1rem;
                  }
              }
        }
        .subject_results_title{
             border-top:1px solid $borderColor;
        }
        .subject_items_results{
            @include sexy-flex();
            flex-flow:column nowrap;
            padding: 0.4rem 0.3rem;
            background: #fff;
            &>div{
                @include flex1(1);
                @include sexy-flex();
                flex-flow: row nowrap;
                align-items: center;
                &>input{flex:1;border-bottom:1px solid $borderColor;}
            }
        }
    }
</style>
