<template>
  <div class="package-item">
    <img :src="message.content.data.predivUrl" mode="" />
    <div class="title">
      <div class="packageName">{{ message.content.data.packageName }}</div>
      <div class="packageDiscription">
        {{ message.content.data.packageDiscription }}
      </div>
      <div class="floorPrice">
        <span class="symbol">¥</span
        ><span class="money">{{ message.content.data.floorPrice }}</span
        >起
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style lang="scss" scoped>
.package-item {
  padding: 10px;
  width: 234px;
  background: linear-gradient(0deg, #ffffff 35%, #e6ffea 100%);
  display: flex;
  image {
    width: 70px;
    height: 70px;
    margin-right: 14px;
    border-radius: 4px;
  }

  .title {
    flex: 1;
    padding-right: 14px;
    overflow: hidden;
  }

  .packageName {
    color: #111111;
    font-size: 15px;
    font-weight: 700;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .packageDiscription {
    color: #666666;
    font-size: 12px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .floorPrice {
    font-size: 12px;
    color: #666666;
    .symbol {
      font-size: 14px;
      font-weight: 700;
      color: #ff5500;
      margin-right: 2px;
    }
    .money {
      font-size: 18px;
      font-weight: 700;
      color: #ff5500;
      margin-right: 4px;
    }
  }
}
</style>
