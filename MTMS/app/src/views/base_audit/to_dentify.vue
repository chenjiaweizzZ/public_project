<template>
    <div class="to_Dentify_Wrap">
        <div class="grade" @click="greadsubmit">
            年级
        </div>
        <ul class="dentify_Ul_Header">
            <li>姓名</li>
            <li>专业基地</li>
            <li>提交日期</li>
        </ul>
        <div class="dentify_Ul_Wrap">
            <ul class="dentify_Ul" v-for="(item,index) in dataList" @click="toDentify(item)">
                <li>{{item.name}}</li>
                <li>{{item.basename}}</li>
                <li >{{item.stdsubdatestr}}<img src="../../assets/images/bnt_xiangyou.png" class="dentifyArrow"/></li>
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        name: "to_den",
        props:{
           dataList:{
               type:Array,
               default(){
                   return [];
               }
           }
        },
        data(){
            return{

            }
        },
        methods:{
            toDentify(item){
                this.$router.push({
                    // path:'/baseAudit/audit',
                    name: "audit_evaluation",
                        query:{
                            id:item.id,
                            yearflag:item.yearflag,
                            stdid:item.stdid,
                            totype:1,
                            type:1
                        }
                });
            },
            greadsubmit(){
                this.$emit('greadtrue',true)
            }
        },
        mounted(){

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../scss/mixin";
    .to_Dentify_Wrap{
        .grade{
            height:0.6rem;
            text-align:right;
            border-bottom: $borderColor;
            line-height:0.6rem;
            color:$activeColor;
            padding-right: 0.2rem;
            border-bottom:1px solid $borderColor;
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
                };
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
         .dentify_Ul_Header{
             li{
                 font-size:0.24rem;
             }
         }
    }
</style>
