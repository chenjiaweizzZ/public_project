<template>
  <section class="margin-top20">
    <el-row>
      <div style="float: right; margin-bottom: 5px">
        <el-button v-if="editable" @click="onAdd">添 加</el-button>
      </div>
    </el-row>
    <el-table :data="mainList" stripe border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip label="药品名称" min-width="100">
        <template slot-scope="scope">
          <el-select v-if="scope.$index == editIndex" v-model="editRow.drugCode">
            <el-option v-for="item in drugList" :key="item.serial_no" :label="item.dict_name" :value="item.serial_no"></el-option>
          </el-select>
          <div v-else>{{ scope.row.drugName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="药物剂量" min-width="100">
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.$index == editIndex" v-model="editRow.drugDose" maxlength="4"></el-input> -->
          <el-input-number v-if="scope.$index == editIndex" v-model="editRow.drugDose" :max="999999" :min="1" controls-position="right"></el-input-number>
          <div v-else>
            {{ scope.row.drugDose }}
            <span v-if="!editable">({{ scope.row.drugDoseUnit }})</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip v-if="editable" label="药物剂量单位" min-width="120">
        <template slot-scope="scope">
          <el-select v-if="scope.$index == editIndex" v-model="editRow.drugDoseUnit">
            <el-option v-for="item in drugDoseUnitList" :key="item.key" :label="item.key" :value="item.key"></el-option>
          </el-select>
          <div v-else>{{ scope.row.drugDoseUnit }}</div>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="100">
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.$index == editIndex" v-model="editRow.drugNum" maxlength="4"></el-input> -->
          <el-input-number v-if="scope.$index == editIndex" v-model="editRow.drugNum" :max="999999" :min="1" controls-position="right"></el-input-number>
          <div v-else>
            {{ scope.row.drugNum }}
            <span v-if="!editable">({{ scope.row.drugNumUnit }})</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="editable" show-overflow-tooltip label="数量单位" min-width="120">
        <template slot-scope="scope">
          <el-select v-if="scope.$index == editIndex" v-model="editRow.drugNumUnit">
            <el-option v-for="item in drugNumUnitList" :key="item.key" :label="item.key" :value="item.key"></el-option>
          </el-select>
          <div v-else>{{ scope.row.drugNumUnit }}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="天数(天)" min-width="100">
        <template slot-scope="scope">
          <el-input-number v-if="scope.$index == editIndex" v-model="editRow.drugDays" :max="9999" :min="1" controls-position="right"></el-input-number>
          <div v-else>{{ scope.row.drugDays }}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="用法" min-width="150">
        <template slot-scope="scope">
          <el-input v-if="scope.$index == editIndex" v-model="editRow.usageAndDosage" maxlength="150"></el-input>

          <div v-else>{{ scope.row.usageAndDosage }}</div>
        </template>
      </el-table-column>
      <div v-if="!originalPre">
        <el-table-column label="首条发送时间" min-width="210">
          <template slot-scope="scope">
            <el-date-picker value-format="yyyy-MM-dd" v-if="scope.$index == editIndex" v-model="editRow.firstSendTime" type="date" placeholder="选择日期"></el-date-picker>
            <div v-else>{{ scope.row.firstSendTime }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="发送间隔(天)" min-width="120">
          <template slot-scope="scope">
            <el-input-number v-if="scope.$index == editIndex" v-model="editRow.sendInterval" :max="9999" :min="1" controls-position="right"></el-input-number>
            <div v-else>{{ scope.row.sendInterval }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="共计发送次数" min-width="120">
          <template slot-scope="scope">
            <el-input-number v-if="scope.$index == editIndex" v-model="editRow.sendTimes" :min="1" :max="9999" controls-position="right"></el-input-number>
            <div v-else>{{ scope.row.sendTimes }}</div>
          </template>
        </el-table-column>
      </div>
      <el-table-column v-if="editable" fixed="right" prop="createTime" label="操作" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex && editSattus !== 'none'">
            <el-button v-if="originalPre || scope.$index != 0 || mainList.length > 1" @click="onCancel" type="text">撤销</el-button>

            <el-button type="text" @click="onConfirm(scope.$index)">确定</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="onEdit(scope.$index)">编辑</el-button>
            <el-button v-if="scope.$index != 0 || mainList.length > 1" type="text" @click="onDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      drugList: [],
      editSattus: 'none',
      editIndex: -1,
      mainList: [],
      editRow: {},
      drugDoseUnitList: [{ key: '盒' }, { key: '支' }, { key: '袋' }],
      drugNumUnitList: [{ key: 'ml' }, { key: 'mg' }],
    }
  },
  props: {
    normalData: Array,
    editable: Boolean,
    originalPre: Boolean,
  },
  created() {
    //获取药品列表
    this.$apis
      .BaseDictGetEnableDictItems({ parentId: '20201211100325075164' })
      .then((res) => {
        this.drugList = res
      })
  },
  watch: {
    normalData: {
      handler() {
        if (this.normalData) {
          this.mainList = this.normalData
        }
      },
      immediate: true,
    },
  },
  methods: {
    onEdit(index) {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        })
        return
      }
      this.editSattus = 'edit'
      this.editIndex = index
      this.editRow = { ...this.mainList[index] }
    },
    onConfirm(index) {
      if (!this.editRow.drugCode) {
        this.$message({
          type: 'warning',
          message: '请填写药物名称',
        })
        return
      }
      this.editRow.drugName = this.drugList.filter(
        (x) => x.serial_no == this.editRow.drugCode
      )[0].dict_name
      if (!this.editRow.drugDose) {
        this.$message({
          type: 'warning',
          message: '请填写药物剂量',
        })
        return
      }
      if (!this.originalPre && !this.editRow.firstSendTime) {
        this.$message({
          type: 'warning',
          message: '请选择首次发送时间',
        })
        return
      }
      this.editSattus = 'none'
      this.$set(this.mainList, index, this.editRow)
      this.editIndex = -1
    },
    async onDelete(index) {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        })
        return
      }
      await this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      this.mainList.splice(index, 1)
    },
    onAdd() {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        })
        return
      }
      this.editRow = {
        drugName: '',
        drugCode: '',
        drugDose: '',
        drugDoseUnit: this.drugDoseUnitList[0].key,
        drugNum: '',
        drugNumUnit: this.drugNumUnitList[0].key,
        drugDays: '',
        usageAndDosage: '',
        firstSendTime: '',
        sendInterval: 0,
        sendTimes: 0,
      }
      this.editSattus = 'add'
      this.mainList.push({})
      this.editIndex = this.mainList.length - 1
    },
    onCancel() {
      if (this.editSattus === 'add') {
        this.mainList.splice(this.mainList.length - 1, 1)
      }
      this.editSattus = 'none'
      this.editIndex = -1
    },
  },
}
</script>