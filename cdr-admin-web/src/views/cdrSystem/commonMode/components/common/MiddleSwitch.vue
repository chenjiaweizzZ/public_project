<template>
  <div class="container-box">
    <div class="mode-box">
      <div
        v-for="item in middleSwitchList"
        :key="item.value"
        :class="['mode-item', activeValue === item.value ? 'mode-active' : 'mode-noActive']"
        @click="modeChange(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div>
      <span>选择日期</span>
      <el-date-picker
        v-model="dateTime1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        @change="dateTimeChange"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import _ from '@/utils'
export default {
  name: '',
  props: {
    middleSwitchList: {
      type: Array
    },
    middleSwitchActive: {
      type: String
    }
  },
  watch: {
    middleSwitchActive: {
      handler: function(currentData) {
        this.activeValue = currentData
      },
      immediate: true
    },
    '$route.query'() {
      let obj = this.dateList.find(i => {
        return this.$route.query.hzid === i.hzid
      })
      obj ? (this.dateTime1 = _.deepCopy(obj.timeArr, [])) : (this.dateTime1 = '')

      let obj1 = this.outpatientOrHospital.find(i => {
        return this.$route.query.hzid === i.hzid
      })
      this.$emit('modeChange', { value: obj1.model })
      // obj1 ? (this.dateTime1 = _.deepCopy(obj1.timeArr, [])) : (this.dateTime1 = '')
    }
  },
  computed: {
    ...mapState('commonMode', {
      outpatientOrHospital: state => state.outpatientOrHospital,
      dateList: state => state.dateList
    })
  },
  data() {
    return {
      dateTime1: '',
      activeValue: '0',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  created() {
    console.log('middleSwitchCreated')

    //第一次进来的时候更新选择日期状态和住院入院状态
    this.dateTimeChange()
    this.modeChange({ value: '0' })
  },
  methods: {
    ...mapMutations('commonMode', ['SETDATELIST', 'SETOUTPATIENTORHOSPITAL']),
    modeChange(item) {
      let index = this.outpatientOrHospital.findIndex(i => {
        return i.hzid === this.$route.query.hzid
      })
      console.log(index, 'ine')

      let newVal = _.deepCopy(this.outpatientOrHospital, [])
      if (index > -1) {
        newVal[index].model = item.value
      } else {
        let obj = {
          hzid: this.$route.query.hzid,
          model: item.value
        }
        newVal.push(obj)
        console.log('newVal', newVal)
      }
      this.SETOUTPATIENTORHOSPITAL(newVal)
      this.$emit('modeChange', item)
    },
    dateTimeChange(val) {
      console.log(val, 'dateTimeChange')
      let index = this.dateList.findIndex(i => {
        return i.hzid === this.$route.query.hzid
      })
      let newVal = _.deepCopy(this.dateList, [])
      if (val) {
        let tmpArr = val
        let str = val[1].split(' ')[0] + ' ' + '23:59:59'
        tmpArr.splice(1, 1, str)
        if (index > -1) {
          newVal[index].timeArr = tmpArr
        } else {
          let obj = {
            hzid: this.$route.query.hzid,
            timeArr: tmpArr
          }
          newVal.push(obj)
        }
        this.SETDATELIST(newVal)
      } else {
        if (index != -1) {
          console.log('我没有')
          newVal[index].timeArr = []
          this.SETDATELIST(newVal)
        } else {
          let obj = {
            hzid: this.$route.query.hzid,
            timeArr: []
          }
          newVal.push(obj)
          this.SETDATELIST(newVal)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container-box {
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  .mode-box {
    display: flex;
    .mode-item {
      width: 64px;
      height: 24px;
      line-height: 24px;

      text-align: center;
    }
    .mode-active {
      background-color: #0075ff;
      color: #fff;
      font-weight: 700;
      border-radius: 2px 0px 0px 2px;
    }
    .mode-noActive {
      border: 1px solid #c4cbd4;
      border-radius: 0px 2px 2px 0px;
    }
  }
  span {
    font-weight: 400;
    margin-right: 14px;
    vertical-align: middle;
  }
}
</style>
