<template>
  <div>
    <el-timeline v-for="(item, index) in timeLineList" :key="index">
      <el-timeline-item
        :timestamp="
          item.flag
            ? '全部'
            : id === 'zyh'
            ? (item.ryrqsj ? item.ryrqsj.split(' ')[0] : '') +
              '至' +
              (item.cyrqsj ? item.cyrqsj.split(' ')[0] : '')
            : item.ksjzrq
            ? item.ksjzrq.split(' ')[0]
            : ''
        "
        :color="activeValue === item[id] ? '#0075FF' : '#D7DAE0'"
        placement="top"
        @click.native="cardClick(item)"
      >
        <el-card
          v-if="!item.flag"
          :class="['timeLine-card', activeValue === item[id] ? 'timeLine-cardActive' : '']"
        >
          <div style="margin-bottom:8px">{{ item.jzks }}</div>
          <div class="timeline-sub" style="margin-bottom:8px">{{ item.zzd }}</div>
          <div>
            <span class="timeline-sub">{{ id === 'zyh' ? item.zzys : item.jzys }}</span>
            <!-- 如果住院需要展示护士 -->
            <span class="timeline-sub" v-if="id === 'zyh'" style="margin-left:12px">{{
              item.zrhs
            }}</span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    timeLineList: {
      type: Array
    },
    id: {
      type: String
    },
    activeTimeLine: {
      type: String
    }
  },
  watch: {
    activeTimeLine: {
      handler: function(currentData) {
        this.activeValue = currentData
        console.log('this.activeValue', this.activeValue)
      },
      immediate: true
    }
  },
  data() {
    return {
      activeValue: ''
    }
  },

  activated() {
    console.log(this.timeLineList, 'jjjj')
    // this.$nextTick(() => {
    //   this.$set(
    //     this,
    //     'activeValue',
    //     this.id === 'zyh' ? this.timeLineList[0].zyh : this.timeLineList[0].mjzh
    //   )
    //   console.log(this.activeValue,"this.activeValue");
    // })
    // this.activeValue=this.timeLineList.lenght?this.timeLineList[0][this.id]:''
  },
  methods: {
    cardClick(val) {
      this.activeValue = val[this.id]
      this.$emit('cardClick', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.timeLine-card {
  :first-child {
    color: #111;
    font-size: 14px;
  }
  .timeline-sub {
    color: #666 !important;
    // font-size: 14px !important;
  }
}
.timeLine-cardActive {
  border: 1px solid #0075ff;
  background: #f5faff;
  div:first-child {
    color: #0075ff;
  }
}

::v-deep .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: 0px 0px 0px #fff;
}
::v-deep .el-timeline-item__timestamp.is-top {
  padding-top: 0px;
  margin-left: -10px;
}
::v-deep .el-timeline-item__content{
    margin-left: -10px;

}
</style>
