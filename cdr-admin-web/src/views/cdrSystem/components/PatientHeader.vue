<template>
  <section class="person-header">
    <el-row type="flex" justify="start" align="middle">
      <el-image style="width: 54px; height: 54px;border-radius:27px;margin-right:10px" :src="userInfo.hzxb == '女' ? defaultGirlAvator : defaultPatientAvator"></el-image>
      <el-row style="flex-grow:1;">
        <el-row type="flex" justify="space-between" style="margin-bottom:10px">
          <el-row type="flex" style="flex-grow:1" align="bottom">
            <el-row type="flex" align="bottom" style="min-width:150px;align-items:center">
              <div class="name">{{ userInfo.hzxm }}</div>
              <div style="margin-left:10px">{{ userInfo.hzxb }}</div>
              <div class="age">
                <div class="age-model0" v-if="age.type === 0">{{ age.data.year }}岁</div>
                <div class="age-model1" v-else>
                  <!-- 月 -->
                  <div v-if="age.data.month > 0" class="mo">{{ age.data.month }}</div>
                  <div class="day">
                    <!-- 分子分母 -->
                    <div class="age-group">
                      <div class="fz">{{ age.data.day }}</div>
                      <div class="line"></div>
                      <div class="fm">30</div>
                    </div>
                    <div>月</div>
                  </div>
                </div>
              </div>
              <!-- <div class="content-font" style="margin-left:10px">{{ userInfo.hzxb }}/
                
                
                {{ userInfo.csrq && new Date().getFullYear() - Number(userInfo.csrq.slice(0, 4)) + 1 }}
                
                岁</div> -->
            </el-row>
            <div>
              <span class="label-font">出生日期</span> <span class="content-font">{{ userInfo.csrq }}</span>
            </div>
            <div>
              <span class="label-font">医保类型</span> <span class="content-font">{{ userInfo.ybxz }}</span>
            </div>
            <div>
              <span class="label-font">PID</span> <span class="content-font">{{ userInfo.hzid }}</span>
            </div>
            <div>
              <span class="label-font">身份证号</span> <span class="content-font">{{ userInfo.sfzh }}</span>
            </div>
            <div>
              <span class="label-font">电话号码</span> <span class="content-font">{{ userInfo.hzdhhm }}</span>
            </div>
          </el-row>
          <el-row type="flex" justify="center" align="middle" class="switch-mode">
            <div>{{ $route.name === "timelineMode" ? "时间轴模式" : "普通模式" }}</div>
            <div class="line"></div>
            <div class="switch-btn" @click="goToMode">切换</div>
          </el-row>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-row type="flex" style="flex-grow:1" align="bottom">
            <div style="min-width:150px">
              <el-tag v-if="isExist == '1'" type="danger" class="tag"> 死亡 </el-tag>
            </div>
            <div>
              <span class="label-font">诊断</span>
              <el-popover width="500" popper-class="wenbennotice" trigger="hover" v-if="zdStr.chaochu">
                {{ zdStr.old }}
                <span slot="reference" class="content-font">{{ zdStr.str }}</span>
              </el-popover>
              <span v-else class="content-font">{{ zdStr.str }}</span>
            </div>
            <div>
              <span class="label-font">过敏史</span>

              <el-popover width="500" popper-class="wenbennotice" trigger="hover" v-if="gmsStr.chaochu">
                {{ gmsStr.old }}
                <span slot="reference" class="content-font">{{ gmsStr.str }}</span>
              </el-popover>
              <span v-else class="content-font">{{ gmsStr.str }}</span>
            </div>
            <div>
              <span class="label-font">家庭住址</span>

              <el-popover width="500" popper-class="wenbennotice" trigger="hover" v-if="jtzsStr.chaochu">
                {{ jtzsStr.old }}
                <span slot="reference" class="content-font">{{ jtzsStr.str }}</span>
              </el-popover>
              <span v-else class="content-font">{{ jtzsStr.str }}</span>

              <!-- <span class="content-font">{{ !userInfo.jtzz ? "无记录" : userInfo.jtzz.length <= 10 ? userInfo.jtzz : userInfo.jtzz.slice(0, 10) + "..." }}</span> -->
            </div>
          </el-row>
          <el-row class="right-btn" type="flex" align="middle">
            <img src="@svg/person.svg" style="margin-right:6px" alt="" />
            <span style="cursor:pointer;margin-right:10px" @click="patientDialog.show = true">患者切换</span>
            <img src="@svg/note.svg" style="margin-right:6px" alt="" />
            <span style="cursor:pointer" @click="$router.push({ path: '/cdrSystem/patientList' })">患者列表</span>
          </el-row>
        </el-row>
      </el-row>
    </el-row>

    <el-dialog title="患者列表" @close="closeDialog" class="patient-list-dialog" :visible.sync="patientDialog.show" width="520px">
      <el-row type="flex" justify="space-between">
        <el-select class="select-type" v-model="patientDialog.searchType" placeholder="请选择" size="mini" style="width:124px">
          <el-option v-for="item in patientDialog.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-input type="text" v-if="patientDialog.searchType !== '0'" placeholder="姓名、PID、身份证" v-model="patientDialog.searchValue" class="search-input"></el-input>

        <el-button icon="el-icon-search" @click="searchData" size="mini"></el-button>
      </el-row>
      <el-table
        highlight-current-row
        tooltip-effect="light"
        :stripe="true"
        :header-cell-style="{ background: '#ECF5FE' }"
        @current-change="handleCurrentChange"
        :data="patientDialog.tableData"
        border
        style="width: 100%;margin-top:10px"
      >
        <el-table-column prop="hzid" width="124" label="PID" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="hzxm" label="姓名" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="sfzh" label="身份证号" :show-overflow-tooltip="true"> </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :current-page="patientDialog.page.pageNo" style="text-align:right" small layout="total,prev, pager, next" :total="patientDialog.page.total">
      </el-pagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="patientDialog.show = false" size="mini">取 消</el-button>
        <el-button type="primary" :disabled="JSON.stringify(patientDialog.currentRow) == '{}' || patientDialog.currentRow == null" @click="choicedPatient" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import defaultPatientAvator from "@svg/defaultPatientAvator.svg";
