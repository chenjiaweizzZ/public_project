<template>
  <div>
    <section class="sidebar-left">
      <el-row class="bg border-bottom1 paddingX20 padding20X" type="flex" align="middle" justify="space-between">
        <div>随访路径</div>
        <el-button v-if="!noback" class="margin-left10" type="primary" @click="$emit('addRoute')">新增随访路径</el-button>
      </el-row>
      <!-- <el-menu class="scroll-auto preview-menu" text-color="#425B77" background-color="rgba(42, 63, 84, 0.04)" :default-active="activeIndex" @select="changeMenuItem">
        <el-menu-item v-for="(item, i) in mainList" :key="i" :index="`${i}`">
          <el-row type="flex">
            <div class="item-mark" :style="{'margin-top': i==0?'10px': '0'}">
              <div v-if="i !== 0" class="line" style="height:10px"></div>
              <div class="dot"></div>
              <div v-if="i !== mainList.length - 1" class="line"></div>
            </div>
            <div class="item-text">
              <div class="item-time">{{ formatExeTime(item) }}</div>
              <div class="item-content">{{`${item.flup_type || ''}-${$utils.formatFollowupContent(item) || ''}`}}</div>
            </div>
          </el-row>
        </el-menu-item>
      </el-menu>-->
      <el-collapse class="paddingX10 padding10X flex1 padding-left40" v-model="activeNames" style="overflow-y:auto;overflow-x:hidden;background-color:#F7F8F8" accordion>
        <el-collapse-item style="position:relative" v-for="(item,index) in group" :key="item.label" :title="item.label" :name="item.label">
          <template slot="title">
            <div>{{item.label}}</div>
            <div style="position:absolute;top:0;left:-20px;width:9px;display:flex;flex-direction:column;height:60px;align-items:center">
              <div v-if="index!==0" style="width:1px;background: #539CDB;height:15px"></div>
              <div v-else style="height:15px"></div>
              <div class="circle-time"></div>
              <div v-if="index !== group.length-1 || (activeNames == item.label && item.List.length>0)" style="width:1px;background: #539CDB;flex:1"></div>
            </div>
          </template>
          <el-menu class="scroll-auto preview-menu" text-color="#425B77" background-color="rgba(42, 63, 84, 0.04)" :default-active="activeIndex" @select="changeMenuItem">
            <el-menu-item v-for="(jitem, i) in item.List" :key="i" :index="`${index}-${i}`">
              <el-row type="flex" class="padding-right14" style="border-bottom: 1px solid #E6E6E6;position:relative;">
                <div class="item-text width100">
                  <el-row type="flex" justify="space-between" class="item-time">
                    {{ formatExeTime(jitem) }}
                    <i v-if="!noback" class="el-icon-edit-outline" style="color:#539cdb" @click.stop="$emit('addRoute', jitem.followupRoute)"></i>
                  </el-row>
                  <div class="item-content">{{`${jitem.flup_type || ''}-${$utils.formatFollowupContent(jitem) || ''}`}}</div>
                </div>
              </el-row>
              <template v-if="activeNames == item.label">
                <div :style="{top: 60 + 90*i +'px'}" style="position:absolute;top:60px;left:-20px;width:9px;display:flex;flex-direction:column;height:100px;align-items:center;">
                  <div style="width:1px;background: #539CDB;height:20px"></div>
                  <div class="circle-item"></div>
                  <div v-if="index!==group.length-1 || i!==item.List.length-1" style="width:1px;background: #539CDB;flex:1"></div>
                </div>
              </template>
            </el-menu-item>
          </el-menu>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section style="margin-left:331px;margin-bottom:66px">
      <el-row class="bg padding20X paddingX20">
        <el-row type="flex">
          <el-row class="description-width" type="flex">
            <div class="box-label">随访类型</div>
            <span>{{currentItem.flup_type || ''}}</span>
          </el-row>
          <el-row class="description-width" type="flex">
            <div class="box-label">随访内容</div>
            <span>{{$utils.formatFollowupContent(currentItem) || ''}}</span>
          </el-row>
        </el-row>
        <el-row class="margin-top10" type="flex">
          <el-row class="description-width" type="flex">
            <div class="box-label">随访执行时间</div>
            <span>{{getTime(currentItem)}}</span>
          </el-row>
          <el-row class="description-width" type="flex">
            <div class="box-label">随访完成时间</div>
          </el-row>
        </el-row>
      </el-row>
      <el-row class="margin-top20" v-if="currentItem.flup_type == '专科随访'" type="flex">
        <iframe class="flex1" ref="iframe" frameborder="0" :src="url"></iframe>
      </el-row>
      <el-row style="margin-top:20px" v-else-if="['调查问卷', '健康宣教'].includes(currentItem.flup_type)" type="flex">
        <TemplateContent :type="currentItem.flup_type == '健康宣教' ? 2 : 1" :query="templateQuery" hideSubmit preview></TemplateContent>
      </el-row>
      <el-table class="margin-top20" v-else-if="currentItem.flup_type == '定期检查' || currentItem.flup_type == '定期检验'" :data="checkList" highlight-current-row stripe border>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <template v-if="currentItem.flup_type == '定期检查'">
          <el-table-column key="checkType" show-overflow-tooltip :formatter="formatCheckType" label="检查分类"></el-table-column>
          <el-table-column key="checkPart" show-overflow-tooltip :formatter="formatCheckPart" label="检查部位"></el-table-column>
          <el-table-column key="checkItem" show-overflow-tooltip :formatter="formatCheckItem" label="检查项目"></el-table-column>
        </template>
        <template v-else>
          <el-table-column key="inspectionName" show-overflow-tooltip :formatter="formatInspectionType" label="检查名称"></el-table-column>
          <el-table-column key="inspectionType" show-overflow-tooltip :formatter="formatInspectionName" label="样本类型"></el-table-column>
        </template>
      </el-table>
    </section>
    <el-row v-if="!noback" class="footer" align="middle" type="flex" justify="end">
      <el-button @click="$emit('back')">返回规则管理库</el-button>
    </el-row>
  </div>
