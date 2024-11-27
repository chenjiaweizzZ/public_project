<template>
  <div class="teachingActiveSupervisor">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动类型">
        <el-select v-model="formInline.activeType" placeholder="活动类型">
          <el-option :key="0" label="全部" :value="seachvalue"></el-option>
          <el-option v-for="(item,index) in activitytypeList" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="deptSelectShowList" placeholder="请选择" multiple collapse-tags @clear="deptClear()" @remove-tag="deptRemove">
          <el-option disabled class="baseOption" value>
            <el-tree :props="baseProps" :data="deptList" show-checkbox ref="deptTree" check-strictly node-key="id" check-on-click-node
              @check-change="deptSelect" class="hosWithNoCheckBox"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="督导专家">
        <el-select v-model="formInline.expert" placeholder="督导专家" multiple>
          <el-option v-for="item in expertList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="统计日期：" style="width:410px;">
        <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期" @change="selectTime" style="width:135px">
        </el-date-picker>
        -
        <el-date-picker v-model="formInline.endTime" type="date" placeholder="选择日期" @change="selectTime" style="width:135px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.searchVal" placeholder="教学活动主题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="button-export" @click="addSupervisor()">发起督导</el-button>
    <el-table :data="tableData" border>
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
          <span><img src="../../assets/images/icon-time.svg" style="margin-right: 6px;vertical-align:-2px">{{scope.row.date}}&nbsp;{{scope.row.startTime}}-{{scope.row.endTime}}</span>
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
      <el-table-column prop="supervisorExpertDTOS" label="督导专家" width="130">
        <template slot-scope="scope">
          <div class="actionplansty">
            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.supervisorExpertDTOS | filterName" placement="left">
              <span>{{scope.row.supervisorExpertDTOS | filterName}}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="supervisorExpertDTOS" label="督导专家评分" width="160">
        <template slot-scope="scope">
          <div class="actionplansty">
            <div class="cellButton actionplansty">
              <div :class="item.score === null ? 'noScore' : 'score'" @click="showDetail(scope.$index,item,1)" v-for="item in scope.row.supervisorExpertDTOS">
                <!-- <span v-if="item.score === null">{{item.name}}未评分</span>
                <span v-else class="actionplansty">{{item.name}}（{{item.score}}分）</span> -->
                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.supervisorExpertDTOS | filterName" placement="left">
                  <span v-if="item.score === null">{{item.name}}未评分</span>
                  <span v-else="item.score === null">{{item.name}}（{{item.score}}分）</span>
                  <div slot="content">
                    <span v-if="item.score === null">{{item.name}}未评分</span>
                    <span v-else="item.score === null">{{item.name}}（{{item.score}}分）</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackExpertNames" label="科室反馈" width="160">
        <template slot-scope="scope">
          <div class="cellButton actionplansty">
            <div :class="item.feedbackScore === null ? 'noScore' : 'score'" @click="showDetail(scope.$index,item,2)" v-for="item in scope.row.feedbackExpertDTOS"
              v-if="item.secretaryEvaluateId != null">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.supervisorExpertDTOS | filterName" placement="left">
                <span>已反馈（{{item.name}}）</span>
                <div slot="content">
                  <span>已反馈（{{item.name}}）</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="files" label="附件" width="100px">
        <template slot-scope="scope">
          <div class="noScore" @click="lookPhotos(scope.row.files)">查看照片</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->
    <!-- 图片预览 -->
    <el-dialog title="查看照片" :visible.sync="dialogPhoto" width="60%">
      <viewer v-if="srcList !== null && srcList.length != 0">
        <div class="lookPhoto">
          <div v-for="item in srcList" class="photoDetail">
            <img style="width: 120px; height: 120px" :src="item" :preview-src-list="srcList" />
          </div>
        </div>
      </viewer>
      <div v-else class="noPhoto">暂无照片</div>
    </el-dialog>
    <!-- 督导评分详情 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <p class="evaluteDetail1" v-if="currentType == 1">
        <span>督导专家：{{currentItem.name}}</span>
        <span>评分时间：{{currentItem.submitTime}}</span>
        <span>评分: {{currentItem.score}}分</span>
      </p>
      <p class="evaluteDetail1 dept" v-if="currentType == 2">
        <span>反馈人：{{currentItem.feedbackName}}</span>
        <span>督导专家：{{currentItem.name}}</span>
        <span>反馈时间: {{currentItem.feedbackSubmitTime}}</span>
        <span>反馈评分: {{currentItem.feedbackScore}}分</span>
      </p>
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>
  </div>
