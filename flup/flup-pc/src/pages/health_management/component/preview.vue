<template>
  <div class="preview">
    <div class="content">
      <div class="scroll">
        <img :src="picture" alt="" />
      </div>
      <div class="healthControl-floor">
        <div class="healthControl-floor__protocol">
          <el-checkbox
            shape="square"
            disabled
            icon-size="14px"
            checked-color="#32AE57"
            >我阅读同意<span class="floor-protocol__text"
              >《全病程管理服务协议》</span
            ></el-checkbox
          >
        </div>
        <div class="floor-operate">
          <div class="floor-operate__service">
            <img
              width="17"
              height="17"
              src="@/assets/images/service.png"
              alt=""
            />
            <span>咨询</span>
          </div>
          <div class="floor-operate__btn">
            签约
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      picture: ""
    };
  },
  created() {
    this.getParamValue();
  },
  methods: {
    getParamValue() {
      let url = decodeURIComponent(window.location.href);
      let i = url.indexOf("=");
      if (i == -1) return null;
      this.picture = url.slice(i + 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.preview {
  height: 100%;
  position: relative;
  .content {
    top: 20px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: 414px;
    height: 736px;
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    .healthControl-floor {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 84px;
      background-color: #ffffff;
      padding: 0 14px;
      .healthControl-floor__protocol {
        margin: 13px 0 10px;
        text-align: center;
        .floor-protocol__text {
          color: #32ae57;
        }
      }
      .floor-operate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .floor-operate__service {
          display: flex;
          align-items: center;
          span {
            margin-left: 4px;
          }
        }
        .floor-operate__btn {
          width: 181px;
          text-align: center;
          border-radius: 100px;
          height: 34px;
          line-height: 34px;
          background: linear-gradient(116deg, #ff9035 30%, #ff7b35 72%);
          color: #ffffff;
        }
      }
    }
    .scroll {
      height: calc(100% - 84px);
      overflow-y: auto;
      img {
        width: 100%;
      }
    }
  }
}
</style>
