//知识库
<template>
  <div class="container VKnowledge">
    <div class="queryConditionsBox">
      <!-- <el-button style="margin-left: 20px;" type="primary" @click="xz" plain>新增</el-button> -->
      <div class="queryConditions">
        <p>所属医院</p>
        <el-select v-model="queryDto.hospitalId" @change="cax">
          <el-option v-for="item in hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name" :disabled="item.serial_no!==$global.hospital_id"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <div class="flex">
          <el-select class="margin-left10 width110px select-time-key" v-model="queryDto.timeKey">
            <el-option v-for="item in timeKeyList" :key="item.key" :value="item.key" :label="item.value"></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="searchTimeVal"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <!-- <el-input
          class="margin-left10 width200px limiting"
          style="margin-right: 10px"
          v-model="queryDto.searchValue"
          maxlength="20"
          show-word-limit
        >-->
        <el-select class="margin-left10 width110px select-time-key" v-model="queryDto.searchKey" slot="prepend" @change="changeSearch">
          <el-option v-for="item in searchKeyList" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
        <el-select class="select-time-val" style="margin-left:-5px" v-model="queryDto.searchValue" placeholder="请选择" clearable @change="cax">
          <div v-if="queryDto.searchKey=='knowledgeType'">
            <el-option v-for="item in typeList " :key="item.serial_no" :label="item.dict_name" :value="item.serial_no"></el-option>
          </div>
          <div v-else-if="queryDto.searchKey=='knowledgeTag'">
            <el-option v-for="item in labelList " :key="item.dict_code" :label="item.dict_name" :value="item.dict_code"></el-option>
          </div>
        </el-select>
        <!-- </el-input> -->
      </div>
      <div class="queryConditions">
        <p>搜索</p>
        <el-input placeholder="请输入知识库名称查询" v-model="queryDto.keyword" class="input-with-select limiting" maxlength="20" show-word-limit>
          <el-button slot="append" icon="el-icon-search" @click="cax"></el-button>
        </el-input>
      </div>
      <div class="queryConditions">
        <p>归属</p>
        <el-select clearable class="width120px" v-model="queryDto.deptId" slot="prepend">
          <div v-for="item in belongList " :key="item.serialNo">
            <el-option v-if="item.beLong ==1" :label="item.deptName" :value="item.deptCode"></el-option>
            <el-option v-else-if="item.beLong ==0" :label="item.deptName" :value="item.serialNo"></el-option>
            <el-option v-else-if="item.beLong ==2" :label="item.deptName" :value="item.beLong"></el-option>
            <el-option v-else-if="!item.beLong" :label="item.deptName" :value="item.deptCode"></el-option>
          </div>
        </el-select>
      </div>
      <div class="butBox">
        <el-button v-if="knowledgeConfig==1" type="primary" @click="xz" plain>新增</el-button>
        <!-- <el-button type="primary" plain>新增专科模板</el-button>
        <el-button type="primary" plain>新增问卷</el-button>
        <el-button @click="downloadTemplate" plain>导入模板下载</el-button>
        <el-button @click="download=true" plain>导入模板下载</el-button>-->

        <!-- <el-upload
          style="float: right; margin-left:20px"
          ref="upload"
          :headers="{ token: token }"
          :action="$baseURL.ICDMApiUrl + '/b/FlupKnowledge/ImportKnowledge'"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="false"
        >
          <el-button type="info" plain>导入</el-button> 
        </el-upload>-->
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="knowledgeName" label="名称"></el-table-column>
      <el-table-column prop="knowledgeType" label="类型"></el-table-column>
      <el-table-column prop="deptId" label="归属" :formatter="formatBelong"></el-table-column>
      <el-table-column prop="fluptypes" label="标签" :formatter="formatTypes"></el-table-column>
      <el-table-column prop="createUser" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateUser" label="更新人"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column v-if="knowledgeConfig==1" prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="xg(scope.row)">预览</el-button> -->
          <el-button type="text" size="small" @click="xg(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deletes(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
      :page-size="queryDto.pageSize"
      :current-page="queryDto.pageNo"
    ></el-pagination>
    <el-dialog :title="title" :visible.sync="tufa" width="70%" :close-on-click-modal="false" :close-on-press-escape="false" modal-append-to-body>
      <el-form :model="VKnowledge" :rules="rules" ref="VKnowledge" label-width="120px" class="demo-ruleForm">
        <el-form-item label="封面" label-width="110px" prop="previewUrl">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            action
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
          >
            <img v-if="VKnowledge.iconUrl" :src="VKnowledge.iconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">支持JPEG，PNG，JPG格式。建议大小750*320</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" prop="knowledgeName">
          <el-input style="width:50%" v-model="VKnowledge.knowledgeName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="knowledgeTypeCode">
          <el-select style="width:50%;display: inline-block;" v-model="VKnowledge.knowledgeTypeCode" placeholder="请选择">
            <el-option v-for="item in typeList " :key="item.serial_no" :label="item.dict_name" :value="item.serial_no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属" prop="deptId">
          <el-select style="width:50%;display: inline-block;" v-model="VKnowledge.deptId" placeholder="请选择">
            <div v-for="item in belongList " :key="item.serialNo">
              <el-option v-if="item.beLong ==1" :label="item.deptName" :value="item.deptCode"></el-option>
              <el-option v-else-if="item.beLong ==0" :label="item.deptName" :value="item.serialNo"></el-option>
              <el-option v-else-if="item.beLong ==2" :label="item.deptName" :value="2"></el-option>
              <el-option v-else-if="!item.beLong" :label="item.deptName" :value="item.deptCode"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="所属医院" prop="hospitalId">
          <el-select disabled style="width:50%;display: inline-block;" v-model="queryDto.hospitalId">
            <el-option v-for="item in hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="fluptypes">
          <el-select multiple style="width:50%;display: inline-block;" v-model="VKnowledge.fluptypes" placeholder="请选择">
            <el-option v-for="item in labelList " :key="item.dict_code" :label="item.dict_name" :value="item.dict_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="fluptypes">
          <el-input style="width:50%" v-model="VKnowledge.knowledgeDiscription" maxlength="200" show-word-limit type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="knowledgeContentHtml">
          <!-- <el-button style="float: right;">导 入</el-button> -->
          <QuillEditor v-model="VKnowledge.knowledgeContentHtml"></QuillEditor>
        </el-form-item>
        <!-- <el-form-item> -->
        <!-- </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tufa = false">取 消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="bc">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增标签" :visible.sync="xzbqpd" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="90px" class="demo-ruleForm">
        <el-form-item label="标签名称" prop="name">
          <el-input
            class="limiting"
            v-model="form.name"
            onkeydown="this.value=this.value.replace(/\s+/g,'')"
            onkeyup="this.value=this.value.replace(/\s+/g,'')"
            onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s+/g,''))"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="bqlist" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="知识库标签名称"></el-table-column>
        <el-table-column prop="address" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="bqsc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[10]"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        background
        layout="total,sizes,prev, pager, next"
        :page-size="pageSize"
        :current-page="pageNo"
        :total="total1"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xzbqpd = false">取 消</el-button>
        <el-button type="primary" @click="bqtj">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入模板下载" :visible.sync="download" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="template" :rules="{templateName:[{ required: true, message: '请选择下载模板', trigger: 'blur' }]}" ref="template" label-width="120px" class="demo-ruleForm">
        <el-form-item label="名称" prop="templateName">
          <el-checkbox-group v-model="template.templateName">
            <el-checkbox v-for="item in typeList" :key="item.serial_no" :value="item.serial_no" :label="item.dict_name" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tufa = false">取 消</el-button>
        <el-button type="primary" :disabled="checkBtn" @click="downloadTemplate">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QuillEditor from '@/components/quill_editor';
