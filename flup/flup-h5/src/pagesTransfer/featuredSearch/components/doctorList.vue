<template>
  <div class="docList">
    <div v-for="(item,index) in docList" :key="index" class="docList-container" @click="toDetail(item.doctorId)">
      <div class="docList-container-team">
        <img src="@/assets/images/Doctor/team.png" alt="">
        <span>{{ item.doctorName }}医生团队</span>
      </div>
      <div v-for="(iten,indez) in item.groupNameList" :key="indez" class="docList-container-group">
        <div class="group-name">{{ iten }}</div>
      </div>
      <span class="arrow-right">
        <van-icon name="arrow" color="#999999" size="20"/>
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    docList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    ...mapMutations("tabs",["setFeaturedServiceTab"]),
    toDetail(doctorId) {
      this.setFeaturedServiceTab("2")
        this.$router.push({
            path: '/groupDetail',
            query: { doctorId }
        })
    }
  }
};
</script>

<style scoped lang="scss">
.docList {
margin-bottom: 10px;
  &-container {
    position: relative;
    background: #fff;
    margin: 10px 12px 0;
    padding: 15px 12px 15px;
    border-radius: 10px;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    &-team {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      img {
        height: 20px;
        width: 20px;
        margin-right: 11px;
      }
      span {
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
      }
    }
    &-group {
      font-size: 16px;
      font-weight: normal;
      line-height: 19px;
      letter-spacing: 0.2px;
      color: #111111;
      margin-top: 11px;
      .group-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .arrow-right {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translate(0, -50%);
    }
  }
}
</style>
