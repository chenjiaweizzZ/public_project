<template>
  <div @dblclick="ondblclick" class="card-style">
    <div class="top-content">
      <div>
        <img
          v-if="listData.hzxb === '女'"
          src="~@/assets/images/girl.svg"
          class="img-icon"
          alt=""
        />
        <img v-else src="~@/assets/images/boy.svg" class="img-icon" alt="" />
      </div>
      <div>
        <div class="name-type">
          <el-tooltip effect="dark" :content="listData.hzxm">
            <div class="name">{{ listData.hzxm }}</div>
          </el-tooltip>
          <!-- <div class="name">{{ listData.hzxm }}</div> -->
          <div class="type-title">
            <div>
              <div v-if="listData.ybxz === '职工医保'" class="employee-medical-insurance">
                {{ listData.ybxz }}
              </div>
              <div v-if="listData.ybxz === '城镇医保'" class="urban-medical-insurance">
                {{ listData.ybxz }}
              </div>
              <div v-if="listData.ybxz === '工伤保险'" class="employment-injury-insurance">
                {{ listData.ybxz }}
              </div>
              <div
                v-if="
                  listData.ybxz !== '职工医保' &&
                    listData.ybxz !== '工伤保险' &&
                    listData.ybxz !== '城镇医保'
                "
                class="employment-else"
              >
                {{ listData.ybxz }}
              </div>
            </div>

            <div>
              <div v-if="listData.flag === '预约住院'" class="out-hospital">离院</div>
              <div v-if="listData.flag === '离院'" class="out-hospital">离院</div>
              <div v-if="listData.flag === '在院'" class="in-hospital">在院</div>
            </div>
          </div>
        </div>
        <div>
          <div class="birth">{{ listData.csrq }}</div>
        </div>
      </div>
    </div>
    <div class="mid-content">
      <div class="two-info" style="display: flex">
        <div><img src="~@/assets/images/idIcon.png" alt="" />{{ listData.hzid }}</div>
        <div style="margin-left: 20px">
          <img src="~@/assets/images/phoneIcon.png" alt="" />{{ listData.hzdhhm }}
        </div>
      </div>
      <div style="margin-bottom: 6px">
        <img src="~@/assets/images/bodyIcon.png" style="margin-right: 10px" alt="" />{{
          listData.sfzh
        }}
      </div>
      <el-tooltip effect="dark" :content="listData.jtzz">
        <div class="address">
          <img src="~@/assets/images/locationIcon.png" style="margin-right: 10px" alt="" />{{
            listData.jtzz
          }}
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex"
export default {
  name: "",
  props: {
    listData: {
      type: Object,
      default() {
        return []
      },
    },
    created() {
      console.log(listData, "listData")
    },
  },
  methods: {
    ondblclick() {
      this.$router.push({
        name:"panoramicVIew",
        query:{
          ...this.listData
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.medical {
  border-radius: 10px;
  max-width: 64px;
  height: 20px;
  padding: 0px 8px;
  font-size: 12px;
  line-height: 20px;
  margin: 3px 3px;
  overflow: hidden; /*超出的文本隐藏*/
  text-overflow: ellipsis; /*溢出用省略号显示*/
  white-space: nowrap; /*溢出不换行*/
}
.in-out-style {
  padding: 0px 8px;
  width: 40px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  margin-top: 3px;
  border-radius: 10px;
}
.card-style {
  /* position: absolute; */
  height: 159px;
  border: 1px solid #e6e6e6;
  margin-left: 25px;
  margin-bottom: 10px;
  background: #ffffff;

  box-shadow: 0px 4px 10px rgba(0, 117, 255, 0.2);
  border-radius: 4px;
  .top-content {
    display: flex;
    padding: 10px 0 19px 10px;
    .img-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .name-type {
      margin-left: 8px;
      display: flex;
      .name {
        font-weight: bold;
        margin-right: 10px;
        font-size: 16px;
        line-height: 24px;
        max-width: 60px;
        overflow: hidden; /*超出的文本隐藏*/
        text-overflow: ellipsis; /*溢出用省略号显示*/
        white-space: nowrap; /*溢出不换行*/
      }
    }
    .birth {
      margin-left: 8px;
      font-size: 12px;
      line-height: 20px;
      color: #333333;
    }
    .type-title {
      display: flex;
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

      .in-hospital {
        @extend .in-out-style;
        background: #e8f2fd;
        color: #0075ff;
      }
      .out-hospital {
        @extend .in-out-style;
        background: #f1f1f1;
        color: #999999;
      }
    }
  }
  .mid-content {
    font-size: 12px;
    line-height: 20px;
    margin-left: 14px;
    .two-info {
      img {
        margin-right: 10px;
      }
      div {
        width: 100px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        margin-bottom: 6px;
        overflow: hidden; /*超出的文本隐藏*/
        text-overflow: ellipsis; /*溢出用省略号显示*/
        white-space: nowrap; /*溢出不换行*/
      }
    }
    .address {
      max-width: 90%;
      overflow: hidden; /*超出的文本隐藏*/
      text-overflow: ellipsis; /*溢出用省略号显示*/
      white-space: nowrap; /*溢出不换行*/
    }
  }
}
@media screen and (max-width: 698px) {
  .card-style {
    width: 304px;
  }
}
@media screen and (min-width: 698px) and (max-width: 1024px) {
  .card-style {
    width: 43.5%;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1280px) {
  .card-style {
    width: 29.6%;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1440px) {
  .card-style {
    width: 22.5%;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1680px) {
  .card-style {
    width: 17.9%;
  }
}
@media screen and (min-width: 1680px) and (max-width: 1920px) {
  .card-style {
    width: 18.2%;
  }
}
@media screen and (min-width: 1920px) {
  .card-style {
    width: 15.2%;
  }
}
</style>
