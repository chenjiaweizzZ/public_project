//慢病报告模板
<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="慢病综合报告" name="first">
        <el-button style="margin-top: 10px;" type="primary" @click="xz(null, null)" plain>新增</el-button>
        <el-table
          :data="diseasesynthesis.list"
          border
          style="width: 100% ;margin-bottom:60px; margin-top: 20px"
          stripe
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="模板名称"></el-table-column>
          <el-table-column prop="department" label="科室"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="address" label="操作" width="170">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="xz(scope.row, null)">修改</el-button>
              <el-button type="text" size="small" @click="compile(scope.row)">编辑模板</el-button>
              <el-button type="text" size="small" @click="deletex(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pageBottom"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total,sizes,prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="风险评估报告" name="second">
        <el-button style="margin-top: 10px;" type="primary" @click="xz(null, 'report')" plain>新增</el-button>
        <el-table
          :data="riskassessment.list"
          border
          style="width: 100%; margin-top: 20px;margin-bottom:60px"
          stripe
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="模板名称"></el-table-column>
          <el-table-column prop="department" label="科室"></el-table-column>
          <el-table-column prop="createBy" label="创建人"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="address" label="操作" width="170">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="assessmentExistBusinessData(scope.row,'xz','report')"
              >修改</el-button>
              <el-button
                type="text"
                size="small"
                @click="assessmentExistBusinessData(scope.row,'riskShow')"
              >编辑模板</el-button>
              <el-button
                type="text"
                size="small"
                @click="assessmentExistBusinessData(scope.row,'openPop')"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pageBottom"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total,sizes,prev, pager, next"
          :total="total1"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <div v-if="chronicdisease" class="chronicdiseasebox">
      <div class="chronicdiseaseform">
        <div style="text-align: right">
          <i style="font-size: 20px" class="el-icon-close" @click="chronicdisease = false"></i>
        </div>
        <div class="top">
          <h4 style="width: 180px"></h4>
          <h1>
            <span v-show="!editTitle">{{ reportmain.title }}</span>
            <!-- <el-input v-show="editTitle" v-model="reportmain.title" maxlength="20" show-word-limit></el-input> -->
            <!-- <i
              :class="{
                'el-icon-edit': !editTitle,
                'el-icon-check': editTitle,
              }"
              @click="editTitle = !editTitle"
            ></i>-->
          </h1>
          <h3>报告id:</h3>
        </div>
        <div class="title">
          <h3>{{ reportmain.modules[0].module }}</h3>
          <el-switch v-model="reportmain.modules[0].status"></el-switch>
        </div>
        <div class="jbxxbox">
          <p class="tibox">
            <span class="ti">姓名</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">性别</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">年龄</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">电话</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">身高</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">体重</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">血压</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">血糖</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">体重指数</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">吸烟</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">饮酒</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">降压情况</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">既往史</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">家族慢病史</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">入院诊断</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
          <p class="tibox">
            <span class="ti">联系地址</span>
            <span v-if="true" class="tivalue">-</span>
            <span v-else class="tivalue">-</span>
          </p>
        </div>
        <div class="shuangtitle">
          <div class="left">
            <div class="title">
              <h3>{{ reportmain.modules[1].module }}</h3>
              <el-switch v-model="reportmain.modules[1].status"></el-switch>
            </div>
            <el-select v-model="targets" placeholder="请选择" multiple @change="setTargets">
              <el-option
                v-for="(item,index) in targetList"
                :key="index"
                :label="item.dict_name"
                :value="item.dict_code"
              ></el-option>
            </el-select>
          </div>
          <div class="right">
            <div class="title">
              <h3>{{ reportmain.modules[2].module }}</h3>
              <el-switch v-model="reportmain.modules[2].status"></el-switch>
            </div>
            <el-select v-model="reportmain.modules[2].value" placeholder="请选择">
              <el-option
                v-for="(item, index) in riskassessmentList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="shuangtitle">
          <div class="left">
            <div class="title">
              <h3>{{ reportmain.modules[3].module }}</h3>
              <el-switch v-model="reportmain.modules[3].status"></el-switch>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              maxlength="1000"
              placeholder="请输入内容"
              v-model="reportmain.modules[3].value"
            ></el-input>
          </div>
          <div class="right">
            <div class="title">
              <h3>{{ reportmain.modules[4].module }}</h3>
              <el-switch v-model="reportmain.modules[4].status"></el-switch>
            </div>
            <div v-if="reportmain.modules[4].status">
              <p>下次随访安排</p>
              <p>随访时间：</p>
              <p>随访内容：</p>
              <p>注意事项:</p>
            </div>
            <!-- <el-input
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="请输入内容"
              v-model="reportmain.modules[4].call_func"
            ></el-input>-->
          </div>
        </div>
        <div class="title">
          <h3>{{ reportmain.modules[5].module }}</h3>
          <el-switch v-model="reportmain.modules[5].status"></el-switch>
        </div>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          maxlength="1000"
          placeholder="请输入内容"
          v-model="reportmain.modules[5].value"
        ></el-input>
        <div class="but">
          <el-button @click="chronicdisease = false">取消</el-button>
          <el-button type="primary" @click="tj(reportmain)">确认</el-button>
        </div>
      </div>
      <!--解决ios兼容问题-->
      <div style="height:20px"></div>
    </div>
    <div v-if="risk" class="chronicdiseasebox">
      <div class="chronicdiseaseform">
        <div style="text-align: right">
          <i style="font-size: 20px" class="el-icon-close" @click="risk = false"></i>
        </div>
        <h1 style="text-align: center" v-show="!showinput">
          {{ riskResult.titleName }}
          <u class="edit" @click="edit('title')"></u>
        </h1>
        <el-input
          class="titleName"
          placeholder="请输入标题（15字符内）"
          v-show="showinput"
          v-model="riskResult.titleName"
          ref="saveTagInput"
          @blur="handleInputConfirm('title')"
          @keyup.enter.native="$event.target.blur"
          maxlength="15"
        ></el-input>
        <div class="fenx">
          <div class="fenxBox" style="flex: 1; padding-top: 10px">
            <div class="fenxBtns">
              <div @click="chooseRiskType('0')"></div>
              <div @click="chooseRiskType('1')"></div>
              <div @click="chooseRiskType('2')"></div>
              <div @click="chooseRiskType('3')"></div>
            </div>
            <img :src="img" />
          </div>
          <div style="flex: 2; border: 1px solid #d7dae0">
            <div class="fenxtitle">
              <h4>糖尿病风险评估结果</h4>
              <div class="riskResult" :style="riskStyle">{{ riskResult.riskType }}</div>
            </div>
            <div class="fxmain">
              <h4 v-show="!showIns">
                {{ riskResult.inputValue }}
                <u class="edit" @click="edit"></u>
              </h4>
              <el-input
                class="titleName"
                placeholder="请输入（15字符内）"
                v-show="showIns"
                v-model="riskResult.inputValue"
                ref="saveInput"
                @blur="handleInputConfirm"
                @keyup.enter.native="$event.target.blur"
                maxlength="15"
              ></el-input>
              <div>
                <p class="fxmaintitle">风险等级</p>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="riskResult.textarea"
                ></el-input>
              </div>
              <div>
                <p class="fxmaintitle">当前风险</p>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="riskResult.riskNow"
                ></el-input>
              </div>
              <div>
                <p class="fxmaintitle">理想风险</p>
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="riskResult.riskIm"></el-input>
              </div>
              <div>
                <p class="fxmaintitle">死亡风险</p>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="riskResult.riskDeath"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <h3
          style="
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            font-weight: 500;
          "
        >糖尿病发病危险因素</h3>
        <el-table :data="riskassessment.list" border style="width: 100%; margin-top: 20px" stripe>
          <el-table-column type="index" label="危险因素" width="100"></el-table-column>
          <el-table-column prop="name" label="本次（2020/01/01）"></el-table-column>
          <el-table-column prop="department" label="上次（2020/01/01）"></el-table-column>
          <el-table-column prop="createBy" label="变化情况">
            <template slot-scope>
              <i style="color: #32ae57; font-size: 20px; font-weight: 900" class="el-icon-bottom"></i>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label=" 评估参考值"></el-table-column>
        </el-table>
        <div class="ts">
          <i class="el-icon-info"></i>
          <span>提示：控制血脂水平，控制体重，控制血压水平，减少腰围，改善以上因素可降低您的糖尿病发病风险和死亡风险</span>
        </div>
        <span slot="footer" class="footerBtn">
          <el-button @click="risk = false">取 消</el-button>
          <el-button type="primary" @click="sava">保 存</el-button>
        </span>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="所属医院" prop="hospitalId">
            <el-select
              class="width200 value"
              v-model="ruleForm.hospitalId"
              placeholder="所属医院"
              @change="getDeptList"
            >
              <el-option
                v-for="item in hospitalList"
                :key="item.serial_no"
                :value="item.serial_no"
                :label="item.hospital_name"
                :disabled="item.serial_no != $global.hospital_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="deptId">
            <el-select v-model="ruleForm.deptId" placeholder="科室">
              <el-option
                v-for="item in deptOptions"
                :key="item.serialNo"
                :value="item.serialNo"
                :label="item.deptName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" prop="name">
            <el-input class="limiting" v-model="ruleForm.name" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="bc('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="delectDialogVisible" width="30%">
      <span>确认是否删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delectRisk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jigaowei from '@/assets/images/jigaowei.png'
