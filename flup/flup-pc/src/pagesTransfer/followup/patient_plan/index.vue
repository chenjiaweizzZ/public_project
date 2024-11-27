<template>
  <section style="position: relative" class="patient-plan">
    <!-- <FollowupRecord :id="$route.query.user_id"></FollowupRecord> -->
    <div class="patient-plan_wrapper" style="height: 89vh">
      <section class="patient-plan_aside">
        <div class="patient-plan_aside_header">
          <div>
            <el-radio-group v-model="checked1" @change="onCheck">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">已完成计划</el-radio>
              <el-radio :label="2">待执行计划</el-radio>
            </el-radio-group>
            <!-- <el-checkbox v-model="checked1" @change="onCheck">已完成计划</el-checkbox>
            <el-checkbox class="margin-left10" v-model="checked2" @change="onCheck">待执行计划</el-checkbox>-->
          </div>
          <el-select class="margin-top10 width100" placeholder="请选择随访类型" v-model="followupType" multiple @change="changeSelect">
            <el-option v-for="(item, i) in followupTypeList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <el-row class="patient-plan_aside_body">
          <div v-if="!planList.length" class="nonexistenceData">一条记录都没有</div>
          <el-menu class="view-patient-list" mode="vertical" @select="onSelect" background-color="rgba(0,0,0,0)" :default-active="activeIndex">
            <el-menu-item-group v-for="item in planList" :key="item.planNameId">
              <template slot="title">
                <el-row class="padding-right20" type="flex" align="middle" justify="space-between">
                  <el-row type="flex" align="middle">
                    <el-tooltip class="item" effect="dark" :content="item.planName" placement="top">
                      <div class="line-ellipsis menu-title">{{ item.planName }}</div>
                    </el-tooltip>
                    <div class="margin-left10 line-ellipsis" v-if="getStatus(item.flupPath) && item.isThis">已完成</div>
                    <div class="margin-left10 line-ellipsis" v-if="item.fuWay == '0'">(全院随访)</div>
                    <div class="margin-left10 line-ellipsis" v-else-if="item.fuWay == '1'">(专科随访)</div>
                    <div class="margin-left10 line-ellipsis" v-else-if="item.fuWay == '2'">(慢病随访)</div>
                  </el-row>
                  <div v-if="item.isThis" class="menu-operation">
                    <!-- <div @click="onCut(item)" class="icon_cut"></div> -->
                    <div></div>
                    <!-- <div @click="onAdd(item)" class="icon_add"></div> -->
                  </div>
                  <div v-else class="margin-left10 line-ellipsis">来源：({{ item.sourceHospitalName }})</div>
                </el-row>
              </template>
              <el-menu-item class="padding-right10" v-for="jtem in item.flupPath" :key="jtem.serialNo" :index="jtem.serialNo" @click="changePath(item)">
                <el-row class="menu-item" type="flex" align="middle">
                  <div class="width80px margin-right10">
                    <el-date-picker
                      class="date-edit"
                      v-if="jtem.isModify"
                      prefix-icon="none"
                      :picker-options="pickerOptions"
                      v-model="jtem.adjustStartTime"
                      size="mini"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      :editable="false"
                    ></el-date-picker>
                    <div v-else>{{ $utils.formatDate(jtem.flupStartTime) }}</div>
                  </div>
                  <div>{{ jtem.flupType }}</div>
                  <div class="margin-left10">{{ jtem.status }}</div>
                  <div class="mark-state" :style="getStatusStyle(jtem.status)"></div>
                  <i v-if="jtem.status !== '待执行'" class="el-icon-arrow-right margin-left28"></i>
                  <template v-else-if="jtem.isModify">
                    <i class="el-icon-check" @click.stop="operationModify(true, jtem)"></i>
                    <i class="el-icon-close" @click.stop="operationModify(false, jtem)"></i>
                  </template>
                  <i v-else class="el-icon-edit-outline margin-left28" @click.stop="modifyDate(jtem)"></i>
                  <div v-if="jtem.flupType != '慢病评估报告' && item.over !== true" @click="onAdd(item, jtem)" class="icon_add"></div>
                  <div title="作废" @click="onCancel(item, jtem)" v-if="jtem.status != '已作废' && item.over !== true" class="icon_cancel"></div>
                </el-row>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-row>
      </section>

      <el-row class="patient-plan_main" style="height: 89vh">
        <FollowupContentHeader :item="headerItem"></FollowupContentHeader>
        <el-row class="padding20" type="flex">
          <el-col>
            随访电话
            <el-input class="width130px margin-left10" :disabled="true" :maxlength="11" v-model="currentItem.flupPhone" clearable></el-input>
          </el-col>
          <el-col>
            随访状态
            <el-select :disabled="true" class="width130px margin-left10" v-model="currentItem.flupState" placeholder="请选择随访结果">
              <el-option v-for="(item, i) in followupResultList" :key="i" :label="item.dict_name" :value="item.dict_code"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="padding: 0px 20px 20px 20px" type="flex" v-if="currentItem.flupType == '定期复诊' || currentItem.flupType == '定期检查' || currentItem.flupType == '定期检验'">
          <el-col>
            预约时间
            <el-input class="width130px margin-left10" :disabled="true" :maxlength="11" v-model="currentItem.appointmentTime" clearable></el-input>
          </el-col>
          <el-col>
            备注信息
            <el-input class="width130px margin-left10" :disabled="true" :maxlength="11" v-model="currentItem.remark2" clearable></el-input>
          </el-col>
        </el-row>
        <el-row
          class="padding-top20 padding-bottom10 border-bottom1"
          v-if="(currentItem.flupType == '慢病评估报告' || currentItem.flupType == '定期检查' || currentItem.flupType == '定期检验') && currentItem.authState == 30"
        >
          <el-col :span="12" style="padding-top: 9px">
            随访结果
            <span style="color: #999">(已作废)</span>
          </el-col>
        </el-row>
        <div class="patient-plan_main_content">
          <FollowupContent v-if="followupContentft" class="margin-top20" :currentItem="currentItem"></FollowupContent>
        </div>
      </el-row>
      <el-row v-show="!huanzheVisible" class="footer" type="flex" align="middle" justify="end">
        <el-button @click="back" size="small">返回患者列表</el-button>
      </el-row>
    </div>
    <FollowupRecord :patient-info="patientInfo"></FollowupRecord>
    <component v-if="dialogVisible" :is="dialogComponent" :show.sync="dialogVisible" v-bind="dialogData"></component>
  </section>
