<template>
  <div>
    <div v-show="!showDetail" class="chart-list">
      <template v-for="item in data">
        <chart
          class="chart-list_item"
          v-if="item.data && item.data.length>0"
          :key="item.label"
          :data="item"
          :title="item.label"
          @click-detail="onViewDetail(item)"
        ></chart>
      </template>
    </div>
    <chart-detail v-if="showDetail" :type="currentItem.type" :userId="$parent.currentItem.userId"></chart-detail>
  </div>
</template>

<script>
import ChartDetail from './detail'
import Chart from './chart'
export default {
  components: { Chart, ChartDetail },
  props: {
    data: Object,
  },
  data() {
    return {
      showDetail: false,
      currentItem: null,
    }
  },
  methods: {
    onViewDetail(item) {
      this.showDetail = true
      this.currentItem = item
    },
  },
}
</script>

<style lang="scss">
.chart-list {
  display: flex;
  flex-wrap: wrap;
  &_item {
    width: calc(50% - 10px);
    border: 1px solid #d7dae0;
    padding: 16px 20px;
    margin-top: 20px;
  }
  &_item:nth-of-type(even) {
    margin-left: 20px;
  }
}
</style>