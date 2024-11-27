<template>
  <div class="healthRecords">
    <el-table
      :data="list"
      border
      class="list"
      row-key="serialNo"
      :expand-row-keys="expands"
      @row-click="rowClick"
      :row-class-name="tableRowClassName"
      ref="tableRef"
    >
      <el-table-column type="expand" width="1">
        <template slot-scope="{ row }">
          <div class="spread">
            <div class="spread-title">
              <div class="spread-title__line"></div>
              <div class="spread-title__text">结案情况</div>
            </div>
            <el-form ref="form" :model="row" label-width="80px">
              <el-form-item label="疾病诊断">
                <el-input v-model="row.clinicalDiagnosis" disabled></el-input>
              </el-form-item>
              <el-form-item label="随访记录">
                <el-table :data="row.takeList" border stripe max-height="300">
                  <el-table-column label="序号" type="index" width="88">
                  </el-table-column>
                  <el-table-column
                  prop="flupType"
                    min-width="120"
                    label="随访类型"
                  ></el-table-column>
                  <el-table-column
                  show-overflow-tooltip
                  prop="flupContent"
                    min-width="150"
                    label="随访内容"
                  ></el-table-column>
                  <el-table-column
                  show-overflow-tooltip
                  prop="fuWay"
                    min-width="100"
                    label="随访方式"
                  >
                  <template slot-scope="user">
                    <span v-if="user.row.fuWay == 0">全院</span>
                    <span v-else-if="user.row.fuWay == 1">专科</span>
                    <span v-else>慢病</span>
                  </template>  
                </el-table-column>
                  <el-table-column
                  prop="flupTimeReal"
                    min-width="160"
                    label="任务完成时间"
                  ></el-table-column>
                  <el-table-column width="120" label="操作" v-if="!userId">
                    <template slot-scope="info">
                      <el-button type="text" @click.stop="viewTask(info.row.serialNo)"
                        >查看</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="复诊情况">
                <el-table :data="row.returnVisitData" border stripe>
                  <el-table-column min-width="120" label="复诊时间">
                    <template slot-scope="scope">
                      <span v-if="!row.isDisabled">{{ scope.row.returnVisitDate }}</span>
                      <el-date-picker
                        v-else
                        v-model="scope.row.returnVisitDate"
                        type="date"
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column min-width="120" label="复诊情况">
                    <template slot-scope="scope">
                      <span v-if="!row.isDisabled">{{ scope.row.returnVisitSituation | handSituation}}</span>
                      <el-radio-group v-else v-model="scope.row.returnVisitSituation">
                        <el-radio label="0">未来院复诊</el-radio>
                        <el-radio label="1">已来院复诊</el-radio>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column min-width="120" label="复诊科室">
                    <template slot-scope="scope">
                      <span v-if="!row.isDisabled">{{ scope.row.returnVisitDepartment | handUnit(departmentsList)}}</span>
                      <el-select
                        v-else
                        v-model="scope.row.returnVisitDepartment"
                        placeholder="请选择"
                      >
                        <el-option v-for="item in departmentsList" :label="item.deptName" :value="item.deptCode" :key="item.deptCode"> </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="120"
                    label="操作"
                    v-if="row.isDisabled"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" @click="addTake(row.returnVisitData,scope.row.id)">添加</el-button>
                      <el-button
                        type="text"
                        v-if="
                          row.returnVisitData &&
                          row.returnVisitData.length > 1
                        "
                        @click="removeTake(row.returnVisitData,scope.row.id)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="结案小结">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  :disabled="!row.isDisabled"
                  maxlength="500"
                  v-model.trim="row.closeSummary"
                >
                </el-input>
              </el-form-item>
              <el-form-item label=" " v-if="row.isDisabled">
                <div class="spread-btns">
                  <div class="spread-btns__item" @click="cancelEmit(row)">取消</div>
                  <div class="spread-btns__item primary" @click="confirm(row)">确认</div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="88"> </el-table-column>
      <el-table-column
        prop="packageName"
        min-width="160"
        label="服务内容名称"
      ></el-table-column>
      <el-table-column
        prop="orderTime"
        width="167"
        label="购买日期"
      ></el-table-column>
      <el-table-column
        prop="orderDoctorName"
        min-width="110"
        label="开单医生"
      ></el-table-column>
      <el-table-column
        prop="orderDeptName"
        min-width="110"
        label="开单科室"
      ></el-table-column>
      <!-- <el-table-column prop="z" min-width="110" label="开单诊疗组"></el-table-column> -->
      <el-table-column
        prop="flupGroup"
        min-width="110"
        label="随访组"
      ></el-table-column>
      <el-table-column width="158" label="知情同意书">
        <template slot-scope="{ row }">
          <div class="list-btns">
            <div @click.stop>
                <el-upload
                ref="upload"
                :action="$baseURL.ICDMApiUrl + '/file/upload'"
                :show-file-list="false"
                :on-success="
                    (res, file) => handleAvatarSuccess(res, file, row.serialNo)
                "
                :before-upload="beforeAvatarUpload"
                class="list-btns__upload"
                >
                <el-button type="text">上传</el-button>
                </el-upload>
            </div>
            <el-button type="text" @click.stop="emitList(row)">编辑</el-button>
            <el-button
              v-if="row.informedConsentUrl"
              type="text"
              @click.stop="previewImage(row.informedConsentUrl)"
              >查看</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-image-viewer
      v-if="imgViewerVisible"
      :url-list="srcList"
      :on-close="closeViewer"
      :z-index="9999"
    />
  </div>
