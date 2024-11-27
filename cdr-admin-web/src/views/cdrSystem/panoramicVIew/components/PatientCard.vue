<template>
  <div
    class="card-style"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="top-content">
      <div>
        <img
          v-if="$route.query.hzxb === '女'"
          src="~@/assets/images/girl.svg"
          class="img-icon"
          alt=""
        />
        <img v-else src="~@/assets/images/boy.svg" class="img-icon" alt="" />
      </div>
      <div class="right-content">
        <div class="patient-lineOne">
          <el-tooltip effect="dark" :content="this.$route.query.hzxm">
            <div class="name">{{ this.$route.query.hzxm }}</div>
          </el-tooltip>
          <div class="age">
            <div class="age-model0" v-if="age.type === 0">{{ age.data.year }}岁</div>
            <div class="age-model1" v-else>
              <!-- 月 -->
              <div v-if="age.data.month > 0" class="mo">{{ age.data.month }}</div>
              <div class="day">
                <!-- 分子分母 -->
                <div v-if="age.data.day !== 0" style="display:flex">
                  <div class="age-group">
                    <div class="fz">{{ age.data.day }}</div>
                    <div class="line"></div>
                    <div class="fm">30</div>
                  </div>
                  <div>月</div>
                </div>
                <div v-else style="font-size:14px">
                  年龄未知
                </div>
              </div>
            </div>
          </div>
          <div class="sex-icon">
            <img v-if="$route.query.hzxb === '女'" src="~@/assets/images/girlIcon.svg" alt="" />
            <img v-else src="~@/assets/images/boyicon.svg" alt="" />
          </div>
          <div v-if="isExist === '1'" class="alive-type">死亡</div>
          <div v-if="$route.query.ybxz === '职工医保'" class="employee-medical-insurance">
            {{ this.$route.query.ybxz }}
          </div>
          <div v-if="$route.query.ybxz === '城镇医保'" class="urban-medical-insurance">
            {{ this.$route.query.ybxz }}
          </div>
          <div v-if="$route.query.ybxz === '工伤保险'" class="employment-injury-insurance">
            {{ this.$route.query.ybxz }}
          </div>
          <div
            v-if="
              $route.query.ybxz !== '职工医保' &&
                $route.query.ybxz !== '工伤保险' &&
                $route.query.ybxz !== '城镇医保'
            "
            class="employment-else"
          >
            {{ this.$route.query.ybxz }}
          </div>
        </div>
        <div class="birth">{{ this.$route.query.csrq }}</div>
      </div>
    </div>
    <div class="mid-content">
      <div class="two-info">
        <div class="two-info-left">
          <el-tooltip effect="dark" content="身份证号">
            <div><img src="~@/assets/images/bodyIconColor.svg" alt="" /></div>
          </el-tooltip>

          <div style="padding-left: 5px">{{ this.$route.query.sfzh }}</div>
        </div>
        <div class="two-info-right">
          <el-tooltip effect="dark" content="PID">
            <div><img src="~@/assets/images/infoIconColor.svg" alt="" /></div> </el-tooltip
          ><el-tooltip effect="dark" :content="this.$route.query.hzid">
            <div class="two-info-right-text" style="padding-left: 5px">
              {{ this.$route.query.hzid }}
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="phone-style">
        <el-tooltip effect="dark" content="电话号码">
          <div>
            <img src="~@/assets/images/phoneIconColor.png" width="16.5px" />
          </div>
        </el-tooltip>
        <div style="padding-left: 5px">{{ this.$route.query.hzdhhm }}</div>
      </div>
      <div class="location-style">
        <el-tooltip effect="dark" content="家庭住址">
          <div><img src="~@/assets/images/locationIconColor.svg" /></div>
        </el-tooltip>
        <el-tooltip effect="dark" :content="this.$route.query.jtzz">
          <div class="location-style-with">
            {{ this.$route.query.jtzz }}
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "@/utils"
import { selectDataList } from "@/service/patientView"

