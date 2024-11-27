<!-- 指标配置帮助 -->
<template>
  <div>
    <el-dialog :close-on-click-modal=false :visible="helperDialogVisible" @close="closeEvent" width="60%">
      <template>
        <div slot="title" class="title-style">
          <div class="blue-box"></div>
          <span class="title-text">帮助</span>
        </div>
      </template>
      <div class="content">
        <div class="left-part">
          <div class="left-top">
            <el-input class="input-style" v-model="input" placeholder="请输入指标名称">
              <template slot="append">
                <el-button slot="append" icon="el-icon-search" @click="searchClick"> </el-button>
              </template>
            </el-input>
          </div>
          <div v-if="list.length > 0" class="left-btn">
            <div
              class="common-item"
              :class="{ 'active-item': clickIndex == index }"
              v-for="(item, index) in list"
              :key="item.id"
              @click="getIndex(index)"
            >
              <div class="blue-box"></div>
              <div class="item-text">{{ item.name }}</div>
            </div>
          </div>
          <div v-else class="left-btn">
            <img class="no-content" src="~@/assets/svg/noContent.svg" alt="" />
          </div>
        </div>
        <div class="right-part">
          <div class="title-box">
            <div class="blue-box"></div>
            <div class="text" v-if="list.length > 0">{{ list[clickIndex].name }}</div>
          </div>
          <div class="content-box" v-if="list.length > 0">
            <div class="info">
              <div class="info-title">指标定义</div>
              <div class="info-content">
                {{ list[clickIndex].definition }}
              </div>
            </div>
            <div class="info">
              <div class="info-title">计算方法</div>
              <div class="info-content">
                {{ list[clickIndex].method }}
              </div>
            </div>
            <div class="info">
              <div class="info-title">指标说明</div>
              <div class="info-content">
                {{ list[clickIndex].remark }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="helperDialogCloseEvent" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    helperDialogVisible: {
      type: Boolean,
      default: false,
    },
    list: Array,
  },
  name: "",
  components: {},
  data() {
    return {
      formInline: {},
      input: "",
      clickIndex: 0,
      activeNavigation: 0,
    }
  },
  created() {},
  methods: {
    helperDialogCloseEvent(flag) {
      this.$emit("helperDialogCloseEvent", flag)
    },
    getIndex(index) {
      this.clickIndex = index
    },
    closeEvent(falg) {
      this.$emit("closeEvent", falg)
    },
    searchClick() {
      this.$emit("searchClick", this.input)
      this.clickIndex=0
    },
  },
}
</script>
<style lang="scss" scoped>
.title-style {
  display: flex;
  align-items: center;
  .blue-box {
    width: 4px;
    background: #0075ff;
    height: 16px;
    display: inline-block;
    margin-right: 10px;
  }
  .title-text {
    font-family: "Microsoft YaHei";
    font-size: 18px;
  }
}
.content {
  display: flex;
  .left-part {
    width: 41.5%;
    .left-top {
      height: 41px;
      .input-style {
        padding: 10px 0px 10px 5px;
      }
    }
    .left-btn {
      max-height: 404px;
      height: 404px;
      margin: 10px 0px 0px 5px;
      overflow: scroll;
      width: 98%;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      .no-content {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .common-item {
        line-height: 34px;
        .item-text {
          margin-left: 13px;
        }
      }
      .active-item {
        line-height: 34px;
        background-color: #e4f1ff;
        color: #00abd5;
        display: flex;
        .blue-box {
          width: 4px;
          background: #0075ff;
          height: 34px;
        }
        .item-text {
          margin-left: 9px;
        }
      }
    }
  }
  .right-part {
    width: 70%;
    margin: 10px 10px 0px 20px;
    border: 1px solid #e6e6e6;
    .title-box {
      display: flex;
      align-items: center;
      height: 30px;
      background: #fbfbfb;
      border-bottom: 1px solid #e6e6e6;
      .blue-box {
        width: 4px;
        background: #0075ff;
        height: 16px;
        display: inline-block;
        margin-right: 10px;
      }
      .text {
        font-size: 14px;
        line-height: 22px;
      }
    }
    .content-box {
      max-height: 413px;
      overflow: scroll;
      .info {
        padding: 10px 14px 0px 14px;
        display: flex;
        .info-title {
          height: 22px;
          min-width: 56px;
          margin-right: 14px;
          font-size: 14px;
          line-height: 22px;
          color: #3b5370;
        }
        .info-content {
          font-family: "Microsoft YaHei";
          font-size: 14px;
          line-height: 22px;
          color: #111111;
        }
      }
    }
  }
}
::v-deep .el-button--default {
  width: 28px;
  padding: 0;
  // margin: -10px;
}
::v-deep .el-icon-search {
  padding-left: 14px;
}
::v-deep .el-input-group__append {
  width: 28px;
}

::v-deep .el-dialog__body {
  padding: 10px 20px 20px 24px;
}
::v-deep .el-dialog__footer {
  padding-top: 0px;
}
// ::v-deep .el-input__inner{
//   width: 260px;
// }
</style>
