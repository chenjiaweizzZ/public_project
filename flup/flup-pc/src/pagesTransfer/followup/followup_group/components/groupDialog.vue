<template>
  <el-dialog :title="this.data ? '修改团队' : '新增团队'" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :close-on-press-esc="false" @close="$emit('update:show', false)">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="团队名称" prop="groupName">
        <el-input class="limiting" v-model="form.groupName" placeholder="组名称" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="所属医院" prop="hospitalId">
        <el-select v-model="form.hospitalId" placeholder="所属医院">
          <el-option :disabled="item.serial_no != $global.hospital_id || form.planCount > 0" v-for="item in $parent.hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" prop="deptId">
        <el-select v-model="form.deptId" value-key="Value" @change="onSelectDept" placeholder="科室" multiple filterable :disabled="form.planCount > 0">
          <el-option v-for="item in $parent.deptOptions" :key="item.serialNo" :value="item.serialNo" :label="item.deptName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队类型" prop="groupType">
        <el-select v-model="form.groupType" placeholder="组类型" :disabled="form.planCount > 0">
          <el-option v-for="item in $parent.groupTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队介绍" prop="groupIntroduce">
        <el-input class="limiting" type="textarea" v-model="form.groupIntroduce" placeholder="团队介绍" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="随访病区编码" prop="wardIds">
        <el-input class="limiting" v-model="form.wardIds" placeholder="随访病区编码" maxlength="30" show-word-limit  :disabled="form.planCount > 0"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input class="limiting" v-model="form.note" placeholder="备注" maxlength="60" show-word-limit  :disabled="form.planCount > 0"></el-input>
      </el-form-item>
      <el-form-item label="团队图片" prop="introduceUrl" class="introduceUrl">
        <el-upload ref="upload" :action="$baseURL.ICDMApiUrl + '/file/upload'" :show-file-list="false" :on-success="
                    (res, file) => handleAvatarSuccess(res, file)
                " :before-upload="beforeAvatarUpload" class="avatar-uploader">
          <img v-if="form.introduceUrl" :src="imageUrl(form.introduceUrl)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">{{
        componentValue == 0 ? "确定" : "提交审核"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "group-dialog",
  props: {
    data: Object,
    show: Boolean,
    componentValue: {
      default: "0",
      type: String,
    },
  },
  watch: {
    show() {
      this.dialogVisible = this.show;
    },
  },
  created() {
    if (this.data) {
      this.form = { ...this.data };
      this.form.deptId = this.form.deptId.split(",");
      this.form.introduceUrl = this.form.introduceUrl.split("/file/image/")[1]
    }
  },
  data() {
    return {
      dialogVisible: this.show,
      form: {
        groupName: "",
        hospitalId: "",
        deptId: [],
        deptName: "",
        groupType: "",
        groupIntroduce: "",
        introduceUrl: "",
        wardIds: "",
        note: "",
        showOnMobile: 0
      },
      rules: {
        groupName: [
          { required: true, message: "请输入组名称", trigger: "blur" },
        ],
        groupIntroduce: [
          { required: true, message: "请输入团队介绍", trigger: "blur" },
        ],
        introduceUrl: [
          { required: true, message: "请上传团队图片", trigger: "blur" },
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
    imageUrl(id) {
      return this.$baseURL.ICDMApiUrl + '/file/image/' + id
      // if(id.includes('/file/image/')) {
      //   return id
      // }else {
      //   return this.$baseURL.ICDMApiUrl + '/file/image/' + id
      // }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form));
          obj.deptId = obj.deptId.join(",");
          this.$apis
            .groupsaveFlupGroup({
              ...obj,
              hospitalId: this.$global.hospital_id,
            })
            .then(() => {
              this.$message.success("成功");
              this.dialogVisible = false;
              this.$parent.onSearch();
            });
        }
      });
    },
    onSelectDept(v) {
      let obj = this.$parent.deptOptions.find((item) => {
        return (item.Value = v);
      });
      this.$parent.deptOptions.forEach((element) => {
        if (element.serialNo == this.form.deptId) {
          this.form.deptName = element.deptName;
        }
      });
      this.form.DEPT_NAME = obj && obj.Text;
    },
    beforeAvatarUpload(file) {
      const imgfileType = [
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/x-png",
        "image/png",
      ];
      const isJPG = imgfileType.includes(file.type);

      if (!isJPG) {
        this.$message.error("请上传图片!");
      }
      return isJPG;
    },
    handleAvatarSuccess(res, file) {
      // console.log(this.$baseURL.ICDMApiUrl + "/file/image/" + res.retData.id);
      // this.form.introduceUrl = this.$baseURL.ICDMApiUrl + "/file/image/" + res.retData.id
      this.form.introduceUrl = res.retData.id
    },
  },
};
</script>

<style lang="scss">
.introduceUrl {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #32ae57;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>


