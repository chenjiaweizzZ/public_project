<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut" >
    <div class="toast-wrap"
         :style="{
            zIndex: maxZIndex,
            'animation-duration': toast.duration || '.3s',
            'animationDuration': toast.duration || '.3s',
         }"
         :class="{
            'no-mask': toast.mask === false
         }"
         transition="fade" v-show="toast.show">
        <div class="toast-center" v-html="toast.msg"></div>
    </div>
    </transition>
</template>
<style>
.toast-wrap {
    background-color:none !important;
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    background: rgba(0, 0, 0, 0.4);
}
.toast-wrap .toast-center{
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    margin-left: auto;
    margin-right: auto;
    display: inline-block;
    background: #fff;
    font-size: .22rem;
    padding: .16rem .3rem;
    /*border: 2px solid #333;*/
    transform: translate3d(-50%,-50%,0);
    opacity:.8;
    border-radius: .5rem;
}
.toast-wrap.no-mask {
    top: 50%;
    height:0;
}
.toast-wrap.no-mask .toast-center {
    opacity: 1;
    box-shadow: 0 0 5px #CCC;
}
</style>
<script>

import { mapState, mapActions } from 'vuex';

export default {
    watch: {
        'toast.show': function(val, oldVal) {
            let self = this;
            if(val === true) {
                setTimeout(() => {
                    this.hideToast();
                }, this.toast.timeout);
            }
        }
    },
    computed: mapState([
        'toast',
        'maxZIndex'
    ]),
    methods: {
        ...mapActions([
            'hideToast'
        ])
    }
}
</script>
