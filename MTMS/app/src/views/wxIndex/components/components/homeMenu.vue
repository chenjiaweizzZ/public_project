<template>
  <div class="menu">
    <div class="applicationGroup" v-if='appList.length> 0'>
      <div v-for="(item,index) in appList.slice(0, 12)" :key="index" class="applicationChild">
        <div class="applicationChild_item" @click="toPage(item)">
          <img :src="item.ico" alt class="img-responsive" />
          <span class="fsub">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="appNodata" v-else>—&nbsp;&nbsp;暂无功能&nbsp;&nbsp;—</div>
    <div class="moreView" v-if='appList.length> 0'>
      <span class="btnBox">
        <span class="viewTitle" @click="skipApp">查看更多</span>
        <span class="arrow-right"></span>
      </span>
    </div>
  </div>
</template>


<script>
import methods from "@/methods";
export default {
  name: "homemenu",
  data() {
    return {
    
    };
  },
  props: {
      appList: {
        type: Array,
        default: []
      },
    },
  methods: {
    ...methods,
    toPage(item) {
      localStorage.setItem("menuId", item.id);
      localStorage.setItem("oprateMenu", JSON.stringify(item.children));
      if (item.url == "/advancedapp/trainingRotation/graduationAppraisal") {
        this.ifAdPass(item);
      } else {
        console.log()
        if (item.url.indexOf("?") != -1) {
          location.href = item.url + "&token=" + localStorage.getItem("token");
        } else {
          location.href =  item.url + "?token=" + localStorage.getItem("token");
        }
      }
    },
    skipApp() {
      // location.href = "/pages/futuredoctorapp/todo.html?view=application";
      // this.$router.push({
      //   name: "wxMenu",
      // })
        this.$router.push({
        name: "wxMenu",
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.applicationGroup {
    overflow: hidden;
    padding: 14px 14px 0px 14px;
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
    .applicationChild {
      width: 25%;
      text-align: center;
      padding-bottom: 8px;
      .applicationChild_item {
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          display: block;
          max-width: 100%;
          width: 48px;
          height: 48px;
        }
        .fsub {
          font-size: 13px;
          color: #444444;
          letter-spacing: 0.19px;
          text-align: center;
          font-weight: 400;
          margin-top: 10px;
        }
      }
    }
  }
  .moreView {
    height: 34px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    margin-bottom: 10px;
    .btnBox {
      opacity: 0.8;
      border: 1px solid rgba(123, 149, 177, 1);
      height: 18px;
      width: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      .viewTitle {
        line-height: 18px;
        font-size: 12px;
        color: #7b95b1;
        font-weight: 400;
      }
      .arrow-right {
        height: 20px;
        width: 10px;
        display: inline-block;
        position: relative;
      }
      .arrow-right::after {
        content: "";
        height: 7px;
        width: 7px;
        top: 6px;
        border-width: 1px 1px 0 0;
        border-color: #7b95b1;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: absolute;
      }
    }
  }
  .appNodata {
    height: 102px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #868e97;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
  }
</style>