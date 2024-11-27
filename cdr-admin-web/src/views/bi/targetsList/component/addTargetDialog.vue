<!--  -->
<template>
  <div>
    <el-dialog title="新增指标" :visible.sync="show" width="30%" :close-on-click-modal="false" :before-close="handleClose">
      <el-form ref="form" :model="targetObj" label-width="80px">
        <el-form-item label="指标名称" required>
          <el-input v-model="targetObj.name" maxlength="30"  show-word-limit  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="指标类型" required>
          <div class="targetType-box">
            <div v-for="(item, index) in noActiveType" :key="index" class="targetType-singleItem">
              <div
                :class="[
                  'targetTypeImg-style',
                  targetTypeActive === index ? 'targetTypeImg-active' : ''
                ]"
                @click="clickType(item, index)"
              >
                <img :src="targetTypeActive === index ? activeType[index].imgSrc : item.imgSrc" />
              </div>
              <div>{{ item.label }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select
            v-model="targetObj.classId"
            @visible-change="visibleChange"
            placeholder="请选择指标所属分类"
          >
            <el-option
              v-for="item in targetTypeAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
            <div v-if="!showAddTypeInput" class="addType-style" @click="showAddTypeInputEvent">
              <i class="el-icon-circle-plus-outline"></i>新增分类
            </div>
            <!-- <div > -->
            <div v-else style="  padding: 0px 20px;">
              <el-input
                placeholder="请输入分类名称"
                ref="addTypeInput"
                :maxlength="30"
                autofocus
                v-model="typeInput"
              >
                <template slot="append" class="addType-inputIcon"
                  ><i
                    class="el-icon-circle-close"
                    style="margin-right:11px"
                    @click="
                      showAddTypeInput = false
                      typeInput = ''
                    "
                  ></i
                  ><i class="el-icon-circle-check" @click="addTypeConfirm"></i
                ></template>
              </el-input>
            </div>
            <!-- </div> -->
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="指标说明">
          <el-input v-model="targetObj.remark" type="textarea" maxlength="50" show-word-limit   placeholder="请输入指标说明"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addStatisticsClass, viewStatistics } from '@/service/biTools'
export default {
  props: {
    show: {
      default: false,
      type: Boolean
    },
    targetTypeAllList: {
      default: []
    },
        viewStatisticsList: {
      default: []
    }
  },
  data() {
    return {
      targetObj: {
        name: '',
        typeId: null,
        // typeName:'',
        classId: null,
        remark: ''
      },
      typeInput: '',
      // activeType:null,
      targetTypeActive: 0,
      // testList: [require('@/assets/images/bi/targetListTextType.png'),require('~@/assets/images/bi/targetListTextType.png')],
      noActiveType: [
        { imgSrc: require('@/assets/images/bi/targetListTextType.png'), label: '纯文字' },
        { imgSrc: require('@/assets/images/bi/targetListLineChartType.png'), label: '折线图' },
        { imgSrc: require('@/assets/images/bi/targetListRadarCharType.png'), label: '雷达图' },
        { imgSrc: require('@/assets/images/bi/histogram.png'), label: '柱状图' },
        { imgSrc: require('@/assets/images/bi/pieChart.png'), label: '饼状图' },
        { imgSrc: require('@/assets/images/bi/dashBoard.png'), label: '仪表盘' }
      ],
      activeType: [
        { imgSrc: require('@/assets/images/bi/targetListTextTypeActive.png'), label: '纯文本' },
        {
          imgSrc: require('@/assets/images/bi/targetListLineChartTypeActive.png'),
          label: '折线图'
        },
        {
          imgSrc: require('@/assets/images/bi/targetListRadarCharTypeActive.png'),
          label: '雷达图'
        },
        { imgSrc: require('@/assets/images/bi/histogramActive.png'), label: '柱状图' },
        { imgSrc: require('@/assets/images/bi/pieChartActive.png'), label: '饼图' },
        { imgSrc: require('@/assets/images/bi/dashBoardActive.png'), label: '仪表盘' }
      ],
      showAddTypeInput: false,
      // currentType:[],
    }
  },

  components: {},

  computed: {},
  created() {
    this.currentType = this.noActiveType
    // this.viewStatistics()
  },
  watch:{
    'show':{
      handler:function(){
        this.targetObj={}
        this.targetTypeActive=0
      }
    }
  },
  methods: {
    showAddTypeInputEvent() {
      this.showAddTypeInput = true
      this.$nextTick(() => {
        this.$refs.addTypeInput.focus()
      })
      // console.log(this.$refs.addTypeInput,"this.$refs.addTypeInput");
    },
    visibleChange(flag) {
      !flag ? (this.showAddTypeInput = false) : ''
    },
    handleClose() {
      this.$emit('closeAddTargetDialog')
    },
    clickType(item, index) {
      this.targetTypeActive = index
    },
    addTypeConfirm() {
      if (!this.typeInput.trim()) {
        this.$message({
          message: '请输入分类名称',
          type: 'error'
        })
        return
      }
      if (
        this.targetTypeAllList.some(item => {
          return item.name === this.typeInput
        })
      ) {
        this.$message({
          message: '分类名称已存在',
          type: 'error'
        })
        return
      }
      addStatisticsClass({ name: this.typeInput }).then(res => {
        console.log('呼呼', res)
        if (res == '新增成功') {
          this.$emit('addTypeConfirm')
          //  this.targetObj.
          this.showAddTypeInput = false
        }
      })
    },
    confirm() {
      if (!this.targetObj.name || !this.targetObj.classId || this.targetTypeActive === null) {
        this.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return
      }
      this.targetObj.typeId = this.viewStatisticsList.filter(item => {
        return item.name === this.noActiveType[this.targetTypeActive].label
      })[0].id
      this.$emit('addTargetConfirm',this.targetObj)
      console.log(this.targetObj.typeId, 'this.targetObj.typeId')
    }
  }
}
</script>
<style lang="scss" scoped>
.targetType-box {
  display: flex;
  flex-wrap: wrap;
  .targetType-singleItem {
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .targetTypeImg-style {
      width: 86px;
      height: 64px;

      background: #fafafa;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      // padding:auto   0px ;
      img {
        max-width: 48px;
      }
    }
    .targetTypeImg-active {
      background: rgba(0, 117, 255, 0.06);
      border: 1px solid #0075ff;
    }
  }
}

.addType-style {
  color: #666;
  font-size: 14px;
  padding: 0px 20px;
  height: 35px;
  line-height: 35px;
  i {
    font-size: 16px;
    color: #666;
    margin-right: 5px;
  }
}
.addType-inputIcon {
  display: flex;
  justify-content: space-around;
  i {
    font-size: 16px;
    color: #666;
  }
}
::v-deep .el-select-dropdown__item {
  color: #666;
}
::v-deep .el-input-group__append {
  padding: 0 7px !important;
}


::v-deep .el-dialog__title{
  border-left:4px solid #0075FF;
  padding-left: 5px;
}

::v-deep .el-form-item {
  margin-bottom: 6px !important;
}
</style>
