<template>
  <section class="wrapper">
    <table class="content">
      <tr>
        <td class="label">随访类型</td>
        <td class="value">{{item.type}}</td>
        <!-- <td class="label">随访名称</td>
        <td class="value">{{item.content}}</td>-->
      </tr>
      <tr>
        <td class="label">随访执行时间</td>
        <td class="value">{{item.startTime}}</td>
        <td class="label">随访完成时间</td>
        <td class="value">{{item.completeTime}}</td>
      </tr>
    </table>
  </section>
</template>

<script>
export default {
  name: 'followup-content-header',
  props: {
    item: {
      type: Object,
      dafault: function () {
        return {
          type: '',
          content: '',
          startTime: '',
          completeTime: '',
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: rgba(42, 63, 84, 0.04);
  padding: 10px;
}
.content {
  width: 100%;
  td {
    padding: 10px;
    vertical-align: top;
  }
  .label {
    text-align: right;
    color: #425b77;
    min-width: 150px;
    font-weight: bold;
  }
  .value {
    width: 35%;
    color: #666666;
  }
}
</style>