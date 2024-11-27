<template>
  <div>
    <div class="activityplan_hospital1">
      <div class="left-box">
        <p class="listTitle">可选列表</p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="护陪生" name="student"></el-tab-pane>
          <!-- <el-tab-pane label="实习生" name="inter"></el-tab-pane>
          <el-tab-pane label="进修生" name="advancedStudent"></el-tab-pane> -->
        </el-tabs>
        <el-form inline="true" v-if="type != 'office' && activeName != 'advancedStudent'">
          <el-form-item label="专业基地：" v-if="type == 'hospital' && activeName == 'student'">
            <el-select v-model="hospitalFrom.baseId" placeholder="全部" @change="changeBase">
              <el-option label="全部" value></el-option>
              <el-option :label="item.name" :value="item.id" v-for="item in baseList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="轮转科室：">
            <el-select v-model="hospitalFrom.deptIdName" placeholder="全部" @change="changeDept">
              <el-option label="全部" value></el-option>
              <el-tree :data="deptList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                ref="treeDom" class="selfTree"></el-tree>
            </el-select>
          </el-form-item>

          <el-form-item label="年级：">
            <el-select v-model="hospitalFrom.grade" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="hospitalFrom.searchKey" placeholder="姓名/学号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable">
          <!-- v-if="activeName != 'advancedStudent'" -->
          <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
          <el-table-column prop="name" label="姓名" width="150"></el-table-column>
          <el-table-column prop="username" label="学号" width="100" v-if="activeName != 'advancedStudent'"></el-table-column>
          <el-table-column prop="turngradeTxt" label="年级" width="100" v-if="activeName != 'advancedStudent'"></el-table-column>
          <el-table-column prop="hospitalName" label="所属院区" width="100" v-if="activeName != 'advancedStudent'"></el-table-column>
          <el-table-column prop="baseName" label="专业基地" width="100" v-if="activeName == 'student'"></el-table-column>
          <el-table-column prop="username" label="进修编号" width="100" v-if="activeName == 'advancedStudent'"></el-table-column>
          <el-table-column prop="year" label="进修年份" width="100" v-if="activeName == 'advancedStudent'"></el-table-column>
          <el-table-column prop="batchName" label="进修批次" width="100" v-if="activeName == 'advancedStudent'"></el-table-column>
          <el-table-column prop="deptName" label="当前轮转科室" width="180"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div class="moddle-box">
        <el-button circle class="transformButton" @click="removeRight">
          <i class="el-icon-arrow-left" style="margin-left: -7px"></i>
        </el-button>
        <el-button type="success" circle class="transformButton greenBtn" @click="addRight">
          <i class="el-icon-arrow-right" style="margin-left: -7px"></i>
        </el-button>
      </div>
      <div class="right-box" v-if="rightList.length > 0">
        <p class="listTitle">已选列表</p>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange($event)">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedSelect" @change="handleCheckedSelect" class="selfCheckGroup">
          <el-checkbox v-for="item in rightList" :label="item.id">{{item.name}}({{item.username}})</el-checkbox>
        </el-checkbox-group>

      </div>
      <div v-else class="right-box">
        <p class="listTitle">已选列表</p>
      </div>
    </div>
    <div class="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sumbit">确 定</el-button>
    </div>
  </div>

