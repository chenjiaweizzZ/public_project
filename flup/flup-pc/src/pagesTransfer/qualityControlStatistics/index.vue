<template>
  <div class="quality-control-statistics">
    <div class="header">
      <div class="search">
        <section>
          <span class="title">统计时间</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </section>
        <section>
          <span class="title">科室</span>
          <el-select v-model="deptId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in deptList"
              :key="item.serialNo"
              :label="item.deptName"
              :value="item.serialNo"
            >
            </el-option>
          </el-select>
        </section>
        <section>
          <span class="title">健康管理组</span>
          <el-select
            v-model="groupId"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in flupGroupList"
              :key="item.serialNo"
              :label="item.groupName"
              :value="item.serialNo"
            >
            </el-option>
          </el-select>
        </section>
      </div>
      <el-button type="primary" plain @click="Export">导出</el-button>
    </div>
    <el-tabs class="main" v-model="activeName">
      <el-tab-pane label="收案维度" name="first">
        <CollectionCases
          :packageDeptId="deptId"
          :groupId="groupId"
          :time="time"
          :activeName="activeName"
        ></CollectionCases>
      </el-tab-pane>
      <el-tab-pane label="满意度维度" name="second">
        <SatisfactionDimension
          :packageDeptId="deptId"
          :groupId="groupId"
          :time="time"
          :activeName="activeName"
        ></SatisfactionDimension>
      </el-tab-pane>
      <el-tab-pane label="应答维度" name="third">
        <Response
          :packageDeptId="deptId"
          :groupId="groupId"
          :time="time"
          :activeName="activeName"
        ></Response>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CollectionCases from "./components/collectionCases";
import SatisfactionDimension from "./components/satisfactionDimension";
import Response from "./components/response";
export default {
  components: {
    CollectionCases,
    SatisfactionDimension,
    Response
  },
  data() {
    return {
      time: this.getLastMonth(1),
      deptId: "",
      groupId: "",
      activeName: "first",
      deptList: [],
      flupGroupList: []
    };
  },
  created() {
    this.getDeptList();
    this.getFlupGroupList();
  },
  methods: {
    getLastMonth(i) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let dateArr = new Array(2);
      dateArr[1] = year + "-" + month + "-" + day;
      let nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
      if (i == 12) {
        //如果是12月，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + month + "-" + day;
      } else if (month - i <= 0) {
        // 如果前推i月小于0，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + 12 + "-" + day;
      } else {
        let endTimeMonthDay = new Date(year, parseInt(month) - i, 0).getDate();
        if (endTimeMonthDay < day) {
          // i个月前所在月的总天数小于现在的天日期
          if (day < nowMonthDay) {
            // 当前天日期小于当前月总天数
            dateArr[0] =
              year +
              "-" +
              (month - i) +
              "-" +
              (endTimeMonthDay - (nowMonthDay - day));
          } else {
            dateArr[0] = year + "-" + (month - i) + "-" + endTimeMonthDay;
          }
        } else {
          dateArr[0] = year + "-" + (month - i) + "-" + day;
        }
      }
      return dateArr;
    },
    /**
     * 获取科室列表
     */
    getDeptList() {
      
      this.$apis
        .getDeptByPrivileges()
        .then(res => {
          this.deptList = res || [];
        });
    },
    /**
     * 健康管理组查询
     */
    async getFlupGroupList(deptId) {
      await this.$apis
        .getGroupByPrivileges()
        .then(res => {
          this.flupGroupList = res || [];
        });
    },
    /**
     * 导出
     */
    Export(event) {
      event.target.blur();
      if (event.target.nodeName == "SPAN") {
        event.target.parentNode.blur();
      }
      this.$apis
        .exportQualityControlStatisticsData({
          deptId: this.deptId,
          startDate: this.time && this.time[0] ? this.time[0] : null,
          endDate: this.time && this.time[1] ? this.time[1] : null,
          groupId: this.groupId,
          pageNo: 1,
          pageSize: 9999
        })
        .then(res => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: "application/ms-excel" })
          );
          // 进行基本思路的操作
          let link = document.createElement("a");
          link.href = url;
          link.download = "质控统计.xlsx";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.quality-control-statistics {
  height: 100%;
  margin: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background-color: #f2f2f2;
    padding-right: 20px;
    margin-bottom: 10px;
    .search {
      display: flex;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        margin-right: 14px;
      }
    }
  }
  .main {
    flex: 1;
  }
}
</style>
<style lang="scss">
.quality-control-statistics {
  .el-tabs {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .el-tabs__content {
      flex: 1;
      display: flex;
      overflow: hidden;
      .el-tab-pane {
        flex: 1;
        display: flex;
        overflow: hidden;
      }
    }
  }
}
</style>
