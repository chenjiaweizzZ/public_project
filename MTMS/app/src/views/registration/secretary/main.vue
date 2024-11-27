<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn" v-if="!arrow.getShowArrows">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科报名审核
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title="待审核" :active="type == 1" :bus="bus" data="1">
            </c-tab>
            <c-tab title="审核通过" :active="type == 2"  :bus="bus" data="2">
            </c-tab>
            <c-tab title="审核不通过" :active="type == 3"  :bus="bus" data="3">
            </c-tab>
        </c-tabs>
        <div class="g-main">
            <!-- <div v-show='type == 1'>
                <c-waiting :active="type == 1"></c-waiting>
            </div> -->
            <div>
                <c-finished :active="activeFalg" @changestatus=changestatus :status='flag' @getShowArrows="getShowArrows" :type="type"></c-finished>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import methods from '../../../methods';
    import cHeader from '../../header';
    import cTab from '../../../components/tab';
    import cTabs from '../../../components/tabs';
    import cWaiting from './waiting';
    import cFinished from './finished';
    let bus = new Vue();
    export default {
        data() {
            return {
                activeFalg: true,
                type: 1,
                detailid:'',//统计的id
                bus:bus,
                flag:'',
                _flag:0,
                arrow:{}
            }
        },
        components: {
            cHeader,
            cTab,
            cTabs,
            cWaiting,
            cFinished,
        },
        computed:{},
        watch:{

        },
        created() {
            this.type = this.$route.query.from ? 2 : 1;
            if(this.type == 2){
                this.flag ={val:1}
            }
        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            back(){//返回上一级
                if(this._flag){
                    this._flag = 0;
                    this.flag = this.flag.val ?  {val:0} : {val:1}
                }else {
                    // window.location.href='/pages/futuredoctorapp/todo.html?view=application';
    //                 if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
    window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
                }
            },
            changeTab(tab) {
                this.type = tab.data;
            },
            changestatus(data){
                this._flag = data;
            },
            getShowArrows(val){
                this.$set(this.arrow,'getShowArrows',val);
            }
        }
    }
</script>
