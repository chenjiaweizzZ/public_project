<template>
    	<div id="canvas" ref="canvas" @click="cancelPic">
            <ul id="outer">
                <li v-for="(item,index) in filelist" v-if="item.type==typeL">
                    <img :src="fdfsurl+item.fileurl" alt=""  >
                </li>
            </ul>
        </div>
</template>

<script>
  export default {
    name: 'vue_slide',
    props: {
        filelist: {
            type: Array,
            default () {
                return []
            }
        },
        fdfsurl: {
            type: String,
            default: 'http://'
        },
        sliderVisible:{
            type:Boolean,
            default:false
        },
        index:{
            default:0
        },
        typeL:{
            type:Number,
            default:2
        }
    },
    data(){
      return{
          wrap: '',//容器
          radio: '',//宽高比例
          scaleW: '',//屏幕的宽度
          idx: 0,//设置初始的索引值
          isSlide: false


      }
    },
    mounted(){
        this.slider();
    },
    components:{
         // Picview
    },
    watch:{
      filelist(newVal,oldVal){
          console.log(oldVal)
          console.log(newVal)
          this.filelist=newVal;

      },
      typeL(newVal,oldVal){
          console.log(oldVal)
          console.log(newVal)
      }
    },
    methods:{
        //构造函数
        slider(opts){
            //构造三部曲
            this.init();
            this.renderDom();//渲染dom;
            this.bindDOM();//绑定函数
        },
        cancelPic(){
                this.$emit("getSlider",false);
        },
        init(){
          	this.radio = window.innerHeight/window.innerWidth;
			//设定一页的宽度
			this.scaleW = window.innerWidth;
			//设定初始的索引值
			this.idx = 0;
            this.canvas = document.getElementById('canvas');
            this.outer = document.getElementById('outer');
            let lis=this.outer.getElementsByTagName("li");
            let len=lis.length;
			for(let i=0;i<len;i++){
			    lis[i].style.width = window.innerWidth +'px';
				lis[i].style.webkitTransform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
				lis[i].style.transform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
				lis[i].style.MozTransform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
            }
        },
        renderDom(){
            this.canvas=document.getElementById('canvas');
            this.outer=document.getElementById('outer');
            this.outer.style.width=window.innerWidth+'px';
            this.moveIndex(this.index);

        },
        moveIndex(n){
            let self=this;
            this.canvas = document.getElementById('canvas');
            this.outer = document.getElementById('outer');
            self.idx=n;
			let len=this.filelist.length;
            let lis=this.outer.getElementsByTagName("li");
			for(let i=0;i<len;i++){
			   	lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW) +'px, 0, 0)');
			   	lis[i] && (lis[i].style.transform = 'translate3d('+ ((i-self.idx)*self.scaleW) +'px, 0, 0)');
            }
        },
        goIndex(n){
            let lis=this.outer.getElementsByTagName("li");
            let len=lis.length;
            let cidx;//滑动时传入的索引；
            if(typeof n == 'number'){
				cidx = n;
			//如果是传字符则为索引的变化
			}else if(typeof n == 'string'){
				cidx = this.idx +n*1;
			}
			//索引的边界
            if(cidx>len-1){
                cidx=len-1;
            }else if(cidx<0){
                cidx=0;
            }
            //保留当前索引值
			this.idx = cidx;
            //动画过渡
            //改变过渡的方式，从无动画变为有动画
			lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

			lis[cidx].style.transition = '-webkit-transform 0.2s ease-out';
			lis[cidx-1] && (lis[cidx-1].style.transition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.transition = '-webkit-transform 0.2s ease-out');
            //动画的位移值
            lis[cidx].style.webkitTransform='translate3d(0,0,0)';
            lis[cidx-1]&&(lis[cidx-1].style.webkitTransform='translate3d(-'+this.scaleW+'px,0,0)');
            lis[cidx+1]&&(lis[cidx+1].style.webkitTransform='translate3d(+'+this.scaleW+'px,0,0)');

             lis[cidx].style.transform='translate3d(0,0,0)';
            lis[cidx-1]&&(lis[cidx-1].style.transform='translate3d(-'+this.scaleW+'px,0,0)');
            lis[cidx+1]&&(lis[cidx+1].style.transform='translate3d(+'+this.scaleW+'px,0,0)');

        },
        bindDOM(){
            let self=this;
            let startHandler=function (evt) {
                //记录手指刚刚按下的时间
                self.startTime=new Date()*1;
                self.startX=evt.touches[0].pageX;
                //清除偏移量
                self.offsetX=0;
                //事件对象
                let target = evt.target
                while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                    target = target.parentNode
                }
                self.target = target
            }
            let moveHandler=function(evt){
                self.isSlide=true;
                // evt.preventDefault();
				//计算手指的偏移量
				self.offsetX = evt.targetTouches[0].pageX - self.startX;
				let lis = self.outer.getElementsByTagName('li');
				//起始索引
				let i = self.idx - 1;
				//结束索引
				let m = i + 3;

				//最小化改变DOM属性
				for(i; i < m; i++){
					lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
					lis[i] && (lis[i].style.transition = '-webkit-transform 0s ease-out');
					lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)');
					lis[i] && (lis[i].style.transform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)');
				}
            }
            let endHandler=function (evt) {
                // evt.preventDefault();

				//边界就翻页值
				let boundary = self.scaleW/6;

				//手指抬起的时间值
				let endTime = new Date() * 1;

				//所有列表项
				let lis = self.outer.getElementsByTagName('li');

				//当手指移动时间超过300ms 的时候，按位移算
				if(endTime - self.startTime > 300){
					if(self.offsetX >= boundary){
						self.goIndex('-1');
					}else if(self.offsetX < 0 && self.offsetX < -boundary){
						self.goIndex('1');
					}else{
						self.goIndex('0');
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(self.offsetX > 50){
						self.goIndex('-1');
					}else if(self.offsetX < -50){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}
            }
            this.outer.addEventListener('touchstart', startHandler);
            this.outer.addEventListener('touchmove', moveHandler);
            this.outer.addEventListener('touchend', endHandler);
        }
    }
  }
</script>

<style scoped lang="scss">
	body{
		margin: 0;
		padding: 0;
		background: #333;
		overflow: hidden;
	}
	li,ul{
		list-style: none;
		margin: 0;
		padding: 0;
		height: 100%;
		overflow: hidden;
	}
	/* 使得图片居中 webkit-box */
	li{
		position: absolute;
		display: -webkit-box;
		-webkit-box-pack: center;
		-webkit-box-align: center;
	}
	li img {
		max-width: 100%;
		max-height: 100%;
	}
	/* 隐藏画布外的内容 */
	#canvas{
		height: 100%;
		width: 100%;
		overflow: hidden;
        position:fixed ;
        top:0;
        z-index: 1000;
        left:0;
        background:rgba(0,0,0,0.3);
	}
</style>
