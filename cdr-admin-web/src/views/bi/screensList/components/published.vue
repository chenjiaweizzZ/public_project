<!-- 
@description 大屏列表的已发布分页页面
@author 陈家伟
@time 2022/5/13
 -->
<template>
  <div class="published">
    <div class="iptRow">
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
    <div
      class="screenPublishedList"
      ref="screenPublishedList"
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
            <div class="DocName" :title="screen.name">{{ screen.name }}</div>
            <div class="icons">
              <div class="upload">
                <img
                  src="../../../../assets/images/screenList/link.png"
                  @click="copyLink(screen)"
                />
              </div>
              <el-row style="width: 10px"></el-row>
              <div class="upload">
                <img
                  src="../../../../assets/images/screenList/del.png"
                  @click="del(screen)"
                />
              </div>
              <el-row style="width: 10px"></el-row>
              <div class="upload">
                <img
                  src="../../../../assets/images/screenList/preview.png"
                  @click="preview(screen)"
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
          </div>
          <div class="screenDesc">
            <div class="ratio">{{ screen.ratio }}</div>
            <div class="desc" :title="screen.remark">{{ screen.remark }}</div>
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
    <div class="miniPublished">
      <el-dialog
        title="删除"
        :visible.sync="delDialogVisible"
        width="30%"
        :before-close="delHandleClose"
      >
        <div class="dialogContent">
          您将删除已发布版本的大屏，检测到该大屏已发布版本与待发布版本内容不一致，删除前可备份至待发布版本，确认删除吗
          ?
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button @click="delConfirm(false)">直接删除</el-button>
          <el-button type="primary" @click="delConfirm(true)"
            >备份并删除</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="删除"
        :visible.sync="delDialogVisible2"
        width="30%"
        :before-close="delHandleClose2"
        :close-on-click-modal="false"
      >
        <div class="dialogContent">已发布大屏删除后不可恢复，确认删除吗 ?</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm2">确 定</el-button>
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
  isChange,
  deleteLargeScreen,
} from "@/service/biTools";
import * as _api from "@/service/biTools";
export default {
  name: "published",
  components: {},
  props: {
    activeName: {
      default: "published",
    },
  },
  data() {
    return {
      screenName: "",
      screenList: [],
      delId: 0,
      delDialogVisible: false,
      delDialogVisible2: false,
      isLoading: true,
      pageIndex: 1,
      pageSize: 6,
      totalNumber: 0,
    };
  },
  created() {
    this.getScreenList();
  },
  watch: {
    activeName() {
      if (this.activeName == "published") {
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
        status: 1,
        isModel: 0,
      }).then((res) => {
        // console.log(res);
        this.screenList = res.list;
        this.totalNumber = res.total;
        this.isLoading = false;
      });
    },
    beforeGetScreenList() {
      this.pageIndex = 1;
      this.getScreenList();
    },
    del(item) {
      // console.log(item);
      this.delId = item.id;
      isChange({
        id: item.id,
      }).then((res) => {
        if (res) {
          this.delDialogVisible = true;
        } else {
          this.delDialogVisible2 = true;
        }
      });
    },

    copyLink(data) {
      if (data.id) {
        // let copyText = "url地址?" + data.id;
        let copyText =
          window.location.origin +
          "/bi_display.html#/home?id=" +
          data.id +
          "&opentype=2";
        _api
          .getScreenDetail({
            id: data.id,
          })
          .then((res) => {
            localStorage.setItem(
              "previewScreenData_" + data.id,
              JSON.stringify(res)
            );
            let copyText =
              window.location.origin +
              "/bi_display.html#/home?id=" +
              data.id +
              "&opentype=2";
          });
        let el = document.createElement("textarea");
        el.value = copyText;
        el.setAttribute("readonly", "");
        el.style = {
          position: "absolute",
          left: "-9999px",
        };
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        this.$message({
          message: "已复制大屏链接",
          type: "success",
        });
      } else {
        this.$message.error("复制链接失败，请重试");
      }
    },
    preview(data) {
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
              "&opentype=2",
           "displayScreen_"+data.id
          ); //opentype:1  预览 2:发布
        });
      // window.open(window.location.origin + '/bi_display.html#/home?id=' + data.id + '&opentype=2', '_blank'); //opentype:1  预览 2:发布
    },
    delConfirm(isCopy) {
      // console.log(isCopy);
      // console.log(this.delId);
      deleteLargeScreen({
        id: this.delId,
        isBackup: isCopy,
      }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getScreenList();
        this.delDialogVisible = false;
      });
    },
    delConfirm2() {
      console.log(this.delId);
      deleteLargeScreen({
        id: this.delId,
        isBackup: false,
      }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getScreenList();
        this.delDialogVisible2 = false;
      });
    },
    delHandleClose() {
      this.delDialogVisible = false;
    },
    delHandleClose2() {
      this.delDialogVisible2 = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.beforeGetScreenList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getScreenList();
    },
  },
};
</script>
<style lang="scss" scoped></style>

<style lang="scss">
.published {
  .iptRow {
    display: flex;
    align-items: center;
    padding: 10px;
    .iptRowText {
      color: #3b5370;
      font-size: 14px;
      padding-right: 14px;
    }
    .el-input {
      width: 180px;
    }
  }

  .screenPublishedList {
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
        width: calc(100%);
        border: 1px solid #d7dae0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .screenTitle {
          margin: 10px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .DocName {
            color: #111111;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            img {
              height: 8px;
              width: 8px;
              cursor: pointer;
            }
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
      background-image: url("../../../../assets/images/screenList/no-data.png");
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

  .miniPublished {
    .el-dialog {
      width: 360px !important;
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
        width: 100%;
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
}
</style>
