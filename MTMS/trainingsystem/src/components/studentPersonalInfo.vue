<template>
  <div v-if="dialogRecordsCopy" class="otherStudentInfo">
    <!-- 个人档案 -->
    <el-dialog class="student-records" width="80%" :title="title" :visible.sync="isShow" @close="closeDialogRecords">
      <!-- tab切换 锚点 -->
      <div class="tab-content">
        <el-tabs v-model="activeName" @tab-click="scrollClick">
          <el-tab-pane label="基本信息" name="first"></el-tab-pane>
          <el-tab-pane label="轮转计划" name="second"></el-tab-pane>
          <el-tab-pane label="考勤" name="third"></el-tab-pane>
          <el-tab-pane label="教学活动" name="fourth"></el-tab-pane>
          <el-tab-pane label="360评价" name="five"></el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="activeName == 'first'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="infoBox">
            <p :class="{'oneLine': item.oneLine, 'infoItem': true}" v-for="(item, index) in baseInfo" :key="index">
              <span :class="{'longLabel': item.long, 'labelTips': true}">{{item.label}}</span>
              <span v-if="item.type != 'img'">{{item.value}}</span>
              <img v-else-if="item.type == 'img'" :src="item.value" />
            </p>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>规培信息</span>
          </div>
          <div class="infoBox residentBox">
            <p :class="{'oneLine': item.oneLine, 'infoItem': true}" v-for="(item, index) in residentInfo" :key="index">
              <span :class="{'longLabel': item.long, 'labelTips': true}">{{item.label}}</span>
              <span v-if="item.type != 'img'">{{item.value}}</span>
              <img v-else-if="item.type == 'img'" :src="item.value" />
            </p>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>学历信息</span>
          </div>
          <el-table :data="educationTable" border>
            <el-table-column prop="date" label="毕业院校"></el-table-column>
            <el-table-column prop="name" label="入学时间"></el-table-column>
            <el-table-column prop="address" label="毕业时间"></el-table-column>
            <el-table-column prop="address" label="毕业专业"></el-table-column>
            <el-table-column prop="address" label="学位"></el-table-column>
            <el-table-column prop="address" label="学制"></el-table-column>
            <el-table-column prop="address" label="学历"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>原工作信息</span>
          </div>
          <el-table :data="educationTable" border>
            <el-table-column prop="date" label="起止年月"></el-table-column>
            <el-table-column prop="name" label="单位名称"></el-table-column>
            <el-table-column prop="address" label="所在地"></el-table-column>
            <el-table-column prop="address" label="职务"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>家庭成员和主要社会关系</span>
          </div>
          <el-table :data="educationTable" border>
            <el-table-column prop="date" label="姓名"></el-table-column>
            <el-table-column prop="name" label="性别"></el-table-column>
            <el-table-column prop="address" label="年龄"></el-table-column>
            <el-table-column prop="address" label="与本人关系"></el-table-column>
            <el-table-column prop="address" label="现工作单位及所在地"></el-table-column>
            <el-table-column prop="address" label="政治面貌"></el-table-column>
            <el-table-column prop="address" label="职务"></el-table-column>
          </el-table>
          <div class="oneLine infoItem">
            <p class="{longLabel labelTips}">家庭成员和主要社会关系中曾否受过何种处分(包括行政处分和刑事处罚)</p>
            <p>家庭成员和主要社会关系中曾否受过何种处分(包括行政处分和刑事处罚)</p>
          </div>
        </el-card>
      </div>
      <div v-if="activeName == 'second'">
        <el-table :data="tableData" border>
          <el-table-column prop="date" label="轮转科室"></el-table-column>
          <el-table-column prop="name" label="计划轮转周期"></el-table-column>
          <el-table-column prop="address" label="实际轮转周期"></el-table-column>
          <el-table-column prop="address" label="分带教"></el-table-column>
          <el-table-column prop="address" label="总带教"></el-table-column>
          <el-table-column prop="address" label="轮转状态"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div v-if="activeName == 'third'">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="轮转科室"></el-table-column>
          <el-table-column prop="name" label="计划轮转周期"></el-table-column>
          <el-table-column prop="address" label="实际轮转周期"></el-table-column>
          <el-table-column prop="address" label="轮转状态"></el-table-column>
          <el-table-column prop="address" label="请假"></el-table-column>
          <el-table-column prop="address" label="旷工"></el-table-column>
          <el-table-column prop="address" label="迟到"></el-table-column>
          <el-table-column prop="address" label="早退"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div v-if="activeName == 'fourth'">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="教学活动主题"></el-table-column>
          <el-table-column prop="name" label="活动级别"></el-table-column>
          <el-table-column prop="address" label="科室"></el-table-column>
          <el-table-column prop="address" label="活动时间"></el-table-column>
          <el-table-column prop="address" label="活动类型"></el-table-column>
          <el-table-column prop="address" label="学时"></el-table-column>
          <el-table-column prop="address" label="主讲人/主持人"></el-table-column>
          <el-table-column prop="address" label="活动地点"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum2" :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div v-if="activeName == 'five'">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="轮转科室"></el-table-column>
          <el-table-column prop="name" label="计划轮转周期"></el-table-column>
          <el-table-column prop="address" label="实际轮转周期"></el-table-column>
          <el-table-column prop="address" label="护培生评价带教"></el-table-column>
          <el-table-column prop="address" label="带教评价护培生"></el-table-column>
          <el-table-column prop="address" label="护培生评价科室"></el-table-column>
          <el-table-column prop="address" label="轮转状态"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum2" :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { oldpost, getCookie, currentDate, post } from '../config/util'
  import { mapState, mapActions } from 'vuex'

  export default {
    props: {
      studentDetailId: {
        type: String,
        default() {
          return "";
        }
      },
      dialogRecords: {
        type: Boolean,
        default() {
          return false;
        }
      },
      sysType: {
        type: String,
        default: "resident"
      }

    },
    computed: {
      ...mapState([
        'sysTypeNum'
      ]),
    },
    data() {
      return {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        tableData: [],
        dialogRecordsCopy: false,
        isShow: false,
        title: "",
        selectStudentInfo: {},
        activeName: "first",
        educationTable: [],
        baseInfo: [
          { label: "头像", value: "头像", key: "", required: false, oneLine: true, type: 'img' },
          { label: "曾用名", value: "曾用名", key: "", required: true, oneLine: false },
          { label: "学号", value: "学号", key: "", required: true, oneLine: false },
          { label: "性别", value: "性别", key: "", required: true, oneLine: false },
          { label: "手机号", value: "手机号", key: "", required: true, oneLine: false },
          { label: "出生日期", value: "出生日期", key: "", required: false, oneLine: false },
          { label: "年级", value: "年级", key: "", required: true, oneLine: false },
          { label: "班级", value: "班级", key: "", required: false, oneLine: false },
          { label: "婚姻状况", value: "婚姻状况", key: "", required: false, oneLine: false },
          { label: "民族", value: "民族", key: "", required: false, oneLine: false },
          { label: "所属院区", value: "所属院区", key: "", required: true, oneLine: false },
          { label: "邮箱", value: "邮箱", key: "", required: false, oneLine: false },
          { label: "健康状况", value: "健康状况", key: "", required: false, oneLine: false },
          { label: "政治面貌", value: "政治面貌", key: "", required: false, oneLine: false },
          { label: "参加党派时间", value: "参加党派时间", key: "", required: false, oneLine: false },
          { label: "何人介绍", value: "何人介绍", key: "", required: false, oneLine: false },
          { label: "出生地", value: "出生地", key: "", required: false, oneLine: false },
          { label: "籍贯", value: "籍贯", key: "", required: false, oneLine: false },
          { label: "宗教信仰", value: "宗教信仰", key: "", required: false, oneLine: false },
          { label: "家庭出身", value: "家庭出身", key: "", required: false, oneLine: false },
          { label: "本人成分", value: "本人成分", key: "", required: false, oneLine: false },
          { label: "最高学历", value: "最高学历", key: "", required: false, oneLine: false },
          { label: "何时何校何专业毕（肆）业", value: "何时何校何专业毕（肆）业", key: "", required: false, oneLine: true, long: true },
          { label: "学制", value: "学制", key: "", required: false, oneLine: false },
          { label: "学位", value: "学位", key: "", required: false, oneLine: false },
          { label: "学位授予时间", value: "学位授予时间", key: "", required: false, oneLine: false },
          { label: "学位类型", value: "学位类型", key: "", required: false, oneLine: false },
          { label: "学位授予单位", value: "学位授予单位", key: "", required: false, oneLine: true },
          { label: "一卡通信息", value: "一卡通信息", key: "", required: false, oneLine: false },
          { label: "家人联系电话", value: "家人联系电话", key: "", required: false, oneLine: false },
          { label: "证件类型", value: "证件类型", key: "", required: true, oneLine: false },
          { label: "证件号码", value: "证件号码", key: "", required: true, oneLine: false },
          { label: "户口所在地", value: "户口所在地", key: "", required: false, oneLine: true },
          { label: "通讯处", value: "通讯处", key: "", required: false, oneLine: true },
          { label: "懂何种外语及熟练程度（等）", value: "懂何种外语及熟练程度（等）", key: "", required: false, oneLine: true, long: true },
          { label: "有何特长", value: "有何特产", key: "", required: false, oneLine: false },
          { label: "普通话", value: "普通话", key: "", required: false, oneLine: false },
          { label: "职业资格名称（类别）", value: "职业资格名称（类别）", key: "", required: false, oneLine: false },
          { label: "证书编号", value: "证书编号", key: "", required: false, oneLine: false },
          { label: "发证机关及时间", value: "发证机关及时间", key: "", required: false, oneLine: false },
          { label: "执业资格注册范围", value: "执业资格注册范围", key: "", required: false, oneLine: false },
          { label: "证书编号", value: "证书编号", key: "", required: false, oneLine: false },
          { label: "发证机关及时间", value: "发证机关及时间", key: "", required: false, oneLine: false },
          { label: "何时因何种原因受过何种奖励或处分", value: "何时因何种原因受过何种奖励或处分", key: "", required: false, oneLine: true },
        ],
        residentInfo: [
          { label: "学员类型", value: "学员类型", key: "", required: true, oneLine: false },
          { label: "专业基地", value: "培训专业", key: "", required: false, oneLine: false },
          { label: "学员类型", value: "学员类型", key: "", required: false, oneLine: false },
          { label: "导师", value: "导师", key: "", required: false, oneLine: false },
          { label: "培训年限核定", value: "培训年限核定", key: "", required: false, oneLine: false },
          { label: "招收年度", value: "招收年度", key: "", required: false, oneLine: false },
          { label: "实际培训开始时间", value: "实际培训开始时间", key: "", required: false, oneLine: false },
          { label: "终止培训时间", value: "终止培训时间", key: "", required: false, oneLine: false },
          { label: "结业年度", value: "结业年度", key: "", required: false, oneLine: false },
          { label: "取得护士规范化培训合格证书时间", value: "取得护士规范化培训合格证书时间", key: "", required: false, oneLine: true, long: true },
          { label: "培训期间奖励与表彰、处分与处罚", value: "培训期间奖励与表彰、处分与处罚", key: "", required: false, oneLine: true, long: true },
        ],
      }
    },
    watch: {
      dialogRecords(newVal, oldVal) {
        this.isShow = newVal;
        this.dialogRecordsCopy = newVal
        if (newVal) {
          this.personInfo();
          // this.turnPlanInfo()
        } else {
          this.title = ""
          this.selectStudentInfo = {}
        }
      }
    },
    methods: {
      handleCurrentChange1() { },
      handleSizeChange1() { },
      handleCurrentChange() { },
      handleSizeChange() { },
      scrollClick() {
        this.pageSize = 10
        this.pageNum = 1
        this.tableData = []
      },
      personInfo() {
        // 查询个人信息
        if (!this.studentDetailId) {
          return false;
        }
        let url = `service-pub/studentFile/personInfo?sysType=${this.sysTypeNum}`
        post(url, this.studentDetailId).then((data) => {
          if (data && data.errcode == 0) {
            this.title = data.student.name + '的个人档案';
            this.selectStudentInfo = data.student;
          } else {
            this.title = ""
            this.selectStudentInfo = {}
            this.$message.error({ message: '个人档案请求失败！' })
          }

        }).catch(err => {
          this.closeDialogRecords()
        })
      },
      closeDialogRecords() {
        this.$emit('update:dialogRecords', false)
        this.title = ""
      },
    }
  }
</script>
<style scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .infoBox {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .infoItem {
    width: 50%;
    font-size: 15px;
    margin-bottom: 22px;
  }

  .residentBox .infoItem {
    width: 30%;
  }

  .oneLine {
    width: 100% !important;
  }

  .labelTips {
    width: 110px;
    text-align: left;
    vertical-align: top;
  }

  .longLabel {
    width: 200px;
  }

  .residentBox .labelTips {
    width: 100px;

  }

  .residentBox .longLabel {
    width: 220px;
  }
</style>
<style>
  .otherStudentInfo .el-pagination {
    margin-top: 20px;
  }

  .otherStudentInfo .el-card__header {
    background: #fafafa;
    font-size: 15px;
  }
</style>