<template>
    <div id="picker">
        <ul @touchstart.prevent="start"  @touchmove.prevent="move" @touchend.prevent="end" :style="style">
            <li v-for="(i, index) in list">{{i.txt}}</li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "picker",
        data () {
            return {
                activeItem:0,
                itemLength:0,
                activeItemValue:0,
                curVal:'',//选中的值
                style:{}, //样式对象
                Y:0, //
                t:0.1, //时间
                touchStartTime:0,
                touchEndTime:0,
                eY:45, //
                sY:90,  //开始的位置
                isMoving:false,  //是否正在滚动
                itemHeight:45,  //每个item的高度
                isR:false  //是否是闰年
            }
        },
        props:{
            dataList:{
                type:Array,
                default:[]
            },
            defaultVal:[String, Number],
            type:{
                type:String,
                default:''
            }
        },
        watch:{
            dataList(){
                if(this.type=='month'||this.type=='day' || this.type=='hour' || this.type=='minute'){

                    this.$emit('changeCurVal',this.type,this.dataList[0])
                    this.style =  {
                        transform:'translate3d(0px, 90px, 0px)',
                        transition:'all ease '+this.t+'s'
                    }


                }

            }
        },
        filters: {

        },
        computed:{
            list(){
                let self = this;
                let a = [];
                let txt = '';
                switch (this.type){
                    case 'year':txt = '年';break;
                    case 'month':txt = '月';break;
                    case 'day':txt = '日';break;
                    case 'hour':txt = '点';break;
                    case 'minute':txt = '分';break;
                    default:txt = '年';
                }
                for(let i =this.dataList[0];i<=this.dataList[1];i++){
                    a.push({txt:i+txt,val:i})
                }

                this.itemLength = a.length;

                return a

            }
        },
        mounted () {
            if(this.defaultVal){
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
                this.list.map((i,k)=>{
                    if(i.val==(defaultVal||this.defaultVal)){
                        this.activeItem = k;
                        this.activeItemValue = i.val;
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
                this.touchStartTime = e.timeStamp;//触摸时间
            },
            move(e){

                this.Y =this.eY+ (e.touches[0].clientY) - this.sY;
                this.t = 0.1;//动画时间
                this.style =  {
                    transform:'translate3d(0, '+this.Y+'px, 0)',
                    // transition:'all ease 1s'
                }
            },
            end(e){
                let m = this.Y;
                let start  = 90;
                // this.itemLength = (Math.abs(this.eY)/0.6)+1;
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

                let _activeItem = Math.abs((this.eY - start)/45);
                this.activeItem = Math.round(_activeItem);//防止有小数   四舍五入取整
                //超出范围，滚回去
                if(this.eY>start){ //移动的距离大于初始的距离
                    this.Y= 0;
                    this.eY = 90;
                    this.activeItem = 0;
                }
                if(this.eY<=end){
                    this.Y= end;
                    this.eY = end;
                    this.activeItem = this.itemLength-1;
                }

                this.style =  {
                    transform:'translate3d(0, '+this.eY+'px, 0)',
                    transition:'all ease '+this.t+'s'
                };

                this.curVal = this.list[this.activeItem]['val'];
                this.$emit('changeCurVal',this.type,this.curVal)
            }
        }
    }
</script>

<style lang="scss" scoped>

    #picker {
        width: 100%;
        height: 270px;
        overflow: hidden;
        position: relative;
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
        }
    }
</style>