import gaowei from '@/assets/images/gaowei.png'
import zhongwei from '@/assets/images/zhongwei.png'
import diwei from '@/assets/images/diwei.png'
export default {
  data() {
    return {
      checkBtn: false,
      editTitle: false,
      title: '添加',
      ruleForm: {
        hospitalName: '',
        hospitalId: '',
        department: '',
        deptId: '',
        name: '',
      },
      dialogVisible: false,
      risk: false,
      value1: [],
      value: '',
      activeName: 'first',
      diseasesynthesis: [],
      riskassessment: {},
      pageNo: 1,
      pageSize: 10,
      pageNo2: 1,
      pageSize2: 10,
      total: 0,
      total1: 0,
      chronicdisease: false,
      zsnr: [],
      exhibition: {},
      reportmain: {},
      id: null,
      hospitalList: [],
      deptOptions: [],
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        hospitalId: [
          { required: true, message: '请选择医院', trigger: 'change' },
        ],
      },
      showinput: false,
      showIns: false,
      delectDialogVisible: false,
      riskResult: {
        titleName: '标题',
        inputValue: '介绍',
        riskType: '低危',
        textarea: '',
        riskNow: '',
        riskIm: '',
        riskDeath: '',
      },
      riskTypeList: ['极高危', '高危', '中危', '低危'],
      riskId: '',
      addType: '',
      chooseRisk: {},
      selectRow: {},
      riskassessmentList: [],
      targetList: [],
      targets: [],
    }
  },
  computed: {
    riskStyle() {
      switch (this.riskResult.riskType) {
        case '低危':
          return { color: '#32AE57' }
        case '中危':
          return { color: '#FF9000' }
        case '高危':
          return { color: '#F15F00' }
        case '极高危':
          return { color: '#FF220A ' }
      }
    },
    img() {
      switch (this.riskResult.riskType) {
        case '极高危':
          return jigaowei
        case '高危':
          return gaowei
        case '中危':
          return zhongwei
        case '低危':
          return diwei
      }
    },
  },
  watch: {},
  mounted() {
    this.$apis.hospitalgetAllHospitals().then((res) => {
      this.hospitalList = res
    })
    this.$apis
      .BaseDictGetDictItems({
        parentId: '20200918150816665re5',
      })
      .then((res) => {
        this.targetList = res.filter((item) => item.enabled == '1')
      })
    this.getdiseasesynthesis()
    this.getriskassessment()
  },
  methods: {
    assessmentExistBusinessData(row, fun, type) {
      this.$apis
        .assessmentExistBusinessData({
          id: row.id,
        })
        .then((res) => {
          if (!res) {
            this[fun](row, type)
          } else {
            this.$message({
              message: '模板已有业务数据不可进行此项操作!',
              type: 'warning',
            })
          }
        })
    },
    setTargets() {
      this.reportmain.modules[1].value = this.targets.join('|')
    },
    edit(type) {
      if (type == 'title') {
        this.showinput = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } else {
        this.showIns = true
        this.$nextTick((_) => {
          this.$refs.saveInput.$refs.input.focus()
        })
      }
    },
    handleInputConfirm(type) {
      if (type == 'title') {
        this.showinput = false
      } else {
        this.showIns = false
      }
    },
    chooseRiskType(num) {
      this.riskResult.riskType = this.riskTypeList[num]
      console.log(this.riskResult.riskType)
    },
    sava() {
      var that = this
      this.chooseRisk.contentJson = JSON.stringify(this.riskResult)
      this.$apis.riskassessmentSave(this.chooseRisk).then((res) => {
        if (res) {
          this.risk = false
          this.$message.success('保存成功')
          that.getriskassessment()
        }
      })
    },
    riskShow(data) {
      let smartFormUrl = JSON.parse(
        sessionStorage.getItem('base_url')
      ).SmartFormUrl
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            smartFormUrl +
            '/view/template/create?appid=flupsystem&businessId=78978900011&saveHook=' +
            smartFormUrl +
            '/saveHook&templateId=' +
            data.id,
          title: `模板编辑`,
        }),
        '*'
      )
    },
    openPop(data) {
      this.riskId = data.id
      this.delectDialogVisible = true
    },
    delectRisk() {
      this.delectDialogVisible = false
      this.$apis.riskassessmentDelect(this.riskId).then((res) => {
        if (res) {
          this.$message.success('删除成功')
          if (this.riskassessment.list.length == 1 && this.pageNo2 != 1) {
            this.pageNo2 = this.pageNo2 - 1
          }
          this.getriskassessment()
        }
      })
    },
    deletex(row) {
      // this.$apis.diseasesynthesisdelete(row.id).then((res) => {
      //   if (res) {
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success',
      //     })
      //     if (this.diseasesynthesis.list.length == 1 && this.pageNo != 1) {
      //       this.pageNo = this.pageNo - 1
      //     }
      //     this.getdiseasesynthesis()
      //   }
      // })
      this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$apis.diseasesynthesisdelete(row.id).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              if (this.diseasesynthesis.list.length == 1 && this.pageNo != 1) {
                this.pageNo = this.pageNo - 1
              }
              this.getdiseasesynthesis()
            }
          })
        })
        .catch(() => {})
    },
    xz(row, type) {
      this.ruleForm = {
        hospitalName: '',
        hospitalId: '',
        department: '',
        deptId: '',
        name: '',
      }
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields()
      }

      this.addType = type
      if (row != null) {
        this.title = '编辑'
        this.ruleForm.hospitalId = row.hospitalId
        this.getDeptList()
        this.ruleForm = {
          id: row.id,
          hospitalName: row.hospitalName,
          hospitalId: row.hospitalId,
          department: row.department,
          deptId: row.deptId,
          name: row.name,
        }
      }
      this.dialogVisible = true
    },
    bc(formName) {
      this.checkBtn = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.hospitalList.forEach((res) => {
            if (res.serial_no == this.ruleForm.hospitalId) {
              this.ruleForm.hospitalName = res.hospital_name
            }
          })
          this.deptOptions.forEach((res) => {
            if (res.serialNo == this.ruleForm.deptId) {
              this.ruleForm.department = res.deptName
            }
          })
          if (this.addType == 'report') {
            this.$apis
              .riskassessmentSave({
                ...this.ruleForm,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                  })
                  this.dialogVisible = false
                  this.getriskassessment()
                }
              })
          } else {
            this.$apis
              .diseasesynthesissave({
                ...this.ruleForm,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                  })
                  this.dialogVisible = false
                  this.getdiseasesynthesis()
                }
              })
          }
        } else {
          this.checkBtn = false
          return false
        }
        let _this = this
        setTimeout(function () {
          _this.checkBtn = false
        }, 2000)
      })
    },
    getDeptList() {
      this.$apis
        .systemManagequeryCurrentUserDept({
          hospitalId: this.ruleForm.hospitalId,
        })
        .then((res) => {
          this.deptOptions = res || []
        })
    },
    tj() {
      let a = JSON.stringify(this.reportmain)
      // this.selectRow.name=this.reportmain.title
      this.selectRow.contentJson = a
      this.selectRow.riskAssessments = this.reportmain.modules[2].value
      this.$apis.diseasesynthesissave(this.selectRow).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
        }
        this.chronicdisease = false
        this.edit = false
        this.getdiseasesynthesis()
      })
    },
    compile(row) {
      console.log(row)
      this.selectRow = row
      this.chronicdisease = true
      this.editTitle = false
      this.id = row.id
      this.reportmain = row.contentJson
        ? JSON.parse(row.contentJson)
        : {
            title: row.name,
            reportId: row.id,
            modules: [
              {
                module: '基本信息',
                status: true,
              },
              {
                module: '健康监测数据',
                status: false,
                value: '',
                fields: [],
              },
              {
                module: '风险评估',
                status: true,
                value: '',
                fields: [],
              },
              {
                module: '健康建议',
                status: false,
              },
              {
                module: '随访安排',
                status: true,
                value: '',
              },
              {
                module: '知情同意书',
                status: true,
                value: '',
              },
            ],
          }
      this.targets = this.reportmain.modules[1].value
        ? this.reportmain.modules[1].value.split('|')
        : []
      // this.getriskassessmentList()    deptId
      this.$apis
        .riskassessment({ pageNo: 1, pageSize: 9999, deptId: row.deptId })
        .then((res) => {
          this.riskassessmentList = res.list
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getdiseasesynthesis()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getdiseasesynthesis()
    },
    handleSizeChange2(val) {
      this.pageSize2 = val
      this.pageNo2 = 1
      this.getriskassessment()
    },
    handleCurrentChange2(val) {
      this.pageNo2 = val
      this.getriskassessment()
    },
    getdiseasesynthesis() {
      this.$apis
        .diseasesynthesis({ pageNo: this.pageNo, pageSize: this.pageSize })
        .then((res) => {
          this.diseasesynthesis = res
          this.total = res.total
        })
    },
    getriskassessment() {
      this.$apis
        .riskassessment({ pageNo: this.pageNo2, pageSize: this.pageSize2 })
        .then((res) => {
          this.riskassessment = res
          this.total1 = res.total
        })
    },
    handleClick(tab, event) {
      this.getriskassessmentList()
    },
    getriskassessmentList() {
      this.$apis.riskassessment({ pageNo: 1, pageSize: 9999 }).then((res) => {
        this.riskassessmentList = res.list
      })
    },
  },
}
</script>

