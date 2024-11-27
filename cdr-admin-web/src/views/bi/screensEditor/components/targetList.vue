<!-- 指标 -->
<template>
  <div class="targetContent" :class="{'fold':fold}">
    <div v-if="!fold" class="targetSide">
      <el-input placeholder="请输入指标名称" class="targetSearch" v-model="searchText" @input="searchTarget">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTarget"></i>
        <!-- <el-button slot="append"  @click="searchTarget"></el-button> -->
      </el-input>
      <div class="targetList" v-if="targetList.length>0" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="item in targetList" :key="item.id" :name="item.id">
            <template slot="title">
              <p class="collapseTitle" :title="item.name">{{item.name}}</p>
            </template>
            <div v-if="item.chartList.length==0">
              <div class="cache" v-if="item.isLoading == true" v-loading="item.isLoading == true" element-loading-background="rgba(0, 0, 0, 0.8)"></div>
              <div v-else class="noData">
                <h3>暂无数据</h3>
              </div>
            </div>
            <div v-else v-for="(i,index) in item.chartList" :key="index" class="target" v-loading="item.chartList.length==0">
              <div class="targetsign" @click="useTarget(item,i)">
                <img :src="i.thumbnail?i.thumbnail:'@/assets/images/bi/goto-icon.svg'" class="targetimg" />
              </div>
              <p class="targettitle" @click.stop="jumpPage(item,i)">
                <span :title="i.name">{{i.name}}</span>
                <img src="@/assets/images/bi/goto-icon.svg" class="goto-icon" />
              </p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="targetList.length==0" class="noTarget">暂无指标</div>
    </div>
    <div class="side" @click="foldSide">
      <img v-if="!fold" src="~@/assets/images/bi/fold.png" width="16" height="16" alt />
      <img v-else src="~@/assets/images/bi/fold_close.png" width="16" height="16" alt />
      指标列表
    </div>
  </div>
