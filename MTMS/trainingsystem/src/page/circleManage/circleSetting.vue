<template>
  <div class="circleSetting">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>考勤设置</span>
          </div>
          <div class="text item">
            <el-form ref="form" :model="form" label-position="left" class="demo-ruleForm">
              <el-form-item label="考勤编辑时间" label-width="200px">
                <span>每月的</span>
                <el-input-number v-model="form.settintDay" :step="1" step-strictly></el-input-number>
                <span>日前可修改上月的考勤</span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>出科报名设置</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-position="left" class="demo-ruleForm">
          <el-form-item label="是否需要出科报名" label-width="200px">
            <el-radio-group v-model="form.isEnlist">
              <el-radio label="0">不需要</el-radio>
              <el-radio label="1">需要</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出科报名时间" label-width="200px" :error="error1" v-if="form.isEnlist == 1">
            <el-radio-group v-model="form.resource" @change="changeTimes">
              <el-radio label="0">不设置</el-radio>
              <el-radio label="1">
                <p>每月的
                  <el-input v-model="form.startDay" placeholder="请输入内容" @blur="setDate"></el-input> 日——
                  <el-input v-model="form.endDay" placeholder="请输入内容" @blur="setDate"></el-input> 日 可进行出科报名
                </p>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出科报名是否需要审核" label-width="200px" v-if="form.isEnlist == 1">
            <el-radio-group v-model="form.isCheck">
              <el-radio label="10">不需要</el-radio>
              <el-radio label="5">需要</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>出科要求设置</span>
        <span class="settingTips">出科需完成以下任务</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-position="left" class="demo-ruleForm">
          <el-form-item label="日常评价设置" label-width="170px">
            <el-checkbox-group v-model="form.evaluate">
              <el-checkbox label="0">护培生对带教评价</el-checkbox>
              <el-checkbox label="1">护培生对科室评价</el-checkbox>
              <el-checkbox label="2">带教对护培生评价</el-checkbox>
              <el-checkbox label="3">护士长对护培生评价</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="日常评价时间设置" label-width="170px">
            出科前&nbsp;&nbsp;
            <el-input v-model="form.evaluateEndTime" type="number" @change="checkNum()" ref="evaluateEndTime"></el-input>&nbsp;&nbsp;日发起自动评价
          </el-form-item>
          <el-form-item label="教学活动设置" label-width="170px" :error="error2">
            <el-radio-group v-model="form.activeSetting" @change="changeActive">
              <el-radio label="0">不设置</el-radio>
              <el-radio label="1">
                <p>至少完成次数：
                  <el-input v-model="form.times" placeholder="请输入内容" @blur="timesCheck"></el-input> 次
                </p>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出科条件审核" label-width="170px">
            <div slot="label" class="slotLabel">
              <span>出科条件审核</span>
              <el-tooltip class="item" effect="dark" content="通过出科条件审核才可参加出科考核" placement="top-start">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
            <el-radio-group v-model="form.outDeptSetting" @change="changeActive">
              <el-radio label="0">不需要</el-radio>
              <el-radio label="1">需要</el-radio>
            </el-radio-group>
            <el-row v-if="form.outDeptSetting == 1">
              <el-button type="primary" @click="addItems">添加审核项</el-button>
            </el-row>
            <el-table :data="outDeptSettingData" border max-height="330" style="width: 70%;margin-top:20px" v-if="form.outDeptSetting == 1"
              header-row-class-name="colorHeader">
              <el-table-column type="index" width="50" label="序号">
              </el-table-column>
              <el-table-column prop="content" label="审核项">
                <template slot-scope="scope">
                  <el-tooltip effect="light" :content="scope.row.content" placement="top">
                    <span class="limitOne">
                      {{scope.row.content}}
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="associatedBusinessName" label="实际关联业务" width="180">
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="deleteConnect(scope.row,scope.$index)"><span class="colorRed">刪除</span></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="出科考核设置" label-width="170px">
            <el-radio label="1" v-model="form.settingType">按比例设置</el-radio>
            <div v-if="form.settingType == 1" class="seetingPrecent">
              <p class="allTips">
                <span>批量设置</span>
                <span class="other">（所有考核类型的占比总和为100%）</span>
              </p>
              <div class="inlinePre">
                <p>
                  <span>技能占比</span>
                  <el-input v-model="form.normalSetting.skillScoreProportion" maxlength="3" @input="checkNumPrecent"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>理论占比</span>
                  <el-input v-model="form.normalSetting.theoryScoreProportion" maxlength="3" @input="checkNumPrecent"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>综合占比</span>
                  <el-input v-model="form.normalSetting.compreScoreProportion" maxlength="3" @input="checkNumPrecent"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>病历占比</span>
                  <el-input v-model="form.normalSetting.bigCaseScoreProportion" maxlength="3" @input="checkNumPrecent"></el-input>
                  <span>%</span>
                </p>
              </div>
              <p v-show="errorPrecent" class="tipError">占比支持0-100的整数</p>
              <div :class="{'marginTop15': !errorPrecent}">
                <p>
                  <span>总分满</span>
                  <el-input v-model="form.normalSetting.passScore" @input="checkNumTotal"></el-input>
                  <span>分合格</span>
                </p>
              </div>
              <p v-if="errorNum" class="tipError">总分最小0，最大200，最多2位小数</p>
            </div>
            <el-checkbox v-model="form.singleDept" @change="setOtherDept" v-if="form.settingType == 1">特殊科室设置</el-checkbox>
            <div v-if="form.singleDept && form.settingType == 1" class="seetingPrecent" v-for="(item,index) in specialSetting" :key="index">
              <el-form :inline="true" :model="item" class="demo-form-inline">
                <el-select v-model="item.deptNames" filterable :filter-method="($event) => searchDept($event, index)" placeholder="全部" multiple
                  collapse-tags @remove-tag="removeDept($event,index)" @visible-change="visibleChange($event,index)">
                  <el-option label="全部" value=""></el-option>
                  <el-tree :data="deptList" node-key="id" :check-strictly="true" show-checkbox :expand-on-click-node="true" :props="defaultProps"
                    @check-change="nodeClick($event,index)" :filter-node-method="filterNode" :ref="'treeDom'+'_' + index" class="selfTree"></el-tree>
                </el-select>
                <el-form-item>
                  <el-button type="primary" @click="addOtherDept">添加科室</el-button>
                  <el-button type="primary" @click="deleteOherDept(index)" v-if="specialSetting.length > 1">删除</el-button>
                </el-form-item>
              </el-form>
              <div class="inlinePre marginTop15">
                <p>
                  <span>技能占比</span>
                  <el-input v-model="item.skillScoreProportion" @input="checkOtherDept($event,index)"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>理论占比</span>
                  <el-input v-model="item.theoryScoreProportion" @input="checkOtherDept($event,index)"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>综合占比</span>
                  <el-input v-model="item.compreScoreProportion" @input="checkOtherDept($event,index)"></el-input>
                  <span>%</span>
                </p>
                <p>
                  <span>病历占比</span>
                  <el-input v-model="item.bigCaseScoreProportion" @input="checkOtherDept($event,index)"></el-input>
                  <span>%</span>
                </p>
              </div>
              <p v-show="errorTipsList[index].precent" class="tipError">占比支持0-100的整数</p>
              <div :class="{'marginTop15': !errorTipsList[index].precent}">
                <p>
                  <span>总分满</span>
                  <el-input v-model="item.passScore" @input="checkTotal($event,index)"></el-input>
                  <span>分合格</span>
                </p>
              </div>
              <p v-if="errorTipsList[index].num" class="tipError">总分最小0，最大200，最多2位小数</p>
            </div>
            <el-radio label="0" v-model="form.settingType">按分数设置</el-radio>
            <el-checkbox-group v-model="form.examSetting" @change="changeCheck" v-if="form.settingType == 0" class="settingScore">
              <el-checkbox label="0">
                <p>出科考核（技能）</p>
              </el-checkbox>
              <p v-if="examSettingShow[0]" class="scoreUnit">合格分设置：
                <el-input v-model="form.score" placeholder="请输入内容" @blur="examTipsCheck($event,0)"></el-input> 分
                <span v-if="examTipsShow[0].show" class="tipError">{{examTipsShow[0].tips}}</span>
              </p>
              <el-checkbox label="1">出科考核（理论）</el-checkbox>
              <p v-if="examSettingShow[1]" class="scoreUnit">合格分设置：
                <el-input v-model="form.score1" placeholder="请输入内容" @blur="examTipsCheck($event,1)"></el-input> 分
                <span v-if="examTipsShow[1].show" class="tipError">{{examTipsShow[1].tips}}</span>
              </p>
              <el-checkbox label="2">出科考核（综合）</el-checkbox>
              <p v-if="examSettingShow[2]" class="scoreUnit">合格分设置：
                <el-input v-model="form.score2" placeholder="请输入内容" @blur="examTipsCheck($event,2)"></el-input> 分
                <span v-if="examTipsShow[2].show" class="tipError">{{examTipsShow[2].tips}}</span>
              </p>
              <el-checkbox label="3">出科考核（病历）</el-checkbox>
              <p v-if="examSettingShow[3]" class="scoreUnit">合格分设置：
                <el-input v-model="form.score3" placeholder="请输入内容" @blur="examTipsCheck($event,3)"></el-input> 分
                <span v-if="examTipsShow[3].show" class="tipError">{{examTipsShow[3].tips}}</span>
              </p>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否开启自动出科" label-width="170px">
            <el-switch v-model="form.autoChuke" active-color="#13ce66"></el-switch>
          </el-form-item>
        </el-form>
        <p class="tips">开启后，科室轮转结束时间到，满足出科要求的学员自动出科，教秘也可手动出科；关闭后，科室轮转结束时间到，需教秘手动对学员进行出科操作
        </p>
      </div>
    </el-card>
    <div class="alignRight">
      <el-button type="primary" @click="saveSetting">保存</el-button>
    </div>
    <!-- 添加审核项弹窗 -->
    <el-dialog title="添加审核项" :visible.sync="dialogFormVisible" width="35%" class="itemdialog">
      <el-form :model="connectForm">
        <el-form-item label="审核项" label-width="100px" required>
          <el-input v-model="connectForm.name" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="实际关联业务" label-width="100px" width="180">
          <el-select v-model="connectForm.program" placeholder="请选择活动区域" @change="changeConnect">
            <el-option v-for="item in connectItems" :key="item.value" :label="item.label" :value="item" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConnect">保存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { post, get, getCookie } from '../../config/util'
  export default {
    data() {
      return {
        defaultProps: {
          label: 'name',
          children: 'childrens',
          disabled: (data, node) => {
            if (data.deptlevel == 1) {
              return true
            }
          }
        },
        copyDeptIds: [],
        deptList: [],
        error1: "",
        examTipsShow: [
          { show: false, tips: "" },
          { show: false, tips: "" },
          { show: false, tips: "" },
          { show: false, tips: "" }
        ],
        connectForm: {
          program: {
            label: "", value: ""
          },
          name: ""
        },
        dialogFormVisible: false,
        outDeptSettingData: [],
        error2: "",
        examSettingShow: [false, false, false, false],
        commparaInfoList: [],
        originTimes: 0,
        originScore: [0, 0, 0, 0],
        originstartDay: 1,
        originendDay: 31,
        evaluateEndTime: 7,
        connectItems: [
          { label: "考勤", value: 1, disabled: false },
          { label: "教学活动", value: 2, disabled: false },
          { label: "病历", value: 3, disabled: false },
        ],
        form: {
          settintDay: "",
          singleDept: false,
          resource: "0",
          startDay: 1,
          endDay: 31,
          isCheck: 10,
          evaluate: [],
          evaluateEndTime: 7,
          activeSetting: "0",
          outDeptSetting: "0",
          times: null,
          examSetting: [],
          normalSetting: {
            skillScoreProportion: 0, theoryScoreProportion: 0, compreScoreProportion: 0, bigCaseScoreProportion: 0, passScore: 0
          },
          score: 0,
          score1: 0,
          score2: 0,
          score3: 0,
          autoChuke: false,
          isEnlist: "0",
          settingType: "1"
        },
        specialSetting: [{
          skillScoreProportion: 0, theoryScoreProportion: 0, compreScoreProportion: 0, bigCaseScoreProportion: 0, passScore: 0, deptIds: [], deptNames: []
        }],
        errorTipsList: [
          { precent: false, num: false }
        ],
        saveflag: true,
        errorPrecent: false,
        errorNum: false
      }
    },
    created() {
      this.querySetting()
      this.getDeptTree()
    },
    mounted() {
      this.defaultProps = {
        label: 'name',
        children: 'childrens',
        disabled: (data, node) => {
          let flag = false
          this.copyDeptIds.forEach(item => {
            if (data.id == item) {
              flag = true
            }
          })
          if (data.deptlevel == 1 || flag == true) {
            return true
          }
        }
      }
    },
    watch: {
      "form.settingType": {
        handler: function (newVal, oldVal) {
          if (newVal == 1) {
            this.getPrecent()
          } else if (newVal == 0) {
            this.getScoreList()
          }
        },
        deep: true
      }
    },
    methods: {
      searchDept(val, index) {
        if (this.$refs[`treeDom_${index}`] == undefined) {
          return false
        }
        this.$refs[`treeDom_${index}`][0].filter(val);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      visibleChange(val, index) {
        this.deptList = this.originDeptList
        this.copyDeptIds = []
        if (val == true) {
          let tempArr = []
          this.specialSetting.forEach((item, cindex) => {
            if (index != cindex) {
              tempArr = tempArr.concat(item.deptIds)
            }
          })
          this.copyDeptIds = tempArr
        }
        this.$refs[`treeDom_${index}`][0].filter()
      },
      removeDept(tag, index) {
        let checkArr = this.$refs[`treeDom_${index}`][0].getCheckedNodes()
        let temp = this.specialSetting[index]
        temp.deptIds = []
        temp.deptNames = []
        checkArr.forEach(item => {
          if (tag != item.name) {
            temp.deptIds.push(item.id)
            temp.deptNames.push(item.name)
          }

        })
        this.$refs[`treeDom_${index}`][0].setCheckedKeys(temp.deptIds)
      },
      nodeClick(node, index) {
        let checkArr = this.$refs[`treeDom_${index}`][0].getCheckedNodes()
        let temp = this.specialSetting[index]
        temp.deptIds = []
        temp.deptNames = []
        checkArr.forEach(item => {
          temp.deptIds.push(item.id)
          temp.deptNames.push(item.name)
        })
      },
      setOtherDept(val) {
        if (val) {
          if (this.specialSetting.length == 0 && this.errorTipsList.length == 0) {
            this.addOtherDept()
          }
          this.getPrecent()
        }
      },
      getDeptTree() {
        post("/base/dept/getDeptTree", {
          showHospital: 1
        }).then(res => {
          if (res && res.resCode == 200) {
            this.deptList = res.model
            this.originDeptList = res.model
          } else {
            this.$message({
              type: "warining",
              message: "请求科室失败！"
            })
          }
        })
      },
      addOtherDept() {
        this.specialSetting.push({
          skillScoreProportion: 0, theoryScoreProportion: 0, compreScoreProportion: 0, bigCaseScoreProportion: 0, passScore: 0, deptIds: [], deptNames: []
        })
        this.errorTipsList.push(
          { precent: false, num: false }
        )
      },
      deleteOherDept(index) {
        this.specialSetting.splice(index, 1)
        this.errorTipsList.splice(index, 1)
      },
      checkOtherDept(val, index) {
        // 检查占比
        let item = this.specialSetting[index]
        let skillFlag = this.validNum(item.skillScoreProportion)
        let theoryFlag = this.validNum(item.theoryScoreProportion)
        let comperFlag = this.validNum(item.compreScoreProportion)
        let caseFlag = this.validNum(item.bigCaseScoreProportion)
        if (skillFlag && theoryFlag && comperFlag && caseFlag) {
          this.errorTipsList[index].precent = false
        } else {
          this.errorTipsList[index].precent = true
        }
        this.$set(this.errorTipsList, index, this.errorTipsList[index])

      },
      checkTotal(val, index) {
        let item = this.specialSetting[index]
        let total = String(item.passScore).trim()
        if (total === "" || isNaN(total) || Number(total) < 0 || Number(total) > 200) {
          this.errorTipsList[index].num = true
        } else {
          this.errorTipsList[index].num = false
          item.total = Number(total).toFixed(2)
        }
        this.specialSetting.splice(index, 1, item)
        this.$set(this.errorTipsList, index, this.errorTipsList[index])
      },
      validNum(val) {
        val = String(val).trim()
        if (val === "" || isNaN(val)) {
          return false
        }
        if (Number(val) < 0 || Number(val) > 100) {
          return false
        }
        if (String(val).indexOf(".") > -1) {
          return false
        }
        return true
      },
      checkNumTotal(val) {
        val = String(val).trim()
        if (val === "" || isNaN(val)) {
          this.errorNum = true
          return false
        }
        if (Number(val) < 0 || Number(val) > 200) {
          this.errorNum = true
          return false
        }
        val = Number(val).toFixed(2)
        this.errorNum = false
        return true
      },
      checkNumPrecent(val) {
        val = String(val).trim()
        if (val === "" || isNaN(val)) {
          this.errorPrecent = true
          return false
        }
        if (Number(val) < 0 || Number(val) > 100) {
          this.errorPrecent = true
          return false
        }
        if (String(val).indexOf(".") > -1) {
          this.errorPrecent = true
          return false
        }
        this.errorPrecent = false
        return true
      },
      getlistAll() {
        post("/base/turnexamaudititem/listAll").then(res => {
          if (res && res.resCode == 200) {
            res.model.forEach(item => {
              if (item.associatedBusiness == 1) {
                item.associatedBusinessName = "考勤"
              } else if (item.associatedBusiness == 2) {
                item.associatedBusinessName = "教学活动"
              } else if (item.associatedBusiness == 3) {
                item.associatedBusinessName = "病历"
              }
            })
            this.outDeptSettingData = res.model
          } else {
            this.$message({
              type: "error",
              message: "请求审核项列表失败！"
            })
          }
        })
      },

      changeConnect(val) {
        this.connectItems.forEach(item => {
          if (item.value == val.value) {
            item.disabled = true
          }
        })
      },
      addItems() {
        this.connectForm = {
          program: {
            label: "", value: ""
          },
          name: ""
        }
        this.dialogFormVisible = true
        this.outDeptSettingData.forEach(item => {
          this.connectItems.forEach(citem => {
            if (item.associatedBusiness == citem.value) {
              citem.disabled = true
            }
          })
        })
      },
      deleteConnect(row, index) {

        this.connectItems.forEach(item => {
          if (item.value == row.value) {
            item.disabled = false
          }
        })
        this.outDeptSettingData.splice(index, 1)
      },
      saveConnect() {
        if (this.connectForm.name == "") {
          this.$message({
            type: "warning",
            message: "审核项不可为空！"
          })
          return false;
        }
        this.outDeptSettingData.push(
          { content: this.connectForm.name, associatedBusiness: this.connectForm.program.value, associatedBusinessName: this.connectForm.program.label }
        )
        this.$message({
          type: "success",
          message: "保存成功"
        })
        this.dialogFormVisible = false
      },
      checkNum() {
        let checkPlan = "" + this.form.evaluateEndTime;
        checkPlan = checkPlan
          .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
          .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
          .replace(/^\./g, "") // 保证第一个为数字而不是.
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          checkPlan = parseFloat(checkPlan) + "";
        } else if (checkPlan.indexOf(".") >= 0) {
          checkPlan = checkPlan.replace(/^()*(\d+)[.,]?.*$/, "$1$2"); // 只能输入两个小数
        }
        if (checkPlan < 0) {
          checkPlan = 0;
        }
        if (checkPlan > 31) {
          checkPlan = 31;
        }
        this.form.evaluateEndTime = checkPlan;
        setTimeout(() => {
          this.$refs.evaluateEndTime.currentValue = checkPlan;
        }, 100)
      },
      changeTimes(val) {
        // if (this.form.resource == 0) {


        // }
        this.error1 = ""
        this.form.startDay = this.originstartDay
        this.form.endDay = this.originendDay
      },
      changeActive(val) {
        // if (this.form.activeSetting == 0) {
        this.error2 = ""
        this.form.times = this.originTimes
        // }
      },
      changeCheck(val) {
        this.examSettingShow.forEach((item, index) => {
          this.examSettingShow.splice(index, 1, false)
          let str = val.join("/");

          if (str.indexOf(index) > -1) {
            this.examSettingShow.splice(index, 1, true)
          } else {
            let temp = {
              show: false, tips: ""
            }
            let key = 'score' + (index == 0 ? '' : index)
            this.form[key] = this.originScore[index]
            this.examTipsShow.splice(index, 1, temp)
          }

        })

      },
      examTipsCheck(val, ind) {
        if (this.examSettingShow[ind]) {
          let key = 'score' + (ind == 0 ? '' : ind)
          let score = this.form[key]
          let temp = {
            show: true, tips: "请输入1-200的分值（最多两位小数）"
          }
          if (score == "" || isNaN(score)) {

            this.examTipsShow.splice(ind, 1, temp)
            return
          }

          if (Number(score) > 200 || Number(score) < 1) {
            this.examTipsShow.splice(ind, 1, temp)
            return
          }
          if (String(score).indexOf(".") > -1) {
            this.examTipsShow.splice(ind, 1, temp)
            return
          }
          this.examTipsShow.splice(ind, 1, {
            show: false, tips: ""
          })

        }

      },
      timesCheck(val) {
        if (this.form.activeSetting == 1) {
          if (this.form.times == "") {
            this.error2 = "请输入1-100的整数！"
            return
          }
          if (isNaN(this.form.times) || String(this.form.times).indexOf(".") > -1) {
            this.error2 = "请输入1-100的整数！"
            return

          }
          if (Number(this.form.times) > 100 || Number(this.form.times) < 1) {
            this.error2 = "请输入1-100的整数！"
            return
          }
          this.error2 = ""
        }
      },
      setDate(val) {
        if (this.form.resource == 1) {
          if (this.form.startDay == "" || this.form.endDay == "") {
            this.error1 = "出科报名时间不能为空！"
            return
          }
          if (isNaN(this.form.endDay) || isNaN(this.form.startDay)) {
            this.error1 = "出科报名时间应为整数！"
            return
          }
          if (Number(this.form.endDay) > 31 || Number(this.form.endDay) < 1) {
            this.error1 = "出科报名时间应为大于1小于31的整数！"
            return
          }
          if (Number(this.form.startDay) > 31 || Number(this.form.startDay) < 1) {
            this.error1 = "出科报名时间应为大于1小于31的整数！"
            return
          }
          if (String(this.form.startDay).indexOf(".") > -1 || String(this.form.endDay).indexOf(".") > -1) {
            this.error1 = "出科报名时间应为整数！"
            return

          }
          if (Number(this.form.endDay) < Number(this.form.startDay)) {
            this.error1 = "出科报名时间开始时间应该小于结束时间！"
            return
          }
          this.error1 = ""
        }
      },
      getPrecent() {
        get(`/base/turnscoreconf/getList`).then(res => {
          if (res && res.resCode == 200) {
            this.form.normalSetting = {
              theoryScoreProportion: parseInt(Number(res.model.theoryScoreProportion) * 100),
              skillScoreProportion: parseInt(Number(res.model.skillScoreProportion) * 100),
              compreScoreProportion: parseInt(Number(res.model.compreScoreProportion) * 100),
              bigCaseScoreProportion: parseInt(Number(res.model.bigCaseScoreProportion) * 100),
              passScore: res.model.passScore,
            }
            this.specialSetting = []
            this.errorTipsList = []
            if (res.model.specialDeptList.length > 0) {
              // this.form.singleDept = true
              res.model.specialDeptList.forEach((item, index) => {
                let temp = {
                  theoryScoreProportion: parseInt(Number(item.theoryScoreProportion) * 100),
                  skillScoreProportion: parseInt(Number(item.skillScoreProportion) * 100),
                  compreScoreProportion: parseInt(Number(item.compreScoreProportion) * 100),
                  bigCaseScoreProportion: parseInt(Number(item.bigCaseScoreProportion) * 100),
                  passScore: item.passScore,
                }
                let deptIds = []
                let deptNames = []
                item.deptList = item.deptList == undefined || item.deptList == null ? [] : item.deptList
                item.deptList.forEach(citem => {
                  deptIds.push(citem.id)
                  deptNames.push(citem.name)
                })
                this.specialSetting.push({
                  ...temp,
                  deptIds,
                  deptNames
                })
                this.errorTipsList.push(
                  { precent: false, num: false }
                )
                this.$nextTick(() => {
                  console.log(this.specialSetting[index].deptIds)
                  this.$refs[`treeDom_${index}`][0].setCheckedKeys(this.specialSetting[index].deptIds)
                })
              })
            }
          }
        })
      },
      querySetting() {
        post('/commparaconf/queryCommparaConfList', {
          "command": "commparaconf/queryCommparaConfList",
          "sessionid": getCookie('sid'),
          "loginid": getCookie('uid'),
          "paramcode": 'ck_settings',
        }).then(data => {
          // this.commparaConfList = {}
          data.commparaConfList.forEach(item => {
            switch (item.paramvalue) {
              case "1":
                this.form.resource = item.param1
                this.form.startDay = item.param2 == null ? 1 : item.param2
                this.form.endDay = item.param3 == null ? 31 : item.param3
                this.originstartDay = item.param2 == null ? 1 : item.param2
                this.originendDay = item.param3 == null ? 1 : item.param3
                break
              case "2":
                this.form.isCheck = item.param1
                break
              case "3":
                if (item.param1 == 1) {
                  this.form.evaluate.push('0')
                }
                if (item.param2 == 1) {
                  this.form.evaluate.push('1')
                }
                if (item.param3 == 1) {
                  this.form.evaluate.push('2')
                }
                if (item.param4 == 1) {
                  this.form.evaluate.push('3')
                }
                break
              case "4":
                this.form.activeSetting = item.param1
                this.form.times = item.param2 == null ? 0 : Number(item.param2)
                this.originTimes = item.param2 == null ? 0 : Number(item.param2)
                break
              case "5":
                this.form.settingType = item.param9
                if (item.param9 == 1) {
                  // 比例设置
                  this.form.singleDept = item.param10 == 1 ? true : false
                  this.getPrecent()
                } else {
                  this.getScoreList()
                }

                break
              case '6': {
                this.form.autoChuke = Number(item.param1) == 1 ? true : false
                break
              }
              case '7': {
                this.form.evaluateEndTime = Number(item.param1) ? Number(item.param1) : 7
                if (item.param1 == "0") {
                  this.form.evaluateEndTime = 0
                }
                break
              }
              case '8': {
                this.form.isEnlist = item.param1
                break
              }
              case '9': {
                this.form.outDeptSetting = item.param1
                this.getlistAll()
                break
              }
              default:
                break;
            }
          })
          console.log(this.form)
          this.commparaConfList = data.commparaConfList
        })

      },
      getScoreList() {
        post("/base/turnscoreconf/getScoreValue").then(res => {
          if (res && res.resCode == 200) {
            let scoreObj = res.model
            if (scoreObj.passSkillScoreStatus == 1) {
              this.form.examSetting.push("0")
              this.originScore[0] = scoreObj.passSkillScore == null ? 0 : scoreObj.passSkillScore
              this.form.score = scoreObj.passSkillScore == null ? 0 : scoreObj.passSkillScore
              this.examSettingShow.splice(0, 1, true)
            }
            if (scoreObj.passTheoryScoreStatus == 1) {
              this.form.examSetting.push("1")
              this.form.score1 = scoreObj.passTheoryScore == null ? 0 : scoreObj.passTheoryScore
              this.originScore[1] = scoreObj.passTheoryScore == null ? 0 : scoreObj.passTheoryScore
              this.examSettingShow.splice(1, 1, true)
            }
            if (scoreObj.passCompreScoreStatus == 1) {
              this.form.examSetting.push("2")
              this.form.score2 = scoreObj.passCompreScore == null ? 0 : scoreObj.passCompreScore
              this.originScore[2] = scoreObj.passCompreScore == null ? 0 : scoreObj.passCompreScore
              this.examSettingShow.splice(2, 1, true)
            }
            if (scoreObj.passBigCaseScoreStatus == 1) {
              this.form.examSetting.push("3")
              this.form.score3 = scoreObj.passBigCaseScore == null ? 0 : scoreObj.passBigCaseScore
              this.originScore[3] = scoreObj.passBigCaseScore == null ? 0 : scoreObj.passBigCaseScore
              this.examSettingShow.splice(3, 1, true)
            }
          } else {
            this.$message({
              type: "warning",
              message: "获取分数设置失败"
            })
          }
        })
      },
      checkPrecent() {
        let temp = this.form.normalSetting
        let total = parseInt(Number(temp.skillScoreProportion) + Number(temp.theoryScoreProportion) + Number(temp.compreScoreProportion) + Number(temp.bigCaseScoreProportion))
        if (total != 100) {
          return { flag: false }
        }
        let paramsData = {
          scoreType: 1,
          scoreConfs: {
            skillScoreProportion: Number(temp.skillScoreProportion) / 100,
            theoryScoreProportion: Number(temp.theoryScoreProportion) / 100,
            compreScoreProportion: Number(temp.compreScoreProportion) / 100,
            bigCaseScoreProportion: Number(temp.bigCaseScoreProportion) / 100,
            passScore: temp.passScore,
          },
          deptScoreConfs: []
        }
        let flag = true
        this.specialSetting.forEach(item => {
          let total = parseInt(Number(item.skillScoreProportion) + Number(item.theoryScoreProportion) + Number(item.compreScoreProportion) + Number(item.bigCaseScoreProportion))
          paramsData.deptScoreConfs.push({
            skillScoreProportion: Number(item.skillScoreProportion) / 100,
            theoryScoreProportion: Number(item.theoryScoreProportion) / 100,
            compreScoreProportion: Number(item.compreScoreProportion) / 100,
            bigCaseScoreProportion: Number(item.bigCaseScoreProportion) / 100,
            bigCaseScoreProportion: Number(item.bigCaseScoreProportion) / 100,
            passScore: item.passScore,
            deptIds: item.deptIds
          })
          if (total != 100) {
            flag = false
          }
        })
        if (flag) {
          return { flag: true, paramsData: paramsData }
        } else {
          return { flag: false, paramsData: paramsData }
        }
      },
      saveScoreConf(type, score) {
        let paramsData = {}
        if (type == 1) {
          let flagObj = this.checkPrecent()
          if (!flagObj.flag) {
            this.$message({
              type: "warning",
              message: "占比总和必须为100%"
            })
            return false
          }
          paramsData = flagObj.paramsData

        } else {
          paramsData = {
            scoreType: 0,
            scoreValue: {
              passTheoryScoreStatus: score.param3,
              passTheoryScore: score.param4,
              passSkillScoreStatus: score.param1,
              passSkillScore: score.param2,
              passCompreScoreStatus: score.param5,
              passCompreScore: score.param6,
              passBigCaseScoreStatus: score.param7,
              passBigCaseScore: score.param8
            }
          }
        }

        post("/base/turnscoreconf/saveScoreConf", paramsData).then(res => {
          if (res && res.resCode == 200) {
            this.$message({
              type: "success",
              message: "保存出科考核设置成功！"
            })
          } else {
            this.$message({
              type: "warning",
              message: res.model ? res.model.join(",") : "保存出科考核设置失败"
            })
          }
        })
      },
      saveSetting() {
        if (!this.saveflag) {
          return false
        }
        this.saveflag = false
        let flag = false
        if (this.error1 != "" || this.error2 != "") {
          flag = true
        }
        if (this.form.outDeptSetting == 1 && this.outDeptSettingData.length == 0) {
          flag = true
          this.$message({
            type: "warning",
            message: "出科条件审核的审核项不可为空！"
          })
        }
        if (this.form.settingType == 1) {
          // 按照比例校验
          if (this.errorPrecent || this.errorNum) {
            flag = true
          }
          this.errorTipsList.forEach(item => {
            if (item.precent || item.num) {
              flag = true
            }
          })
        } else {
          // 按照分数校验
          this.examTipsShow.forEach(item => {
            if (item.show) {
              flag = true
            }
          })
        }

        if (flag) {
          this.saveflag = true
          return false;
        }
        let optionArr = []
        let checkFlag = true
        this.commparaConfList.forEach(item => {
          switch (item.paramvalue) {
            case "1":
              let temp1 = {
                id: item.id,
                param1: this.form.resource
              }
              if (this.form.resource == 1) {
                temp1["param2"] = this.form.startDay
                temp1["param3"] = this.form.endDay
              }
              optionArr.push(temp1)
              break
            case "2":
              optionArr.push({
                id: item.id,
                param1: this.form.isCheck
              })
              break
            case "3":
              let temp2 = {
                id: item.id,
              }
              let str = this.form.evaluate.join("/")
              temp2.param1 = str.indexOf("0") > -1 ? 1 : 0
              temp2.param2 = str.indexOf("1") > -1 ? 1 : 0
              temp2.param3 = str.indexOf("2") > -1 ? 1 : 0
              temp2.param4 = str.indexOf("3") > -1 ? 1 : 0
              optionArr.push(temp2)
              break
            case "4":
              let temp3 = {
                id: item.id,
                param1: this.form.activeSetting
              }
              if (this.form.activeSetting == 1) {
                temp3.param2 = this.form.times
              }
              optionArr.push(temp3)
              break
            case "5":
              let temp4 = {
                id: item.id
              }
              if (this.form.settingType == 1) {
                // 按照比例
                temp4.param9 = this.form.settingType
                temp4.param10 = this.form.singleDept ? 1 : 0

              } else {
                // 按照分数
                temp4.param9 = this.form.settingType
                temp4.param10 = this.form.singleDept ? 1 : 0
                let str1 = this.form.examSetting.join("/")
                temp4.param1 = str1.indexOf("0") > -1 ? 1 : 0
                temp4.param3 = str1.indexOf("1") > -1 ? 1 : 0
                temp4.param5 = str1.indexOf("2") > -1 ? 1 : 0
                temp4.param7 = str1.indexOf("3") > -1 ? 1 : 0

                if (temp4.param1 == 1) {
                  temp4.param2 = this.form.score
                }
                if (temp4.param3 == 1) {
                  temp4.param4 = this.form.score1
                }
                if (temp4.param5 == 1) {
                  temp4.param6 = this.form.score2
                }
                if (temp4.param7 == 1) {
                  temp4.param8 = this.form.score3
                }
              }
              checkFlag = this.saveScoreConf(this.form.settingType, temp4)
              optionArr.push(temp4)
              break
            case '6': {
              optionArr.push({
                id: item.id,
                param1: Number(this.form.autoChuke)
              })
              break
            }
            case '7': {
              optionArr.push({
                id: item.id,
                param1: Number(this.form.evaluateEndTime)
              })
              break
            }
            case '8': {
              optionArr.push({
                id: item.id,
                param1: Number(this.form.isEnlist)
              })
              break
            }
            case '9': {
              optionArr.push({
                id: item.id,
                param1: Number(this.form.outDeptSetting)
              })
              break
            }
            default:
              break;
          }

        })
        if (checkFlag === false) {
          this.saveflag = true
          return false
        }
        let tempArr = []
        this.outDeptSettingData.forEach(item => {
          let obj = {
            content: item.content,
            associatedBusiness: item.associatedBusiness
          }
          tempArr.push(obj)
        })
        post("/base/turnexamaudititem/addList", tempArr).then(res => {
          if (res && res.resCode == 200) {
          } else {
            this.$message({
              type: "error",
              message: "保存审核项列表报错！"
            })
          }
        })
        this.commparaConfList = optionArr
        post('/commparaconf/batchUpdate', {
          "command": "commparaconf/batchUpdate",
          "sessionid": getCookie('sid'),
          "loginid": getCookie('uid'),
          "commparaInfoList": this.commparaConfList,
        }).then(data => {
          if (data && data.errcode == 0) {
            this.querySetting();
            this.$message({
              type: 'success',
              message: '出科设置保存成功!'
            });
          } else {
            this.$message.error('保存出科设置失败！');
          }
          this.saveflag = true
        }).catch(() => {
          this.saveflag = true
        })

      }
    }
  }
