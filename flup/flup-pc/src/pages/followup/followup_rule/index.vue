<template>
  <section class="page-wrapper">
    <preview-followup-route
      v-if="showPreviewRoute"
      :mainList="newRouteList"
      @addRoute="adjustFollowupRoute"
      @back="goBack"
    ></preview-followup-route>
    <div v-show="!showPreviewRoute">
      <section class="content-left" ref="content-left">
        <el-select
          class="width100"
          v-model="deptValue"
          @change="searchList"
          placeholder="请输入执行科室"
          clearable
        >
          <el-option v-for="(item, i) in deptList" :key="i" :label="item.Text" :value="item.Text"></el-option>
        </el-select>
        <el-row class="margin-top20" type="flex">
          <el-input v-model="keyWords" placeholder="请输入规则简称" clearable></el-input>
          <el-button class="margin-left10" @click="addRule" type="info">新增规则</el-button>
        </el-row>
        <el-table
          class="margin-top20"
          ref="ruleTableRef"
          highlight-current-row
          @row-click="switchRule"
          :data="ruleList"
          stripe
          border
        >
          <el-table-column show-overflow-tooltip prop="rule_name" :width="150" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteRule(scope.row)" type="text" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="totalCount != 0"
          class="page-custom"
          layout="prev, pager, next"
          :pager-count="5"
          :total="totalCount"
          @current-change="switchPagintion"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          background
          small
        ></el-pagination>
      </section>
      <section class="content-right">
        <el-form
          class="form"
          ref="form"
          :rules="rules"
          :model="form"
          label-position="right"
          label-width="80px"
        >
          <el-form-item prop="rule_name" label="规则名称">
            <el-row type="flex" align="middle">
              <el-input v-model="form.rule_name" clearable></el-input>
              <el-button
                v-if="!isClickAdd"
                class="margin-left10"
                type="text"
                @click="openHistory"
              >修改记录</el-button>
            </el-row>
          </el-form-item>
          <el-form-item label="关联科室" prop="relation_dept">
            <el-select class="width100" v-model="form.relation_dept" multiple filterable>
              <el-option
                v-for="(item, i) in deptList"
                :key="i"
                :label="item.Text"
                :value="item.Text"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="$route.params.type !== 'specialist'" label="入组规则">
            {{JSON.parse(this.form.enrollment_config) ? JSON.parse(this.form.enrollment_config).description : '' }}
            <el-button @click="openIntoGroupRule" type="info">配置</el-button>
          </el-form-item>
        </el-form>
        <el-row
          class="border-bottom1 margin-bottom14 padding-bottom10 margin-top20"
          type="flex"
          align="middle"
          justify="space-between"
        >
          <span>随访路径</span>
          <div>
            <el-button @click="onPreview">预览</el-button>
            <el-button @click="addRoute" type="primary">新增</el-button>
          </div>
        </el-row>
        <el-table :data="routeList" stripe border>
          <el-table-column width="50" :min-width="100" type="index" label="序号"></el-table-column>
          <el-table-column prop="flup_type" label="随访类型"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            :formatter="this.$utils.formatFollowupContent"
            label="随访内容"
          ></el-table-column>
          <el-table-column :min-width="110" :formatter="formatIntervention" label="执行时间"></el-table-column>
          <el-table-column prop="valid_date" label="有效天数"></el-table-column>
          <el-table-column prop="flup_interval" min-width="110" label="随访间隔(天)"></el-table-column>
          <el-table-column :formatter="formatNumber" label="随访次数"></el-table-column>
          <el-table-column prop="smart_flup_method" label="随访途径"></el-table-column>
          <el-table-column :min-width="140" label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  @click="handleRoute(scope, false)"
                  type="text"
                  icon="el-icon-edit-outline"
                >修改</el-button>
                <el-button @click="handleRoute(scope, true)" type="text" icon="el-icon-delete">删除</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-row align="middle" type="flex" justify="end" class="footer">
        <el-button @click="submit" type="primary">提交</el-button>
      </el-row>
    </div>
    <el-dialog
      :title="formRoute? '编辑随访路径' : '新增随访路径'"
      :visible.sync="showDialogGroup"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <followup-route @close="setFollowupRoute" :data="formRoute" v-if="showDialogGroup"></followup-route>
    </el-dialog>
    <el-dialog
      title="配置入组条件"
      :visible.sync="showDialogRoute"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <into-group-rule v-if="showDialogRoute" ref="into-group" :data="formIntoGroupRule"></into-group-rule>
      <span slot="footer">
        <el-button @click="showDialogRoute = false">取 消</el-button>
        <el-button type="primary" @click="setIntoGroupRule">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import PreviewFollowupRoute from './preview_followup_route'
