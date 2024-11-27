<!--
  @description：元数据管理
  vue.config的proxy的target切换为"http://192.168.22.220:8080"接口可以实现,
  @author：陈家伟
  @time：2022年03月29日
-->
<template>
  <div class="metaDataManager">
    <div class="searchRow">
      <span>内部标识符</span>
      <el-input v-model="name" placeholder="请输入内容"></el-input>
      <span>元数据标识符</span>
      <el-input v-model="deCode" placeholder="请输入内容"></el-input>
      <span>元数据名称</span>
      <el-input v-model="deCodeName" placeholder="请输入内容"></el-input>
      <el-button type="primary" plain class="search_btn" @click="beforeGetMataList">
        <img src alt />
      </el-button>
    </div>
    <div class="btnRow">
      <el-button size="mini" type="success" class="add_btn" @click="add" plain>新增</el-button>
    </div>
    <div class="record">
      <el-table :data="mataList" border style="width: 100%; color: #111111">
        <el-table-column prop label="操作" width="50">
          <template slot-scope="scope">
            <img src="../../assets/images/metaDataManager/edit.png" @click="edit(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop label="内部识别编号" width="160">
          <template slot-scope="scope">
            <span :title="scope.row.name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="元数据标识符" width="220">
          <template slot-scope="scope">
            <span :title="scope.row.deCode">{{ scope.row.deCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="元数据名称" width="220">
          <template slot-scope="scope">
            <span :title="scope.row.deCodeName">
              {{
              scope.row.deCodeName
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop label="定义">
          <template slot-scope="scope">
            <span :title="scope.row.deCodeDefinition">
              {{
              scope.row.deCodeDefinition
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop label="元数据值的数据类型" width="180">
          <template slot-scope="scope">
            <span>{{ getDataType(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="表示格式" width="140">
          <!-- <template slot-scope="scope">
            <span>{{ getDataType(scope.row.typeFormat) }}</span>
          </template>-->
          <template slot-scope="scope">
            <span>{{ scope.row.typeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="元数据允许值">
          <template slot-scope="scope">
            <span :title="scope.row.remark">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        align="right"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[20, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totalNumber"
        style="margin-top: 58px; margin-bottom: 40px"
      ></el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle ? '新增元数据' : '编辑元数据'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <div class="firstRow">
          <el-form-item label="元数据名称" prop="deCodeName" label-width="108px" :title="form.name">
            <el-input
              v-model="form.deCodeName"
              placeholder="请输入"
              maxlength="255"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="内部标识符" prop="name" label-width="108px">
            <el-input
              ref="inId"
              v-model="form.name"
              placeholder="请输入"
              maxlength="255"
              :disabled="isEdit"
              :title="form.name"
              oninput="this.value=this.value.replace(/[^\w_]/g,'');"
            ></el-input>
          </el-form-item>
        </div>
        <div class="secondRow">
          <el-form-item label="元数据标识符" prop="deCode" label-width="108px">
            <el-input v-model="form.deCode" placeholder="请输入" maxlength="255" :title="form.name"></el-input>
          </el-form-item>

          <el-form-item label="值的数据类型" prop="type" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.id"
                :label="item.typeName"
                :value="item.remark"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="thirdRow">
          <el-form-item label="表示格式" prop="typeFormat" label-width="108px">
            <el-input
              v-model="form.typeFormat"
              placeholder="请输入"
              maxlength="255"
              :title="form.typeFormat"
            ></el-input>
            <!-- <el-select
              v-model="form.typeFormat"
              placeholder="请选择"
              :disabled="isEdit"
            >
              <el-option
                v-for="item in expFormatOptions"
                :key="item.id"
                :label="item.typeName"
                :value="item.remark"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-popover placement="right" trigger="click" popper-class="metaDataManagerPopover">
            <div class="pop-title-top">
              <img
                style="width: 6px; height: 17px"
                src="../../assets/images/metaDataManager/title-before.png"
              />
              <el-col style="width: 7.5px"></el-col>
              <span>数据类型与格式的含义和规则</span>
            </div>
            <img
              style="width: 552px; height: 510px"
              src="../../assets/images/metaDataManager/table1.png"
            />
            <div class="pop-title">
              <img
                style="width: 6px; height: 17px"
                src="../../assets/images/metaDataManager/title-before.png"
              />
              <el-col style="width: 7.5px"></el-col>
              <span>数据元值的表示格式中字符含义描述规则</span>
            </div>
            <img
              style="width: 552px; height: 262px"
              src="../../assets/images/metaDataManager/table2.png"
            />
            <div class="pop-title">
              <img
                style="width: 6px; height: 17px"
                src="../../assets/images/metaDataManager/title-before.png"
              />
              <el-col style="width: 7.5px"></el-col>
              <span>数据元值的表示格式中字符长度描述规则</span>
            </div>
            <img
              style="width: 552px; height: 294px"
              src="../../assets/images/metaDataManager/table3.png"
            />
            <div class="pop-title">
              <img
                style="width: 6px; height: 17px"
                src="../../assets/images/metaDataManager/title-before.png"
              />
              <el-col style="width: 7.5px"></el-col>
              <span>实例示例</span>
            </div>
            <img
              style="width: 552px; height: 354px"
              src="../../assets/images/metaDataManager/table4.png"
            />
            <img src="../../assets/images/metaDataManager/tip.png" slot="reference" />
            <!-- <el-button slot="reference">click 激活</el-button> -->
          </el-popover>
        </div>
        <div class="fourthRow">
          <el-form-item label="定义" prop="deCodeDefinition" label-width="108px">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入"
              v-model="form.deCodeDefinition"
              maxlength="255"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <div class="fitthRow">
          <el-form-item label="元数据允许值" prop="remark" label-width="108px">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入"
              v-model="form.remark"
              maxlength="255"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTableDictionaryList,
  getDictionaryByType,
  addTableDictionary,
  updateTableDictionary
} from "@/service/metaDataManager";
export default {
  name: "metaDataManager",
  components: {},
  data() {
    return {
      name: "",
      deCode: "",
      deCodeName: "",
      dialogVisible: false,
      dialogTitle: "",
      isEdit: false,

      mataList: [],
      dataTypeOptions: [],
      expFormatOptions: [],
      form: {
        name: "",
        deCode: "",
        deCodeName: "",
        type: "",
        typeFormat: "",
        deCodeDefinition: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请填写", trigger: "blur" }],
        deCode: [{ required: true, message: "请填写", trigger: "blur" }],
        deCodeName: [{ required: true, message: "请填写", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        typeFormat: [{ required: true, message: "请选择", trigger: "change" }],
        deCodeDefinition: [
          { required: true, message: "请填写", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请填写", trigger: "blur" }]
      },
      pageIndex: 1,
      pageSize: 10,
      totalNumber: 0
    };
  },
  created() {
    this.getMataList();
    this.getDataTypeList();
  },
  computed: {},
  methods: {
    formInit() {
      this.form = {
        name: "",
        deCode: "",
        deCodeName: "",
        type: "",
        typeFormat: "",
        deCodeDefinition: "",
        remark: ""
      };
    },
    beforeGetMataList() {
      this.pageIndex = 1;
      this.getMataList();
    },
    getMataList() {
      getTableDictionaryList({
        name: this.name,
        deCode: this.deCode,
        deCodeName: this.deCodeName,
        pageNo: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.mataList = res.list;
        this.totalNumber = res.total;
      });
    },
    getDataTypeList() {
      getDictionaryByType({
        dictionaryType: 3
      }).then(res => {
        this.dataTypeOptions = res;
        this.expFormatOptions = res;
      });
    },
    getDataType(remark) {
      let type = "";
      this.dataTypeOptions.forEach(i => {
        if (i.remark == remark) {
          type = i.typeName;
        }
      });
      return type;
    },
    add() {
      this.formInit();
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogTitle = true;
      this.isEdit = false;
      this.dialogVisible = true;
    },
    edit(item) {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogTitle = false;
      this.isEdit = true;
      this.dialogVisible = true;
      this.form.name = item.name;
      this.form.deCode = item.deCode;
      this.form.deCodeName = item.deCodeName;
      this.form.deCodeDefinition = item.deCodeDefinition;
      this.form.type = item.type;
      this.form.typeFormat = item.typeFormat;
      this.form.remark = item.remark;
      this.form.id = item.id;
    },
    showTitle() {
      console.log(111);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleConfirm() {
      // console.log(this.form.name);
      // let str = "^[0-9a-zA-Z_]{1,}$";
      // let inId = str.search(str);
      // console.log(str);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.dialogTitle) {
            let params = {
              name: this.form.name,
              deCode: this.form.deCode,
              deCodeName: this.form.deCodeName,
              type: this.form.type,
              typeFormat: this.form.typeFormat,
              deCodeDefinition: this.form.deCodeDefinition,
              remark: this.form.remark
            };
            addTableDictionary(params).then(res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.dialogVisible = false;
              this.getMataList();
            });
          } else {
            let params = {
              id: this.form.id,
              name: this.form.name,
              deCode: this.form.deCode,
              deCodeName: this.form.deCodeName,
              type: this.form.type,
              typeFormat: this.form.typeFormat,
              deCodeDefinition: this.form.deCodeDefinition,
              remark: this.form.remark
            };
            updateTableDictionary(params).then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.dialogVisible = false;
              this.getMataList();
            });
          }
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMataList();
    },
    handleCurrentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getMataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.metaDataManager {
  background-color: #ffffff;
  position: absolute;
  top: 40px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  .searchRow {
    font-size: 14px;
    color: #3b5370;
    height: 48px;
    padding: 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .el-input {
      width: 208px;
      padding: 14px;
    }
  }
  .btnRow {
    padding: 0 10px 10px 10px;
    .el-button {
      height: 24px;
      width: 60px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;

      color: #00982d !important;
      background: linear-gradient(
        180deg,
        rgba(237, 255, 242, 0.1) 0%,
        rgba(0, 152, 45, 0.1) 100%
      ) !important;
      border: 1px solid #32ae57;
      border-radius: 4px;
      &:hover,
      &:active,
      &:focus {
        color: #00982d !important;
        background: linear-gradient(
          180deg,
          rgba(237, 255, 242, 0.3) 0%,
          rgba(0, 152, 45, 0.3) 100%
        ) !important;
      }
    }
  }
  .record {
    position: absolute;
    top: 82px;
    right: 10px;
    bottom: 142px;
    left: 10px;
    .el-table {
      height: 100%;
      color: #111111;
      img {
        height: 16px;
        width: 16px;
        margin-left: -2px;
        position: absolute;
        top: 20%;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep .el-form-item__content {
  line-height: 28px;
}
::v-deep .has-gutter tr {
  color: #666666;
}
::v-deep .has-gutter tr th {
  text-align: center;
}
</style>

<style lang="scss">
.metaDataManager {
  .record {
    .el-table {
      tr th {
        height: 28px !important;
        .cell {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
      }
      td {
        height: 28px !important;
        .cell {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
      }
    }
    .el-pagination {
      .el-pagination__total {
        float: left;
      }
      .el-pagination__sizes {
        // position: absolute;
        // left: 40px;
        float: left;
      }
    }
  }
  .el-dialog {
    width: 630px !important;
    height: 422px !important;
    .el-dialog__header {
      padding: 20px 24px;
      .el-dialog__title {
        position: relative;
        color: #111;
        padding-left: 9px;
        &::before {
          content: "";
          display: inline-block;
          position: absolute;
          left: 0;
          top: 4px;
          width: 4px;
          height: 17px;
          background-color: #0075ff;
        }
      }
      .el-dialog__headerbtn {
        &:hover,
        &:focus {
          .el-dialog__close {
            color: #0075ff;
          }
        }
        .el-icon-close:before {
          width: 14px;
          height: 14px;
          font-weight: bold;
          &:hover {
            color: #0075ff;
          }
        }
      }
    }
    .el-dialog__body {
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .el-dialog__footer {
      padding-top: 20px;
      button {
        line-height: 1.6;
        padding: 2px 15px;
        font-size: 14px;
      }
      .el-button--default {
        color: #666;
      }
      .el-button--info {
        color: #f4f5f6;
        background-color: #0075ff;
      }
    }
    .el-form {
      overflow: scroll;
      overflow-x: hidden;
      height: 290px;
      width: 598px;

      .el-form-item {
        margin-bottom: 0px;
      }

      .el-form-item__label {
        line-height: 28px !important;
        padding: 0 12px 0 0;
      }

      .el-input {
        height: 28px;
        width: 180px;
        line-height: 28px !important;
      }
      .el-form-item__error {
        position: relative;
        padding-top: 2px;
        line-height: 1;
        top: 0;
      }
      .firstRow {
        display: flex;
        justify-content: space-between;
        .el-form-item {
          margin-bottom: 14px;
          line-height: 28px !important;
        }
        .el-form-content {
          line-height: 28px !important;
        }
      }
      .secondRow {
        display: flex;
        justify-content: space-between;
        .el-form-item {
          margin-bottom: 14px;
          line-height: 28px !important;
        }
        .el-form-content {
          line-height: 28px !important;
        }
        .el-input__icon {
          line-height: 28px !important;
        }
      }
      .thirdRow {
        position: relative;
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 14px;
          line-height: 28px !important;
        }
        .el-form-content {
          line-height: 28px !important;
        }
        .el-input__icon {
          line-height: 28px !important;
        }
        .el-popover__reference {
          width: 16px !important;
          height: 16px !important;
          cursor: pointer;
        }
        .el-popover__reference-wrapper {
          padding-left: 14px;
          height: 28px !important;
          position: absolute;
          top: 6px;
        }
      }
      .fourthRow {
        .el-form-item {
          margin-bottom: 14px;
          line-height: 75px !important;
        }
        .el-form-content {
          line-height: 775px !important;
        }
      }
      .fifthRow {
        .el-form-item {
          margin-bottom: 14px;
          line-height: 75px !important;
        }
        .el-form-content {
          line-height: 775px !important;
        }
      }
    }
  }
  .el-dialog__title {
    font-size: 18px;
    color: #111;
  }
}
</style>
