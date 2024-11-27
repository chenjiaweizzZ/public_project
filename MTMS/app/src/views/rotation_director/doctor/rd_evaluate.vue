<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            日常评价
        </c-header>
        <div class="g-main">
            <div @click='evaluateTeacher(1)'>
                <p class="left">
                    <img src="../../../assets/images/icon_pingjiadaikelaoshi.png" alt="">
                    <span>评价带教老师</span>
                </p>
                <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt="">
            </div>
            <div @click='evaluateTeacher(5)'>
                <p class="left">
                    <img src="../../../assets/images/icon_pingjiadaikelaoshi.png" alt="">
                    <span>评价科室</span>
                </p>
                <img class="right" src="../../../assets/images/bnt_xiangyou.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    export default {
        name: 'rotation_doctor_exam',
        components: {
            cHeader
        },
        data() {
            return {
                detailinfo:''
            }
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back();
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
            back(){
                let self = this;
                this.$router.push({
                    name: 'fdRotation_doctor_exam_director',
                    query:{
                        type:self.$route.query.type,
                        id:self.$route.query.id
                    }
                })
            },
            evaluateTeacher: function (param) {
                let self = this
                if(param == 1){
                    if( this.turninfo.teachingid !== 'null' ){
                        this.$router.push({
                            name: 'fdRotation_doctor_evaluatelist_director',
                            query: {
                                booking: 1,
                                param:param,
                                type:self.$route.query.type,
                                id:self.$route.query.id
                            }
                        })
                    }else{
                        self.toast('您还没有带教老师！')
                    }
                }else if(param == 5){
                    this.$router.push({
                        name: 'fdRotation_doctor_evaluatelist_director',
                        query: {
                            booking: 1,
                            param:param,
                            type:self.$route.query.type,
                            id:self.$route.query.id
                        }
                    })
                }
            }
        }
    }

</script>
<style scoped>
    .g-main{
        font-size:0.24rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .g-main div {
        width: 100%;
        background: white;
        /*height: 1rem;*/
        /*line-height: 1rem;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.3rem;
        margin-top: 0.1rem;
    }

    .left {
        margin: 0;
        /*color: #333333;*/
        /*font-size: .3rem;*/
        display: flex;
        align-items: center;
    }

    .left img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }

    .right {
        width: 0.2rem;
        height: 0.2rem;
    }

</style>
