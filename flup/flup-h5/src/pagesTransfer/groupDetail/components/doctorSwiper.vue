<template>
  <div class="doctorSwiper">
    <!-- <van-swipe indicator-color="white" :loop="false">
      <van-swipe-item v-for="(item,index) in teamList" :key="index">
        <div class="doctorSwiper-content">
          <div class="doctorSwiper-content-card" v-for="(iten,indez) in item" :key="indez">
            <img :src="iten.url" class="head">
            <div class="name">{{ iten.userName }}</div>
            <div class="t1tle">{{ iten.userTitle }}</div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe> -->
    <div class="doctorSwiper-container" v-if="teamList.length">
      <div class="doc" v-for="(iten,indez) in teamList" :key="indez">
        <img :src="iten.url" class="head">
        <div class="name">{{ iten.userName }}</div>
        <div class="t1tle">{{ iten.userTitle }}</div>
      </div>
    </div>
    <div v-else class="doctorSwiper-nodata">暂无团队成员</div>
  </div>
</template>

<script>
export default {
  props: {
    teamList: Array,
  },
};
</script>

<style scoped lang="scss">
.doctorSwiper {
  margin: 0 14px;
  &-container {
    height: 109px;
    background: #fff;
    display: flex;
    overflow: scroll;
    .doc {
      width: calc(100% / 4);
      min-width: calc(100% / 4);
      display: flex;
      flex-direction: column;
      align-items: center;
      .head {
        width: 40px;
        height: 40px;
        margin-top: 12px;
        margin-bottom: 5px;
        border-radius: 50%;
      }
      .name {
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.18px;
        color: #0079fd;
        margin-bottom: 5px;
      }
      .t1tle {
        font-size: 12px;
        font-weight: normal;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.18px;
        color: #666666;
      }
    }
  }
  &-nodata {
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    color: #666;
    text-align: center;
  }
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    &-card {
      width: calc(100% / 4);
      display: flex;
      flex-direction: column;
      align-items: center;
      .head {
        width: 40px;
        height: 40px;
        margin-top: 12px;
        margin-bottom: 5px;
        border-radius: 50%;
      }
      .name {
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.18px;
        color: #0079fd;
        margin-bottom: 5px;
      }
      .t1tle {
        font-size: 12px;
        font-weight: normal;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.18px;
        color: #666666;
      }
    }
  }
}
</style>

<style lang="scss">
.doctorSwiper {
  .van-swipe {
    border-radius: 8px;
  }
  .van-swipe-item {
    height: 218px;
    background: #ffffff;
  }
}
</style>