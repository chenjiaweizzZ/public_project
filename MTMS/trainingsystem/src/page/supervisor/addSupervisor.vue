<template>
  <div class="addSupervisor">
    <el-card class="box-card-self">
      <div slot="header" class="clearfix">
        <div class="headerBox">
          <div :class="{'activeTab': activeTab == 1, 'steps': true}">
            <span>第一步</span>
            <span>选择教学活动</span>
          </div>
          <div :class="{'activeTab': activeTab == 2, 'steps': true}">
            <span>第二步</span>
            <span>选择督导专家</span>
          </div>
        </div>
      </div>
      <div v-if="activeTab == 1">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="活动类型">
            <el-select v-model="formInline.activeType" placeholder="活动类型">
              <el-option :key="0" label="全部" :value="seachvalue"></el-option>
              <el-option v-for="(item,index) in activitytypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室：">
          <el-select v-model="deptSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="deptClear()" @remove-tag="deptRemove()">
            <el-option disabled class="baseOption"></el-option>
              <el-tree
                :props="baseProps"
                :data="deptList"
                show-checkbox
                ref="deptTree"
                check-strictly
                node-key="id"
                check-on-click-node
                @check-change="deptSelect"
                class="hosWithNoCheckBox"
              ></el-tree>
            
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.searchVal" placeholder="教学活动主题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.speaker" placeholder="主讲人"></el-input>
          </el-form-item>

        </el-form>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="活动时间：" style="width:550px;">
            <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期" @change="selectTime">
            </el-date-picker>
            -
            <el-date-picker v-model="formInline.endTime" type="date" placeholder="选择日期" @change="selectTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border highlight-current-row @current-change="handleRadioChange">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="currentRdio"></el-radio>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="theme" label="教学活动主题" width="180">
            <template slot-scope="scope">
              <div class="actionplansty">
                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.theme" placement="top">
                  <span>
                    {{scope.row.theme}}
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="活动类型"></el-table-column>
          <el-table-column prop="speakerList" label="主讲人" width="120">
            <template slot-scope="scope">
              <div class="actionplansty">
                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.speakerList.join(',')" placement="left">
                  <span>{{scope.row.speakerList.join(",")}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="活动时间" width="220">
            <template slot-scope="scope">
              <el-tooltip effect="light" popper-class="zy-limit-width" placement="top">
                <p class="table-time">
                  <span v-for="item in scope.row.betweenTimeDTOS"><img src="../../assets/images/icon-time.svg" />{{item.date}}&nbsp;{{item.startTime}}-{{item.endTime}}</span>
                </p>
                <div slot="content">
                  <p class="table-time">
                    <span v-for="item in scope.row.betweenTimeDTOS">{{item.date}}&nbsp;{{item.startTime}}-{{item.endTime}}</span>
                  </p>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="place" label="活动地点" width="120"></el-table-column>
          <el-table-column prop="deptName" label="科室" width="120">
            <template slot-scope="scope">
              <div class="actionplansty">
                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptName" placement="top">
                  <span>
                    {{scope.row.deptName}}
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status == 0 ? '未开始' : '进行中'}}
            </template>
          </el-table-column>
          <el-table-column prop="signPercent" label="签到率"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <div class="oprateButton">
          <el-button @click="back()">返回</el-button>
          <el-button type="primary" @click="nextSteps()">下一步</el-button>
        </div>
      </div>
      <div v-if="activeTab == 2">
        <div>
          <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入名字筛选" v-model="selectSupervisor" :data="expertList"
            :titles="transferTitle">
          </el-transfer>
        </div>
        <div class="oprateButton">
          <el-button @click="back()">取消</el-button>
          <el-button @click="preSteps()">上一步</el-button>
          <el-button type="primary" @click="aubmitSupervisor">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import { getCookie, post } from '../../config/util'
  import selectTree from "../../components/selectTree.vue"
  import moment from 'moment';
  export default {
    components: { selectTree },
    data() {
      return {
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        baseProps: {
        children: "childrens",
        label: "name",
        disabled: function(data, node) {
          // 禁用回收站选项
          if (data.deptlevel == 1) {
            return true;
          } else {
            return false;
          }
        }
      },
      deptList: [],
      deptSelectList: [],
      deptSelectShowList: [],
        hasBase: true,
        rightNowClear: 0,
        currentRdio: "",
        transferTitle: ['可选督导专家', '已选列表'],
        data: [],
        selectSupervisor: [],
        selectActive: null,
        pageSize: 10,
        pageNum: 1,
        total: 2,
        expertList: [],
        formInline: {
          activeType: "",
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
          searchVal: "",
          speaker: ""
        },
        query: {},
        activeTab: 1,
        fromPath: "",
        tableData: [],
        alldeptList: [],
        activitytypeList: []
      }
    },
    created() {
      this.query = this.$route.query
      this.selectSupervisor = this.query.feedbackExpertDTOS ? JSON.parse(this.query.feedbackExpertDTOS) : []
      this.currentRdio = this.query.teachActiveId
      this.getActiveList();
      this.activityTypeList();
      this.getbaseidList();
      this.getMyDeptTree()
    },
    methods: {
       getMyDeptTree() {
      let self = this
      post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 1
        }).then(res => {
          if (res.resCode == 200) {
            self.deptList = res.model
          }
        })
    },
    deptSelect() {
      let deptSelectList = this.$refs.deptTree.getCheckedNodes()
      let newArr = []
      let newArr2 = []
      deptSelectList.forEach(i => {
        newArr.push({
          name: i.name,
          id: i.id
        })
        newArr2.push(i.name)
      })
      this.deptSelectList = newArr
      this.deptSelectShowList = newArr2
    },
    deptClear() {
      this.deptSelectList = []
      this.deptSelectShowList = []
      this.$refs.deptTree.setCheckedNodes([])
    },
    deptRemove() {
      this.deptSelectList.shift()
      let arr = this.deptSelectList.map(i => i.id)
      this.$refs.deptTree.setCheckedKeys(arr)
    },
      setSelectDept({ selectDeptIds }) {
        this.formInline.dept = selectDeptIds.length > 0 ? selectDeptIds : []
      },
      onSearch() {
        this.pageNum = 1
        this.getActiveList()
      },
      onReset() {
        this.formInline = {
          activeType: "",
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
          searchVal: "",
          speaker: ""
        }
        this.rightNowClear = this.rightNowClear + 1
      },
      aubmitSupervisor() {
        if (this.selectSupervisor.length == 0) {
          this.$message({
            message: '请选择督导专家',
            type: 'warning'
          });
          return false;
        }
        let params = {
          command: 'supervisor/addSupervisor',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          expertIds: this.selectSupervisor,
          businessId: this.currentRdio,
          type: 1
        }
        if (this.query.id) {
          params['id'] = this.query.id
        }
        post('/supervisor/addSupervisor', params).then(res => {
          if (res && res.errcode == 0) {
            this.$message({
              type: 'success',
              message: "发起督导成功"
            })
            this.back();
          } else {
            this.$message({
              type: 'warning',
              message: res.errdesc
            })
          }
        });
      },
      getbaseidList() {
        post('/turnbaseinfo/getusermanagerdepttree', {
          command: 'turnbaseinfo/getusermanagerdepttree',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
        }).then((data) => {
          if (data && data.errcode == 0) {
            data.depttree.childlist.map((item, index) => {
              this.alldeptList = this.alldeptList.concat(item.childlist)
              item.childlist.forEach(item1 => {
                this.alldeptList = this.alldeptList.concat(item1.childlist)
              })
            })
          }
        }).catch((error) => {
        })
      },
      activityTypeList() {			//获取活动类型下拉数据
        let self = this;
        post('/turnbaseinfo/turnbaseinfolevel', {
          command: 'turnbaseinfo/turnbaseinfolevel',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          code: 'teachtype',
        }).then((data) => {
          if (data && data.errcode == 0) {
            //	//console.log('活动类型',JSON.parse(data.baseinfolevellist))
            this.activitytypeList = JSON.parse(data.baseinfolevellist);//dialog
          }
        })
      },
      getActiveList() {
        let deptIds = this.deptSelectList.map(i => i.id)
        post('/supervisor/teachingActionPlanList', {
          command: 'supervisor/teachingActionPlanList',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          type: this.formInline.activeType,
          // deptIds: this.formInline.dept,
          deptIds: deptIds,
          startDate: this.formInline.startTime,
          endDate: this.formInline.endTime,
          theme: this.formInline.searchVal,
          speaker: this.formInline.speaker,
          businessId: this.currentRdio
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.tableData = data.result.records;
            // this.currentRdio = this.query.teachActiveId
            this.total = data.result.total
          }
        }).catch(() => {
        })
      },
      getExpert() {
        post('/role/queryBindUserId', {
          command: 'role/queryBindUserId',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid: '342',
        }).then((data) => {
          if (data && data.errcode == 0) {
            // this.expertList = data.binduserlist;
            data.binduserlist.forEach(item => {
              item.label = item.name
              item.key = item.id
            })
            this.expertList = data.binduserlist

          }
        }).catch(() => {
        })
      },
      handleRadioChange(val) {
        // this.selectActive = val;
        this.currentRdio = val.id
      },
      // handleChange(value, direction, movedKeys) {
      //   console.log(value, direction, movedKeys);
      // },
      preSteps() {
        this.activeTab = 1
      },
      nextSteps() {
        if (this.currentRdio == null || !this.currentRdio) {
          this.$message({
            message: '请选择教学活动',
            type: 'warning'
          });
          return false;
        }
        this.activeTab = 2
        this.getExpert();
      },
      back() {
        window.history.go(-1)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getActiveList();
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getActiveList();
      },
      selectTime() {
        let currentKey = 'formInline'
        if (this[currentKey]["endTime"] && this[currentKey]["startTime"]) {
          let tempEnd = new Date(this[currentKey]["endTime"]).getTime();
          let startTime = new Date(this[currentKey]["startTime"]).getTime()
          if (startTime - tempEnd > 0) {
            this.$message({
              message: '统计开始时间不能大于结束时间！',
              type: 'warning'
            });
            this[currentKey]["endTime"] = ""
          }

        }
      },
    }
  }
