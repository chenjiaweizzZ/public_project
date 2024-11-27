<template>
  <div class="addScoreTemplate">
    <el-form :model="form" label-width="120px" label-position="left" class="sheetInfo">
      <el-form-item label="活动名称" v-if="type == 4">
        <el-input v-model="form.activeName" placeholder="请输入" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item :label="type == 4 ? '问卷标题' : '评分模板名称'">
        <span style="color: red" class="required" v-if="type == 4">*</span>
        <el-input v-model="form.name" placeholder="请输入" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item :label="type == 1 ? '日常评价类型' : (type == 2 ? '督导类型' :'问卷类型')" v-if="type != 4 && type != 5 && type != 6">
        <el-select v-model="form.type" clearable placeholder="请选择" @change="typeNameChange">
          <el-option :label="item.typeName" :value="item.typeValue" v-for="item in typeList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学活动类型" v-if="type == 6 || (type == 2 && (form.type == 1 || form.type == 2))">
        <el-select v-model="form.teachingActions" clearable multiple placeholder="请选择" @change="typeNameChange">
          <el-option :label="item.name" :value="item.key" v-for="item in teachingActionList" :disabled="item.havePermission != 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用范围" prop="scope" v-if="type == 5 || type == 6 || type == 2">
        <el-radio-group v-model="form.scope" @input="changeTypeVal">
          <el-radio label="0">全部</el-radio>
          <el-radio label="1">部分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.scope == 1" label="">
        <el-select v-model="form.deptName" placeholder="请选择科室" multiple @remove-tag="removeNode">
          <el-option value="form.deptName" style="height: auto;">
            <el-tree ref="tree" :data="deptTree" node-key="id" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="true"
              :props="props" @check-change="handleCheckChange1" class="selfTree" show-checkbox></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="type == 4 ? '问卷说明' : '说明'">
        <span style="color: red" class="required" v-if="type == 4">*</span>
        <el-input v-model="form.intro" type="textarea" maxlength="250"></el-input>
      </el-form-item>
    </el-form>
    <div class="titleSheet">评分表</div>
    <sheet-Template :questions="detail.questions" @updateData="updateData" @sumbitTemplate="sumbitTemplate" :form="form" :type="type"></sheet-Template>
  </div>
