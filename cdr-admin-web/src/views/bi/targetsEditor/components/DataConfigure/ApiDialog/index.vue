<!-- 接口替换、参数管理 -->
<template>
  <el-dialog
    :visible.sync="realUseShow"
    :width="flag === 'create' ? '1100px' : '800px'"
    :close-on-click-modal="false"
    @close="closeEvent"
  >
    <!-- <el-dialog :visible.sync="realUseShow" :style="{'width': flag==='create'?'2100px':''}"  :close-on-click-modal="false"> -->
    <template>
      <div slot="title" class="title-style">
        <div class="blue-box"></div>
        <span class="title-text" v-if="flag === 'create'">接口替换</span>
        <span class="title-text" v-if="flag === 'management'">入参管理</span>
      </div>
    </template>
    <div>
      <!-- 入参管理 -->
      <!-- 普通模式 -->
      <div
        class="content"
        v-show="flag === 'management' && modeFlag === 'normal'"
      >
        <div class="right-part">
          <div class="right-top">
            <div class="demo-form-inline">
              <div><span>接口编码 </span>{{ requestCode }}</div>
              <!-- 普通模式按钮 -->
              <!-- <div style="display: flex" v-if="modeFlag === 'normal'" @click="changeSeniorEvent">
                <div><img src="~@/assets/svg/changeMode.svg" alt="" /></div>
                <div><span style="color: #0075ff">普通模式 </span></div>
              </div> -->
              <!-- 高级模式按钮 -->
              <!-- <div style="display: flex" v-if="modeFlag === 'senior'" @click="changeNormalEvent">
                <div><img src="~@/assets/svg/changeMode.svg" alt="" /></div>
                <div><span style="color: #0075ff">高级模式 </span></div>
              </div> -->
            </div>
            <el-table
              :data="parsmsList"
              border
              stripe
              :header-cell-style="{ 'text-align': 'center' }"
              height="168"
              style="width: 100%; color: #111111"
            >
              <el-table-column
                label="入参字段"
                prop="key"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="remark"
                label="参数描述"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="value"
                label="参数值"
                show-overflow-tooltip
              >
                <template slot="header">
                  参数值<img
                    class="header-img-style"
                    src="~@/assets/svg/problem.svg"
                    alt=""
                /></template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" style="input-height"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="right-btn">
            <span class="span-text">调试结果</span>
            <div ref="paramsDebugPanel" class="tiaoshi-result"></div>
          </div>
        </div>
      </div>
      <!-- 高级模式 -->
      <!-- <div class="content" v-show="flag === 'management' && modeFlag === 'senior'">
        <div class="senior-top">
          <div><span style="margin-right: 14px">接口编码</span>{{ activeCode }}</div>
          <div>
            <div style="display: flex" v-if="modeFlag === 'normal'" @click="changeSeniorEvent">
              <div><img src="~@/assets/svg/changeMode.svg" alt="" /></div>
              <div><span style="color: #0075ff">普通模式 </span></div>
            </div>
            <div style="display: flex" v-if="modeFlag === 'senior'" @click="changeNormalEvent">
              <div><img src="~@/assets/svg/changeMode.svg" alt="" /></div>
              <div><span style="color: #0075ff">高级模式 </span></div>
            </div>
          </div>
        </div>
        <div class="senior-top-two">
          <div>
            <label style="margin-right: 14px">请求方式</label>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                style="width: 100%"
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="top-form" style="margin: 10px 20px; align-items: center">
            <label style="width: 100px; margin-right: 14px">请求地址 </label><el-input></el-input>
          </div>
        </div>
        <div class="senior-mid">
          <div class="senior-mid-left">
            <div class="title-box">
              <div class="blue-box"></div>
              <div class="text">请求头</div>
            </div>
            <div class="info"></div>
          </div>
          <div class="senior-mid-right">
            <div class="title-box">
              <div class="blue-box"></div>
              <div class="text">请求体</div>
            </div>
            <div class="info"></div>
          </div>
        </div>
        <div class="senior-btn">
          <span class="span-text">调试结果</span>
          <div class="tiaoshi-result"></div>
        </div>
      </div> -->
    </div>
    <!-- 接口替换 -->
    <el-tabs
      v-show="flag === 'create'"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <el-tab-pane label="构建工具选取">
        <div class="btn-content">
          <div class="left-part">
            <el-form
              :inline="true"
              :model="formInline"
              class="demo-form-inline"
            >
              <el-form-item label="接口编码">
                <el-input
                  v-model="formInline.code"
                  placeholder="请输入接口编码"
                  style="width: 130px;"
                  class="input-height-style"
                ></el-input>
              </el-form-item>
              <el-form-item label="接口描述">
                <el-input
                  v-model="formInline.describe"
                  class="input-height-style"
                  placeholder="请输入接口描述"
                  style="width: 130px"
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
            </el-form>
            <el-table
              :data="listDatas ? listDatas : listData"
              :header-cell-style="{ 'text-align': 'center' }"
              border
              stripe
              height="378"
              style="width: 100%; color: #111111"
              v-el-table-infinite-scroll="load"
              element-loading-text="数据获取中"
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" @click="showDetail(scope.row)"
                    >查看</el-button
                  >
                  <el-button type="text" @click="useEvent(scope.row)"
                    >使用</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="apiCode" label="接口编码" width="160">
              </el-table-column>
              <el-table-column
                prop="apiNotes"
                label="接口描述"
                width="258"
                show-overflow-tooltip=""
              >
              </el-table-column>
            </el-table>
            <el-alert
              v-if="isflag"
              title="正在努力加载中..."
              type="success"
              center
              :closable="false"
              show-icon
            ></el-alert>
            <el-alert
              v-if="isMore"
              title="没有更多啦！"
              type="warning"
              center
              show-icon
            ></el-alert>
          </div>
          <div class="right-part">
            <div
              class="right-top"
              v-loading="rightLoading"
              element-loading-spinner="el-icon-loading"
            >
              <div class="demo-form-inline">
                <div>
                  <span>请求体</span>
                </div>
                <div v-if="interfaceList.length > 0">
                  <span>接口编码</span>
                  {{ activeCode ? activeCode : interfaceList[0].apiCode }}
                </div>
              </div>
              <el-table
                :data="detailreallyList"
                :header-cell-style="{ 'text-align': 'center' }"
                border
                height="168"
                style="width: 100%; color: #111111"
              >
                <el-table-column
                  label="入参字段"
                  prop="key"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="参数描述"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="参数值"
                  show-overflow-tooltip
                >
                  <template slot="header">
                    参数值<img
                      class="header-img-style"
                      src="~@/assets/svg/problem.svg"
                      alt=""
                  /></template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.value"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="right-btn">
              <span class="span-text">调试结果</span>
              <div ref="debuggingPanel" class="tiaoshi-result"></div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- TODO自定义接口功能暂不开放 -->
      <el-tab-pane :disabled="true" label="自定义接口">
        <div class="diy-content">
          <div class="top-form">
            <label style="width: 70px; line-height: 22px">获取方式 </label
            ><el-select v-model="value" placeholder="请选择">
              <el-option
                style="width: 100%"
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="top-form" style="margin: 10px 0px">
            <label style="width: 75px; line-height: 22px">接口地址 </label
            ><el-input></el-input>
          </div>
          <div class="btn-part">
            <div class="left-part">
              <div class="left-top">
                <span class="span-text">请求头</span>
                <div class="response-title"></div>
              </div>
              <div class="left-btn">
                <span class="span-text">请求体</span>
                <div class="response-body"></div>
              </div>
            </div>
            <div class="left-btn">
              <span class="span-text">请求体</span>
              <div class="response-body"></div>
            </div>
          </div>
          <div class="right-part">
            <span class="span-text">调试结果</span>
            <el-table
              :data="tableData"
              :header-cell-style="{ 'text-align': 'center' }"
              border
              height="378"
              style="width: 100%; color: #111111; margin: 10px 0px"
            >
              <el-table-column label="入参字段" prop="date" width="172">
              </el-table-column>
              <el-table-column prop="name" label="参数描述" width="172">
              </el-table-column>
              <el-table-column
                prop="address"
                label="参数值"
                width="172"
                show-overflow-tooltip
              >
                <template slot="header">
                  参数值<img
                    class="header-img-style"
                    src="~@/assets/svg/problem.svg"
                    alt=""
                /></template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="button-style"
        size="mini"
        @click="tryItOutEvent"
        style="height: 28px"
        >调 试</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="submitEvent"
        :loading="btnLoading"
        style="height: 28px"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import BlueIconTitle from '@/components/BlueIconTitle.vue'
