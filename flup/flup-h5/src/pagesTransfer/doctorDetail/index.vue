<template>
  <div class="doctorDetail">
    <div class="doctorDetail-introduce">
      <div class="doctorDetail-introduce-box">
        <div class="doctorDetail-introduce-l1ne">
          <div class="doctorDetail-introduce-l1ne-left">
            <div class="left-l1ne">
              <div class="name">{{ doctorInfo.doctorName }}</div>
              <div class="card" @click="viewCard()">
                <img :src="defaultDoCard">
                名片
              </div>
            </div>
            <div class="left-l2ne">
              {{ doctorInfo.title }} | {{ doctorInfo.deptName }}
            </div>
            <div class="left-l3ne">
              <img :src="defaultImageText">
              <div class="left-l3ne-text">图文咨询</div>
              <div class="left-l3ne-price">
                <div class="left-l3ne-unit">¥</div>
                <div class="left-l3ne-number">{{ packageList[0] ? packageList[0].floorPrice : "" | unit }}</div>
                <div class="left-l3ne-qi"></div>
              </div>
            </div>
          </div>
          <div class="doctorDetail-introduce-l1ne-right">
            <img :src="doctorInfo.url ? doctorInfo.url :defaultDoCard">
          </div>
        </div>
        <div class="doctorDetail-introduce-l2ne over2h" @click="viewDetail()" v-if="doctorInfo.excel">
          <div class="over2h-left"><img :src="defaultGoodat">{{ doctorInfo.excel }}</div>
          <div class="over2h-right"><van-icon name="arrow" color="#32AE57" /></div>
        </div>
        <div class="doctorDetail-introduce-l3ne over2h" @click="viewDetail()" v-if="doctorInfo.introduction">
          <div class="over2h-left"><img :src="defaultIntroduce">{{ doctorInfo.introduction }}</div>
          <div class="over2h-right"><van-icon name="arrow" color="#32AE57" /></div>
        </div>
        <div style="height: 15px;"></div>
      </div>
    </div>
    <div class="doctorDetail-note">
      <div class="doctorDetail-note-container">
        <div class="doctorDetail-note-title">
          所属专家团队
        </div>
        <!-- <package-list :packageList="packageList" :packageShow="packageShow"></package-list> -->
        <team-list :teamList="teamList"></team-list>
      </div>

    </div>
    <div class="doctorDetail-note">
      <div class="doctorDetail-note-container">
        <div class="doctorDetail-note-title">
          {{ myConsultTitle }}
        </div>
        <div class="doctorDetail-note-content">{{ myConsultContent }}</div>
      </div>
    </div>
    <div class="doctorDetail-btn">
      <div class="doctorDetail-btn-consult" @click="imageTextForm()">咨&ensp;询</div>
    </div>
    <div style="height: 65px;"></div>
    <van-overlay :show="cardShow" :lock-scroll="false">
      <bussiness-card @closeOverlay="viewCard(false)" :doctorInfo="doctorInfo" ref="card"></bussiness-card>
    </van-overlay>
    <van-overlay :show="detailShow" :lock-scroll="false">
      <doc-introduce @closeOverlay="viewDetail(false)" :doctorInfo="doctorInfo"></doc-introduce>
    </van-overlay>
  </div>
</template>