export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      bqlist: [],
      form: {
        name: null,
      },
      xzbqpd: false,
      deptlist: [],
      title: '新增',
      tufa: false,
      checkBtn: false,
      hospitalId: null,
      name: '',
      tableData: [],
      total: null,
      total1: 0,
      pageNo: 1,
      pageSize: 10,
      queryDto: {
        pageNo: 1,
        pageSize: 10,
        sorted: 'desc', //倒序 asc正序
        keyword: null,
        hospitalId: 'null',
        timeKey: '1',

        searchKey: 'knowledgeType',
        searchValue: '',
      },
      searchTimeVal: [],
      timeKeyList: [
        { key: '1', value: '创建时间' },
        { key: '2', value: '更新时间' },
      ],
      searchKeyList: [
        { key: 'knowledgeType', value: '类型' },
        { key: 'knowledgeTag', value: '标签' },
      ],
      belongList: [],
      VKnowledge: {
        belong: '',
        deptId: '',
        fluptypes: null,
        knowledgeContent: null,
        knowledgeName: null,
        knowledgeType: '',
        knowledgeTypeCode: '',
        serialNo: null,
        knowledgeContentHtml: '',
        isDelete: 0,
        iconUrl: '',
        knowledgeDiscription: '',
      },
      rules: {
        knowledgeName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        knowledgeTypeCode: [{ required: true, message: '请选择知识库类型', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择知识库归属', trigger: 'change' }],
        knowledgeContent: [{ required: true, message: '请输入知识库内容', trigger: 'blur' }],
        templateName: [{ required: true, message: '请选择下载模板', trigger: 'change' }],
        knowledgeContentHtml: [{ required: true, message: '请输入知识库内容', trigger: 'change' }],
      },

      knowledgeConfig: 0,
      token: this.$cookie.get('token'),
      bqAllList: [],
      hospitalList: [],
      typeList: [],
      labelList: [],
      html: '',
      download: false,
      template: { templateName: [] },
    };
  },
  created() {
    this.$apis.hospitalGetHospitalList({ pageIndex: 1, pageSize: 100 }).then((res) => {
      this.hospitalList = res.list;
    });
    //获取知识库类型
    this.$apis.BaseDictGetDictItems({ parentId: '20210414154335152xx8' }).then((res) => {
      this.typeList = res;
    });
    //获取知识库类型
    this.$apis.BaseDictGetDictItems({ parentId: '202105141723161928q6' }).then((res) => {
      this.labelList = res;
    });

    // this.$apis.queryCurrentUserBelong().then((res) => {
    //   this.belongList = res;
    // });
    ///原权限内科室换为所有随访科室
    this.$apis
      .departmentquery({
        flupDepartment: 1,
        hospitalId: this.$global.hospital_id,
        pageNo: 1,
        pageSize: 1000,
      })
      .then((res) => {
        this.belongList = res.list;
      });

    //知识库配置
    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id, //'1118042319371398510'
        moduleCode: 'followUpSetting',
        componentKey: 'RightConfig',
      })
      .then((res) => {
        if (res) {
          this.knowledgeConfig = res.componentValue;
        }
      });
  },
  watch: {},
  mounted() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    this.queryDto.hospitalId = this.hospitalId;
    this.getFlupKnowledgeGetKnowledgeRecord();
    this.getFlupKnowledgeGetKnowledgeMarkRecord();
    this.getAllList();
  },
  methods: {
    getAllList() {
      this.$apis
        .FlupKnowledgeGetKnowledgeMarkRecord({
          pageNo: 1,
          pageSize: 2147483647,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.bqAllList = res.list;
        });
    },
    deletes(row) {
      this.$confirm('确认删除' + row.knowledgeName + '？')
        .then((_) => {
          this.$apis
            .FlupKnowledgeDelKnowledge({
              serialNo: row.serialNo,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                });
                if (this.tableData.length == 1 && this.queryDto.pageNo != 1) {
                  this.queryDto.pageNo = this.queryDto.pageNo - 1;
                }
                this.getFlupKnowledgeGetKnowledgeRecord();
              }
            });
        })
        .catch((_) => {});
    },
    bqsc(row) {
      this.$apis.FlupKnowledgeDelKnowledgeMarkByName({ name: row.name }).then((res) => {
        if (res) {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          if (this.bqlist.length == 1) {
            this.pageNo = this.pageNo - 1;
          }
          this.getFlupKnowledgeGetKnowledgeMarkRecord();
        }
      });
    },
    getFlupKnowledgeGetKnowledgeMarkRecord() {
      this.$apis
        .FlupKnowledgeGetKnowledgeMarkRecord({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.bqlist = res.list;
          this.total1 = res.total;
        });
    },
    bqtj() {
      if (this.form.name != null && this.form.name != ' ' && this.form.name != '' && this.form.name) {
        this.$apis
          .FlupKnowledgeAddKnowledgeMark({
            hospitalId: this.hospitalId,
            name: this.form.name,
          })
          .then((res) => {
            if (res) {
              this.form.name = null;
              this.$message({
                message: '添加成功',
                type: 'success',
              });
              this.getFlupKnowledgeGetKnowledgeMarkRecord();
              this.getAllList();
            }
          });
      } else {
        this.$message({
          showClose: true,
          message: '标签不可为空',
          type: 'warning',
        });
      }
    },
    xzbq() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields();
      }

      this.xzbqpd = true;
    },
    xz() {
      if (this.$refs['VKnowledge']) {
        this.$refs['VKnowledge'].resetFields();
      }

      this.VKnowledge.serialNo = null;
      this.VKnowledge.knowledgeContent = null;
      this.VKnowledge.knowledgeName = null;
      this.VKnowledge.knowledgeTypeCode = null;
      this.VKnowledge.deptId = null;
      this.VKnowledge.hospitalId = null;
      this.VKnowledge.knowledgeContentHtml = null;
      this.VKnowledge.fluptypes = [];
      this.VKnowledge.iconUrl = '';
      this.VKnowledge.knowledgeDiscription = '';
      this.tufa = true;
      this.title = '新增';
    },
    bc() {
      this.$refs['VKnowledge'].validate((valid) => {
        if (valid) {
          let sendKnowledge = JSON.parse(JSON.stringify(this.VKnowledge));
          this.checkBtn = true;
          if (sendKnowledge.fluptypes) {
            sendKnowledge.fluptypes = this.VKnowledge.fluptypes.join(',');
          }
          sendKnowledge.knowledgeType = this.typeList.find((x) => x.serial_no == sendKnowledge.knowledgeTypeCode).dict_name;

          this.$apis
            .FlupKnowledgeSubmitAddKnowledge({
              ...sendKnowledge,
              hospitalId: this.hospitalId,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                });
                this.tufa = false;
                this.getFlupKnowledgeGetKnowledgeRecord();
              }
            });
        } else {
          this.checkBtn = falses;
          return false;
        }
        let _this = this;
        setTimeout(function () {
          _this.checkBtn = false;
        }, 2000);
      });
    },
    xg(row) {
      if (this.$refs['VKnowledge']) {
        this.$refs['VKnowledge'].resetFields();
      }

      this.$apis.GetKnowledgeContent({ serialNo: row.serialNo }).then((res) => {
        this.VKnowledge.knowledgeContentHtml = res.knowledgeContentHtml;
        this.tufa = true;
      });
      this.VKnowledge.serialNo = row.serialNo;
      this.VKnowledge.knowledgeContent = row.knowledgeContent;
      this.VKnowledge.knowledgeName = row.knowledgeName;
      this.VKnowledge.knowledgeTypeCode = row.knowledgeTypeCode;
      this.VKnowledge.deptId = row.belong === 2 ? 2 : row.deptId;
      this.VKnowledge.hospitalId = row.hospitalId;
      this.VKnowledge.fluptypes = [];
      this.VKnowledge.iconUrl = row.iconUrl;
      this.VKnowledge.knowledgeDiscription = row.knowledgeDiscription;
      if (row.fluptypes) {
        this.VKnowledge.fluptypes = row.fluptypes.split(',');
      }
      this.title = '编辑';
    },
    cax() {
      this.queryDto.pageNo = 1;
      this.getFlupKnowledgeGetKnowledgeRecord();
    },
    getFlupKnowledgeGetKnowledgeRecord() {
      if (this.searchTimeVal != null && this.searchTimeVal.length > 1) {
        this.queryDto.startTime = this.searchTimeVal[0];
        this.queryDto.endTime = this.searchTimeVal[1];
      } else {
        this.queryDto.startTime = '';
        this.queryDto.endTime = '';
      }
      this.$apis.FlupKnowledgeGetKnowledgeRecord(this.queryDto).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
      });
    },
    handleSizeChange(val) {
      this.queryDto.pageSize = val;
      this.queryDto.pageNo = 1;
      this.getFlupKnowledgeGetKnowledgeRecord();
    },
    handleCurrentChange(val) {
      this.queryDto.pageNo = val;
      this.getFlupKnowledgeGetKnowledgeRecord();
    },
    handleSizeChange1(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getFlupKnowledgeGetKnowledgeMarkRecord();
    },
    handleCurrentChange1(val) {
      this.pageNo = val;
      this.getFlupKnowledgeGetKnowledgeMarkRecord();
    },
    downloadTemplate() {
      let a = this.$refs['template'];

      this.$refs['template'].validate((valid) => {
        // let host = this.$baseURL.ICDMApiUrl
        // location.href = host + '/templates/knowledge_record.xlsx'
      });
    },
    onSuccess(response) {
      if (response.retCode === 0) {
        this.$notify({
          title: '导入完成',
          message: '导入' + response.retData.rowCount + '条数据！' + response.retData.errMessage,
          duration: 0,
        });
        this.cax();
      } else {
        this.$notify({
          title: '导入失败',
          message: response.retData ? response.retData.errMessage : '',
          type: 'error',
          duration: 0,
        });
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '导入失败',
      });
    },
    formatBelong(row) {
      if (row.belong == 0) {
        return '全院';
      } else if (row.belong == 2) {
        return '个人';
      } else {
        // let belong = this.belongList.find((x) => x.deptCode == row.deptId)
        // return belong == null ? '' : belong.deptName
        return row.deptName;
      }
    },
    formatTypes(row) {
      let types = this.labelList.filter((x) => row.fluptypes.split(',').includes(x.dict_code));
      return types.map((x) => x.dict_name).join(',');
    },
    changeSearch() {
      this.queryDto.searchValue = '';
    },
    beforeUpload(file) {
      let fileMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (fileMsg == 'JPEG' || fileMsg == 'JPG' || fileMsg == 'PNG' || fileMsg == 'jpeg' || fileMsg == 'jpg' || fileMsg == 'png') {
        return true;
      } else {
        this.$message.error('请上传JPEG，JPG，PNG类型文件!');
        return false;
      }
    },
    handleAvatarSuccess(res, file) {
      this.VKnowledge.iconUrl = URL.createObjectURL(file.raw);
    },
    httpRequest(v) {
      console.log(v, 'ssssssssssssssssssss');
      const formDataFile = new FormData();
      formDataFile.append('file', v.file);
      this.$apis
        .upload(formDataFile)
        .then((res) => {
          this.VKnowledge.iconUrl = this.$baseURL.ICDMApiUrl + '/file/image/' + res.id;
        })
        .catch(() => {
          this.$refs.upload && this.$refs.upload.clearFiles();
        });
    },
  },
};
</script>

<style style lang="scss"  scoped>
.container {
  .indicatorbox {
    border-top: 1px solid #d7dae0;
  }
  // .select-time-val {
  //   border-top-left-radius: 0;
  //   border-bottom-left-radius: 0;
  // }
}
</style>
<style lang="scss">
.VKnowledge {
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
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
}
</style>