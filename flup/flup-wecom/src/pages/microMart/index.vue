<template>
  <div class="micro-mart">
    <userInfo></userInfo>
    <div class="purchase-record">
      <div class="title">
        <p>购买记录</p>
      </div>
      <div class="purchase-record-list">
        <div class="item">
          <p class="content" @click="seeDetail">爱康国宾打工人尊享套餐</p>
          <p>2023-2-23</p>
        </div>
      </div>
    </div>
    <RouterView></RouterView>
    <el-dialog
      v-model="dialogVisible"
      title="爱康国宾打工人尊享套餐"
      width="80%"
    >
      <el-from :model="form" label-position="left">
        <el-form-item label-width="80" label="就诊医院">
          <p>浙大二院</p>
        </el-form-item>
        <el-form-item label-width="80" label="适用人群">
          <p>关注身体全面健康，要求高品质服务的人群</p>
        </el-form-item>
        <el-form-item label-width="80" label="适用性别">
          <p>男女通用</p>
        </el-form-item>
        <el-form-item label-width="80" label="有效期">
          <p>2024-12-31</p>
        </el-form-item>
        <el-form-item label-width="80" label="说明">
          <p>至少提前一周在公众号“浙大二院服务”预约。</p>
        </el-form-item>
        <el-form-item label-width="80" label="介绍">
          <el-table
            :data="tableData"
            :span-method="arraySpanMethod"
            border
            style="width: 100%"
          >
            <el-table-column prop="classname" label="分类" />
            <el-table-column prop="specificProject" label="具体项目" />
          </el-table>
        </el-form-item>
      </el-from>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import userInfo from "../../components/userInfo.vue";
import { ref } from "vue";
const dialogVisible = ref(false);
const form = ref({});
const tableData = ref([
  {
    classname: "普通检查",
    specificProject: "一般检查",
  },
  {
    classname: "普通检查",
    specificProject: "外科",
  },
]);
const seeDetail = () => {
  dialogVisible.value = true;
};
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  let spanOneArr = [];
  let concatOne = 0;
  tableData.value.map((item, index) => {
    if (index === 0) {
      spanOneArr.push(1);
    } else {
      //第一列需合并相同内容的判断条件
      if (item.classname === tableData.value[index - 1].classname) {
        spanOneArr[concatOne] += 1;
        spanOneArr.push(0);
      } else {
        spanOneArr.push(1);
        concatOne = index;
      }
    }
  });

  if (columnIndex === 0) {
    const _row = spanOneArr[rowIndex];
    const _col = _row > 0 ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  }
};
</script>
<style lang="scss" scoped>
.micro-mart {

  .purchase-record {
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
    .purchase-record-list {
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        .content {
          color: #18aeff;
          cursor: pointer;
        }
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 20px;
    }
    img {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