</template>
<script>
import * as _api from '@/service/biTools';
export default {
  name: 'targetList',
  components: {},
  props: {
    fold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      targetList: [],
      chartList: [],
      activeNames: [],
      searchText: '',
      throttle: true,
    };
  },
  created() {
    this.getStatisticsClassList(false);
  },
  methods: {
    searchTarget() {
      this.getStatisticsClassList(true);
    },
    handleChange(val) {
      // console.log(val);
      if (val.length > 0) {
        let item = this.targetList.filter((m) => {
          return m.id == val[val.length - 1];
        });
        this.getStatisticsList(item[0], false);
      }
    },
    useTarget(parent, item) {
      _api
        .getStatisticsDetail({
          id: item.id,
        })
        .then((res) => {
          this.$emit('useTarget', parent, res);
        });
    },
    foldSide() {
      // this.fold = !this.fold;
      this.$emit('foldChange', this.flod);
    },
    jumpPage(item, i) {
      this.$router.push({
        name: 'biTargetsEditor',
        query: {
          id: i.id,
        },
      });
    },
    //获取指标分类列表
    getStatisticsClassList(status) {
      _api
        .getStatisticsClassList({
          pageNo: 1,
          pageSize: 1000,
          name: '',
          statisticsName: status ? this.searchText : '',
        })
        .then((res) => {
          this.targetList = [];
          res.list.forEach((i) => {
            i.chartList = [];
            i.isLoading = status ? false : true;
          });
          this.targetList = res.list;
          if (this.targetList.length > 0) {
            this.getStatisticsList(this.targetList[0], status);
          }
        });
    },
    //获取某分类下的指标列表
    getStatisticsList(item, status) {
      _api
        .getStatisticsList({
          classId: item.id,
          // "largeScreenId": this.$route.query.id,
          name: this.searchText,
          pageNo: 1,
          pageSize: 1000,
          // "typeId": 0
        })
        .then((res) => {
          this.targetList.forEach((i) => {
            if (i.id == item.id) {
              i.chartList = res.list;
              i.isLoading = false;
            } else {
            }
          });
          // if (this.throttle) {
          //   this.activeNames.push(this.targetList[0].id);
          //   this.throttle = false;
          // }
          if (status) {
            this.activeNames = [];
            this.activeNames.push(this.targetList[0].id);
          }
        });
    },
  },
};
</script>
<style lang='scss'>
.targetContent {
  .targetSide {
    .targetSearch {
      .el-input__inner {
        background: #000;
        border: none;
        border-radius: 4px 0 0 4px;
        color: #fff;
      }
      .el-input__suffix {
        color: #fff;
        background: #3a3d42;
        border-radius: 0 4px 4px 0;
        right: 0px;
        width: 28px;
      }
    }
    .el-collapse-item__content {
      border-top: 0.5px solid rgba(255, 255, 255, 0.2);
      padding: 10px;
      background: #1e2024;
      img {
        height: 100px;
      }
    }
    .el-collapse-item {
      margin-bottom: 1px !important;
      background: #1e2024;
      // box-shadow: 0px 0.5px 0px rgba(255, 255, 255, 0.2);
      .el-collapse-item__header {
        background: #1e2024 !important;
        font-family: 'Microsoft YaHei';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #ffffff !important;
        padding-left: 10px;
        border: none !important;
        // box-shadow: 0px 0.5px 0px rgba(255, 255, 255, 0.2);
        // border-bottom: 0.5px solid rgba(255, 255, 255, 0.2)!important;
        border-top: 0.5px solid rgba(255, 255, 255, 0.2) !important;
        .is-active {
          transform: rotate(180deg) !important;
        }
        // .el-collapse-item__arrow {
        //   width: 8px;
        //   height: 8px;
        // }
        .el-collapse-item__arrow:before {
          content: '';
          background: url(../../../../assets/images/bi/arrow-down.png) no-repeat;
          background-size: cover;
          display: block;
          width: 8px;
          height: 8px;
        }
        &:first-child() {
          border-bottom: none;
        }
      }

      // .el-icon-arrow-right:before{
      //   content: url('/assets/images/bi/choice.svg')
      // }
    }
  }
}
</style>
<style lang='scss' scoped>
.targetContent {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #1e2024;
  transition: width 0.5s;
  -moz-transition: width 0.5s; /* Firefox 4 */
  -webkit-transition: width 0.5s; /* Safari and Chrome */
  -o-transition: width 0.5s; /* Opera */
  width: 270px;
  .targetSide {
    width: 240px;
    .targetSearch {
      margin: 10px;
      background: #000;
      width: 220px;
      .el-input__inner {
      }
    }
    .targetList {
      box-shadow: 0.5px 0px 0px rgba(255, 255, 255, 0.2);
      margin-top: 1px;
      // border-top: 0.5px rgba(255, 255, 255, 0.2) solid;
      height: calc(100% - 50px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .el-collapse {
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.2) !important;
      }
      .collapseTitle {
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .cache {
        background-color: #1e2024;
        height: 100px;
      }
      .noData {
        height: 100px;
      }
      h3 {
        margin: 0;
        text-align: center;
        color: #fff;
        padding: 20px 0;
      }
      .target {
        // height: 200px;
        padding-bottom: 10px;
        text-align: center;

        .targetsign {
          width: 220px;
          height: 140px;
          margin-bottom: 4px;
          background: #000000;
          cursor: pointer;
          .targetimg {
            margin-top: 20px;
            max-width: 100%;
          }
        }
        .targettitle {
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: #b2b2b2;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          margin: 0;
          max-height: 22px;
          > span {
            margin-right: 24px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            width: 200px;
          }
          .goto-icon {
            width: 16px;
            height: 16px;
            position: absolute;
            right: 0;
            top: 3px;
            cursor: pointer;
          }
        }
      }
    }
    .noTarget {
      color: #fff;
      text-align: center;
      margin-top: 100px;
    }
  }
  .side {
    width: 30px;
    box-shadow: inset 0.5px 0px 0px rgba(255, 255, 255, 0.25);
    padding: 10px 6px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    img {
      cursor: pointer;
      margin-bottom: 6px;
    }
  }
}
.fold {
  width: 30px;
}
</style>