<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <el-button type="primary" @click="onAdd" plain>新建</el-button>
      <el-button type="success" @click="openImport" plain>从模板库导入</el-button>
      <template v-slot:right>
        <!-- <treeselect
          class="width180px"
          v-model="category"
          :options="categoryList"
          placeholder="请选择分类"
        />-->
        <p style="width:50px"  v-if="componentValue == 1 && (type == 2 || type == 3)">状态</p>
        <el-select class="margin-left10"  v-if="componentValue == 1 && (type == 2 || type == 3)" clearable v-model="authState" placeholder="请选择">
          <el-option label="待审核" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核未通过" value="2"></el-option>
          <el-option label="已撤回" value="3"></el-option>
        </el-select>
        <p style="width:50px;margin-left:10px;">科室</p>
        <el-select class="width180px margin-left10" clearable v-model="dept" placeholder="请选择科室">
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <p style="width:80px">&emsp;搜索</p>
        <el-input
          :placeholder="`请输入${label}名称`"
          v-model="templateName"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </template>
    </OperationHeader>
    <el-table style="margin-bottom:60px" ref="table" :data="mainList" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column v-if="type == 3" show-overflow-tooltip prop="questionnaireClass" label="名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="questionnaireName" :label="label + '标题'"></el-table-column>
      <el-table-column show-overflow-tooltip label="科室">
        <template slot-scope="scope">
          {{
          findDept(scope.row.flupDept)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="authState" width="130" label="状态" v-if="componentValue == 1 && (type == 2 || type == 3)">
        <template slot-scope="{row}">
          <span v-if="row.authState == 0">待审核</span>
          <span v-else-if="row.authState == 1">审核通过</span>
          <span v-else-if="row.authState == 2">审核不通过</span>
          <span v-else>已撤回</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :width="90" prop="createUser" label="创建人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="updateTime" label="修改时间"></el-table-column>
      <!-- <el-table-column
        :formatter="(row, col, val) => {return $utils.formatDate(val,'YYYY-MM-DD HH:mm:ss')}"
        show-overflow-tooltip
        :width="170"
        prop="create_time"
        label="创建时间"
      ></el-table-column>-->
      <el-table-column v-if="type === 2" :width="120" label="异常反馈模式">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.exceptionEnabled"
            @change="onSwitch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" :width="350">
        <template slot-scope="scope">
          <el-button v-if="componentValue == 0 || (componentValue == 1 && scope.row.authState == 1)" @click="addToQuBaseTemplate(scope.row)" type="text">存入模板库</el-button>
          <el-button v-if="componentValue == 0 || (componentValue == 1 && scope.row.authState == 1)" @click="goSendRecord(scope.row)" type="text">发送详情</el-button>
          <el-button @click="onView(scope.row)" type="text" icon="el-icon-search">预览</el-button>
          <el-button
            v-if="
              scope.row.create_user == $global.real_name ||
              $global.role_name.includes('管理员')
            "
            @click="onEdit(scope.row)"
            type="text"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            v-if="
              scope.row.create_user == $global.real_name ||
              $global.role_name.includes('管理员')
            "
            @click="onDele(scope.row)"
            type="text"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px; text-align: right">
      <el-pagination
        class="pageBottom"
        v-if="mainList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.pageIndex"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import deptList from '@/mixins/deptList'
import templateType from '@/mixins/templateType'
import templateCategory from '@/mixins/templateCategory'
export default {
  mixins: [deptList, templateType, templateCategory],
  data() {
    return {
      mainList: [],
      hospitalId: null,
      pageQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      templateName: '',
      total: 0,
      hospitalList: null,
      componentValue:0,
      authState:'',
    }
  },
  async created() {
    this.$startLoading()
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    this.$apis
      .departmentgetDeptByHospitalId({
        hospitalId: this.hospitalId,
      })
      .then((res) => {
        this.hospitalList = res
      })
    this.getQueryFlupConfigOne();
    await this.getCategoryV2(this.type)
    await this.getAllNewDept()
    this.dept = ''
    await this.getList()
    this.$stopLoading()
  },
  methods: {
    async getQueryFlupConfigOne(){
      let componentKey = 'xjTemplateCreateAuth'
      if(this.type == 2){
        componentKey = "wjTemplateCreateAuth"
      }
      let res = await this.$apis
      .queryFlupConfigOne({
          hospitalId: this.$global.hospital_id,
          moduleCode: 'followUpSetting',
          componentKey,
        })
      if(res){
        this.componentValue = res.componentValue;
      }
    },
    addToQuBaseTemplate(row) {
      this.$apis
        .addToQuBaseTemplate({
          categoryCode: row.categoryCode,
          categoryName: row.categoryName,
          serialNo: row.serialNo,
          templateType: this.type == 2 ? 1 : 2,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
    },
    goSendRecord(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url:
              urlx +
              '/#/sendRecord?serialNo=' +
              row.serialNo +
              '&flupType=' +
              row.flupType,
            title: `发送记录`,
          }),
          '*'
        )
      } else {
        window.open(
          urlx +
            '/#/sendRecord?serialNo=' +
            row.serialNo +
            '&flupType=' +
            row.flupType
        )
      }
    },
    onSwitch(row) {
      this.$apis
        .ExceptionEnabled(row)
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功',
          })
        })
        .catch(() => {
          if (row.exceptionEnabled === 1) {
            row.exceptionEnabled = 0
          } else {
            row.exceptionEnabled = 1
          }
        })
    },
    openImport() {
      this.$router.push({
        name: 'newimporttemplate',
        params: this.type === 2 ? 'wenjuan' : 'xuanjiao',
      })
    },
    onView(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: urlx + '/#/newpreview?serial_no=' + row.serialNo,
            title: `预览${this.label}`,
          }),
          '*'
        )
      } else {
        window.open(urlx + '/#/newpreview?serial_no=' + row.serialNo)
      }
    },
    onEdit(row) {
      if (this.type == 3) {
        this.$router.push('/neweditEducate?serialNo=' + row.serialNo)
      } else {
        this.$router.push(
          '/neweditQuestionaire/hospital?serialNo=' + row.serialNo
        )
      }
    },
    onAdd() {
      if (this.type == 3) {
        this.$router.push('/neweditEducate')
      } else {
        this.$router.push('/neweditQuestionaire/hospital')
      }
    },
    findDept(id) {
      let item = this.hospitalList.find((item) => item.serialNo === id)
      if (item) return item.deptName
      if (id == 'ALL') return '全院'
      return id
    },
    onDele(row) {
      let askMsgs = {
        2: '删除此问卷，会导致还在答题的用户提交失败。确定要删除该问卷？',
        3: `确定要删除"${row.questionnaireName}"这条数据吗？`,
      }
      this.$confirm(askMsgs[this.type], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis
            .templatedelTemplateData({
              serialNo: row.serialNo,
              hospitalId: this.hospitalId,
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              if (this.mainList.length == 1 && this.pageQuery.pageIndex != 0) {
                this.pageQuery.pageIndex = this.pageQuery.pageIndex - 1
              }
              this.getList()
            })
          // this.$apis[this.type == 2 ? "deleWJTemplate" : "deleXJTemplate"](
          //   {
          //     serial_no: row.serial_no
          //   }
          // ).then(res => {
          //   if (res.state == "success" || res == true) {
          //     this.$message({
          //       message: "删除成功",
          //       type: "success"
          //     });
          //     this.getList();
          //   } else {
          //     this.$message({
          //       message: "删除失败",
          //       type: "error"
          //     });
          //   }
          // });
        })
        .catch(() => {})
    },
    // getDeptOptions() {
    //   return this.$apis.getDeptList().then(res => {
    //     if (Object.prototype.toString.call(res) == "[object Array]")
    //       this.deptOptions = [{ Value: "ALL", Text: "全院" }, ...res];
    //   });
    // },
    getList() {
      return this.$apis
        .templatequeryTemplateList({
          type: this.type,
          deptId: this.dept,
          templateName: this.templateName,
          categoryCode: this.category,
          pageNo: this.pageQuery.pageIndex,
          pageSize: this.pageQuery.pageSize,
          hospitalId: this.hospitalId,
          authState:this.authState,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
      // return this.$apis[
      //   this.type == 2 ? "getWJTemplateList" : "getXJTemplateList"
      // ]({
      //   page: this.pageQuery.pageIndex,
      //   rows: this.pageQuery.pageSize,
      //   sord: "asc",
      //   search: "",
      //   param: JSON.stringify({
      //     hospital_id: this.$global.hospital_id,
      //     type_id: this.type,
      //     dept_id: this.dept,
      //     keyWord: this.templateName
      //   })
      // }).then(res => {
      //   if (res.return_code == 0) {
      //     this.mainList = res.rows;
      //     this.total = res.total;
      //   } else {
      //     this.$message({
      //       message: res.return_info,
      //       type: "error"
      //     });
      //   }
      // });
    },
    onSearch(query) {
      this.pageQuery.pageIndex = 1
      this.getList()
    },
    handleSizeChange(v) {
      this.pageQuery.pageIndex = 1
      this.pageQuery.pageSize = v
      this.getList()
    },
    handleCurrentChange(v) {
      this.getList()
    },
  },
}
</script>
