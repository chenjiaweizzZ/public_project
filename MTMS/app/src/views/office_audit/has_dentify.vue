<template>
    <div class="has_Dendify_Wrap">
        <ul class="has_Dentify_Item" v-for="item in dataList" @click="todetail(item.grade,item.yearflag)">
            <li>{{item.gradename}}第{{item.yearflag}}年度</li>
            <li>{{item.count}}人</li>
            <li class="iconLi"><img src="../../assets/images/bnt_xiangyou.png" alt=""></li>
        </ul>
    </div>

</template>

<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import methods from '@/methods'
    export default {
        name: "has_dentify",
        props:{
            dataList:{
                type:Array,
                default(){
                    return []
                }
            },

        },
        data(){
            return{
                mainList:[],
                has_type:true,
                searchcontent:'',
                seachgread:'',
                seachyear:'',
            }
        },
        watch:{},
        methods:{
            ...methods,
            todetail(gread,year){
                this.$router.push({
                    // path:'/officeAudit/dentify_main',
                    name: "dentify_main_list",
                    query:{
                        gread:gread,
                        year: year,
                        count:this.dataList.count
                    }
                });
            },

        }
    }
</script>

<style scoped lang="scss">
    @import "../../scss/mixin.scss";
    .has_Dendify_Wrap {
        .has_Dentify_Item {
            @include sexy-flex();
            margin-bottom: 0.2rem;
            background: #fff;
            &:nth-child(1) li {
                border-top: 0 !important;

            }
            li {
                height: 0.6rem;
                line-height: 0.6rem;
                padding: 0 0.2rem;
                border-bottom: 1px solid $borderColor;
                border-top: 1px solid $borderColor;
                &:nth-child(1) {
                    @include flex1(3);
                }
                &:nth-child(2) {
                    @include flex1(1)
                }
                &.iconLi {
                    width: 0.5rem;
                    img {
                        width: 0.3rem;
                        height: 0.3rem;
                        float: right;
                        margin: 0.15rem 0;
                    }

                }
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .to_Dentify_Wrap{
            .grade{
                height:0.6rem;
                text-align:right;
                border-bottom: $borderColor;
                line-height:0.6rem;
                color:$activeColor;
                padding-right: 0.2rem;
                border-bottom:1px solid $borderColor;
                position:relative;
                input{
                    width:100%;
                    background: #F8F8F8;
                    padding-left: .2rem;
                    margin-top: .1rem;
                }
                .tosearch {
                    position: absolute;
                    width: .5rem;
                    height: .5rem;
                    background: url("../../assets/images/search-white.png") 0 0 no-repeat;
                    background-size: 100%;
                    position: absolute;
                    right: 5%;
                    top: 5%;
                    color: #fff;
                }
            }
            .dentify_Ul, .dentify_Ul_Header{
                @include sexy-flex();
                li{
                    text-align: center;
                    line-height:0.6rem;
                    @include flex1(1);
                    border-bottom: 1px solid $borderColor;
                    height:0.6rem;
                    font-size:0.2rem;
                    .dentifyArrow{
                        width:0.3rem;
                        height:0.3rem;
                        float:right;
                        margin:0.15rem
                    }
                }
            }
            .dentify_Ul_Header{
                li{
                    font-size:0.24rem;
                }
            }
        }
    }
</style>
