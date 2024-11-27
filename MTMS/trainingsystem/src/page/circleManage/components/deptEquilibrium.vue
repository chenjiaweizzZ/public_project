<template>
  <div class="equilibrium">
      <div class="queryTools">
          <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
              <el-col :span="20">
                  <el-form-item label="基地">
                      <el-select filterable v-model="queryForm.baseid" placeholder="请选择" @change="newbasechange" size="small">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="(item,index) in newroomList" :key="item.index" :label="item.deptname"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="科室">
                      <el-select filterable v-model="queryForm.deptid" placeholder="请选择" size="small">
                          <el-option label="全部" value=""></el-option>
                          <el-option v-for="(item,index) in newdeptList" :key="item.index" :label="item.deptname"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="年份">
                      <el-date-picker style="width: 130px;"
                                      v-model="queryForm.year"
                                      align="right"
                                      type="year" format="yyyy" @change="gettime"
                                      placeholder="选择年份">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" size="small" class="fr" @click.stop="doQuery">查询</el-button>
              </el-col>
          </el-form>
      </div>
      <div class="dataTable">
          <el-table ref="deptname" :data="rateList"
                    border tooltip-effect="dark" style="width: 100%"
                    v-loading="loading"
                    :max-height="$tabelMaxHeight">
              <el-table-column width="120" fixed='left' v-if="index == 0" v-for="(item,index) in tabletitlelistadd" :key="index" :label ="item.yearmonthname">
                  <template slot-scope="scope">
                      <template v-if="index == 0 "><!--在第一列显示科室名称-->
                          <div class="actionplansty">
                              <el-tooltip effect="light" popper-class="zy-limit-width"
                                          :content="scope.row.deptname" placement="top">
                                  <span>
                                      {{scope.row.deptname}}
                                  </span>
                              </el-tooltip>
                          </div>
                      </template>
                  </template>
              </el-table-column>
              <el-table-column label="最大误差人数" prop="maxerror" width="200">

              </el-table-column>

              <el-table-column width="100" v-for="(item,index) in tabletitlelist" :key="item.yearmonth" :label ="item.yearmonthname">
                  <template slot-scope="scope">
                      <template v-for="(item2,index2) in scope.row.monthlist">
                          <template v-if = "item.yearmonth === item2.yearmonth" >
                              {{item2.plancount}}
                          </template>
                      </template>
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]"
                     :page-size="reqnum" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
  </div>
</template>

<script>
  import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../../config/util';
  import { mapState, mapActions } from 'vuex'
  export default {
      name: "deptEquilibrium",
      data() {
          return {
              queryForm: {
                  baseid: '',
                  deptid:'',
                  year:''
              },
              loading:false,
              page:1,
              reqnum:10,
              rateList:[],
              totalCount:0,
              tabletitlelist:[],
              tabletitlelistadd:[],
              newroomList: [],
              newdeptList: [],
              // table
              loading: false,
              rotationPlan: [],
          }
      },
      computed: {
          ...mapState(['gradeList']),
      },
      methods: {
          //带权限的基地科室和病区
          ...mapActions(['initGradeList']),
          doQuery(){
              this.getDepartmentBalance();
          },
          gethospitaltree: function () {
              var self = this;
              post('/turnbaseinfo/getusermanagerdepttree', {
                  command: 'turnbaseinfo/getusermanagerdepttree',
                  sessionid: getCookie('sid'),
                  loginid: getCookie('uid'),
                  uid: getCookie('uid'),
              }).then(function (data) {
                  if (data && data.errcode == 0) {
                      // newroomList  newdeptList  newareaList
                      self.newroomList = data.depttree.childlist
                      // let treeidlist = data.depttree.childlist
                      // treeidlist.map(item => {
                      //     self.baseidlist.push(item.id)
                      //     item.childlist.map(item2 => {
                      //         self.officeidlist.push(item2.id)
                      //     })
                      // })
                      // self.clearSelect();
                      // self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
                  }
              }).catch(function (error) {
                  //console.log(error)
              })
          },
          //权限下的科室
          newbasechange: function () {
              let self = this;
              self.queryForm.newdepartment = '';
              self.queryForm.newarea = '';
              self.newdeptList = [];
              self.newareaList = [];
              self.newroomList.map(item => {
                  if (self.queryForm.baseid == item.id) {
                      self.newdeptList = item.childlist
                  }
              })
          },
          //科室均衡性结果查询状态
          handleSizeChange(size) {
              this.reqnum = size;
              this.doQuery();
          },
          handleCurrentChange(page){
              this.page = page;
              this.doQuery();
          },
          gettime:function(time){		//选取时间段
              this.queryForm.year = time;//选取时间段
          },
          //科室均衡性结果查询
          getDepartmentBalance(){
              let self=this;
              this.loading=true;
              post('turn/departmentbalance', {
                  command: 'turn/departmentbalance',
                  sessionid: getCookie('sid'),
                  loginid: getCookie('uid'),
                  baseid:this.queryForm.baseid,
                  turnplanid:this.$route.query.planid,
                  deptid:this.queryForm.deptid,
                  year:this.queryForm.year,
                  page:this.page,
                  pagenum:this.reqnum
              }).then((data) => {
                  if (data && data.errcode == 0) {
                      this.loading=false;
                      self.tabletitlelist = data.result.yearmonthlist;
                      let _item = {yearmonthname:'科室  |  日期'};
                      self.tabletitlelistadd.unshift(_item);
                      self.rateList = [];
                      self.rateList = data.result.beanlist;
                      self.totalCount = data.result.totalcount;
                  }
              })
          }

      },
      mounted() {
          this.gethospitaltree();
          this.initGradeList();
          this.getDepartmentBalance();
      }
  }
</script>

<style scoped lang="scss">
  .fr{
      float:right;
      margin-top:6px;
  }
</style>
