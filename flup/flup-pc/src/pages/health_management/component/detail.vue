<template>
  <div class="hm-detail">
    <div class="header">
      <div>
        <img src="@/assets/images/lujin.png" alt="" />
        <span class="hos">{{ hospitalName }}</span>
      </div>
      <div>
        <img src="@/assets/images/yuan.png" alt="" />已开通<span>{{
          hospitalOpenSummary.openNum
        }}</span>
      </div>
      <div>
        <img src="@/assets/images/yuan.png" alt="" />可开通<span>{{
          hospitalOpenSummary.canOpenNum
        }}</span>
      </div>
    </div>
    <div class="main">
      <div class="left-tree">
        <el-input
          placeholder="请输入关键字搜索"
          v-model.trim="keyword"
          clearable
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="Search"
          ></el-button>
        </el-input>
        <div class="d-tree">
          <el-tree
            :data="treeList"
            :props="defaultProps"
            default-expand-all
            node-key="packageId"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            ><span class="custom-tree-node" slot-scope="{ node, data }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="node.label"
                placement="top"
                v-zj-plus-show-overflow-tooltip
              >
                <span class="label">{{ node.label }}</span>
              </el-tooltip>
            </span></el-tree
          >
        </div>
      </div>
      <div class="right-echarts">
        <div class="item">
          <echartExample
            title="近30天签约数量"
            :money="hosDetail.recentNum"
            :datas="hosDetail.recentNumMap"
          ></echartExample>
        </div>
        <div class="item">
          <echartExample
            title="近30天签约金额"
            :money="`${(hosDetail.recentAmount / 100).toFixed(2)}元`"
            :color="color"
            :datas="hosDetail.recentAmountMap"
          ></echartExample>
        </div>
        <div class="item">
          <echartExample
            title="总签约数量"
            :money="hosDetail.totalNum"
            :datas="hosDetail.totalNumMap"
          ></echartExample>
        </div>
        <div class="item">
          <echartExample
            title="总签约金额"
            :money="`${(hosDetail.totalAmount / 100).toFixed(2)}元`"
            :color="color"
            :datas="hosDetail.totalAmountMap"
          ></echartExample>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echartExample from "./echartExample.vue";
