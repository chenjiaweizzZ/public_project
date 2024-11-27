<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            护士长评价护培生
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title="待评" :active="type == 1" :bus="bus" data="1">

            </c-tab>
            <c-tab title="已评" :active="type == 2"  :bus="bus" data="2">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <div v-show='type == 1'>
                <c-waiting :active="type == 1"></c-waiting>
            </div>
            <div v-show='type == 2'>
                <c-ready :active="type == 2"></c-ready>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import cTab from '../../../components/tab'
    import cTabs from '../../../components/tabs'
    import cReady from './ready'
    import cWaiting from './waiting'
    let bus = new Vue()
    export default {
        components: {
            cTab,
            cTabs,
            cReady,
            cWaiting,
            cHeader,
            methods
        },
        data() {
            return {
                type: 1,
                bus: bus
            }
        },
        created() {
            this.type = this.$route.query.where;
        },
        mounted() {
            let self = this
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            back:function () {
                // location.href = '/pages/futuredoctorapp/todo.html?view=application';
    //             if(this.$route.query.stem) {
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
            },
            changeTab(tab) {
                this.type = tab.data;
            }
        }
    }

</script>
<style scoped>

</style>
