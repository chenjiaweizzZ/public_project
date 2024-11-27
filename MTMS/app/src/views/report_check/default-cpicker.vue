<template>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" >
        <div id="picker" v-show="config.show">
            <div id="picker-main">
                <header>
                    <span @click="cancle">取消</span>
                    <span @click="sure" :class="{'noclick':isdisabled}">确定</span>
                </header>
                <section>
                    <div class="all">
                        <p></p>
                        <p :class="{'active':allSelect}" @click="allSelectFn">全部</p>
                    </div>
                    <div class="on"></div>
                    <ul @touchstart.prevent="start"  @touchmove.prevent="move" @touchend.prevent="end" :style="style">
                        <li v-for="(item,index) in list" v-html="item.deptname"></li>

                    </ul>
                     <ul class="departmentSlider" @touchstart.prevent="start2"  @touchmove.prevent="move2" @touchend.prevent="end2" :style="style2">
                        <li v-for="(item, index) in childlist" v-html="item.deptname"></li>
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
                type:[Array,Object],
                default: function(){
                    return {
                        show: true,//是否显示
                        mainlist:{//传入的数组
                            type:Array,
                            default:[]
                        },
                        defaultVal:[String, Number],//默认选中的值
                        valueKey:{//显示的label
                            type:[Function,String],
                            default:'deptname'
                        }
                    }
                }
            }
        },
        data () {
            return {
                allSelect:false,//科室的全部选中
                allDeptid:[],//基地下所有的科室
                isdisabled:false,//是否可点击
                activeItem:0,//选中的项
                activeItem2:0,//选中的项
                itemLength:0,//列表的长度
                itemLength2:0,//列表的长度
                activeItemValue:0,//默认的值
                curVal:'',//选中的值
                style:{}, //样式对象
                childlist:[],//子集数组
                style2:{},
                deptid:'',
                Y:0, //
                Y2:0,
                t:0.1, //时间
                t2:0.1,
                touchStartTime:0,
                touchEndTime:0,
                eY:45,
                eY2:45,
                sY:90,  //开始的位置
                sY2:90,
                itemHeight:45,  //每个item的高度
            }
        },
        watch:{
            'config.mainlist':function(val,oldval){
                if(val !== oldval){
                    this.activeItem = 0;
                    this.Y = 0;
                    this.eY = 45;
                    this.sY = 90;
                    this.style =  {
                        transform:'translate3d(0px, '+this.sY+'px, 0px)',
                        transition:'all ease '+this.t+'s'
                    }
                    if(this.config.mainlist[0].childlist&&this.config.mainlist[0].childlist.length>0){
                        this.childlist=[];
                        this.childlist = this.config.mainlist[0].childlist;
                        // this.childlist.unshift({id:'',deptname:'全部'});
                        this.itemLength2 = this.childlist.length
                    }

                }
            },
            activeItem(newVal,oldVal){
                this.childlist=[];
                this.childlist=this.list[newVal].childlist;
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
                        {deptname:'暂无数据'}
                    ];
                    this.config.mainlist.map(value => {
                        value.txt = value.deptname;
                    });
                }else {
                    this.isdisabled = false;
                    this.config.mainlist.map(value => {
                         _list.push(value);

                        // if(type === 'string'){
                        //     value.txt = value[this.config.valueKey];
                        //     _list.push(value)
                        // }else if(type === 'function') {
                        //     let _txt = this.config.valueKey(value);
                        //     value.txt = _txt;
                        //     _list.push(value)
                        // }
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
                this.style2 = {
                    transform: 'translate3d(0px, ' + this.sY2 + 'px, 0px)',
                    transition: 'all ease ' + this.t2 + 's'
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
            //科室全部选中
            allSelectFn(){
                this.allDeptid=[];
                this.allSelect=!this.allSelect;
                if(this.allSelect){
                    for(let item  of this.config.mainlist[this.activeItem].childlist){
                        this.allDeptid.push(item.id);
                    }
                }else{
                     this.allDeptid=[];
                }

            },
             moveTo2(defaultVal){
                this.eY2=90;
                this.style2 =  {
                    transform:'translate3d(0px, '+this.eY2+'px, 0px)',
                    transition:'all ease '+this.t2+'s'
                }
                 if (this.config.mainlist[this.activeItem].childlist && this.config.mainlist[this.activeItem].childlist.length > 0) {
                     this.childlist = this.config.mainlist[this.activeItem].childlist;
                     this.itemLength2 = this.childlist.length;
                     // if(this.childlist[0].deptname!='全部'){
                     //      this.childlist.unshift({id:'',deptname:'全部'});
                     // }
                 }
                 this.activeItem2=0;
            },
            start(e){
                this.sY = e.touches[0].clientY;
                this.touchStartTime = e.timeStamp;//触摸事件开始时间
            },
            start2(e) {
                this.sY2 = e.touches[0].clientY
                this.touchStartTime = e.timeStamp//触摸事件开始时间
            },
            move(e){
                this.Y = this.eY+ (e.touches[0].clientY) - this.sY;
                this.t = 0.1;//动画时间
                this.style =  {
                    transform:'translate3d(0, '+this.Y+'px, 0)',
                    transition:'all ease '+this.t+'s'
                }
            },
            move2(e) {
                this.Y2 = this.eY2 + (e.touches[0].clientY) - this.sY2
                this.t2 = 0.1//动画时间
                this.style2 = {
                    transform: 'translate3d(0, ' + this.Y2 + 'px, 0)',
                    transition: 'all ease ' + this.t2 + 's'
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
                    this.activeItem2 = 0;
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
                this.moveTo2();
                this.$emit('changeCurVal',this.type,this.curVal)
            },
            end2(e){
                let start = 90;
                let end  = (this.itemLength2-1)*-45 + start;
                this.eY2 = this.Y2;
                this.touchEndTime = e.timeStamp  - this.touchStartTime;
                this.t = 0.1;
                //没有移动
                if(this.sY2 == (e.changedTouches[0].clientY)){
                    return
                }

                //跳转对位
                if(Math.abs(this.eY2%45)<=22.5){ //Math.abs 取绝对值
                    this.eY2 =  parseInt(this.eY2/45)*45;

                }else{
                    if(this.eY2>0){
                        this.eY2 =  parseInt(this.eY2/45)*45+45
                    }else{
                        this.eY2 =  parseInt(this.eY2/45)*45-45
                    }

                }
                //超出范围，滚回去
                if(this.eY2 > start){ //移动的距离大于初始的距离
                    this.Y2= 0;
                    this.eY2 = 90;
                    this.activeItem2 = 0;
                }
                if(this.eY2 <=end){
                    this.Y2= end;
                    this.eY2 = end;
                    this.activeItem2 = this.itemLength2-1;
                }

                this.style2 =  {
                    transform:'translate3d(0, '+this.eY2+'px, 0)',
                    transition:'all ease '+this.t2+'s'
                };

                let _activeItem = Math.abs((this.eY2 - start)/45);
                this.activeItem2 = Math.round(_activeItem);//防止有小数   四舍五入取整

                this.curVal = this.list[this.activeItem2];
                this.$emit('changeCurVal',this.type,this.curVal)
            },
            cancle(){
                this.config.show = false;
            },
            sure(){
                if(!this.allSelect){
                    this.deptid = this.config.mainlist[this.activeItem].childlist[this.activeItem2].id
                    this.$emit('confirm', this.deptid)//传给父组件
                }else{
                    this.$emit('confirm', this.allDeptid)//传给父组件
                }
                this.allSelect=false;

            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../scss/mixin";
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
        @include sexy-flex;
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
        width:45%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: auto;
        text-align: center;
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
            font-size:0.22rem;
            white-space: nowrap;
        }
    }
    .noclick {
        pointer-events: none;
        color: #aaa;
    }
    .departmentSlider{
        width: 50%;
        left:50%;
    }
    .all{
        width: 100%;
        height:90px;
        position: absolute;
        bottom: 180px;
        z-index: 100;
        @include sexy-flex;
        z-index: 1000;
        padding-top:45px;
         background:#fff;
        p{
            @include flex1();
            text-align: center;
            height: 45px;
            line-height: 45px;
            font-size: $fontBigSize;
        }
        & p.active{
            color:$activeColor;
        }

    }
</style>
