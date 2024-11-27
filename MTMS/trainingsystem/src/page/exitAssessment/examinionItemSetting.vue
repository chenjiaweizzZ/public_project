<template>
  <div class="wapper">
    <div class="tool-boxs">
      <div class="funcTools">
        <el-button type="primary" @click="addresult">新增</el-button>
        <el-button type="primary" @click="delExamItem">删除</el-button>
        <!-- <el-button type="primary" @click="checkExamItem">审核</el-button> -->
        <el-button type="primary" @click="downloadScoreSheet">评分表模板下载</el-button>
        <el-button type="primary" @click="queryAll">查询全部</el-button>
      </div>
      <div class="search-box">
        <el-input style="width: 200px" v-model="inputInfo" @keyup.enter.native="doInputQuery" placeholder="请输入考核项名称查找"></el-input>
        <el-button type="primary" @click="doInputQuery">搜索</el-button>
      </div>
    </div>
    <!--关联列表-->
    <el-dialog title="请选择关联考核项" :visible.sync="relationListVisible" size="tiny">
      <div class="relation_query">
        <el-input placeholder="输入考核项查询" v-model="relationName"></el-input>
        <el-button type="primary" @click="relationSearch">搜索</el-button>
      </div>
      <div class="dataTable">
        <el-table v-loading="relationLoading" ref="detailTable" :data="relationList" border tooltip-effect="dark" style="width: 100%"
          @select="relationSelectionChange">
          <el-table-column type="selection" width="45" :selectable="checkboxInit"></el-table-column>
          <el-table-column prop="name" label="考核项"></el-table-column>
        </el-table>
        <el-pagination style="margin: 10px 10px" @size-change="relationSizeChange" @current-change="relationCurrentChange" :current-page="rPage"
          :page-sizes="[10, 20, 50, 100]" :page-size="rPagesize" layout="total, sizes, prev, pager, next, jumper" :total="relationItemCount">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="relationSave">保存</el-button>
          <el-button type="primary" @click="relationListVisible = false">取消</el-button>
        </div>
        <!-- <div class="funTools" align="right">
          <el-button type="primary" @click="relationSave">保存</el-button>
          <el-button type="primary" @click="relationListVisible = false"
            >取消</el-button
          >
        </div> -->
      </div>
    </el-dialog>
    <!--关联-->
    <el-dialog title="关联OSCE考核项" :visible.sync="relationVisible">
      <el-form :model="relationForm" ref="addGroupForm" label-width="100px" class="demo-ruleForm" :rules="relationRules">
        <el-form-item label="考核项" prop="name">
          <el-row justify="space-between" type="flex">
            <el-col :span="15">
              <div class="relationProject">
                <el-tag type="primary" :closable="true" @close="relationProjectDelete" v-if="relationProject">
                  {{ relationProject }}
                </el-tag>
              </div>
            </el-col>
            <el-col class="line" :span="8">
              <el-button type="primary" @click="relationListStd">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div align="right" style="padding: 30px 0">
          <el-form align="right">
            <el-button type="primary" @click="relationProjectSave">保存</el-button>
            <el-button type="primary" @click="relationVisible = false">取消</el-button>
          </el-form>
        </div>
      </el-form>
    </el-dialog>

    <!-- <div class="queryTools">
                <div class="queryAll">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </div>
                <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                    <el-form-item label="类别">
                        <el-select filterable v-model="queryForm.asstype" placeholder="请选择考核类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item,index) in yearassessmentlist" :key="item.index" :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
    
                    <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
                </el-form>
            </div> -->

    <!-- 新增考核项, 编辑考核项 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogfrom" :close-on-click-modal="false" size="small" @close="dialogfrom = false"
      class="dialogAdd">
      <el-form :model="dialogForm" label-width="80px">
        <el-row :gutter="23">
          <el-col :span="23">
            <div class="newandedit">
              <label><span class="red">*</span>考核项 : </label>
              <el-input style="width: 200px" v-model="dialogForm.asmtproject" placeholder="请输入考核项名称">
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="23">
          <el-col :span="23">
            <div class="newandedit">
              <label><span class="red">*</span>状态 : </label>
              <el-radio-group v-model="dialogForm.radiotype">
                <el-radio :label="1" style="width: 50px">启用</el-radio>
                <el-radio :label="0" style="width: 50px">禁用</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="23">
                        <el-col :span="23">
                            <div class="newandedit">
                                <label><span class="red">*</span>类别 : </label>
                                <el-select filterable v-model="dialogForm.asstype" :disabled="editdisabled"
                                    placeholder="请选择考核类别">
                                    <el-option v-for="(item,index) in yearassessmentlist" :key="item.index"
                                        :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row> -->
        <el-row :gutter="23">
          <el-col :span="23">
            <div class="newandedit">
              <label><span class="red">*</span>适用范围 :</label>
              <el-radio-group v-model="dialogForm.entire">
                <el-radio :label="0" style="width: 50px">全部</el-radio>
                <el-radio :label="1" style="width: 50px">部分适用</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="23" v-if="dialogForm.entire == 1">
          <el-col :span="23">
            <div class="newandedit">
              <div class="depts">
                <div class="dept-box">
                  <div type="primary" v-for="(item, index) in allDepts" :key="index">
                    <el-tag type="primary" :key="val.id" v-for="(val, index) in dialogForm.depts" v-if="item.id == val">
                      {{ item.name }}
                    </el-tag>
                  </div>
                </div>
                <el-button type="primary" @click="selectDept">选择</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="23">
          <el-col :span="23">
            <div class="newandedit">
              <label><span class="red">*</span>考核类型:</label>
              <el-select v-model="dialogForm.examitemtype" placeholder="请选择">
                <el-option label="出科技能考核" :value="1"></el-option>
                <el-option label="出科综合考核" :value="2"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <div class="bottomBtns">
            <el-button v-if="dialogshow == 1" @click="addsaveform" type="primary">保存</el-button>
            <el-button v-if="dialogshow == 2" @click="editsaveform" type="primary">保存</el-button>
            <el-button v-if="dialogshow == 1 || dialogshow == 2" @click="cancelSaveExam">取消</el-button>
          </div>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 选择考核项适用范围 -->
    <el-dialog class="select-items-box" title="选择适用范围" :visible.sync="dialogApply" v-if="dialogApply" :close-on-click-modal="false"
      size="small" @close="dialogfrom = false">
      <div class="tree-box">
        <div class="left-tree-box">
          <el-input class="left-top" placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree v-if="sysType != 3" style="width: 260px" :filter-node-method="filterNode" :data="deptData" node-key="id" default-expand-all
            show-checkbox :props="defaultProps" ref="tree1" :check-strictly="true"></el-tree>
          <el-tree v-else style="width: 260px" :filter-node-method="filterNode" :data="deptData" node-key="id" default-expand-all show-checkbox
            :props="{ label: 'name' }" ref="tree1" :check-strictly="true" @check-change="checkChange"></el-tree>
        </div>
        <el-button type="primary" @click="addItems">添加</el-button>
        <div class="right-tree-box">
          <div class="right-top">
            <el-button type="primary" @click="delItemBtn">移除</el-button>
          </div>
          <el-tree style="width: 260px" :data="selectData" node-key="id" default-expand-all show-checkbox :props="defaultProps2" ref="tree2"></el-tree>
        </div>
      </div>
      <div class="tree-footer">
        <el-button @click="cancelBtn">取消</el-button>
        <el-button type="primary" @click="saveBtn">保存</el-button>
      </div>
    </el-dialog>
    <!-- 操作流程 -->
    <el-dialog title="操作流程" :visible.sync="dialogOperation" :close-on-click-modal="false" size="small" @close="dialogOperation = false">
      <div class="operation-box">
        <el-button type="primary">导出PDF</el-button>
        <div class="operation-content-box">
          <div>操作流程:</div>
          <el-input style="width: 86%; margin-left: 12px" type="textarea" :rows="18" placeholder="请输入内容(不超过5000字)" v-model="textarea">
          </el-input>
        </div>
        <div class="operation-footer-box">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 评分表编辑 -->
    <el-dialog title="评分表" :visible.sync="dialogScoreSheet" :close-on-click-modal="false" size="small" @close="cancelScoreItem">
      <div class="score-sheet-box">
        <div class="btn-top-box">
          <el-button type="primary" @click="importScoreSheet">上传评分表</el-button>
          <el-button type="primary" @click="delSocreSheet">删除评分表</el-button>
          <el-button type="primary" @click="exportScoreSheet">导出评分表</el-button>
        </div>
        <div class="score-sheet-content">
          <div class="score-sheet-title">总分: {{ scoreTotal }}</div>
          <div class="score-sheet">
            <el-table class="table-score-sheet" :data="scoreSheetData" border highlight-current-row tooltip-effect="dark" @row-click="handleEditItems">
              <el-table-column label="评分项" prop="opstepcontent" min-width="120">
                <template slot-scope="scope">
                  <el-input type="textarea" autosize v-model="scope.row.opstepcontent" placeholder="请输入内容" @change="editScoreItem(scope.$index, scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="评分细则" prop="rightoperation" min-width="300">
                <template slot-scope="scope">
                  <!-- <div class="actionplansty">
                                            <el-tooltip effect="light" :content="scope.row.rightoperation" placement="top">
                                                <span> -->
                  <el-input type="textarea" autosize v-model="scope.row.rightoperation" placeholder="请输入内容" @change="editScoreItem(scope.$index, scope.row)"></el-input>
                  <!-- </span>
                                            </el-tooltip>
                                        </div> -->
                </template>
              </el-table-column>
              <el-table-column label="分数" prop="gradeitemscore" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gradeitemscore" placeholder="请输入分数" @change="editScoreItem(scope.$index, scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" min-width="120px">
                <template slot-scope="scope">
                  <el-button @click="addScoreItem(scope.$index, scope.row)" type="text" size="small">
                    添加</el-button>
                  <el-button @click="delScoreItem(scope.$index, scope.row)" type="text" size="small">
                    删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="score-sheet-footer">
            <el-button @click="cancelScoreItem">取消</el-button>
            <el-button type="primary" @click="saveScoreItem">确认</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 评分表上传 -->
    <el-dialog @close="clearScoreSheet" class="uploadDialog" title="导入评分表" :visible.sync="dialogImport" size="tiny" :close-on-click-modal="false">
      <div class="upload-tips">
        <div>
          1 下载评分表模板，填写评分表
          <el-button style="margin-left: 10px" size="small" type="primary" @click="downloadScoreSheet">评分表模板下载</el-button>
        </div>
        <div>2 上传填写好评分表</div>
        <div><span>*</span>仅支持上传1个xls文件类型的文件</div>
      </div>
      <div class="upload-box">
        <el-upload class="upload-demos" action="/import/importExcel" ref="upload" :file-list="fileList" :data="uploadData" :show-file-list="true"
          :auto-upload="false" :before-upload="checkFile" :on-change="changeFile" :on-success="upload_Suc" :on-progress="onProgress">
          <el-button type="primary" size="small">选择文件</el-button>
        </el-upload>
        <el-button class="btn-upload" type="primary" size="small" @click="submitImport">上传</el-button>
      </div>
    </el-dialog>

    <div class="dataTable">
      <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="45"></el-table-column>
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column prop="examitemname" label="考核项" min-width="120">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" :content="scope.row.examitemname" placement="top">
                <span>
                  {{ scope.row.examitemname }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="examitemname" label="考核类型" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.examitemtype == 1 ? "出科技能考核" : "出科综合考核" }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="适用范围" min-width="120"></el-table-column> -->
        <el-table-column prop="entire" label="适用范围" min-width="120">
          <template slot-scope="scope">
            <template>
              <div class="actionplansty" v-if="scope.row.entire == 0">全部</div>
              <div class="actionplansty" v-if="scope.row.entire == 1">
                <el-tooltip effect="light" :content="scope.row.deptnames" placement="top">
                  <span>
                    {{ scope.row.deptnames }}
                  </span>
                </el-tooltip>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="stationname" label="关联的OSCE考核项" min-width="120"></el-table-column>
        <!-- <el-table-column prop="" label="审核状态" min-width="80"></el-table-column> -->
        <el-table-column prop="source" label="来源" min-width="120">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" :content="scope.row.source" placement="top">
                <span>
                  {{ scope.row.source }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="最后操作时间" min-width="120">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" :content="scope.row.updatetime" placement="top">
                <span>
                  {{ scope.row.updatetime }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            <template>
              <div v-if="scope.row.status == 0">禁用</div>
              <div v-if="scope.row.status == 1">启用</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="disabled(scope.$index, scope.row)" type="text" size="small">
              <span v-if="scope.row.status == 1">禁用</span>
              <span v-if="scope.row.status == 0">启用</span>
            </el-button>
            <el-button @click="relationFun(scope.row)" type="text" size="small">关联</el-button>
            <el-button @click="openScoreSheet(scope.row)" type="text" size="small">评分表</el-button>
            <!-- <el-button @click="operation(scope.row)" type="text" size="small">操作流程</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right; margin: 10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    post,
    getCookie,
    setTitle,
    exportMouldExcel,
    exportExcel,
    showErrorImport,
  } from "../../config/util";
  import { mapState, mapActions } from "vuex";
  import moment from "moment";
  var _ = require("lodash");
  var i = 0;

  export default {
    data() {
      return {
        // 评分表上传
        dialogImport: false,
        fileList: [],
        hasFile: false,
        // 搜索
        inputInfo: "",

        //筛选
        yearassessmentlist: [], //类别
        queryForm: {
          asstype: "",
        },

        //弹窗
        detailid: "", //详情id
        dialogTitle: "", //标题
        dialogfrom: false, //
        dialogshow: "", //1增加；2编辑
        dialogForm: {
          //弹窗
          asmtproject: "", // 考核项
          entire: "", // 适用范围
          radiotype: "", // 是否启用
          depts: [], // 适用的科室ID
          examitemtype: "",
        },
        editdisabled: false, //禁用某项

        //列表
        rateList: [],
        //分页
        pageno: 1,
        pagesize: 10,
        totalCount: 0,
        usePage: false,
        //关联
        relationListVisible: false,
        relationVisible: false,
        relationList: [], //关联项数据
        relationForm: {
          project: "",
        },
        relationList: [],
        relationItemCount: 0,
        relationLoading: false,
        rPage: 1,
        rPagesize: 10,
        relationName: "", //关联考核项名字
        relationSelected: [],
        relationProject: "",
        examitemid: "",
        examyear: "",
        stationid: "",
        stationsid: [],
        //关联考核项
        relationRules: {
          relation: [
            { required: true, message: "请选择考核项", trigger: "blur" },
          ],
        },

        // 新增
        loadingShow: false,
        deptData: [],
        selectData: [],
        // 医院所有科室数组
        allDepts: [],
        filterText: "",
        currentDeptId: "",
        // 配置项、展示子节点，禁用节点等
        defaultProps: {
          label: "name",
          children: "childrens",
          disabled: function (data, node) {
            // if (data.baseId) {
            //   if (data.baseId !== data.baseId2) {
            //     return true;
            //   }
            // }
            if (data.deptlevel == 1) {
              return true;
            }
          },
        },
        defaultProps2: {
          label: "name",
          children: "childrenss",
        },
        // 考核范围选择
        dialogApply: false,
        // 操作流程
        dialogOperation: false,
        textarea: "",
        // 评分表
        dialogScoreSheet: false,
        scoreSheetData: [],
        // 当前考核项ID
        currentExamItemId: "",
        // 选择的考核项
        deletelist: [],
        sysType: 1,
      };
    },
    components: {},
    computed: {
      scoreTotal() {
        let val = 0;
        this.scoreSheetData.map((item) => {
          val += parseFloat(
            item.gradeitemscore ? parseFloat(item.gradeitemscore).toFixed(1) : 0
          );
        });
        return val.toFixed(1);
      },
      uploadData() {
        let currentExamItemId = this.currentExamItemId;
        return {
          _upload_data: JSON.stringify({
            1: {
              command: "turnannualresult/importTurnExamInfoExam",
              sessionid: getCookie("sid"),
              loginid: getCookie("uid"),
              examitemid: currentExamItemId,
            },
          }),
        };
      },
    },
    mounted() {
      // this.getallexamyearlist(); //考核年
      this.inittable(1, 10, "");
      console.log("query", this.$route.query);
      if (this.$route.query.sysType) {
        this.sysType = this.$route.query.sysType.substr(0, 1);
      } else {
        this.sysType = 1;
      }

      if (this.sysType == 3) {
        this.initDeptTree2(); // 科室节点树
      } else {
        this.initDeptTree(); // 科室节点树
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree1.filter(val);
      },
    },
    methods: {
      // 清除上传评分表
      clearScoreSheet() {
        this.$refs.upload.clearFiles();
      },
      // 上传评分表
      submitImport() {
        if (!this.hasFile) {
          this.$message({
            showClose: true,
            message: "请先选择上传的Excel文件！",
            type: "warning",
          });
        }
        this.$refs.upload.submit();
      },
      upload_Suc(res) {
        if (res.errcode == 0) {
          this.$message({
            type: "success",
            message: "上传成功",
          });
          this.scoreSheetData = [];
          this.openScoreSheet();
        } else if (res.errcode == 9903) {
          this.showErrorImport(res.errorlist);
        } else {
          this.$message({
            type: "warning",
            message: "请使用下载评分表模板上传",
          });
        }
        this.$refs.upload.clearFiles();
        this.dialogImport = false;
        this.hasFile = false;
        this.$loading().close();
      },
      onProgress(event, file, fileList) {
        this.$loading();
      },
      // 只能上传一个
      changeFile(file, list) {
        if (list.length > 1) {
          list.shift();
        }
        if (list.length > 0) {
          this.hasFile = true;
        }
      },
      // 检测文件类型
      checkFile(file) {
        const isExcel =
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel";

        if (!isExcel) {
          this.$message.error("请上传.xls或.xlsx格式的Excel文件！");
        }
        this.hasFile = false;
        return isExcel;
      },
      // 打开上传评分表弹窗
      importScoreSheet() {
        this.dialogImport = true;
      },

      // 删除当前评分表
      delSocreSheet() {
        post("/turnannualresult/deletedepttech", {
          command: "turnannualresult/deletedepttech",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemid: this.currentExamItemId,
        })
          .then((data) => {
            if (data && data.errcode == 0) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.scoreSheetData = [
                {
                  gradeitemscore: "",
                  opstepcontent: "",
                  rightoperation: "",
                },
              ];
            }
          })
          .catch(function (error) { });
      },

      // 导出评分表
      exportScoreSheet() {
        let data = {
          command: "turnannualresult/exportExamItemInfoItem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemid: this.currentExamItemId,
        };
        exportExcel(data);
      },

      // 评分表保存
      saveScoreItem() {
        let self = this;
        post("/turnannualresult/updateexamitemitem", {
          command: "turnannualresult/updateexamitemitem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemid: self.currentExamItemId,
          itemlist: self.scoreSheetData,
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.$message({
                type: "success",
                message: "保存成功",
              });
              self.dialogScoreSheet = false;
              self.usePage = true;
              self.inittable(self.pageno, self.pagesize, self.inputInfo);
            } else {
              self.$message({
                message: data.errdesc,
                // message: '评分表信息填写完整,不能为空!',
                type: "warning",
              });
            }
          })
          .catch(function (error) { });
      },
      // 评分表取消
      cancelScoreItem() {
        this.dialogScoreSheet = false;
        this.scoreSheetData = [];
      },
      // 评分项
      addScoreItem(index, row) {
        this.scoreSheetData.splice(index + 1, 0, {
          gradeitemscore: "",
          opstepcontent: "",
          rightoperation: "",
        });
      },
      delScoreItem(index, row) {
        this.scoreSheetData.splice(index, 1);
      },
      // 修改评分项
      editScoreItem(index, row) { },
      // 点击row
      handleEditItems(row, event, column) {
        // console.log(row, event, column)
      },
      // 取消添加考核项
      cancelSaveExam() {
        this.dialogfrom = false;
        this.dialogForm.depts = "";
      },
      // 科室范围选择
      cancelBtn() {
        this.selectData = [];
        this.dialogApply = false;
      },
      saveBtn() {
        // 编辑状态下
        if (this.dialogshow == 2) {
          // 置空
          this.dialogForm.depts = [];
        }
        this.selectData.forEach((item) => {
          this.dialogForm.depts.push(item.id);
        });
        this.dialogForm.depts = _.uniq(this.dialogForm.depts);
        console.log(this.dialogForm.depts);
        console.log(this.allDepts);
        this.dialogApply = false;
      },
      delItemBtn() {
        var rightSelectItems = this.$refs.tree2.getCheckedNodes();
        var items = _.cloneDeep(this.selectData);
        this.selectData = this.getDifferenceSet(rightSelectItems, items);
      },
      // 求两个数组对象的差集
      getDifferenceSet(arr1, arr2) {
        arr1 = arr1.map(JSON.stringify);
        arr2 = arr2.map(JSON.stringify);
        return arr1
          .concat(arr2)
          .filter(function (v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
          })
          .map(JSON.parse);
      },
      addItems(data) {
        let leftSelectItems = [];
        if (this.sysType == 1) {
          leftSelectItems = this.$refs.tree1.getCheckedNodes(false);
        } else {
          leftSelectItems = this.$refs.tree1.getCheckedNodes(false, false);
          if (data) {
          }
        }
        console.log(this.sysType == 1);
        console.log("leftSelectItems", leftSelectItems);

        let selectItems = _.cloneDeep(leftSelectItems);
        console.log(selectItems);
        // let allSelectItems = [];
        // selectItems.forEach((item, index) => {
        //     // if (item.childrens.length === 0) {
        //         allSelectItems.push(item);
        //     // }
        // });
        this.selectData = selectItems;
      },
      checkChange(node, checked) {
        //全部取消/选择
        const setChecked = (arr, ifChecked) => {
          if (arr) {
            arr.map((item) => {
              this.$refs.tree1.setChecked(item.id, ifChecked);
              if (!!item.children.length) {
                setChecked(item.children, ifChecked);
              }
            });
          }
        };
        console.log(node, checked);
        //如果为取消
        if (checked === false) {
          //如果当前节点有子集
          //循环子集将他们的选中取消
          setChecked(node.children ? node.children : [], false);
        } else {
          //否则(为选中状态)
          //判断父节点id是否为空
          if (node.pid !== "all") {
            //如果不为空则将其选中
            //循环子集将他们的选中取消
            setChecked(node.children ? node.children : [], true);
          }
        }
      },
      // tree 过滤
      filterNode(value, data) {
        console.log(data);
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 选择适用科室范围
      selectDept() {
        this.dialogApply = true;
        if (this.dialogshow == 2) {
          this.$nextTick(() => {
            this.$refs.tree1.setCheckedKeys(this.dialogForm.depts);
          });
          this.dialogForm.depts.forEach((item, index) => {
            this.allDepts.map((val) => {
              if (item == val.id) {
                this.selectData.push(val);
              }
            });
          });
          let hash = {};
          this.selectData = this.selectData.reduce((preVal, curVal) => {
            hash[curVal.id]
              ? ""
              : (hash[curVal.id] = true && preVal.push(curVal));
            return preVal;
          }, []);
        }
      },
      // 适用范围选择
      initDeptTree() {
        this.loadingShow = true;
        post("/base/dept/getHosDeptTreeWithBase")
          .then((data) => {
            if (data && data.resCode == 200) {
              this.deptData = data.model;
              data.model.forEach((item) => {
                item.childrens = item.childrens == null ? [] : item.childrens;
                this.allDepts = this.allDepts.concat(item.childrens);
                item.childrens.forEach((citem) => {
                  citem.childrens =
                    citem.childrens == null ? [] : citem.childrens;
                  this.allDepts = this.allDepts.concat(citem.childrens);
                  if (citem.childrens) {
                    citem.childrens.forEach((ditem) => {
                      ditem.childrens =
                        ditem.childrens == null ? [] : ditem.childrens;
                      this.allDepts = this.allDepts.concat(ditem.childrens);
                    });
                  }
                });
              });
              console.log("allDepts", this.allDepts);
            } else {
              this.$message({
                type: "error",
                message: data.resMsg,
              });
            }
            this.loadingShow = false;
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: data.resMsg,
            });
            this.loadingShow = false;
          });
      },

      // 进修适用范围选择2
      initDeptTree2() {
        this.loadingShow = true;
        post("/system/xyjdept/list/tree", {
          perms: "advanced:menu:exam_item_info_manage",
        })
          .then((data) => {
            if (data && data.resCode == 200) {
              this.deptData = data.model;
              data.model.forEach((item) => {
                item.children = item.children == null ? [] : item.children;
                this.allDepts = this.allDepts.concat(item.children);
                item.children.forEach((citem) => {
                  citem.children = citem.children == null ? [] : citem.children;
                  this.allDepts = this.allDepts.concat(citem.children);
                  citem.children.forEach((ditem) => {
                    ditem.children = ditem.children == null ? [] : ditem.children;
                    this.allDepts = this.allDepts.concat(ditem.children);
                  });
                });
              });
            } else {
              this.$message({
                type: "error",
                message: data.resMsg,
              });
            }
            this.loadingShow = false;
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: data.resMsg,
            });
            this.loadingShow = false;
          });
      },

      // 搜索考核项
      doInputQuery() {
        this.inittable(this.pageno, this.pagesize, this.inputInfo);
      },
      // 操作流程
      operation(item) {
        this.dialogOperation = true;
      },
      // 评分表
      openScoreSheet(item) {
        if (item) {
          this.currentExamItemId = item.examitemid;
        }
        let self = this;
        post("/turnannualresult/queryinfoitem", {
          command: "turnannualresult/queryinfoitem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemid: this.currentExamItemId,
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.dialogScoreSheet = true;
              if (data.list) {
                data.list.forEach((item, index) => {
                  item.value.forEach((val) => {
                    self.scoreSheetData.push(val);
                  });
                });
              } else {
                self.scoreSheetData = [
                  {
                    gradeitemscore: "",
                    opstepcontent: "",
                    rightoperation: "",
                  },
                ];
              }
            } else {
              self.$message({
                message: data.errdesc,
                type: "warning",
              });
            }
          })
          .catch(function (error) { });
      },

      //关联
      relationFun(item) {
        this.relationProject = "";
        this.relationVisible = true;
        this.examitemid = item.examitemid;
        this.examyear = item.annualtype;
        if (item.stationid) {
          this.relationInit(item.stationid);
          this.stationid = item.stationid;
        } else {
          this.stationid = "";
        }
        this.relationItemSeleted();
      },
      //查询已关联的项目
      relationItemSeleted() {
        let self = this;
        post("/turnannualresult/queryrelatedexamstation", {
          command: "turnannualresult/queryrelatedexamstation",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examyear: self.examyear,
        })
          .then(function (data) {
            self.relationLoading = false;
            if (data && data.errcode == 0) {
              self.stationsid = data.stationlist;
            }
          })
          .catch(function (error) {
            self.$message({
              type: "warning",
              message: error,
            });
          });
      },
      relationListStd() {
        this.relationListVisible = true;
        this.relationInit(); //关联考核项初始化
      },
      //部分关联选项禁用
      checkboxInit(row, index) {
        if (row.selectedStatus) {
          return 0;
        } else {
          return 1;
        }
      },
      //关联考核项初始化数据
      relationInit(stationid) {
        let self = this;
        self.relationLoading = true;
        if (stationid) {
          post("/oscestation/listoscestation", {
            command: "oscestation/listoscestation",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            name: self.relationName,
          })
            .then(function (data) {
              self.relationLoading = false;
              if (data && data.errcode == 0) {
                self.relationList = data.resultlist;
                if (self.stationsid.length > 0) {
                  for (let item of self.relationList) {
                    for (let innerItem of self.stationsid) {
                      if (item.id == innerItem) {
                        item.selectedStatus = true;
                      }
                    }
                  }
                }
                self.relationItemCount = data.totalcount;
                if (stationid) {
                  for (let item of self.relationList) {
                    if (item.id == stationid) {
                      self.relationProject = item.name;
                    }
                  }
                }
              }
              self.usePage = false;
            })
            .catch(function (error) { });
        } else {
          post("/oscestation/listoscestation", {
            command: "oscestation/listoscestation",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            pagenum: self.rPage,
            perpagenum: self.rPagesize,
            name: self.relationName,
          })
            .then(function (data) {
              self.relationLoading = false;
              if (data && data.errcode == 0) {
                self.relationList = data.resultlist;
                if (self.stationsid.length > 0) {
                  for (let item of self.relationList) {
                    for (let innerItem of self.stationsid) {
                      if (item.id == innerItem) {
                        item.selectedStatus = true;
                      }
                    }
                  }
                }
                self.relationItemCount = data.totalcount;
              }
              self.usePage = false;
            })
            .catch(function (error) { });
        }
      },
      //关联分页区
      relationSizeChange(size) {
        this.rPagesize = size;
        this.relationInit();
      },
      relationCurrentChange(currentPage) {
        this.rPage = currentPage;
        this.relationInit();
      },
      relationSearch() {
        this.relationInit();
      },
      relationSave() {
        if (this.relationSelected.length > 0) {
          if (this.relationSelected.length > 1) {
            this.$message({
              type: "warning",
              message: "只能选择一个考核项关联",
            });
          } else {
            this.relationProject = this.relationSelected[0].name;
            this.stationid = this.relationSelected[0].id;
            this.relationListVisible = false;
          }
        }
      },
      relationSelectionChange(val) {
        if (val) {
          this.relationSelected = val;
        }
      },
      relationProjectDelete() {
        let self = this;
        this.$confirm("是否删除此考核项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            post("/turnannualresult/relateexamitem", {
              command: "turnannualresult/relateexamitem",
              sessionid: getCookie("sid"),
              loginid: getCookie("uid"),
              examitemid: self.examitemid,
              examyear: self.examyear,
              examstationid: "",
            })
              .then(function (data) {
                if (data && data.errcode == 0) {
                  self.$message({
                    type: "success",
                    message: "删除成功",
                  });
                  self.relationProject = "";
                  self.relationVisible = false;
                  self.usePage = true;
                  self.inittable(self.pageno, self.pagesize, "");
                }
              })
              .catch(function (error) {
                this.$message({
                  type: "wraning",
                  message: error,
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
      relationProjectSave() {
        let self = this;
        self.relationLoading = true;
        if (self.stationid) {
          post("/turnannualresult/relateexamitem", {
            command: "turnannualresult/relateexamitem",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            examitemid: self.examitemid,
            examyear: self.examyear,
            examstationid: self.stationid,
          })
            .then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  type: "success",
                  message: "提交成功",
                });
                self.relationVisible = false;
                self.usePage = true;
                self.inittable(self.pageno, self.pagesize, self.inputInfo);
              }
              if (data.errcode == "400007") {
                self.$message({
                  type: "warning",
                  message: "选中的考核项已被关联,请重新选择",
                });
              }
            })
            .catch(function (error) {
              this.$message({
                type: "wraning",
                message: error,
              });
            });
        } else {
          self.$message({
            type: "warning",
            message: "请选择关联项",
          });
        }
      },
      //考核年
      getallexamyearlist: function () {
        let self = this;
        post("/hr/querylevellist", {
          command: "hr/querylevellist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          code: "examyear", // 考核年
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.yearassessmentlist = data.levellist;
          }
        });
      },

      //打开新增
      addresult: function () {
        let self = this;
        self.dialogfrom = true;
        self.dialogTitle = "新增考核项";
        self.dialogshow = 1;
        self.editdisabled = false; //姓名不能编辑
        self.dialogForm.asmtproject = ""; //考核项
        self.dialogForm.radiotype = ""; //是否启用
        self.dialogForm.entire = "";
        self.dialogForm.depts = [];
        self.selectData = [];
        self.dialogForm.examitemtype = "";
      },

      //增加保存按钮
      addsaveform: function () {
        let self = this;
        if (self.dialogForm.asmtproject === "" || !self.dialogForm.asmtproject) {
          self.$message({
            message: "请输入考核项名称",
            type: "warning",
          });
        } else if (self.dialogForm.radiotype === "") {
          self.$message({
            message: "请选择设置状态",
            type: "warning",
          });
        } else if (self.dialogForm.entire === "") {
          self.$message({
            message: "请选择适用范围",
            type: "warning",
          });
        } else if (self.dialogForm.examitemtype === "") {
          self.$message({
            message: "请选择考核类型",
            type: "warning",
          });
        } else {
          post("/turnannualresult/addexamitem", {
            command: "turnannualresult/addexamitem",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            examitemname: self.dialogForm.asmtproject, //考核项
            entire: self.dialogForm.entire, // 适用范围
            status: self.dialogForm.radiotype,
            depts: self.dialogForm.depts,
            sysType: self.sysType,
            examitemtype: self.dialogForm.examitemtype,
          })
            .then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  message: "添加成功",
                  type: "success",
                });
                self.inittable(self.pageno, self.pagesize, "");
                self.dialogfrom = false;
              } else {
                self.$message({
                  message: data.errdesc,
                  type: "warning",
                });
              }
            })
            .catch(function (error) { });
        }
      },

      queryAll: function () {
        this.inputInfo = "";
        this.pageno = 1;
        this.inittable(this.pageno, this.pagesize, "");
      },

      inittable: function (pageno, pagesize, queryName) {
        let self = this;
        if (this.usePage) {
          pageno = this.pageno;
        } else {
          pageno = this.pageno = 1;
        }
        console.log(this.$route.query);
        post("/turnannualresult/queryexamitemlist", {
          command: "turnannualresult/queryexamitemlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemname: queryName, // 查询考核名称
          status: "", //状态 0禁用, 1启用
          pagenum: pageno,
          pagepersize: pagesize,
          sysType: this.$route.query.sysType
            ? this.$route.query.sysType.substr(0, 1)
            : 1,
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.rateList = data.examitemlist;
              self.totalCount = data.totalcount;
            }
            self.usePage = false;
          })
          .catch(function (error) { });
      },

      /*编辑区*/
      edit: function (index, row) {
        let self = this;
        self.hospitalnumber = "";
        self.dialogTitle = "编辑考核项";
        self.dialogshow = 2;
        self.detailid = row.examitemid;
        post("/turnannualresult/getexamitem", {
          command: "turnannualresult/getexamitem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          examitemid: row.examitemid,
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.dialogForm.asmtproject = data.examitemname; //考核项
              self.dialogForm.entire = data.entire; // 考核适用范围
              self.dialogForm.depts = data.deptids ? data.deptids.split(",") : [];
              self.dialogForm.radiotype = data.status;
              self.dialogForm.examitemtype = data.examitemtype;
              self.dialogfrom = true;
              self.editdisabled = true;
            }
          })
          .catch(function (error) { });
      },
      editsaveform: function () {
        let self = this;
        if (self.dialogForm.asmtproject === "" || !self.dialogForm.asmtproject) {
          self.$message({
            message: "请选择考核项",
            type: "warning",
          });
        } else {
          post("/turnannualresult/updateexamitem", {
            command: "turnannualresult/updateexamitem",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            examitemid: self.detailid,
            examitemname: self.dialogForm.asmtproject, //考核项
            entire: self.dialogForm.entire,
            depts: self.dialogForm.depts,
            status: self.dialogForm.radiotype,
            examitemtype: self.dialogForm.examitemtype,
            sysType: self.sysType,
          })
            .then(function (data) {
              if (data && data.errcode == 0) {
                self.$message({
                  message: "编辑成功",
                  type: "success",
                });
                self.usePage = true;
                self.inittable(self.pageno, self.pagesize, self.inputInfo);
                self.dialogfrom = false;
              } else {
                self.$message({
                  message: data.errdesc,
                  type: "warning",
                });
              }
            })
            .catch(function (error) { });
        }
      },

      disabled: function (index, row) {
        let self = this;
        let _opt = "";
        let _radiotype = "";
        if (row.status == 0) {
          _radiotype = 1;
          _opt = "启用";
        } else {
          _radiotype = 0;
          _opt = "禁用";
        }
        self
          .$confirm("请确认是否" + _opt + "该考核项?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            post("/turnannualresult/updateexamitemstatus", {
              command: "turnannualresult/updateexamitemstatus",
              sessionid: getCookie("sid"),
              loginid: getCookie("uid"),
              examitemid: row.examitemid,
              status: _radiotype,
            })
              .then(function (data) {
                if (data && data.errcode == 0) {
                  self.$message({
                    message: _opt + "成功",
                    type: "success",
                  });
                  self.usePage = true;
                  self.inittable(self.pageno, self.pagesize, self.inputInfo);
                  self.dialogfrom = false;
                } else {
                  self.$message({
                    message: data.errdesc,
                    type: "warning",
                  });
                }
              })
              .catch(function (error) { });
          })
          .catch(() => {
            self.$message({
              type: "warning",
              message: "已取消" + _opt,
            });
          });
      },
      //分页区
      handleSizeChange(size) {
        this.pagesize = size;
        this.inittable(this.pageno, this.pagesize, this.inputInfo);
      },
      handleCurrentChange(currentPage) {
        this.pageno = currentPage;
        this.usePage = true;
        this.inittable(this.pageno, this.pagesize, this.inputInfo);
      },

      doSelectQuery: function () {
        //查询方法
        let self = this;
        this.pageno = 1;
        self.inittable(self.pageno, self.pagesize, self.inputInfo);
      },

      //删除
      delExamItem() {
        let self = this;
        if (self.deletelist.length > 0) {
          self
            .$confirm("请确认是否删除该考核项?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              post("/turnannualresult/deleteexamitem", {
                command: "turnannualresult/deleteexamitem",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                examitemidlist: self.deletelist, //成绩id
              })
                .then(function (data) {
                  if (data && data.errcode == 0) {
                    self.$message({
                      message: "删除成功",
                      type: "success",
                    });
                    self.usePage = true;
                    self.inittable(self.pageno, self.pagesize, self.inputInfo);
                  } else {
                    self.$message({
                      message: data.errdesc,
                      type: "warning",
                    });
                  }
                })
                .catch(function (error) { });
            })
            .catch(() => {
              self.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        } else {
          self.$message({
            type: "warning",
            message: "请选择删除的考核项",
          });
        }
      },

      handleSelectionChange: function (item) {
        //全选的方法
        let self = this;
        self.deletelist = [];
        for (var i = 0; i < item.length; i++) {
          self.deletelist.push(item[i].examitemid);
        }
      },
      // 审核
      checkExamItem() { },
      // 评分表下载
      downloadScoreSheet() {
        let data = {
          command: "turnannualresult/exportExamItemInfoItem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          command: "turnannualresult/turnExamInfoExamMould",
        };
        exportMouldExcel(data);
      },
    },
  };