</template>
<script>
  import { getCookie, post } from '../../config/util'
  import scoringTable from "../../components/scoringTable.vue"
  import moment from 'moment';
  import selectTree from "../../components/selectTree.vue"
  export default {
    components: { scoringTable, selectTree },
    data() {
      return {
        seachvalue:'',
        baseProps: {
          children: "childrens",
          label: "name",
          disabled: function (data, node) {
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
        rightNowClear: 0,
        hasBase: true,
        title: "督导评分详情",
        currentType: "",
        currentItem: {},
        previewId: "",
        isAnswer: true,
        needHeader: false,
        srcList: [],
        dialogPhoto: false,
        dialogVisible: false,
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 2,
        activitytypeList: [],
        expertList: [],
        alldeptList: [],
        formInline: {
          activeType: "",
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
          searchVal: "",
        }
      }
    },
    created() {
      this.getTableData();
      this.getbaseidList();
      this.activityTypeList();
      this.getExpert();
      this.getMyDeptTree()
    },
    filters: {
      filterName(val) {
        let temp = [];
        val.forEach(item => {
          temp.push(item.name)
        })
        return temp.join(",")
      },
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
      },getMyDeptTree() {
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
      setSelectDept({ selectDeptIds, selectDeptName }) {
        this.formInline.dept = selectDeptIds.length == 0 ? [] : selectDeptIds
      },
      onReset() {
        this.formInline = {
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
        }
        this.rightNowClear = this.rightNowClear + 1
      },
      editItem(row) {
        if (row.isEdit == 1) {
          this.$message({
            type: 'success',
            message: "督导已评分，不可编辑!"
          })
          return false
        }
        if (row.isEdit == 2) {
          this.$message({
            type: 'success',
            message: "督导已反馈，不可编辑!"
          })
          return false
        }
        let temp = []
        row.supervisorExpertDTOS.forEach(item => {
          temp.push(item.expertId)
        })
        this.$router.push({
          name: 'addSupervisor',
          query: {
            teachActiveId: row.businessId,
            id: row.id,
            feedbackExpertDTOS: JSON.stringify(temp)
          }
        })
      },
      deleteItem(row) {
        this.$confirm('该督导相关数据将一并删除，确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          post('/supervisor/delSupervisor', {
            command: 'supervisor/delSupervisor',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            id: row.id
          }).then(res => {
            if (res && res.errcode == 0) {
              this.$message({
                type: 'success',
                message: "删除成功！"
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'warning',
                message: res.errdesc
              })
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      onSearch() {
        this.getTableData();
      },
      getTableData() {
        let deptIds = this.deptSelectList.map(i => i.id)
        post('/supervisor/actionSupervisor', {
          command: 'supervisor/actionSupervisor',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          type: this.formInline.activeType,
          deptIds: deptIds,
          startDate: moment(new Date(this.formInline.startTime)).format("YYYY-MM-DD"),
          endDate: moment(new Date(this.formInline.endTime)).format("YYYY-MM-DD"),
          theme: this.formInline.searchVal,
          supervisorExportIds: this.formInline.expert,
        }).then(res => {
          if (res && res.errcode == 0) {
            this.tableData = res.result
          } else {
            this.$message({
              type: 'warning',
              message: res.errdesc
            })
          }
        });
      },
      getExpert() {
        post('/role/queryBindUserId', {
          command: 'role/queryBindUserId',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid: '342',
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.expertList = data.binduserlist;
          }
        }).catch(() => {
        })
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
        }).catch(function (error) {
        })
      },
      activityTypeList() {//获取活动类型下拉数据
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

      addSupervisor() {
        this.$router.push({
          name: "addSupervisor"
        })
      },
      showDetail(index, row, type) {
        let score = type == 2 ? row.feedbackScore : row.score
        if (score === null) {
          return false;
        }
        this.currentType = type
        this.currentItem = row
        this.previewId = type == 1 ? row.expertEvaluateId : row.secretaryEvaluateId
        this.title = type == 1 ? '督导评分详情' : '科室反馈详情'
        this.dialogVisible = true;
      },
      lookPhotos(files) {
        this.dialogPhoto = true;
        this.srcList = files;
      },
      handleCurrentChange(val) {
        this.pageNum = val
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      selectTime() {
        let currentKey = "formInline"
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
  .teachingActiveSupervisor .el-date-editor {
    width: 125px;
  }

  .teachingActiveSupervisor .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
</style>
<style scoped>
  .teachingActiveSupervisor {
    padding: 0 20px;
  }

  .lookPhoto {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
  }

  .photoDetail {
    width: 120px;
    height: 120px;
    flex-shrink: 1;
    margin-right: 10px
  }

  .evaluteDetail1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 14px;

  }

  .evaluteDetail1 span {
    display: inline-block;
    text-align: left;
    flex-shrink: 1;
  }

  .score,
  .noScore {
    background: #67c23a;
    padding: 0 7px;
    height: 24px;
    color: #fff;
    white-space: nowrap;
  }

  .noScore {
    background: #f4f4f5;
    color: #909399;
  }

  .button-export {
    margin-bottom: 20px;
  }

  .cellButton {
    padding: 7px 0;
    text-align: center;
  }

  .cellButton div {
    margin-bottom: 8px;
  }

  .cellButton div:last-child {
    margin-bottom: 0;
  }

  .noPhoto {
    height: 200px;
    text-align: center;
    line-height: 200px;
  }
  .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
</style>