<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考试报名
            <div slot="headerRight" @click="tosingnup" style="font-size: 0.3rem">
                报名
            </div>
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title="待审核" :active="type == 1" :bus="bus" data="1">

            </c-tab>
            <c-tab title="已审核" :active="type == 2"  :bus="bus" data="2">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <div v-show='type == 1'>
                <c-examining :active="type == 1"></c-examining>
            </div>
            <div v-show='type == 2'>
                <c-examined :active="type == 2"></c-examined>
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
    import cExamined from './examined';
    import cExamining from './examining';
    import { mapState, mapActions } from 'vuex';
    let bus = new Vue();
    export default {
        data() {
            return {
                type: 1,
                bus:bus,
            }
        },
        components: {
            cHeader,
            cTab,
            cTabs,
            cExamined,
            cExamining,
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        watch:{

        },
        created() {

        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            tosingnup(){
                let self = this;
                this.post('/turnexam/validateturnexamday',{
                    command:'turnexam/validateturnexamday',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    businessid: this.turninfo.businessid,
                }).done( res => {
                    if(res && res.errcode == 0){
                       if(res.flag == 0){
                           self.toast(res.message);
                       }else{
                           self.$router.push({
                               name: 'fdDoctorSignup',
                               query:{
                                   type:self.$route.query.type,
                                   id:self.$route.query.id,
                               }
                           })
                       }
                    }
                });
            },
            back(){//返回上一级
                let self = this;
                this.$router.push({
                    name: 'fdRotation_doctor_exam',
                    query:{
                        type:self.$route.query.type,
                        id:self.$route.query.id,
                    }
                })
            },
            changeTab(tab) {
                this.type = tab.data;
            },
        }
    }
</script>