import * as _biApi from '@/service/biTools'
import _ from '@/utils'
import { mapMutations } from 'vuex'
import { mount } from 'object-visualizer'
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-javascript' // 默认设置的语言模式
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/javascript'
import { number } from 'echarts'
import Vue from 'vue'
import elTableInfiniteScroll from 'el-table-infinite-scroll'

Vue.use(elTableInfiniteScroll)
export default {
  name: '',
  components: {
    BlueIconTitle,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    classId: {
      type: Number,
    },
    flag: {
      type: String,
    },
    parsmsList: {
      type: Array,
    },
    listData: {
      type: Array,
    },
    detailList: {
      type: Array,
    },
    requestCode: {
      type: String,
      default: '',
    },
    dataParams: {
      type: Object,
      default: {},
    },
    currentID: {
      type: Number,
    },
    pages: {
      type: Number,
    },
    interfaceList: {
      type: Array,
      default() {
        return [
          {
            apiCode: '',
            apiDescribe: '',
            id: '',
          },
        ]
      },
    },
    detailreallyLists: {
      type: Array,
    },
  },

  data() {
    return {
      realUseShow: false,
      isShow: false,
      btnLoading: false,
      rightLoading: false,
      formInline: {
        code: '',
        describe: '',
      },
      tableData: [],
      options: [
        {
          value: 'get',
          label: 'get',
        },
        {
          value: 'post',
          label: 'post',
        },
      ],
      value: '',
      apiVersion: '', //接口版本号
      activeID: '',
      activeCode: '',
      modeFlag: 'normal', //普通模式
      busy: false, //滚动加载
      requestCodes: this.requestCode,
      isflag: false,
      isMore: false,
      pageNo: 0,
      listDatas: [],
      loading: true,
      detailreallyList: this.detailreallyLists,
    }
  },
  watch: {
    requestCodes() {
      if (this.requestCodes) {
        this.$emit('updateRequestCode', this.requestCodes)
      }
    },
    show(currentData) {
      this.realUseShow = currentData
    },
    detailreallyLists(currentData) {
      this.detailreallyList = currentData
    },
    realUseShow(currentData) {
      this.$emit('update:show', currentData)
      if (currentData) {
        this.$nextTick(() => {
          this.detailreallyList = []
          mount(this.detailreallyList, this.$refs.debuggingPanel, {
            rootName: 'Debugging Result',
            expandOnCreatedAndUpdated(path) {
              /* path.length为层级 0为第一级 下面逻辑为只展开对象第一级 */
              if (path.length === 0) return true
              else return false
            },
          })
          mount(this.parsmsList, this.$refs.paramsDebugPanel, {
            rootName: 'Debugging Result',
            expandOnCreatedAndUpdated(path) {
              /* path.length为层级 0为第一级 下面逻辑为只展开对象第一级 */
              if (path.length === 0) return true
              else return false
            },
          })
        })
      }
    },
  },
  created() {
    this.value = this.options[0].value
    this.init()
    // this.activeCode = this.requestCode
    // console.log(this.activeCode,"this.activeCode111");
  },
  methods: {
    ...mapMutations('SQLConfig', ['SETAPIDATA']),
    searchClick() {
      let params = {
        status: '1',
        apiCode: '',
        apiVersion: '',
        apiNotes: '',
        pageSize: 30,
      }
      params.apiCode = this.formInline.code
      params.apiNotes = this.formInline.describe
      _biApi
        .getSelectConfigList(params)
        .then((res) => {
          this.listDatas = res.list
          console.log(this.listData, 'this.listData')
        })
        .catch(() => {})
    },
    showDetail(data) {
      //跳转到cdr页面，并且传递一个id
      this.realUseShow = false
      this.SETAPIDATA(data)
      this.$router.push('/SQLConfig')
    },
    useEvent(row) {
      this.activeID = row.id
      this.rightLoading = true
      let params = {
        id: this.activeID,
        selectSon: '',
      }
      this.detailreallyList = []
      _biApi
        .getSelectConfigDetail(params)
        .then((res) => {
          if (Object.keys(res.parameters).length !== 0) {
            let obj = res.parameters
            Object.keys(obj).forEach((key) => {
              let item = {
                key: key,
                remark: obj[key],
                value: this.dataParams[key],
              }
              this.detailreallyList.push(item)
            })
          }
          // this.requestCodes = row.apiCode
          this.activeCode = row.apiCode
          // this.$emit('update:requestCode', row.apiCode);
          console.log(this.requestCode, 'this.requestCode')
          // this.requestCode = row.apiCode
          this.activeVersion = row.apiVersion
          this.rightLoading = false
        })
        .catch(() => {})
    },
    tryItOutEvent() {
      if (!this.requestCode) return _.showMessage('warning', '请选择接口')
      let parameters = {}
      if (this.flag === 'create') {
        this.detailreallyList.forEach((i) => {
          parameters[i.key] = i.value || ''
        })
      } else {
        this.parsmsList.forEach((i) => {
          parameters[i.key] = i.value || ''
        })
      }
      //向父组件发送调试数据
      // this.$emit("detailList", this.detailList)
      _biApi
        .selectDataList({
          apiCode: this.activeCode ? this.activeCode : this.requestCode,
          apiVersion: this.activeVersion,
          pageNo: 0,
          pageSize: 0,
          parameters,
          selectSon: 0,
        })
        .then((res) => {
          console.log(res, 'res')
          mount(res, this.$refs.debuggingPanel, {
            rootName: 'Debugging Result',
            expandOnCreatedAndUpdated(path) {
              /* path.length为层级 0为第一级 下面逻辑为只展开对象第一级 */
              if (path.length === 0) return true
              else return false
            },
          })
          mount(res, this.$refs.paramsDebugPanel, {
            rootName: 'Debugging Result',
            expandOnCreatedAndUpdated(path) {
              /* path.length为层级 0为第一级 下面逻辑为只展开对象第一级 */
              if (path.length === 0) return true
              else return false
            },
          })
        })
        .catch(() => {})
    },
    submitEvent() {
      if (!this.requestCode) return _.showMessage('warning', '请选择接口')
      this.btnLoading = true
      let parameters = {}
      if (this.flag === 'create') {
        this.detailreallyList.forEach((i) => {
          parameters[i.key] = i.value || ''
        })
      } else {
        this.parsmsList.forEach((i) => {
          parameters[i.key] = i.value || ''
        })
      }
      _biApi
        .updateStatistics({
          id: this.$route.query.id,
          classId: this.classId,
          parameterDtoList: [
            {
              headers: {},
              httpType: 'post',
              remark: '',
              requestBody: {
                apiCode: this.activeCode ? this.activeCode : this.requestCode,
                apiVersion: '1.0',
                pageNo: 0,
                pageSize: 0,
                parameters,
              },
              type: 1,
              id: this.activeID ? this.activeID : this.currentID,
            },
          ],
        })
        .then((res) => {
          if (res === 1) this.$emit('updateSourceData')
          this.btnLoading = false
          this.realUseShow = false
        })
        .catch((err) => {
          console.log('updateStatistics err', err)
          this.btnLoading = false
        })
    },
    // activeCodeClean() {
    //   this.activeCode = ''
    // },
    //防抖滚动分页加载
    load: _.debounce(function (v) {
      if (this.pageNo !== this.pages) {
        this.pageNo = ++this.pageNo
        this.init()
      }
    }, 100),

    async init() {
      let params = {
        status: '1',
        apiCode: '',
        apiVersion: '',
        apiNotes: '',
        pageSize: 30,
        pageNo: this.pageNo,
      }
      params.apiCode = this.formInline.code
      params.apiNotes = this.formInline.describe
      _biApi
        .getSelectConfigList(params)
        .then((res) => {
          this.listDatas = this.listDatas.concat(res.list)
          this.loading = false
        })
        .catch(() => {})
    },
    closeEvent() {
      this.activeCode = ''
    },
    // changeSeniorEvent() {
    //   this.modeFlag = "senior"
    // },
    // changeNormalEvent() {
    //   this.modeFlag = "normal"
    // },
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
    font-family: 'Microsoft YaHei';
    font-size: 18px;
  }
}
.content {
  .senior-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .senior-top-two {
    display: flex;
    align-items: center;
  }
  .senior-mid {
    display: flex;
    .senior-mid-left {
      flex: 1;
      padding-right: 5px;
      .title-box {
        display: flex;
        align-items: center;
        background: #fbfbfb;
        border: 1px solid #e6e6e6;
        border-bottom: 0;
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
      .info {
        padding-left: 5px;
        height: 270px;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        box-sizing: border-box;
      }
    }
    .senior-mid-right {
      flex: 1;
      padding-left: 5px;
      .title-box {
        display: flex;
        align-items: center;
        background: #fbfbfb;
        border: 1px solid #e6e6e6;
        border-bottom: 0;
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
      .info {
        padding-left: 5px;
        height: 270px;
        background: #ffffff;
        border: 1px solid #e6e6e6;
        box-sizing: border-box;
      }
    }
  }
  .senior-btn {
    margin-top: 10px;
    .span-text {
      line-height: 22px;
    }
    .tiaoshi-result {
      margin: 10px 0px;
      border: 1px solid #e6e6e6;
      max-height: 168px;
      height: 168px;
      overflow: scroll;
    }
  }
  .top-form {
    display: flex;
  }
  .right-part {
    flex: 1;
    .right-top {
      margin-bottom: 10px;
      .demo-form-inline {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .right-btn {
      .span-text {
        line-height: 22px;
      }
      .tiaoshi-result {
        margin: 10px 0px 20px 0px;
        border: 1px solid #e6e6e6;
        max-height: 168px;
        height: 168px;
        overflow: scroll;
      }
    }
  }
}
.btn-content {
  display: flex;
  .left-part {
    width: 530px;
    margin-right: 10px;
    .demo-form-inline {
      height: 44px;
    }
    .search-button {
      width: 28px;
      height: 28px;
      margin-left: 10px;
      padding: 0;
    }
  }
  .right-part {
    flex: 1;
    .right-top {
      margin-bottom: 10px;
      .demo-form-inline {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .right-btn {
      .span-text {
        line-height: 22px;
      }
      .tiaoshi-result {
        margin: 10px 0px 20px 0px;
        border: 1px solid #e6e6e6;
        max-height: 168px;
        height: 168px;
        overflow: scroll;
      }
    }
  }
}
// .diy-content {
//   .top-form {
//     display: flex;
//   }
//   .btn-part {
//     display: flex;

//     .left-part {
//       flex: 1;
//       padding-right: 10px;
//       .left-top {
//         .span-text {
//           line-height: 22px;
//         }
//         .response-title {
//           margin: 10px 0px;
//           border: 1px solid;
//           height: 168px;
//         }
//       }
//       .left-btn {
//         .span-text {
//           line-height: 22px;
//         }
//         .response-body {
//           margin: 10px 0px;
//           border: 1px solid;
//           height: 168px;
//         }
//       }
//     }
//     .right-part {
//       line-height: 22px;
//     }
//   }
// }

.dialog-footer {
  .button-style {
    background-color: #ffffff;
    color: #0075ff;
  }
}

::v-deep .el-tabs__nav-wrap::after {
  width: 0px;
}
::v-deep .el-tabs__active-bar {
  height: 0px;
}
::v-deep .el-tabs__content {
  height: 100% !important;
  border: 0px !important;
  padding: 0px !important;
}
::v-deep .el-dialog__body {
  padding: 10px 24px 0px 24px;
}
::v-deep .el-dialog__footer {
  padding-top: 0px;
}
::v-deep .el-button--text {
  padding: 0px;
}
::v-deep .el-table th.el-table__cell > .cell {
  color: #666666;
  font-weight: 700;
  line-height: 22px;
}
::v-deep .el-table__empty-text {
  background: url('~@/assets/images/metaDataManager/noRecord.svg') no-repeat;
  height: 27px;
}
::v-deep .el-tabs__header {
  margin: 0 0 4px;
}
::v-deep .input-height-style .el-input__inner {
  height: 28px !important;
}
::v-deep .el-input__inner {
  height: 22px !important;
}
</style>