export default {
  components: {
    echartExample
  },
  data() {
    return {
      keyword: "",
      treeList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      hosDetail: {},
      color: ["rgba(255,173,111,0.5)", "rgba(255,173,111,0.00)"],
      hospitalId: "",
      hospitalName: "",
      dataList: [],
      hospitalOpenSummary: {}
    };
  },
  created() {
    this.GetRequest(decodeURIComponent(window.location.href));
    this.getHospitalOpenSummary();
    this.getListAllPackage();
  },
  methods: {
    /**
     * 获取医院开通数量情况
     */
    getHospitalOpenSummary() {
      this.$apis
        .getHospitalOpenSummary({
          hospitalId: this.hospitalId
        })
        .then(res => {
          this.hospitalOpenSummary = res;
        });
    },
    /**
     * 获取tree数据
     */
    getListAllPackage() {
      this.$apis
        .getListHospitalPackages({
          hospitalId: this.hospitalId
        })
        .then(res => {
          res.forEach(item => {
            if (item.platPackageInfoVoList.length > 0) {
              item.children = item.platPackageInfoVoList;
              item.label = item.className;
              delete item.platPackageInfoVoList;
              item.children.forEach(items => {
                items.children = items.platPackageSpecVoList;
                items.label = items.packageName;
                delete items.platPackageSpecVoList;
                items.children.forEach(itemss => {
                  itemss.label = itemss.specName;
                });
              });
            } else {
              item.children = item.platPackageInfoVoList;
              item.label = item.className;
              delete item.platPackageInfoVoList;
            }
          });
          this.dataList = res;
          this.treeList = JSON.parse(JSON.stringify(this.dataList));
          // 对数据进行处理
          let ruleIdList = this.getRuleIdList(this.treeList);
          this.getCountSpecOrder(ruleIdList);
          // 获取图表数据
        });
    },
    /**
     * 获取图表详情数据
     */
    getCountSpecOrder(specList) {
      this.$apis
        .countSpecOrder({
          hospitalId: this.hospitalId,
          specList: specList.join(",")
        })
        .then(res => {
          // 获取图表数据
          this.hosDetail = res;
          // 对图表数据进行处理
          this.hosDetail.recentAmountMap = this.getObj(
            res.recentAmountMap,
            true
          );
          this.hosDetail.recentNumMap = this.getObj(res.recentNumMap, false);
          this.hosDetail.totalAmountMap = this.getObj(res.totalAmountMap, true);
          this.hosDetail.totalNumMap = this.getObj(res.totalNumMap, false);
        });
    },
    /**
     * 搜索
     */
    Search() {
      if (this.keyword) {
        this.treeList = this.filterTree(this.dataList, this.keyword);
        let ruleIdList = this.getRuleIdList(this.treeList);
        this.getCountSpecOrder(ruleIdList);
      } else {
        this.treeList = this.dataList;
        let ruleIdList = this.getRuleIdList(this.treeList);
        this.getCountSpecOrder(ruleIdList);
      }
    },
    /**
     * tree 点击
     */
    handleNodeClick(data) {
      let ruleIdList = this.getRuleIdList([data]);
      this.getCountSpecOrder(ruleIdList);
    },
    /**
     * 获取ruleId
     */
    getRuleIdList(arr) {
      let newArr = [];
      function getRuleId(arr) {
        arr.forEach(item => {
          if (item.children) {
            getRuleId(item.children);
          } else {
            if (item.specId) {
              newArr.push(item.specId);
            }
          }
        });
      }
      getRuleId(arr);
      return newArr;
    },
    /**
     * 格式化图表数据
     * @param {Object} obj
     */
    getObj(obj, isBool) {
      let nameList = [];
      let dataList = [];
      Object.keys(obj).forEach(key => {
        nameList.push(key);
        !isBool
          ? dataList.push(obj[key])
          : dataList.push((obj[key] / 100).toFixed(2));
      });
      return {
        nameList: nameList,
        dataList: dataList
      };
    },
    /**
     *
     * @param {Array} arr 原始数据
     * @param {string} keyword 过滤条件
     * @param {Boolean} first
     */
    filterTree(arr, keyword, first = true) {
      if (first) {
        //首次传入深度克隆数据防止修改源数据
        arr = JSON.parse(JSON.stringify(arr));
      }
      let emptyArr = [];
      for (let item of arr) {
        if (item.label.includes(keyword)) {
          // if (
          //   item.children &&
          //   Array.isArray(item.children) &&
          //   item.children.length > 0
          // ) {
          //   item.children = this.filterTree(item.children, keyword, false);
          // }
          emptyArr.push(item);
        } else if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          item.children = this.filterTree(item.children, keyword, false);
          if (item.children.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
    },
    /**
     * 获取url参数
     */
    GetRequest(urlStr) {
      let url = "?" + urlStr.split("?")[1];
      let theRequest = new Object();
      if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      this.hospitalId = theRequest.hospitalId;
      this.hospitalName = theRequest.hospitalName;
    }
  }
};
</script>
<style lang="scss" scoped>
.hm-detail {
  margin: 0 24px 20px;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  .header {
    height: 36px;
    padding: 0 22px;
    display: flex;
    align-items: center;
    background: #f3faf5;
    div {
      display: flex;
      align-items: center;
      margin-right: 30px;
      img {
        margin-right: 6px;
      }
      .hos {
        font-weight: 700;
        color: #3d3d3d;
      }
      span {
        color: #ff7b35;
      }
    }
  }
  .main {
    flex: 1;
    overflow-y: auto;
    display: flex;
    margin-top: 16px;
    .left-tree {
      height: 100%;
      width: 280px;
      min-width: 280px;
      padding: 10px;
      background: #fbfbfb;
      display: flex;
      flex-direction: column;
      .d-tree {
        flex: 1;
        margin-top: 20px;
        overflow-y: auto;
      }
    }
    .right-echarts {
      flex: 1;
      .item {
        display: inline-block;
        padding: 24px 20px;
        width: calc(50% - 24px);
        height: calc(50% - 25px);
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        margin: 0 0 20px 20px;
      }
      // display: flex;
      // min-width: 50%;
      // min-height: 50%;
      // flex-direction: column;
      // .echart-list {
      //   flex: 1;
      //   width: 100%;
      //   display: flex;
      //   .echart-item {
      //     padding: 24px 20px;
      //     margin-left: 20px;
      //     box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      //     flex: 1;
      //   }
      // }
      // .echart-one {
      //   .echart-item {
      //     margin-bottom: 20px;
      //   }
      // }
    }
  }
  .label {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 180px;
  }
}
</style>
<style lang="scss">
.hm-detail {
  .is-current {
    .el-tree-node__content {
      background-color: #e4f1ff !important;
    }
  }
}
</style>
