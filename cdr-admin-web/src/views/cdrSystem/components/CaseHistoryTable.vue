<template>
  <div id="commonTable">
    <el-table :data="data" :max-height="maxHeight" border stripe tooltip-effect="light" class="histable">
      <slot name="table_oper" />
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.show != false"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
          :formatter="item.formatter ? item.formatter : formatterValue"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <!-- {{item.render(scope)}} -->
            <template v-if="item.render">
              <renderComponent :scope="scope" :propAttr="item.prop" :renderFunc="item.render"></renderComponent>
            </template>
            <template v-else> {{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CaseHistoryTable",
  props: {
    columns: Array,
    data: Array,
    maxHeight: {
      type: Number,
      default: 2000,
    },
  },
  components: {
    renderComponent: {
      props: {
        scope: {},
        renderFunc: {},
        propAttr: {},
      },
      render(h) {
        return this.renderFunc(h, this.scope, this.propAttr);
      },
    },
  },
  methods: {
    formatterValue(row, column, cellValue) {
      return cellValue;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.histable {
  .cell{
    text-align: left;
    color: #111;
  }
  thead {
    .cell {
      color: #666;
      text-align: center;
    }

  }

}
</style>