</template>

<script>
import NewTask from './newTask';
import CutPlan from './cutPlan'; //随访计划切换页面
import SideBarPatient from './sideBarPatient';
import FollowupContent from '@/components/followup_content';
import FollowupRecord from '@/pagesTransfer/components/followup_record';
export default {
  name: 'patient-plan',
  data() {
    return {
      followupContentft: true,
      currentItem: {},
      dialogData: null,
      dialogVisible: false,
      dialogComponent: '',
      planList: [],
      checked1: 0,
      checked2: true,
      state: 0,
      completed: 0,
      activeIndex: '',
      // checkList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      followupResultList: [],
      followupType: [],
      followupTypeList: [],
      patientInfo: {},
    };
  },
  components: {
    NewTask,
    SideBarPatient,
    FollowupContent,
    CutPlan,
    FollowupRecord,
  },
  props: {
    huanzheVisible: Boolean,
    data: Array,
    serialNo: String,
  },
  mounted: {},
  computed: {
    headerItem() {
      return {
        type: this.currentItem.flupType || '',
        content: this.$utils.formatFollowupContent(this.currentItem),
        startTime: this.$utils.formatDate(this.currentItem.flupStartTime || null),
        completeTime: this.$utils.formatDate(this.currentItem.flupTimeReal || null),
      };
    },
  },
  async created() {
    let serialNo = this.serialNo || this.$route.query.serialNo;
    if (this.$route.query.flupType) {
      this.followupType.push(this.$route.query.flupType);
    }
    if (serialNo) {
      this.onSelect(serialNo);
    }
    this.$startLoading();
    this.patientInfo = {
      userId: this.$route.query.user_id || this.$route.query.userId,
      serialNo: serialNo,
      joinPlanPatientType: this.$route.query.joinPlanPatientType,
      recordSerialNo: this.$route.query.recordSerialNo,
    };
    this.$apis
      .BaseDictGetDictItems({
        parentId: '20170912160321211c4f',
      })
      .then((res) => {
        this.followupResultList = res;
      });
    await this.$apis.queryFollowTypeList(JSON.parse(sessionStorage.getItem('global')).hospital_id).then((res) => {
      this.followupTypeList = res.list.filter((item) => {
        return item.enable != 0;
      });
    });
    await this.getList(serialNo);
    this.$stopLoading();
  },
  methods: {
    changeSelect(v) {
      this.getList();
    },
    getStatusStyle(item) {
      let style = { 'background-color': 'grey' };
      switch (item) {
        case '已完成':
          style['background-color'] = '#58B957';
          break;
        case '待执行':
          style['background-color'] = '#F6A810';
          break;
        case '执行中':
          style['background-color'] = '#539CDB';
          break;
      }
      return style;
    },
    getStatus(arr) {
      let ret = true;
      if (arr.length == 0) {
        ret = false;
      }
      arr.forEach((element) => {
        if (element.status != '已完成') {
          ret = false;
        }
      });
      return ret;
    },
    back() {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: decodeURIComponent(urlx + `/#/newpatientlistV2`),
          title: '患者就诊信息管理',
        }),
        '*'
      );
      // let url = decodeURIComponent(this.$route.query.opener);
      // window.parent.postMessage(
      //   JSON.stringify({
      //     method: "addTab",
      //     url: url.replace(/\?(stamp=)([^#]*)/, ""),
      //     title: "患者列表",
      //   }),
      //   "*"
      // );
    },
    onAdd(item, jtem) {
      // console.log(item, jtem, '2222222222222222');
      this.dialogVisible = true;
      this.dialogComponent = this.$options.components.NewTask;
      this.dialogData = {
        flupPlan: item.planName,
        planNameId: item.planNameId,
        fuRuleId: item.fuRuleId,
        fuWay: item.fuWay,
        oldTaskSerialNo: jtem.serialNo,
      };
    },
    onCancel(item, jtem) {
      this.$confirm('确定要将该随访任务作废吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.cancel(jtem.serialNo)
        }).catch(() => {       
        });
    },
    onCut(item) {
      this.dialogVisible = true;
      this.dialogComponent = this.$options.components.CutPlan;
      this.dialogData = {
        serialNo: item.planNameId,
      };
    },
    onSelect(i) {
      console.log(i);
      this.followupContentft = false;
      let obj;
      this.planList.forEach((item) => {
        let o = item.flupPath.find((jitem) => {
          return jitem.serialNo === i;
        });
        obj = obj || o;
      });
      if (obj) {
        this.currentItem = obj;
        // console.log('currentItem', this.currentItem);
        this.currentItem.flupState = this.currentItem.flupState.toString();
        this.activeIndex = i;
      }
      this.$nextTick(() => {
        this.followupContentft = true;
      });
    },
    async onCheck() {
      if (this.checked1 == 0) {
        this.completed = 0;
        this.state = 0;
      } else if (this.checked1 == 1) {
        this.state = 1;
        this.completed = 0;
      } else if (this.checked1 == 2) {
        this.state = 0;
        this.completed = 1;
      }

      // if (this.checked1) {
      //   this.state = 1
      // } else {
      //   this.state = 0
      // }
      // if (this.checked2) {
      //   this.completed = 1
      // } else {
      //   this.completed = 0
      // }
      await this.getList();
    },
    getList(val = '') {
      return this.$apis
        .getFollowupPlanByPatientNew({
          userId: this.$route.query.user_id || this.$route.query.userId || '',
          state: this.state,
          complete: this.completed,
          flupType: this.followupType.join(','),
        })
        .then((res) => {
          if (res && res.length) {
            this.planList = res;
            this.planList.forEach((element) => {
              if (element.flupPath.length > 0) {
                element.flupPath.forEach((jelement) => {
                  this.$set(jelement, 'isModify', false);
                  this.$set(jelement, 'icon', 'el-icon-edit-outline');
                  this.$set(jelement, 'adjustStartTime', jelement.flupStartTime);
                });
              }
            });
            this.activeIndex = val;
            if (this.planList.length) {
              if (!this.activeIndex) {
                let i = this.planList.findIndex((element) => {
                  return element.flupPath.length > 0;
                });
                this.activeIndex = this.$route.query.anchorPoint ? this.$route.query.anchorPoint : this.planList[i].flupPath[0].serialNo;
              }
              this.onSelect(this.activeIndex);
            }
          } else {
            this.planList = [];
          }
        });
    },
    modifyDate(item) {
      item.timeSpan = this.$utils.dateSpan(item.flupEndTime, item.flupStartTime);
      item.isModify = !item.isModify;
      if (item.icon === 'el-icon-check') {
        item.icon = 'el-icon-edit-outline';
      } else {
        item.icon = 'el-icon-check';
      }
    },
    operationModify(isConfirm, item) {
      if (isConfirm) {
        item.flupStartTime = item.adjustStartTime;
        item.flupEndTime = this.$utils.addDate(item.flupStartTime, item.timeSpan);
        delete item.timeSpan;
        this.$apis.updateFuFlupPatientPlan({ ...item }).then(() => {
          item.isModify = false;
        });
      } else {
        item.adjustStartTime = item.flupStartTime;
        item.isModify = false;
      }
    },
    cancel(serialNo) {
      this.$apis.deleteFuFlupPatientPlan(serialNo).then(() => {
          this.getList()
      });
    },
    changePath(path) {
      let modifyPath = path.flupPath.filter((x) => x.isModify);
      // if (modifyPath.length > 0) {
      //   this.$nextTick(() => {
      //     modifyPath[0].isModify = false
      //   })
      // }
    },
  },
};
</script>

