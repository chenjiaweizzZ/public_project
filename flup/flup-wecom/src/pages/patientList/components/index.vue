<template>
  <div>
    <div class="refresh">
      <span>已关联患者</span><IconRefresh @refresh="refresh"></IconRefresh>
    </div>
    <div class="main">
      <div class="backage" v-if="isBind">
        <img src="../../../assets/img/noData.png" alt="" />
        <p>该用户未绑定微信</p>
        <el-button class="button" type="primary" @click="sendCpMsg"
          >推送绑定</el-button
        >
      </div>
      <div
        v-else
        class="item"
        v-for="(item, index) in bindList"
        :key="index"
        @click="addClick(item)"
      >
        <div class="img">
          <!-- <img
            v-if="item.picUrl"
            width="40"
            height="40"
            :src="item.picUrl"
            alt=""
          /> -->
          <img
            v-if="item.sex == '男'"
            src="@/assets/img/touxiang.png"
            width="40"
            height="40"
            alt
          />
          <img
            v-else
            src="@/assets/img/female.png"
            width="40"
            height="40"
            alt
          />
        </div>
        <div class="content">
          <!-- <div class="userinfo"> -->
          <span class="name">{{ item.patientName }}</span
          ><span class="gender">{{ item.sex }}</span>
          <!-- </div> -->

          <!-- <div class="disease-list">
            <span
              class="disease-item"
              v-for="(items, index) in item.curCrowdTypeList"
              :key="index"
              >{{ items.dict_name }}</span
            >
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const _http = inject("http");
const _apiUrl = inject("apiUrl");
const _storage = inject("storage");
const userId = _storage.getLocalStorage("userId");
let isBind = ref(false);
let bindList = ref([]);
let crowdTypeList = ref([]);
const addClick = (item) => {
  router.push({
    path: "/layout/patientList/patientInformation",
    query: {
      userId: item.userId,
    },
  });
};
// 刷新
const refresh = () => {
  GetListForCp();
};
// 获取企业微信聊天对象绑定就诊人列表
const GetListForCp = () => {
  _http
    .get(_apiUrl.GetListForCp, {
      params: {
        cpExternalUserId: userId,
        pageNo: 1,
        pageSize: 999,
      },
    })
    .then((res) => {
      if (res === null) {
        isBind.value = true;
      } else {
        isBind.value = false;
        bindList.value = res.list;
        bindList.value.forEach((item) => {
          item.curCrowdTypeList = crowdTypeList.value.filter((x) => {
            if (!item.crowdType) return false;
            return item.crowdType.includes(x.dict_code);
          });
        });
      }
    });
};
const GetDictItems = () => {
  _http
    .get(_apiUrl.GetDictItems, {
      params: {
        parentld: "20170915191220011928",
      },
    })
    .then((res) => {
      crowdTypeList.value = res;
    });
};
// 推送绑定
const sendCpMsg = () => {
  wx.invoke(
    "sendChatMessage",
    {
      msgtype: "news", //消息类型，必填
      enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
      news: {
        link: `https://premisd.zwjk.com/flup/web/h5/#/core?userId=${_storage.getLocalStorage(
          "userId"
        )}`, //H5消息页面url 必填
        title: "橄榄云", //H5消息标题
        desc: "请点击登入进行就诊人信息绑定", //H5消息摘要
        imgUrl:
          "https://premisd.zwjk.com/flup/api/file/image/202307100910320080ky", //H5消息封面图片URL
      },
    },
    function (res) {
      if (res.err_msg == "sendChatMessage:ok") {
        //发送成功
        console.log("发送成功");
      }
    }
  );
};
GetDictItems();
GetListForCp();
</script>
<style lang="scss" scoped>
.refresh {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  span {
    margin-right: 10px;
  }
}
.main {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px 10px;
  .item {
    cursor: pointer;
    margin-top: 10px;
    width: 100%;
    // height: 79px;
    border-radius: 4px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    .img {
      margin-right: 14px;
      img {
        border-radius: 50%;
      }
    }
    .content {
      flex: 1;
      .name {
        color: #111111;
        font-weight: 700;
        margin-right: 12px;
      }
      .gender {
        color: #666666;
      }
      // .userinfo {
      //   margin-bottom: 18px;
      //   font-size: 14px;

      // }
      .disease-list {
        display: flex;
        flex-wrap: wrap;
        .disease-item {
          padding: 2px 10px;
          background: #eef6ff;
          border-radius: 10px;
          font-size: 12px;
          color: #305680;
          margin-bottom: 2px;
        }
      }
    }
  }
  .backage {
    margin-top: 50px;
    width: 100%;
    text-align: center;
    p {
      margin-top: 14px;
      text-align: center;
    }
    .button {
      margin-top: 30px;
    }
  }
}
</style>
