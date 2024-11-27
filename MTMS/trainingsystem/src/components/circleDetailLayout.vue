<template>
    <div class = "circleDetail">
        <div class ="monthHeader">
            <div v-for="(item,index) in alltime" :style = "{width:(item.daycount*3)+'px'}" class = "monthCell">{{item.yearmonth}}</div>
        </div>

        <div class = "circleDetailRow" style = "height48px" v-for = "(rowData,index) in circleData">
            
            <div class = "roomCell" v-for = "(roomInfo,ind) in rowData"
                 :style = "{width:(roomInfo.plandetaildaycount)*3+'px','margin-left':computemargin(roomInfo),'background-color':computeColor(roomInfo)}"
                 :title ="roomInfo.dept_name" @click="notreason(roomInfo)">
                 <el-tooltip class="item" effect="light" placement="top" :content="roomInfo.dept_name"><span>{{roomInfo.dept_name}}</span></el-tooltip>
                
            </div>
        </div>
        <el-dialog title = "查看未轮转原因" :visible.sync="notdialog" @close="notdialog = false">
            <div>
                <label>未轮转原因:</label>
                <span v-for="(item,index) in turnnotlist" :key="index">
                    &nbsp;&nbsp;{{item.turnnotname}}&nbsp;&nbsp;
                </span>
            </div>
            <div class="mt20">
                <div>
                    未轮转原因说明: {{whynottextarea}}
                </div>
            </div>
        </el-dialog>
    </div>


    <!--:style = "width:computeWidth(roomInfo)"-->
</template>
<script>
    import _ from 'lodash/array';
    import moment from 'moment';
    export default {
        props:{
            circleData:Array,
            alltime:Array,
            height:Number
        },
        computed:{

        },
        data(){
            return{
                notdialog:false,
                turnnotlist:[],
                whynottextarea:'',
            }
        },
        mounted(){},
        methods: {
            computemargin(roomInfo){
                if(roomInfo.beforedaydiff == 1 || roomInfo.beforedaydiff == 0){
                    return '0px'
                }else {
                    return roomInfo.beforedaydiff * 3 +'px'
                }
            },
            computeColor(roomInfo){
                if(roomInfo.turn_status==3){
                    return '#d3dce6';
                }else if(roomInfo.turn_status==1){
                    return '#20db9a';
                }else if(roomInfo.turn_status==0){
                    return '#f99e1c';
                }else if(roomInfo.turn_status == 4){
                    return '#F56C6C'
                }else{
                    return '#d3dce6';
                }
            },
            notreason(roomInfo){
                if(roomInfo.turn_status == 4){
                    this.turnnotlist = roomInfo.turnnotlist;
                    this.whynottextarea  = roomInfo.remark;
                    this.notdialog = true;
                }else{
                    return
                }
            }
        }
    }

</script>
<style scoped>
    .circleDetail{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .monthHeader{
        height:48px;
        display:flex;
        border-top: 1px solid rgb(223, 230, 236);
        border-bottom: 1px solid rgb(223, 230, 236);
        /* position: absolute;
        top: 0;
        left: 0;
        z-index: 990; */
    }
    .monthCell{
        width: 100px;
        height: 48px;
        box-sizing: border-box;
        border-right: 1px solid rgb(223, 230, 236);
        border-bottom: 1px solid rgb(223, 230, 236);
        background-color:#eef1f6;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        line-height:48px;
        position: relative;
    }
    .circleDetailRow{
        display: flex;
        height: 48px;
        padding:5px 0px;
        border-bottom: 1px solid rgb(223, 230, 236);
        box-sizing: border-box;
    }
    .roomCell{
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        width: 50px;
        color:#ffffff;
        background-color: #d3dce6;
        line-height: 38px;
        text-align: center;
        box-sizing: border-box;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mt20{
        margin-top: 20px;
    }
    .tr{border-bottom: 1px solid #dfe6ec;}
    .tr td{height:48px;box-sizing: border-box;}
    .tr div{display: inline-block}
</style>
