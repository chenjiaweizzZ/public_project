<!-- 接口配置工具 -->
<template>
  <div
    class="container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- 树形菜单 -->
    <section class="left">
      <div class="title">
        {{ apiData.apiCode }}<span v-if="apiData.apiNotes">-{{ apiData.apiNotes }}</span>
      </div>
      <div class="select-items">
        <el-tree
          :data="menuData"
          :props="defaultProps"
          accordion
          @node-click="menuSelect"
          class="menu-item"
        ></el-tree>
      </div>
    </section>
    <section class="center">
      <!-- 画布容器 -->
      <div class="graph-body">
        <div id="graph" class="graph"></div>
      </div>
      <!-- 条件编辑区 -->
      <div class="center-footer">
        <el-tabs type="card">
          <!-- SELECT -->
          <el-tab-pane label="SELECT" class="select-container">
            <div v-for="(i, index) in selectItems" :key="index" class="select-item">
              <div v-if="!i.isCustom">{{ i.fieldName }}</div>
              <div v-else>
                <input v-model="i.fieldName" />
              </div>
              <el-popover placement="right" width="120" trigger="click">
                <el-input v-model="i.otherName"></el-input>
                <span slot="reference" class="feild-alias">
                  {{ i.otherName ? `(${i.otherName})` : '&lt;Alias&gt;' }}
                </span>
              </el-popover>
              <div v-if="i.isCustom" class="handle-part" @click="delCustom(index)">
                <el-tooltip effect="dark" content="delete" placement="right">
                  <img src="~@/assets/images/delete.svg" width="100%" height="100%" alt="" />
                </el-tooltip>
              </div>
            </div>
            <div class="select-add-btn" @click="addSelectCustomItem">+</div>
          </el-tab-pane>
          <!-- FROM -->
          <el-tab-pane label="FROM" class="select-container">
            <el-table :data="fromTableItems" style="width: 100%">
              <el-table-column
                prop="tableName"
                label="表格名称"
                width="180"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="joinType" label="joinType" width="150">
                <template slot-scope="scope">
                  <el-select :disabled="scope.$index === 0" v-model="scope.row.joinType">
                    <el-option
                      v-for="item in constant.joinTypeArr"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="conditions" label="条件">
                <template slot-scope="scope">
                  <span
                    v-show="scope.$index !== 0"
                    class="add-condition"
                    @click="showDialog(scope.row, scope.$index)"
                  >
                    新增条件
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- WHERE -->
          <el-tab-pane label="WHERE" class="select-container">
            <ConditionHandle
              ref="whereCondition"
              :conditionList="whereCondition"
              :cascaderOptions="tableDataMap"
              :model="'WHERE'"
            />
          </el-tab-pane>
          <!-- GROUP BY -->
          <el-tab-pane label="GROUP BY" class="select-container">
            <div class="select-item" v-for="(i, index) in groupByCondition" :key="index">
              <el-cascader
                v-model="i.val"
                :options="tableDataMap"
                :props="{
                  expandTrigger: 'hover',
                  children: 'fieldList',
                  label: 'name',
                  value: 'name'
                }"
              >
              </el-cascader>
              <i
                v-if="index === groupByCondition.length - 1"
                class="el-icon-circle-plus-outline handle-icon"
                @click="addCondition('g')"
              ></i>
              <i class="el-icon-delete handle-icon" @click="delCondition('g', index)"></i>
            </div>
          </el-tab-pane>
          <!-- HAVING -->
          <el-tab-pane label="HAVING" class="select-container">
            <ConditionHandle
              ref="havingCondition"
              :conditionList="havingCondition"
              :cascaderOptions="tableDataMap"
              :model="'WHERE'"
            />
          </el-tab-pane>
          <!-- ORERBY -->
          <el-tab-pane label="ORDER BY" class="select-container">
            <div class="select-item" v-for="(i, index) in orderByCondition" :key="index">
              <el-cascader
                v-model="i.fieldName"
                :options="tableDataMap"
                :props="{
                  expandTrigger: 'hover',
                  children: 'fieldList',
                  label: 'name',
                  value: 'name'
                }"
              >
              </el-cascader>
              <el-select v-model="i.sort" style="width:80px;margin-left:8px">
                <el-option
                  v-for="item in [
                    { label: '升序', value: 'ASC' },
                    { label: '降序', value: 'DESC' }
                  ]"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-tooltip effect="dark" content="delete" placement="right"> </el-tooltip>
              <i
                v-if="index === orderByCondition.length - 1"
                class="el-icon-circle-plus-outline handle-icon"
                @click="addCondition('o')"
              ></i>
              <i class="el-icon-delete handle-icon" @click="delCondition('o', index)"></i>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="submit-section">
          <el-popconfirm
            confirm-button-text="确 定"
            cancel-button-text="取 消"
            icon="el-icon-info"
            icon-color="red"
            title="是否确认重置数据？"
            @confirm="reset"
          >
            <el-button slot="reference" plain type="warning">重 置</el-button>
          </el-popconfirm>
          <el-button plain type="primary" style="margin-left:8px" @click="dataSubmit">
            保 存
          </el-button>
        </div>
      </div>
    </section>
    <!-- SQL显示区域 -->
    <section class="right">
      <div class="SQLResult">{{ SQLResult }}</div>
      <div class="right-btn">
        <el-button plain type="warning" @click="showDebug">
          调 试
        </el-button>
      </div>
    </section>
    <el-dialog
      :visible.sync="isShowDialog"
      :close-on-click-modal="false"
      width="1400px"
      @closed="dialogClosed"
    >
      <div slot="title" class="title-style">
        <span style="margin-left:5px">{{ activeFromTable }}</span>
      </div>
      <ConditionHandle
        ref="fromCondition"
        :cascaderOptions="FCOptions"
        :conditionList="activeFromCondition"
        :model="'FROM'"
        @fromConfirm="updatedFromCondition"
      />
    </el-dialog>

    <!-- 调试 -->
    <el-dialog title="调试" :visible.sync="showDebugDialog" width="500px">
      <div class="debug-section" v-loading="loadDebug">
        <el-table :data="inParams.list" border>
          <el-table-column
            label="入参"
            align="center"
            prop="key"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="参数值" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" />
            </template>
          </el-table-column>
        </el-table>
        <div class="debug-result">
          <div class="d-title">调试结果</div>
          <div class="d-result">{{ debugRresult }}</div>
        </div>
        <el-row type="flex" justify="end" style="padding-top:20px">
          <el-button @click="showDebugDialog = false">取消</el-button>
          <el-button type="primary" @click="debugSQL">调试</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Graph from './lib/graghConfig'
