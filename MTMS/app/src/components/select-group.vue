<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut" >
        <div id="select-group">
            <div class="shade" v-show="config.show" @click="config.show = false"></div>
            <div v-show="config.show"
                 class="select"
                 style="animation-duration: .5s"
                 :style="{top:config.fixedvalue}"
                 enter-active-class="animated fadeInDown"
                 leave-active-class="animated fadeOutUp">
                <div class="select-content">
                    <ul class="left-part">
                        <li v-for="(value,index) in list.childlist"
                            :class="{'noclick':stopclick,'active':index == i}"
                            :style = "{'text-align':config.textposition}"
                            @click = 'choiceleft(value.id,index)'
                        >{{value.txt}}</li>
                    </ul>
                    <ul class="right-part">
                        <li v-show = 'listchild.childlist && listchild.childlist.length > 1' :style = "{'text-align':config.textposition}" :class="{'active':checkedall}" @click="choiceall">全部</li>
                        <li v-for="(value,index) in listchild.childlist" :key="value.id"
                            :class="{'noclick':stopclick ,'active':value.checkflag}"
                            :style = "{'text-align':config.textposition}" @click='check(value.id)'>
                            {{value.txt}}</li>
                    </ul>
                </div>
                <div class="select-bottom">
                    <span @click="close">取消</span>
                    <span @click="select">确定</span>
                </div>
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
                type:[ Array,Object ] ,
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                stopclick:false,
                normallist:'',
                listchild:[],
                i:-1,
                checkedall:false,
            }
        },
        mounted: function () {

        },
        methods: {
            close(){
                this.config.show = false;
            },
            choiceleft(param,index){
                let self = this;
                this.i = index;
                this.checkedall = false;
                self.listchild = [] ;
                this.dataList.childlist.map(value => {
                    value.childlist.map(val => {
                        val.checkflag = false;
                    })
                });
                this.dataList.childlist.map(val => {
                    if(val.id == param){
                        self.listchild = val;
                    }
                })
            },
            select(){
                let sure = false ;
                if(this.listchild.childlist && this.listchild.childlist.length > 0){
                    this.listchild.childlist.map(value => {
                        if(value.checkflag == true){
                            sure = true
                        }
                    });
                }

                if(this.checkedall == true || sure == true){
                    this.$emit('confirm',this.listchild);//传给父组件
                }else {
                    this.config.show = false;
                }
            },
            choiceall(){
                this.checkedall = this.checkedall ? false : true ;
                this.listchild.checkall = 'true';
                this.listchild.childlist.map(value => {
                    value.checkflag =  false;
                })
            },
            check(id){
                this.checkedall = false ;
                this.listchild.checkall = 'false';
                this.listchild.childlist.map(value => {
                    if (value.id == id) {
                        value.checkflag = value.checkflag == true ? false : true ;
                    }
                });
            }
        },
        watch: {

        },
        computed: {
            list(){
                let label = this.config.label || '' ;
                if(this.dataList.childlist){
                    this.dataList.childlist.map((value,index) => {
                        if(index == 0 && this.i == -1){
                            this.i = index
                            this.listchild = value
                        }
                    })

                    this.normallist = this.dataList;
                    this.stopclick = false;
                    this.dataList.childlist.map((value,index) => {
                        value.txt = value[label];
                        value.childlist.map(val => {
                            val.txt = val[label];
                            this.$set(val, 'checkflag', false)
                        })

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
    #select-group {
        background: transparent;
        z-index: 88;
    }
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
        position: absolute;
        max-height: 6.2rem;
        width: 100%;
        overflow: hidden;
        z-index: 100;
    }
    .select ul{
        color: #666;
        max-height: 5.6rem;
        overflow-y: auto;
        li {
            line-height: .7rem;
            padding: 0 0.4rem 0 0.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
        }
    }
    .select-content {
        display: flex;
        background: #fff;
        max-height: 6.2rem;
    }
    .select-bottom {
        display: flex;
        background: #fff;
        border-bottom: 1px solid #eee;
        span {
            color: #3499db;
            line-height: .7rem;
            flex: 1;
            width: 0;
            text-align: center;
        }
    }
    .left-part{
        flex: 1;
        li {
            background: #F4F5F9;
        }
        li.active {
            background: #fff;
            color: #000;
            font-weight: bold;
        }
    }
    .right-part {
        flex: 2;
        background: #fff;
        border-bottom: 1px solid #eee;
        li:after {
            content: '';
            display: inline-block;
            width: .25rem;
            height: .25rem;
            border-radius: 50%;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            background-image: url('../assets/images/gouxuan.png');
            background-size: cover;
            position: absolute;
            right: .25rem;
            top: 0.225rem;
        }
        li.active:after {
            background-image: url('../assets/images/gouxuan_on.png');
            background-size: cover;
        }
    }
    .stopclick {
        pointer-events: none;
    }
</style>
