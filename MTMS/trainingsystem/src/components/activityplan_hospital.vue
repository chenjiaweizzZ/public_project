<template>
  <div class = "children-wapper">
      <div class="grade">
          <h5>年级</h5> <!--{{greadcheckedlist}} ====  {{hos_check_greadlist}}-->
          <el-checkbox :indeterminate="isIndeterminate" v-model="greadcheckall" @change="greadCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="greadcheckedlist" @change="greadCheckChange" class="basegroup">
              <el-checkbox v-for="(item,index) in hos_check_greadlist" :label="item.key" :key="index">
                  {{item.name}}
              </el-checkbox>
          </el-checkbox-group>
      </div>

      <div class="studenttype">
          <h5>学员类型</h5>   <!--{{stutypecheckedlist}}  ====   {{hos_check_stutypelist}}-->
          <el-checkbox :indeterminate="isstutypestyle" v-model="stutypecheckall" @change="stutypeCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="stutypecheckedlist" @change="stutypeCheckChange" class="basegroup">
              <el-checkbox v-for="(item,index) in hos_check_stutypelist" :label="item.key" :key="index">
                  {{item.name}}
              </el-checkbox>
          </el-checkbox-group>
      </div>

      <div class="base">
          <h5>基地</h5>   <!--{{basecheckedlist}}-->
          <el-checkbox :indeterminate="isbasestyle" :checked="false" v-model="basecheckall" @change="baseCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="basecheckedlist" @change="baseCheckChange" class="basegroup">
              <el-checkbox v-for="(item,index) in hos_check_baselist" :label="item.id" :key="index">
                  {{item.deptname}}
              </el-checkbox>
          </el-checkbox-group>
      </div>

      <div class="act-bottom">
          <el-button type="primary" @click="savesubmit(true)" >保存</el-button>
          <el-button @click="close">取消</el-button>
      </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import {post,getCookie,setTitle} from '../config/util'
  import {mapState,mapActions} from 'vuex'
  export default {
      props: {
          activiflag:'',
          activityhosplan_list:{
              default (){
                  return []
              }
          },
          editinitlist:{
              default () {
                  return []
              }
          }
      },
      data(){
          return {
              // 11-07 院级参与人业务逻辑修改
              isIndeterminate:false, //样式控制
              isstutypestyle:false,
              isbasestyle:false,
              greadcheckall:false,
              greadcheckedlist:[],
              stutypecheckall:false,
              stutypecheckedlist:[],
              basecheckall:false,
              basecheckedlist:[],
              hos_check_greadlist:[],
              hos_check_stutypelist:[],
              hos_check_baselist:[],
              lins_list:[],
              temp:{}
          }
      },
      computed:{
          ...mapState(['allOption'])
      },
      watch:{
          'activiflag':function(val,oldval){
              if(val && val == "clear"){
                  this.greadcheckedlist = [];
                  this.stutypecheckedlist = [];
                  this.basecheckedlist = [];
                  this.isIndeterminate = false;//样式控制
                  this.isstutypestyle = false;
                  this.isbasestyle = false;
                  this.greadcheckall = false;
                  this.stutypecheckall = false;
                  this.basecheckall = false;
              }
          },
          'activityhosplan_list':function (val) {
              this.inithospitalgradelist();
              this.inithospitalstudentlist();
              this.initgetbaselist();

          },
          'editinitlist':function(val,oldval){
              if(val){
                  this.initeditdata();
              }
          }
      },
      mounted(){
          /// this.initAllOptionListUG({type:'turngrade'}); //年级
          ///  this.initAllOptionListUG({type:'stud_type'}); //学生类型
          this.inithospitalgradelist();
          this.inithospitalstudentlist();
          this.initgetbaselist(); //基地
          this.initeditdata();
      },
      methods: {
          ...mapActions(['initAllOptionListUG','initAllbaselist']),
          initeditdata(){
              let _vallist = [];
              let _greadchecklist = [] ;
              let _stutyppelist = [] ;
              let _baselist = [] ;
              this.editinitlist.map(item =>{
                  if( item.bustype == 'grade' ){
                      _greadchecklist.push(item.attendbusid ? item.attendbusid : item.id)
                  }else if( item.bustype == 'type'){
                      _stutyppelist.push(item.attendbusid ? item.attendbusid : item.id)
                  }else if( item.bustype == 'base'){
                      _baselist.push(item.attendbusid ? item.attendbusid : item.id)
                  };
              })
              this.greadcheckedlist = _greadchecklist;
              this.stutypecheckedlist = _stutyppelist;
              this.basecheckedlist = _baselist;
          },
          //年级
          inithospitalgradelist(){
              let self = this;
              post('/traineestudent/queryDictionaryList',{
                  command:'traineestudent/queryDictionaryList',
                  sessionid:getCookie('sid'),
                  loginid:getCookie('uid'),
                  uid:getCookie('uid'),
                  code: "turngrade"
              }).then((data)=>{
                  if(data&&data.errcode==0){
                      self.hos_check_greadlist = data.dic_list; //学员类型
                  }
              })
          },
          // 学员类型
          inithospitalstudentlist(){
              let self = this;
              post('/traineestudent/queryDictionaryList',{
                  command:'traineestudent/queryDictionaryList',
                  sessionid:getCookie('sid'),
                  loginid:getCookie('uid'),
                  uid:getCookie('uid'),
                  code: "stud_type"
              }).then((data)=>{
                  if(data&&data.errcode==0){
                      self.hos_check_stutypelist = data.dic_list; //学员类型
                  }
              })
          },
          //基地
          initgetbaselist(){
              post('/deptinfo/getdeptlist',{
                  command:'deptinfo/getdeptlist',
                  sessionid:getCookie('sid'),
                  loginid:getCookie('uid'),
                  uid:getCookie('uid'),
                  deptcode:'base'
              }).then((data)=>{
                  if(data&&data.errcode==0){
                      this.hos_check_baselist= data.beanlist;
                  }
              })

          },
          // 2018-11-07
          //  院级活动参与人 - 年级
          greadCheckAllChange(event){
              let _list = [];
              this.hos_check_greadlist.map(item =>{
                  _list.push(item.key);
              })
              this.greadcheckedlist = event.target.checked ? _list : [];
              this.isIndeterminate = false;
          },
          greadCheckChange(value){
              let checkedCount = value.length;
              this.greadcheckall = checkedCount === this.hos_check_greadlist.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.hos_check_greadlist.length;
          },

          //院级活动参与人 - 人员类型
          stutypeCheckAllChange(event){
              let _list = [];
              this.hos_check_stutypelist.map(item =>{
                  _list.push(item.key)
              })
              this.stutypecheckedlist = event.target.checked ? _list : [];
              this.isstutypestyle = false;
          },
          stutypeCheckChange(value){
              let checkedCount = value.length;
              this.stutypecheckall = checkedCount === this.hos_check_stutypelist.length;
              this.isstutypestyle = checkedCount > 0 && checkedCount < this.hos_check_stutypelist.length;
          },

          //院级活动参与人 - 基地
          baseCheckAllChange(event){
              let _list = [];
              this.hos_check_baselist.map(item =>{
                  _list.push(item.id)
              })
              this.basecheckedlist = event.target.checked ? _list : [];
              this.isbasestyle = false;
          },
          baseCheckChange(value){
              let _checkedCount = value.length;
              this.basecheckall = _checkedCount === this.hos_check_baselist.length;
              this.isbasestyle = _checkedCount > 0 && _checkedCount < this.hos_check_baselist.length;
          },

          hoschecksubmit(){
              let self = this;
              self.dialogForm.particiPatelist = self.tableRightData;
          },
          //保存
          savesubmit(flag){
              let self = this ;
              let _submitdata = {};
              let _hospitalcount = '';
              let _gradelist = [];
              let _stutypelist = [];
              let _baselist = [];
              let _datalist = [];
              if((!self.greadcheckedlist || self.greadcheckedlist.length == 0) &&
                  ( !self.stutypecheckedlist || self.stutypecheckedlist.length == 0 ) &&
                  (!self.basecheckedlist || self.basecheckedlist.length == 0 )){

                  _submitdata = {
                      greadlist : [],
                      stutypelist : [],
                      baselist : [],
                  //    datalist:[],
                      count:'',
                      editflag:flag,
                  }
                  this.$emit('hospitalsubmitdata',_submitdata);
                  this.$emit('hospitalactivityplanclose',false)
              }else{
                  if(self.greadcheckedlist.length > 0){
                      self.greadcheckedlist.map((item,index) =>{
                          _gradelist.push(
                              {
                                  id:item,
                                  attendbusid:item,
                                  bustype:'grade'
                              }
                          )
                      });
                  };
                  if(self.stutypecheckedlist.length > 0){
                      self.stutypecheckedlist.map((item,index) =>{
                          _stutypelist.push(
                              {
                                  id:item,
                                  attendbusid:item,
                                  bustype:'type'
                              }
                          )
                      })
                  };
                  if(self.basecheckedlist.length > 0){
                      self.basecheckedlist.map((item,index) =>{
                          _baselist.push(
                              {
                                  id:item,
                                  attendbusid:item,
                                  bustype:'base'
                              }
                          )
                      })
                  };
                  post('/actionplanbase/getattender',{
                      command:'actionplanbase/getattender',
                      sessionid:getCookie('sid'),
                      loginid:getCookie('uid'),
                      actionplanlevel: "hospital",
                      actiontime: self.activityhosplan_list.actiontime,
                      // starttime: moment( self.activityhosplan_list.startime ).format('YYYY-MM-DD HH:mm:ss') ,
                      // endtime: moment( self.activityhosplan_list.endtime ).format('YYYY-MM-DD HH:mm:ss') ,
                      gradebean: {
                          bustype: "grade",
                          gradelist: self.greadcheckedlist
                      },
                      stdtypebean: {
                          bustype: "stdtype",
                          stdtypelist: self.stutypecheckedlist
                      },
                      basebean: {
                          bustype: "base",
                          baselist: self.basecheckedlist
                      }
                  }).then((data)=>{
                      if(data&&data.errcode==0){
                          if(data.result.grouplist.length > 0 && data.result.grouplist[0].count){
                              _hospitalcount = data.result.grouplist[0].count + '人';
                          }else{
                              _hospitalcount = 0 + '人'
                          }
                          let temp_data= {
                              _grade : self.greadcheckedlist,
                              _type : self.stutypecheckedlist,
                              _base : self.basecheckedlist
                          }
                          self.temp = temp_data;
                          _submitdata = {
                              greadlist : _gradelist,
                              stutypelist : _stutypelist,
                              baselist : _baselist,
                              datalist:_datalist,
                              count:_hospitalcount,
                              editflag:flag,
                          }
                          this.$emit('hospitalsubmitdata',_submitdata);
                          this.$emit('hospitalactivityplanclose',false)
                      }
                  })
              }
          },
          close(){
          //    this.editinitlist = [];
              this.greadcheckedlist=[];
              this.stutypecheckedlist=[];
              this.basecheckedlist=[];
              if(this.temp._grade){
                  this.greadcheckedlist=this.temp._grade
              };
              if(this.temp._type){
                  this.stutypecheckedlist=this.temp._type
              };
              if(this.temp._base){
                  this.basecheckedlist=this.temp._base
              }
              this.$emit('hospitalactivityplanclose',false)
          },
      }
  }
</script>
<style scope lang="scss">
  .children-wapper{
      width:100%;
      height:100%;
      h5{
          font-size:15px;
          margin:5px 0px;
      }
      .grade{
          margin: 10px 0px;
      }
      .studenttype{
          margin: 10px 0px;
          .basegroup{
              .el-checkbox{
                  width: 160px;
                  margin: 5px 15px 5px 0px;
                  overflow: hidden;
                  white-space: nowrap;
              }
          }
      }
      .base{
          margin: 10px 0px;
      }
      .act-bottom{
          float: right;
          margin: 15px;
      }
      .el-checkbox+.el-checkbox {
          margin-left: 0px !important;
      }
      .basegroup{
          .el-checkbox{
              width: 160px;
              margin: 5px 15px 5px 0px;
              overflow: hidden;
              white-space: nowrap;

          }
      }
  }

</style>