</template>

<script>
import TemplateContent from '@/components/tempalteContent'
export default {
  name: 'preview-followup-route',
  data() {
    return {
      currentItem: {},
      url: null,
      isloading: false,
      activeIndex: '-1',
      checkList: [],
      // group: [
      //   {
      //     label: '入院',
      //     List:[]
      //   },
      //   {
      //     label: '出院',
      //     List:[]
      //   },
      //   {
      //     label: '出院半年后',
      //     List:[]
      //   },
      //   {
      //     label: '出院一年后',
      //     List:[]
      //   },
      //   {
      //     label: '出院两年后',
      //     List:[]
      //   }
      // ],
      activeNames: '入院',
      templateQuery: {},
    }
  },
  components: {
    TemplateContent,
  },
  props: {
    mainList: Array,
    noback: Boolean,
  },
  computed: {
    group() {
      let returnArr = [
        {
          label: '入院',
          List: [],
        },
        {
          label: '出院',
          List: [],
        },
        {
          label: '出院半年后',
          List: [],
        },
        {
          label: '出院一年后',
          List: [],
        },
        {
          label: '出院两年后',
          List: [],
        },
      ]
      let arr = []
      let dayMap = [1, 7, 30]
      this.mainList.forEach((element) => {
        let obj = { ...element }
        if (element.flup_period == 2 || element.flup_period == 1) {
          // arr.push({...obj})
          if (element.flup_period == 2) {
            obj.flup_number =
              (365 * 2 -
                element.intervention_day * dayMap[element.execute_unit]) /
              element.flup_interval
          }
          for (let i = 0; i < obj.flup_number; i++) {
            obj.followupRoute = element
            obj.intervention_day =
              element.intervention_day * dayMap[element.execute_unit] +
              element.flup_interval * i
            arr.push({ ...obj })
          }
        } else {
          obj.followupRoute = element
          obj.intervention_day =
            element.intervention_day * dayMap[element.execute_unit]
          arr.push({ ...obj })
        }
      })
      returnArr[0].List = arr.filter((element) => {
        return element.intervention_benchmark.includes('入院')
      })
      returnArr[1].List = arr.filter((element) => {
        if (element.intervention_benchmark.includes('出院')) {
          if (
            element.intervention_benchmark === '出院后' &&
            element.intervention_day > 180
          ) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      })
      returnArr[2].List = arr.filter((element) => {
        return (
          element.intervention_benchmark == '出院后' &&
          element.intervention_day > 180 &&
          element.intervention_day <= 365
        )
      })
      returnArr[3].List = arr.filter((element) => {
        return (
          element.intervention_benchmark == '出院后' &&
          element.intervention_day > 365 &&
          element.intervention_day <= 730
        )
      })
      returnArr[4].List = arr.filter((element) => {
        return (
          element.intervention_benchmark == '出院后' &&
          element.intervention_day > 730
        )
      })
      returnArr.forEach((element) => {
        element.List.sort((a, b) => {
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
            a.intervention_day -
            (map[b.intervention_benchmark] * 1000 + b.intervention_day)
          )
        })
      })
      return returnArr
    },
  },
  created() {
    // let arr = []
    // let dayMap = [1, 7, 30]
    // this.mainList.forEach(element => {
    //   let obj = {...element}
    //   if(element.flup_period == 2 || element.flup_period == 1) {
    //     // arr.push({...obj})
    //     for(let i=0;i<element.flup_number;i++) {
    //       obj.followupRoute = element
    //       obj.intervention_day = element.intervention_day * dayMap[element.execute_unit] + element.flup_interval*i
    //       arr.push({...obj})
    //     }
    //   } else {
    //     obj.followupRoute = element
    //     obj.intervention_day = element.intervention_day * dayMap[element.execute_unit]
    //     arr.push({...obj})
    //   }
    // })
    // this.group[0].List = arr.filter(element => {return element.intervention_benchmark.includes('入院')})
    // this.group[1].List = arr.filter(element => {
    //   if(element.intervention_benchmark.includes('出院')) {
    //     if(element.intervention_benchmark === '出院后' && element.intervention_day > 180) {
    //       return false
    //     } else {
    //       return true
    //     }
    //   } else {
    //     return false
    //   }
    // })
    // this.group[2].List = arr.filter(element => {return element.intervention_benchmark == '出院后' && element.intervention_day > 180 && element.intervention_day < 360})
    // this.group[3].List = arr.filter(element => {return element.intervention_benchmark == '出院后' && element.intervention_day > 360 && element.intervention_day < 720})
    // this.group[4].List = arr.filter(element => {return element.intervention_benchmark == '出院后' && element.intervention_day > 720})
    // this.group.forEach(element => {
    //   element.List.sort((a, b) => {
    //     let map = {
    //       '入院前': 1,
    //       '入院后': 2,
    //       '手术前': 3,
    //       '手术后': 4,
    //       '出院前': 5,
    //       '出院后': 6,
    //     }
    //     let mapDay = {
    //       0: 1,
    //       1: 7,
    //       2: 30
    //     }
    //     return (map[a.intervention_benchmark] * 1000 + a.intervention_day) - (map[b.intervention_benchmark] * 1000 + b
    //       .intervention_day)
    //   })
    // })
    console.log(this.group)
    this.activeNames = this.group.find((element) => {
      return element.List.length > 0
    }).label
    let timeIndex = this.group.findIndex((element) => {
      return element.List.length > 0
    })
    this.activeIndex = `${timeIndex}-0`
    // arr.sort((a, b) => {
    //   let map = {
    //     '入院前': 1,
    //     '入院后': 2,
    //     '手术前': 3,
    //     '手术后': 4,
    //     '出院前': 5,
    //     '出院后': 6,
    //   }
    //   let mapDay = {
    //     0: 1,
    //     1: 7,
    //     2: 30
    //   }
    //   return (map[a.intervention_benchmark] * 1000 + a.intervention_day) - (map[b.intervention_benchmark] * 1000 + b
    //     .intervention_day)
    // })
    // console.log(arr)
  },
  mounted() {
    window.addEventListener('message', (e) => {
      console.log(e)
      if (e.data.height && this.$refs.iframe) {
        this.$refs.iframe.style.height = e.data.height + 86 + 'px'
        this.isloading = false
      }
    })
    if (this.mainList.length > 0) {
      this.changeMenuItem(this.activeIndex)
    }
  },
  methods: {
    formatExeTime(item) {
      //  let map = ['天', '周', '个月']
      if (item.intervention_day === 0) {
        return item.intervention_benchmark + '当天'
      }
      return item.intervention_benchmark + item.intervention_day + '天'
    },
    formatCheckType(row) {
      return row.split('|')[0]
    },
    formatCheckPart(row) {
      return row.split('|')[2]
    },
    formatCheckItem(row) {
      return row.split('|')[4]
    },
    formatInspectionType(row) {
      return row.split('|')[0]
    },
    formatInspectionName(row) {
      return row.split('|')[2]
    },
    changeMenuItem(v) {
      let i = v.split('-')[0]
      let j = v.split('-')[1]
      if (this.currentItem == this.group[parseInt(i)].List[parseInt(j)]) {
        return
      }
      this.activeIndex = v
      this.url = null
      this.currentItem = this.group[parseInt(i)].List[j]
      if (
        this.currentItem.flup_type == '定期检查' ||
        this.currentItem.flup_type == '定期检验'
      ) {
        this.checkList = this.currentItem.flup_content.split(',')
      }
      if (['调查问卷', '健康宣教'].includes(this.currentItem.flup_type)) {
        this.templateQuery = {
          serial_no: this.currentItem.flup_content_id,
        }
        console.log(1)
      }
      if (this.currentItem.flup_type == '专科随访') {
        this.url =
          this.$baseURL.FollowUp +
          '/FlupCenter/PhoneFlupTemplate?flup_content_id=' +
          this.currentItem.flup_content_id
      }
      // if(['调查问卷','健康宣教'].includes(this.currentItem.flup_type)) {
      //   this.isloading = true
      //   this.$nextTick(() => {
      //     this.url = this.$baseURL.Questionnaire + '/MyQuestionnaire/GetQuestionnaireNew?' + this.$qs.stringify({
      //       token: this.$cookie.get('token'),
      //       serial_no: this.currentItem.flup_content_id,
      //       hospital_id: this.$global.hospital_id
      //     })
      //   })
      // }
    },
    getTime(item) {
      if (item.intervention_day != 0) {
        return `${item.intervention_benchmark}${item.intervention_day}天`
      } else {
        return `${item.intervention_benchmark}当天`
      }
    },
  },
  watch: {
    // mainList () {
    //   if(this.mainList.length > 0) {
    //     this.activeIndex = '0'
    //     this.currentItem = this.mainList[parseInt(this.activeIndex)]
    //     this.url = this.$baseURL.Questionnaire + '/MyQuestionnaire/GetQuestionnaireNew?' + this.$qs.stringify({
    //       token: this.$cookie.get('token'),
    //       serial_no: this.currentItem.flup_content_id,
    //       hospital_id: this.$global.hospital_id
    //     })
    //   }
    // }
    group() {
      this.activeNames = this.group.find((element) => {
        return element.List.length > 0
      }).label
      let timeIndex = this.group.findIndex((element) => {
        return element.List.length > 0
      })
      this.activeIndex = `${timeIndex}-0`
      this.changeMenuItem(this.activeIndex)
    },
  },
}
</script>