</template>
<script>
  import { post, get, getCookie, getStorage } from '../config/util'
  import moment from 'moment';
  export default {
    data() {
      return {
        checkAll: false,
        isIndeterminate: true,
        leftSelect: [],
        rightListCopy: [],
        rightList: [],
        activeName: "student",
        selectDeptTitle: "轮转科室",
        checkedSelect: [],
        gradeList: [],
        tableData: [],
        selected: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        defaultProps: {
          label: 'name',
          children: 'childrens'
        },
        loading: false,
        hospitalFrom: {
          hospitalId: "",
          deptIdName: "",
          baseId: "",
          deptId: "",
          grade: "",
          searchKey: "",

        },
        flag: true,
        baseList: [],
        deptList: [],
        listScholars: [],
        menuId: "",
        actionDateList: []
      }
    },
    watch: {
      particiPatelist(newVal, oldVal) {
        this.rightList = newVal
        this.rightListCopy = newVal
      },
      type(newVal, oldVal) {
        this.type = newVal
        this.init()
      },
      searchItem: {
        handler(newVal, oldVal) {
          this.searchItem = newVal
          // this.init()
        },
        deep: true
      },
      show: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.activeName = 'student'
            this.listResident()
          }
        },
        deep: true
      },
      timeArr: {
        handler(newVal, oldVal) {
          let temp = []
          newVal.forEach(item => {
            if (String(item.date).indexOf("-") > -1) {
              temp.push(item.date)
            } else {
              temp.push(moment(item.date).format('YYYY-MM-DD'))
            }
          })
          this.$set(this, "actionDateList", temp)
          // this.listResident()
        },
        deep: true
      },
    },
    props: {
      clearAll: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      },
      particiPatelist: {
        type: Array,
        default: []
      },
      searchItem: {
        type: Object,
        default: {}
      },
      type: {
        type: String,
        default: "",
      },
      studentDeptid: {
        type: Number,
        default: "",
      },
      timeArr: {
        type: Array,
        default: []
      },
    },
    created() {
      this.actionDateList = []
      this.timeArr.forEach(item => {
        if (String(item.date).indexOf("-") > -1) {
          this.actionDateList.push(item.date)
        } else {
          this.actionDateList.push(moment(item.date).format('YYYY-MM-DD'))
        }

      })
      this.menuId = getStorage("menuId")
      this.getSelectList();
      this.listResident();
      // this.getAdvancedStudentList();
      if (this.type == "hospital") {
        this.getbaseList()
        this.getDeptList()
      }
      this.$set(this, "rightList", this.particiPatelist)
      this.$set(this, "rightListCopy", this.particiPatelist)

    },
    methods: {
      changeDept(val) {
        if (val == undefined || val == null || val == "") {
          this.hospitalFrom.deptId = ""
          this.hospitalFrom.deptIdName = ""
        }
      },
      nodeClick(node) {
        if (node.havePermission != 1) {
          return false;
        }
        this.hospitalFrom.deptId = node.id
        this.hospitalFrom.deptIdName = node.name
      },
      init() {
        if (this.timeArr.length > 0) {
          if (this.timeArr[0].date != "") {
            return false;
          }
        }
        this.activeName = 'student'
        this.listResident();
        if (this.type == "hospital") {
          this.getbaseList()
          this.getDeptList()
        }
        this.pageSize = 10
        this.pageNum = 1
      },
      sumbit() {
        this.$emit("submitdata", this.rightList)
        this.rightList = [];
        this.leftSelect = [];
        this.checkedSelect = []
      },
      cancel() {
        this.rightList = this.rightListCopy
        this.$emit("closeDailog", false)
      },
      handleCheckAllChange(val) {
        let temp = []
        if (this.checkAll) {
          this.rightList.forEach(item => {
            temp.push(item.id)
          })
        }
        this.checkedSelect = temp;
        // this.isIndeterminate = false;
      },
      handleCheckedSelect(value) {
        if (value == "" || value == undefined || value == null) {
          this.checkAll = false
        } else {
          let checkedCount = value.length;
          this.checkAll = checkedCount == 0 ? false : checkedCount === this.rightList.length ? true : false;
        }
      },
      handleClick() {
        if (this.activeName == "advancedStudent") {
          this.getAdvancedStudentList();
        } else {
          this.listResident();
        }
        this.hospitalFrom = {
          hospitalId: "",
          baseId: "",
          deptId: "",
          deptIdName: "",
          grade: "",
          searchKey: "",
        }
        if (this.activeName == 'inter') {
          this.deptList = []
          this.getDeptList()
        } else {
          if (this.baseList.lenght == 0) {
            this.getbaseList()
          }
          this.deptList = []
        }
        this.pageNum = 1;
        this.pageSize = 10
        this.total = 0
        this.getSelectList()
      },
      getbaseList() {
        get(`/base/dept/listBase?pid=${this.searchItem.id}&menusId=${this.menuId}`).then(res => {
          if (res && res.resCode == 200) {
            this.baseList = res.rows
          } else {
            this.$message({
              type: "error",
              message: res.resMsg
            })
          }
        })
      },
      getDeptList() {
        this.deptList = []
        post("/base/dept/getMyDeptTree", {
          showHospital: 0,
          hospitalId: this.searchItem.id,
          showNoDeptHospital: 0,
          needBaseDept: false,
          // hospitalId: this.formInline.hospitalId,
          menusId: this.menuId
        }).then(data => {
          if (data && data.resCode == 200) {
            this.deptList = data.model;
          }
        });
      },
      // changeBase(val) {
      //   this.hospitalFrom.deptId = ""
      //   this.deptList = []
      //   if (val != null && val != undefined && val != "") {
      //     this.getDeptList();
      //   }

      // },
      // getDeptList() {
      //   post("/base/dept/listMyDeptForHospital", {
      //     hospitalId: this.searchItem.id,
      //     menusId: this.menuId
      //   }).then(res => {
      //     if (res && res.resCode == 200) {
      //       this.deptList = res.model
      //     } else {
      //       this.$message({
      //         type: "error",
      //         message: res.resMsg
      //       })
      //     }
      //   })
      // },
      getAdvancedStudentList() {
        post("/advanced/rotate/queryRotateStudentByDeptId", {
          deptId: this.studentDeptid,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
            this.$message({
              type: "error",
              message: res.resMsg
            })
          }
        })
      },
      selectable(row) {
        let flag = true
        this.rightList.forEach(item => {
          if (item.id == row.id) {
            flag = false
          }

        })
        return flag
      },
      removeRight() {
        let temp = JSON.parse(JSON.stringify(this.rightList))
        this.rightList.forEach((item, index) => {
          this.checkedSelect.forEach(citem => {
            if (citem == item.id) {
              item.delete = true
            }
          })

        })
        this.$refs.multipleTable.clearSelection()
        this.rightList = this.rightList.filter(item => { return !item.delete });
        this.checkedSelect = []
        this.leftSelect = []
      },
      addRight() {
        if (!this.flag) {
          return false;
        }
        this.flag = false
        this.rightList = this.rightList.concat(this.leftSelect)
        this.checkedSelect = []
        this.$refs.multipleTable.clearSelection()
        this.flag = true
      },
      handleSelectionChange(val) {
        this.leftSelect = val
      },
      onSubmit() {
        this.pageNum = 1
        this.pageSize = 10
        this.tableData = []
        this.total = 0
        this.listResident()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        if (this.activeName == 'advancedStudent') {
          this.getAdvancedStudentList();
        } else {
          this.listResident();
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        if (this.activeName == 'advancedStudent') {
          this.getAdvancedStudentList();
        } else {
          this.listResident();
        }
      },
      formatTime(newVal) {
        let temp = []
        newVal.forEach(item => {
          if (String(item.date).indexOf("-") > -1) {
            temp.push(item.date)
          } else {
            temp.push(moment(item.date).format('YYYY-MM-DD'))
          }
        })
        return temp
      },
      listResident() {
        this.loading = true
        let params = {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        let urlStr = this.activeName == 'inter' ? "/base/traineeplandetail/listTurnTrainee" : "/base/turnplandetail/listTurnResident"
        let url = this.serlizeParams(urlStr, params)
        let bodyQuery = {
          userId: getCookie("uid"),
          keyword: this.hospitalFrom.searchKey,
          turngrade: this.hospitalFrom.grade,
          actionDateList: this.actionDateList
        }
        if (this.type == "hospital") {
          bodyQuery.hospitalId = this.searchItem.id
          if (this.activeName == 'student') {
            bodyQuery.baseId = this.hospitalFrom.baseId
          }
          bodyQuery.deptId = this.hospitalFrom.deptId
        } else if (this.type == "office") {
          bodyQuery.hospitalId = this.searchItem.hospitalId
          bodyQuery.deptId = this.searchItem.id
        }
        post(url, bodyQuery).then(res => {
          this.loading = false
          if (res.resCode == 200) {
            this.tableData = []
            this.tableData = res.rows
            this.total = res.total
            this.tableData.forEach(item => {
              let flag = this.selectable(item)
              item.select = !flag ? 'disable1' : ''
            })
          } else {

          }
        })
      },
      serlizeParams(url, params) {
        let paramsStr = "";
        for (let key in params) {
          paramsStr = paramsStr + "&" + key + "=" + params[key]
        }
        paramsStr = paramsStr.substring(1)
        return url + "?" + paramsStr
      },
      setQueryFormOne(form) {
        this.hospitalFrom.hospitalId = form.hospitalId
        this.hospitalFrom.baseId = form.baseId
        this.hospitalFrom.deptId = form.deptId
      },
      getSelectList() {
        let code = "grade";
        get(`/base/level/getByCode?code=${code}`,{
        }).then(res => {
          if (res.resCode == 200) {
            this.gradeList = res.model
          } else {
            this.$message({
              message: '请求年级信息失败',
              type: 'error'
            });
          }

        })
      },
    }
  }
</script>
<style scoped>
  .activityplan_hospital1 {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;

  }

  .activityplan_hospital1 .left-box {
    width: 650px;
    border: 1px solid #d1dbe5;
    padding: 14px;
  }

  .activityplan_hospital1 .moddle-box {
    width: 650px;
    /* border: 1px solid #d1dbe5; */
    padding: 14px;
  }

  .activityplan_hospital1 .moddle-box {
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;

  }

  .activityplan_hospital1 .right-box {
    width: 373px;
    border: 1px solid #d1dbe5;
    padding: 14px;
  }

  .transformButton {
    border-radius: 100%;
    color: #999;
    width: 40px;
    text-align: center;
  }

  .greenBtn {
    color: #fff;
    margin: 0 !important;
    margin-top: 5px !important;
  }

  .listTitle {
    font-size: 16px;
    margin: 10px 0;
  }

  .footer {
    text-align: right;
    margin-top: 20px;
  }
</style>
<style>
  .selfCheckGroup.el-checkbox-group {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }

  .selfCheckGroup.el-checkbox-group .el-checkbox {
    margin: 0;
    margin-bottom: 15px;
  }
</style>