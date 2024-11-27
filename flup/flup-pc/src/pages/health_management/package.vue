<template>
  <div class="package">
    <div class="header">
      <div class="search">
        <section>
          <span class="title">服务内容类别</span>
          <el-select v-model="packageType" filterable clearable placeholder="请选择" @change="Search">
            <el-option label="健康咨询" :value="1"></el-option>
            <el-option label="健康服务" :value="2"></el-option>
          </el-select>
        </section>
        <section>
          <span class="title">服务内容分类</span>
          <el-select v-model="classId" filterable clearable placeholder="请选择" @change="Search">
            <el-option v-for="item in options3" :key="item.classId" :label="item.className" :value="item.classId">
            </el-option>
          </el-select>
        </section>
        <section>
          <span class="title">上架状态</span>
          <el-select v-model="isOnline" clearable placeholder="请选择" @change="Search">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </section>
        <section>
          <el-input style="width: 299px" clearable v-model="keyWord" placeholder="请输入关键字查询">
            <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
          </el-input>
        </section>
      </div>
      <el-button type="primary" @click="addClick" plain>新增服务内容</el-button>
    </div>
    <div class="d-table">
      <el-table :data="mainList" border stripe height="100%">
        <el-table-column type="index" width="80px" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip label="服务内容名称" prop="packageName" width="250"></el-table-column>
        <el-table-column show-overflow-tooltip label="服务内容描述" prop="packageDiscription"></el-table-column>
        <el-table-column show-overflow-tooltip label="服务内容类别">
          <template slot-scope="scope">
            {{
              scope.row.packageType == 1
                ? "健康咨询"
                : scope.row.packageType == 2
                ? "健康服务"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="创建人" prop="creatorName" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="分类" prop="className" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="更新时间" prop="updateTime" width="170"></el-table-column>
        <el-table-column show-overflow-tooltip label="服务内容排序" prop="showOrder"></el-table-column>
        <el-table-column show-overflow-tooltip label="更新时间" prop="updateTime" width="170"></el-table-column>
        <el-table-column show-overflow-tooltip label="推荐到橄榄云首页" width="180">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.packageType == 2" v-model="scope.row.showOnHome" active-color="#13ce66" inactive-color="#f2f2f2" :active-value="1" :inactive-value="0" @input="Change1($event, scope.row)">
            </el-switch> </template>
          </el-table-column>
        <el-table-column show-overflow-tooltip label="上架状态" width="120"><template slot-scope="scope">
            <el-switch v-if="scope.row.packageType == 2 || scope.row.packageType == 1" v-model="scope.row.isOnline" active-color="#13ce66" inactive-color="#f2f2f2" :active-value="1" :inactive-value="0" @change="Change2($event, scope.row)">
            </el-switch> </template></el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="Edit(scope.row)">修改</el-button>
            <el-button type="text" @click="Preview(scope.row)">预览</el-button>
            <el-button type="text" @click="Configuration(scope.row)">配置</el-button>
            <el-button type="text" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="pageBottom" :page-sizes="[10, 20, 30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="pageNo" :page-size="pageSize" layout="total,sizes,prev, pager, next" :total="total"></el-pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="800px" :before-close="hide">
      <!-- <el-form ref="previewForm" :model="form" :rules="rules" label-position="right">
      </el-form>
      <el-form ref="detailForm" :model="form" :rules="rules" label-position="right">
      </el-form> -->
      <el-form ref="form" :model="form" label-position="right" :rules="rules">
        <el-form-item label="服务内容类别" label-width="130px" prop="packageType">
          <el-radio v-model="form.packageType" :label="1">健康咨询</el-radio>
          <el-radio v-model="form.packageType" :label="2">健康服务</el-radio>
        </el-form-item>
        <el-form-item label="服务内容预览图" label-width="130px" prop="previewUrl">
          <el-upload ref="upload1" action list-type="picture-card" :file-list="fileList" :before-upload="beforeUpload" :http-request="httpRequest" :on-remove="onRemove" :on-change="onChange">
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">
              支持JPEG，PNG，JPG格式。建议大小750*320
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="服务内容详情图" label-width="130px" prop="introduceUrl" v-if="form.packageType == 2">
          <el-upload ref="upload2" action list-type="picture-card" :before-upload="beforeUpload1" :file-list="fileList1" :http-request="httpRequest1" :on-remove="onRemove1" :on-change="onChange1">
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">
              支持JPEG，PNG，JPG格式。 建议大小宽度750，高度不限
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="服务内容名称" label-width="130px" prop="packageName">
          <el-input v-model="form.packageName" maxlength="30" placeholder="最多不超过30个字" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="健康管理组" label-width="130px" prop="groupId" v-if="form.packageType == 2">
          <el-select v-model="form.groupId" filterable placeholder="请选择" style="width: 300px;">
            <el-option v-for="(item, index) in flupGroupList" :key="index" :label="item.groupName" :value="item.serialNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生选择" label-width="130px" prop="doctorId" v-if="form.packageType == 1">
          <el-select v-model="form.doctorId" filterable placeholder="请选择" style="width: 300px;" @change="doctorSelect">
            <el-option v-for="(item, index) in doctorList" :key="index" :label="item.doctorName" :value="item.doctorId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务内容排序" label-width="130px" prop="showOrder">
          <el-input-number style="width: 300px;max-width: 300px;" v-model="form.showOrder" controls-position="right" placeholder="同分类内，越大越靠前（橄榄云端）" :min="0" :max="2147483647"></el-input-number>
        </el-form-item>
        <el-form-item label="服务内容分类" label-width="130px" prop="classId">
          <el-select v-model="form.classId" filterable placeholder="请选择" style="width: 300px;">
            <el-option v-for="(item, index) in options3" :key="index" :label="item.className" :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" label-width="130px" prop="deptId">
          <el-select v-model="form.deptId" filterable placeholder="请选择" style="width: 300px;">
            <el-option v-for="(item, index) in deptTypeList" :key="index" :label="item.deptName" :value="item.serialNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务内容描述" label-width="130px" prop="packageDiscription" v-if="form.packageType == 2">
          <el-input type="textarea" resize="none" maxlength="200" :rows="4" show-word-limit v-model="form.packageDiscription" style="width: 300px;" placeholder="请输入服务内容详情描述"></el-input>
        </el-form-item>
        <span style="margin-bottom: 10px;display: inline-block;">规格</span>
        <div class="form-table">
          <section>
            <div class="item" style="width: 10%;">
              序号
            </div>
            <div class="item" style="width: 20%;">规格名称</div>
            <div class="item" style="width: 20%;">描述</div>
            <div class="item" style="width: 20%;">价格</div>
            <div class="item" style="width: 15%;">平台商城售卖</div>
            <div class="item" style="width: 15%;">操作</div>
          </section>
          <div v-for="(rowItem, rowIndex) in form.platPackageSpecInfoDtoList" :model="rowItem" :key="rowIndex" class="list">
            <el-form-item class="item" style="width: 10%;">{{ rowIndex + 1 }}
            </el-form-item>
            <el-form-item class="item" style="width: 20%;" :prop="`platPackageSpecInfoDtoList[${rowIndex}].specName`" :rules="{
                required: true,
                message: '请输入规格名称',
                trigger: 'change'
              }">
              <el-input v-model="rowItem.specName" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item class="item" style="width: 20%;" :prop="`platPackageSpecInfoDtoList[${rowIndex}].specDiscription`" :rules="{
                required: true,
                message: '请输入规格描述',
                trigger: 'change'
              }"><el-input v-model="rowItem.specDiscription"></el-input>
            </el-form-item>
            <!-- @input="limitInput($event, rowItem)" -->
            <el-form-item class="item" style="width: 20%;" :prop="`platPackageSpecInfoDtoList[${rowIndex}].price`" :rules="{
                required: true,
                message: '请输入价格',
                trigger: 'change'
              }"><el-input-number v-model="rowItem.price" controls-position="right" :precision="2" :step="0.01" :min="0" :max="100000"></el-input-number>
            </el-form-item>
            <el-form-item class="item" style="width: 15%;"><el-switch v-model="rowItem.showOnCloud" active-color="#13ce66" inactive-color="#f2f2f2" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item class="item" style="width: 15%;">
              <el-button type="text" @click="Increase">添加</el-button>
              <el-button type="text" @click="DeletshowOnHome(rowIndex)">删除</el-button></el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="Determine">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "新增服务内容",
      classId: "",
      isOnline: null,
      value3: "",
      keyWord: "",
      dialogVisible: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      deleteId: [],
      packageType: "",
      form: {
        packageName: "",
        showOrder: "",
        classId: "",
        previewUrl: "",
        introduceUrl: "",
        packageDiscription: "",
        deptId: "",
        packageType: "",
        groupId: "",
        doctorId: "",
        doctorName: "",
        platPackageSpecInfoDtoList: [
          {
            specName: "",
            specDiscription: "",
            price: "",
            showOnCloud: 0,
          },
        ],
      },
      options2: [
        {
          label: "未上架",
          value: 0,
        },
        {
          label: "已上架",
          value: 1,
        },
      ],
      options3: [], // 分类列表
      mainList: [],
      rules: {
        packageName: [
          { required: true, message: "请输入服务内容名称", trigger: "change" },
        ],
        showOrder: [
          { required: true, message: "请输入服务内容分类排序", trigger: "change" },
        ],
        classId: [
          { required: true, message: "请选择服务内容分类", trigger: "change" },
        ],
        groupId: [
          { required: true, message: "请选择健康管理组", trigger: "change" },
        ],
        doctorId: [
          { required: true, message: "请选择医生", trigger: "change" },
        ],
        previewUrl: [
          {
            required: true,
            message: "请上传服务内容预览图",
            trigger: "change",
          },
        ],
        introduceUrl: [
          {
            required: true,
            message: "请上传服务内容详细介绍图",
            trigger: "change",
          },
        ],
        packageDiscription: [
          {
            required: true,
            message: "请输入服务内容详情描述",
            trigger: "change",
          },
        ],
        deptId: [{ required: true, message: "请选择科室", trigger: "change" }],
        packageType: [
          { required: true, message: "请选择服务内容类别", trigger: "change" },
        ],
      },
      fileList: [],
      fileList1: [],
      ceshi: false,
      ceshi1: false,
      deptTypeList: [], // 科室列表
      flupGroupList: [],
      doctorList: []
    };
  },
  created() {
    this.getListPlatPackageInfo();
    this.getAllPackageClassList();
    this.getQueryDeptTypeList();
    this.getFlupGroupList();
  },
  watch: {
    'form.packageType'(newValue) {
      if(newValue == 2) {
        this.form.doctorId = ""
        this.form.doctorName = ""
      }else if(newValue == 1) {
        this.form.packageDiscription = ""
        this.form.groupId = ""
      }
    }
  },
  methods: {
    doctorSelect(doctorId) {
      this.doctorList.forEach(i => {
        if(i.doctorId == doctorId) this.form.doctorName = i.doctorName
      })
    },
    getFlupGroupList() {
      this.$apis
        .groupgetFlupGroupList({
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
          pageNo: 1,
          pageSize: 999,
        })
        .then((res) => {
          this.flupGroupList = res.list;
        });
    },
    /**
     * 获取科室列表
     */
    getQueryDeptTypeList() {
      this.$apis.queryDeptTypeList().then((res) => {
        this.deptTypeList = res;
      });
    },
    /**
     * 获取分类列表数据
     */
    getAllPackageClassList() {
      this.$apis
        .getAllPackageClassList({
          pageNum: 1,
          pageSize: 999,
        })
        .then((res) => {
          this.options3 = res.list;
        });
    },
    /**
     * 获取服务内容列表
     */
    getListPlatPackageInfo() {
      this.$apis
        .listPlatPackageInfo({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          classId: this.classId,
          isOnline: this.isOnline,
          packageType: this.packageType,
          keyWord: this.keyWord,
        })
        .then((res) => {
          if (res.total > 0 && res.list.length == 0) {
            this.pageNo = this.pageNo - 1;
            this.getListPlatPackageInfo();
          } else {
            this.total = res.total;
            this.mainList = res.list;
          }
        });
    },
    /**
     * 搜索
     */
    Search() {
      this.pageNo = 1;
      this.getListPlatPackageInfo();
    },
    addClick() {
      this.getDoctorList()
      this.$apis.getMaxOrder().then(res => {
        this.form.packageType = 1;
        this.title = "新增服务内容";
        this.dialogVisible = true;
        this.form.showOrder = Number(res) + 1 || 0
      })
    },
    getDoctorList() {
      this.$apis.getAllDoctorList({doctorName: ""}).then(res => {
        this.doctorList = res
      })
    },
    Edit(row) {
      this.getDoctorList()
      this.$apis
        .getPackageInfo({
          packageId: row.packageId,
          flag: false,
        })
        .then((res) => {
          this.fileList.push({
            url: res.previewUrl,
          });
          if(res.packageType == 2) {
            this.fileList1.push({
            url: res.introduceUrl,
          });
          }
          this.form = res;
          this.form.platPackageSpecInfoDtoList.forEach((item) => {
            item.price = (item.price / 100).toFixed(2);
          });
          this.title = "修改服务内容";
          this.dialogVisible = true;
        });
    },
    /**
     * 推荐到橄榄云首页
     */
    Change1(callback, obj) {
      if (callback == 1) {
        obj.showOnHome = 0;
      } else {
        obj.showOnHome = 1;
      }
      if (obj.isOnline === 0 && callback === 1) {
        // 该商品暂时无法开通推荐到首页，请先开通上架状态哦～
        this.$confirm(
          "该商品暂时无法开通推荐到首页，请先开通上架状态哦～",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "hm-width",
          }
        )
          .then(() => {})
          .catch(() => {});
      } else {
        this.$apis
          .PackageChangeStatus({
            packageId: obj.packageId,
            status: callback,
            flag: false,
          })
          .then((res) => {
            obj.showOnHome = callback;
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.getListPlatPackageInfo();
          })
          .catch(() => {});
      }
    },
    /**
     * 上架
     */
    Change2(callback, obj) {
      if (callback == 1) {
        obj.isOnline = 0;
      } else {
        obj.isOnline = 1;
      }
      this.$apis
        .PackageChangeStatus({
          packageId: obj.packageId,
          status: callback,
          flag: true,
        })
        .then((res) => {
          obj.isOnline = callback;
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getListPlatPackageInfo();
        })
        .catch(() => {});
    },
    /**
     * 配置服务内容
     */
    Configuration(row) {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      console.log(
        `${urlx}/#/health_management/configuration?packageId=${row.packageId}`
      );
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}/#/health_management/configuration?packageId=${row.packageId}`,
          title: `配置服务内容`,
        }),
        "*"
      );
    },
    /**
     * 预览服务内容
     */
    Preview(row) {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      console.log(
        `${urlx}/#/health_management/preview?picture=${row.introduceUrl}`
      );
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}/#/health_management/preview?picture=${row.introduceUrl}`,
          title: `预览服务内容`,
        }),
        "*"
      );
    },
    /**
     * 删除服务内容
     */
    Delete(row) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "hm-width",
      })
        .then(() => {
          this.$apis
            .deletePackageInfo({
              packageId: row.packageId,
            })
            .then((res) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getListPlatPackageInfo();
            });
        })
        .catch(() => {});
    },
    /**
     * 添加规格
     */
    Increase() {
      this.form.platPackageSpecInfoDtoList.push({
        specName: "",
        specDiscription: "",
        price: "",
        showOnCloud: 0,
      });
    },
    /**
     * 删除规格
     * @param {number} index 需要删除规格的索引
     */
    DeletshowOnHome(index) {
      if (this.form.platPackageSpecInfoDtoList.length === 1) {
        this.$confirm("最后一条数据不允许删除！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
      } else {
        if (this.form.platPackageSpecInfoDtoList[index].specId) {
          this.$apis
            .checkSpecCanDelete({
              specId: this.form.platPackageSpecInfoDtoList[index].specId,
            })
            .then((res) => {
              if (res) {
                this.$confirm("确定要删除吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  customClass: "hm-width",
                }).then(() => {
                  let deleteId = [];
                  this.form.platPackageSpecInfoDtoList[index].specId &&
                    deleteId.push(
                      this.form.platPackageSpecInfoDtoList[index].specId
                    );
                  this.deleteId = this.deleteId.concat(deleteId);
                  this.form.platPackageSpecInfoDtoList.splice(index, 1);
                });
              } else {
                this.$message.error("该服务内容规格已有医院开通，不能删除！");
              }
            });
        } else {
          this.$confirm("确定要删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "hm-width",
          })
            .then(() => {
              this.form.platPackageSpecInfoDtoList.splice(index, 1);
            })
            .catch(() => {});
        }
      }
      //   this.$confirm("确定要删除吗？", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //     .then(() => {
      //       let deleteId = [];
      //       this.form.platPackageSpecInfoDtoList[index].specId &&
      //         deleteId.push(this.form.platPackageSpecInfoDtoList[index].specId);
      //       this.deleteId = this.deleteId.concat(deleteId);
      //       this.form.platPackageSpecInfoDtoList.splice(index, 1);
      //     })
      //     .catch(() => {});
      // }
    },
    /**
     * 取消新增、编辑服务内容
     */
    hide() {
      this.form = this.$options.data.call(this).form;
      this.$nextTick(() => {
        this.$refs.upload1 && this.$refs.upload1.clearFiles();
        this.$refs.upload2 && this.$refs.upload2.clearFiles();
        this.$refs.form && this.$refs.form.clearValidate();
        this.$refs.previewForm && this.$refs.previewForm.clearValidate();
        // this.$refs.detailForm && this.$refs.detailForm.clearValidate();
      });
      this.dialogVisible = false;
      this.deleteId = [];
      this.fileList = [];
      this.fileList1 = [];
    },
    /**
     * 新增、编辑服务内容，保存
     */
    Determine() {
      // let p1 = new Promise((reslove, reject) => {
      //   this.$refs.previewForm.validate((valid) => {
      //     if (valid) {
      //       return reslove();
      //     } else {
      //       return;
      //     }
      //   });
      // });
      // let p2 = new Promise((reslove, reject) => {
      //   this.$refs.detailForm.validate((valid) => {
      //     if (valid) {
      //       return reslove();
      //     } else {
      //       return;
      //     }
      //   });
      // });
      let p3 = new Promise((reslove, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            return reslove();
          } else {
            return;
          }
        });
      });
      Promise.all([p3]).then(async () => {
        this.$confirm("确认要保存修改吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "hm-width",
        }).then(() => {
          let obj = JSON.parse(JSON.stringify(this.form));
          obj.platPackageSpecInfoDtoList.forEach((item) => {
            item.price = item.price * 100;
            if (item.displayPicUrl) {
              let index0 = item.displayPicUrl.lastIndexOf("/");
              item.displayPicUrl = item.displayPicUrl.slice(index0 + 1);
            }
          });
          obj.showOrder = Number(obj.showOrder);
          let index = obj.introduceUrl.lastIndexOf("/");
          let index2 = obj.previewUrl.lastIndexOf("/");
          obj.introduceUrl = obj.packageType == 2 ? obj.introduceUrl.slice(index + 1) : "";
          obj.previewUrl = obj.previewUrl.slice(index2 + 1);
          this.$apis
            .saveOrEditPackageInfo({
              ...obj,
              isOnline: obj.packageType == 1 ? 1 : 0,
              deletePlatPackageSpecIdList:
                this.deleteId.length > 0 ? this.deleteId : null,
            })
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.hide();
              this.getListPlatPackageInfo();
            });
        });
      });
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getListPlatPackageInfo();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getListPlatPackageInfo();
    },
    /**
     * 图片上传
     */
    beforeUpload(file) {
      let fileMsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (
        fileMsg == "JPEG" ||
        fileMsg == "JPG" ||
        fileMsg == "PNG" ||
        fileMsg == "jpeg" ||
        fileMsg == "jpg" ||
        fileMsg == "png"
      ) {
        this.ceshi = false;
        return true;
      } else {
        this.$message.error("请上传JPEG，JPG，PNG类型文件!");
        this.ceshi = true;
        return false;
      }
    },
    beforeUpload1(file) {
      let fileMsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (
        fileMsg == "JPEG" ||
        fileMsg == "JPG" ||
        fileMsg == "PNG" ||
        fileMsg == "jpeg" ||
        fileMsg == "jpg" ||
        fileMsg == "png"
      ) {
        this.ceshi1 = false;
        return true;
      } else {
        this.$message.error("请上传JPEG，JPG，PNG类型文件!");
        this.ceshi1 = true;
        return false;
      }
    },
    httpRequest(v) {
      const formDataFile = new FormData();
      formDataFile.append("file", v.file);
      this.$apis
        .upload(formDataFile)
        .then((res) => {
          let imageUrl = this.$baseURL.ICDMApiUrl + "/file/image/" + res.id;
          this.form.previewUrl = imageUrl;
          // this.$refs.previewForm.validate();
        })
        .catch((err) => {
          console.log(err)
          this.$refs.upload1 && this.$refs.upload1.clearFiles();
        });
    },
    httpRequest1(v) {
      const formDataFile = new FormData();
      formDataFile.append("file", v.file);
      this.$apis
        .upload(formDataFile)
        .then((res) => {
          let imageUrl = this.$baseURL.ICDMApiUrl + "/file/image/" + res.id;
          this.form.introduceUrl = imageUrl;
          // this.$refs.detailForm.validate();
        })
        .catch((err) => {
          this.$refs.upload2 && this.$refs.upload2.clearFiles();
        });
    },
    onRemove() {
      if (this.form.previewUrl && !this.ceshi) {
        this.form.previewUrl = "";
        // this.$refs.previewForm.validate();
      }
    },
    onRemove1() {
      if (this.form.previewUrl && !this.ceshi1) {
        this.form.introduceUrl = "";
        // this.$refs.detailForm.validate();
      }
    },
    onChange(file, fileList) {
      console.log(file,fileList)
      this.$nextTick(() => {
        if (fileList.length > 1 && !this.ceshi) {
          fileList.splice(0, 1);
        }
        this.ceshi = false;
      });
    },
    onChange1(file, fileList) {
      this.$nextTick(() => {
        if (fileList.length > 1 && !this.ceshi1) {
          fileList.splice(0, 1);
        }
        this.fileList1 = fileList;
        this.ceshi1 = false;
      });
    },
    // limitInput(value, rowItem) {
    //   rowItem.price =
    //     ("" + value) // 第一步：转成字符串
    //       .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
    //       .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
    //       .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
    //       .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
    // }
  },
};
</script>
<style lang="scss" scoped>
.package {
  height: calc(100% - 82px);
  margin: 0 24px 20px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background-color: #f2f2f2;
    padding-right: 20px;
    margin-bottom: 10px;
    .search {
      display: flex;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        margin-right: 14px;
      }
    }
  }
  .d-table {
    overflow-y: auto;
    flex: 1;
  }
  .form-table {
    border: 1px solid #e6e6e6;
    section {
      border-bottom: 1px solid #e6e6e6;
      height: 57px;
      display: flex;
      .item {
        line-height: 57px;
        border-right: 1px solid #e6e6e6;
        text-align: center;
      }
    }
    .list {
      display: flex;
      border-bottom: 1px solid #e6e6e6;
      .item {
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #e6e6e6;
        margin: 0 !important;
        padding: 4px 4px 18px 4px !important;
      }
    }
  }
}
</style>
<style lang="scss">
.package {
  .el-upload--picture-card {
    height: 128px !important;
    width: 300px !important;
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      height: 128px !important;
      width: 300px !important;
      margin-bottom: -15px !important;
    }
  }
  .el-upload-list__item {
    transition: none !important;
    -webkit-transition: nonne !important;
  }
  .el-upload-list__item-name {
    transition: none !important;
    -webkit-transition: none !important;
  }
}
</style>