</script>

<style lang="scss">
  .select-items-box {
    height: 1000px;
    .el-dialog {
      height: 600px
    }
  }
</style>

<style scoped>
  .dialog-footer {
    text-align: right;
  }

  .wapper {
    padding: 0 20px;
    padding-bottom: 90px;
  }

  .tool-boxs {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .tools::before,
  .tools::after {
    content: " ";
  }

  .funcTools {
    float: left;
  }

  .search {
    float: right;
  }

  .queryTools {
    float: left;
    width: 100%;
  }

  .queryAll {
    float: left;
    margin-right: 12px;
  }

  .queryTools .el-form-item {
    width: 190px;
    margin-bottom: 10px;
  }

  .funcBtns {
    width: 80px;
    float: left;
  }

  /* .el-select {
            width: 120px;
        } */

  .import-popup {
    font-size: 20px;
  }

  .footerBtn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .tip-circle {
    display: inline-block;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    font-size: 28px;
    text-align: center;
    color: white;
    background-color: #58b7ff;
    border-radius: 30px;
  }

  .import-popup-btn {
    position: relative;
    left: 10px;
    top: -2px;
  }

  .right {
    margin-left: 10px;
  }

  .elRowStyle {
    overflow-x: hidden;
  }

  .upload-demos {
    display: inline-block;
    margin: 0px 15px;
  }

  /*弹窗内容样式*/
  .red {
    color: red;
  }

  .newandedit {
    margin: 8px 0px;
  }

  .newandedit .row {
    display: flex;
    margin-top: 10px;
  }

  .newandedit label {
    width: 100px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }

  .newandedit>.el-input {
    display: inline-block;
  }

  .newandedit>div>.el-select {
    width: 192px;
  }

  .depts {
    display: flex;
    align-items: center;
    margin-left: 90px;
  }

  .dept-box {
    display: flex;
    align-items: center;
    width: 400px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    height: 36px;
    padding: 0 10px;
    margin: 0 14px 0 20px;
  }

  .row label {
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .row>div {
    flex: 7;
  }

  .bottomBtns {
    float: right;
    margin-left: 20px;
  }

  .circleRoomInfo {
    padding: 10px 0px 30px 0px;
    margin-bottom: 15px;
  }

  .detailcircleRoomInfo {
    padding: 15px;
  }

  .circleRoomInfo>.el-col-10>.el-select {
    width: 100% !important;
  }

  .querybtn {
    margin-left: 20px;
  }

  .relation_query {
    margin-bottom: 20px;
  }

  .relation_query .el-input {
    width: 80%;
  }

  .relation_query .el-button {
    width: 15%;
    margin-left: 10px;
  }

  .el-dialog--tiny {
    min-width: 500px;
  }

  .relationProject {
    border: 1px solid #bfcbd9;
    height: 36px;
    border-radius: 4px;
    padding-left: 5px;
  }

  .funTools {
    float: right;
  }

  .el-dialog__wrapper /deep/.el-dialog--tiny {
    min-width: 600px;
  }

  /* 适用范围选择 */
  .tree-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .left-tree-box,
  .right-tree-box {
    overflow: hidden;
  }

  .left-top,
  .right-top {
    height: 40px;
  }

  .left-tree-box>>>.el-tree,
  .right-tree-box>>>.el-tree {
    height: 400px;
    overflow: scroll;
  }

  .tree-footer {
    display: flex;
    align-items: center;
    float: right;
    margin-top: 16px;
  }

  .operation-content-box {
    display: flex;
    align-items: flex-start;
    margin: 12px 0 10px 20px;
  }

  .operation-footer-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  /* 评分表 */
  .table-score-sheet {
    width: 100%;
  }

  .table-score-sheet>>>.cell {
    padding: 10px;
  }

  .dept-box {
    overflow: hidden;
  }

  .score-sheet-footer {
    margin-top: 10px;
    display: flex;
    align-content: center;
    justify-content: flex-end;
  }

  .btn-top-box {
    margin-bottom: 10px;
  }

  .score-sheet-title {
    text-align: right;
    border-top: 1px solid #ccc;
    padding: 6px 6px 6px 0;
    font-weight: 600;
  }

  .select-items-box>>>.el-dialog--small {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .upload-tips {
    margin-bottom: 10px;
  }

  .upload-tips div {
    padding: 5px 0;
  }

  .upload-tips div span {
    color: red;
    padding-right: 6px;
  }

  .upload-box {
    display: flex;
    align-items: flex-end;
  }

  .btn-upload {
    height: 28px;
  }
</style>