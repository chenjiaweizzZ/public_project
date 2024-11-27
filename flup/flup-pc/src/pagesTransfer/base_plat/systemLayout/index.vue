// 系统配置
<template>
  <div class="systemLayoutBox">
    <el-tabs v-model="currentTab">
      <el-tab-pane
        v-for="(item, index) in mainList"
        :key="index"
        :label="item.moduleName"
        :name="String(index)"
      >
        <template v-for="(item2, index2) in item.childList">
          <div
            v-if="item2.componentType == 'radio'&& item2.enabled == '1'"
            :key="index2"
            class="configurationItem"
          >
            <p class="titleText">{{item2.componentDescription}}</p>
            <el-radio-group v-model="item2.componentValue" @change="updateFlupConfigOne(item2)">
              <el-radio-button
                v-for="(item3, index3) in JSON.parse(item2.componentText)"
                :key="index3"
                :label="item3.itemValue"
              >{{item3.itemName}}</el-radio-button>
            </el-radio-group>
          </div>
          <div
            v-else-if="item2.componentType == 'number'&& item2.enabled == '1'"
            :key="index2"
            class="configurationItem"
          >
            <p class="titleText">{{item2.componentDescription}}</p>
            <el-input-number
              v-numberSign
              v-model="item2.componentValue"
              :min="0"
              :max="9999"
              size="medium"
              @change="updateFlupConfigOne(item2)"
            ></el-input-number>
          </div>
          <div
            v-else-if="item2.componentType == 'select'&& item2.enabled == '1'"
            :key="index2"
            class="configurationItem"
          >
            <p class="titleText">{{item2.componentDescription}}</p>
            <el-select
              style="width: 300px"
              v-model="item2.componentValue"
              placeholder="请选择"
              @change="updateFlupConfigOne(item2)"
            >
              <el-option
                v-for="(item3, index3) in JSON.parse(item2.componentText)"
                :key="index3"
                :label="item3.itemName"
                :value="item3.itemValue"
              ></el-option>
            </el-select>
          </div>
          <div
            v-else-if="item2.componentType == 'text'&& item2.enabled == '1'"
            :key="index2"
            class="configurationItem"
          >
            <p class="titleText">{{item2.componentDescription}}</p>
            <el-input
              style="width: 300px"
              placeholder="请输入内容"
              v-model="item2.componentValue"
              class="input-with-select"
            >
              <el-button slot="append" @click="updateFlupConfigOne(item2)">提交</el-button>
            </el-input>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: '0',
      mainList: [],
    }
  },
  mounted() {
    this.$apis
      .queryFlupConfigAllByGroup({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.mainList = res
      })
  },
  methods: {
    updateFlupConfigOne(item) {
      this.$apis
        .updateFlupConfigOne({
          serialNo: item.serialNo,
          componentValue: item.componentValue,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功!',
              type: 'success',
            })
          }
        })
    },
  },
}
</script>

<style lang="scss">
.systemLayoutBox {
  padding: 0px 20px;
  .configurationItem {
    padding: 10px 0px;
    display: flex;
    align-items: center;
    .titleText {
      width: 200px;
      margin-right: 20px;
      text-align: right;
    }
  }
}
</style>