import defaultGirlAvator from "@/assets/images/girl.svg";
import request from "@/plugins/request";
import { selectDataList } from "@/service/patientView";
import { mapMutations } from "vuex";
import utils from "@/utils/index.js";
export default {
  data() {
    return {
      defaultPatientAvator,
      defaultGirlAvator,
      userInfo: {},
      isExist: 0,
      gmsList: [],
      zdList: [],
      endata: "",
      age: {
        data: {
          day: 0,
          month: 0,
        },
      },
      patientDialog: {
        currentRow: {},
        page: {
          pageSize: 10,
          pageNo: 1,
          total: 0,
        },
        show: false,
        options: [
          {
            label: "姓名",
            value: "1",
          },
          {
            label: "PID",
            value: "2",
          },
          {
            label: "身份证号",
            value: "3",
          },
        ],
        searchType: "1",
        searchValue: "",
        tableData: [],
      },
    };
  },
  computed: {
    gmsStr() {
      let str = this.gmsList.reduce((str, item) => {
        if (str === "") {
          return `${str}${item.gms}`;
        } else {
          return `${str};${item.gms}`;
        }
      }, "");
      let old = str;
      let chaochu;
      if (str.length <= 10) {
        str = str;
        chaochu = false;
      } else {
        str = str.slice(0, 10) + "...";
        chaochu = true;
      }
      if (str === "") {
        str = "暂无记录";
      }
      return {
        old,
        str,
        chaochu,
      };
    },
    zdStr() {
      let str = this.zdList.reduce((str, item) => {
        if (str === "") {
            return `${str}${item.zdmc === null ? '' : item.zdmc}`
        } else {
          return `${str};${item.zdmc}`;
        }
      }, "");
      let old = str;
      let chaochu;
      if (str.length <= 10) {
        str = str;
        chaochu = false;
      } else {
        str = str.slice(0, 10) + "...";
        chaochu = true;
      }
      if (str === "") {
        str = "暂无记录";
      }
      return {
        old,
        str,
        chaochu,
      };
    },
    jtzsStr() {
      let str = "";
      let chaochu = false;
      if (!this.userInfo.jtzz) {
        str = "暂无记录";
      } else if (this.userInfo.jtzz.length <= 10) {
        str = this.userInfo.jtzz;
      } else {
        str = this.userInfo.jtzz.slice(0, 10) + "...";
        chaochu = true;
      }
      return {
        str,
        old: this.userInfo.jtzz,
        chaochu,
      };
    },
  },

  methods: {
    closeDialog() {
      this.patientDialog.currentRow = {};
    },
    ...mapMutations("project", ["SET_PATIENTINFO"]),
    searchData() {
      this.patientDialog.currentRow = {};

      this.patientDialog.page.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange(row) {
      this.patientDialog.currentRow = row;
    },
    choicedPatient(item) {
      this.patientDialog.show = false;
      this.$emit("choicePatient", this.patientDialog.currentRow);
    },
    goToMode() {
      this.$route.name == "commonMode" ? this.$router.push({ name: "timelineMode", query: this.$route.query }) : this.$router.push({ name: "commonMode", query: this.$route.query });
    },
    async getUserInfo() {
      // let res = await request({
      //   url: "http://192.168.22.220:8080/selectDataList",
      //   method: "post",
      //   data: {
      //     apiCode: "JK30009",
      //     apiVersion: "1.0",
      //     pageNo: 0,
      //     pageSize: 0,
      //     parameters: { patientId: this.$route.query.hzid },
      //     selectSon: 1,
      //   },
      // });
      let res = await selectDataList({
        apiCode: "JK30009",
        apiVersion: "1.0",
        pageNo: 0,
        pageSize: 0,
        parameters: { patientId: this.$route.query.hzid },
        selectSon: 1,
      });
      this.userInfo = res.data.hzjbxx[0];
      // this.userInfo.hzxb="女"
      this.isExist = res.data.isDead[0].isExist;
      // TODO
      this.endata = res.data.isDead[0].swrqsj;

      // this.userInfo.csrq='2029-01-02'
      // this.endata = "2029-02-02";
      // endata
      this.gmsList = res.data.gms;
      this.zdList = res.data.zdxq;
      // console.log(getAge,'555555555555')
      if (this.isExist === "1" && this.endata) {
        this.age = utils.getAge(this.userInfo.csrq, new Date(this.endata));
      } else {
        this.age = utils.getAge(this.userInfo.csrq);
      }
      // 跳转360的时候用到
      this.SET_PATIENTINFO({
        ...this.userInfo,
        isDead: res.data.isDead[0].isExist,
      });
    },
    changePage(pageNo) {
      console.log(pageNo);
      this.patientDialog.page.pageNo = pageNo;
      this.getTableData();
    },
    async getTableData() {
      // "patientId":"1","patientName":"","idCard":""
      let parameters = {};
      switch (this.patientDialog.searchType) {
        case "1":
          this.patientDialog.searchValue ? (parameters.patientName = this.patientDialog.searchValue) : undefined;
          break;
        case "2":
          this.patientDialog.searchValue ? (parameters.patientId = this.patientDialog.searchValue) : undefined;
          break;
        case "3":
          this.patientDialog.searchValue ? (parameters.idCard = this.patientDialog.searchValue) : undefined;
          break;
      }

      // let res = await request({
      //   url: "http://192.168.22.220:8080/selectDataList",
      //   method: "post",
      //   data: {
      //     apiCode: "JK30001",
      //     apiVersion: "1.0",
      //     pageNo: this.patientDialog.page.pageNo,
      //     pageSize: this.patientDialog.page.pageSize,
      //     parameters,
      //     selectSon: 1,
      //   },
      // });

      let res = await selectDataList({
        apiCode: "JK30001",
        apiVersion: "1.0",
        pageNo: this.patientDialog.page.pageNo,
        pageSize: this.patientDialog.page.pageSize,
        parameters,
        selectSon: 1,
      });
      this.patientDialog.tableData = res.data;
      this.patientDialog.page.total = res.total;
    },
  },
  created() {
    console.log("route", this.$route.query);
  },
  // TODO
  watch: {
    "$route.query"() {
      this.getUserInfo();
      this.getTableData();
    },
  },
  mounted() {
    this.getUserInfo();
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.age-group {
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
}
.age {
  font-size: 14px;
  line-height: 22px;
  padding-right: 7px;
  .age-model1 {
    display: flex;
    align-items: center;
    .day {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;

      .fz {
        display: flex;
        justify-content: center;
        line-height: 10px;
        padding-bottom: 2px;
      }
      .line {
        width: 70%;
        height: 1px;
        background-color: #999;
      }
      .fm {
        line-height: 10px;
        padding-top: 2px;
      }
    }
  }
}
$blue-color: #0075ff;
$gray-color: #d0d7e4;
.person-header {
  padding: 10px;
  background: white;
  .flex-column-space-between {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  .label-font {
    color: #475e79;
    font-size: 14px;
    line-height: 22px;
    margin-right: 10px;
  }
  .content-font {
    font-size: 14px;
    line-height: 22px;
    color: #111111;
    margin-right: 24px;
  }
  .name {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
  }
  .tag {
    text-align: center;
    background: #ffeaea;
    width: 40px;
    padding: 0 4px;
    height: 20px;
    line-height: 17px;
    border-radius: 10px;
  }
  .switch-mode {
    height: 28px;
    width: 111px;
    border-radius: 50px;
    font-size: 12px;
    padding: 4px;
    border: 1px solid $gray-color;
  }
  .switch-btn {
    color: $blue-color;
    cursor: pointer;
  }
  .line {
    height: 100%;
    margin: 0 8px;
    border-left: 1px solid $gray-color;
  }
  .right-btn {
    font-size: 14px;
    color: $blue-color;
  }
}
.patient-list-dialog {
  .select-type {
    .el-input__inner {
      width: 108px;
    }
  }

  .el-input.search-input {
    // width: 180px;
    flex: 1;
    margin: 0 10px;
  }
  thead {
    .cell {
      text-align: center;
    }
  }
}
</style>