</template>
<script>
  import sheetTemplate from "../../components/sheetTemplate.vue";
  import { post, getCookie } from "../../config/util";
  const deptMap = {}
  export default {
    components: {
      "sheet-Template": sheetTemplate
    },
    data() {
      return {
        optionVal: [],
        deptIdList: [],
        problemVisible: false,
        type: 1,
        detail: {
          questions: []
        },
        typeList: [],
        currentId: "",
        isEdit: false,
        teachingActionList: [],
        deptTreeVoList: [],
        form: {
          activeName: "",
          name: "",
          type: "",
          intro: "",
          scope: "",
          dept: [],
          deptName: [],
          teachingActions: []
        },
        props: {
          label: 'name',
          children: 'childrens',
          disabled: function (data, node) {
            return (data.type == 0 && data.deptlevel == 1) || data.havePermission === 0
          }
        },
        deptTree: []
      }
    },
    created() {
      this.type = this.$route.query.type;
      this.typeList = JSON.parse(this.$route.query.typeJson);
      if (this.$route.query.id === false || this.$route.query.id === "false") {
        this.isEdit = false;
        if (this.type == 6 || this.type == 2) {
          this.getTeachingActionAndDept()
        }
      } else if (
        (this.$route.query.activity_id === false ||
          this.$route.query.activity_id === "false") &&
        this.$route.query.id !== false &&
        this.$route.query.id !== "false" &&
        this.type == 4
      ) {
        this.isEdit = false;
        this.form.activeName = this.$route.query.activeName;
        this.currentId = this.$route.query.id;
        this.getDetail();
      } else {
        this.isEdit = true;
        this.currentId = this.$route.query.id;
        this.$route.meta.title = "编辑模板";
        this.getDetail();
      }
      if (this.type == 4 && this.$route.query.activeName) {
        this.form.activeName = this.$route.query.activeName;
      }
      if (this.type == 5) {
        this.getDeptList();
      }

    },
    methods: {
      getTeachingActionAndDept(type) {
        let temp = {
          showBase: this.type == 6 ? true : false,
          category: this.type == 6 ? 5 : this.type,
          deptIds: this.form.dept,
          teachingActionKeys: this.form.teachingActions,
          scoringTemplateId: this.$route.query.id === false || this.$route.query.id === "false" ? "" : this.$route.query.id,
          scopeType: this.form.scope
        }
        if (this.type == 2) {
          temp['type'] = this.form.type
        }
        post("/base/scoringtemplate/getScoringTemplateTeachingActionAndDept", temp).then(res => {
          if (res && res.resCode == 200) {
            if (type == 2) {
              this.teachingActionList = res.model.teachingActionList
            } else {
              this.deptTree = res.model.deptTreeVoList
              this.teachingActionList = res.model.teachingActionList
            }
          } else {
            this.$message({
              type: "warning",
              message: "请求教学活动类型和科室报错！"
            })
          }
        })
      },
      removeNode(e) {
        this.form.dept = []
        this.form.deptName = []
        let response = this.$refs.tree.getCheckedNodes();
        response.forEach(item => {
          if (e != item.name) {
            this.form.deptName.push(item.name)
            this.form.dept.push(item.id)
          }
        })
        this.$refs.tree.setCheckedKeys(this.form.dept);
        this.getTeachingActionAndDept()
      },

      handleCheckChange1(data, dataObj) {
        if (data.havePermission != 1) {
          return false;
        }
        this.form.deptName = []
        this.form.dept = this.$refs.tree.getCheckedKeys();
        let response = this.$refs.tree.getCheckedNodes();
        response.forEach(item => {
          this.form.deptName.push(item.name)
        })
        this.getTeachingActionAndDept(2)
      },

      getDeptList() {
        let url = ""
        if (this.$route.query.id) {
          url = `/base/scoringtemplatedept/getScoringTemplateDept?scoringTemplateId=${this.$route.query.id}`
        } else {
          url = "/base/scoringtemplatedept/getScoringTemplateDept"
        }
        post(url).then(data => {
          if (data && data.resCode == 200) {
            this.deptTree = data.model
          } else {
            this.$message({
              type: "warning",
              message: data.errdesc
            });
          }
        })
          .catch(error => { });
      },
      changeTypeVal(e) {
        this.form.deptName = []
        this.form.dept = []
        if (e >= 0) {
          if (this.type == 6 || this.type == 2) {
            this.getTeachingActionAndDept()
          } else {
            this.getDeptList()
          }
        }
      },
      updateData({ index, val }) {
        let temp = this.detail.questions[index];
        temp.categoryCopy = val;
        this.detail.questions.splice(index, 1, temp);
      },
      getDetail() {
        post("/scoreTemplate/detail", {
          command: "scoreTemplate/detail",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          id: this.currentId
        })
          .then(data => {
            if (data && data.errcode == 0) {
              data.questions.forEach(item => {
                item.categoryCopy = item.category;
                item.questionList.forEach(citem => {
                  citem.status = String(citem.status);
                  citem.required = String(citem.required);
                  if (citem.type == 1 || citem.type == 2 || citem.type == 5) {
                    citem.items.forEach((val, ind) => {
                      val.scoreStatus = val.scoreStatus == 1 ? false : true;
                      val.reasonStatus = String(val.reasonStatus);
                    });
                  }
                  if (citem.type == 6) {
                    citem.reasonStatus = String(citem.reasonStatus);
                  }
                });
              });
              this.detail = data;

              if ((this.type == 5 || this.type == 2 || this.type == 6) && data.deptList != null && data.scopeType == 1) {
                this.form.dept = []
                this.form.deptName = []
                data.deptList.forEach(item => {
                  this.form.dept.push(item.id)
                  this.form.deptName.push(item.name)
                })
                this.$nextTick(() => {
                  this.$refs.tree.setCheckedKeys(this.form.dept);
                })
              }
              if ((this.type == 2 || this.type == 6) && data.teachingActionTypeDTOList != null) {
                this.form.teachingActions = []
                data.teachingActionTypeDTOList.forEach(item => {
                  this.form.teachingActions.push(item.key)
                })
              }

              this.form.scope = String(data.scopeType);
              this.form.name = data.name;
              this.form.type = String(data.type);
              this.form.intro = data.description;
              if (this.type == 6 || this.type == 2) {
                this.getTeachingActionAndDept()
              }


            } else {
              this.$message({
                type: "warning",
                message: data.errdesc
              });
            }
          })
          .catch(error => { });
      },
      sumbitTemplate(val) {
        if (this.form.name.replace(/\s+/g, "") == "") {
          let tips = this.type == 4 ? "请输入问卷名称" : "请输入模板名称";
          this.$message({
            type: "warning",
            message: tips
          });
          return false;
        }
        if (this.form.type == "" && (![4, 5, 6].includes(Number(this.type)))) {
          this.$message({
            type: "warning",
            message: "请选择模板类型"
          });
          return false;
        }
        if (this.type == 4 && this.form.intro == "") {
          this.$message({
            type: "warning",
            message: "请输入问卷简介"
          });
          return false;
        }
        if (this.type == 6 || (this.type == 2 && (this.form.type == 1 || this.form.type == 2))) {
          if (this.form.teachingActions == undefined || this.form.teachingActions.length == 0) {
            this.$message({
              type: "warning",
              message: "请选择教学活动类型"
            });
            return false;
          }
        }
        if (this.type == 5 || this.type == 6 || this.type == 2) {
          if ((this.form.dept.length == 0 && this.form.scope == 1) || this.form.scope == '') {
            this.$message({
              type: "warning",
              message: "请选择科室"
            });
            return false;
          }
        }


        let params = {
          command: "scoreTemplate/saveOrUpdate",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          name: this.form.name,
          description: this.form.intro,
          category: this.type == 4 ? 3 : (this.type == 5 ? 4 : this.type == 6 ? 5 : this.type),
          type: this.type == 4 || this.type == 5 || this.type == 6 ? 1 : this.form.type,
          questions: val
        };

        if (this.isEdit) {
          params["id"] = this.currentId;
        }
        if (this.type == 4) {
          params["history"] = 2;
        }
        if (this.type == 5) {
          params["deptIds"] = this.form.dept;
          params["scopeType"] = this.form.scope;
        }
        if (this.type == 6 || this.type == 2) {
          params["teachingActions"] = this.form.teachingActions;
          params["deptIds"] = this.form.scope == 1 ? this.form.dept : [];
          params["scopeType"] = this.form.scope;
        }

        post("/scoreTemplate/saveOrUpdate", params).then(data => {
          if (data && data.errcode == 0) {
            if (this.type == 4) {
              this.updateCategoryNaireRecord(data);
            } else {
              this.$message({
                type: "success",
                message: data.errdesc
              });
              this.$router.push({
                name: 'scoringTemplate',
                query: {
                  tabIndex: this.type
                }
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: data.errdesc
            });
          }
        });
      },
      updateCategoryNaireRecord(data) {
        let requestData = {
          command: this.isEdit
            ? "commonNaire/updateCategoryNaireRecord"
            : "commonNaire/saveCategoryNaireRecord",
          name: this.form.activeName,
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          scoringTemplateId: data.id
        };
        let url = "/" + requestData.command;
        if (this.isEdit) {
          requestData["id"] = this.$route.query.activity_id;
        }
        post(url, requestData).then(data => {
          if (data && data.errcode == 0) {
            this.$message({
              type: "success",
              message: "保存成功！"
            });
            window.location.href =
              "/pages/scmp/surveyRecord.html?_t=1669110837694";
          } else {
            this.$message({
              type: "error",
              message: data.errdesc
            });
          }
        });
      },
      addProblem() {
        this.problemVisible = true;
      },
      typeNameChange(value) {
        if (this.type == 1) {
          this.detail.questions = [];
        }
        if (this.type == 6) {
          this.getTeachingActionAndDept()
        }
        if (this.type == 2) {
          if (this.form.type != 1 && this.form.type != 2) {
            this.form.teachingActions = []
          } else {
            this.getTeachingActionAndDept()
          }

        }
      },

      handleCheckChange(dataTree, checked, indeterminate) {
        console.log(dataTree, checked, indeterminate);
      },
      // handleCheckChange1(data, dataObj) {
      //   console.log(data, dataObj);
      // },
      handleNodeClick(dataTree) {
        console.log(dataTree);
      },
    }
  }

</script>
<style>
  .addScoreTemplate .sheetInfo .el-input {
    width: 450px;
  }

  .addScoreTemplate .sheetInfo .el-textarea {
    width: 600px;
  }
</style>
<style scoped>
  .addScoreTemplate {
    padding: 0 20px;
  }

  .required {
    position: absolute;
    top: 0;
    left: -127px;
  }

  .titleSheet {
    height: 48px;
    line-height: 48px;
    text-align: left;
    padding: 0 15px;
  }

  .titleSheet {
    background-color: #eef1f6;
    margin-top: 30px;
  }

  .buttonBox {
    padding-top: 30px;
    text-align: center;
  }

  .nomalButton {
    margin-top: 50px;
    text-align: center;
  }
</style>