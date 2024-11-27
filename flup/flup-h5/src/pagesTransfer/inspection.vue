<template>
  <section class="bg padding-top8 height100 flex-column">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      个人信息
    </div>-->
    <section class="baseInfo">
      <van-row class="font-size16 margin8X" type="flex" align="center" justify="space-between">
        <span class="color-666">姓名</span>
        <span class="color-111">{{ user.patient_name }}</span>
      </van-row>
      <van-row class="font-size16 margin8X" type="flex" align="center" justify="space-between">
        <span class="color-666">身份证号</span>
        <span class="color-111">{{ user.id_no }}</span>
      </van-row>
      <van-row class="font-size16 margin8X" type="flex" align="center" justify="space-between">
        <span class="color-666">手机号</span>
        <span class="color-111">{{ user.phone }}</span>
      </van-row>
    </section>
    <van-row class="flex1 padding-left8 padding-right8 scroll-auto" style="background-color:#fff">
      <div class="padding-top10 padding-left20" style="font-size:16px">检验列表</div>
      <van-cell
        v-for="(item, i) in checkList"
        :key="i"
        :title="getInspectionName(item)"
        :label="getInspectionType(item)"
      />
    </van-row>
    <van-row
      class="padding10X width100 paddingX50"
      type="flex"
      :justify="checkState == 20 ? 'space-between' : 'center'"
    >
      <template v-if="checkState == 20">
        <van-button class="width120px" type="default" @click="onSubmit(40)">拒绝检验</van-button>
        <van-button class="width120px" type="primary" @click="onSubmit(50)">确认检验</van-button>
      </template>
      <template v-else-if="checkState == 40">已拒绝</template>
      <template v-else-if="checkState == 50">已确认</template>
    </van-row>
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      checkList: [],
      checkState: 10,
    }
  },
  created() {
    this.$apis
      .getBindUserInfo({
        open_id: this.$route.query.openID,
      })
      .then((res) => {
        this.user = res
      })
    this.$apis
      .getCheckList({
        serial_no: this.$route.query.snid,
      })
      .then((res) => {
        this.checkState = res.auth_state
        this.checkList = res.flup_content.split(',')
      })
  },
  methods: {
    getInspectionName(item) {
      return item.split('|')[0]
    },
    getInspectionType(item) {
      return item.split('|')[2]
    },
    onSubmit(v) {
      this.$apis
        .verify({
          auth_state: v,
          serial_no: this.$route.query.snid,
          changetype: 'change',
        })
        .then(() => {
          let map = { 40: '拒绝成功', 50: '确认成功' }
          this.$widget.toast(map[v])
          this.checkState = v
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.baseInfo {
  margin: 0 8px 8px;
  padding: 8px;
  border-radius: 4px;
  background: white;
}
.bg {
  position: relative;
  &::before {
    content: '';
    display: table;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .baseInfo {
    position: relative;
    margin-top: 44px;
  }
}
</style>
