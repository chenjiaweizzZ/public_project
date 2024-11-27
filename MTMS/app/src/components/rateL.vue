<template>
    <div class="rate">
        <div class="stem" v-if="stem">
            {{stem}}
        </div>
        <div class="title">
            <span>{{title}}</span>
        </div>
        <div class="main">
            <div class="control">
                <span class="controller minus" :class="{'disabled':isdisabled}" :style="{'background':computedcolorl()}" @touchstart="longMinus" @touchend="clearMinus" @click="minus">
                    <i class="iconfont icon-minus"></i>
                </span>
                <input type="text" v-model="score" class="score" oninput="value=value.replace(/[^1-9]\d*$/,'')">
                <!--<span class="score">{{score | sub}}</span>-->
                <span class="controller add" :class="{'disabled':isdisabled}" :style="{'background':computedcolorr()}" @click="add" @touchstart="longAdd" @touchend="clearAdd">
                    <i class="iconfont icon-add"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    /*
    * @param id是每个题目的id ，stem是题目分类（可为空），title是题干，maxscore是最大分值，steplength是步长 ,scoreway是加分制还是减分制，默认加分制
    * @param this.$emit('initresult',{'score':this.score, 'id':this.id,}) 该方法是初始化   不进行操作的时候  先将所有题目按照满分记录
    * @param this.$emit('getresult',result); 该方法是每一次操作的时候改变父组件需要提交的值
    * @param 实际上外面还应该有个父组件 绑定所有题目的数组  然后分发到每个子组件  但是目前这个通用性做得不是很大  所以暂时没想好怎么做最好
    * */

    import { mapState, mapActions } from 'vuex'
    export default {
        name: "rate",
        data () {
            return {
                score:'',
                rateIndex:0
            }
        },
        props: {
            id: {
                type: Number,
                default:0
            },
            position:{
                type:Number
            },
            stem: {
                type: String,
                default:''
            },
            title: {
                type: String,
                default:''
            },
            maxscore: {
                type: Number,
                default:0
            },
            steplength: {
                type: Number,
                default:1
            },
            scoreway:{
                type: Number,
                default:0
            },
            isdisabled:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            score(val,oldval){
                if(val !== oldval){
                    if (val > this.maxscore) {
                        this.score=this.maxscore;
                    }
                    if(val<0){
                        this.score=0;
                    }
                    if(val!==''){
                        let result = {
                            'score': parseInt(val),
                            'id': this.id
                        }
                        this.$emit('getresult', result)
                    }

                }
            }
        },
        filters:{
            sub:(val) =>{
                return Number(val).toFixed(2);
            }
        },
        created(){
            if(this.scoreway){
                this.score = 0;
            }else {
                this.score = this.maxscore;
            }
            this.$emit('initresult',{'score':this.score, 'id':this.id,})
        },
        mounted () {

        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            longMinus(){
                if (this.score === '') {
                    return
                }
                let self = this;
                window.inspectTimer=setInterval(()=>{
                          if(self.score<=0){
                              self.toast('分数不能低于零分~');
                              clearInterval(window.inspectTimer);
                              return;
                          }else{
                              self.score = self.score - self.steplength ;
                          }
                },100);

            },
            minus(){
                if(this.score===''){
                    return;
                }
                let self = this;
                if(self.score <= 0){
                    self.toast('分数不能低于零分~');
                    return
                }
                self.score = self.score - self.steplength ;

            },
            clearMinus(){
                clearInterval(window.inspectTimer);
            },
            add(){
                if (this.score === '') {
                    return
                }
                let self = this;
                if(self.score >= self.maxscore){
                    self.toast('分数不能高于最高分~');
                    return
                }
                self.score = self.score + self.steplength ;
            },
            longAdd(){
                if (this.score === '') {
                    return
                }
                let self = this;
                 window.inspectTimer=setInterval(()=>{
                     if (self.score >= self.maxscore) {
                         self.toast('分数不能高于最高分~');
                         clearInterval(window.inspectTimer);
                         return
                     }
                     self.score = self.score + self.steplength
                },100);

            },
            clearAdd(){
              clearInterval(window.inspectTimer);
            },
            computedcolorl(){
                if(this.score <= 0){
                    return '#eee'
                }else{
                    return '#fff'
                }
            },
            computedcolorr(){
                if(this.score >= this.maxscore){
                    return '#eee'
                }else{
                    return '#fff'
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../fonts/iconfont.css";
    .rate {
        display: flex;
        border-bottom: 1px solid #eee;
        min-height: 1rem;
        background: #fff;
        flex-direction: column;
    }
    .main {
        display: flex;
        justify-content: flex-end;
        padding: 0.1rem;
    }
    .stem {
        color: #000;
        padding: 0.1rem;
        border-bottom: 1px solid #eee;
    }
    .control {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 0.1rem;
    }
    .controller {
        height: 0.6rem;
        padding: 0 0.15rem;
        border: 1px solid #999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .minus {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .add {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .score {
        display: inline-block;
        width: 0.7rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        border-top: 1px solid #999;
        border-bottom: 1px solid #999;
    }
    .title {
        display: flex;
        flex: 1;
        padding:0.1rem;
        font-size: 0.23rem;
        color: #888;
    }
    .disabled {
        background: #eee!important;
        pointer-events:none;
    }
</style>
