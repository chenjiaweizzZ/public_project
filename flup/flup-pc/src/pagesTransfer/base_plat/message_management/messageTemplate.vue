<template>
  <section class="device-manager">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>消息类型</p>
        <el-select v-model="flupType" clearable>
          <el-option
            v-for="item in followupTypeList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>搜索</p>
        <el-input
          placeholder="请输入名称"
          v-model="keyword"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
      <div style="display: flex;align-items: center;" class="butBox">
        <el-button type="success" plain @click="addto">新增</el-button>
      </div>
    </div>

    <el-table
      style="margin-bottom:60px"
      ref="table"
      class="margin-top20"
      :data="mainList"
      border
      stripe
    >
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip width="90" prop="flupType" label="消息类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="channel" label="消息渠道" :formatter="formatChannel"></el-table-column>
      <el-table-column show-overflow-tooltip prop="templateName" label="模板名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="msContent" label="模板内容">
        <template slot-scope="scope">
          <span>{{setMsContent(scope.row.msContentJson)}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createUser" label="创建人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="updateUser" label="更新人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="updateTime" label="最近更新时间"></el-table-column>

      <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editTemplate(scope.row)" type="text">编辑</el-button>
          <el-button @click="delTemplate(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisiable"
      width="70%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="messageTemplate"
        ref="messageTemplate"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="消息类型" prop="flupType">
          <el-select v-model="messageTemplate.flupType" placeholder="消息类型">
            <el-option
              v-for="item in followupTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息渠道" prop="channel">
          <el-select v-model="messageTemplate.channel" placeholder="消息渠道">
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息模板名称" prop="templateName">
          <el-input v-model="messageTemplate.templateName" maxlength="50" show-word-limit></el-input>
        </el-form-item>

        <div v-for="(item,index) in conditions" :key="index">
          <el-form-item :label="`序号${(index+1)}`">
            <el-row style="display: flex;justify-content: end;">
              <el-select v-model="item.key" @change="changeSoure(item)">
                <el-option
                  v-for="item in sourceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="margin-left:5px;width:40%">
                <el-select v-if="item.key=='source'" v-model="item.value">
                  <el-option
                    v-for="item in typeList"
                    :key="item.dict_code"
                    :label="item.dict_name"
                    :value="item.dict_code"
                  ></el-option>
                </el-select>
                <el-input v-else v-model="item.value"></el-input>
              </div>
              <div>
                <i
                  class="el-icon-circle-plus-outline"
                  style="color:blue;margin:5px;"
                  @click="addCondition"
                ></i>
                <i
                  v-if="conditions.length>1"
                  class="el-icon-remove-outline"
                  style="color:blue;"
                  @click="delCondition(index)"
                ></i>
              </div>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmBind">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/mixins/pagination'
export default {
  mixins: [Pagination],
  data() {
    return {
      dialogVisiable: false,
      mainList: [],
      keyword: '',
      messageTemplate: {
        flupType: '',
        channel: '',
        templateName: '',
        id: '',
      },
      typeList: [],
      channelList: [{ value: 0, label: '短信' }],
      sourceList: [
        { value: 'div', label: '自定义' },
        { value: 'source', label: '数据源' },
      ],
      rules: {
        flupType: [
          { required: true, message: '请选择消息类型', trigger: 'change' },
        ],
        channel: [
          { required: true, message: '请输入消息渠道', trigger: 'blur' },
        ],
        templateName: [
          { required: true, message: '请输入消息模板名称', trigger: 'blur' },
        ],
      },
      conditions: [{ key: 'source', value: '' }],
      hospitalId: JSON.parse(sessionStorage.getItem('global')).hospital_id,
      keyword: '',
      flupType: '',
      title: '',
      followupTypeList: [],
      pageNo: 1,
      pageSize: 10,
    }
  },
  async created() {
    this.getMainList()
    this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: '',
        // enable: this.type,
        hospitalId: this.hospitalId,
      })
      .then((res) => {
        this.followupTypeList = res.list.filter((item) => {
          return (
            item.name !== '定期检查' &&
            item.name !== '定期检验' &&
            item.name !== '处方提醒' &&
            item.enable != 0
          )
        })
      })
    //获取知识库类型
    this.$apis
      .BaseDictGetDictItems({ parentId: '20210519141759074or0' })
      .then((res) => {
        this.typeList = res
      })
  },

  methods: {
    addCondition() {
      this.conditions.push({ key: 'source', value: '' })
    },
    delCondition(index) {
      this.conditions.splice(index, 1)
    },
    changeSoure(item) {
      item.value = ''
    },

    addto() {
      this.title = '新增消息模版'
      this.messageTemplate.id = ''
      this.messageTemplate.channel = ''
      this.messageTemplate.templateName = ''
      this.messageTemplate.flupType = ''
      this.conditions = [{ key: 'source', value: '' }]
      if (this.$refs['messageTemplate']) {
        this.$refs['messageTemplate'].resetFields()
      }
      this.dialogVisiable = true
    },
    editTemplate(item) {
      this.title = '编辑消息模版'
      this.messageTemplate.id = item.id
      this.messageTemplate.flupType = item.flupType
      this.messageTemplate.channel = item.channel
      this.messageTemplate.templateName = item.templateName
      this.conditions = JSON.parse(item.msContentJson)
      this.dialogVisiable = true
    },
    delTemplate(row) {
      this.$confirm('确定删除该条消息模版吗？')
        .then((_) => {
          this.$apis.deleteMessageTemplate(row.id).then((res) => {
            if (res) {
              this.$message.success('删除成功')
              this.getMainList()
            }
          })
        })
        .catch((_) => {})
    },

    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    getMainList() {
      this.$apis
        .getTemplateList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          flupType: this.flupType,
          keyword: this.keyword,
        })
        .then((res) => {
          this.mainList = res.list || []
          this.total = res.total
        })
    },
    refresh() {
      this.dialogVisiable = false
      this.pageIndex = 1
      this.getMainList()
    },

    onConfirmBind() {
      this.$refs['messageTemplate'].validate((valid) => {
        if (valid) {
          let zx = true
          this.conditions.forEach((item, index) => {
            if (!item.key || !item.value) {
              this.$message.warning('第' + (index + 1) + '条数据未填写！')
              zx = false
            }
          })
          if (!zx) {
            return
          }
          this.messageTemplate.msContentJson = JSON.stringify(this.conditions)
          this.$apis.saveMessageTemplate(this.messageTemplate).then((res) => {
            if (res) {
              this.$notify({
                title: '保存短信模板成功',
                type: 'success',
              })
              this.getMainList()
              this.dialogVisiable = false

              this.keyValue = null
            }
          })
        } else {
          return
        }
      })
    },
    formatChannel(row) {
      return this.channelList.find((x) => x.value == row.channel).label
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1
      this.pageSize = pageSize
      this.getMainList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getMainList()
    },
    setMsContent(list) {
      let arr = JSON.parse(list)
      let msContent = []
      arr.forEach((element) => {
        if (element.key == 'source') {
          for (let i = 0; i < this.typeList.length; i++) {
            if (this.typeList[i].dict_code == element.value) {
              msContent.push(this.typeList[i].dict_name)
            }
          }
        } else {
          msContent.push(element.value)
        }
      })
      return msContent.join(',')
    },
  },
}
</script>