<script>
import { consultTitle, consultContent } from "../imageTextConsult/hooks/agreemenText";
import health from "@/assets/images/home/introduce.png";
import doctorCard from "@/assets/images/Doctor/card.png";
import imageText from "@/assets/images/Doctor/imageText.png";
import goodat from "@/assets/images/Doctor/goodat.png";
import introduce from "@/assets/images/Doctor/introduce.png";
import bussinessCard from "./components/bussinessCard.vue";
import docIntroduce from "./components/docIntroduce.vue";
import packageList from "../groupDetail/components/packageList.vue";
import teamList from "../featuredSearch/components/teamList.vue";
export default {
  components: {
    bussinessCard,
    docIntroduce,
    packageList,
    teamList,
  },
  data() {
    return {
      cardShow: false,
      detailShow: false,
      packageList: [],
      packageShow: false,
      doctorInfo: {
        doctorId: "",
        doctorName: "",
        excel: "",
        introduction: "",
        title: "",
        url: "",
        deptName: "",
      },
      teamList: [],
      myConsultTitle: consultTitle,
      myConsultContent: consultContent,
    };
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0";
      }
      return val / 100;
    },
  },
  created() {
    let { doctorId, deptId } = this.$route.query;
    this.getDoctorDetail(doctorId, deptId);
    this.getPackageList(doctorId);
    this.getDeptList(deptId);
    this.getTeamList(doctorId);
  },
  computed: {
    defaultAvator() {
      return health;
    },
    defaultDoCard() {
      return doctorCard;
    },
    defaultImageText() {
      return imageText;
    },
    defaultGoodat() {
      return goodat;
    },
    defaultIntroduce() {
      return introduce;
    },
  },
  methods: {
    getTeamList(doctorId) {
      this.$apis
        .getHomeDoctorTeamList({ pageSize: 999, pageNo: 1, doctorId })
        .then((res) => {
          this.teamList = res.retData.list || [];
        });
    },
    viewCard(status = true) {
      this.cardShow = status;
      if(status) this.$refs.card.captureElement()
    },
    viewDetail(status = true) {
      this.detailShow = status;
    },
    imageTextForm() {
      if (
        localStorage.getItem("openId") ||
        (JSON.parse(localStorage.getItem("userInfo")) &&
          JSON.parse(localStorage.getItem("userInfo")).openId)
      ) {
        if (this.packageList.length > 0) {
          let packageId = this.packageList[0].packageId;
          this.$apis
            .getPackageInfo({
              packageId,
              flag: false,
            })
            .then((res) => {
              if (res.retData.platPackageSpecInfoDtoList[0].specId) {
                let { price, specId } =
                  res.retData.platPackageSpecInfoDtoList[0];
                let unitPrice = price / 100;
                this.$router.push({
                  path: "/imageTextForm",
                  query: {
                    specId,
                    price: unitPrice,
                  },
                });
              } else {
                this.$toast("医生未开通图文咨询服务");
              }
            });
        } else {
          this.$toast("医生未开通图文咨询服务");
        }
      } else {
        let url = window.location.href;
        let name = window.location.href.split("/#/")[0] + "/#/transportV2?url=";
        let newUrl = name + url;
        let redirect_uri = encodeURIComponent(newUrl);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
      }
    },
    getDoctorDetail(doctorId, deptId) {
      let params = {
        deptId,
        doctorName: "",
        doctorId,
      };
      this.$apis.selectPackageDoctorsByDept(params).then((res) => {
        this.doctorInfo = res.retData[0];
      });
    },
    getPackageList(doctorId) {
      let params = {
        pageNo: 1,
        pageSize: 999,
        doctorId,
      };
      this.$apis.getListPackageInfo(params).then((res) => {
        if (res.retData.list.length > 0) {
          this.packageList = res.retData.list;
          this.packageShow = true;
        } else {
          this.packageShow = false;
        }
      });
    },
    getDeptList() {},
  },
};
</script>

<style scoped lang="scss">
.doctorDetail {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  &-btn {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 65px;
    background: #ffffff;
    &-consult {
      position: absolute;
      height: 34px;
      top: 8px;
      left: 14px;
      right: 14px;
      background: linear-gradient(104deg, #ff9035 31%, #ff7b35 70%);
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      letter-spacing: 0.2px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
    }
  }
  &-introduce {
    background: linear-gradient(180deg, #33af5a 0%, #f6f6f6 100%);
    padding: 20px 12px 4px;
    &-box {
      background: linear-gradient(0deg, #ffffff 87%, #e4ffec 100%);
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
      border-radius: 8px;
    }
    &-l1ne {
      display: flex;
      justify-content: space-between;
      padding: 22px;
      &-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .left-l1ne {
          display: flex;
          align-items: center;
          .name {
            font-size: 30px;
            font-weight: 600;
            letter-spacing: 0.2px;
            color: #333333;
          }
          .card {
            color: #00982d;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.19px;
            border-radius: 10px;
            box-sizing: border-box;
            border: 0.6px solid #50bb70;
            height: 20px;
            margin-left: 13px;
            padding: 8px 4px;
            display: flex;
            align-items: center;
            img {
              height: 12px;
              width: 16px;
              margin-right: 4px;
            }
          }
        }
        .left-l2ne {
          font-weight: 400;
          font-size: 14px;
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0.17px;
          color: #111111;
        }
        .left-l3ne {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #adcad3;
          border-radius: 10px;
          padding: 8px 6px;
          position: relative;
          bottom: 2px;
          img {
            height: 28px;
            margin-right: 10px;
          }
          &-price {
            display: flex;
            align-items: end;
          }
          &-text {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #333333;
            position: relative;
            top: 2px;
            margin-right: 10px;
          }
          &-unit {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #ff5800;
          }
          &-number {
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #ff5800;
            position: relative;
            top: 2px;
            margin: 0 1px;
          }
          &-qi {
            font-size: 9px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #999999;
            margin-right: 5px;
          }
        }
      }
      &-right {
        width: 130px;
        height: 130px;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }
    }
    &-l2ne {
      padding: 2px 22px 2px;
      font-size: 12px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0.2px;
      color: #333333;
      img {
        height: 17px;
        width: 29px;
        margin-right: 10px;
      }
    }
    &-l3ne {
      padding: 2px 22px 2px;
      font-size: 12px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0.2px;
      color: #333333;
      margin: 10px 0;
      img {
        height: 17px;
        width: 29px;
        margin-right: 10px;
      }
    }
    .over2h {
      display: flex;
      &-left {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &-right {
        width: 30px;
        position: relative;
        top: 22px;
      }
    }
  }
  &-note {
    padding: 20px 12px 4px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    &-container {
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
      background: #fff;
      border-radius: 8px;
      padding: 14px 0;
    }
    &-title {
      font-size: 17px;
      font-weight: 500;
      letter-spacing: 0.2px;
      color: #000000;
      margin: 0px 15px 17px;
    }
    &-content {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.2px;
      color: #666666;
      margin: 0px 15px 17px;
      white-space: pre-wrap;
    }
  }
}
</style>