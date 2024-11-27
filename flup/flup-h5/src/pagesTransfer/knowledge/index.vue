<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="getList"
    class="knowledge"
  >
    <ul class="knowledge-menu">
      <li
        class="item"
        v-for="item in menuList"
        :key="item.id"
        @click="jump(item.path)"
      >
        <div class="item__imgWrap">
          <img class="item__img" :src="item.imgUrl" alt="" />
          <img class="item__bgImg" :src="item.bgImg" alt="">
        </div>
        <span class="item__text">{{ item.text }}</span>
      </li>
    </ul>
    <van-tabs
      v-model="tabActive"
      sticky
      color="#00982D"
      title-active-color="#00982D"
      title-inactive-color="#111"
      :ellipsis="false"
      @change="changeTab"
    >
      <van-tab
        class="knowledge-tabs"
        v-for="item in tabList"
        :title="item.dict_name"
        :key="item.dict_code"
      >
        <div class="item" v-for="item in list" :key="item.serialNo" @click="goKnowledgeDetail(item.serialNo)">
          <div class="item-contain">
            <img
              class="item-contain__img"
              :src="item.iconUrl"
              alt=""
              v-if="item.iconUrl"
            />
            <img
              class="item-contain__img"
              src="@/assets/images/bg.png"
              alt=""
              v-else
            />
            <div class="item-contain__info">
              <div class="title">{{ item.knowledgeName  }}</div>
              <div class="summary">{{ item.knowledgeDiscription }}</div>
              <div class="time">
                <span>{{ item.updateTime }}</span>
                <div class="time-num">
                  <img
                    class="time-num__img"
                    src="@/assets/images/icon/yes.png"
                    alt=""
                  />
                  <span class="time-num__text">{{ item.clickNum }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </van-list>
</template>
<script>
import ailment from "@/assets/images/ailment.png";
import medicine from "@/assets/images/medicine2.png";
import firstaid from "@/assets/images/firstaid.png";
import analysis from "@/assets/images/analysis.png";
import vaccine from "@/assets/images/vaccine3.png";

import ailment2 from "@/assets/images/ailment2.png";
import medicine2 from "@/assets/images/medicine3.png";
import firstaid2 from "@/assets/images/firstaid2.png";
import analysis2 from "@/assets/images/analysis2.png";
import vaccine2 from "@/assets/images/vaccine2.png";
export default {
  data() {
    return {
      menuList: [
        {
          id: 0,
          path: "https://zy9200.zwjk.com/#/diseasebank?name=%E7%96%BE%E7%97%85%E5%BA%93",
          text: "疾病库",
          imgUrl: ailment,
          bgImg:ailment2
        },
        {
          id: 1,
          path: "https://zy9200.zwjk.com/#/medicinebank?name=%E8%8D%AF%E7%89%A9%E5%BA%93",
          text: "药物库",
          imgUrl: medicine,
          bgImg:medicine2
        },
        {
          id: 2,
          path: "https://zy9200.zwjk.com/#/medicinebank?name=%E6%80%A5%E6%95%91%E5%BA%93",
          text: "急救库",
          imgUrl: firstaid,
          bgImg:firstaid2
        },
        {
          id: 3,
          path: "https://zy9200.zwjk.com/#/reportread",
          text: "化验单解读",
          imgUrl: analysis,
          bgImg:analysis2
        },
        {
          id: 4,
          path: "https://zy9200.zwjk.com/#/vaccineRecent",
          text: "疫苗接种",
          imgUrl: vaccine,
          bgImg:vaccine2
        },
      ],
      tabActive: 0,
      tabList: [],
      loading: true,
      finished: false,
      list: [],
      pageNo:1,
      pageSize:20,
    };
  },
  mounted(){
    this.getDictItems()
  },
  methods: {
    //获取tab
    async getDictItems(){
      let { retData } = await this.$apis.getDictItems({ 
        parentId:'202105141723161928q6'
      });
      let list = retData;
      list.unshift({
        dict_code:0,
        dict_name:'全部',
      })
      this.tabList = list;
      this.loading = false;
    },
    async changeTab(){
      this.pageNo = 1;
      this.list = [];
      await this.getList();
      
    },
    //获取列表
    async getList(){
      let info = this.tabList[this.tabActive];
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        deptId: "ALL",
        sortKey:'click_num',
        sorted: "desc"
      }
      if(info.dict_code == 0){
        params.searchValue = '';
        params.searchKey = 'knowledgeTag';
      }else{
        params.searchValue = info.dict_code;
        params.searchKey = 'knowledgeTag';
      }
      let { retData } = await this.$apis.getKnowledgeRecord(params);
      this.list.push(...retData.list)
      this.pageNo ++;
      this.loading = false;
      if(retData.list.length != this.pageSize){
          this.finished = true;
      }else{
          this.finished = false;
      }
    },
    jump(path) {
      if (!path) {
        this.$toast("正在开发中");
        return false;
      }
      window.location.href = path;
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    //详情
    goKnowledgeDetail(serialNo){
        this.$router.push({
            path:'/knowledgeDetail',
            query:{
              serialNo
            }
        })
    }
  },
};
</script>
<style lang="scss">
.knowledge {
  .van-sticky {
    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      height: 1px;
      width: 100%;
      background: rgba(255, 255, 255, 0.01);
    }
  }
  .van-tab,
  .van-tab--active {
    font-weight: 600;
  }
}
</style>
<style lang="scss" scoped>
.knowledge {
  // padding-top: 9px;
  // margin-bottom: 75px;
  // height: calc(100vh - 69px);
  height:100vh;
  overflow-y: auto;
  &-menu {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 12px;
    background: #fff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; 
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      &:active{
        .item__bgImg{
          opacity: 1;
        }
      }
      &__imgWrap{
        width: 50px;
        height: 50px;
        position: relative;
      }
      &__img {
        width: 50px;
        height: 50px;
      }
      &__bgImg{
        position: absolute;
        left: 0;
        top:0;
        z-index: 1;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      &__text {
        font-size: 13px;
        font-weight: 600;
        line-height: 14px;
        color: #666666;
        margin-top: 6px;
      }
    }
  }
  &-tabs {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; 
    .item {
      padding: 14px 0px 16px 14px;
      background: #ffffff;
      &:active{
        background-color: #eee;
      }
      &-contain {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: -14px;
          height: 1px;
          width: 100%;
          z-index: 1;
          background: rgba(255, 255, 255, 0.01);
          box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
        }
        display: flex;
        align-items: center;
        position: relative;
        &__img {
          width: 84px;
          height: 60px;
          object-fit: cover;
          margin-right: 14px;
        }
        &__info {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 14px;
          .title {
            font-size: 16px;
            font-weight: normal;
            line-height: 19px;
            color: #111111;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .summary {
            margin-top: 7px;
            font-size: 14px;
            font-weight: normal;
            color: #999999;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .time {
            font-size: 12px;
            font-weight: normal;
            color: #999999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            &-num {
              &__img {
                width: 14px;
                height: 10px;
              }
              &__text {
                margin-left: 2px;
              }
            }
          }
        }
      }
      &:first-child > .item-contain {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0px;
          height: 0px;
          width: 100%;
          z-index: 0;
          background: none;
          box-shadow: none;
        }
      }
    }
  }
}
</style>