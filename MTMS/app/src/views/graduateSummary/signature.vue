<template>
    <div class="g-wrapper" >
        <c-header>
            <div slot="headerLeft">
                <a class="header-back-btn" @click.stop="back()">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            签名
            <div slot="headerRight">
                <span style="font-size: 0.3rem" @click.stop="submit">提交</span>
            </div>
        </c-header>
        <iframe name="iframe" style="display:none;"></iframe>
        <div class="g-main">
            <div class="signature-c">
                <p @click="signatureFn" class="sign-p">此处签名</p>
                <div id="canvas" ref="canvas">

                </div>
            </div>
            <div class="signature-btn"  >
                 <button id="clearCanvas" ref="clearCanvas" style="margin-left:0.2rem">清除签名</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import cHeader from '@/views/header'
    import methods from '@/methods'
    import { mapState,mapActions } from 'vuex'
    export default {
        name: "signature",
        props:{
          datalist:{
              defalut(){
                  return {}
              }
          }
        },
        data(){
          return{
              isSign:false,
              url:''
          }
        },
        components:{
            cHeader,
        },
        mounted(){
            let self=this;
            this.registerToNative('goBack', function (data) {
                this.back()
            });
            this.$nextTick(()=>{
                this.lineCanvas({
                    el: this.$refs.canvas,//绘制canvas的父级div
                    clearEl:  this.$refs.clearCanvas,//清除按钮
                    saveEl:  this.$refs.saveCanvas,//保存按钮
                });
            })
        },
        watch:{
            datalist(val){
                console.log(val);
            }
        },
        methods:{
            ...methods,
            submit(){
                if(!this.isSign){
                    this.$toast("请留下您的签名");
                    return;
                }else{
                    this.$emit('getsubmit', this.canvas.toDataURL())
                }
            },
            save(){
                this.url=this.canvas.toDataURL();
                var formdata=new FormData();
                formdata.append('file',this.url);
                console.log(formdata.get('file'))
                $.ajax({
                    url:'/file/upload',
                    type:"post",
                    data:{formdata},
                    processData: false,
                    contentType:false,
                    success:function (res) {
                        console.log(res)
                    }
                })
            },
            //签名
            lineCanvas(obj) {
                this.linewidth = 1;
                this.color = "#000000";
                this.background = "#ffffff";
                for (var i in obj) {
                    this[i] = obj[i];
                };
                this.canvas = document.createElement("canvas");
                this.el.appendChild(this.canvas);
                this.cxt = this.canvas.getContext("2d");
                this.canvas.width = this.el.clientWidth;
                this.canvas.height = this.el.clientHeight;
                this.cxt.fillStyle = this.background;
                this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
                this.cxt.strokeStyle = this.color;
                this.cxt.lineWidth = this.linewidth;
                this.cxt.lineCap = "round";
                //开始绘制
                this.canvas.addEventListener("touchstart", function(e) {
                    $('.sign-p').css('display','none');
                    this.cxt.beginPath();
                    this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-$('.signature-c').offset().top);
                }.bind(this), false);
                //绘制中
                this.canvas.addEventListener("touchmove", function(e) {
                    this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-$('.signature-c').offset().top);
                    this.isSign= true;
                    this.cxt.stroke();
                }.bind(this), false);
                //结束绘制
                this.canvas.addEventListener("touchend", function() {
                    this.cxt.closePath();
                }.bind(this), false);
                //清除画布
                this.clearEl.addEventListener("click", function() {
                    this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.isSign=false;
                }.bind(this), false);
                //保存图片，直接转base64
            },
            signatureFn($event){
                $(".sign-p").html('');


            },
            back(){
               this.$emit('getInfo',false);
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../scss/mixin";
    .g-wrapper{
        position: fixed;
        z-index: 0;
        width: 100vw;
        height: 100vh;
        top:0;
        left:0;
        z-index: 10;
        .g-main{
            display: flex;
            flex-flow: column nowrap;
            background: #F8F8F8;
            ul.top{
                background: #fff;
                li{
                    height: 0.6rem;
                    line-height: 0.6rem;
                    padding: 0 0.2rem;
                    border-bottom: 1px solid $borderColor;
                }
            }
            .signature-c{
                margin-top:0.2rem;
                min-height: 5rem;
                background: #fff;
                display:flex;
                flex-flow: column nowrap;
                justify-content:center;
                align-items: center;
                font-size:0.5rem;
                border-bottom: 1px solid $borderColor;
                height: 100%;
                position: relative;
                .sign-p{
                    position: absolute;
                    margin:auto;
                    z-index:10;
                    opacity: 0.3;
                }
            }
            .signature-btn{
                display:flex;
                justify-content: flex-end;
                border:none;
                margin-top:0.2rem;
                padding: 0.2rem;
                padding-bottom: 0.4rem;
                button{
                    padding: 0.1rem;
                    border:1px solid $activeColor;
                    text-align: center;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: center;
                    align-items: center;
                    color:$activeColor;
                    border-radius: 5px;
                    background:#fff;

                }
            }
            #canvas{
                width: 100%;
                height:100%;
                position: relative;
            }
            #canvas canvas{
                display: block;
            }
        }

    }

</style>
