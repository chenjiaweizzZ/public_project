<template>
    <div class="scroll-loadmore"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @scroll="infiniteLoading ? onScroll($event) : undefined">
        <section class="inner">
            <slot></slot>
            <footer class="load-more">
                <slot name="load-more">
                    <span>{{loadingText}}</span>
                </slot>
            </footer>
        </section>
    </div>
</template>

<script>
    /**
     *
     * loadingText => 底部显示的文字信息
     * loading => loading-modal 是否还可以继续请求
     *
     */
    export default {
        name:'load-more',
        props: {
            loadingText: {
                type: String
            },
            loading: {
                type: Boolean,
                default: true
            },
            infiniteLoading: {
                type: Boolean,
                default: false
            },
            toTop: {
                type: Boolean,
                default: false
            }
        },
        watch:{
            toTop:function(val,oldval){
                if(val !== oldval){
                    this.$el.scrollTop = 0 ;
                }
            }
        },
        data () {
            return {
                startY: 0,//开始滑动的Y坐标
                startScroll: 0,//标记是否开始滑动
            };
        },
        methods: {
            //开始滚动，记录开始的Y坐标（手指相对于页面的坐标）
            //记录当前组件向下滚动的距离
            touchStart (e) {
                this.startY = e.targetTouches[0].pageY;
                this.startScroll = this.$el.scrollTop || 0;
            },

            touchMove (e) {
                if (this.$el.scrollTop > 0) {
                    return;
                }
                let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
                if (diff > 0) e.preventDefault();
            },
            //
            infinite () {
                // 显示loading
                this.infiniteLoading = true;
                //通知父组件开始执行请求，并且请求完成隐藏loading
                this.$emit('getmore',this.infiniteDone);
                // this.onInfinite(this.infiniteDone);
            },

            infiniteDone () {
                this.infiniteLoading = false;
            },

            onScroll () {
                // 如果正在loading ，返回
                if (!this.infiniteLoading) {
                    return;
                }
                //记录当前组件的视窗高度
                let outerHeight = this.$el.clientHeight;
                // 记录 .inner 的视窗高度
                let innerHeight = this.$el.querySelector('.inner').clientHeight;
                //当前组件滚动了多少
                let scrollTop = this.$el.scrollTop;
                //记录 .load-more 的视窗高度
                let infiniteHeight = this.$el.querySelector('.load-more').clientHeight;
                //记录 .inner  剩下的高度
                let bottom = innerHeight - outerHeight - scrollTop;
                //如果 .inner 剩下的高度小于 .load-more 的高度  显示footer   开始请求
                if (bottom < infiniteHeight) this.infinite();
            }
        },
    };
</script>

<style>
    .scroll-loadmore {
        position: relative;
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background-color: #f4f4f4;
    }

    .scroll-loadmore .inner {
        position: absolute;
        top: 0;
        width: 100%;
        transition-duration: 300ms;
    }

    .scroll-loadmore .load-more {
        height: .76rem;
        font-size: 0.25rem;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #3499db;
    }
</style>
