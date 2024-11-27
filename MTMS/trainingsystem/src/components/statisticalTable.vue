<template>
  <div class="statisticalTable">
    <el-radio-group v-model="tabIndex" style="margin-bottom: 30px;" @change="changeTab">
      <el-radio-button label="0">按基地</el-radio-button>
      <el-radio-button label="1">按科室</el-radio-button>
      <el-radio-button label="2">明细</el-radio-button>
    </el-radio-group>
    <!-- 按基地 -->
    <div v-if="tabIndex == 0">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="统计日期：" style="width:550px;">
          <el-date-picker
            v-model="formInline.startTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>-
          <el-date-picker
            v-model="formInline.endTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="专业基地：">
            <el-select v-model="formInline.region" placeholder="请选择" multiple>
              <el-option v-for="item in baseidList" :key="item.id" :label="item.deptname" :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>-->
        <!-- <hospital-base-dept :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :multiBase="multiBase" :hasDept="hasDept"
        :key="base"></hospital-base-dept>-->
        <el-form-item label="专业基地：">
          <el-select v-model="baseSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="baseClear()" @remove-tag="baseRemove()">
            <el-option disabled class="baseOption" value>
              <el-tree
                :props="baseProps"
                :data="baseList"
                show-checkbox
                ref="baseTree"
                check-strictly
                node-key="id"
                check-on-click-node
                @check-change="baseSelect"
                class="hosWithNoCheckBox"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <hospital-base-dept :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :deptTitle="轮转科室"></hospital-base-dept> -->
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="exportOprate">
        <el-button type="primary" @click="exportData">导出</el-button>
        <el-tooltip placement="left" effect="light">
          <div slot="content">
            <div class="content-text">
              <p v-for="item in introTips[activeIndex-1]">{{item}}</p>
            </div>
          </div>
          <span class="intro">
            说明
            <i class="el-icon-question"></i>
          </span>
        </el-tooltip>
      </div>
      <el-table :data="baseTableData" border style="width: 100%" :key="tabIndex">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column :prop="activeIndex == 4 ? 'baseName' : 'name'" label="专业基地"></el-table-column>
        <el-table-column :prop="typeValue[0]" :label="typeName[0]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(0,scope.row)">{{scope.row[typeValue[0]]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :prop="typeValue[1]" :label="typeName[1]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(1,scope.row)">{{scope.row[typeValue[1]]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :prop="typeValue[2]" :label="typeName[2]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(2,scope.row)">{{scope.row[typeValue[2]]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="percent" label="进度"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="bsHandleSizeChange"
        @current-change="bsHandleCurrentChange"
        :current-page="bscurrentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="bsPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="baTotal"
      ></el-pagination>
    </div>
    <!-- 按科室 -->
    <div v-if="tabIndex == 1">
      <el-form :inline="true" :model="ksformInline" class="demo-form-inline">
        <el-form-item label="统计日期：" style="width:550px;">
          <el-date-picker
            v-model="ksformInline.startTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>-
          <el-date-picker
            v-model="ksformInline.endTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="轮转科室："> -->
        <!-- <el-select v-model="ksformInline.dept" placeholder="请选择" multiple>
              <el-option v-for="item in alldeptList" :key="item.id" :label="item.deptname" :value="item.id">
        </el-select>-->
        <!-- <hospital-base-dept
          :clearAll="rightNowClear"
          @updateSelectIds="setksQueryFormOne"
          :multiBase="multiBase"
          :multiDept="multiDept"
          key="dept"
        ></hospital-base-dept> -->
        <!-- </el-form-item> -->
        <el-form-item label="科室：">
          <el-select v-model="deptSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="deptClear()" @remove-tag="deptRemove()">
            <el-option disabled class="baseOption">
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
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="exportOprate">
        <el-button type="primary" @click="exportData">导出</el-button>
        <el-tooltip placement="left" effect="light">
          <div slot="content">
            <div class="content-text">
              <p v-for="item in introTips[activeIndex-1]">{{item}}</p>
            </div>
          </div>
          <span class="intro">
            说明
            <i class="el-icon-question"></i>
          </span>
        </el-tooltip>
      </div>
      <el-table :data="deptTableData" border :key="tabIndex">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column :prop="activeIndex == 4 ? 'deptName' : 'name'" label="科室"></el-table-column>
        <el-table-column :prop="typeValue[0]" :label="typeName[0]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(0,scope.row)">{{scope.row[typeValue[0]]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column :prop="typeValue[1]" :label="typeName[1]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(1,scope.row)">{{scope.row[typeValue[1]]}}</el-button>
          </template>
        </el-table-column>s
        <el-table-column :prop="typeValue[2]" :label="typeName[2]">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(2,scope.row)">{{scope.row[typeValue[2]]}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="percent" label="进度"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="deptHandleSizeChange"
        @current-change="deptHandleCurrentChange"
        :current-page="deptcurrentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="deptPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="deptTotal"
      ></el-pagination>
    </div>
    <!-- 明细 -->
    <div v-if="tabIndex == 2">
      <!-- <el-form :inline="true" :model="deformInline" class="demo-form-inline">
        <el-form-item label="统计日期：" style="width:380px;">
          <el-date-picker
            v-model="deformInline.startTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>-
          <el-date-picker
            v-model="deformInline.endTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业基地：">
          <el-select v-model="deformInline.region" placeholder="请选择" multiple @change="newbasechange">
            <el-option v-for="item in baseidList" :key="item.id" :label="item.deptname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-form :inline="true" :model="deformInline" class="demo-form-inline">
        <!-- <el-form-item label="轮转科室：">
          <el-select v-model="deformInline.dept" multiple placeholder="请选择">
            <el-option v-for="item in newdeptList" :key="item.id" :label="item.deptname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>-->
        <!-- <hospital-base-dept
          key="deform"
          :clearAll="rightNowClear"
          :deptTitle="轮转科室"
          @updateSelectIds="setdeQueryFormOne"
          :multiBase="multiBase"
          :multiDept="multiDept"
        ></hospital-base-dept> -->

        <el-form-item label="统计日期：" style="width:550px;">
          <el-date-picker
            v-model="deformInline.startTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>-
          <el-date-picker
            v-model="deformInline.endTime"
            type="date"
            placeholder="选择日期"
            @change="selectTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业基地：">
          <el-select v-model="baseSelectShowList2" placeholder="请选择" multiple collapse-tags clearable @clear="baseClear2()" @remove-tag="baseRemove2()">
            <el-option disabled class="baseOption" value>
              <el-tree
                :props="baseProps"
                :data="baseList"
                show-checkbox
                ref="baseTree2"
                check-strictly
                node-key="id"
                check-on-click-node
                @check-change="baseSelect2"
                class="hosWithNoCheckBox"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室：">
          <el-select v-model="deptSelectShowList2" placeholder="请选择" multiple collapse-tags clearable @clear="deptClear2()" @remove-tag="deptRemove2()">
            <el-option disabled class="baseOption" value>
              <el-tree
                :props="baseProps"
                :data="deptList"
                show-checkbox
                ref="deptTree2"
                check-strictly
                node-key="id"
                check-on-click-node
                @check-change="deptSelect2"
                class="hosWithNoCheckBox"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入科状态：" v-if="activeIndex == 1">
          <el-select v-model="deformInline.status" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="已入科" value="1"></el-option>
            <el-option label="未入科" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出科状态：" v-if="activeIndex == 2">
          <el-select v-model="deformInline.status" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="已出科" value="1"></el-option>
            <el-option label="未出科" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配状态：" v-if="activeIndex == 3">
          <el-select v-model="deformInline.status" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="已分配" value="1"></el-option>
            <el-option label="未分配" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核状态：" v-if="activeIndex == 4">
          <el-select v-model="deformInline.status" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
            <el-option label="未完成" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="deformInline.searchVal" autocomplete="off" placeholder="输入姓名、学号、手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="exportData" class="button-export">导出</el-button>
      <el-table :data="deTableData" border :key="tabIndex">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="stutName" label="护培生" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="personalDetail(scope.$index, scope.row)"
            >{{scope.row.stutName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="stuNumber" label="学号" width="120"></el-table-column>
        <el-table-column prop="moblie" label="手机号" v-if="activeIndex != 3" width="150"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="basename" label="专业基地" width="150"></el-table-column>
        <el-table-column prop="deptname" label="轮转科室" width="150"></el-table-column>
        <el-table-column prop="secretary" label="科秘书" v-if="activeIndex != 3" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="employeeDetail(scope.$index, item)"
              v-for="item in scope.row.secretary"
            >{{item.name}},</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="带教老师" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="employeeDetail(scope.$index, scope.row)"
            >{{scope.row.teacherName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="计划轮转时间" width="220">
          <template slot-scope="scope">
            <p>{{scope.row.beginTime}}至{{scope.row.endTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="skillScore" label="出科技能考核" v-if="activeIndex == 4" width="120">
          <template slot-scope="scope">
            <span
              v-if="scope.row.skillScore == '——' || scope.row.skillScore == ''|| scope.row.skillScore === null"
            >{{scope.row.skillScore}}</span>
            <span
              v-else
              :class="Number(scope.row.skillScore) - Number(scope.row.skillScoreConf) >= 0 ? 'greenScore' : 'redPoiont'"
            >{{scope.row.skillScore}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="theoryScore" label="出科理论考核" v-if="activeIndex == 4" width="120">
          <template slot-scope="scope">
            <span
              v-if="scope.row.theoryScore == '——' || scope.row.theoryScore == ''|| scope.row.theoryScore === null"
            >{{scope.row.theoryScore}}</span>
            <span
              v-else
              :class="Number(scope.row.theoryScore) - Number(scope.row.theoryScoreConf) >= 0 ? 'greenScore' : 'redPoiont'"
            >{{scope.row.theoryScore}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="compreScore" label="出科综合考核" v-if="activeIndex == 4" width="120">
          <template slot-scope="scope">
            <span
              v-if="scope.row.compreScore == '——' || scope.row.compreScore == ''|| scope.row.compreScore === null"
            >{{scope.row.compreScore}}</span>
            <span
              v-else
              :class="Number(scope.row.compreScore) - Number(scope.row.compreScoreConf) >= 0 ? 'greenScore' : 'redPoiont'"
            >{{scope.row.compreScore}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="出科状态" v-if="activeIndex == 2"></el-table-column>
        <el-table-column prop="status" label="考核状态" v-if="activeIndex == 4"></el-table-column>
        <el-table-column
          prop="teacher_begin_time"
          label="带教开始时间"
          width="150"
          v-if="activeIndex == 3"
        ></el-table-column>
        <el-table-column prop="teacher_end_time" label="带教结束时间" width="150" v-if="activeIndex == 3"></el-table-column>
        <el-table-column prop="status" label="分配状态" width="150" v-if="activeIndex == 3"></el-table-column>
        <el-table-column prop="status" label="入科状态" v-if="activeIndex == 1"></el-table-column>
        <el-table-column prop="rukeTime" label="入科时间" v-if="activeIndex == 1"></el-table-column>
        <el-table-column prop="chukeTime" label="出科时间" v-if="activeIndex == 2"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="deHandleSizeChange"
        @current-change="deHandleCurrentChange"
        :current-page="decurrentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="dePageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="deTotal"
      ></el-pagination>
    </div>
    <!-- 个人档案 -->
    <student-personal-Info :studentDetailId=String(studentDetailId) :dialogRecords.sync="dialogRecords"></student-personal-Info>
    <!-- 职工信息 -->
    <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId=String(currentDataId)></employee-info>
  </div>
</template>
<script>
import employeeInfo from "./employeeInfo.vue";
import studentPersonalInfo from "./studentPersonalInfo.vue";
import moment from "moment";
import { post, getCookie, exportExcel } from "../config/util";
import hospitalBaseDept from "./hospitalBaseDept";
export default {
  props: {
    activeIndex: {
      type: String,
      default: "1"
    }
  },
  components: {
    studentPersonalInfo,
    employeeInfo,
    hospitalBaseDept
  },
  watch: {
    baseTableData(newVal, oldVal) {
      newVal.forEach(i => {
        if(!i.id) {
          i.id =  Number(i.baseId)
          i.name = i.baseName
        }
      })
      console.log(this.baseTableData)
    },
    deptTableData(newVal, oldVal) {
      newVal.forEach(i => {
        if(!i.id) {
          i.id =  Number(i.deptId)
          i.name = i.deptName
        }
      })
      console.log(this.deptTableData)
    }
  },
  data() {
    return {
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
      multiDept: true,
      rightNowClear: 0,
      multiBase: true,
      hasDept: false,
      alldeptList: [],
      baseidList: [],
      newdeptList: [],
      newroomList: [],
      baseList: [],
      baseSelectList: [],
      baseSelectShowList: [],
      deptList: [],
      deptSelectList: [],
      deptSelectShowList: [],
      baseList2: [],
      baseSelectList2: [],
      baseSelectShowList2: [],
      deptList2: [],
      deptSelectList2: [],
      deptSelectShowList2: [],
      introTips: [
        [
          "入科进度统计说明：",
          "应入科：指所有轮转开始时间在查询时间内的学员数,若同一个学员有多个轮转记录，重复计数",
          "已入科：指所有轮转开始时间在查询时间内且当前轮转状态为轮转中和已出科的学员数",
          "未入科：指所有轮转开始时间在查询时间内且当前轮状状态为未轮转、待入科的学员数",
          "应入科=已入科+未入科",
          "进度%=已入科/应入科"
        ],
        [
          "出科进度统计说明：",
          "应出科：指所有轮转结束时间在查询时间内的学员数,若同一个学员有多个轮转记录，重复计数",
          "已出科：指所有轮转结束时间在查询时间内且当前轮转状态为已轮转的学员数",
          "未出科：指所有轮转结束时间在查询时间内且当前轮状状态为未轮转、待入科、轮转中的学员数",
          "应出科=已出科+未出科",
          "进度%=已出科/应出科"
        ],
        [
          "带教分配统计说明：",
          "轮转总人数：指轮转起止日期与查询时间范围有重叠的学员数",
          "已分配带教：指轮转起止日期与查询时间范围有重叠且在该科室已指定带教的学员数",
          "未分配带教：指轮转起止日期与查询时间范围有重叠且在该科室未指定带教的学员数",
          "轮转总人数=已分配带教+未分配带教",
          "进度%=已分配带教/轮转总人数"
        ],
        [
          "出科考核统计说明：",
          "应考核：指轮转起止日期与查询时间范围有重叠且出科报名审核通过的学员数",
          "已完成：指轮转起止日期与查询时间范围有重叠且出科考核已全部完成的学员数",
          "未完成：指轮转起止日期与查询时间范围有重叠且出科考核未全部完成的学员数",
          "应考核=已完成+未完成",
          "进度%=已完成/应完成"
        ]
      ],
      typeName: ["应入科", "已入科", "未入科"],
      typeValue: ["RKCount", "hasRKreportCount", "NotRKreportCount"],
      currentDataId: 160604,
      dialogEmployee: false,
      studentDetailId: 159723,
      dialogRecords: false,
      tabIndex: 0,
      decurrentPage: 1,
      dePageSize: 10,
      deTotal: 2,
      bscurrentPage: 1,
      bsPageSize: 10,
      baTotal: 2,
      deptcurrentPage: 1,
      deptPageSize: 10,
      deptTotal: 2,
      formInline: {
        hospitalId: "",
        startTime: "",
        endTime: "",
        region: []
      },
      ksformInline: {
        hospitalId: "",
        baseId: [],
        startTime: "",
        endTime: "",
        dept: []
      },
      deformInline: {
        hospitalId: "",
        startTime: "",
        endTime: "",
        region: [],
        searchVal: "",
        dept: [],
        status: "0"
      },
      baseTableData: [],
      deptTableData: [],
      deTableData: [],
      hosDeptTree: [],
      defaultProps: {
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
      hosDeptName: "",
      hosBaseTree: [],
      hosBaseName: [],
      hosBaseId: []
    };
  },
  created() {
    if (this.activeIndex == 1) {
      this.typeName = ["应入科", "已入科", "未入科"];
      this.typeValue = ["RKCount", "hasRKreportCount", "NotRKreportCount"];
    } else if (this.activeIndex == 2) {
      this.typeName = ["应出科", "已出科", "未出科"];
      this.typeValue = ["CKCount", "hasCKreportCount", "NotCKreportCount"];
    } else if (this.activeIndex == 3) {
      this.typeName = ["轮转总人数", "已分配带教", "未分配带教"];
      this.typeValue = ["TeacherCount", "hasTeacherCount", "NotTeacherCount"];
    } else if (this.activeIndex == 4) {
      this.typeName = ["应考核", "已完成", "未完成"];
      this.typeValue = [
        "shouldExamCount",
        "completeExamCount",
        "unfinishedExamCount"
      ];
    }
    this.formInline.startTime = moment(new Date())
      .startOf("month")
      .format("YYYY-MM-DD");
    this.formInline.endTime = moment(new Date())
      .endOf("month")
      .format("YYYY-MM-DD");
    this.deformInline.startTime = this.formInline.startTime;
    this.deformInline.endTime = this.formInline.endTime;
    this.ksformInline.startTime = this.formInline.startTime;
    this.ksformInline.endTime = this.formInline.endTime;
    this.getbaseidList();
    this.getTableData();
    this.getMyBaseTree();
    this.getMyDeptTree()
  },
  methods: {
    getMyBaseTree() {
      let self = this
      post("/base/dept/getHosBaseTree", {}).then(res => {
        if (res.resCode == 200) {
          self.baseList = res.model;
        }
      });
    },
    baseSelect() {
      let baseSelectList = this.$refs.baseTree.getCheckedNodes()
      let newArr = []
      let newArr2 = []
      baseSelectList.forEach(i => {
        newArr.push({
          name: i.name,
          id: i.id
        })
        newArr2.push(i.name)
      })
      this.baseSelectList = newArr
      this.baseSelectShowList = newArr2
    },
    baseClear() {
      this.baseSelectList = []
      this.baseSelectShowList = []
      this.$refs.baseTree.setCheckedNodes([])
    },
    baseRemove() {
      this.baseSelectList.shift()
      let arr = this.baseSelectList.map(i => i.id)
      this.$refs.baseTree.setCheckedKeys(arr)
    },
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
    baseSelect2() {
      let baseSelectList = this.$refs.baseTree2.getCheckedNodes()
      let newArr = []
      let newArr2 = []
      baseSelectList.forEach(i => {
        newArr.push({
          name: i.name,
          id: i.id
        })
        newArr2.push(i.name)
      })
      this.baseSelectList2 = newArr
      this.baseSelectShowList2 = newArr2
    },
    baseClear2() {
      this.baseSelectList2 = []
      this.baseSelectShowList2 = []
      this.$refs.baseTree2.setCheckedNodes([])
    },
    baseRemove2() {
      this.baseSelectList2.shift()
      let arr = this.baseSelectList2.map(i => i.id)
      this.$refs.baseTree2.setCheckedKeys(arr)
    },
    deptSelect2() {
      let deptSelectList = this.$refs.deptTree2.getCheckedNodes()
      let newArr = []
      let newArr2 = []
      deptSelectList.forEach(i => {
        newArr.push({
          name: i.name,
          id: i.id
        })
        newArr2.push(i.name)
      })
      this.deptSelectList2 = newArr
      this.deptSelectShowList2 = newArr2
    },
    deptClear2() {
      this.deptSelectList2 = []
      this.deptSelectShowList2 = []
      this.$refs.deptTree2.setCheckedNodes([])
    },
    deptRemove2() {
      this.deptSelectList2.shift()
      let arr = this.deptSelectList2.map(i => i.id)
      this.$refs.deptTree2.setCheckedKeys(arr)
    },
    checkChange(data, checked, node) {
      if (checked) {
        this.hosBaseName.push(data.name);
        this.hosBaseId.push(data.id);
      } else {
        this.hosBaseName = [
          ...this.hosBaseName.slice(0, this.hosBaseName.indexOf(data.name)),
          ...this.hosBaseName.slice(this.hosBaseName.indexOf(data.name) + 1)
        ];
        this.hosBaseId = [
          ...this.hosBaseId.slice(0, this.hosBaseId.indexOf(data.id)),
          ...this.hosBaseId.slice(this.hosBaseId.indexOf(data.id) + 1)
        ];
      }
    },
    clearall() {
      this.$refs.tree.setCheckedKeys([]);
      this.hosBaseName = [];
      this.hosBaseId = [];
    },
    setksQueryFormOne(form) {
      this.ksformInline.hospitalId = form.hospitalId;
      this.ksformInline.baseId = form.baseId;
      this.ksformInline.dept = form.deptIdList;
    },
    setQueryFormOne(form) {
      this.formInline.hospitalId = form.hospitalId;
      this.formInline.region = form.baseId;
    },
    setdeQueryFormOne(form) {
      this.deformInline.hospitalId = form.hospitalId;
      this.deformInline.region = form.baseId;
      this.deformInline.dept = form.deptIdList;
    },
    exportData() {
      delete this.currentPrarms.reqnum;
      delete this.currentPrarms.page;
      let temp = JSON.parse(JSON.stringify(this.currentPrarms));
      if (this.tabIndex == 2 && this.activeIndex == 4) {
        temp.isExcelResult = 1;
      }
      let data = {
        ...temp
      };
      exportExcel(data);
    },
    changeTab(val) {
      if (val == 0) {
        this.baseTableData = [];
        this.bscurrentPage = 1;
        this.bsPageSize = 10;
      }
      if (val == 1) {
        this.deptTableData = [];
        this.deptcurrentPage = 1;
        this.deptPageSize = 10;
      }
      if (val == 2) {
        this.deTableData = [];
        this.decurrentPage = 1;
        this.dePageSize = 10;
      }
      // this.onReset(val)

      this.getTableData();
    },
    forMatParams() {
      let url = "";
      let params = {
        sessionid: getCookie("sid"),
        loginid: getCookie("uid")
      };
      if (this.tabIndex == 0) {
        // 按基地
        let baseid = this.baseSelectList.map(i => i.id)
        params = {
          // hospitalId: this.formInline.hospitalId,
          // baseid: JSON.stringify(this.formInline.region),
          baseid: JSON.stringify(baseid),
          starttime: this.formInline.startTime,
          endtime: this.formInline.endTime,
          reqnum: this.bsPageSize,
          page: this.bscurrentPage,
          ...params
        };
        if (this.activeIndex == 1) {
          // 入科
          url = "statistal/report/queryRKreportByBaseid";
        }
        if (this.activeIndex == 2) {
          // 出科
          url = "statistal/report/queryCKreportByBaseid";
        }
        if (this.activeIndex == 3) {
          // 出科
          url = "statistal/report/queryTeacherReportByBaseid";
        }
        if (this.activeIndex == 4) {
          // 出科
          url = "statistal/report/queryTurnOutExamByBaseReport";
        }
        params = {
          command: url,
          ...params
        };
      }
      if (this.tabIndex == 1) {
        // 按科室
        let deptid = this.deptSelectList.map(i => i.id)
        params = {
          // hospitalId: this.ksformInline.hospitalId,
          // baseid: JSON.stringify(this.ksformInline.baseId),
          deptid: JSON.stringify(deptid),
          starttime: this.ksformInline.startTime,
          endtime: this.ksformInline.endTime,
          reqnum: this.deptPageSize,
          page: this.deptcurrentPage,
          ...params
        };
        if (this.activeIndex == 1) {
          // 入科
          url = "statistal/report/queryRKreportByDeptid";
        }
        if (this.activeIndex == 2) {
          // 出科
          url = "statistal/report/queryCKreportByDeptid";
        }
        if (this.activeIndex == 3) {
          // 出科
          url = "statistal/report/queryTeacherReportByDeptid";
        }
        if (this.activeIndex == 4) {
          url = "statistal/report/queryTurnOutExamByDeptReport";
        }
        params = {
          command: url,
          ...params
        };
      }
      if (this.tabIndex == 2) {
        let baseid = this.baseSelectList2.map(i => i.id)
        let deptid = this.deptSelectList2.map(i => i.id)
        // 明细
        params = {
          // hospitalId: this.deformInline.hospitalId,
          // baseid: JSON.stringify(this.deformInline.region),
          // deptid: JSON.stringify(this.deformInline.dept),
          baseid: JSON.stringify(baseid),
          deptid: JSON.stringify(deptid),
          starttime: this.deformInline.startTime,
          endtime: this.deformInline.endTime,
          reqnum: this.dePageSize,
          page: this.decurrentPage,
          search: this.deformInline.searchVal,
          status: this.deformInline.status,
          ...params
        };
        if (this.activeIndex == 1) {
          // 入科
          url = "statistal/report/queryRKreport";
        }
        if (this.activeIndex == 2) {
          // 出科
          url = "statistal/report/queryCKreport";
        }
        if (this.activeIndex == 3) {
          // 出科
          url = "statistal/report/queryTeacherReport";
        }
        if (this.activeIndex == 4) {
          // 出科
          url = "statistal/report/queryTurnOutExamDetailReport";
        }
        params = {
          command: url,
          ...params
        };
      }
      return {
        url,
        params
      };
    },
    getTableData() {
      let { url, params } = this.forMatParams();
      this.currentPrarms = params;
      post("/" + url, params)
        .then(data => {
          if (data && data.errcode == 0) {
            if (
              url.indexOf("reportByBaseid") > -1 ||
              url.indexOf("ReportByBaseid") > -1 ||
              url.indexOf("queryTurnOutExamByBaseReport") > -1
            ) {
              // if (baseTableData.length == 0) {
              this.baseTableData =
                url.indexOf("queryTurnOutExamByBaseReport") > -1
                  ? data.list
                  : data.base_list;
              this.baTotal =
                url.indexOf("queryTurnOutExamByBaseReport") > -1
                  ? data.totalcount
                  : data.count; 
            } else if (
              url.indexOf("reportByDeptid") > -1 ||
              url.indexOf("ReportByDeptid") > -1 ||
              url.indexOf("TurnOutExamByDeptReport") > -1
            ) {
              // if (this.deptTableData.length == 0) {
              this.deptTableData =
                url.indexOf("TurnOutExamByDeptReport") > -1
                  ? data.list
                  : data.dept_list;
              this.deptTotal =
                url.indexOf("TurnOutExamByDeptReport") > -1
                  ? data.totalcount
                  : data.count;
              // }
            } else if (
              url.indexOf("queryCKreport") > -1 ||
              url.indexOf("queryRKreport") > -1 ||
              url.indexOf("queryTeacherReport") > -1 ||
              url.indexOf("queryTurnOutExamDetailReport") > -1
            ) {
              this.deTableData =
                url.indexOf("queryTurnOutExamDetailReport") > -1
                  ? data.list
                  : data.report;
              this.deTotal =
                url.indexOf("queryTurnOutExamDetailReport") > -1
                  ? data.totalcount
                  : data.count;
            }
          }
        })
        .catch(function(error) {});
    },
    // 获取所有的科室
    newbasechange(val) {
      if (val.length == 0) {
        this.newdeptList = this.alldeptList;
        return false;
      }
      this.newdeptList = [];
      this.newroomList.forEach(item => {
        val.forEach(citem => {
          if (citem == item.id) {
            this.newdeptList = this.newdeptList.concat(item.childlist);
            item.childlist.forEach(item1 => {
              this.newdeptList = this.newdeptList.concat(item1.childlist);
            });
          }
        });
      });
    },
    getbaseidList() {
      let self = this;
      post("/turnbaseinfo/getusermanagerdepttree", {
        command: "turnbaseinfo/getusermanagerdepttree",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        uid: getCookie("uid")
      })
        .then(function(data) {
          if (data && data.errcode == 0) {
            self.newroomList = data.depttree.childlist;
            data.depttree.childlist.map(function(item, index) {
              self.baseidList.push(item);
              self.alldeptList = self.alldeptList.concat(item.childlist);
              item.childlist.forEach(item1 => {
                self.alldeptList = self.alldeptList.concat(item1.childlist);
              });
            });
            self.newdeptList = self.alldeptList;
          }
        })
        .catch(function(error) {});
    },
    selectTime() {
      let currentKey =
        this.tabIndex == 0
          ? "formInline"
          : this.tabIndex == 1
          ? "ksformInline"
          : "deformInline";
      if (this[currentKey]["endTime"] && this[currentKey]["startTime"]) {
        let tempEnd = new Date(this[currentKey]["endTime"]).getTime();
        let startTime = new Date(this[currentKey]["startTime"]).getTime();
        if (startTime - tempEnd > 0) {
          this.$message({
            message: "统计开始时间不能大于结束时间！",
            type: "warning"
          });
          this[currentKey]["endTime"] = "";
        }
      }
    },
    // 搜索
    onSearch() {
      this.getTableData();
    },
    // 重置
    onReset(type) {
      let flag = type || this.tabIndex;
      let start = moment(new Date())
        .startOf("month")
        .format("YYYY-MM-DD");
      let end = moment(new Date())
        .endOf("month")
        .format("YYYY-MM-DD");
      this.rightNowClear = this.rightNowClear + 1;
      if (flag == -1) {
        this.formInline = {
          startTime: start,
          endTime: end,
          region: [],
          hospitalId: ""
        };
        this.ksformInline = {
          startTime: start,
          endTime: end,
          dept: []
        };
        this.deformInline = {
          startTime: start,
          endTime: end,
          region: [],
          dept: [],
          status: "0",
          searchVal: ""
        };
        return;
      }
      if (flag == 0) {
        this.formInline = {
          startTime: start,
          endTime: end,
          region: [],
          hospitalId: []
        };
        this.rightNowClear = this.rightNowClear + 1;
      }
      if (flag == 1) {
        this.ksformInline = {
          startTime: start,
          endTime: end,
          dept: []
        };
      }
      if (flag == 2) {
        this.deformInline = {
          startTime: start,
          endTime: end,
          region: [],
          dept: [],
          status: "0",
          searchVal: ""
        };
      }
    },
    // 导出
    exportExcel() {},
    bsHandleCurrentChange(val) {
      this.bscurrentPage = val;
      this.getTableData();
    },
    bsHandleSizeChange(val) {
      this.bsPageSize = val;
      this.getTableData();
    },
    deptHandleCurrentChange(val) {
      this.deptcurrentPage = val;
      this.getTableData();
    },
    deptHandleSizeChange(val) {
      this.deptPageSize = val;
      this.getTableData();
    },
    deHandleCurrentChange(val) {
      this.decurrentPage = val;
      this.getTableData();
    },
    deHandleSizeChange(val) {
      this.dePageSize = val;
      this.getTableData();
    },
    linkDetail(type, row) {
      let oritabIndex = this.tabIndex
      if (this.tabIndex == 0) {
        this.onReset(2);
        this.deformInline.region =
          this.activeIndex == 4 ? [Number(row.baseId)] : [row.id];
        this.deformInline.status = String(type);
        this.deformInline.startTime = this.formInline.startTime;
        this.deformInline.endTime = this.formInline.endTime;
      } else if (this.tabIndex == 1) {
        this.onReset(2);
        this.deformInline.dept =
          this.activeIndex == 4 ? [Number(row.deptId)] : [row.id];
        this.deformInline.status = String(type);
        this.deformInline.startTime = this.ksformInline.startTime;
        this.deformInline.endTime = this.ksformInline.endTime;
      }
      this.tabIndex = 2;
      setTimeout(() => {
        if(oritabIndex == 0) {
        this.baseSelectList2 = [{name:row.name,id:row.id}]
        this.baseSelectShowList2 = [row.name]
        this.$refs.baseTree2.setCheckedKeys([row.id])
        this.deptSelectList2 = []
        this.deptSelectShowList2 = []
        this.$refs.deptTree2.setCheckedKeys([])
      }else if(oritabIndex == 1) {
        this.deptSelectList2 = [{name:row.name,id:row.id}]
        this.deptSelectShowList2 = [row.name]
        this.$refs.deptTree2.setCheckedKeys([row.id])
        this.baseSelectList2 = []
        this.baseSelectShowList2 = []
        this.$refs.baseTree2.setCheckedKeys([])
      }
      this.changeTab(2)
      }, 500);
    },
    personalDetail(index, row) {
      this.dialogRecords = true;
      this.studentDetailId = row.studentid;
    },
    employeeDetail(index, row) {
      this.dialogEmployee = true;
      this.currentDataId = row.teacherid;
    },
    

  }
};
</script>
<style lang="scss">
.statisticalTable .self-tabs {
  border: none;
  box-shadow: none !important;
}

.statisticalTable .el-pagination {
  text-align: right;
  margin-top: 20px;
}

.exportOprate .content-text {
  line-height: 33px;
}

.statisticalTable .el-date-editor {
  width: 135px;
}
/* .hos-base-tree  .el-tree-node  .el-tree-node__content .el-checkbox {
  display: none;
} */
// .statisticalTable .el-tag__close {
//   display: none !important;
// }
.baseOption {
  min-height: 200px;
  overflow: auto;
  cursor: default; 
} 
.hosWithNoCheckBox {
  .el-tree-node__content {
    .el-checkbox__input {
    display: none;
    }
  }
  .el-tree-node__children {
    .el-tree-node__content {
    .el-checkbox__input {
    display: inline-block;
    }
  }
  
  } 
  .el-select-dropdown__wrap {
    ::-webkit-scrollbar {
  /* 对应纵向滚动条的宽度 */
 width: 5px;
  /* 对应横向滚动条的宽度 */
  height: 10px;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  border-radius: 32px;
} 
  }
  
}
</style>
<style scoped>
.exportOprate {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-export {
  margin-bottom: 20px;
}

.exportOprate .intro {
  margin-left: 8px;
  width: fit-content;
}

.redPoiont {
  color: red;
}

.greenScore {
  color: green;
}
</style>
