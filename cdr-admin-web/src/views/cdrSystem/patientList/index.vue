<template>
  <div
    style="margin: 10px; background-color: #ffffff; min-width: 691px;height: calc(100vh - 50px);"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="module-list">
      <section class="top-content">
        <el-form class="form-style" :inline="true" :model="formInline">
          <el-form-item>
            <el-select class="select-style" v-model="selectLabel">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              class="input-style"
              v-model="input"
              placeholder="姓名、PID、身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="search-button"
              type="primary"
              icon="el-icon-search"
              @click="searchClick"
              plain
            ></el-button>
          </el-form-item>
          <el-form-item class="module-select">
            <div v-if="moduleFlag === 'list'" class="listSelect" @click="changeModuleEvent"></div>
            <div v-if="moduleFlag === 'img'" class="imgSelect" @click="changeModuleEvent"></div>
          </el-form-item>
        </el-form>
      </section>

      <section class="mid-content" v-if="moduleFlag === 'list'" v-loading="loading">
        <div v-if="listData.length > 0">
          <el-table
            class="table-style"
            :data="listData"
            :header-cell-style="{ 'text-align': 'center' }"
            border
            stripe
          >
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看">
                  <img
                    src="~@/assets/images/operate.svg"
                    @click="goToPatientDeatail(scope.row)"
                    style="padding-top: 5px"
                    alt=""
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="hzxm"
              width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="性别" prop="hzxb" width="80"></el-table-column>
            <el-table-column label="PID" prop="hzid" show-overflow-tooltip></el-table-column>
            <el-table-column label="身份证号" prop="sfzh" width="200"></el-table-column>
            <el-table-column label="出生日期" prop="csrq" width="200"></el-table-column>
            <el-table-column label="电话号码" prop="hzdhhm" width="200"></el-table-column>
            <el-table-column label="家庭地址" prop="jtzz" show-overflow-tooltip></el-table-column>
            <el-table-column label="医保类型" prop="ybxz" width="200"></el-table-column>
          </el-table>
        </div>
        <div v-else class="no-table">
          <div class="no-table-img">
            <img src="~@/assets/images/norecords.svg" alt="" width="100%" />
          </div>
        </div>
      </section>
    </div>
    <div class="module-img" v-if="moduleFlag === 'img'">
      <div v-if="listData.length > 0" class="module-img-card">
        <patientCard v-for="i in listData" :listData="i" :key="i.hzid"></patientCard>
      </div>

      <div v-else class="no-table">
        <div class="no-table-img">
          <img src="~@/assets/images/noTable.png" alt="" width="100%" />
        </div>
      </div>
    </div>

    <div class="pages-style">
      <el-pagination
        class="pages-left"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="this.size"
        layout="total, sizes"
        :total="this.total"
      >
      </el-pagination>
      <el-pagination
        class="pages-right"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="this.size"
        :total="this.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import patientCard from "./components/patientCardnoColor.vue"