import FollowupRoute from './followup_route'
import IntoGroupRule from './into_group_rule'
export default {
  data() {
    return {
      showDialogGroup: false,
      showDialogRoute: false,
      ruleList: [],
      deptList: [],
      deptValue: '',
      keyWords: '',
      currentRule: null,
      routeList: [],
      newRouteList: [],
      currentRoute: null,
      formRoute: null,
      formIntoGroupRule: null,
      form: {
        rule_name: '',
        relation_dept: [],
        enrollment_config: null,
      },
      isClickAdd: false,
      oldForm: null,
      oldRouteList: [],
      showPreviewRoute: false,
      currentPage: 1,
      pageSize: 8,
      totalCount: 0,
      /**表单验证规则 */
      rules: {
        rule_name: [
          {
            required: true,
            message: '请填写规则名称',
            trigger: 'blur',
          },
        ],
      },
      handle: null,
    }
  },
  components: {
    FollowupRoute,
    IntoGroupRule,
    PreviewFollowupRoute,
  },
  async created() {
    this.$startLoading()
    if (this.$route.params.type == 'specialist') {
      this.rules.relation_dept = [
        {
          required: true,
          message: '请选择科室',
          trigger: 'blur',
        },
      ]
    }
    await this.$apis.getDeptList().then((res) => {
      this.deptList = res
    })
    this.pageSize = Math.floor(
      (this.$refs['content-left'].clientHeight - 220) / 40
    )
    await this.geRuleList().then(() => {
      this.setCurrentRow(this.ruleList[0])
      this.setCurrentRule(this.ruleList[0])
    })
    this.$stopLoading()
  },
  async mounted() {
    var ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect
        let oldPageSize = this.pageSize
        this.pageSize = Math.floor((cr.height - 180) / 40)
        if (this.pageSize <= 0) {
          this.pageSize = 1
        }
        if (oldPageSize !== this.pageSize) {
          this.geRuleList().then(() => {
            this.setCurrentRow(this.ruleList[0])
            this.setCurrentRule(this.ruleList[0])
          })
        }
      }
    })
    ro.observe(this.$refs['content-left'])
  },
  methods: {
    formatNumber(row) {
      if (row.flup_period == 2) {
        return '终身随访'
      } else {
        return row.flup_number
      }
    },
    formatIntervention(row) {
      let map = ['天', '周', '个月']
      if (row.intervention_day === 0) {
        return row.intervention_benchmark + '当天'
      }
      return (
        row.intervention_benchmark +
        row.intervention_day +
        map[row.execute_unit]
      )
    },
    sortMethod(a, b) {
      let map = {
        入院前: 1,
        入院后: 2,
        手术前: 3,
        手术后: 4,
        出院前: 5,
        出院后: 6,
      }
      let mapDay = {
        0: 1,
        1: 7,
        2: 30,
      }
      return (
        map[a.intervention_benchmark] * 1000 +
        a.intervention_day * mapDay[a.execute_unit] -
        (map[b.intervention_benchmark] * 1000 +
          b.intervention_day * mapDay[b.execute_unit])
      )
    },
    goBack() {
      this.showPreviewRoute = false
    },
    openHistory() {
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            location.origin +
            '/OperationLog/OperationLLogManage?business_name=随访规则&serial_no=' +
            this.currentRule.serial_no +
            '&token=' +
            this.$cookie.get('token'),
          title: '随访规则修改记录',
        }),
        '*'
      )
    },
    switchPagintion(v) {
      this.currentPage = v
      this.geRuleList().then(() => {
        this.setCurrentRow(this.currentRule)
      })
    },
    setIntoGroupRule() {
      let data = this.$refs['into-group'].getData()
      if (data) {
        this.form.enrollment_config = JSON.stringify(data)
        this.showDialogRoute = false
      }
    },
    setCurrentRow(obj) {
      if (!obj) {
        this.$refs.ruleTableRef.setCurrentRow()
        return
      }
      let item = null
      this.ruleList.forEach((v) => {
        if (v.serial_no == obj.serial_no) {
          item = v
        }
      })
      this.$nextTick(() => {
        this.$refs.ruleTableRef.setCurrentRow(item)
      })
    },
    addRoute() {
      console.log(1)
      this.showDialogGroup = true
      this.formRoute = null
    },
    adjustFollowupRoute(item = null) {
      this.showDialogGroup = true
      if (item) {
        this.currentRoute = item
        this.formRoute = { ...item }
      } else {
        this.formRoute = null
      }
    },
    openIntoGroupRule() {
      this.showDialogRoute = true
      this.formIntoGroupRule = this.form.enrollment_config
    },
    geRuleList(p) {
      return this.$apis
        .getFollowupRuleList(
          Object.assign(
            {
              page_index: this.currentPage,
              page_size: this.pageSize,
              rule_name: this.keyWords,
              relation_dept: this.deptValue,
              rule_type: this.$route.params.type === 'specialist' ? 1 : 0,
            },
            p
          )
        )
        .then((res) => {
          this.ruleList = res.dataList
          this.totalCount = res.total
        })
    },
    deleteRule(item) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis
          .deleteFollowupRule({
            serial_no: item.serial_no,
          })
          .then((res) => {
            this.geRuleList().then(() => {
              if (this.currentRule.serial_no == item.serial_no) {
                this.setCurrentRow()
                this.setCurrentRule()
                return
              }
              this.setCurrentRow(this.currentRule)
            })
          })
      })
    },
    switchRule(item) {
      if (this.currentRule.serial_no == item.serial_no) {
        return
      }
      if (this.hasChange()) {
        this.$confirm('存在未保存的规则，是否需要保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            if (await this.submit()) {
              this.isClickAdd = false
              this.setCurrentRule(item)
              this.setCurrentRow(item)
              this.$refs['form'].clearValidate()
            } else {
              this.setCurrentRow(this.currentRule)
            }
          })
          .catch(() => {
            this.$refs['form'].clearValidate()
            this.routeList = [...this.oldRouteList]
            this.form = {
              ...this.oldForm,
            }
            this.setCurrentRow(this.currentRule)
          })
      } else {
        this.$refs['form'].clearValidate()
        this.isClickAdd = false
        this.setCurrentRow(item)
        this.setCurrentRule(item)
      }
    },
    setCurrentRule(item) {
      if (!item) {
        this.isClickAdd = true
        this.currentRule = {}
        this.form.rule_name = ''
        this.form.relation_dept = []
        this.form.enrollment_config = null
        this.routeList = []
        this.oldForm = {
          ...this.form,
        }
        this.oldRouteList = JSON.parse(JSON.stringify(this.routeList))
      } else {
        this.currentRule = {
          ...item,
        }
        this.form.rule_name = this.currentRule.rule_name || ''
        this.form.relation_dept = this.currentRule.relation_dept
          ? this.currentRule.relation_dept.split('|')
          : []
        this.form.enrollment_config = this.currentRule.enrollment_config
        this.oldForm = {
          ...this.form,
        }
        this.$apis
          .getFollowupPathListById({
            serial_no: item.serial_no,
          })
          .then((res) => {
            this.routeList = res
            this.routeList.sort(this.sortMethod)
            this.oldRouteList = JSON.parse(JSON.stringify(this.routeList))
          })
      }
    },
    searchList() {
      this.currentPage = 1
      this.geRuleList().then(() => {
        this.setCurrentRow(this.currentRule)
      })
    },
    handleRoute(item, isDelete) {
      if (isDelete) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.routeList.splice(item.$index, 1)
        })
      } else {
        this.showDialogGroup = true
        this.currentRoute = item.row
        this.formRoute = {
          ...item.row,
        }
      }
    },
    setFollowupRoute(obj) {
      console.log(obj)
      if (!obj) {
        this.showDialogGroup = false
        return
      }
      if (obj.isNew) {
        this.routeList.push(obj.data)
      } else {
        for (let key in obj.data) {
          this.currentRoute[key] = obj.data[key]
        }
      }
      this.routeList.sort(this.sortMethod)
      this.currentRoute = {}
      this.showDialogGroup = false
    },
    addRule() {
      if (this.isClickAdd) {
        return
      }
      if (this.hasChange()) {
        this.$confirm('存在未保存的规则，是否需要保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            if (await this.submit()) {
              this.isClickAdd = true
              this.setCurrentRule()
              this.setCurrentRow()
              this.$refs['form'].clearValidate()
            } else {
              this.setCurrentRow(this.currentRule)
            }
          })
          .catch(() => {
            this.$refs['form'].clearValidate()
            this.routeList = [...this.oldRouteList]
            this.form = {
              ...this.oldForm,
            }
            this.setCurrentRow(this.currentRule)
          })
      } else {
        this.$refs['form'].clearValidate()
        this.isClickAdd = true
        this.setCurrentRule()
        this.setCurrentRow()
      }
    },
    hasChange() {
      if (
        JSON.stringify(this.oldRouteList) != JSON.stringify(this.routeList) ||
        JSON.stringify(this.form) != JSON.stringify(this.oldForm)
      ) {
        return true
      } else {
        return false
      }
    },
    onPreview() {
      if (this.routeList.length == 0) {
        this.$message({
          message: '请至少添加一条随访路径',
          type: 'warning',
        })
        return
      }
      this.newRouteList = [...this.routeList]
      this.showPreviewRoute = true
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.routeList.length == 0) {
              this.$message({
                message: '请至少添加一条随访路径',
                type: 'warning',
              })
              resolve(false)
              return
            }
            this.currentRule.hospital_id = this.$global.hospital_id
            this.currentRule.flup_router = this.routeList
            this.currentRule.rule_name = this.form.rule_name
            this.currentRule.rule_type =
              this.$route.params.type === 'specialist' ? 1 : 0
            this.currentRule.relation_dept =
              this.form.relation_dept.length != 0
                ? this.form.relation_dept.join('|')
                : ''
            this.currentRule.enrollment_config = this.form.enrollment_config
            if (this.isClickAdd) {
              this.$apis
                .addFollowupRule(this.currentRule)
                .then((res) => {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                  })
                  this.geRuleList().then(() => {
                    this.setCurrentRule()
                    this.setCurrentRow()
                  })
                  resolve(true)
                })
                .catch(() => {
                  resolve(false)
                })
            } else {
              this.$apis
                .updateFollowupRule(this.currentRule)
                .then(async (res) => {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                  })
                  await this.geRuleList()
                  let obj = null
                  this.ruleList.forEach((v) => {
                    if (v.serial_no == this.currentRule.serial_no) {
                      obj = v
                    }
                  })
                  if (obj) {
                    this.setCurrentRule(obj)
                    this.setCurrentRow(obj)
                  }
                  resolve(true)
                })
                .catch(() => {
                  resolve(false)
                })
            }
          } else {
            resolve(false)
          }
        })
      })
    },
  },
  watch: {
    keyWords() {
      this.searchList()
    },
  },
}
</script>

<style lang="scss" scoped>
.content-left {
  position: fixed;
  padding: 20px;
  min-width: 311px;
  width: 311px;
  margin-right: 20px;
  background-color: #f7f7f7;
  z-index: 1;
  top: 10px;
  left: 10px;
  bottom: 86px;
}
.content-right {
  margin-left: 331px;
  padding-bottom: 86px;
}

.form {
  padding: 20px;
  padding-bottom: 10px;
  background-color: #f7f7f7;
}
</style>