<style style lang="scss" scoped>
.chronicdiseasebox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  .edit {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url('../../../assets/images/edit.png') no-repeat center;
    background-size: 16px;
    vertical-align: middle;
    cursor: pointer;
  }
  .footerBtn {
    display: block;
    text-align: right;
  }
  .fenxBox {
    position: relative;
  }
  .fenxBtns {
    position: absolute;
    width: 100%;
    div {
      height: 65px;
      cursor: pointer;
    }
  }
  .chronicdiseaseform {
    margin: 50px auto 0;
    width: 60%;
    max-height: 80vh;
    overflow-y: scroll;
    padding: 20px;
    background-color: #fff;
  }
  @media screen and (max-width: 1366px) {
    .chronicdiseaseform {
      height: 400px;
    }
  }
  .top {
    display: flex;
    padding-bottom: 20px;
    justify-content: space-between;
    align-items: flex-end;
  }
  .title {
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 10px;
    // border-bottom: 1px solid #d7dae0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .jbxxbox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-bottom: 1px solid #d7dae0;
    .tibox {
      padding: 10px;
      .ti {
        display: inline-block;
        text-align: right;
        min-width: 100px;
        padding-right: 20px;
      }
      .tivalue {
        display: inline-block;
        text-align: left;
        min-width: 120px;
      }
    }
  }
  .shuangtitle {
    padding-bottom: 10px;
    .el-select {
      width: 100%;
    }
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    .left {
      margin-right: 40px;
    }
    > div {
      width: 50%;
    }
  }
  .but {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .fenx {
    display: flex;
    padding: 20px 0px;
    .fenxtitle {
      width: 100%;
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      background: #32ae57;
      h4 {
        font-size: 14px;
        color: #fff;
      }
      div {
        width: 94px;
        height: 28px;
        margin-left: 20px;
        line-height: 28px;
        text-align: center;
        font-weight: 600;
        color: #ff220a;
        background: #ffffff;
        border-radius: 16px;
      }
    }
    .fxmain {
      width: 100%;
      height: 245px;
      padding: 10px 20px;
      overflow: scroll;
      h4 {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.2px;
      }
      div {
        padding: 10px;
        display: flex;
        align-items: flex-start;
        p {
          font-size: 14px;
          color: #111111;
          letter-spacing: 0.2px;
        }
        .fxmaintitle {
          margin-top: 3px;
          min-width: 70px;
          height: 15px;
          line-height: 15px;
          border-left: 3px solid #ff7b35;
          padding-left: 5px;
        }
      }
    }
  }
  .ts {
    padding: 10px 0;
    i {
      color: #32ae57;
    }
    span {
      font-size: 12px;
      color: #666666;
    }
  }
}
</style>
