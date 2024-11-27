<template>
  <section ref="personalFiles" class="personalFiles height100pct flex-column bgcolor-f2f2f2">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      个人档案
    </div>-->
    <van-cell-group class="flex1 personalFilesTop">
      <van-field v-model="user.patientName" required label="姓名" :disabled="true" readonly />
      <van-field v-model="user.age" required label="年龄" :disabled="true" readonly />
      <van-field v-model="user.sex" label="性别" :disabled="true" readonly />
      <van-field
        v-model="user.phone"
        required
        label="手机号"
        type="tel"
        placeholder="请输入手机号"
        :error-message="phoneErrorMsg"
        @blur="verifyPhoneNumber(user.phone)"
      />
      <van-field v-model="user.idNo" required label="身份证" :disabled="true" readonly />
      <van-field
        v-model="user.consultationCard"
        label="就诊卡号"
        placeholder="请输入就诊卡号"
        maxlength="18"
        show-word-limit
        type="digit"
      />
      <van-field v-model="user.dateOfBirth" required label="出生日期" :disabled="true" readonly />
      <!-- <van-field v-model="user.height" required label="身高(cm)" placeholder="请输入身高(cm)" :error-message="idCardErrorMsg" type="number" maxlength="5" show-word-limit />
      <van-field v-model="user.weight" required label="体重(kg)" placeholder="请输入体重(kg)" :error-message="idCardErrorMsg" type="number" maxlength="5" show-word-limit />-->
      <van-field v-model="user.clan" label="民族" maxlength="10" show-word-limit />
      <van-field
        readonly
        clickable
        label="居住地"
        v-model="user.homeAddr"
        placeholder="选择居住地"
        @click="showPicker('homeAddr')"
      />
      <!-- <van-cell class="group" title="抽烟">
        <template slot="default">
          <van-radio-group v-model="user.smokeHistory">
            <van-radio class="width50pct" name="是" label="是">是</van-radio>
            <van-radio class="width50pct" name="否" label="否">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>-->
      <van-cell class="group" title="饮酒">
        <template slot="default">
          <van-radio-group v-model="user.drinkHistory">
            <van-radio class="width33pct" name="经常" label="经常">经常</van-radio>
            <van-radio class="width33pct" name="偶然" label="偶然">偶然</van-radio>
            <van-radio class="width33pct" name="从不" label="从不">从不</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-field
        readonly
        clickable
        label="文化程度"
        v-model="user.educationLevel"
        placeholder="选择文化程度"
        @click="showPicker('educationLevel')"
      />
      <van-field
        readonly
        clickable
        label="工作情况"
        v-model="user.nameOfEmployer"
        placeholder="选择工作情况"
        @click="showPicker('nameOfEmployer')"
      />
      <van-field
        v-model="user.pastHistory"
        placeholder="请输入"
        label="既往史"
        maxlength="50"
        show-word-limit
      />
      <van-field
        v-model="user.marriageChildbirthHistory"
        placeholder="请输入"
        label="婚育史"
        maxlength="50"
        show-word-limit
      />
      <van-field
        v-model="user.allergyHistory"
        placeholder="请输入"
        label="过敏史"
        maxlength="50"
        show-word-limit
      />
      <van-field
        v-model="user.familyHistory"
        placeholder="请输入"
        label="家族史"
        maxlength="50"
        show-word-limit
      />
      <!-- <van-cell title="既往史" is-link value="请输入" />
      <van-cell title="婚育史" is-link value="请输入" />
      <van-cell title="过敏史" is-link value="请输入" />
      <van-cell title="家族史" is-link value="请输入" />-->
      <!-- <van-cell
        v-for="(item, index) in healthRecordConfig"
        :key="index"
        :title="item.content"
        is-link
        :value="item.healthDetail"
        @click="goToPast(item.code, item.content)"
        reverse-color
      />-->
      <van-popup v-model="show" position="bottom">
        <div v-show="type == 'homeAddr'">
          <van-area :area-list="areaList" @cancel="show = false" @confirm="onConfirm" />
        </div>
        <div v-show="type == 'educationLevel' || type == 'nameOfEmployer'">
          <van-picker show-toolbar :columns="smList" @cancel="show = false" @confirm="onConfirm" />
        </div>
      </van-popup>
    </van-cell-group>
    <van-row class="marginX20 margin20X" type="flex" justify="center">
      <van-button :disabled="disableButton" @click="submit" type="info" size="large">提交</van-button>
    </van-row>
  </section>