</script>
<style>
  .addSupervisor .box-card-self .el-card__header {
    padding-top: 0;
    padding-bottom: 0;
  }

  .addSupervisor .el-date-editor {
    width: 125px;
  }

  .addSupervisor .el-pagination {
    text-align: right;
    margin-top: 20px;
  }

  .addSupervisor .el-transfer-panel {
    width: 300px;
  }

  .addSupervisor .el-transfer__buttons .el-button {
    margin-left: 0;
  }

  .addSupervisor .el-table .el-radio__label {
    display: none;
  }
</style>
<style scoped>
  .addSupervisor .table-time img {
    vertical-align: -2px;
    margin-right: 5px;
  }

  .addSupervisor .table-time span {
    /* margin-bottom: 7px */
  }

  .addSupervisor .table-time span:last-child {
    margin-bottom: 0px
  }

  .addSupervisor {
    padding: 0 20px;
  }

  .headerBox {
    height: 58px;
    line-height: 58px;
    display: flex;
    justify-content: flex-start;
  }

  .headerBox .steps {
    width: 50%;
    flex-shrink: 1;
    text-align: center;
  }

  .headerBox .steps span {
    margin-left: 20px;
  }

  .headerBox .steps span:first-child {
    margin-left: 0;
  }

  .activeTab {
    position: relative;
    color: #409eff;
  }

  .activeTab::after {
    position: absolute;
    content: "";
    display: inline-block;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background-color: #409eff;
  }

  .oprateButton {
    margin-top: 20px;
    text-align: right;
  }
  .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
</style>