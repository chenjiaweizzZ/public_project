<!-- 拆分患者 -->
<template>
  <div class="separationPatient">
    <div class="content">
      <div class="teamInfo">
        <label>PID</label>
        <span class="log">{{pid}}</span>
        <label>{{mergeType==1?'自动合并':mergeType==2?'人工合并':"拆分"}}</label>
        <span class="log">
          <span v-for="(m,index) in mergeLog">
            {{m}}
            <span v-if="index!=mergeLog.length-1">、</span>
          </span>
        </span>

        <label>操作时间</label>
        <span class="log">{{baseInfo.operationTime}}</span>
      </div>
      <el-button
        class="separation"
        @click="separation"
        type="success"
        size="small"
        :disabled="splitIdList.length==0"
      >拆分</el-button>
      <div class="record">
        <el-table
          ref="multipleTable"
          :data="dataList"
          border
          stripe
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <img
                src="~@/assets/images/detail.png"
                title="查看"
                @click="showdetail(scope.row)"
                class="detail"
              />
            </template>
          </el-table-column>
          <el-table-column prop="patientId" label="业务系统ID" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.patientId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="患者姓名" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.sex }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthDate" label="出生日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.birthDate }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
              <span
                class="text"
              >{{baseInfo.originPlace}}{{baseInfo.originPlace1}}{{baseInfo.originPlace2}}</span>
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
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { splitPatientData, split } from "@/service/empi";
import { EventBus } from "../../../event-bus";
export default {
  name: "separationPatient",
  computed: {
    ...mapState("menu", {
      labelArr: state => state.labelArr,
      acitveMenuPath: state => state.acitveMenuPath
    })
  },
  components: {},
  data() {
    return {
      pid: "",
      dataList: [],
      baseInfo: {},
      mergeType: 0,
      mergeLog: [],
      splitIdList: []
    };
  },
  created() {
    this.pid = this.$route.query.pid ? this.$route.query.pid : "";
    this.getData();
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.pid) {
        this.pid = this.$route.query.pid;
        this.getData();
      }
    }
  },
  methods: {
    ...mapMutations("menu", ["removeLabelByPath"]),
    getData() {
      splitPatientData({
        pid: this.pid
      }).then(res => {
        this.dataList = res.childPatientList;
        this.baseInfo = res.mainPatient;
        this.mergeType = res.mergeType;
        this.mergeLog = res.mergeLog;
      });
    },
    selectionChange(val) {
      // console.log(val);
      this.splitIdList = [];
      val.forEach(e => {
        this.splitIdList.push(e.id);
      });
      // console.log(this.splitIdList);
    },
    separation() {
      let params = {
        mainPid: this.pid,
        splitIdList: this.splitIdList
      };
      let dataListLength = this.dataList.length - params.splitIdList.length;
      let rsp = "";
      let isOriginalPid = true;
      // console.log(dataListLeft);
      split(params).then(res => {
        console.log(res);
        if (res) {
          if (res !== this.pid) {
            isOriginalPid = false;
          } else {
            isOriginalPid = true;
          }
          if (res == -2) {
            isOriginalPid = -2;
          }
          this.pid = res;
          if (isOriginalPid == true) {
            this.$message({
              message: "拆分成功",
              type: "success"
            });
          }
          //关闭当前页
          if (dataListLength > 1) {
            this.getData();
            if (!isOriginalPid) {
              this.removeLabelByPath("/empi/separationPatient");
              this.$router.push({
                name: "separationPatient",
                query: {
                  pid: this.pid,
                  empi: this.pid
                }
              });
            } else if (isOriginalPid == -2) {
              this.$message({
                message: "合并数据有变化，请重新再试",
                type: "error"
              });
              this.removeLabelByPath("/empi/separationPatient");
              console.log(EventBus, "EventBus");
              EventBus.$emit("initIndex", {
                isInit: true
              });

              this.$router.push({
                name: "patientMasterIndex"
              });
            }
          } else {
            this.$message({
              message: "拆分成功",
              type: "success"
            });
            // let index = this.labelArr.findIndex(
            //   i => i.path.indexOf(this.$route.name) != -1
            // );
            // console.log(index);
            // this.removeLabel(index);
            // if (index === 0) {
            //   this.$router.push(this.labelArr[0].fullPath);
            // } else {
            //   this.$router.push(this.labelArr[index - 1].fullPath);
            // }
            this.removeLabelByPath("/empi/separationPatient");
            console.log(EventBus, "EventBus");
            EventBus.$emit("initIndex", {
              isInit: true
            });

            this.$router.push({
              name: "patientMasterIndex"
            });
          }
          /* 删除 */
        } else {
        }
      });
    },
    showdetail(data) {
      this.baseInfo = data;
      this.$router.push({
        name: "patientDetail",
        query: {
          id: data.id,
          empi: data.id
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.separationPatient {
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
    display: flex;
    flex-direction: column;
    .record {
      overflow: scroll;
    }
    .teamInfo {
      margin-bottom: 10px;
      color: #111111;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      label {
        color: #3b5370;
        margin-right: 10px;
      }
      .log {
        margin-right: 20px;
      }
    }
    .el-button {
      height: 24px;
      line-height: 1px;
      text-align: center;
    }
    .el-button.separation {
      width: 60px;
      height: 22px;
      background: linear-gradient(
        180deg,
        rgba(237, 255, 242, 0.1) 0%,
        rgba(0, 152, 45, 0.1) 100%
      );
      border: 1px solid #32ae57;
      box-sizing: border-box;
      border-radius: 4px;
      margin-bottom: 10px;

      span {
        line-height: 22px;
        text-align: center;
        color: #00982d;
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
.separationPatient {
  .content {
    .el-button.separation {
      span {
        // line-height: 22px;
        text-align: center;
        color: #00982d;
        font-size: 14px;
      }
    }
    .el-table {
      overflow: scroll;
      tr {
        height: 26px;
        .detail {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .baseInfo {
    }
  }
}
</style>
