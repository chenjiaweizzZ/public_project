<template>
  <div class="wapper">
    <div class="tools graduationTools">
      <div class="funcTools">
        <el-button type="primary" @click="add()">新增</el-button>
        <el-button type="primary" @click="dialogTableVisible=true">批量导入</el-button>
        <el-button type="primary" @click="batchdelete()">批量删除</el-button>
      </div>
      <div class="graduationSearch" style="float: right">
        <el-input type="text" placeholder="请输入姓名或学号搜索" v-model="queryForm.usersearchinfo"></el-input>
        <el-button type="primary" @click="queryStd" @keyup.enter.native="queryStd">查询</el-button>
      </div>
    </div>
    <!--批量导入-->
    <el-dialog title="批量导入" :visible.sync="dialogTableVisible">
      <div class="import-popup">
        <div>
          <span class="tip-circle">1</span>
          <span>下载出科考试成绩模板，批量填写出科考试成绩信息</span>
          <span>
            <el-button type="primary" class="import-popup-btn" @click="downloadModel" size="small">下载</el-button>
          </span>
        </div>
        <div>
          <div>
            <span class="tip-circle">2</span><span>上传填写好的出科考试成绩表</span>
          </div>
          <div>
            <el-upload style="display:inline-block;margin:10px 0px" action="/import/importExcel" ref="upload" :file-list="fileList" :data="uploadData"
              :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile" :on-success="uploadSuccess"
              :on-progress="onProgress">
              <el-button type="primary" size="small">选择文件</el-button>
            </el-upload>
          </div>
        </div>
        <div style="margin:10px auto;width:60px">
          <el-button type="primary" @click="submitUpload">上传</el-button>
        </div>
      </div>
    </el-dialog>
    <div class="queryTools graduationQueryTools">

      <div class="queryAll">
        <!--查询-->
        <el-button type="text" @click="queryAll">全部</el-button>
      </div>
      <el-form ref="queryForm" label-width="70px" :model="queryForm">
        <div class="select_wrap lineHeight19">
          <el-form-item label="考试年度">
            <el-select filterable v-model="queryForm.examyear" placeholder="请选择考试年度">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option v-for="(item,index) in allOption.graduationexamyear" :key="index+1" :label="item.name" :value="item.key">
                <!--turnplanid-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select filterable v-model="queryForm.turngrade" placeholder="请选择年级">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option v-for="(item,index) in allOption.turngrade" :key="index+1" :label="item.name" :value="item.key">
                <!--turnplanid-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业基地">
            <el-select v-model="queryForm.baseName" placeholder="全部" @change="changeDept">
              <el-option label="全部" value=""></el-option>
              <el-tree :data="baseList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                ref="treeDom" class="selfTree"></el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="学员类型">
            <el-select filterable v-model="queryForm.stdType" placeholder="请选择学员类型">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option v-for="(item,index) in allOption.stud_type" :key="index+1" :label="item.name" :value="item.key">
                <!--turnplanid-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结业考状态 " class="graduationFormItem" label-width="80" style="width: 210px">
            <el-select filterable v-model="queryForm.exampassflag" placeholder="请选择结业考状态">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option value="1" label="通过">通过</el-option>
              <el-option value="0" label="不通过">不通过</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="理论考状态 " class="graduationFormItem" label-width="80" style="width: 210px;">
            <el-select filterable v-model="queryForm.theorypassflag" placeholder="请选择理论考状态">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option value="1" label="通过">通过</el-option>
              <el-option value="0" label="不通过">不通过</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技能考状态 " class="graduationFormItem" label-width="80" style="width: 210px;">
            <el-select filterable v-model="queryForm.skillpassflag" placeholder="请选择技能考状态">
              <el-option :key="0" label="全部" :value="allvalue"></el-option>
              <el-option value="1" label="通过">通过</el-option>
              <el-option value="0" label="不通过">不通过</el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="graduationQueryBtn">
            <el-button type="primary" class="queryBtn" @click="doSelectQuery">查找</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--弹框-->
    <el-dialog :title="title+'结业考状态'" :visible.sync="addTableVisible">
      <el-form :model="addForm" label-width="100px" :rules="rules" class="editForm" ref="addForm">
        <el-form-item label="姓名" prop="stdid">
          <el-select v-if="dialogshow==1" v-model="addForm.stdid" filterable remote placeholder="请输入姓名或学号搜索" :loading="loading" :remote-method="queryStuByMobile">
            <!-- <el-option v-for="item in stunumoptionlist" :key="item.id" :label="item.name + ' - ' + item.code " :value="item.id"> -->
            <el-option v-for="item in stunumoptionlist" :key="item.stuId" :label="item.name + ' - ' + item.code " :value="item.stuId">
            </el-option>
          </el-select>
          <el-select filterable v-if="dialogshow == 2" v-model="addForm.stdid" disabled>
            <el-option v-for="item in stunumoptioneditlist" :key="item.id" :label="item.name + ' - ' + item.code " :value="item.stdid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="理论考状态" prop="theorypassflag">
          <el-radio-group v-model="addForm.theorypassflag">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技能考状态" prop="skillpassflag">
          <el-radio-group v-model="addForm.skillpassflag">
            <el-radio label="1">通过</el-radio>
            <el-radio label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考试年度" prop="examyear">
          <el-select filterable v-model="addForm.examyear" placeholder="全部">
            <el-option v-for="(item,index) in allOption.graduationexamyear" :key="index" :label="item.name" :value="item.key">
              <!--turnplanid-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item align="right" class="actionBtn">
          <el-button type="primary" @click="addSubmit" v-if="dialogshow==1">保存</el-button>
          <el-button type="primary" @click="editSubmit" v-if="dialogshow==2">提交</el-button>
          <el-button @click="addTableVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="dataTable self-fixed-bottom">
      <el-table ref="detailTable" border :data="dataList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
        <el-table-column prop="stdname" label="姓名" width="120" fixed='left'>
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stdname" placement="top">
                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.stdname}}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stdno" width="110" label="学号"></el-table-column>
        <el-table-column prop="stdmobile" width="110" label="手机号码"></el-table-column>
        <el-table-column prop="turngradename" label="年级"></el-table-column>
        <el-table-column prop="basename" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.basename" placement="top">
                <span>
                  {{scope.row.basename}}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stdtypename" width="110" label="学员类型">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stdtypename" placement="top">
                <span>
                  {{scope.row.stdtypename}}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="degreename" width="120" label="学位"></el-table-column>
        <el-table-column prop="degreetypename" width="120" label="学位类型"></el-table-column>
        <el-table-column prop="verificationyears" width="100" label="培训年限"></el-table-column>
        <el-table-column prop="isgraduationname" width="110" label="结业状态"></el-table-column>
        <el-table-column prop="exampassname" width="110" label="结业考状态"></el-table-column>
        <el-table-column prop="theorypassname" width="110" label="理论考状态"></el-table-column>
        <el-table-column prop="skillpassname" width="110" label="技能考状态"></el-table-column>
        <el-table-column prop="examyear" width="110" label="考试年度"></el-table-column>
        <el-table-column fixed="right" width="170" label="操作" cell-class-name>
          <template slot-scope="scope">
            <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteL(scope.$index,scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin:10px 10px" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 个人档案 -->
    <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>

  </div>
</template>
<script>
  import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
  import { mapState, mapActions } from 'vuex';
  import { post, get, getCookie, setTitle, exportMouldExcel, exportExcel, showErrorImport, getStorage } from '../../config/util'
  export default {
    name: 'graduationExamination',
    data() {
      return {
        defaultProps: {
          label: 'name',
          children: 'childrens'
        },
        dialogRecords: false,
        studentDetailId: "",
        idList: [],
        allvalue: '',
        baseList: [],
        page: 1,
        pagesize: 10,
        totalCount: 0,
        queryForm: {
          hospitalId: "",
          examyear: '',
          turngrade: '',
          base: '',
          baseName: '',
          stdType: '',
          exampassflag: '',
          theorypassflag: '',
          skillpassflag: '',
          usersearchinfo: '',
        },
        title: '新增',
        dataList: [],
        dialogshow: 1,
        loading: false,
        stunumoptionlist: [],//学号列表
        stunumoptioneditlist: [],//学生姓名
        hospitalnumber: '',//住培学号
        editTableVisible: false,
        addTableVisible: false,
        allValue: '',
        examyear: '',
        addForm: {
          id: '',
          stdid: "",
          theorypassflag: '',
          skillpassflag: '',
          examyear: ''
        },
        fileList: [],
        dialogTableVisible: false,
        uploadData: {
          _upload_data: JSON.stringify({
            '1': {
              command: 'turngraduexam/graduexammould',
              sessionid: getCookie('sid'),
              loginid: getCookie('uid')
            }
          })
        },
        rules: {
          stdid: [{ required: true, message: '请输入您的姓名', trigger: 'blur', type: 'number' }],
          theorypassflag: [{ required: true, message: '请选择通过或者不通过', trigger: 'blur' }],
          skillpassflag: [{ required: true, message: '请选择通过或者不通过', trigger: 'blur' }],
          examyear: [{ required: true, message: '请选择考试年度', trigger: 'blur' }]
        }
      }
    },
    computed: {
      ...mapState(['allOption',]),
    },
    components: {
      studentPersonalInfo,
    },
    methods: {
      setQueryFormOne(form) {
        this.queryForm.hospitalId = form.hospitalId
        this.queryForm.base = form.baseId
      },
      personalDetail(index, row) {
        this.dialogRecords = true;
        this.studentDetailId = row.stdid
      },
      ...mapActions(['initAllOptionListUG', 'showErrorImport']),
      getData(page, pagesize, examyear, turngrade, base, stdtype, exampassflag, theorypassflag, skillpassflag, usersearchinfo) {
        let self = this
        post('/turngraduexam/listgraduexam', {
          command: 'turngraduexam/listgraduexam',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          page: page ? page : 1,
          pagesize: pagesize ? pagesize : 10,
          examyear: examyear,
          turngrade: turngrade,
          hospitalId: this.queryForm.hospitalId,
          base: base,
          stdtype: stdtype,
          exampassflag: exampassflag,
          theorypassflag: theorypassflag,
          skillpassflag: skillpassflag,
          usersearchinfo: usersearchinfo
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.dataList = data.result.list;
            self.totalCount = data.result.count;
          }
        });

      },
      submitUpload() {						//上传按钮
        if (!this.hasFile) {
          this.$message({
            showClose: true,
            message: '请先选择上传的Excel文件！',
            type: 'warning'
          })
        }
        this.$refs.upload.submit()
      },
      downloadModel: function () {		//下载导入模板
        let data = {
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          command: 'turngraduexam/graduexammould'
        }
        exportMouldExcel(data)
      },
      checkFile(file) {			//上传文件之前 限制文件类型
        const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';

        if (!isExcel) {
          this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
        }
        this.hasFile = false;
        return isExcel;
      },
      uploadSuccess(res) {					//上传成功
        if (res.errcode == 0) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
        } else if (res.errcode == 9903) {
          this.showErrorImport(res.errorlist)
        } else {
          this.$message({
            type: 'warning',
            message: res.errdesc
          })
        }
        this.$refs.upload.clearFiles()
        this.dialogTableVisible = false
        this.hasFile = false
        this.$loading().close()
      },
      onProgress() {			//文件上传时-显示进度条
        this.$loading();
      },
      changeFile(file, list) {		//文件状态改变
        if (list.length > 1) {
          list.shift()
        }
        if (list.length > 0) {
          this.hasFile = true
        }
      },
      /*分页区*/
      handleSizeChange(size) {
        this.pagesize = size;
        this.doSelectQuery();
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.doSelectQuery();
      },
      handleSelectionChange(item) {
        let self = this	//0未开始1进行中2已结束
        self.idList = [];
        for (var i = 0; i < item.length; i++) {
          //	//console.log(item)
          self.idList.push(item[i].id)
        }
      },
      deleteL(index, item) {
        let self = this;
        self.idList.push(item.id);
        this.$confirm('确认删除该学员的结业考状态吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/turngraduexam/delgraduexam', {
            command: 'turngraduexam/delgraduexam',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            idlist: self.idList
          }).then(function (data) {
            if (data && data.errcode == 0) {
              self.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              self.$message({
                message: data.errdesc,
                type: 'warning'
              });

            }
            self.getData();
            self.clearQuery();

          })
        });
      },
      clearQuery() {
        for (let key in this.queryForm) {
          this.queryForm[key] = ''
        }
      },
      //查询
      doSelectQuery() {
        this.queryForm.usersearchinfo = '';
        this.getData(this.page, this.pagesize, this.queryForm.examyear, this.queryForm.turngrade, this.queryForm.base, this.queryForm.stdType, this.queryForm.exampassflag, this.queryForm.theorypassflag, this.queryForm.skillpassflag);
      },
      //批量删除
      batchdelete: function () {
        let self = this;
        if (self.idList.length == 0) {
          self.$message({
            showClose: true,
            message: '请先勾选多项需要删除的数据！',
            type: 'warning'
          });
          return;
        } else if (self.idList.length < 2) {
          self.$message({
            showClose: true,
            message: '请最少选择两条数据！',
            type: 'warning'
          });
          return;
        } else {
          this.$confirm('确认删除该学员的结业考状态吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            post('/turngraduexam/delgraduexam', {
              command: 'turngraduexam/delgraduexam',
              sessionid: getCookie('sid'),
              loginid: getCookie('uid'),
              idlist: self.idList,	//成绩id
            }).then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  message: '删除成功',
                  type: 'success'
                });
                self.getData();
              }
            }).catch(function (error) {
              //console.log(error)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        }
      },
      add() {
        this.dialogshow = 1
        this.addTableVisible = true;
        this.stunumoptionlist = []
        for (let key in this.addForm) {
          this.addForm[key] = '';
        }
      },
      edit(index, item) {
        let self = this;
        this.title = '编辑';
        this.dialogshow = 2;
        this.addTableVisible = true;
        this.addForm.stdid = item.stdid
        post('/turngraduexam/getgraduexam', {
          command: 'turngraduexam/getgraduexam',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          id: item.id
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.stunumoptioneditlist = [
              {
                stdid: data.bean.stdid,
                name: data.bean.stdname,
                code: data.bean.examyear
              }
            ];
            self.addForm.id = data.bean.id;
            self.addForm.stdid = data.bean.stdid;
            self.addForm.theorypassflag = String(data.bean.theorypassflag);
            self.addForm.skillpassflag = String(data.bean.skillpassflag);
            self.addForm.examyear = data.bean.examyear;


          }
        });
      },
      editSubmit() {
        let self = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            post('/turngraduexam/updategraduexam', {
              command: 'turngraduexam/updategraduexam',
              sessionid: getCookie('sid'),
              loginid: getCookie('uid'),
              id: self.addForm.id,
              stdid: self.addForm.stdid,
              theorypassflag: self.addForm.theorypassflag,
              skillpassflag: self.addForm.skillpassflag,
              examyear: self.addForm.examyear
            }).then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  message: '保存成功',
                  type: 'success'
                })
                self.addTableVisible = false
                //重新初始化数据
                self.getData()
              } else {
                self.$message({
                  message: data.errdesc,
                  type: 'warning'
                })
                self.addTableVisible = false
              }
            })
          } else {
            return false
          }
        });
      },
      nodeClick(node) {
        if (node.deptlevel == 1) {
          this.queryForm.hospitalId = node.id
          this.queryForm.base = ""
        } else {
          this.queryForm.hospitalId = ""
          this.queryForm.base = node.id
        }
        this.queryForm.baseName = node.name
      },
      changeDept(val) {
        if (val == undefined || val == null || val == "") {
          this.queryForm.hospitalId = ""
          this.queryForm.base = ""
          this.queryForm.baseName = ""
        }
      },
      getBaseList() {
        post("/base/dept/getHosBaseTree").then(res => {
          if (res && res.resCode == 200) {
            this.baseList = res.model
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "请求基地列表报错"
            })
          }
        })
      },
      queryAll() {
        for (let key in this.queryForm) {
          this.queryForm[key] = ''
        }
        this.getData();
      },
      addSubmit() {
        let self = this;
        this.dialogshow = 1;
        this.title = '新增';
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            post('/turngraduexam/addgraduexam', {
              command: 'turngraduexam/addgraduexam',
              sessionid: getCookie('sid'),
              loginid: getCookie('uid'),
              stdid: self.addForm.stdid,
              theorypassflag: self.addForm.theorypassflag,
              skillpassflag: self.addForm.skillpassflag,
              examyear: self.addForm.examyear
            }).then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  message: "保存成功",
                  type: 'success'
                });
                self.addTableVisible = false;
                //重新初始化数据
                self.getData();
              } else {
                self.$message({
                  message: data.errdesc,
                  type: 'warning'
                })
                self.addTableVisible = false;
              }
            });
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      //姓名或者住培学号的查询
      queryStd() {
        this.getData('', '', '', '', '', '', '', '', '', this.queryForm.usersearchinfo);
        for (let key in this.queryForm) {
          if (key != 'usersearchinfo') {
            this.queryForm[key] = '';
          }
        }
      },
      queryStuByMobile(query) {
        let self = this;
        if (query !== '') {
          self.loading = true;
          setTimeout(() => {
            self.loading = false;
            get(
              `/base/turninterstdplan/finishList?menusId=${getStorage('menuId')}&hospitalId=&baseId=&turnGrade=&verificationYears=&keyword=${query}&graduationYear&isGraduation=0&pageNum=0&pageSize=0`,
              {}
            ).then(res => {
              self.stunumoptionlist = res.rows;
              // this.total = res.total;
            });
          }, 200)
        } else {

        }
      }
    },
    mounted() {
      this.getData();
      this.initAllOptionListUG({ type: 'graduationexamyear' })//考试年度;
      this.initAllOptionListUG({ type: 'turngrade' })//年级;
      this.initAllOptionListUG({ type: 'stud_type' })//学员类型;
      this.getBaseList();//基地

    }

  }
