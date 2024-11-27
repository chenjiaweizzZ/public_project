// 患者随访计划
<template>
  <div class="medicalcarebox13">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="patientName + ' ' + age+' 岁 '  + sex +' '+ phone"
    />
    <van-dropdown-menu>
      <van-dropdown-item title="筛选计划" ref="item">
        <van-checkbox v-model="state" shape="square">已完成计划</van-checkbox>
        <van-checkbox v-model="complete" shape="square">待执行计划</van-checkbox>
        <van-button block type="info" @click="onConfirm">确认</van-button>
      </van-dropdown-item>
      <van-dropdown-item title="随访类型" ref="itemx1">
        <van-checkbox-group
          v-for="(itemx, index) in FollowTypelist"
          :key="index"
          v-model="flupType"
        >
          <van-checkbox :name="itemx.name" shape="square">{{itemx.name}}</van-checkbox>
        </van-checkbox-group>
        <van-button block type="info" @click="onConfirmx">确认</van-button>
      </van-dropdown-item>
    </van-dropdown-menu>
    <div v-for="(item, index) in list" :key="index" class="followUpList">
      <h3>
        {{item.planName}}
        <span>{{item.fuWay==0?"全院":item.fuWay==1?'专科':'慢病'}}随访</span>
        <span style="font-size: 12px" v-if="item.isThis==0">({{item.sourceHospitalName}})</span>
      </h3>
      <div v-for="(itemx, index) in item.flupPath" :key="index" class="contentList">
        <div class="content" @click="allocation(itemx)">
          <p style=" width:75%;">{{itemx.flupStartTime}}&emsp;{{itemx.flupType}}</p>
          <p style="display: flex;align-items: center;">
            <span>{{itemx.status}}</span>
            <van-icon
              v-show="itemx.flupType != '专科随访'&&itemx.flupType != '慢病评估报告'&&itemx.flupType != '调查问卷'&&itemx.flupType != '健康宣教'"
              name="arrow"
              color="#999"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: true,
      complete: true,
      patientName: this.$route.query.patientName,
      age: this.$route.query.age,
      sex: this.$route.query.sex,
      phone: this.$route.query.phone,
      userId: this.$route.query.userId,
      flupName: this.$route.query.flupName,
      flupId: this.$route.query.flupId,
      flupType: [],
      value1: 0,
      list: [],
      FollowTypelist: [],
    }
  },
  watch: {},
  mounted() {
    this.$apis.queryAllFollowType().then((res) => {
      this.FollowTypelist = res.retData
    })
    this.getlist()
  },
  methods: {
    allocation(itemx) {
      if (itemx.flupType == '专科随访') {
        this.$toast('专科随访请在PC端查看')
      } else if (itemx.flupType == '慢病评估报告') {
        this.$toast('慢病评估报告请在待审核列表或PC端查看')
      } else if (itemx.flupType == '调查问卷') {
        this.$toast('调查问卷请在PC端查看')
      } else if (itemx.flupType == '健康宣教') {
        this.$toast('健康宣教请在PC端查看')
      }
      //  else if (itemx.flupType == '调查问卷' || itemx.flupType == '健康宣教') {
      //   this.$router.push({
      //     path:
      //       'Doctor-questionnaire?serialNo=' +
      //       itemx.serialNo +
      //       '&detailSerialNo=' +
      //       itemx.detailSerialNo,
      //   })
      // }
      else if (
        itemx.flupType == '定期检验' ||
        itemx.flupType == '定期检查' ||
        itemx.flupType == '消息提醒' ||
        itemx.flupType == '定期复诊'
      ) {
        this.$router.push({
          path:
            'Doctor-CheckTheInspection?serialNo=' +
            itemx.serialNo +
            '&flupType=' +
            itemx.flupType,
        })
      }
    },
    getlist() {
      this.$apis
        .getFollowUpPlanByPatient({
          userId: this.$route.query.userId,
          flupType: this.flupType.join(','),
          state: this.state ? '1' : '0',
          complete: this.complete ? '1' : '0',
        })
        .then((res) => {
          this.list = res.retData
        })
    },
    onConfirm() {
      this.$refs.item.toggle()
      this.getlist()
    },
    onConfirmx() {
      this.$refs.itemx1.toggle()
      this.getlist()
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox13 {
  font-weight: 500;
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  .van-dropdown-menu {
    .van-checkbox {
      padding: 10px 3.7%;
    }
  }
  .van-dropdown-menu__bar {
    background: #1c97fc;
    .van-dropdown-menu__title {
      color: #fff;
    }
  }
  .followUpList {
    border-bottom: 10px solid #f2f2f2;
    h3 {
      margin-block-end: 0px;
      padding-left: 3.7%;
      padding-bottom: 10px;
      font-size: 17px;
      color: #111111;
      letter-spacing: 0.24px;
      border-bottom: 1px solid #e2e2e2;
      span {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.2px;
      }
    }
    .contentList {
      padding-left: 3.7%;
      .content {
        height: 46px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e2e2e2;
        p {
          span {
            margin-right: 10px;
          }
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
        }
      }
    }
  }
}
</style>


