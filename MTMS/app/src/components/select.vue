<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut" >
        <div class="shade" v-show="config.show" @click="close">
            <div v-show="config.show"
                 class="select"
                 style="animation-duration: .5s"
                 :style="{top:config.fixedvalue}"
                 enter-active-class="animated fadeInDown"
                 leave-active-class="animated fadeOutUp">
                <ul>
                    <li v-for="(value,index) in list"
                        :class="{'noclick':stopclick,'active':k == index}"
                        :style = "{'text-align':config.textposition}"
                        @click="select(value,index)">{{value.txt}}</li>
                </ul>
            </div>
        </div>
    </transition>
</template>
<script type="text/javascript">

    export default {
        props: {
            config: {
                default: function(){
                    return {
                        show: false,
                        label:'',//需要显示的label
                        fixedvalue: 0,//top值
                        textposition: 'center',//label的位置
                    }
                }
            },
            dataList:{
                type:Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                stopclick:false,
                k:-1
            }
        },
        mounted: function () {

        },
        methods: {
            close(){
                this.config.show = false;
            },
            select(value,index){
                this.k = index;
                this.$emit('confirm',value);//传给父组件
            }
        },
        watch: {

        },
        computed: {
            list(){
                let label = this.config.label || '' ;

                if(this.dataList.length > 0){
                    this.stopclick = false;
                    this.dataList.map(value => {
                        value.txt = value[label]
                    });
                    return this.dataList
                }else {
                    this.stopclick = true;
                    return [
                        {
                            'txt':'当前暂无数据'
                        }
                    ]
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .select {
        z-index: 999;
        position: fixed;
        max-height: 5rem;
        width: 100%;
        overflow-y: auto;
    }
    .select ul{
        background: #fff;
        color: #666;
        li {
            line-height: .7rem;
            padding: 0 .2rem;
            border-bottom: 1px solid #eee;
        }
    }
    .stopclick {
        pointer-events: none;
    }
    .active {
        color: #3499db;
    }
</style>
