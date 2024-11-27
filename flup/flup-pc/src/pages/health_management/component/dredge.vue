<template>
  <div class="hm-dredge">
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
            ref="tree"
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
      <div class="right-content">
        <el-table
          :data="mainList"
          border
          max-height="250"
          :row-class-name="tableRowClassName"
          @row-click="selectTable"
        >
          <el-table-column
            type="index"
            width="80px"
            label="序号"
          ></el-table-column>
          <el-table-column label="状态"
            ><template slot-scope="scope">
              <el-switch
                v-model="scope.row.b"
                active-color="#13ce66"
                inactive-color="#f2f2f2"
              >
              </el-switch> </template
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="规格"
            prop="specName"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="描述"
            prop="specDiscription"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="价格"
            prop="price"
          ></el-table-column>
        </el-table>
        <div class="d-form">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="服务内容价格" label-width="100px">
              <el-input-number
                v-model="form.price"
                placeholder="请输入服务内容价格"
                controls-position="right"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100000"
                style="width: 300px;"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="院内ID" label-width="100px" prop="hisSpecId">
              <el-input
                v-model="form.hisSpecId"
                onKeypress="return(/^[0-9]*$/.test(String.fromCharCode(event.keyCode)))"
                placeholder="请输入院内ID"
                style="width: 300px;"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="mainList1.length > 0">
              <el-table :data="mainList1" border stripe max-height="250">
                <el-table-column
                  type="index"
                  width="80px"
                  label="序号"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="规则名称"
                  prop="ruleName"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="规则节点"
                  prop="ruleNodeName"
                ></el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="text" @click="See(scope.row)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label-width="100px" label="设备" class="auto">
              <el-input
                :disabled="true"
                v-model="form.deviceName"
                class="inputStyle"
              >
                <template slot="prefix">
                  {{ form.deviceName }}
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      title="规则查看"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      :before-close="Hide1"
    >
      <el-form :model="ruleObj" label-width="100px">
        <el-form-item label="规则名称" prop="ruleId">
          {{ ruleObj.ruleName }}
        </el-form-item>
        <el-form-item label="规则节点">
          <div class="rule-item" v-for="item in ruleObj.ruleNodeList">
            {{ item.interventionBenchmark }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Hide1">确 定</el-button>
      </span>
    </el-dialog>
    <div class="hm-footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="Save">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hospitalOpenSummary: {},
      keyword: "",
      treeList: [],
      dataList: [],
      defaultProps: {
        children: "platPackageInfoVoList",
        label: "label"
      },
      mainList: [],
      mainList1: [],
      optionsListAll: [],
      form: {
        price: "",
        hisSpecId: "",
        deviceName: "不包含设备"
      },
      rules: {
        hisSpecId: [
          { required: true, message: "请输入院内ID", trigger: "change" }
        ]
      },
      saveObj: {},
      packageId: "",
      hospitalName: "",
      hospitalId: "",
      Key: 0,
      Opened: 0,
      canBeActivated: 0,
      Keys: [0, 0],
      dialogVisible: false,
      ruleObj: {
        ruleName: "",
        ruleNodeList: []
      }
    };
  },
  created() {
    this.GetRequest(decodeURIComponent(window.location.href));
    this.getHospitalOpenSummary();
    this.getListAllPackage(true);
    this.getHmQuRuleAll();
  },
  methods: {
    /**
     * 获取所有规则
     */
    getHmQuRuleAll() {
      this.$apis
        .getHmQuRule({
          pageNo: 1,
          pageSize: 999
        })
        .then(res => {
          this.optionsListAll = res.list;
        });
    },
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
     * 获取左侧tree数据
     */
    getListAllPackage(refresh) {
      this.$apis
        .getListAllPackage({
          hospitalId: this.hospitalId,
          keyword: this.keyword
        })
        .then(res => {
          res.forEach(item => {
            if (item.platPackageInfoVoList.length > 0) {
              item.label = item.className;
              item.platPackageInfoVoList.forEach(items => {
                items.label = items.packageName;
              });
            } else {
              item.label = item.className;
            }
          });
          this.dataList = res;
          this.treeList = JSON.parse(JSON.stringify(this.dataList));
          refresh && this.getPackageId(this.treeList);
          this.mainList =
            res[this.Keys[0]].platPackageInfoVoList[
              this.Keys[1]
            ].platPackageSpecVoList;
          this.getListHospitalSpec(this.packageId);
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.packageId);
          });
        });
    },
    /**
     * 获取某个医院某个服务包下的规格列表及医院开通情况
     */
    getListHospitalSpec(packageId) {
      this.$apis
        .listHospitalSpec({
          hospitalId: this.hospitalId,
          packageId
        })
        .then(res => {
          this.mainList = res;
          this.mainList.forEach(item => {
            item.price = (item.price / 100).toFixed(2);
            this.$set(item, "b", item.isOpen);
          });
          let ruleObj = this.mainList[this.Key];
          this.saveObj = ruleObj;
          this.form.price = ruleObj.hospitalPrice
            ? (ruleObj.hospitalPrice / 100).toFixed(2)
            : 0;
          this.form.deviceName = this.getDeviceName(ruleObj.platSpecDeviceList);
          this.form.hisSpecId = ruleObj.hisSpecId;
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate();
          });

          this.mainList1 = ruleObj.platSpecRuleList;
          this.mainList1.forEach(async item => {
            let newArr = this.optionsListAll.filter(items => {
              return items.serialNo == item.ruleId;
            });
            item.ruleName = newArr[0].ruleName;
            if (!item.ruleNodeName) {
              await this.$apis
                .getHmQuRuleNode({
                  ruleId: item.ruleId
                })
                .then(res => {
                  this.$set(item, "ruleNodeName", this.getStr(res));
                  this.$set(item, "ruleNodeList", res);
                });
            }
          });
        });
    },

    /**
     * 前端搜索
     */
    Search() {
      if (this.keyword) {
        this.treeList = this.filterTree(this.dataList, this.keyword);
        this.getPackageId(this.treeList);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.packageId);
        });
        this.getListHospitalSpec(this.packageId);
      } else {
        this.treeList = this.dataList;
        this.getPackageId(this.treeList);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.packageId);
        });
        this.getListHospitalSpec(this.packageId);
      }
    },
    /**
     * tree 点击
     */
    handleNodeClick(a, b) {
      this.mainList1 = [];
      this.saveObj = {};
      this.Key = 0;
      this.form.price = "";
      this.form.hisSpecId = "";
      this.form.deviceName = "不包含设备";
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
      if (b.level == 2) {
        this.getKeys(this.treeList, a.packageId);
        this.packageId = a.packageId;
        this.getListHospitalSpec(this.packageId);
      } else {
        if (a.platPackageInfoVoList.length > 0) {
          this.getKeys1(this.treeList, a.classId);
          this.packageId = a.platPackageInfoVoList[0].packageId;
          this.getListHospitalSpec(this.packageId);
        }
      }
    },
    // 随访规则名称拼接
    getStr(arr) {
      let str = arr
        .map(item => {
          return item.interventionBenchmark;
        })
        .join("、");
      return str;
    },
    /**
     * 服务包开通保存
     */
    Save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$apis
            .saveSpecInfo({
              hospitalId: this.hospitalId,
              hisSpecId: this.form.hisSpecId,
              price: this.form.price ? this.form.price * 100 : null,
              specPrice: this.saveObj.price * 100,
              packageId: this.packageId,
              specId: this.saveObj.specId,
              serialNo: this.saveObj.serialNo,
              isDeleted: this.saveObj.isOpen == true && !this.saveObj.b ? 1 : 0
            })
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.Hide();
              this.getListHospitalSpec(this.packageId);
            });
        }
      });
    },
    /**
     * 取消
     */
    Hide() {
      this.form = this.$options.data.call(this).form;
      this.mainList1 = [];
      this.saveObj = {};
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
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
    },
    /**
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
          emptyArr.push(item);
        } else if (
          item.platPackageInfoVoList &&
          Array.isArray(item.platPackageInfoVoList) &&
          item.platPackageInfoVoList.length > 0
        ) {
          item.platPackageInfoVoList = this.filterTree(
            item.platPackageInfoVoList,
            keyword,
            false
          );
          if (item.platPackageInfoVoList.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
    },

    See(row) {
      this.ruleObj.ruleName = row.ruleName;
      this.ruleObj.ruleNodeList = row.ruleNodeList;
      this.dialogVisible = true;
    },
    Hide1() {
      this.ruleObj.ruleName = "";
      this.ruleObj.ruleNodeList = "";
      this.dialogVisible = false;
    },
    // table 表格点击
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (rowIndex == this.Key) {
        return "table-edit-row";
      }
    },
    selectTable(row) {
      this.Key = row.index;
      this.saveObj = row;
      this.form.deviceName = this.getDeviceName(row.platSpecDeviceList);
      this.form.price = this.form.price = row.hospitalPrice
        ? (row.hospitalPrice / 100).toFixed(2)
        : "";
      this.form.hisSpecId = row.hisSpecId;
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate();
      });
      let i = row.index;
      this.mainList.forEach((item, index) => {
        if (i !== index && item.isOpen != true) {
          item.b = false;
        } else if (i !== index && item.isOpen == true) {
          item.b = true;
        }
      });
      this.mainList1 = row.platSpecRuleList;
      this.mainList1.forEach(async item => {
        let newArr = this.optionsListAll.filter(items => {
          return items.serialNo == item.ruleId;
        });
        item.ruleName = newArr[0].ruleName;
        if (!item.ruleNodeName) {
          await this.$apis
            .getHmQuRuleNode({
              ruleId: item.ruleId
            })
            .then(res => {
              this.$set(item, "ruleNodeName", this.getStr(res));
              this.$set(item, "ruleNodeList", res);
            });
        }
      });
    },
    /**
     * 获取第一个服务包ID
     */
    getPackageId(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].platPackageInfoVoList.length > 0) {
          this.Keys = [i, 0];
          this.packageId = arr[i].platPackageInfoVoList[0].packageId;
          break;
        }
      }
    },
    /**
     * 获取点击元素的位置
     */
    getKeys(arr, id) {
      let newArr = [];
      arr.forEach((item, index) => {
        item.platPackageInfoVoList.forEach((items, indexs) => {
          if (items.packageId == id) {
            newArr.push(index, indexs);
          }
        });
      });
      this.Keys = newArr;
    },
    getKeys1(arr, id) {
      let newArr = [];
      arr.forEach((item, index) => {
        if (item.classId == id) {
          newArr.push(index, 0);
        }
      });
      this.Keys = newArr;
    },
    /**
     * 拼接设备名称
     */
    getDeviceName(v) {
      if (v && v.length > 0) {
        const arr = v.map(item => item.deviceName);
        return `包含${arr.join("、")}设备`;
      } else {
        return "不包含设备";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hm-dredge {
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
      padding: 10px 10px 56px;
      background: #fbfbfb;
      display: flex;
      flex-direction: column;
      .d-tree {
        flex: 1;
        margin-top: 20px;
        overflow-y: auto;
      }
    }
    .right-content {
      flex: 1;
      margin-left: 20px;
      .d-form {
        margin-top: 20px;
        background: #fbfbfb;
        padding: 20px;
      }
    }
  }
  .hm-footer {
    position: fixed;
    padding: 0 24px;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    line-height: 56px;
    text-align: right;
    background-color: #fff;
    box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.18);
  }
  .rule-item {
    display: inline-block;
    padding: 2px 10px;
    margin-right: 8px;
    margin-bottom: 10px;
    border: 1px solid #d7dae0;
    border-radius: 4px;
    color: #111111;
  }
  .is-current {
    .el-tree-node__content {
      background-color: #e4f1ff !important;
    }
  }
  .table-edit-row {
    background-color: #d9f6e1 !important;
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
.hm-dredge {
  .el-input-number {
    max-width: none !important;
  }
  .hm-footer {
    .el-button--primary {
      padding: 8px 17px !important;
      min-width: 0 !important;
    }
  }
  .is-current {
    .el-tree-node__content {
      background-color: #e4f1ff !important;
    }
  }
  .table-edit-row {
    background-color: #d9f6e1 !important;
  }
  .auto {
    .inputStyle {
      min-width: 300px;
      .el-input__prefix {
        display: inline-block;
        position: relative;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        // padding: 0 30px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        padding-left: 30px;
        left: 0;
        visibility: hidden;
      }
      .el-input__inner {
        position: absolute;
        padding: 0 10px;
      }
    }
    .el-input {
      width: auto;
    }
  }
}
</style>
