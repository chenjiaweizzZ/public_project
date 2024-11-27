<template>
  <div class="intelligent-c">
      <template>
          <el-tabs v-model="activeModel" @tab-click="handleClick">
              <el-tab-pane label="科室均衡性查看" :name="index">
                  <dept-Equilibrium></dept-Equilibrium>
              </el-tab-pane>
              <el-tab-pane label="学员轮转计划查看" :name="index" >
                  <dept-Schedule ref="deptschedule"></dept-Schedule>
              </el-tab-pane>
          </el-tabs>
      </template>
      <div class="btn-box">
          <el-button @click="cancelResult"  :class="{noclick:isubmit}">取消结果</el-button>
          <el-button type="primary" @click="saveResult" v-loading="btnloading" :class="{noclick:isubmit}">保存结果</el-button>
      </div>
  </div>
</template>

<script>
import {post,getCookie,exportMouldExcel,showErrorImport} from '../../config/util.js';
import {mapActions, mapState} from 'vuex'
 import deptEquilibrium from './components/deptEquilibrium'
 import deptSchedule from  './components/deptSchedule'
 export default {
     name: "intelligentPreview",
     data(){
         return{
             index:"",
             activeModel:'',
             btnloading:false,
             isubmit:false
         }
     },
     components:{
         deptEquilibrium,
         deptSchedule
     },
     methods:{
         handleClick(tab){
            if(tab.index==1){
                 this.$refs['deptschedule'].calculateWid()
            }
         },

         // 保存结果
         saveResult() {
             this.btnloading=true;
             this.issubmit=true;
             post('/turn/addturnplandetailfromtemp', {
                 command: 'turn/addturnplandetailfromtemp',
                 sessionid: getCookie('sid'),
                 loginid: getCookie('uid'),
             }).then((data)=>{
                 this.btnloading=false;
                 this.issubmit=false;
                 if (data && data.errcode == 0) {
                     this.$message({
                         type:"success",
                         message:"保存成功"
                     })
                     this.$router.push({
                         path: '/circlePlanDetail/'+this.$route.query.planid,
                         query: {
                             begintime: this.$route.query.startTime,
                             endtime: this.$route.query.endTime,
                             turnplanname: this.$route.query.turnplanname,
                         }
                     })
                 }else{
                     this.$message({
                         type: 'warning',
                         message: data.errdesc
                     })
                 }
             }).catch(function (error) {
             })
         },

         // 取消结果
         cancelResult() {
             this.isubmit=true;
             post('/turn/cancelturnplandetailtemp', {
                 command: 'turn/cancelturnplandetailtemp',
                 sessionid: getCookie('sid'),
                 loginid: getCookie('uid'),
             }).then((data)=> {
                 this.isubmit=false;
                 this.btnloading=false;
                 if (data && data.errcode == 0) {
                     this.$message({
                         type:"success",
                         message:"取消成功"
                     })
                     window.history.back();
                 }else{
                     this.$message({
                         type: 'warning',
                         message: data.errdesc
                     })
                 }
             }).catch(function (error) {
             })
         }
         
     },
     mounted() {
     }
 }
</script>

<style lang="scss" scoped>
.btn-box {
 display: flex;
 align-items: center;
 justify-content: center;
 margin-top: 20px;
}
</style>