</template>

<script>
import areaList from '../utils/area'
export default {
  data() {
    return {
      areaList: areaList,
      user: {
        dateOfBirth: '',
        idNo: '',
        patientName: '',
        sex: '',
        phone: '',
        consultationCard: '',
        hospitalId: '',
        openId: '',
        age: '',
        pastHistory: '',
        marriageChildbirthHistory: '',
        allergyHistory: '',
        familyHistory: '',
        smokeHistory: '',
        drinkHistory: '',
        weight: '',
        height: '',
        homeAddr: '',
      },
      smList: [],
      educationList: ['本科/大专及以上', '高中/中专', '初中', '小学', '不识字'],
      workList: ['在职', '学生', '退休', '自由职业', '失业'],
      type: '',
      idCardErrorMsg: '',
      phoneErrorMsg: '',
      patientNameErrorMsg: '',
      hospitalErrorMsg: '',
      hideConsultationCard: process.env.RUN_MODE == 'wlmq',
      value: '',
      show: false,
      hospitalList: [],
    }
  },
  computed: {
    disableButton() {
      return (
        !this.user.patientName ||
        !this.user.age ||
        !this.user.phone ||
        !this.user.idNo ||
        !this.user.dateOfBirth
        //  ||
        // !this.user.height ||
        // !this.user.weight
      )
    },
  },
  created() {
    this.getInfo(JSON.parse(sessionStorage.getItem('userInfo')).openId)
  },
  methods: {
    getInfo(id) {
      this.$apis.getPatientInfo({ openId: id }).then((res) => {
        if (res.retData) {
          this.user = res.retData
          if (this.user.homeAddr.length < 3) {
            this.user.homeAddr = ''
          }
          let info = this.$utils.getInfoByIdCard(this.user.idNo)
          if (info) {
            this.user.age = info.age
          }
        }
      })
    },
    onConfirm(value) {
      console.log(value)
      if (this.type == 'homeAddr') {
        this.user.homeAddr = ''
        for (let index = 0; index < value.length; index++) {
          if (value[index + 1]) {
            this.user.homeAddr = this.user.homeAddr + value[index].name + ','
          } else if (value[index]) {
            this.user.homeAddr = this.user.homeAddr + value[index].name
          }
        }
      } else if (this.type == 'educationLevel') {
        this.user.educationLevel = value
      } else {
        this.user.nameOfEmployer = value
      }
      this.show = false
    },
    verifyPhoneNumber(v) {
      if (v) {
        if (this.$utils.checkPhone(v)) {
          this.phoneErrorMsg = ''
          return true
        } else {
          this.phoneErrorMsg = '手机信息有误'
          return false
        }
      } else {
        this.phoneErrorMsg = '请输入手机号'
        return false
      }
    },
    async submit() {
      if (this.verifyPhoneNumber(this.user.phone)) {
        let user = JSON.parse(sessionStorage.getItem('userInfo'))
        let hospitalId = user.hospitalId || this.$route.query.hospitalId
        let hospitalName = user.hospitalName || this.$route.query.hospitalName
        this.user.openId =
          this.$route.query.openId ||
          JSON.parse(sessionStorage.getItem('userInfo')).openId
        this.user.hospitalId =
          this.user.hospitalId ||
          JSON.parse(sessionStorage.getItem('userInfo')).hospitalId
        await this.$apis.savePatientInfo(this.user)
        await this.$apis
          .getPatientInfo({ openId: this.user.openId })
          .then((res) => {
            let userInfo = Object.assign(
              {},
              JSON.parse(sessionStorage.getItem('userInfo')),
              { ...res.retData, age: this.user.age, hospitalId, hospitalName }
            )
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
            this.$router.replace(
              this.$route.query.redirect ||
                '/healthFileS?openId=' +
                  (this.$route.query.openId || this.openId)
            )
          })
      }
    },
    showPicker(type) {
      this.type = type
      if (this.type == 'educationLevel') {
        this.smList = this.educationList
      } else {
        this.smList = this.workList
      }
      this.show = true
    },
  },
}
</script>

<style lang="scss">
.personalFiles {
  .van-radio-group {
    display: flex;
  }
}
</style>
<style lang="scss" scoped>
.personalFiles {
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
  .personalFilesTop {
    // margin-top: 44px;
  }
}
</style>
