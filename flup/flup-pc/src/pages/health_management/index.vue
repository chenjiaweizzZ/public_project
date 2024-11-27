<template>
  <div class="health_management">
    <router-view></router-view>
  </div>
</template>
<script></script>
<style lang="scss">
.health_management {
  height: 100%;
  .el-dialog__footer {
    .dialog-footer {
      padding: 0px !important;
      .el-button--primary {
        button {
          padding: 8px 17px !important;
        }
        min-width: 0 !important;
      }
    }
  }
}
.hm-width {
  .el-message-box__message {
    padding-left: 20px !important;
  }
}

.hm-width {
  .el-button--primary {
    padding: 8px 17px !important;
    min-width: 0 !important;
  }
}
.el-textarea__inner {
  font-family: MicrosoftYaHei !important;
  font-size: 14px !important;
  font-weight: normal !important;
  color: #111111 !important;
}
</style>
