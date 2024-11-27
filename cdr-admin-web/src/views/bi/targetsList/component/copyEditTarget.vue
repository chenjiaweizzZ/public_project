<!--  -->
<template>
  <div>
    <el-dialog
      :title="model === '1' ? '复制指标' : '修改指标'"
      :visible.sync="show"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="targetObj" label-width="95px">
        <el-form-item label="新指标名称" required>
          <el-input v-model="targetObj.name"  maxlength="30"  show-word-limit ></el-input>
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="targetObj.classId" placeholder="请选择所属分类">
            <el-option
              v-for="item in targetTypeAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标说明">
          <el-input v-model="targetObj.remark" type="textarea" maxlength="50" show-word-limit></el-input>
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
import _ from '@/utils'
export default {
  props: {
    show: {
      default: false,
      type: Boolean
    },
    model: {
      default: '',
      type: String
    },
    activeTarget: {
      type: Object
    },
    targetTypeAllList: {
      default: []
    }
  },
  data() {
    return {
      targetObj: {
        name: '',
        // typeName:'',
        classId: null,
        remark: ''
      },
      typeInput: '',
      // activeType:null,
      targetTypeActive: 0
      // testList: [require('@/assets/images/bi/targetListTextType.png'),require('~@/assets/images/bi/targetListTextType.png')],
      // currentType:[],
    }
  },

  components: {},

  computed: {},
  watch: {
    activeTarget: function(currentData) {
      if (this.model === '2') {
        this.targetObj=_.deepCopy(currentData,{})
      }else{
         this.targetObj=_.deepCopy({},{})
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeCopyEditTarget')
    },
    confirm() {
      this.$emit('copyEditConfirm',this.targetObj)
    },
    showAddTypeInputEvent() {
      this.showAddTypeInput = true
      this.$nextTick(() => {
        this.$refs.addTypeInput.focus()
      })
      // console.log(this.$refs.addTypeInput,"this.$refs.addTypeInput");
    }
  }
}
</script>
<style lang="scss" scoped></style>