<style lang="scss">
.sidebar-left {
  .el-collapse-item + .el-collapse-item {
    margin-top: 10px;
  }
  .el-collapse-item__wrap,
  .el-collapse-item__header {
    border: 0;
  }
  .el-collapse-item__header {
    padding-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #425b77;
    height: 40px;
    line-height: 40px;
    i {
      line-height: 40px;
    }
  }
  .el-collapse-item {
    border: 1px solid #e6e6e6;
    box-shadow: 0px 0px 3px -1px rgba(0, 0, 0, 0.18);
  }
  .el-collapse-item__content {
    padding: 0 !important;
  }
  .el-collapse {
    border: 0;
  }
  .el-collapse-item:last-child {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss" scoped>
.sidebar-left {
  position: fixed;
  bottom: 86px;
  top: 20px;
  width: 311px;
  min-width: 311px;
  display: flex;
  flex-direction: column;
  .el-menu {
    position: static;
    .el-menu-item {
      position: static;
      padding: 0 0 0 14px !important;
    }
  }
}
.item-mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  .line {
    text-align: center;
    width: 4px;
    padding-right: 1px;
    height: 100%;
    background-color: rgba(85, 103, 122, 0.3);
  }
  .dot {
    width: 10px;
    height: 10px;
    border: 1px solid #769ac1;
    border-radius: 20px;
    background-color: #769ac1;
    opacity: 0.5;
  }
}
.item-text {
  // margin-top: 10px;
  // margin-left:10px;
  // margin-bottom:60px;
  padding: 20px 0;
  .item-time {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .item-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.description-width {
  width: 300px;
}
.circle-time {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: #539cdb;
  border: 4px solid #e2f0ff;
}
.circle-item {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  // background-color: #539CDB;
  border: 1px solid #539cdb;
}
</style>


