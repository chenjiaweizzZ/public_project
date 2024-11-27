<template>
  <div class="positive-indicators">
    <div class="header">
      <div class="search">
        <span>搜索</span>
        <el-input style="width: 299px;" placeholder="请输入名称查询" v-model="keyword" :clearable="true"></el-input>
        <div class="search-icon" @click="Search">
          <i class="el-icon-search"></i>
        </div>
      </div>
      <el-button type="success" plain @click="Add">新增</el-button>
    </div>
    <div class="main">
      <div class="title">
        已配置阳性指标
        <span>{{ total }}</span>个
      </div>
      <div class="positive-table" v-if="total > 0">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="ruleName" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ruleDescribe" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column label="生效范围" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
              scope.row.effectiveScope == "0,1" ||
              scope.row.effectiveScope == "1,0"
              ? "单次门诊、单次体检"
              : scope.row.effectiveScope == 0
              ? "单次门诊"
              : "单次体检"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="needNotify" label="短信推送">
            <template slot-scope="scope">
              <el-switch :value="scope.row.needNotify" :active-value="1" :inactive-value="0" @change="tableNotifyChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="Edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="Delete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pageBottom"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="total,sizes,prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div class="none" v-else>
        <div class="img">
          <img src="../../../assets/images/none.png" alt />
          <p class="title" v-if="total == 0">
            您暂未配置阳性指标
            <el-button type="primary" plain @click="Add">去配置</el-button>
          </p>
          <p v-else-if="total == 0" class="title">暂无满足的指标内容</p>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="744px" :before-close="handleClose" class="indicators-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="ruleName" label-width="100px">
          <el-input style="width: 596px;" v-model="ruleForm.ruleName" placeholder="请输入名称" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="ruleDescribe" label-width="100px">
          <el-input style="width: 596px;" v-model="ruleForm.ruleDescribe" type="textarea" :rows="3" placeholder="请输入描述" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="生效范围" prop="effectiveScope" label-width="100px">
          <el-checkbox-group v-model="ruleForm.effectiveScope">
            <el-checkbox label="0">单次门诊</el-checkbox>
            <el-checkbox label="1">单次体检</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="指标分类" prop="classification" label-width="100px">
          <el-radio v-model="ruleForm.classification" :label="1">A类重大阳性</el-radio>
          <el-radio v-model="ruleForm.classification" :label="2">B类重大阳性</el-radio>
          <el-radio v-model="ruleForm.classification" :label="3">其它</el-radio>
        </el-form-item>
        <el-form-item label="短信推送" label-width="100px">
          <el-switch v-model="ruleForm.needNotify" :active-value="1" :inactive-value="0" @change="needNotifyChange"></el-switch>
        </el-form-item>
        <el-form-item label="推送文案" label-width="100px">
          <el-input type="textarea" v-model="ruleForm.notifyContents" placeholder="请输入短信推送文案" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <div class="key">阳性条件</div>
        <div class="item" v-for="(item, index) in ruleForm.ruleConfigConditionDtoList" :key="index">
          <span style="margin-right: 4px;padding-top: 8px;">条件{{ convertToChineseNumeral(index + 1) }}</span>
          <div class="keys" style="width: 160px;">
            <el-form-item
              :prop="`ruleConfigConditionDtoList[${index}].indicatorName`"
              :rules="{
                required: true,
                message: '请选择',
                trigger: 'change'
              }"
            >
              <!-- <el-select
                v-model="item.column"
                filterable
                placeholder="请选择"
                @visible-change="show($event, index)"
                @change="Change"
              >
                <el-option
                  v-for="item in selectIndicatorAttributeList"
                  :key="item.indicatorCode"
                  :label="item.indicatorName"
                  :value="item.indicatorCode"
                >
                </el-option>
              </el-select>-->
              <el-select class="select" v-model="item.indicatorName" :popper-append-to-body="false" @visible-change="show($event, index)" ref="select">
                <el-option value="1" hidden></el-option>
                <div class="main">
                  <div class="left" style="width: 148px;">
                    <div :class="activeIndex == item.id ? 'items active' : 'items'" v-for="item in tabList" :key="item.id" @click="selectIndex(item.id)">{{ item.name }}</div>
                  </div>
                  <div class="right">
                    <el-form-item :required="false">
                      <el-input style="width: 240px;" placeholder="请输入关键字查询" v-model="keyword1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="Search1"></el-button>
                      </el-input>
                    </el-form-item>
                    <div class="options">
                      <div
                        :class="
                          indicatorCode == items.indicatorCode
                            ? 'items active'
                            : 'items'
                        "
                        class="items"
                        @click="selectOptions(items)"
                        v-for="items in newSelectIndicatorAttributeList"
                      >{{ items.indicatorName }}</div>
                    </div>
                  </div>
                </div>
              </el-select>
            </el-form-item>
          </div>
          <div class="keys" style="width: 100px;">
            <el-form-item
              :prop="`ruleConfigConditionDtoList[${index}].conditionSymbol`"
              :rules="{
                required: true,
                message: '请选择',
                trigger: 'change'
              }"
              key="column"
            >
              <el-select v-model="item.conditionSymbol" :disabled="!item.column">
                <template v-if="selectConditionList[index]">
                  <el-option
                    v-for="item in getCompareList(
                      selectConditionList[index].conditionSymbol
                    )"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
          </div>
          <div class="keys" style="width: 140px;">
            <el-form-item
              v-if="selectConditionList[index]"
              :prop="`ruleConfigConditionDtoList[${index}].value`"
              :rules="{
                required: true,
                message: getName(selectConditionList[index].valueType),
                trigger: 'change'
              }"
            >
              <el-select v-if="selectConditionList[index].valueType == 1" :disabled="!item.column" v-model="item.value">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
              <el-input
                v-else-if="selectConditionList[index].valueType == 2"
                :disabled="!item.column"
                class="input"
                v-model="item.value"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                placeholder="请输入数字"
              >
                <i slot="suffix">
                  {{
                  selectConditionList[index].unit
                  }}
                </i>
              </el-input>
              <el-select v-else-if="selectConditionList[index].valueType == 3" :disabled="!item.column" v-model="item.value">
                <el-option label="阳性" value="1"></el-option>
                <el-option label="阴性" value="2"></el-option>
              </el-select>
              <el-input v-else-if="selectConditionList[index].valueType == 4" :disabled="!item.column" class="input" placeholder="请输入文字" v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item
              v-else
              :prop="`ruleConfigConditionDtoList[${index}].value`"
              :rules="{
                required: true,
                message: '请输入',
                trigger: 'change'
              }"
            >
              <el-input :disabled="!item.column" class="input" placeholder="请输入" v-model="item.value"></el-input>
            </el-form-item>
          </div>
          <div class="keys" style="width: 100px;">
            <el-form-item
              v-if="index < ruleForm.ruleConfigConditionDtoList.length - 1"
              :prop="`ruleConfigConditionDtoList[${index}].connectSymbol`"
              :rules="{
                required: true,
                message: '请选择',
                trigger: 'change'
              }"
            >
              <el-select v-model="item.connectSymbol">
                <el-option label="or" :value="1"></el-option>
                <el-option label="and" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="keys" style="padding-top: 8px;">
            <el-button type="text" @click="Increase">添加</el-button>
            <el-button type="text" @click="Delete1(index)">删除</el-button>
          </div>
        </div>
      </el-form>
      <div></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="Determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      title: '新增阳性指标',
      dialogVisible: false,
      keyword: '',
      keyword1: '',
      ruleForm: {
        ruleName: '', // 名称
        ruleDescribe: '', // 描述
        effectiveScope: [], // 生效范围
        classification: null, // 1A类、2B类、3C类
        needNotify: 0,
        notifyContents: '',
        ruleConfigConditionDtoList: [
          // 条件
          {
            classification: null,
            indicatorName: '', // 条件名称
            column: '', // code
            conditionSymbol: '', // 比较符号
            connectSymbol: '', // 连接符号 1(or) 2(and)
            value: '', // 值
          },
        ],
      },
      rules: {
        ruleName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        ruleDescribe: [{ required: true, message: '请输入描述', trigger: 'change' }],
        effectiveScope: [{ required: true, message: '请选择生效范围', trigger: 'change' }],
        classification: [{ required: true, message: '请选择指标分类', trigger: 'change' }],
      },
      options: [
        {
          value: '1',
          label: '男',
        },
        {
          value: '2',
          label: '女',
        },
      ],
      tabList: [
        {
          id: 1,
          name: '生命体征',
        },
        {
          id: 2,
          name: '检查指标',
        },
        {
          id: 3,
          name: '检验指标',
        },
        {
          id: 4,
          name: '体检报告',
        },
      ],
      conditionIndex: 0,
      activeIndex: 1,
      selectIndicatorAttributeList: [],
      newSelectIndicatorAttributeList: [],
      allSelectIndicatorAttributeList: [],
      selectObj: {},
      selectConditionList: [],
      // count: 0,
      indicatorCode: '',
    };
  },
  created() {
    this.getPositiveIndicatorRuleList();
    this.getSelectIndicatorAttributeList();
    // this.getSelectPositiveRuleListCount();
  },
  methods: {
    /**
     * 获取阳性列表总数
     */
    // async getSelectPositiveRuleListCount() {
    //   await this.$apis.getSelectPositiveRuleListCount().then(res => {
    //     this.count = res;
    //   });
    // },
    /**
     * 获取阳性指标条件参数
     */
    getSelectIndicatorAttributeList(classification) {
      this.$apis
        .getSelectIndicatorAttributeList({
          indicatorName: '',
          classification: classification ? classification : null,
        })
        .then((res) => {
          if (!classification) {
            this.allSelectIndicatorAttributeList = res;
          } else {
            this.selectIndicatorAttributeList = res;
            this.newSelectIndicatorAttributeList = res;
          }
        });
    },
    /**
     * 获取阳性指标规则列表
     */
    getPositiveIndicatorRuleList(refresh) {
      if (refresh) {
        this.pageNo = 1;
      }
      this.$apis
        .getPositiveIndicatorRuleList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          ruleName: this.keyword,
        })
        .then((res) => {
          this.total = res.total;
          this.tableData = res.list;
        });
    },
    /**
     * 获取阳性指标规则详情
     */
    getPositiveIndicatorRuleDetail(serialNo) {
      this.$apis
        .getPositiveIndicatorRuleDetail({
          serialNo,
        })
        .then((res) => {
          // 回显数据处理
          res.ruleConfigConditionDtoList.forEach((item, index) => {
            this.selectConditionList[index] = this.allSelectIndicatorAttributeList.filter((items) => {
              return items.indicatorCode == item.column;
            })[0];
          });
          res.effectiveScope = res.effectiveScope.split(',');
          this.ruleForm = res;
          this.dialogVisible = true;
        });
    },
    Search() {
      //  this.getSelectPositiveRuleListCount();
      this.getPositiveIndicatorRuleList(true);
    },
    Add() {
      this.title = '新增阳性指标';
      this.dialogVisible = true;
    },
    /**
     * 删除阳性指标规则
     * @param {object} row
     */
    Delete(row) {
      this.$confirm('是否删除该条阳性规则，删除后，已经过滤的列表不会消失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        customClass: 'positive-indicators',
      })
        .then(() => {
          this.$apis
            .deletePositiveIndicatorRule({
              serialNo: row.serialNo,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              //  this.getSelectPositiveRuleListCount();
              this.getPositiveIndicatorRuleList();
            });
        })
        .catch(() => {});
    },
    /**
     * 编辑阳性指标规则
     * @param {object} row
     */
    Edit(row) {
      this.title = '编辑阳性指标';
      this.getPositiveIndicatorRuleDetail(row.serialNo);
      // this.dialogVisible = true;
      // this.ruleForm = row;
    },
    // 取消新增、编辑阳性指标规则
    handleClose() {
      // 重置数据
      this.ruleForm = this.$options.data.call(this).ruleForm;
      this.activeIndex = 1;
      this.keyword1 = '';
      this.indicatorCode = '';
      // 清除校验
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
      this.dialogVisible = false;
    },
    // 保存新增、编辑阳性指标规则
    Determine() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$apis
            .savePositiveIndicatorRule({
              serialNo: this.ruleForm.serialNo ? this.ruleForm.serialNo : undefined,
              effectiveScope: this.ruleForm.effectiveScope.join(','),
              ruleName: this.ruleForm.ruleName,
              classification: this.ruleForm.classification,
              ruleDescribe: this.ruleForm.ruleDescribe,
              ruleConfigConditionDtoList: this.ruleForm.ruleConfigConditionDtoList,
              needNotify: this.ruleForm.needNotify,
              notifyContents: this.ruleForm.notifyContents,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '操作成功!',
              });
              this.handleClose();
              // this.getSelectPositiveRuleListCount();
              this.getPositiveIndicatorRuleList();
            });
        }
      });
    },
    /**
     * 阳性指标规则条件新增
     */
    Increase() {
      this.ruleForm.ruleConfigConditionDtoList.push({
        classification: null,
        indicatorName: '', // 条件名称
        column: '', // code
        conditionSymbol: '', // 比较符号
        connectSymbol: '', // 连接符号 1(or) 2(and)
        value: '', // 值
      });
    },
    /**
     * 阳性指标规则条件删除
     * @param {number} index 删除索引
     */
    Delete1(index) {
      if (this.ruleForm.ruleConfigConditionDtoList.length == 1) {
        this.$confirm('最后一条数据不允许删除！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'positive-indicators',
        });
      } else {
        // 删除之前先移除该列的校验结果
        // this.$refs.ruleForm.clearValidate([
        //   `ruleConfigConditionDtoList[${index}].column`,
        //   `ruleConfigConditionDtoList[${index}].conditionSymbol`,
        //   `ruleConfigConditionDtoList[${index}].connectSymbol`,
        //   `ruleConfigConditionDtoList[${index}].value`
        // ]);

        // 如何删除的是最后一条数据，需将上上一条的连接符号清空
        // this.$nextTick(() => {
        if (index == this.ruleForm.ruleConfigConditionDtoList.length - 1) {
          this.ruleForm.ruleConfigConditionDtoList[index - 1].connectSymbol = '';
          this.ruleForm.ruleConfigConditionDtoList.splice(index, 1);
        } else {
          this.ruleForm.ruleConfigConditionDtoList.splice(index, 1);
        }
        // });
      }
    },
    // Change(v) {
    //   this.selectConditionList[
    //     this.conditionIndex
    //   ] = this.selectIndicatorAttributeList.filter(item => {
    //     return item.indicatorCode == v;
    //   })[0];
    //   // 清空该条件所有数据
    //   this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].value = "";
    //   this.ruleForm.ruleConfigConditionDtoList[
    //     this.conditionIndex
    //   ].conditionSymbol = "";
    //   this.$nextTick(() => {
    //     this.$refs.ruleForm.clearValidate([
    //       `ruleConfigConditionDtoList[${this.conditionIndex}].value`,
    //       `ruleConfigConditionDtoList[${this.conditionIndex}].conditionSymbol`
    //     ]);
    //   });
    // },
    /**
     * 选中索引
     * @param {number} 索引
     */
    selectIndex(i) {
      this.activeIndex = i;
      this.keyword1 = '';
      this.getSelectIndicatorAttributeList(i);
    },
    /**
     * 选中
     */
    selectOptions(row) {
      // 赋值
      this.selectConditionList[this.conditionIndex] = this.selectIndicatorAttributeList.filter((item) => {
        return item.indicatorCode == row.indicatorCode;
      })[0];
      // 清空该条件所有数据
      this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].value = '';
      this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].conditionSymbol = '';
      this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].indicatorName = row.indicatorName;
      this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].column = row.indicatorCode;
      this.indicatorCode = row.indicatorCode;
      this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex].classification = this.activeIndex;
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate([`ruleConfigConditionDtoList[${this.conditionIndex}].value`, `ruleConfigConditionDtoList[${this.conditionIndex}].conditionSymbol`]);
      });
      // 选中之后手动关闭下拉框
      this.$refs.select[this.conditionIndex].blur();
      // 重置数据
      this.activeIndex = 1;
      this.keyword1 = '';
      this.getSelectIndicatorAttributeList(1);
      // 强制刷新
      this.$forceUpdate();
    },
    Search1() {
      this.newSelectIndicatorAttributeList = this.selectIndicatorAttributeList.filter((item) => item.indicatorName.indexOf(this.keyword1) != -1);
    },
    /**
     *
     * @param {boolean} val 下拉框显示隐藏
     * @param {number} i 索引
     */
    async show(val, i) {
      if (val) {
        this.conditionIndex = i;
        let obj = this.ruleForm.ruleConfigConditionDtoList[this.conditionIndex];
        if (!obj.classification) {
          this.activeIndex = 1;
        } else {
          this.activeIndex = obj.classification;
        }
        await this.getSelectIndicatorAttributeList(this.activeIndex);
        this.indicatorCode = obj.column;
      }
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      // this.getSelectPositiveRuleListCount();
      this.getPositiveIndicatorRuleList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      // this.getSelectPositiveRuleListCount();
      this.getPositiveIndicatorRuleList();
    },
    // 阿拉伯数字转中文
    convertToChineseNumeral(num) {
      if (num == 10) {
        return '十';
      } else if (num == 1) {
        return '一';
      }
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const units = ['', '十', '百', '千', '万'];
      let result = '';
      let numStr = num.toString();
      for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr.charAt(i));
        let unit = units[numStr.length - i - 1];
        if (digit === 0) {
          // 当前数字为0时不需要输出汉字，但需要考虑上一个数字是否为0，避免出现连续的零
          if (result.charAt(result.length - 1) !== '零') {
            result += '零';
          }
        } else {
          result += digits[digit] + unit;
        }
      }
      // 对于一些特殊的数字，如10、100等，需要在最前面加上“一”
      if (result.charAt(0) === '一') {
        result = result.substr(1, result.length);
      } else if (result.charAt(0) === '百') {
        result = '一' + result;
      } else if (result.charAt(0) === '千') {
        result = '一' + result;
      }
      return result;
    },
    // 获取比较符号数组
    getCompareList(v) {
      let arr1 = [
        {
          id: 1,
          name: '等于',
        },
        {
          id: 2,
          name: '不等于',
        },
        {
          id: 3,
          name: '大于',
        },
        {
          id: 4,
          name: '小于',
        },
        {
          id: 5,
          name: '大于等于',
        },
        {
          id: 6,
          name: '小于等于',
        },
        {
          id: 7,
          name: '包含',
        },
        {
          id: 8,
          name: '不包含',
        },
      ];
      let arr2 = v.split(',');
      let arr3 = [];
      arr3 = arr1.filter((i) => {
        return arr2.some((j) => i.id == j);
      });
      if (arr3.length == 0) return null;
      return arr3;
    },
    //
    getName(v) {
      if (v == 1 || v == 3) {
        return '请选择';
      } else {
        return '请输入';
      }
    },
    needNotifyChange(status) {
      // this.ruleForm.notifyContents = ""
    },
    tableNotifyChange(item) {
      let params = {
        needNotify: item.needNotify == 1 ? 0 : 1,
        serialNo: item.serialNo,
      };
      this.$apis.enableNotify(params).then((res) => {
        this.getPositiveIndicatorRuleList(false);
        this.$message({
          type: 'success',
          message: item.needNotify ? '短信推送关闭成功' : '短信推送开启成功',
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.positive-indicators {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 72px;
    padding: 16px 20px;
    background: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search {
      display: flex;
      align-items: center;
      span {
        // width: 50px;
        margin-right: 14px;
      }
      .search-icon {
        cursor: pointer;
        flex-shrink: 0;
        margin-left: 10px;
        width: 48px;
        height: 40px;
        border: 1px solid #d7dae0;
        box-sizing: border-box;
        text-align: center;
        line-height: 40px;
        border-radius: 4px;
      }
      // .search-icon:hover{
      //   background-color: ;
      // }
    }
  }
  .main {
    margin-top: 20px;
    padding: 0 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.2px;
      color: #3d3d3d;
      margin-bottom: 10px;
      span {
        color: #ff7b35;
        margin-left: 10px;
      }
    }
    .none,
    .positive-table {
      flex: 1;
      padding-bottom: 72px;
    }
    .none {
      position: relative;
      .img {
        width: 264px;
        height: 214px;
        text-align: center;
        position: absolute;
        top: 30%;
        left: 0;
        right: 0;
        margin: 0 auto;
        .title {
          font-size: 18px;
          font-weight: normal;
          color: #111;
        }
      }
    }
  }

  .select {
    .main {
      width: 409px;
      height: 204px;
      display: flex;
      flex-direction: row;
      .left {
        width: 148px;
        border-right: 1px solid #e6e6e6;
        .items {
          cursor: pointer;
          width: 100%;
          height: 40px;
          padding-left: 15px;
          line-height: 40px;
        }
        .active {
          background: rgba(102, 102, 102, 0.04);
        }
      }
      .right {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .options {
          flex: 1;
          overflow-y: auto;
        }
        .items {
          cursor: pointer;
          width: 100%;
          height: 40px;
          padding-left: 5px;
          line-height: 40px;
        }
        .active {
          background: rgba(102, 102, 102, 0.04);
        }
      }
    }
  }
  .indicators-dialog {
    .key {
      position: relative;
      font-size: 16px;
      font-weight: normal;
      color: #333333;
      margin-bottom: 28px;
    }
    .key::after {
      position: absolute;
      content: '';
      height: 1px;
      width: 100%;
      background-color: #d7dae0;
      left: 0;
      bottom: -14px;
    }
    .item {
      height: 55px;
      margin-bottom: 10px;
      display: flex;
      .keys {
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.positive-indicators {
  .header {
    .search {
      .el-button--small {
        width: 48px;
        height: 40px !important;
      }
    }
  }
  .el-button--primary {
    padding: 8px 17px !important;
    min-width: 0 !important;
  }
  .dialog-footer {
    padding: 0 !important;
  }
  .none {
    .img {
      .el-button--primary {
        padding: 6px 17px !important;
        margin-left: 10px;
        border: 1px solid #0276d7;
        background: #f5faff;
        color: #0276d7;
        height: 28px;
        padding: none;
      }
    }
  }
  .input {
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .input-with-select {
    .el-input__inner {
      border-color: #d7dae0 !important;
    }
  }
  .input-with-select {
    .el-input__inner:focus {
      border-color: #32ae57 !important;
    }
  }
}
</style>
