<template>
  <div class="flupTimeline">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <el-select v-model="value" placeholder="请选择" @change="setActivities">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.planName"
            :value="item.planNameId"
          ></el-option>
        </el-select>
      </div>
      <div class="butBox">
        <!-- <el-button type="primary">终止计划</el-button>
        <el-button type="primary">添加随访任务</el-button>-->
      </div>
    </div>
    <div class="main">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          placement="top"
          :timestamp="activity.flupStartTime"
        >
          <el-card>
            <div style="align-items: center;justify-content: space-between;" class="flex">
              <div>
                <div class="flex">
                  <h4>
                    {{activity.flupType}}
                    &ensp;
                    <el-tag>{{activity.status}}</el-tag>
                  </h4>
                </div>
                <p>{{activity.flupContent}}</p>
              </div>
              <el-button type="text" @click="goHealtharchives(activity)">详情</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      options: [],
      reverse: false,
      activities: [],
    }
  },
  created() {},
  mounted() {
    this.$apis
      .getFollowupPlanByPatientNew({
        userId: this.$route.query.userId,
        recordSerialNo: this.$route.query.recordSerialNo,
        state: 0,
        complete: 0,
      })
      .then((res) => {
        this.options = res.filter((element) => {
          if (element.executiveDeptId == this.$route.query.dischargeWardCode) {
            return element
          }
        })
        if (this.options.length != 0) {
          this.value = this.options[0].planNameId
          this.activities = this.options[0].flupPath
        }
      })
  },
  methods: {
    setActivities() {
      this.activities = this.options.filter((element) => {
        return this.value == element.planNameId
      })[0].flupPath
    },
    goHealtharchives(activity) {
      console.log(activity)
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }

      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${this.$route.query.userId}&name=${this.$route.query.name}&sex=${this.$route.query.sex}&age=${this.$route.query.age}&phone=${this.$route.query.phone}
             &recordSerialNo=${this.$route.query.recordSerialNo}
            &joinPlanPatientType=${this.$route.query.patientTypeCode}&flupPlanId=${this.$route.query.flupPlan}&anchorPoint=${activity.serialNo}&flupType=${activity.flupType}&token=${this.$route.query.token}`,
          title: '健康档案',
        }),
        '*'
      )
      // console.log(
      //   urlx +
      //     `/#/healtharchives?userId=${this.$route.query.userId}&name=${this.$route.query.name}&sex=${this.$route.query.sex}&age=${this.$route.query.age}&phone=${this.$route.query.phone}
      //        &recordSerialNo=${this.$route.query.recordSerialNo}
      //       &joinPlanPatientType=${this.$route.query.patientTypeCode}&flupPlanId=${this.$route.query.flupPlan}&anchorPoint=${activity.serialNo}&flupType=${activity.flupType}&token=${this.$route.query.token}`
      // )
    },
  },
}
</script>
<style lang="scss">
.flupTimeline {
  .main {
    padding: 20px;
  }
}
</style>