import { selectDataList } from "@/service/patientView"
import { mapMutations } from "vuex"
export default {
  name: "patientList",
  created() {
    console.log("患者列表")
    this.getDataList()
  },
  components: {
    patientCard,
  },
  data() {
    return {
      input: "",
      formInline: {},
      selectLabel: "",
      inputValue: "",
      moduleFlag: "list", //显示模式
      options: [
        {
          value: "PID",
          label: "PID",
        },
        {
          value: "姓名",
          label: "姓名",
        },
        {
          value: "身份证号",
          label: "身份证号",
        },
      ],
      size: 30, //页面大小默认为30
      currentPage: 1, //当前页为1
      listData: [], //表单数据
      cardData: [], //卡片数据
      value: "",
      isSearch: "false",
      loading: true,
      total: 0,
    }
  },
  methods: {
    ...mapMutations("project", ["SET_PATIENTINFO"]),
    searchClick() {
      this.isSearch = true
      this.getDataList()
    },
    getDataList() {
      //表格页获取数据
      if (this.input === "") {
        let params = {
          apiCode: "",
          apiVersion: "",
          pageNo: "",
          pageSize: "",
          parameters: {},
        }
        params.pageNo = this.currentPage
        params.pageSize = this.size
        if (this.moduleFlag === "list") {
          params.apiCode = "JK30001"
          params.apiVersion = "1.0"
        } else {
          params.apiCode = "JK30002"
          params.apiVersion = "1.0"
        }
        this.loading = true
        selectDataList(params).then((res) => {
          this.listData = res.data
          this.loading = false
          this.total = res.total
          this.selectLabel = "姓名"
          console.log(this.total, "this.total")
        })
      } else {
        let params = {
          apiCode: "",
          apiVersion: "",
          pageNo: "",
          pageSize: "",
          parameters: {},
        }
        params.pageNo = this.currentPage
        params.pageSize = this.size
        if (this.moduleFlag === "list") {
          params.apiCode = "JK30001"
          params.apiVersion = "1.0"
        } else {
          params.apiCode = "JK30002"
          params.apiVersion = "1.0"
        }
        if (this.selectLabel === "姓名") {
          params.parameters.patientName = this.input
        } else if (this.selectLabel === "PID") {
          params.parameters.patientId = this.input
        } else if (this.selectLabel === "身份证号") {
          params.parameters.idCard = this.input
        }
        selectDataList(params).then((res) => {
          this.listData = res.data
          this.total = res.total
          console.log(this.listData, "this.listData")
        })
      }
    },
    changeModuleEvent() {
      if (this.moduleFlag === "list") {
        this.moduleFlag = "img"
        this.getDataList()
      } else this.moduleFlag = "list"
      this.getDataList()
    },
    //跳转到全景视图
    goToPatientDeatail(row) {
      console.log("行", row)
      this.SET_PATIENTINFO(row)
      this.$router.push({
        name: "panoramicVIew",
        query: {
          ...row,
        },
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      console.log(this.size, "this.size")
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDataList()
    },
  },
}
</script>
<style lang="scss" scoped>
.module-list {
  max-height: calc(100vh - 122px);
  overflow: scroll;
  .top-content {
    background-color: #ffffff;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    .form-style {
      height: 48px;
      .select-style {
        width: 100px;
        padding: 10px 0px 10px 0;
      }
      .input-style {
        padding: 10px 0px 10px 4px;
      }
      .search-button {
        width: 28px;
        height: 28px;
        margin: 10px;
        background-color: #ffffff;
      }
      .el-button--primary.is-plain {
        color: #0075ff;
      }
      .module-select {
        // padding: 10px 10px 10px 100px;
        margin-top: 10px;
        position: absolute;
        right: 10px;
        .listSelect {
          width: 28px;
          height: 28px;
          background: url("~@/assets/images/listIcon.png");
        }
        .listSelect:hover {
          background: url("~@/assets/images/selectListicon.png");
        }
        .imgSelect {
          width: 28px;
          height: 28px;
          background: url("~@/assets/images/imageIcon.png");
        }
        .imgSelect:hover {
          background: url("~@/assets/images/selectImageicon.png");
        }
      }
    }
  }
  .mid-content {
    background-color: #ffffff;
    padding: 10px;
    .table-style {
      height: 100%;
    }
    .no-table {
      position: relative;
      top: 20vh;
      width: 100%;
      display: flex;
      justify-content: center;
      .no-table-img {
        width: 28%;
        min-width: 320px;
      }
    }
  }
}
.module-img {
  margin-top: 10px;
  .module-img-card {
    display: flex;
    flex-wrap: wrap;
    max-height: 680px;
    overflow: auto;
  }
  .no-table {
    position: relative;
    top: 20vh;
    width: 100%;
    display: flex;
    justify-content: center;
    .no-table-img {
      width: 28%;
      min-width: 320px;
    }
  }
}
.pages-style {
  display: flex;
  position: fixed;
  bottom: 10px;
  padding-bottom: 30px;
  margin-left: 10px;
  z-index: 2;
  .pages-left {
    background-color: #ffffff;
  }
  .pages-right {
    position: fixed;
    background-color: #ffffff;
    right: 10px;
  }
}

::v-deep .el-input__inner {
  padding: 0 10px;
}
::v-deep .el-input__icon {
  line-height: 28px !important;
}
::v-deep .el-button {
  padding: 0;
}
::v-deep .el-form-item__content {
  line-height: 0;
}
</style>
