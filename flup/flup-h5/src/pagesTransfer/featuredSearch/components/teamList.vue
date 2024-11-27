<template>
  <div class="teamList">
    <div v-for="(item,index) in teamList" class="teamList-container" :key="index" @click="toDetail(item.serialNo)">
      <div class="teamList-container-avator">
        <img :src="item.introduceUrl ? item.introduceUrl : defaultIntroduce">
      </div>
      <div class="teamList-container-introduce">
        <div class="teamList-container-introduce-name">{{ item.groupName }}</div>
        <div class="teamList-container-introduce-desc">{{ item.groupIntroduce }}</div>
      </div>
      <div class="teamList-container-arrow">
        <img src="@/assets/images/home/you.png">
      </div>
    </div>
  </div>
</template> 

<script>
import { mapMutations } from "vuex";
import health from "@/assets/images/home/introduce.png";
export default {
  props: {
    teamList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    ...mapMutations("tabs", ["setFeaturedServiceTab"]),
    // toDetail(doctorId) {
    //   this.setFeaturedServiceTab("2");
    //   this.$router.push({
    //     path: "/groupDetail",
    //     query: { doctorId },
    //   });
    // },
    toDetail(groupId) {
      this.setFeaturedServiceTab("2");
      this.$router.push({
        path: "/teamDetail",
        query: { groupId },
      });
    },
  },
  computed: {
    defaultIntroduce() {
      return health;
    },
  },
};
</script>

<style lang="scss" scoped>
.teamList {
  width: 100%;
  &-container {
    width: 100%;
    display: flex;
    align-items: center;
    height: 85px;
    border-bottom: 1px solid rgba(216, 216, 216, 0.3);
    padding: 0 14px;
    background: #fff;
    &-avator {
      height: 56px;
      width: 56px;
      min-width: 56px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-introduce {
      flex: 1;
      padding-left: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &-name {
        font-size: 15px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-desc {
        font-size: 12px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #666666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &-arrow {
      width: 26px;
      height: 14px;
      min-width: 26px;
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>