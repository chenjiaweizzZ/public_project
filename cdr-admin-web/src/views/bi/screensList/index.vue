<!-- 
@description 大屏列表
@author 陈家伟
@time 2022/5/12
 -->
<template>
  <div class="screensList">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane class="select-container" label="待发布" name="unpublished">
        <div class="unpublishedList" v-if="activeName == 'unpublished'">
          <div class="iptRow">
            <div class="iptRowLeft">
              <span class="iptRowText">大屏状态</span>
              <el-select
                v-model="screenState"
                placeholder="请选择大屏状态"
                @change="getScreenList"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in screenStateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span class="iptRowText">大屏名称</span>
              <el-input
                v-model="screenName"
                placeholder="请输入大屏名称"
                clearable
              ></el-input>
              <el-row style="width: 20px"></el-row>
              <el-button
                type="primary"
                plain
                class="search_btn"
                @click="beforeGetScreenList"
              >
                <img src alt />
              </el-button>
            </div>
            <div class="iptRowRight">
              <el-button
                size="mini"
                type="success"
                class="add_btn"
                plain
                @click="add"
                >新增</el-button
              >
            </div>
          </div>
          <div
            class="screenList"
            ref="screenList"
            v-loading="isLoading"
            v-if="screenList.length > 0"
          >
            <el-col
              class="screenBox"
              :span="8"
              v-for="(screen, index) in screenList"
              :key="index"
            >
              <div class="screenContent">
                <div class="screenTitle">
                  <div class="DocName" :title="screen.name">
                    {{ screen.name }}
                  </div>
                  <el-row style="width: 8px"></el-row>
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      <img
                        src="../../../assets/images/screenList/drop-down.png"
                      />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="beforeHandleCommand('1', screen)"
                        >复制</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="beforeHandleCommand('2', screen)"
                        >修改</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="beforeHandleCommand('3', screen)"
                        >预览</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="beforeHandleCommand('4', screen)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-row style="width: 8px"></el-row>
                  <div class="wwhite"></div>
                  <div class="icons">
                    <div class="upload">
                      <img
                        src="../../../assets/images/screenList/upload.png"
                        @click="upload(screen)"
                      />
                    </div>
                    <el-row style="width: 10px"></el-row>
                    <div class="edit">
                      <img
                        src="../../../assets/images/screenList/edit.png"
                        @click="toScreenEdit(screen.id)"
                      />
                    </div>
                  </div>
                </div>
                <div class="screenDetail">
                  <div class="imgBox" v-if="screen.thumbnail">
                    <img :src="screen.thumbnail" alt />
                  </div>
                  <div class="imgBox" v-else>
                    <img :src="screen.backGround" />
                  </div>
                  <div class="publishBox" v-show="screen.isOnline > 0">
                    <img src="../../../assets/images/screenList/publish.png" />
                  </div>
                </div>
                <div class="screenDesc">
                  <div class="ratio">{{ screen.ratio }}</div>
                  <div class="desc" :title="screen.remark">
                    {{ screen.remark }}
                  </div>
                </div>
              </div>
            </el-col>
          </div>
          <div class="noData" v-else>
            <div class="noDataBox"></div>
          </div>
          <el-pagination
            align="right"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[6, 12]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalNumber"
            style="margin: 24px 0px 20px 0px; width: 100%; padding: 0px 10px"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane class="select-container" label="已发布" name="published">
        <published :activeName="activeName"></published>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="新增大屏"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="addHandleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
        <el-form-item label="大屏名称" prop="screenName">
          <el-input
            v-model="addForm.screenName"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="系统模板" prop="backgroundIdSelect">
          <div class="systemBox">
            <el-col
              class="colBox"
              :span="12"
              v-for="(background, index) in systemBackground"
              :class="{
                itemActive: addForm.backgroundIdSelect == background.id,
              }"
              :key="index"
            >
              <div class="screenBox">
                <div
                  class="backgroundBox"
                  @click="backgroundSelect(background)"
                >
                  <div class="backgroundContent">
                    <img :src="background.backGround" />
                  </div>
                </div>
                <div class="backgroundDesc">
                  <div class="backgroundName">{{ background.name }}</div>
                  <div class="backgroundRatio">{{ background.remark }}</div>
                </div>
              </div>
            </el-col>
          </div>
          <el-input
            v-model="addForm.backgroundIdSelect"
            v-show="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="大屏说明">
          <el-input
            type="textarea"
            v-model="addForm.screenDesc"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle ? '复制大屏' : '修改大屏信息'"
      :visible.sync="copyDialogVisible"
      width="30%"
      :before-close="copyHandleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="copyOrEditForm"
        :rules="rules"
        :model="copyOrEditForm"
        label-width="98px"
      >
        <el-form-item
          :label="dialogTitle ? '新大屏名称' : '大屏名称'"
          prop="screenName"
        >
          <el-input
            v-model="copyOrEditForm.screenName"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="大屏说明">
          <el-input
            type="textarea"
            v-model="copyOrEditForm.screenDesc"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyOrEditConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <div class="mini">
      <el-dialog
        title="发布"
        :visible.sync="uploadDialogVisible"
        width="30%"
        :before-close="uploadHandleClose"
        :close-on-click-modal="false"
      >
        <div class="dialogContent">确认发布大屏吗 ?</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="删除"
        :visible.sync="delDialogVisible"
        width="30%"
        :before-close="delHandleClose"
        :close-on-click-modal="false"
      >
        <div class="dialogContent">待发布大屏删除后不可恢复，确认删除吗 ?</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getLargeScreenList,
  getDictionaryByType,
  addLargeScreen,
  releaseLargeScreen,
  deleteLargeScreen,
  updateLargeScreenName,
} from "@/service/biTools";
import published from "./components/published";
import * as _api from "@/service/biTools";
export default {
  name: "biScreensList",
  components: {
    published,
  },
  data() {
    var validateScreenName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请填写"));
      } else if (value.length > 30) {
        return callback(new Error("  "));
      } else {
        callback();
      }
    };
    return {
      activeName: "unpublished",
      screenState: "",
      screenName: "",
      isLoading: true,
      screenStateList: [
        { label: "无线上版本", value: 0 },
        { label: "有线上版本", value: 1 },
      ],
      screenList: [],
      systemBackground: [],
      rules: {
        screenName: [{ validator: validateScreenName, trigger: "blur" }],
        backgroundIdSelect: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
      },
      addForm: {
        screenName: "",
        backgroundIdSelect: "",
        screenDesc: "",
      },
      copyOrEditForm: {
        screenName: "",
        screenDesc: "",
        copyOrEditId: 0,
      },
      uploadId: 0,
      deleteId: 0,
      addDialogVisible: false,
      copyDialogVisible: false,
      uploadDialogVisible: false,
      delDialogVisible: false,
      dialogTitle: 0,
      pageIndex: 1,
      pageSize: 6,
      totalNumber: 0,
    };
  },
  created() {
    this.getScreenList();
    this.getScreenFormList();
  },
  activated() {
    this.getScreenList();
  },
  watch: {
    activeName() {
      if (this.activeName == "unpublished") {
        this.getScreenList();
      }
    },
  },
  methods: {
    getScreenList() {
      this.isLoading = true;
      getLargeScreenList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        name: this.screenName,
        status: 0,
        isOnline: this.screenState,
        isModel: 0,
      }).then((res) => {
        this.screenList = res.list;
        this.totalNumber = res.total;
        this.isLoading = false;
      });
    },
    getScreenFormList() {
      getLargeScreenList({
        status: 0,
        isModel: 1,
      }).then((res) => {
        this.systemBackground = res.list;
      });
    },
    beforeGetScreenList() {
      this.pageIndex = 1;
      this.getScreenList();
    },
    add() {
      this.addFormInit();
      if (this.$refs["addForm"]) {
        this.$refs["addForm"].resetFields();
      }
      this.addDialogVisible = true;
    },
    addConfirm() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          console.log(111);
          let params = {
            name: this.addForm.screenName,
            remark: this.addForm.screenDesc,
            id: this.addForm.backgroundIdSelect,
          };
          addLargeScreen(params).then((res) => {
            console.log(res.id);
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.addDialogVisible = false;
            this.toScreenEdit(res.id);
            this.getScreenList();
          });
        } else {
          console.log(222);
        }
      });
    },
    toScreenEdit(id) {
      this.$router.push({
        name: "biScreensEditor",
        query: {
          id: id,
        },
      });
    },
    handleCommand(command) {
      switch (command.command) {
        case "1":
          this.copy(command.item);
          break;
        case "2":
          this.edit(command.item);
          break;
        case "3":
          // console.log("preview");
          this.toPreview(command.item);
          break;
        case "4":
          this.delete(command.item);
          break;
        default:
          break;
      }
    },
    beforeHandleCommand(command, item) {
      return {
        command: command,
        item: item,
      };
    },
    addFormInit() {
      this.addForm = {
        screenName: "",
        backgroundIdSelect: "",
        screenDesc: "",
      };
    },
    copyOrEditFormInit() {
      this.copyOrEditForm = {
        screenName: "",
        screenDesc: "",
        copyOrEditId: 0,
      };
    },
    copy(item) {
      this.copyOrEditFormInit();
      if (this.$refs["copyOrEditForm"]) {
        this.$refs["copyOrEditForm"].resetFields();
      }
      this.copyOrEditForm.copyOrEditId = item.id;
      this.dialogTitle = 1;
      this.copyDialogVisible = true;
    },
    edit(item) {
      this.copyOrEditFormInit();
      if (this.$refs["copyOrEditForm"]) {
        this.$refs["copyOrEditForm"].resetFields();
      }
      this.copyOrEditForm.screenName = item.name;
      this.copyOrEditForm.screenDesc = item.remark;
      this.copyOrEditForm.copyOrEditId = item.id;
      this.dialogTitle = 0;
      this.copyDialogVisible = true;
    },
    upload(item) {
      this.uploadId = item.id;
      this.uploadDialogVisible = true;
    },
    uploadConfirm() {
      releaseLargeScreen({
        id: this.uploadId,
      }).then((res) => {
        this.$message({
          message: "发布成功",
          type: "success",
        });
        this.uploadDialogVisible = false;
        this.getScreenList();
      });
    },
    copyOrEditConfirm() {
      let params = {
        name: this.copyOrEditForm.screenName,
        remark: this.copyOrEditForm.screenDesc,
        id: this.copyOrEditForm.copyOrEditId,
      };
      this.$refs["copyOrEditForm"].validate((valid) => {
        if (valid) {
          if (this.dialogTitle) {
            addLargeScreen(params).then((res) => {
              this.$message({
                message: "复制成功",
                type: "success",
              });
              this.copyDialogVisible = false;
              this.getScreenList();
            });
          } else {
            updateLargeScreenName(params).then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.copyDialogVisible = false;
              this.getScreenList();
            });
          }
        }
      });
    },
    deleteConfirm() {
      deleteLargeScreen({
        id: this.deleteId,
        isBackup: false,
      }).then((res) => {
        if (localStorage.getItem("previewScreenData_" + this.deleteId)) {
          localStorage.removeItem("previewScreenData_" + this.deleteId);
        }
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.delDialogVisible = false;
        this.getScreenList();
      });
    },
    delete(item) {
      this.deleteId = item.id;
      this.delDialogVisible = true;
    },
    backgroundSelect(item, index) {
      this.addForm.backgroundIdSelect = item.id;
    },
    addHandleClose() {
      this.addDialogVisible = false;
    },
    copyHandleClose() {
      this.copyDialogVisible = false;
    },
    uploadHandleClose() {
      this.uploadDialogVisible = false;
    },
    delHandleClose() {
      this.delDialogVisible = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.beforeGetScreenList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getScreenList();
    },
    toPreview(data) {
      _api
        .getScreenDetail({
          id: data.id,
        })
        .then((res) => {
          localStorage.setItem(
            "previewScreenData_" + data.id,
            JSON.stringify(res)
          );
          //预览大屏
          window.open(
            window.location.origin +
              "/bi_display.html#/home?id=" +
              data.id +
              "&opentype=1",
            "_blank"
          ); //opentype:1  预览 2:发布
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.screensList {
  background-color: #ffffff;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 40px;
  bottom: 10px;
}
::v-deep .el-form-item__content {
  line-height: 28px;
}
</style>

<style lang="scss">
.screensList {
  .el-tabs {
    padding: 10px 0px;
    height: 100%;
    .el-tabs__header {
      margin: 0px 10px 0px 10px;
      height: 34px;
      background: #e4f1ff;
      border: 0px;
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          height: 34px;
          .el-tabs__nav {
            background: #e4f1ff;
            margin-left: 10px;
            margin-top: 6px;
            height: 28px;
            border: 0;
            display: flex;
            // background: blue;
            // padding: 6px 9px 0;
            .el-tabs__item {
              // height: 28px;
              text-align: center;
              padding: 3px 16px;
              // height: unset !important;
              // line-height: unset;
              height: 28px;
              line-height: 28px;
              // vertical-align: center;
              border: none;
              background: #abd2ff;
              color: #3f5384;
              font-weight: 700;
              padding: 3px 16px;
              display: flex;
              align-items: center;
              border-radius: 4px 4px 0 0;
            }
            .el-tabs__item + .el-tabs__item {
              margin-left: 4px;
            }
          }
          .is-active {
            border-bottom: 0;
            background: #ffffff !important;
          }
        }
      }
    }
    .el-tabs__content {
      position: absolute;
      top: 44px;
      left: 0px;
      right: 0px;
      bottom: 10px;
      .el-tab-pane {
        .unpublishedList {
          height: 100%;
          .iptRow {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
            }
            .iptRowLeft {
              display: flex;
              align-items: center;
              // img[src=""] {
              //   opacity: 0;
              // }
            }
            .iptRowRight {
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
            .iptRowText {
              color: #3b5370;
              font-size: 14px;
              padding-right: 14px;
            }
            .el-select {
              padding-right: 20px;
            }
            .el-input {
              width: 180px;
            }
          }
          .screenList {
            position: absolute;
            top: 43px;
            bottom: 67px;
            left: 0px;
            right: 0px;
            overflow: scroll;
            overflow-x: hidden;
            // .screenBox:nth-child(3n) {
            //   border-right: 0px solid #ffffff;
            // }
            .screenBox {
              height: calc(50%);
              border-left: 10px solid #ffffff;
              border-top: 5px solid #ffffff;
              border-bottom: 5px solid #ffffff;
              .screenContent {
                height: 100%;
                width: 100%;
                border: 1px solid #d7dae0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .screenTitle {
                  margin: 10px 12px;
                  display: flex;
                  // justify-content: space-between;
                  align-items: center;
                  .DocName {
                    color: #111111;
                    font-size: 14px;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: block;
                    // .el-dropdown {
                    // }
                  }
                  img {
                    height: 8px;
                    width: 8px;
                    cursor: pointer;
                  }
                  .wwhite {
                    flex: 1;
                  }
                  .icons {
                    display: flex;
                    justify-content: space-around;
                    img {
                      width: 16px;
                      height: 16px;
                      cursor: pointer;
                    }
                  }
                }
                .screenDetail {
                  height: 100%;
                  border: 1px solid #e6e6e6;
                  background: #f7f7f7;
                  margin: 0px 12px;
                  position: relative;
                  .imgBox {
                    // background-size: contain;
                    // background-repeat: no-repeat;
                    // background: blue;
                    position: absolute;
                    left: 74px;
                    top: 24px;
                    bottom: 24px;
                    right: 74px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                      max-height: calc(100%);
                      display: block;
                      max-width: calc(100%);
                    }
                  }
                  .publishBox {
                    width: 64px;
                    height: 64px;
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                .screenDesc {
                  margin: 10px 12px 12px 12px;
                  display: flex;
                  align-items: center;
                  .ratio {
                    background: #e8f2fd;
                    color: #0075ff;
                    font-size: 12px;
                    width: 41px;
                    height: 20px;
                    border-radius: 10px;
                    text-align: center;
                    line-height: 20px;
                  }
                  .desc {
                    color: #999999;
                    font-size: 14px;
                    margin-left: 8px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                }
              }
            }
            // .screen + .screen {
            //   margin-left: 10px;
            // }
          }
          .noData {
            position: absolute;
            top: 43px;
            bottom: 110px;
            left: -5px;
            right: 0px;
            overflow: scroll;
            display: flex;
            justify-content: center;
            align-items: center;
            .noDataBox {
              width: 320px;
              height: 205px;
              background-image: url("../../../assets/images/screenList/no-data.png");
              background-size: 100% 100%;
            }
          }
          .el-pagination {
            position: absolute;
            bottom: 0px;
            .el-pagination__total {
              float: left;
            }
            .el-pagination__sizes {
              float: left;
            }
          }
        }
      }
    }
  }
  .el-dialog {
    width: 485px !important;
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
    }
    .el-dialog__body {
      padding-bottom: 0px;
      padding-top: 0px;
      width: 485px;
      .el-form {
        width: 445px;
      }
    }
    .el-dialog__footer {
      padding-top: 0px;
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
    .el-form-item__label {
      line-height: 28px !important;
      padding: 0 12px 0 0;
    }
    .systemBox {
      height: 234px;
      border: 1px solid #d7dae0;
      border-radius: 4px;
      overflow: scroll;
      padding: 0px 5px;
      .colBox {
        height: 146px;
        margin-top: 10px;
        .screenBox {
          height: 100%;
          margin: 0px 5px;

          .backgroundBox {
            height: 120px;
            background: #e6e6e6;
            position: relative;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
            cursor: pointer;
            .backgroundContent {
              position: absolute;
              top: 20px;
              bottom: 20px;
              left: 8px;
              right: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                height: 100%;
              }
            }
          }
          .backgroundDesc {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .backgroundName {
              color: #333333;
              font-size: 14px;
            }
            .backgroundRatio {
              background: #e8f2fd;
              color: #0075ff;
              font-size: 12px;
              width: 41px;
              height: 20px;
              border-radius: 10px;
              text-align: center;
              line-height: 20px;
            }
          }
        }
        &.itemActive {
          .backgroundBox {
            height: 120px;
            background: #e6e6e6;
            position: relative;
            cursor: pointer;
            border: 1px solid #0075ff;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .mini {
    .el-dialog {
      width: 300px !important;
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
      .el-form-item__label {
        line-height: 28px !important;
        padding: 0 12px 0 0;
      }
    }
    .dialogContent {
      font-size: 14px;
      color: #111111;
    }
  }
  // .dialogMini {
  //   width: 300px;
  // }
}
</style>