<style lang="scss">
.patient-plan {
  position: relative;
  // margin: 20px;
  margin-left: 0;
  // margin-bottom: 86px;
  margin-bottom: 0px;
  .icon_cut {
    height: 18px;
    width: 18px;
    background-image: url('~@/assets/images/cut.png');
    cursor: pointer;
  }
  .icon_add {
    height: 18px;
    width: 18px;
    background-image: url('~@/assets/images/add.png');
    cursor: pointer;
    margin-right: 10px;
  }
  .icon_cancel {
    height: 18px;
    width: 18px;
    background-image: url('~@/assets/images/cancel.png');
    background-size: cover;
    cursor: pointer;
  }
  .menu-operation {
    height: 32px;
    width: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &_wrapper {
    position: relative;
    height: 94vh;
    display: flex;
  }
  &_aside {
    width: 370px;
    display: flex;
    flex-direction: column;
  }
  &_aside_header {
    background: #fbfbfb;
    padding: 16px 20px;
  }
  &_aside_body {
    background: #fff;
    overflow: auto;
    flex: 1;
    border: 1px solid #e6e6e6;
    padding-bottom: 16px;
    .el-menu {
      border: 0;
    }
    .menu-title {
      max-width: 100px;
      font-size: 14px;
      font-weight: bold;
      color: #425b77;
    }
    .menu-item {
      height: 40px;
      border-bottom: 1px solid #e6e6e6;
    }
    .el-menu-item-group__title {
      border-bottom: 1px solid #e6e6e6;
    }
    .date-edit {
      width: 100%;
      .el-input__inner {
        padding: 0 5px;
      }
    }
    .mark-state {
      width: 5px;
      height: 5px;
      border-radius: 10px;
      background-color: #769ac1;
      opacity: 0.5;
      margin: 0 5px 0 10px;
    }
  }
  &_main {
    flex: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
  &_main_content {
    flex: 1;
    overflow: auto;
  }
}
</style>