</template>
<script>
import elImageViewer from "element-ui/packages/image/src/image-viewer"; //预览图片组件
export default {
  components: {
    elImageViewer,
  },
  props: {
    userId: {
      type: String,
      default: ""
    }
  },
  filters:{
    handUnit(val,list){
        if(!val){
            return ''
        }
        let info = list.find(item => item.deptCode == val);
        if(info){
            return info.deptName;
        }
        return val;
    },
    handSituation(val){
        if(val == 0){
            return '未来院复诊';
        }else if(val == 1){
            return '已来院复诊' 
        }else{
            return ''
        }
    }
  },
  data() {
    return {
      serialNo:'',//患者id
      expands: [], //需要展开的列表
      list: [],
      imgViewerVisible: false, //预览图片
      srcList: [], //预览地址
      oldInfo:{},//缓存老数据
      departmentsList:[],//科室列表
    };
  },
  watch: {
    userId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.restInfo();
          this.getList();
          this.systemManagequeryCurrentUserDept();
        }
      }
    }
  },
  inject: ['callBack'],
  mounted() {
    this.getList();
    this.systemManagequeryCurrentUserDept();
  },
  methods: {
    restInfo(){
      this.serialNo = '';
      this.expands = [];
      this.list = [];
      this.imgViewerVisible = false;
      this.srcList = [];
      this.oldInfo = {}; 
      this.departmentsList = [];
    },
    async getList() {
      let { list } = await this.$apis.getListEmrHospitalOrder({
        patientId: this.userId || this.$route.query.userId,
        pageNo: 1,
        pageSize: 100000,
        payStatus:1,
      });
      list = list ? list : [];
      // isDisabled   true 编辑 false 详情
      this.list = list.map((item)=>{
        let returnVisitData = [];
        let oldValue = item.returnVisitData ? JSON.parse(item.returnVisitData) : [];
        if(oldValue && oldValue.length > 0){
            returnVisitData = oldValue.map(item => ({...item,id:this.getRandom()}))
        }
        return { ...item, isDisabled: false, returnVisitData}
      });
    },
    async getFollowupPlanByPatientNew(row){
      let list = [];
      if(row.flupPlanId){
        let res =  await this.$apis.getFollowupPlanByPatientNew({
            flupPlanId:row.flupPlanId,
            userId:this.userId || this.$route.query.userId,
            complete:0,
            state:1,
            excludeAuthState:30,
            recordSerialNo:row.recordSerialNo
        })
        list = res && res.length > 0 ? res[0].flupPath : [] ;
      }
      this.$set(row,'takeList',list);
    },
    async systemManagequeryCurrentUserDept(){
        let res =  await this.$apis.departmentquery(
          {
            flupDepartment: 1,
            hospitalId: this.$global.hospital_id,
            pageNo: 1,
            pageSize: 1000,
          }
        );
        this.departmentsList = res.list;
    },
    emitList(row){
        let isStatus = this.list.some(item => item.isDisabled && (item.serialNo != row.serialNo))
        if(isStatus){
            this.$message({
                message: '请保存当前修改后再操作!',
                type: 'warning'
            });
            return false;
        }
        this.$set(row,'isDisabled',true);
        if (!this.expands.includes(row.serialNo)) {
            this.getFollowupPlanByPatientNew(row);
            this.expands.push(row.serialNo);
        }
        this.serialNo = row.serialNo;

        let obj = JSON.parse(JSON.stringify(row));
        this.oldInfo = {
            returnVisitData:obj.returnVisitData,
            closeSummary:obj.closeSummary
        }
        if(!row.returnVisitData.length){
          row.returnVisitData.push(this.addTakeTemplet())
        }
    },
    rowClick(row) {
      if (this.expands.includes(row.serialNo)) {
        if(row.isDisabled){
          this.$message({
            message: '请保存当前修改后再操作!',
            type: 'warning'
          });
          return false;
        }
        this.expands = this.expands.filter((item) => item != row.serialNo);
      } else {
        this.getFollowupPlanByPatientNew(row);
        this.expands.push(row.serialNo);
      }
      this.serialNo = row.serialNo;
    },
    cancelEmit(row){
        this.$set(row,'isDisabled',false);
        this.$set(row,'returnVisitData',this.oldInfo.returnVisitData);
        this.$set(row,'closeSummary',this.oldInfo.closeSummary);
        this.oldInfo = {};
    },
    async confirm(info){
      //剔除多余参数
      let list = info.returnVisitData.map(item =>({
          returnVisitDate:item.returnVisitDate,
          returnVisitSituation:item.returnVisitSituation,
          returnVisitDepartment:item.returnVisitDepartment}));
      //校验
      for(let i = 0; i<list.length;i++){
        if((list[i].returnVisitDate && list[i].returnVisitSituation && list[i].returnVisitDepartment) || (!list[i].returnVisitDate && !list[i].returnVisitSituation && !list[i].returnVisitDepartment)){
          continue
        }
        if(!list[i].returnVisitDate){
          this.$message({
            message: `复诊情况：第${i + 1}行复诊时间不能为空!`,
            type: 'warning'
          });
          return false;
        }
        if(!list[i].returnVisitSituation){
          this.$message({
            message: `复诊情况：第${i + 1}行复诊情况不能为空!`,
            type: 'warning'
          });
          return false;
        }
        if(!list[i].returnVisitDepartment){
          this.$message({
            message: `复诊情况：第${i + 1}行复诊科室不能为空!`,
            type: 'warning'
          });
          return false;
        }
      }
      //剔除空列表
      let newList = list.filter(item => !(!item.returnVisitDate && !item.returnVisitSituation && !item.returnVisitDepartment))
      let closeSummary = info.closeSummary;
      try{
        await this.$apis.updateHospitalOrderInfo({
            platOrderNo: info.serialNo,
            closeSummary,
            returnVisitData: newList
        });
        this.oldInfo = {};
        this.$set(info,'isDisabled',false);
        this.$message({
          message: '修改成功!',
          type: 'success'
        });
        info.returnVisitData = info.returnVisitData.filter(item => !(!item.returnVisitDate && !item.returnVisitSituation && !item.returnVisitDepartment));
      }catch(e){
        console.log(e)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.serialNo === row.serialNo) {
        return 'activeBg'
      }
      return '';
    },
    /*
      关闭预览
    */
    closeViewer() {
      document.body.style.overflow = "";
      this.imgViewerVisible = false;
    },
    previewImage(url) {
      this.srcList = [url];
      this.imgViewerVisible = true;
    },
    handleAvatarSuccess(res, file, serialNo) {
      this.updateImageUrl(
        this.$baseURL.ICDMApiUrl + "/file/image/" + res.retData.id,
        serialNo
      );
    },
    beforeAvatarUpload(file) {
      const imgfileType = ['image/gif','image/jpeg','image/jpg','image/pjpeg','image/x-png','image/png'];
      const isJPG = imgfileType.includes(file.type);

      if (!isJPG) {
        this.$message.error("请上传图片!");
      }
      return isJPG;
    },
    async updateImageUrl(url, serialNo) {
      let info = this.list.find((item) => item.serialNo == serialNo);
      try {
        await this.$apis.updateHospitalOrderInfo({
          platOrderNo: info.serialNo,
          informedConsentUrl: url,
        });
        if (info) {
          this.$set(info, "informedConsentUrl", url);
        }
        this.$message({
          message: "图片上传成功!",
          type: "success",
        });
      } catch (e) {
        console.log("上传失败");
      }
    },
    addTake(list,id){
        let idx = list.findIndex(item => item.id == id);
        list.splice(idx+1,0,this.addTakeTemplet());
    },
    removeTake(list,id){
        let idx = list.findIndex(item => item.id == id);
        list.splice(idx,1);
    },
    addTakeTemplet(){
        return {
                id:this.getRandom(),
                returnVisitDate:null,//日期
                returnVisitSituation:null,//情况
                returnVisitDepartment:'',//科室
            }
    },
    getRandom(){
        return Math.floor(Math.random()*1000000);
    },
    viewTask(val){
      this.callBack('viewPatientPlan',val)
    }
  },
};
</script>
<style lang="scss">
.healthRecords {
  .list {
    &-btns {
      .el-upload {
        background-color: inherit;
      }
    }
    .el-table__expand-icon {
      display: none !important;
    }
    .el-table__expanded-cell {
      padding: 25px 20px 30px 20px;
    }
    .spread {
      .el-input.is-disabled .el-input__inner {
        color: #111;
      }
      .el-textarea.is-disabled .el-textarea__inner {
        color: #111;
      }
      .el-input__inner,
      .el-textarea {
        font-size: 14px;
      }
    }
    tbody tr:hover > td {
      background-color: transparent !important;
    }
    .el-table__body tr.current-row > td.el-table__cell {
      background-color: #ecf5ff !important;
    }
  }
  .activeBg{
    background-color: #F3FAF5;
  }
}
</style>
<style lang="scss" scoped>
.healthRecords {
  .list {
    &-btns {
      display: flex;
      align-content: center;
      &__upload {
        margin-right: 10px;
      }
    }
    .spread {
      &-title {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &__line {
          width: 3px;
          height: 16px;
          border-radius: 2px;
          background-color: #32ae57;
          margin-right: 8px;
        }
        &__text {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.2px;
          color: #333333;
        }
      }
      &-btns {
        display: flex;
        align-items: center;
        &__item {
          width: 60px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-sizing: border-box;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 12px;
          color: #666666;
          cursor: pointer;
          &:active {
            opacity: 0.8;
          }
        }
        .spread-btns__item + .spread-btns__item {
          margin-left: 10px;
        }
        .primary {
          background-color: #32ae57;
          color: #ffffff;
          border-color: #32ae57;
        }
      }
    }
  }
}
</style>