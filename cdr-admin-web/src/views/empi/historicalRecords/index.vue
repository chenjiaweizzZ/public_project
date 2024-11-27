<!-- 历史记录 -->
<template>
  <div class="historicalRecords">
    <div class="content">
      <div class="operationInfo">
        <label>操作类型</label>
        <el-select v-model="operationType" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <label>操作时间</label>
        <el-date-picker
          v-model="operation"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          @change="chooseDate"
        ></el-date-picker>
        <el-button type="primary" plain class="search_btn" @click="getData()">
          <img src alt />
        </el-button>
      </div>
      <div class="dataList">
        <el-table ref="multipleTable" :data="dataList" border stripe>
          <el-table-column prop label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作类型" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.type==1?'自动合并':scope.row.type==2?'人工合并':scope.row.type==3?'拆分':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip width="220">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pid" label="PID" show-overflow-tooltip width="220">
            <template slot-scope="scope">
              <span class="detail" @click="turn(scope.row)">{{ scope.row.pid}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="操作内容">
            <template slot-scope="scope">
              <!-- <span>{{scope.row.type==3?'拆分 ':'合并 '}}</span> -->
              <span v-for="(m,index) in scope.row.log" :key="m">
                <span class="detail" @click="showDetail(m)">{{m}}</span>
                <span v-if="index!=scope.row.log.length-1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="操作人" show-overflow-tooltip width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.createBy?scope.row.createBy:'-'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          align="right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20,30,40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totalNumber"
          style="margin-top:24px;margin-bottom:30px"
        ></el-pagination>
      </div>

      <el-dialog :visible.sync="detailDialog">
        <div class="baseInfo">
          <div class="title">
            <span class="borderBlue"></span>患者基本信息
          </div>
          <div class="infoTable">
            <div class="row background">
              <span class="part">
                <label>姓名</label>
                <span class="text">{{baseInfo.name}}</span>
              </span>
              <span class="part">
                <label>性别</label>
                <span class="text">{{baseInfo.sex}}</span>
              </span>
              <span class="part">
                <label>身份证号</label>
                <span class="text">{{baseInfo.idcardNo}}</span>
              </span>
            </div>
            <div class="row">
              <span class="part">
                <label>出生日期</label>
                <span class="text">{{baseInfo.birthDate}}</span>
              </span>
              <span class="part">
                <label>联系电话</label>
                <span class="text">{{baseInfo.phoneHome}}</span>
              </span>
              <span class="part">
                <label>血型</label>
                <span class="text">{{baseInfo.bloodType}}</span>
              </span>
            </div>
            <div class="row background">
              <span class="part">
                <label>国籍</label>
                <span class="text">{{baseInfo.country}}</span>
              </span>
              <span class="part">
                <label>籍贯</label>
                <span class="text">{{baseInfo.originPlace}}{{baseInfo.originPlace1}}{{baseInfo.originPlace2}}</span>
              </span>
              <span class="part">
                <label>民族</label>
                <span class="text">{{baseInfo.nation}}</span>
              </span>
            </div>
            <div class="row">
              <span class="part">
                <label>学历</label>
                <span class="text">{{baseInfo.culturalLevel}}</span>
              </span>
              <span class="part">
                <label>职业</label>
                <span class="text">{{baseInfo.occupation}}</span>
              </span>
              <span class="part">
                <label>婚姻状况</label>
                <span class="text">{{baseInfo.maritalStatus}}</span>
              </span>
            </div>
            <div class="row background">
              <span class="part">
                <label>出生地省</label>
                <span class="text">{{baseInfo.birthPlace}}</span>
              </span>
              <span class="part">
                <label>出生地市</label>
                <span class="text">{{baseInfo.birthPlace1}}</span>
              </span>
              <span class="part">
                <label>出生地县</label>
                <span class="text">{{baseInfo.birthPlace2}}</span>
              </span>
            </div>
            <div class="row">
              <span class="part">
                <label>工作单位代码</label>
                <span class="text">{{baseInfo.unitId}}</span>
              </span>
              <span class="part">
                <label>工作单位名称</label>
                <span class="text">{{baseInfo.workUnit}}</span>
              </span>
              <span class="part">
                <label>工作单位电话</label>
                <span class="text">{{baseInfo.phoneBusiness}}</span>
              </span>
            </div>
            <div class="row background">
              <span class="part">
                <label>联系人关系</label>
                <span class="text">{{baseInfo.relationship}}</span>
              </span>
              <span class="part">
                <label>联系人姓名</label>
                <span class="text">{{baseInfo.nextKin}}</span>
              </span>
              <span class="part">
                <label>联系人电话</label>
                <span class="text">{{baseInfo.nextKinPhone}}</span>
              </span>
            </div>
            <div class="row background">
              <label>户籍地址</label>
              <span class="text">{{baseInfo.householdAddress}}</span>
            </div>
            <div class="row">
              <label>现住址</label>
              <span class="text">{{baseInfo.currAddress}}</span>
            </div>
            <div class="row background">
              <label>单位地址</label>
              <span class="text">{{baseInfo.workAddress}}</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { logList, patientInformation, splitPatientData, patientInformationById, patientInformationByPid } from '@/service/empi';
export default {
  name: 'empiHistoricalRecords',
  components: {},
  data() {
    return {
      options: [
        { label: '全部', value: null },
        { label: '人工合并', value: 2 },
        { label: '自动合并', value: 1 },
        { label: '拆分', value: 3 },
      ],
      operation: [],
      operationType: null,
      dataList: [
        // { type: '1', operator: '张三', updateTime: '2011-01-03 09:23:45', content: ['73256', '12345', '55555', '34556'], PID: '123456' },
        // { type: '1', operator: '李四', updateTime: '2011-01-03 09:23:45', content: ['73256', '12345', '55555', '34556'], PID: '123456' },
        // { type: '3', operator: '网二', updateTime: '2011-01-03 09:23:45', content: ['73256', '12345', '55555', '34556'], PID: '123456' },
        // { type: '2', operator: '', updateTime: '2011-01-03 09:23:45', content: ['73256', '12345', '55555', '34556'], PID: '123456' },
        // { type: '3', operator: '张三', updateTime: '2011-01-03 09:23:45', content: ['73256', '12345', '55555', '34556'], PID: '123456' },
      ],
      pageIndex: 1,
      pageSize: 20,
      totalNumber: 0,
      detailDialog: false,
      baseInfo: {},
    };
  },
  created() {
    this.operation = [new Date().getFullYear() + '-01-01', this.get_yyyy_MM_dd(new Date())];
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.pageIndex = val;
      this.getData();
    },
    chooseDate(val) {
      this.getData();
    },
    getData() {
      logList({
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        startTime: this.operation ? this.operation[0] : '',
        endTime: this.operation ? this.operation[1] : '',
        type: this.operationType,
      }).then((res) => {
        this.dataList = res.list;
        this.totalNumber = parseInt(res.total);
      });
    },
    showDetail(m) {
      patientInformation({
        businessId: m,
      }).then((res) => {
        if (res) {
          this.baseInfo = res;
          this.detailDialog = true;
        } else {
          this.$message({
            message: 'PID已不存在，无法找到对应患者信息',
            type: 'error',
          });
        }
      });
    },
    get_yyyy_MM_dd(date) {
      let mounth = date.getMonth() + 1;
      mounth < 10 ? (mounth = '0' + mounth) : null;
      let day = date.getDate();
      day < 10 ? (day = '0' + day) : null;
      return `${date.getFullYear()}-${mounth}-${day}`;
    },
    turn(data) {
      splitPatientData({
        pid: data.pid,
      }).then((res) => {
        if (res) {
          this.$router.push({
            name: 'separationPatient',
            query: {
              pid: data.pid,
              empi: data.pid,
            },
          });
        } else {
          patientInformationByPid({
            pid: data.pid,
          }).then((res) => {
            if (res) {
              this.$router.push({
                name: 'patientDetail',
                query: {
                  id: res.id,
                  empi: data.id,
                },
              });
            } else {
              this.$message({
                message: 'PID已不存在，无法找到对应患者信息',
                type: 'error',
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.historicalRecords {
  background: #fff;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: absolute;
  top: 30px;
  bottom: 0;
  right: 0px;
  left: 0;
  .content {
    height: 100%;
    .operationInfo {
      margin-bottom: 10px;
      color: #111111;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      label {
        color: #3b5370;
        margin-right: 10px;
        line-height: 28px;
      }
      .el-select {
        margin-right: 20px;
      }
      .el-date-editor {
        margin-right: 20px;
        .el-range-separator {
          width: 24px;
          line-height: 22px;
        }
      }
    }
    .dataList {
      position: absolute;
      top: 48px;
      right: 10px;
      bottom: 86px;
      left: 10px;
      .el-table {
        height: 100%;
        .detail {
          color: #2f80ed;
          cursor: pointer;
        }
      }
    }

    .baseInfo {
      margin-top: 10px;
      .title {
        color: #111111;
        font-size: 18px;
        .borderBlue {
          width: 4px;
          background: #0075ff;
          height: 17px;
          display: inline-block;
          margin-right: 10px;
        }
      }
      .infoTable {
        border-left: 1px solid #e6e6e6;
        border-top: 1px solid #e6e6e6;
        margin-top: 10px;
        .row {
          display: flex;
          font-size: 14px;
          line-height: 22px;
          border-bottom: 1px solid #e6e6e6;
          .part {
            width: 100%;
            display: inline-block;
            label {
              font-weight: 700;
              width: 128px;
              display: inline-block;
              height: 100%;
              vertical-align: top;
            }
            .text {
              color: #111111;
              display: inline-block;
              width: calc(100% - 128px);
              height: 100%;
            }
          }
          label {
            padding: 3px 5px;
            font-weight: 700;
            color: #666666;
            width: 128px;
            display: inline-block;
            border-right: 1px solid #e6e6e6;
          }
          .text {
            padding: 3px 5px;
            color: #111111;
            display: inline-block;
            width: calc(100% - 128px);
            border-right: 1px solid #e6e6e6;
          }
        }
        .background {
          .text {
            background: #fbfbfb;
          }
        }
      }
    }
  }
}
</style>
<style lang='scss'>
.historicalRecords {
  .el-pagination {
    .el-pagination__total {
      float: left;
    }
    .el-pagination__sizes {
      float: left;
    }
  }
  .content {
    .operationInfo {
      .el-select {
        .el-input__icon {
          line-height: 28px;
        }
      }
      .el-date-editor {
        .el-input__icon {
          line-height: 22px;
        }
        .el-range-separator {
          width: 24px;
          line-height: 22px;
        }
      }
    }
    .el-dialog__wrapper {
      .el-dialog__body {
        padding-top: 0px;
      }
    }
  }
}
</style>
