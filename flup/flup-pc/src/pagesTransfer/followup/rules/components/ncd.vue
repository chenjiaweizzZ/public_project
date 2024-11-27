<template>
  <section class="margin-top20 normal">
    <el-row type="flex" justify="space-between" align="middle">
      <div class="title">慢病续方</div>
      <div>
        <el-button type="primary" plain @click="onAdd">新 增</el-button>
        <el-button type="warning" plain @click="copy">复 制</el-button>
      </div>
    </el-row>
    <el-table
      style="margin-top: 10px;"
      class="rules-table"
      stripe
      border
      :data="mainList"
    >
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="药物名称">
        <template slot-scope="scope">
          <el-select
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.name"
            placeholder="请选择药物名称"
          >
            <el-option
              v-for="item in nameList ||
                (selectIndex == scope.$index && isEdit == true)"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{ getName(scope.row.name, nameList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次剂量" width="150">
        <template slot-scope="scope">
          <el-input-number
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.metering"
            :min="1"
            :max="999"
            controls-position="right"
            size="small"
            placeholder="单次剂量"
          ></el-input-number>
          <span v-else>{{ scope.row.metering }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计量单位">
        <template slot-scope="scope">
          <el-select
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.unit"
            placeholder="请选择计量单位"
          >
            <el-option
              v-for="item in unitList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{ getName(scope.row.unit, unitList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="给药方式">
        <template slot-scope="scope">
          <el-select
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.mode"
            placeholder="请选择给药方式"
          >
            <el-option
              v-for="item in modeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{ getName(scope.row.mode, modeList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频次">
        <template slot-scope="scope">
          <el-select
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.frequency"
            placeholder="请选择频次"
          >
            <el-option
              v-for="item in frequencyList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{ getName(scope.row.frequency, frequencyList) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用药天数" width="150">
        <template slot-scope="scope">
          <el-input-number
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.days"
            :min="1"
            :max="999"
            controls-position="right"
            size="small"
            placeholder="用药天数"
          ></el-input-number>
          <span v-else>{{ scope.row.days }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发药数量" width="150">
        <template slot-scope="scope">
          <el-input-number
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.quantity"
            :min="1"
            :max="999"
            controls-position="right"
            size="small"
            placeholder="发药数量"
          ></el-input-number>
          <span v-else>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发药单位">
        <template slot-scope="scope">
          <el-select
            v-if="
              !scope.row.id || (selectIndex == scope.$index && isEdit == true)
            "
            v-model="ruleForm.dispensingUnit"
            placeholder="请选择发药单位"
          >
            <el-option
              v-for="item in dispensingUnitList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>
            {{ getName(scope.row.dispensingUnit, dispensingUnitList) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <div v-if="!scope.row.id">
            <el-button @click="onCancel(scope.$index)" type="text"
              >撤销</el-button
            >
            <el-button type="text" @click="onConfirm(scope.$index, scope.row)"
              >确定</el-button
            >
          </div>
          <div v-else>
            <el-button type="text" @click="onEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="onDelete(scope.$index)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
export default {
  data() {
    return {
      selectIndex: null,
      isSave: true,
      isEdit: false,
      ruleForm: {
        name: "",
        metering: "",
        unit: "",
        mode: "",
        frequency: "",
        days: "",
        quantity: "",
        dispensingUnit: ""
      },
      mainList: [
        // {
        //   name: "1",
        //   metering: 1,
        //   unit: "2",
        //   mode: "5",
        //   frequency: "7",
        //   days: 1,
        //   quantity: 1,
        //   dispensingUnit: "6",
        //   id: 1
        // }
      ],
      nameList: [
        {
          name: "普萘洛尔",
          value: "1"
        },
        {
          name: "阿替洛尔",
          value: "2"
        },
        {
          name: "硝酸异山梨酯",
          value: "3"
        },
        {
          name: "硝苯地平",
          value: "4"
        },
        {
          name: "曲克芦丁",
          value: "5"
        },
        {
          name: "氢氧化铝",
          value: "6"
        },
        {
          name: "沙丁胺醇",
          value: "7"
        },
        {
          name: "醋酸甲羟孕酮",
          value: "8"
        },
        {
          name: "甲氧氯普胺",
          value: "9"
        },
        {
          name: "消旋山莨菪碱",
          value: "10"
        },
        {
          name: "去甲肾上腺素",
          value: "11"
        },
        {
          name: "肾上腺素",
          value: "12"
        },
        {
          name: "甲硝唑",
          value: "13"
        },
        {
          name: "喷托维林",
          value: "14"
        },
        {
          name: "诺氟沙星",
          value: "15"
        },
        {
          name: "呋喃唑酮",
          value: "16"
        }
      ],
      unitList: [
        {
          name: "盒",
          value: "1"
        },
        {
          name: "包",
          value: "2"
        },
        {
          name: "g",
          value: "3"
        },
        {
          name: "瓶",
          value: "4"
        },
        {
          name: "支",
          value: "5"
        },
        {
          name: "粒",
          value: "6"
        },
        {
          name: "万单位",
          value: "7"
        },
        {
          name: "喷",
          value: "8"
        },
        {
          name: "滴",
          value: "9"
        },
        {
          name: "袋",
          value: "10"
        }
      ],
      modeList: [
        {
          name: "包煎",
          value: "1"
        },
        {
          name: "烊化",
          value: "2"
        },
        {
          name: "冲服",
          value: "3"
        },
        {
          name: "烊化冲服",
          value: "4"
        },
        {
          name: "泡服",
          value: "5"
        },
        {
          name: "先煎",
          value: "6"
        },
        {
          name: "后下",
          value: "7"
        },
        {
          name: "外敷",
          value: "8"
        },
        {
          name: "口服",
          value: "9"
        },
        {
          name: "肌内注射",
          value: "10"
        }
      ],
      frequencyList: [
        {
          name: "每20小时1次",
          value: "1"
        },
        {
          name: "每12小时1次",
          value: "2"
        },
        {
          name: "每72小时1次",
          value: "3"
        },
        {
          name: "一天2次",
          value: "4"
        },
        {
          name: "术前",
          value: "5"
        },
        {
          name: "睡前1次",
          value: "6"
        },
        {
          name: "必要时",
          value: "7"
        },
        {
          name: "早晨1次",
          value: "8"
        },
        {
          name: "晚上1次",
          value: "9"
        },
        {
          name: "隔天1次",
          value: "10"
        }
      ],
      dispensingUnitList: [
        {
          name: "瓶",
          value: "1"
        },
        {
          name: "袋",
          value: "2"
        },
        {
          name: "片",
          value: "3"
        },
        {
          name: "支",
          value: "4"
        },
        {
          name: "只",
          value: "5"
        },
        {
          name: "贴",
          value: "6"
        },
        {
          name: "罐",
          value: "7"
        },
        {
          name: "桶",
          value: "8"
        },
        {
          name: "盒",
          value: "9"
        }
      ],
      oldObj: {}
    };
  },
  methods: {
    onAdd() {
      let singal1 = this.$parent.$parent.$refs.cancel1
        ? this.$parent.$parent.$refs.cancel1.editSattus !== "none"
        : false;

      let singal2 = this.$parent.$parent.$refs.cancel2
        ? this.$parent.$parent.$refs.cancel2.editSattus !== "none"
        : false;

      let singal3 = this.$parent.$parent.$refs.cancel3
        ? this.$parent.$parent.$refs.cancel3.editSattus !== "none"
        : false;
      // let singal4 = this.$parent.$parent.$refs.cancel4
      //   ? this.$parent.$parent.$refs.cancel4.editSattus !== "none"
      //   : false;
      if (this.isSave && !singal1 && !singal2 && !singal3) {
        this.mainList.push({
          name: "",
          metering: "",
          unit: "",
          mode: "",
          frequency: "",
          days: "",
          quantity: "",
          dispensingUnit: ""
        });
        this.isSave = false;
        this.selectIndex = this.mainList.length - 1;
      } else {
        this.$message({
          message: "请保存后再编辑!",
          type: "warning"
        });
      }
    },
    onCancel(index) {
      if (this.oldObj && this.oldObj.id) {
        this.$set(this.mainList, index, { ...this.oldObj });
        this.isSave = true;
        this.isEdit = false;
        this.oldObj = {};
      } else {
        this.mainList.splice(index, 1);
        this.isEdit = false;
        this.isSave = true;
      }
    },
    onConfirm(index, row) {
      if (!this.ruleForm.name) {
        this.$message({
          type: "warning",
          message: "请选择药物名称"
        });
        return;
      } else if (!this.ruleForm.metering) {
        this.$message({
          type: "warning",
          message: "请输入单次剂量"
        });
        return;
      } else if (!this.ruleForm.unit) {
        this.$message({
          type: "warning",
          message: "请选择剂量单位"
        });
        return;
      } else if (!this.ruleForm.mode) {
        this.$message({
          type: "warning",
          message: "请选择给药方式"
        });
        return;
      } else if (!this.ruleForm.frequency) {
        this.$message({
          type: "warning",
          message: "请选择频次"
        });
        return;
      } else if (!this.ruleForm.days) {
        this.$message({
          type: "warning",
          message: "请输入用药天数"
        });
        return;
      } else if (!this.ruleForm.quantity) {
        this.$message({
          type: "warning",
          message: "请输入发药数量"
        });
        return;
      } else if (!this.ruleForm.dispensingUnit) {
        this.$message({
          type: "warning",
          message: "请选择发药单位"
        });
        return;
      } else {
        this.$set(this.mainList, index, { ...this.ruleForm, id: index + 1 });
        this.ruleForm = this.$options.data().ruleForm;
        this.isSave = true;
        this.isEdit = false;
        this.oldObj = {};
      }
    },
    onEdit(index, row) {
      let singal1 = this.$parent.$parent.$refs.cancel1
        ? this.$parent.$parent.$refs.cancel1.editSattus !== "none"
        : false;

      let singal2 = this.$parent.$parent.$refs.cancel2
        ? this.$parent.$parent.$refs.cancel2.editSattus !== "none"
        : false;

      let singal3 = this.$parent.$parent.$refs.cancel3
        ? this.$parent.$parent.$refs.cancel3.editSattus !== "none"
        : false;
      // let singal4 = this.$parent.$parent.$refs.cancel4
      //   ? this.$parent.$parent.$refs.cancel4.editSattus !== "none"
      //   : false;
      if (this.isSave && !singal1 && !singal2 && !singal3) {
        this.selectIndex = index;
        this.isSave = false;
        this.isEdit = true;
        this.oldObj = JSON.parse(JSON.stringify(row));
        this.ruleForm = row;
        delete this.ruleForm.id;
      } else {
        this.$message({
          message: "请保存后再编辑!",
          type: "warning"
        });
      }
    },
    onDelete(index) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.mainList.splice(index, 1);
          this.isSave = true;
          this.isEdit = false;
        })
        .catch(() => {});
    },
    getName(value, arr) {
      let newArr = arr.filter(item => {
        return item.value == value;
      });
      if (newArr.length === 1) return newArr[0].name;
      return null;
    },
    copy() {
      let singal1 = this.$parent.$parent.$refs.cancel1
        ? this.$parent.$parent.$refs.cancel1.editSattus !== "none"
        : false;

      let singal2 = this.$parent.$parent.$refs.cancel2
        ? this.$parent.$parent.$refs.cancel2.editSattus !== "none"
        : false;
      let singal3 = this.$parent.$parent.$refs.cancel3
        ? this.$parent.$parent.$refs.cancel3.editSattus !== "none"
        : false;
      // let singal4 = this.$parent.$parent.$refs.cancel4
      //   ? this.$parent.$parent.$refs.cancel4.editSattus !== "none"
      //   : false;
      if (this.isSave && !singal1 && !singal2 && !singal3) {
        this.$emit("getList", 1);
      } else {
        this.$message({
          message: "请保存后再编辑!",
          type: "warning"
        });
      }
    }
  }
};
</script>