</script>

<style scoped>
  .wapper {
    padding: 0 20px;
  }

  .tools {
    margin-bottom: 15px;
  }

  .graduationTools {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .graduationQueryTools {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .graduationQueryTools .queryAll {
    width: 50px;
    padding: 0 5px;
    font-size: 13px;
  }

  .graduationQueryBtn /deep/.el-form-item__content {
    margin-left: 30px !important;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .select_wrap {
    width: calc(100% - 50px);
  }

  .select_wrap /deep/.el-form-item__label {
    text-align: right;
    /* padding: 11px 6px ; */
  }

  .el-form-item__label {
    text-align: right;
  }

  .graduationFormItem {
    text-align: left;
  }

  /*.graduationFormItem>/deep/.el-form-item__content{margin-left:100px!important;}*/
  /*.graduationQueryBtn>/deep/.el-form-item__content{margin-left:40px!important;}*/
  .graduationQueryTools .el-form {
    float: left;
  }

  .graduationQueryTools .queryAll>button {
    margin-right: 5px;
  }

  .graduationQueryTools .el-form .el-form-item {
    display: inline-block;
  }

  .graduationQueryTools .el-select {
    width: 120px;
  }

  .editForm {
    width: 400px;
    margin: 0 auto;
  }

  .editForm .el-input {
    width: 217px;
  }

  .editForm .el-radio {
    margin-right: 30px;
  }

  .actionBtn {
    position: absolute;
    right: 20px;
    bottom: 0px;
  }

  .graduationSearch {
    margin-top: -20px;
  }

  .graduationSearch>.el-input,
  .graduationSearch>button {
    display: inline-block;
  }

  .graduationSearch>.el-input {
    width: 220px;
  }

  .editForm .el-select {
    width: 217px;
  }
</style>
<style>
  .self-fixed-bottom .el-table__fixed-right {
    bottom: 0 !important;
  }

  .self-fixed-bottom .el-table__fixed {
    bottom: 0 !important;
  }

  /* .lineHeight19 .el-form-item__label {
    line-height: 19px!important;
  } */
</style>