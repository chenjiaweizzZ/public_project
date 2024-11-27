<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            护培轮转
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title="查看被评价" :active="type == 1" :bus="bus" data="1">

            </c-tab>
            <c-tab title="带教记录" :active="type == 2"  :bus="bus" data="2">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <div v-show='type == 1'>
                <history-ready :active="type == 1"></history-ready>
            </div>
            <div v-show='type == 2'>
                <history-evaluate :active="type == 2"></history-evaluate>
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
    import historyReady from './history_ready'
    import historyEvaluate from './history_evaluate'
    let bus = new Vue();
    export default {
        data() {
            return {
                type: 1,
                bus: bus
            }
        },
        components: {
            cTab,
            cTabs,
            cHeader,
            historyReady,
            historyEvaluate
        },
        computed: {},
        watch: {},
        created() {
            this.type = this.$route.query.where ? this.$route.query.where : 1
        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            back:function () {
                this.$router.push({
                    name: 'fdRotation_teacher_director',
                })
            },
            changeTab(tab) {
                this.type = tab.data;
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