</script>
<style>
  .demo-ruleForm .el-input-number {
    width: 95px;
  }

  .demo-ruleForm .el-radio,
  .demo-ruleForm .el-checkbox {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 10px;
  }

  .demo-ruleForm .el-checkbox {
    width: fit-content;
  }

  .demo-ruleForm .el-input {
    width: 90px;
  }

  .demo-ruleForm .el-input--small {
    width: 100px;
  }

  .demo-ruleForm .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .itemdialog .el-form-item .el-form-item__content {
    width: 217px;
  }

  .seetingPrecent .demo-form-inline .el-input {
    width: 250px;
    margin-right: 15px;
  }
  .circleSetting .el-input-number {
    width: 150px;
    margin: 0 10px;
  }
  .circleSetting .el-input-number .el-input{
    width: 100%;
  }
</style>
<style scoped>
  .inlinePre {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* margin-bottom: 20px; */
  }

  .marginTop15 {
    margin-top: 15px;
  }

  .inlinePre p {
    margin-right: 20px;
  }

  .settingScore,
  .seetingPrecent {
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .allTips .other {
    color: #666;
  }

  .limitOne {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tipError {
    font-size: 14px;
    color: red;
    display: block;
  }

  .slotLabel {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .slotLabel span {
    display: inline-block;
    width: 215px;
  }

  .colorRed {
    color: red;
  }

  .colorHeader {
    background: #333;
  }

  .box-card {
    margin-bottom: 20px;
  }

  .circleSetting {
    padding: 10px 20px;
    margin-bottom: 20px;
  }

  .tips {
    font-size: 14px;
    color: #666;
  }

  .alignRight {
    text-align: right;
    margin-top: 20px;
  }

  .settingTips {
    font-size: 12px;
    color: #666;
    margin-left: 20px;
  }

  .scoreUnit {
    font-size: 14px;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #CCCCCC;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #fff;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #CCCCCC;
  }
</style>