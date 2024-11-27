<!-- 单个指标组件 -->
<template>
  <div class="target-box">
    <div class="targetBox-header">
      <div style="width:calc(100% - 50px)">
        <el-popover trigger="hover" placement="bottom">
          <span slot="reference" class="target-name">{{ obj.name }}</span>
          <span>{{obj.list&&obj.list.length?'已应用大屏':'无应用大屏'}}</span>
          <div v-for="item in obj.list" :key="item.id" class="largeScreen-applied">
            <img :src="screenIcon" width="20" height="18" />{{ item.name }}{{item.status==1?'（已发布）':'（待发布）'}}
          </div>
        </el-popover>
        <el-popover placement="bottom" trigger="click">
          <div
            v-for="item in handleList"
            :key="item.value"
            class="handleList-style"
            @click="copyEditTarget(item)"
          >
            <span>{{ item.label }}</span>
          </div>
          <i slot="reference" class="el-icon-caret-bottom"></i>
        </el-popover>
      </div>
      <div style="min-width:45px">
        <img :src="targetListRreview" style="margin-right:12px" @click="reviewTarget" />
        <img :src="targetListEdit" @click="gotoEdit" />
      </div>
    </div>
    <div class="imgConten-box">
      <img v-if="obj.thumbnail" :src="obj.thumbnail" />
    </div>
    <div class="targetBox-bottom">
      <div :title="targetClassName">
        {{ targetClassName }}
      </div>
      <div :title="obj.remark ">{{ obj.remark }}</div>
    </div>
  </div>
</template>

<script>
import targetListRreview from '../../../../assets/images/bi/targetListRreview.png'
import targetListEdit from '../../../../assets/images/bi/targetListEdit.png'
import screenIcon from '../../../../assets/images/bi/screenIcon.png'
export default {
  props: {
    obj: {
      type: Object,
      default: {}
    },
    targetTypeAllList: {
      type: Array
      // default:[]
    }
  },
  data() {
    return {
      handleList: [
        { value: '1', label: '复制' },
        { value: '2', label: '修改' },
        { value: '3', label: '删除' }
      ],
      targetListEdit,
      targetListRreview,
      screenIcon
    }
  },

  components: {},

  computed: {
    targetClassName() {
      let tmp = this.targetTypeAllList.filter(item => {
        return item.id === this.obj.classId
      })
      if (tmp && tmp.length) {
        return tmp[0].name
      } else {
        return '暂无数据'
      }
    }
  },

  methods: {
    copyEditTarget(item) {
      console.log('testtttyyyy')
      this.$emit('showCopyEditTargetEvent', item, this.obj)
    },
    reviewTarget() {
      this.$emit('reviewTarget', this.obj)
    },
    gotoEdit() {
      this.$emit('gotoEdit', this.obj)
    }
  }
}
</script>
<style lang="scss" scoped>
.textOverflow-style {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.target-box {
  border: 1px solid #d7dae0;
  padding: 10px;
  width: 100%;
  height: 100%;
  margin: 10px;
  .targetBox-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    .target-name {
      font-size: 14px;
      display: inline-block;
      max-width: calc(100% - 30px);
      width:fit-content;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 8px;
      text-overflow: ellipsis;
    }
    .largeScreen-applied {
      display: inline-block;
      margin-bottom: 8px;
      height: 20px;
      img {
        margin-right: 8px;
        vertical-align: center;
      }
    }
    img {
      width: 15px;
      height: 16px;
    }
  }
  .imgConten-box {
    background: #fbfbfb;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #E6E6E6;
    height: calc(100% - 20px - 20px - 6px );
    img {
      max-width: 200px;
      max-height: 140px;
    }

  }
  .targetBox-bottom {
    display: flex;
    align-items: center;
    padding: 5px 0px 5px 0px;
    div:first-child {
      @extend .textOverflow-style;
      display: inline-block;
      max-width: 100px;
      line-height: 20px;
      border-radius: 10px;
      color: #0075ff;
      background: #e8f2fd;
      font-size: 12px;
      padding: 0px 8px;
      margin-right: 8px;
    }
    div:nth-child(2) {
      @extend .textOverflow-style;
      // flex: 3;
      font-size: 14px;
      color: #999;
    }
  }
}
.handleList-style {
  height: 28px;
  color: #666;
  line-height: 28px;
  font-size: 14px;
  span {
    display: inline-block;
    height: 28px;
    width: 100%;
  }
  span:hover {
    color: #fff;

    background-color: #0075ff;
  }
}
::v-deep .el-popover {
  padding: 0px;
}
</style>
