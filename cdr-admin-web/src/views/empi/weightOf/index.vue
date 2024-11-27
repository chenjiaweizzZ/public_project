<!-- 权重设置 -->
<template>
  <div class="weightOf-wrapper">
    <span class="page-title">权重范围配置</span>
    <div class="btn-wrapper">
      <el-button type="success" plain size="mini" @click="addWeightOf">新增</el-button>
      <el-button   size="mini" @click="saveWeightOf">保存</el-button>
    </div>
    <div class="slider-wrapper">
       <div class="block">
          <span class="demonstration">不同患者</span>
          <el-slider v-model="slidervalue" tooltip-class="tooltipClass"  ref="slider" :format-tooltip="formatTooltip"></el-slider>
          <span class="demonstration">同一患者</span>
        </div>
    </div>
    <div class="table-wrapper">
      <el-table :data="weightOfList" border :row-class-name="rowClassName">
        <el-table-column label="操作" width="70">
          <div slot-scope="scope" class="table-row-opr-wrapper">
            <el-button type="text">
              <el-tooltip content="编辑" placement="top">
                <img src="~@/assets/images/edit.svg" width="100%" height="100%" alt=""  @click="editRow(scope.row)"/>
              </el-tooltip>
            </el-button>
            <el-button type="text" >
              <el-tooltip content="删除" placement="top">
                <img src="~@/assets/images/delete.svg" width="100%" height="100%" alt="" @click="deleteRow(scope.row)"/>
              </el-tooltip>
            </el-button>
          </div>
        </el-table-column>
       <el-table-column prop="field" label="序号" width="200"  type="index" show-overflow-tooltip>
         <!-- <template slot-scope="scoped">{{index+1}}</template> -->
       </el-table-column>
       <el-table-column prop="name" label="字段名"  show-overflow-tooltip></el-table-column>
       <el-table-column prop="weight"  show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            {{label}}
          </template>
       </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="Visible" width="367px">
      <el-form :rules="weightFormRule" :model="weightForm" ref="weightForm">
        <el-form-item label="字段名" label-width="70px" prop="weightValue">
            <el-select placeholder="请选择" v-model="weightForm.weightValue" value-key="field"filterable clearable>
               <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item"
                  :disabled="item.disabled">
                </el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="权重" label-width="70px" prop="weight">
            <el-input-number v-model="weightForm.weight" @change="handleChange" :min="1" :max="100" label="描述文字" :precision="0"></el-input-number>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="addItem">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog  :title="dialogTitle" :visible.sync="comfirmVisible" width="300px">
      <span class="comfirmTips">
        是否确认修改? 新的权重设置对原有数据不作变动，仅对新的数据生效。
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="comfirmVisible = false" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="comfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as _api from "@/service/empi";
import { saveMergeConfig } from "@/service/empi";
export default {
  name: "empiWeightOf",
  components: {},
  data() {
    return {
      slidervalue: 0,
      weightOfList: [],
      dialogTitle: "新增",
      Visible: false,
      weightForm: {
        weight: 5,
        weightValue: "" //新增或编辑权重名称
      },
      options: [], //权重字段列表
      weightFormRule: {
        weightValue: [{ required: true, message: "请选择字段名", trigger: "change" }],
        weight: [{ required: true, message: "请选择权重" }]
      },
      comfirmVisible: false,
      label:'权重'
    };
  },
  created() {},
  watch:{
    slidervalue:function(newVal){
      if(newVal){
        this.$nextTick(()=>{
          this.$refs.slider.setPosition(Number(this.slidervalue) )
          
        })  
        return this.slidervalue + '%'
      }
    },
    weightOfList:function(newVal){
      if(newVal){
        this.selectOPtion()
        this.countNum(newVal)
      }
    }
  },
  activated(){
    this.getMergeConfig();
    this.getMergeField();
  },
  methods: {
    /*本地方法*/
    //新增权重
    addWeightOf() {
      if (this.$refs["weightForm"]) {
        this.$refs["weightForm"].resetFields();
      }
      this.selectOPtion()
      this.dialogTitle = "新增";
      this.Visible = true;
      
    },
    saveWeightOf() {
      this.saveConfig();
    },
    rowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    editRow(row) {
      this.weightForm = {
        weightValue: {
          field: row.field,
          name: row.name
        },
        weight: row.weight,
        index:row.index
      };
      this.dialogTitle = "编辑";
      this.Visible = true;
    },
    deleteRow(row) {
      this.weightOfList.splice(row.index,1)
    },
    handleChange() {},
    fmObjToArr(data) {
      let arr = [];
      for (let key in data) {
        arr.push({
          field: key, // label 字段
          name: data[key] // value字段
        });
      }
      return arr;
    },
    addItem() {
      this.$refs["weightForm"].validate(valid => {
        if (valid) {
          let weightValue = Object.assign(
            {},
            {
              weight: this.weightForm.weight,
              field: this.weightForm.weightValue.field,
              name: this.weightForm.weightValue.name,
            }
          );
          if(this.dialogTitle=='新增'){
            this.weightOfList.push(weightValue);
            
             this.$message({ message: "新增成功", type: "success" });
          }else{
            this.$set(this.weightOfList,this.weightForm.index,weightValue); 
            this.$message({ message: "修改成功", type: "success" });
          }
          this.countNum(this.weightOfList)
          this.Visible = false;
        }
      });
    },
    //字段名筛选
    selectOPtion(){
      let options=JSON.parse(JSON.stringify(this.options))
        options.filter((m,index,self)=>{
          m.disabled=false
          let selectitem=this.weightOfList.find(n=>{
            return m.field==n.field
          })
          if(selectitem){
            // options.splice(index,1)
            m.disabled=true
          }
          return m
        })
        this.options=options
    },
    formatTooltip(val){
      this.$nextTick(()=>{
        this.$refs.slider.setPosition(Number(this.slidervalue) )
        
      })  
      return this.slidervalue + '%'
    },
    countNum(List){
      let totalNum = 0;
      List.map(m => {
        totalNum = totalNum + m.weight;
      });
      this.label='权重（合计'+totalNum+'%）'
      return totalNum
    },
    /**接口方法 */
    getMergeConfig() {
      _api.getMergeConfig().then(res => {
        this.weightOfList = res.configJson;
        this.slidervalue = res.threshold;
        this.countNum(this.weightOfList)
      });
    },
    getMergeField() {
      _api.getMergeField().then(res => {
        let List = res;
        this.options = this.fmObjToArr(List);
      });
    },
    saveConfig() {
      var totalNum = 0;
      totalNum=this.countNum(this.weightOfList)
      if (totalNum < 100) {
        this.$message({ message: "权重总和小于100%，请重新调整权重", type: "error" });
      } else if (totalNum > 100) {
        this.$message({ message: "权重总和已超过100%，请重新调整权重", type: "error" });
      } else {
        this.comfirmVisible=true
        this.dialogTitle='提示'
        
      }
    },
    comfirm(){
      let data = {
          configJson: this.weightOfList,
          threshold: this.slidervalue
        };
        saveMergeConfig(data).then(res => {
          this.comfirmVisible=false
          this.countNum(this.weightOfList)
          this.$message({ message: res, type: "success" });
        });
    }
  }
  
};
</script>
<style lang='scss' scoped>
.weightOf-wrapper {
  margin: 10px;
  padding: 10px;
  background: #fff;
  height: calc(100% - 40px);
  .page-title {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    color: #111111;
    position: relative;
    padding-left: 9px;
    &::before {
      position: absolute;
      content: "";
      height: 17px;
      width: 4px;
      left: 0;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      background-color: #0075ff;
    }
  }
  .btn-wrapper {
    .el-button {
      margin: 10px 10px 10px 0;
      padding: 1px 15px !important;
      background-color: #fff;
      border: 1px solid #0075ff;
      &:nth-child(2) {
        color: #0075ff;
      }
    }
  }
}
</style>
<style lang='scss'>
.weightOf-wrapper {
  .table-wrapper {
    margin-top: 10px;
    .el-table {
      background: #fbfbfb;
      th.el-table__cell > .cell {
        color: #666666;
        text-align: center;
      }
      .el-table__cell {
        height: 28px !important;
        .el-button {
          padding: 0px;
        }
        &:first-child .cell {
          padding-left: 0px;
          .table-row-opr-wrapper {
            display: flex;
            align-items: center;
          }
        }
      }
      .el-table__row:nth-child(2n-1) {
        background: #fbfbfb !important;
      }
      .el-table__row:nth-child(2n) {
        background: #fff;
      }
    }
  }
  .slider-wrapper {
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 55px 20px 20px 20px;
    .block {
      display: flex;
      align-items: center;
      .demonstration {
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: #000000;
      }
      .el-slider {
        width: 600px;
        display: inline-block;
        margin: 0 22px;
        .el-slider__runway {
          .el-slider__bar {
            background-color: #0075ff;
            background: #32ae57;
            height: 8px;
          }
          .el-slider__button {
            border: solid 1px #32ae57;
            width: 14px;
            height: 14px;
            &:hover {
              transform: scale(1);
            }
          }
        }
      }
      .tooltipClass {
        height: 29px;
        width: 35px;
      }
    }
  }
  .el-dialog {
    .el-dialog__header {
      padding: 20px 24px;
    }
    .el-dialog__body {
      padding: 0 24px;
    }
    .el-dialog__footer {
      padding-top: 0;
    }
    .el-dialog__title {
      padding-left: 9px;
      &::before {
        content: "";
        position: absolute;
        top: 24px;
        bottom: 0;
        width: 4px;
        height: 17px;
        left: 24px;
        background: #0075ff;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-form-item__label,
    .el-form-item__content {
      line-height: 28px;
      color: #475e79;
    }
    .el-input:first-child {
      width: 263px;
      .el-icon-arrow-up:before,.el-icon-circle-close:before{
        position: relative;
        top:-5px;
      }
    }
    .el-input-number {
      width: 142px;
      line-height: 26px;
    }
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 36px;
    }
    .comfirmTips{
      font-size: 14px;
      line-height: 22px;
      color: #111111;
    }
  }
}
</style>
