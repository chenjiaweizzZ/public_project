<template>
  <section ref="section" class="taskDetail">
    <div class="taskDetail" v-if="type == 1">
      <div class="taskTop">
        <p>{{ result.questionnaireName }}</p>
        <span v-if="result.flupStartTime">{{ result.flupStartTime }}</span>
      </div>
      <div class="taskContent">
        <div class="taskTitle">
          <p>内容</p>
        </div>
        <div class="taskInfo">
          <section class="wrapper" v-html="html"></section>
        </div>
      </div>
    </div>
    <section class="wrapper" v-html="html" v-if="type == 2"></section>
  </section>
</template>

<script>
export default {
  name: "xuanjiao",
  data() {
    return {
      type: 0,
      result: {},
      html: "",
    };
  },
  created() {
    if (this.$route.query.serialNo && this.$route.query.hospitalId) {
      this.type = 1;
      if (!this.$route.query.isWeChat) {
        this.$apis
          .templatequerySaveContent({
            serialNo: this.$route.query.serialNo,
            hospitalId: this.$route.query.hospitalId,
          })
          .then((res) => {
            this.result = res.retData;
            this.html = res.retData.result;
          });
      } else {
        this.$apis
          .queryTemplateContent(
            {
              serialNo: this.$route.query.serialNo,
            },
            {
              token: this.$route.query.token,
            }
          )
          .then((res) => {
            this.result = res.retData;
            this.html = this.HTMLDecode(res.retData.contentHtml);
          });
      }
    } else {
      this.type = 2;
      this.$apis
        .getSaveContent({
          serial_no:
            this.$route.query.queid == null
              ? this.$route.query.serialno
              : this.$route.query.queid,
          master_id: this.$route.query.serialno,
          version_number: this.$route.query.version_number,
          user_id: this.$route.query.user_id,
          hospital_id: this.$route.query.hospital_id,
        })
        .then((result) => {
          this.html = result.dataList;
        });
    }
  },
  methods:{
    HTMLDecode(text) {
      var temp = document.createElement('div')
      temp.innerHTML = text
      var output = temp.innerText || temp.textContent
      temp = null
      return output
    },
  }
};
</script>

<style lang="scss" scoped>
.taskDetail {
  position: relative;
  .taskTop {
    padding: 0 20px;
    padding-bottom: 80px;
    background: url("../assets/images/taskTopBg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    p {
      margin: 24px 0 12px;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: #ffffff;
    }
    span {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.17px;
      color: #ffffff;
    }
  }
  .taskContent {
    margin-top: -43px;
    padding-top: 23px;
    padding-bottom: 50px;
    border-radius: 24px 24px 0px 0px;
    background: #ffffff;
    .taskTitle {
      padding-bottom: 10px;
      border-bottom: 1px solid #c6c9ce;
      p {
        position: relative;
        padding: 0 28px;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #333333;
        &::before {
          content: "";
          display: block;
          width: 3px;
          height: 16px;
          border-radius: 1.5px;
          background: #32ae57;
          position: absolute;
          top: 1px;
          left: 14px;
        }
      }
    }
    .taskInfo {
      margin-bottom: 8px;
      padding: 17px 3.75%;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.2px;
      color: #111111;
    }
  }
  .wrapper {
    overflow: hidden;
    img {
      width: 100% !important;
    }
  }
}
</style>
<style lang="scss">
.taskDetail {
  .wrapper {
    overflow: hidden;
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