export default {
  name: "",
  data() {
    return {
      isExist: "",
      loading: true,
      endata: "",
      age: {
        data: {
          day: 0,
          month: 0,
        },
      },
    }
  },
  created() {
    this.getDataList()
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.hzid) {
        this.loading = true
        this.getDataList()
      }
    },
  },
  methods: {
    getDataList() {
      //表格页获取数据
      let params = {
        apiCode: "",
        apiVersion: "",
        pageNo: "1",
        pageSize: "8",
        parameters: {
          patientId: "",
        },
      }
      params.apiCode = "JK30003"
      params.apiVersion = "1.0"
      params.parameters.patientId = this.$route.query.hzid
      selectDataList(params).then((res) => {
        this.isExist = res.data[0].isExist
        if (this.isExist === "1") {
          this.endata = res.data[0].swrqsj
          if (this.endata) {
            this.age = _.getAge(this.$route.query.csrq, new Date(this.endata))
          }
        } else this.age = _.getAge(this.$route.query.csrq)
        this.loading = false
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.medical {
  border-radius: 10px;
  height: 20px;
  padding: 0px 8px;
  font-size: 12px;
  line-height: 20px;
}
.disapper {
  overflow: hidden; /*超出的文本隐藏*/
  text-overflow: ellipsis; /*溢出用省略号显示*/
  white-space: nowrap; /*溢出不换行*/
}
.card-style {
  /* position: absolute; */
  height: 206px;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 117, 255, 0.2);
  border-radius: 4px;
  .top-content {
    display: flex;
    padding: 10px 0 10px 16px;
    .right-content {
      padding-left: 10px;
      .patient-lineOne {
        display: flex;
        align-items: center;
        .name {
          font-weight: bold;
          font-size: 16px;
          line-height: 24px;
          padding-right: 8px;
          max-width: 150px;
          @extend .disapper;
        }
        .age {
          font-size: 14px;
          line-height: 22px;
          padding-right: 7px;
          .age-model1 {
            display: flex;
            align-items: center;
            .day {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;

              .fz {
                display: flex;
                justify-content: center;
                line-height: 10px;
                padding-bottom: 2px;
              }
              .line {
                height: 1px;
                background-color: #999;
              }
              .fm {
                line-height: 10px;
                padding-top: 2px;
              }
            }
          }
        }
        .sex-icon {
          padding-top: 3px;
          margin-right: 8px;
        }
        .alive-type {
          color: #fc2a30;
          border-radius: 10px;
          min-width: 40px;
          height: 20px;
          padding: 0px 8px;
          font-size: 12px;
          line-height: 20px;
          margin-right: 8px;
          background: #ffeaea;
        }
        .urban-medical-insurance {
          background: #e8f2fd;
          @extend .medical;
          color: #0075ff;
        }
        .employee-medical-insurance {
          background: #e9f7f0;
          @extend .medical;
          color: #00982d;
        }
        .employment-injury-insurance {
          background: #fff1da;
          @extend .medical;
          color: #fc561f;
        }
        .employment-else {
          background: #f1f1f1;
          @extend .medical;
          color: #999999;
        }
      }
      .birth {
        font-size: 14px;
        line-height: 22px;
        color: #333333;
      }
    }
    .img-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
    }
  }
  .mid-content {
    font-size: 12px;
    line-height: 20px;
    margin-left: 14px;
    width: 95%;
    height: 118px;
    background: #f5faff;
    border-radius: 4px;
    padding-top: 14px;
    .two-info {
      display: flex;
      .two-info-left {
        margin-left: 16.75px;
        display: flex;
        font-size: 14px;
        max-width: 180px;
      }
      .two-info-right {
        display: flex;
        font-size: 14px;
        margin-left: 10%;
        .two-info-right-text {
          max-width: 180px;
          @extend .disapper;
        }
      }
    }
    .phone-style {
      margin-left: 16.75px;
      margin-top: 8px;
      display: flex;
      font-size: 14px;
    }
    .location-style {
      margin-left: 16.75px;
      display: flex;
      margin-top: 8px;
      font-size: 14px;
      max-width: 80%;

      .location-style-with {
        padding-left: 5px;
        @extend .disapper;
      }
    }
  }
}
</style>
