<template>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" >
        <div id="picker" v-show="config.show" >
            <div id="picker-main">
                <header>
                    <span @click="cancle">取消</span>
                    <span @click="sure" :class="{'noclick':isdisabled}">确定</span>
                </header>
                <section>
                    <div class="on"></div>
                    <ul @touchstart.prevent="start"  @touchmove.prevent="move" @touchend.prevent="end" :style="style">
                        <li v-for="(i, index) in list" v-html="i.txt"></li>
                    </ul>
                </section>
            </div>
        </div>
    </transition>
</template>


/*
* @param: defaultVal未验证
** @param： valueKey即你想显示的label  可传string   也可传function

*/

<script>
    export default {
        name: "picker",
        props:{
            config: {
                default: function(){
                    return {
                        show: false,//是否显示
                        mainlist:{//传入的数组
                            type:Array,
                            default:[]
                        },
                        defaultVal:[String, Number],//默认选中的值
                        valueKey:{//显示的label
                            type:[Function,String],
                            default:'name'
                        }
                    }
                }
            },
        },
        data () {
            return {
                isdisabled:false,//是否可点击
                activeItem:0,//选中的项
                itemLength:0,//列表的长度
                activeItemValue:0,//默认的值
                curVal:'',//选中的值
                style:{}, //样式对象
                Y:0, //
                t:0.1, //时间
                touchStartTime:0,
                touchEndTime:0,
                eY:45,
                sY:90,  //开始的位置
                itemHeight:45,  //每个item的高度
            }
        },
        watch:{
            'config.mainlist':function(vla,oldval){
                if(vla !== oldval){
                    this.activeItem = 0;
                    this.Y = 0;
                    this.eY = 45;
                    this.sY = 90;
                    this.style =  {
                        transform:'translate3d(0px, '+this.sY+'px, 0px)',
                        transition:'all ease '+this.t+'s'
                    }
                }
            }
        },
        filters: {

        },
        computed:{
            list(){
                let _list = [];
                let type = typeof (this.config.valueKey);
                if(this.config.mainlist.length == 0){
                    this.isdisabled = true;
                    this.config.mainlist = [
                        {name:'暂无数据'}
                    ];
                    this.config.mainlist.map(value => {
                        value.txt = value.name;
                    });
                }else {
                    this.isdisabled = false;
                    this.config.mainlist.map(value => {
                        if(type === 'string'){
                            value.txt = value[this.config.valueKey];
                            _list.push(value)
                        }else if(type === 'function') {
                            let _txt = this.config.valueKey(value);
                            value.txt = _txt;
                            _list.push(value)
                        }
                    });
                }

                this.curVal = _list[this.activeItem];

                this.itemLength = _list.length;
                return _list;

            }
        },
        mounted () {
            if(this.config.defaultVal){
                this.moveTo()
            }else{
                this.style =  {
                    transform:'translate3d(0px, '+this.sY+'px, 0px)',
                    transition:'all ease '+this.t+'s'
                }
            }
        },
        methods:{
            //初始化有值的时候滚动到某个地方
            moveTo(defaultVal){
                this.list.map((i,k) => {
                    if(i == (defaultVal || this.config.defaultVal)){
                        this.activeItem = k;
                        this.activeItemValue = i ;
                    }
                });

                this.Y =this.activeItem*45;
                this.eY = this.activeItem*45;

                this.style =  {
                    transform:'translate3d(0px, '+this.Y+'px, 0px)',
                    transition:'all ease '+this.t+'s'
                }
            },
            start(e){
                this.sY = e.touches[0].clientY;
                this.touchStartTime = e.timeStamp;//触摸事件开始时间
            },
            move(e){
                this.Y = this.eY+ (e.touches[0].clientY) - this.sY;
                this.t = 0.1;//动画时间
                this.style =  {
                    transform:'translate3d(0, '+this.Y+'px, 0)',
                    transition:'all ease '+this.t+'s'
                }
            },
            end(e){
                let start = 90;
                let end  = (this.itemLength-1)*-45 + start;
                this.eY = this.Y;
                this.touchEndTime = e.timeStamp  - this.touchStartTime;
                this.t = 0.1;
                //没有移动
                if(this.sY == (e.changedTouches[0].clientY)){
                    return
                }

                //跳转对位
                if(Math.abs(this.eY%45)<=22.5){ //Math.abs 取绝对值
                    this.eY =  parseInt(this.eY/45)*45;

                }else{
                    if(this.eY>0){
                        this.eY =  parseInt(this.eY/45)*45+45
                    }else{
                        this.eY =  parseInt(this.eY/45)*45-45
                    }

                }

                //超出范围，滚回去
                if(this.eY > start){ //移动的距离大于初始的距离
                    this.Y= 0;
                    this.eY = 90;
                    this.activeItem = 0;
                }
                if(this.eY <=end){
                    this.Y= end;
                    this.eY = end;
                    this.activeItem = this.itemLength-1;
                }

                this.style =  {
                    transform:'translate3d(0, '+this.eY+'px, 0)',
                    transition:'all ease '+this.t+'s'
                };

                let _activeItem = Math.abs((this.eY - start)/45);
                this.activeItem = Math.round(_activeItem);//防止有小数   四舍五入取整

                this.curVal = this.list[this.activeItem];

                this.$emit('changeCurVal',this.type,this.curVal)
            },
            cancle(){
                this.config.show = false;
            },
            sure(){
                this.$emit('confirm',this.curVal);//传给父组件
            },
        }
    }
</script>

<style lang="scss" scoped>
    #picker {
        position: absolute;
        width: 100%;
        height: calc(100% - .76rem);
        background: rgba(0,0,0,0.1);
        z-index: 900;
        left: 0;
        top: 0;
    }

    #picker-main {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fff;
        z-index: 999;
    }

    header {
        display: flex;
        border-bottom: 1px solid #eaeaea;
        padding: 0 .25rem;
        color: #3499db;
        span {
            flex: 1;
            width: 0;
            text-align: center;
            padding: .2rem 0;
        }
    }

    section {
        width: 100%;
        height: 270px;
        overflow: hidden;
        position: relative;
        background: #fff;
        color: #707274;
    }

    .on {
        width: 100%;
        height: 45px;
        border-top: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        position: absolute;
        bottom: 135px;
        z-index: 100;
        pointer-events: none;
    }

    ul {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: auto;
        text-align: center;
        transition-duration:.2s;
        -webkit-transition-duration:.2s;
        transition-timing-function:ease-out;
        -webkit-transition-timing-function:ease-out;
        z-index: 99;
        li {
            height: 45px;
            line-height: 45px;
            font-size: 0.25rem;
            padding: 0 .25rem;
            display: flex;
            justify-content: center;
        }
    }
    .noclick {
        pointer-events: none;
        color: #aaa;
    }
</style>
