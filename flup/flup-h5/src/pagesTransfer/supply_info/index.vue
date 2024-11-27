<template>
<section class="flex-column height100pct">
  <van-cell-group class="flex1">
    <van-field
      v-model="user.height"
      label="身高(cm)"
      type="number"
    />
    <van-field
      v-model="user.weight"
      label="体重(kg)"
      type="number"
    />
    <van-field
      v-model="user.clan"
      label="民族"
    />
    <van-field
      label="居住地"
      @click="showAreaList=true"
      v-model="user.birth_place"
      readonly
    />
    <van-cell class="group" title="抽烟">
      <template slot="default">
        <van-radio-group v-model="user.smoke">
          <van-radio class="width50pct" name="是">是</van-radio>
          <van-radio class="width50pct" name="否">否</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <van-cell class="group" title="文化程度">
      <template slot="default">
        <van-radio-group v-model="user.education_level" class="left90">
          <van-radio class="width100pct" name="本科/大专及以上">本科/大专及以上</van-radio>
          <van-radio class="width50pct" name="高中/中专">高中/中专</van-radio>
          <van-radio class="width50pct" name="初中">初中</van-radio>
          <van-radio class="width50pct" name="小学">小学</van-radio>
          <van-radio class="width50pct" name="不识字">不识字</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <van-cell class="group" title="工作情况">
      <template slot="default">
        <van-radio-group v-model="user.occupation_type" class="left90">
          <van-radio  class="width33pct" name="在职">在职</van-radio>
          <van-radio class="width33pct" name="学生">学生</van-radio>
          <van-radio class="width33pct" name="退休">退休</van-radio>
          <van-radio class="width50pct" name="自由职业">自由职业</van-radio>
          <van-radio class="width50pct" name="失业">失业</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
  </van-cell-group>
  <van-row class="marginX20 margin-bottom20">
    <van-button type="info" size="large" @click="submit" >补充个人信息</van-button>
  </van-row>
  <van-popup v-model="showAreaList" position="bottom">
    <van-area 
      :area-list="areaList"
      @cancel="showAreaList=false"
      @confirm="getAddress"
    />
  </van-popup>
</section>
</template>
<script>
  import {areaList} from "../../assets/js/city"
  export default {
    data(){
      return{
        user:{
          height: '',
          weight: '',
          clan: '',
          birth_place: '',
          smoke: '',
          education_level: '',
          occupation_type:''
        },
        areaList:areaList,
        showAreaList:false,
      }
    },
    created() {
      // this.user = JSON.parse(sessionStorage.getItem('user'))
      this.user = this.$route.params.user
    },
    methods:{
      getAddress(array){
        this.user.birth_place = array.map((element) => {
          return element.name
        }).join(',')
        this.showAreaList=false
      },
      async submit(){
        await this.$apis.addInfo(this.user)
        await this.$apis.getBindUserInfo({openId:  this.user.openId}).then((res) => {
          sessionStorage.setItem('userInfo', JSON.stringify(res))
          this.$router.push('/')
        })
      }
    },
  }
</script>
<style lang="scss">
  .group {
    .van-cell__title{
      flex:none;
      width: 90px;
      line-height: 54px;
      height: 54px;
      color: #999999;
    }
    .van-radio{
      height: 54px;
      line-height: 54px;
    }
    .van-radio-group {
      display: flex;
      flex-wrap: wrap
    }
  }
</style>
