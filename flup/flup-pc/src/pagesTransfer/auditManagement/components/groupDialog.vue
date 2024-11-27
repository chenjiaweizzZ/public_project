<template>
  <div>
    <el-dialog
      title="健康管理组审核"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
      @close="handClose"
      class="groupDialog"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="组名称" prop="groupName">
          <el-input
            class="limiting"
            v-model="form.groupName"
            placeholder="组名称"
            maxlength="16"
            show-word-limit
            :disabled="isStatus"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalId">
          <el-select
            v-model="form.hospitalId"
            placeholder="所属医院"
            :disabled="isStatus"
          >
            <el-option
              :disabled="item.serial_no != $global.hospital_id"
              v-for="item in hospitalList"
              :key="item.serial_no"
              :value="item.serial_no"
              :label="item.hospital_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="deptId">
          <el-select
            v-model="form.deptId"
            value-key="Value"
            @change="onSelectDept"
            placeholder="科室"
            :disabled="isStatus"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.deptName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组类型" prop="groupType">
          <el-select
            v-model="form.groupType"
            placeholder="组类型"
            :disabled="isStatus"
          >
            <el-option
              v-for="item in groupTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访病区编码" prop="wardIds">
          <el-input
            class="limiting"
            v-model="form.wardIds"
            placeholder="随访病区编码"
            maxlength="30"
            show-word-limit
            :disabled="isStatus"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            class="limiting"
            v-model="form.note"
            placeholder="备注"
            maxlength="60"
            show-word-limit
            :disabled="isStatus"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <template v-if="isAuditing == 0">
          <el-button @click="handClose">取消</el-button>
          <el-button
            type="danger"
            plain
            @click="isrefuse = true"
            style="min-width: 56px"
            >拒绝</el-button
          >
          <el-button  type="success" @click="subAuditing">通过审核</el-button>
        </template>
        <template v-else-if="isAuditing == 1">
          <el-button type="success" @click="handClose">确认</el-button>
        </template>
        <template v-else>
          <el-button @click="handClose">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交审核</el-button>
        </template>
      </span>
    </el-dialog>
    <el-dialog
      title="拒绝理由"
      :visible.sync="isrefuse"
      width="348px"
      :close-on-press-esc="false"
      class="refuse"
      :before-close="handleCloseRefuse">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label-width="0" prop="name" :rules="[{ required: true, message: '请输入拒绝理由', trigger: ['blur', 'change'] },]">
          <el-input class="input" v-if="isrefuse" type="textarea" :rows="2" v-model.trim="ruleForm.name" placeholder="请输入拒绝理由"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCloseRefuse">取 消</el-button>
        <el-button type="primary" @click="subRefuse" style="min-width:60px">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "group-dialog",
  data() {
    return {
      serialNo:'',
      isrefuse:false,
      isStatus: true, //true 详情 false 编辑
      isAuditing:0,//0审核 1不审核 2修改
      dialogVisible: false,
      hospitalList: [],
      deptOptions: [],
      groupTypeList: [
        { label: "随访组", value: 0 },
        { label: "慢病组", value: 1 },
      ],
      form: {
        groupName: "",
        hospitalId: "",
        deptId: "",
        deptName: "",
        groupType: "",
        wardIds: "",
        note: "",
      },
      ruleForm:{
        name:''
      },
      rules: {
        groupName: [
          { required: true, message: "请输入组名称", trigger: "blur" },
        ],
        hospitalId: [
          { required: true, message: "请选择所属医院", trigger: "change" },
        ],
        deptId: [{ required: true, message: "请选择科室", trigger: "change" }],
        groupType: [
          { required: true, message: "请选择组类型", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    init(serialNo, isStatus = true, isAuditing = 0) {
      this.dialogVisible = true;
      this.isStatus = isStatus;
      this.serialNo = serialNo;
      this.isAuditing = isAuditing;
      this.getHospitalList();
      this.getDeptList();
      this.getInfo();
    },
    async getInfo() {
      let res = await this.$apis.getFlupGroup({
        serialNo:this.serialNo,
      });
      this.form = res;
    },
    async getHospitalList() {
      await this.$apis.hospitalgetAllHospitals().then((res) => {
        this.hospitalList = res || [];
      });
    },
    async getDeptList() {
      let res = await this.$apis.departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      });
      this.deptOptions = res || [];
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$apis
            .groupsaveFlupGroup({
              ...this.form,
              hospitalId: this.$global.hospital_id,
            })
            .then(() => {
              this.$message.success("成功");
              this.handClose();
              this.$emit('refurbish');
            });
        }
      });
    },
    onSelectDept(v) {
      let obj = this.deptOptions.find((item) => {
        return (item.Value = v);
      });
      this.deptOptions.forEach((element) => {
        if (element.serialNo == this.form.deptId) {
          this.form.deptName = element.deptName;
        }
      });
      this.form.DEPT_NAME = obj && obj.Text;
    },
    handClose() {
      this.form = this.$options.data().form;
      this.ruleForm.name = "";
      setTimeout(() => {
        this.$refs.form.clearValidate();
        this.dialogVisible = false;
      }, 50);
    },
    handleCloseRefuse(){
      this.ruleForm.name = "";
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();
        this.isrefuse = false;
      }, 50);
    },
    //拒绝
    subRefuse(){
      this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            await this.$apis.authApply({
              authState:2,
              remark:this.ruleForm.name,
              serialNo:this.serialNo,
              type:2,
            })
            this.handleCloseRefuse();
            this.handClose();
            this.$emit('refurbish');
          }
        });
    },
    //审核通过
    subAuditing(){
      this.$confirm('确定要通过审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          await this.$apis.authApply({
            authState:1,
            serialNo:this.serialNo,
            type:2,
          })
          this.handClose();
          this.$emit('refurbish');
        }).catch(() => {       
        });
    }
  },
};
</script>
<style lang="scss">
.groupDialog {
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border: 1px solid #d7dae0;
    color: #111;
  }
}
.refuse{
  .input{
    .el-textarea__inner{
      widows: 300px;
      height: 80px;
      color: #111111;
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>