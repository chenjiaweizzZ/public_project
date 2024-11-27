<template>
  <section>
    <el-dialog
      title="随访时间配置"
      :visible="show"
      width="650px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="onClose"
    >
      <section v-if="show" class="rule-time-add">
        <el-row
          class="rule-time-add-item"
          type="flex"
          align="middle"
          v-for="(item, i) in mainList"
          :key="i"
        >
          <div>第{{i+1}}条</div>
          <el-select class="width180px margin-left10" v-model="item.interventionBenchmark">
            <el-option
              v-for="item in interventionList"
              :key="item.dict_name"
              :label="item.dict_name"
              :value="item.dict_name"
              :disabled="(item.enabled ==0 || patientType != item.dict_code) && item.dict_code !== 'CUSTOM_START'"
            ></el-option>
          </el-select>
          <el-input-number
            style="height:40px"
            class="width150px margin-left10"
            v-model="item.interventionDay"
            :min="0"
            :max="9999"
            controls-position="right"
          ></el-input-number>
          <el-select class="width70px margin-left10" v-model="item.executeUnit">
            <el-option
              v-for="item in unitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button class="margin-left10" type="text" @click="addField(i)">添加</el-button>
          <el-button v-if="i!==0" type="text" @click="deleteField(i)">删除</el-button>
        </el-row>
      </section>
      <span slot="footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { patientModel } from '@/mixins/enum.js'
export default {
  name: 'tiem-add',
  mixins: [patientModel],
  props: {
    show: Boolean,
    data: Array,
    serialNo: String,
    patientType: String,
  },
  data() {
    return {
      unitList: [
        { label: '天', value: 0 },
        { label: '周', value: 1 },
        { label: '月', value: 2 },
      ],
      interventionList: [],
      mainList: [
        {
          flupRuleId: null,
          interventionBenchmark: '',
          interventionDay: 0,
          executeUnit: 0,
        },
      ],
    }
  },
  // watch: {
  //   data () {
  //     if(this.data && this.data.length > 0) {
  //       this.mainList = [...this.data]
  //     } else {
  //       this.mainList = [
  //         {
  //           interventionBenchmark: '',
  //           interventionDay: 0,
  //           executeUnit: 0,
  //         }
  //       ]
  //     }
  //   }
  // },
  created() {
    this.$apis.BaseDictGetDictsByDictCode({ dictCode: 'jrjz' }).then((res) => {
      //this.interventionList = res
      this.interventionList = res.filter((x) =>  x.enabled != '0')
    })
    if (this.data && this.data.length > 0) {
      this.mainList = [...this.data]
    } else {
      this.mainList = [
        {
          interventionBenchmark: '',
          interventionDay: 0,
          executeUnit: 0,
          flupRuleId: this.serialNo,
          patientTypeCode: this.patientModel.discharge,
        },
      ]
    }
  },
  methods: {
    // setDictName() {
    //   this.mainList.forEach((element) => {
    //     element.interventionBenchmark = this.mainList[0].interventionBenchmark
    //   })
    // },
    addField(index) {
      this.mainList.push({
        interventionBenchmark: this.mainList[index].interventionBenchmark,
        interventionDay: this.mainList[index].interventionDay,
        executeUnit: this.mainList[index].executeUnit,
        flupRuleId: this.serialNo,
        patientTypeCode: this.patientModel.discharge,
      })
    },
    deleteField(i) {
      if (this.mainList[i].id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          console.log(this.mainList[i].id)
          this.$apis
            .timeconfigdelFlupTimeconfig(this.mainList[i].id)
            .then((res) => {
              this.mainList.splice(i, 1)
              console.log(this.$parent)
              this.$parent.$parent.getTimeList()
            })
        })
      } else {
        this.mainList.splice(i, 1)
      }
    },
    onClose() {
      this.$emit('update:show', false)
    },
    onSave() {
      this.mainList.forEach(
        (item) =>
          (item.patientTypeCode = this.interventionList.find(
            (x) => x.dict_name == item.interventionBenchmark
          ).dict_code)
      )
      this.onClose()
      this.$apis.timeconfigsaveFlupTimeconfig(this.mainList).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
        })
        this.$parent.$parent.getTimeList()
      })
    },
  },
}
</script>

<style lang="scss">
.rule-time-add {
  padding: 20px;
  min-height: 300px;
  &-footer {
    display: flex;
    justify-content: center;
    .el-button + .el-button {
      margin-left: 60px;
    }
  }
  &-item + &-item {
    margin-top: 10px;
  }
}
</style>