import formatData from './lib/formatNodeData'
import ConditionHandle from './components/ConditionHandle.vue'
import * as _api from '@/service/interfaceManager'
import constant from './constant'
import _ from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'SQLConfig',
  components: {
    ConditionHandle
  },
  computed: {
    ...mapState('SQLConfig', {
      apiData: state => state.apiData
    })
  },
  data() {
    return {
      constant,
      loading: true,
      menuData: [],
      graph: {},
      isShowDialog: false,
      activeEdge: '',
      activeClass: [],

      selectItems: [] /* SELECT */,
      fromTableItems: [] /* FROM */,
      whereCondition: [] /* WHERE */,
      groupByCondition: [] /* GROUPBY */,
      havingCondition: [] /* HAVING */,
      orderByCondition: [] /* ORDERBY */,
      relation: [],
      FCOptions: [], // FROM级联Options
      tableDataMap: [], // 画布表数据集、WHERE级联Options

      activeFromTable: '',
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      activeFromCondition: [],
      SQLResult: '',

      /* debug */
      showDebugDialog: false,
      inParams: {
        id: '',
        list: []
      },
      loadDebug: false,
      debugRresult: ''
    }
  },
  /* 依赖注入 */
  provide: function() {
    return {
      getRelation: this.getRelation
    }
  },
  mounted() {
    this.dataInit()
  },
  methods: {
    dataInit() {
      Promise.all([
        _api.getDictionaryByType({ dictionaryType: 1 }),
        _api.getSelectConfigDetail({ id: this.apiData.id }),
        _api.getSelectConfigSql({ id: this.apiData.id })
      ]).then(result => {
        /* 获取条件 */
        _.isNEArray(result[0]) ? (this.relation = result[0]) : ''
        /* 获取SQL语句 */
        this.SQLResult = result[2]

        this.graphInit()
        this.menuDataInit()
        this.conditionDataInit()

        // step.1
        if (result[1].viewConfig) this.renderGraph(result[1].viewConfig)
        // step.2
        if (result[1].queryConfig) this.splitCondition(result[1].queryConfig)
      })
    },

    /* 画布渲染 */
    renderGraph(viewData) {
      let jsonObj = JSON.parse(viewData)
      this.graph.fromJSON(jsonObj)
      if (_.isNEArray(jsonObj.cells)) {
        jsonObj.cells.forEach(i => {
          if (i.shape !== 'edge') {
            _api.getTableFieldList({ tableId: i.id }).then(res => {
              /* 获取tableDataMap */
              this.tableDataMap.push({
                name: i.attrs.text.text,
                fieldList: res
              })
            })
          }
        })
      }
    },
    
    /* 拆分条件 */
    splitCondition(qF) {
      this.selectItems = qF.selectFieldDtoList
      if (qF.selectTableDtoList.length > 0) {
        qF.selectTableDtoList.forEach(i => {
          this.transformData(i.conditions)
        })
        this.fromTableItems = qF.selectTableDtoList
      }
      if (qF.selectWhereDtoList.length > 0) {
        qF.selectWhereDtoList.forEach(i => {
          this.transformData(i.list)
        })
        this.whereCondition = qF.selectWhereDtoList
      }
      if (qF.havingList.length > 0) {
        qF.havingList.forEach(i => {
          this.transformData(i.list)
        })
        this.havingCondition = qF.havingList
      }
      if (qF.groupList.length > 0) {
        let garr = []
        qF.groupList.forEach(h => {
          garr.push({
            val: h.split('.')
          })
        })
        this.groupByCondition = garr
      }
      if (qF.orderList.length > 0) {
        let oarr = []
        qF.orderList.forEach(i => {
          let oResult = i.split(' ')
          let obj = {
            fieldName: oResult[0].split('.'),
            sort: ''
          }
          if (oResult.length > 1) {
            obj.sort = oResult[1]
          }
          oarr.push(obj)
        })
        this.orderByCondition = oarr
      }
    },

    getRelation: function() {
      return this.relation
    },

    transformData(arr) {
      arr.forEach(h => {
        h.tableFieldName = h.tableFieldName.split('.')
        if (h.type === 1) {
          h.value = h.value.split('.')
        }
      })
    },

    /* 菜单数据初始化 */
    menuDataInit() {
      _api.getTreeData({ typeId: this.apiData.typeId }).then(res => {
        if (_.isNEArray(res)) {
          let result = res.filter(i => {
            i.name = i.className
            return i.list.length > 0
          })
          this.menuData = result
        }
        this.loading = false
      })
    },

    /* 条件数据初始化 */
    conditionDataInit() {
      let obj = _.deepCopy(constant.defaultCondition, {})
      this.whereCondition = []
      this.whereCondition.push({
        condition: '',
        list: [_.deepCopy(obj, {})]
      })
      this.havingCondition = []
      this.havingCondition.push({
        condition: '',
        list: [_.deepCopy(obj, {})]
      })
      this.groupByCondition = []
      this.groupByCondition.push({ val: '' })
      this.orderByCondition = []
      this.orderByCondition.push({
        fieldName: '',
        sort: 'ASC'
      })
    },

    /* 画布数据初始化 */
    graphInit() {
      this.graph = Graph(document.getElementById('graph'))
      this.graph
        // 连线事件 -> FROM
        .on('edge:connected', ({ isNew, edge }) => {
          if (isNew) {
            let edgeData = edge.store.data
            let sourceID = edgeData.source.port
            let targetID = edgeData.target.port

            let sourceResult = this.findPortIndex(sourceID)
            let targetResult = this.findPortIndex(targetID)
            /* FROM级联菜单数据 */
            let sourceVal = [sourceResult.tableName, sourceResult.portInfo.name]
            let targetVal = [targetResult.tableName, targetResult.portInfo.name]

            /* TODO */
            if (sourceResult.index > targetResult.index) {
              this.fromTableItems[sourceResult.index].joinType = 'INNER JOIN'
              this.fromTableItems[sourceResult.index].conditions.unshift(
                constant.fromEdgeCondition(sourceVal, targetVal)
              )
            } else {
              this.fromTableItems[targetResult.index].joinType = 'INNER JOIN'
              this.fromTableItems[targetResult.index].conditions.unshift(
                constant.fromEdgeCondition(targetVal, sourceVal)
              )
            }
          }
        })
        // 勾选事件 -> SELECT
        .on('node:statusChange', ({ node, y }) => {
          let height = y - node.position().y - 24
          let index = Math.ceil(height / 24) - 1
          if (index >= 0) {
            let port = node.port.ports[index]
            node.setPortProp(port.id, 'data/isSelect', !port.data.isSelect)
            !port.data.isSelect
              ? node.setPortProp(
                  port.id,
                  'attrs/checkbox/xlinkHref',
                  require('@/assets/images/select.svg')
                )
              : node.setPortProp(
                  port.id,
                  'attrs/checkbox/xlinkHref',
                  require('@/assets/images/unSelect.svg')
                )

            if (!port.data.isSelect) {
              this.selectItems.push({
                fieldName: `${port.data.tableName}.${port.data.fieldName}`,
                otherName: '',
                fieldNameCn: '',
                transformerId: '',
                isCustom: false
              })
            } else {
              let index = this.selectItems.findIndex(i => {
                console.log('')
                return i.fieldName === `${port.data.tableName}.${port.data.fieldName}`
              })
              if (index >= 0) this.selectItems.splice(index, 1)
            }
          }
          let cells = this.graph.getCells()
          // TODO 整体更新（有待优化）
          this.graph.resetCells(cells)
        })
    },

    /* 根据port信息获取字段信息 */
    findPortIndex(portID) {
      let portInfo = {}
      let tableData = this.tableDataMap.find(i => {
        return i.fieldList.some(c => {
          if (portID === c.id + '') {
            portInfo = c
          }
          return portID === c.id + ''
        })
      })
      let index = this.fromTableItems.findIndex(i => {
        return i.tableName === tableData.name
      })
      return { portInfo, index, tableName: tableData.name }
    },

    /* 添加自定义SELECT条件 */
    addSelectCustomItem() {
      // 未选择表格 return
      if (this.tableDataMap.length === 0) return
      this.selectItems.push({
        fieldName: '',
        otherName: '',
        fieldNameCn: '',
        transformerId: '',
        isCustom: true
      })
    },
    /* 删除自定义SELECT条件 */
    delCustom(index) {
      this.selectItems.splice(index, 1)
    },

    /* 树形菜单点击事件 */
    menuSelect(e, n) {
      if (
        !e.list &&
        !this.tableDataMap.some(i => {
          return i.name === e.name
        })
      ) {
        console.log('this.tableDataMap', this.tableDataMap)
        this.loading = true
        _api.getTableFieldList({ tableId: e.id }).then(res => {
          /* 画布中激活表格的父级域 */
          let haveDone = this.activeClass.some(i => {
            return i === n.parent.label
          })
          if (!haveDone) this.activeClass.push(n.parent.label)
          let nodes = this.graph.getNodes()

          this.tableDataMap.push({
            name: e.name,
            fieldList: res
          })

          let that = this
          setTimeout(() => {
            if (
              nodes.length === 0 ||
              !nodes.some(i => {
                return i.label === e.name
              })
            ) {
              /* 渲染表数据 */
              let nodeData = formatData(res, res[0].tableDataId, e.name)
              /* TODO */
              nodeData.tools = [
                {
                  name: 'button-remove',
                  args: {
                    x: '100%',
                    y: 0,
                    offset: { x: -12, y: 12 },
                    onClick({ e, view, cell }) {
                      // step1. 移除node
                      let res = that.checkCondition(cell.label)
                      if (!res.result)
                        return _.showMessage('warning', res.msg + '模块有条件依赖，删除失败！')
                      e.stopPropagation()
                      view.cell.remove()
                    }
                  }
                }
              ]
              this.graph.addNode(nodeData)
              let obj = _.deepCopy(constant.defaultCondition, {})

              /* FROM 数据初始化 */
              this.fromTableItems.push({
                tableName: e.name,
                joinType: '',
                conditions: [obj]
              })
            }
            this.loading = false
          }, 100)
        })
      }
    },
    checkCondition(tableName) {
      console.log('tableName', tableName)
      // SELECT
      let selectBOO = this.selectItems.some(i => {
        return i.fieldName.split('.')[0] === tableName
      })
      if (selectBOO) return { result: false, msg: 'SELECT' }

      // FROM
      let fromBOO = this.fromTableItems.some(i => {
        return i.conditions.some(h => {
          let result =
            (_.isNEArray(h.tableFieldName) && h.tableFieldName[0] === tableName) ||
            (_.isNEArray(h.value) && h.value[0] === tableName)
          return result
        })
      })
      if (fromBOO) return { result: false, msg: 'FROM' }

      // WHERE
      let whereC = this.$refs.whereCondition.getCondition()
      let whereBOO = whereC.some(i => {
        return i.list.some(h => {
          let result =
            (_.isNEArray(h.tableFieldName) && h.tableFieldName[0] === tableName) ||
            (_.isNEArray(h.value) && h.value[0] === tableName)
          return result
        })
      })
      if (whereBOO) return { result: false, msg: 'WHERE' }

      // HAVING
      let havingC = this.$refs.havingCondition.getCondition()
      let havingBOO = havingC.some(i => {
        return i.list.some(h => {
          let result =
            (_.isNEArray(h.tableFieldName) && h.tableFieldName[0] === tableName) ||
            (_.isNEArray(h.value) && h.value[0] === tableName)
          return result
        })
      })
      if (havingBOO) return { result: false, msg: 'HAVING' }

      // GROUPBY
      let groupByBOO = this.groupByCondition.some(i => {
        if (_.isNEArray(i.val)) {
          return i.val[0] === tableName
        }
      })
      if (groupByBOO) return { result: false, msg: 'GROUPBY' }

      // ORDERBY
      let orderByBOO = this.orderByCondition.some(i => {
        if (_.isNEArray(i.fieldName)) {
          return i.fieldName[0] === tableName
        }
      })
      if (orderByBOO) return { result: false, msg: 'ORDERBY' }

      /*       // step1. 更新勾选对应的SELECT条件
      this.selectItems = this.selectItems.filter(i => {
        return i.name.substring(0, i.name.lastIndexOf('.')) !== tableName
      }) */
      // step2. 更新连线对应的FROM条件
      this.fromTableItems = this.fromTableItems.filter(i => {
        return i.tableName !== tableName
      })
      // step3. 更新tableDataMap数据
      this.tableDataMap = this.tableDataMap.filter(i => {
        return i.name !== tableName
      })
      return { result: true, msg: '' }
    },

    /* FROM弹出框操作 */
    dialogClosed() {
      // 关闭
      this.$refs.fromCondition.cleanCondition()
    },
    showDialog(row, index) {
      // 展示
      let fieldOption = this.tableDataMap.slice(0, index + 1)
      this.FCOptions = fieldOption
      this.activeFromTable = row.tableName
      this.activeFromCondition = row.conditions
      this.activeFromIndex = index
      this.isShowDialog = true
    },
    updatedFromCondition(obj) {
      this.fromTableItems[this.activeFromIndex].conditions = obj[0].list
      this.isShowDialog = false
    },
    /* GroupBy和OrderBy条件新增 */
    addCondition(m) {
      // 未选择表格 return
      if (this.tableDataMap.length === 0) return
      switch (m) {
        case 'g':
          this.groupByCondition.push({ val: '' })
          break

        case 'o':
          this.orderByCondition.push({
            fieldName: '',
            sort: 'ASC'
          })
          break
      }
    },
    /* GroupBy和OrderBy条件删除 */
    delCondition(m, index) {
      switch (m) {
        case 'g':
          this.groupByCondition.length === 1
            ? (this.groupByCondition[0].val = '')
            : this.groupByCondition.splice(index, 1)
          break
        case 'o':
          this.orderByCondition.length === 1
            ? this.cleanCondition(this.orderByCondition[0])
            : this.orderByCondition.splice(index, 1)
          break
      }
    },

    cleanCondition(v) {
      v.fieldName = ''
      v.sort = 'ASC'
    },

    /* 保存BTN */
    dataSubmit() {
      // select
      // this.selectItems
      // console.log('selectCondition', this.selectItems)

      // from
      let fCondition = _.deepCopy(this.fromTableItems, [])
      fCondition.forEach(i => {
        let fCond = i.conditions.filter(e => {
          return e.tableFieldName && e.value
        })
        i.conditions = fCond
        console.log('fCond', fCond)
        this.fieldTransform(fCond)
      })
      // console.log('fromCondition', fCondition)

      // where
      let wCondition = this.$refs.whereCondition.getCondition()
      wCondition.forEach(i => {
        let wCond = i.list.filter(e => {
          return e.tableFieldName && e.value
        })
        i.list = wCond
        this.fieldTransform(wCond)
      })
      wCondition = wCondition.filter(w => {
        return _.isNEArray(w.list)
      })
      // console.log('whereCondition', wCondition)

      // group by
      let result = _.deepCopy(this.groupByCondition, []).filter(i => {
        if (_.isNEArray(i.val)) {
          i.val = i.val.reduce((pre, cur) => {
            return pre + '.' + cur
          })
        }
        return i.val
      })
      let gCondition = []
      if (_.isNEArray(result)) {
        result.forEach(i => {
          gCondition.push(i.val)
        })
      }
      // console.log('groupByCondition', gCondition)

      // having
      let hCondition = this.$refs.havingCondition.getCondition()
      hCondition.forEach(i => {
        let hCond = i.list.filter(e => {
          return e.tableFieldName && e.value
        })
        i.list = hCond
        this.fieldTransform(hCond)
      })
      hCondition = hCondition.filter(h => {
        return _.isNEArray(h.list)
      })
      // console.log('havingCondition', hCondition)

      // order by
      let oResult = _.deepCopy(this.orderByCondition, []).filter(i => {
        if (_.isNEArray(i.fieldName)) {
          /* 1、字段组合 */
          i.fieldName = i.fieldName.reduce((pre, cur) => {
            return pre + '.' + cur
          })
          /* 2、排序不为空时拼接 */
          if (i.sort) {
            i.fieldName = i.fieldName + ' ' + i.sort
          }
          /* 3、删除排序字段 */
          delete i.sort
        }
        return i.fieldName
      })
      let oCondition = []
      oResult.forEach(i => {
        oCondition.push(i.fieldName)
      })
      // console.log('orderByCondition', oCondition)

      // submit data
      let obj = {
        groupList: gCondition,
        havingList: hCondition,
        orderList: oCondition,
        selectFieldDtoList: this.selectItems,
        selectTableDtoList: fCondition,
        selectWhereDtoList: wCondition
      }
      let graphData = this.graph.toJSON()
      let formData = _.deepCopy(constant.IUpdateSelectSQL, {})
      formData.createSelectSqlDto = obj
      formData.id = this.apiData.id
      formData.viewConfig = JSON.stringify(graphData)

      _api.updateSelectSql(formData).then(res => {
        this.SQLResult = res
        _.showMessage('success', 'SQL保存成功。')
      })
    },

    fieldTransform(arr) {
      arr.forEach(i => {
        console.log('i.tableFieldName', i.tableFieldName)
        let v = i.tableFieldName.reduce((pre, cur) => {
          return pre + '.' + cur
        })
        i.tableFieldName = v
        if (_.isNEArray(i.value)) {
          let v = i.value.reduce((pre, cur) => {
            return pre + '.' + cur
          })
          i.value = v
        }
      })
    },

    /* 调试 */
    showDebug() {
      this.showDebugDialog = true
      this.loadDebug = true
      this.inParams = {
        id: '',
        list: []
      }
      this.debugRresult = ''
      _api
        .getSelectParam({
          id: this.apiData.id
        })
        .then(res => {
          console.log('1', res)
          let obj = res.inParam
          this.inParams.id = this.apiData.id
          Object.keys(obj).forEach(key => {
            let item = {
              key: key,
              value: obj[key]
            }
            this.inParams.list.push(item)
          })
          this.loadDebug = false
        })
    },

    /* 点击调试按钮事件 */
    debugSQL() {
      let parameters = {}
      this.inParams.list.forEach(i => {
        parameters[i.key] = i.value
      })
      _api
        .debugSQL({
          id: this.inParams.id,
          selectSon: 1,
          parameters
        })
        .then(res => {
          this.debugRresult = res
        })
    },

    /* 重置BTN */
    reset() {
      this.graph.clearCells()
      this.tableDataMap = []
      this.selectItems = []
      this.fromTableItems = []
      this.conditionDataInit()
    }
  }
}
</script>
<style lang="scss" src="./SQLConfig.scss" scoped></style>
