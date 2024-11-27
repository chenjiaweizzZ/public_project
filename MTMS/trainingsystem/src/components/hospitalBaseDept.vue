<template>
  <div class="selectHosBasedept">
    <div class="hasFormItem">
      <el-form-item label="所属院区">
        <el-select v-model="formInline.hospitalId" placeholder="全部" @change="changeHosiptal">
          <el-option label="全部" value></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in hospitalList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业基地" v-if="!multiBase">
        <el-select v-model="formInline.baseId" placeholder="全部" @change="changeBase">
          <el-option label="全部" value></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in baseList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业基地" v-if="multiBase" class="multipleSele">
        <el-select v-model="formInline.baseIdList" placeholder="全部" @change="changeBaseList" multiple collapse-tags>
          <el-option :label="item.name" :value="item.id" v-for="item in baseList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="deptTitle" v-if="hasDept">
        <el-select v-model="formInline.deptId" placeholder="全部" @change="changeDept" v-if="!showDeptTree && !multiDept">
          <el-option label="全部" value=""></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in deptList"></el-option>
        </el-select>
        <el-select v-model="formInline.deptIdName" placeholder="全部" @change="changeDept" v-if="showDeptTree  && !multiDept">
          <el-option label="全部" value=""></el-option>
          <el-tree :data="turnDeptRoom" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
            ref="treeDom" class="selfTree"></el-tree>
        </el-select>
        <el-select v-model="formInline.deptIdList" placeholder="全部" @change="changeDept" v-if="multiDept" multiple collapse-tags
          class="multipleSeleDept">
          <el-option :label="item.name" :value="item.id" v-for="item in deptList"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
  import { post, getCookie, getStorage } from '../config/util';
  export default {
    data() {
      return {
        menuId: "",
        formInline: {
          hospitalId: "",
          baseId: "",
          deptId: "",
          deptIdName: "",
          baseIdList: [],
          deptIdList: []
        },
        defaultProps: {
          label: 'name',
          children: 'childrens'
        },
        showDeptTree: false,
        turnDeptRoom: [], // 院区-科室树
        deptList: [],
        hospitalList: [],
        baseList: []
      }
    },
    props: {
      needBaseDept: {
        type: Number,
        default: 1
      },
      multiDept: {
        type: Boolean,
        default: false
      },
      hospitalType: {
        type: Number,
        default: -1
      },
      multiBase: {
        type: Boolean,
        default: false
      },
      clearAll: {
        type: Boolean,
        default: false
      },
      hasHospital: {
        type: Boolean,
        default: true
      },
      hasBase: {
        type: Boolean,
        default: true
      },
      hasDept: {
        type: Boolean,
        default: true
      },
      isForm: {
        type: Boolean,
        default: true
      },
      canNoBase: {
        type: Boolean,
        default: false
      },
      deptTitle: {
        type: String,
        default: "科室"
      },
    },
    watch: {
      clearAll(newVal, oldVal) {
        if (newVal > 0) {
          this.formInline.hospitalId = ""
          this.formInline.baseId = this.multiBase ? [] : ""
          this.formInline.baseIdList = []
          this.formInline.deptId = ""
          this.formInline.deptIdName = ""
          this.formInline.deptIdList = []
          // this.$emit("updateSelectIds", this.formInline)
        }
      }
    },
    // ifForm 是否要嵌入表单结构中   canNoBaese: 是否可以不选基地直接选择科室
    created() {
      this.menuId = getStorage("menuId")
      this.getHospital();
      if (this.multiBase) {
        this.formInline.baseId = []
      }

    },
    methods: {
      nodeClick(node) {
        if (node.deptlevel == 1 || node.havePermission != 1) {
          return false;
        }
        this.formInline.deptIdName = node.name
        this.formInline.deptId = node.id
        this.$emit("updateSingleDept", node)
      },
      isNoBase() {
        let baseFlag = this.formInline.baseId == "" || this.formInline.baseId == undefined || this.formInline.baseId == null
        return baseFlag
      },
      changeDept() {
        this.$emit("updateSelectIds", this.formInline)
      },
      changeHosiptal(val) {
        this.formInline.baseId = this.multiBase ? [] : ""
        this.formInline.deptId = ""
        this.formInline.deptIdName = ""
        this.formInline.baseIdList = [],
          this.formInline.deptIdList = []
        this.baseList = []
        this.deptList = []
        this.turnDeptRoom = []
        if (val == undefined || val == null || val == "") {
          this.$emit("updateSelectIds", this.formInline)
          return false
        }
        let baseFlag = this.isNoBase()
        if (this.canNoBase && baseFlag && this.hasDept) {
          this.showDeptTree = true
          this.getDeptTree();
        } else {
          this.showDeptTree = false
        }
        this.getBaseList();
        this.$emit("updateSelectIds", this.formInline)
      },
      changeBaseList(val) {
        this.formInline.deptId = ""
        if (val == undefined || val == null || val == "") {
          this.formInline.baseId = []
        } else {
          this.formInline.baseId = val
        }
        if (this.multiDept) {
          this.getDeptList()
        }
        this.$emit("updateSelectIds", this.formInline)
      },
      changeBase(val) {
        this.formInline.deptId = ""
        this.formInline.deptIdName = ""
        this.deptList = []
        this.turnDeptRoom = []
        if (val == undefined || val == null || val == "") {
          this.formInline.baseId = ""
          if (this.canNoBase && this.hasDept) {
            this.showDeptTree = true
            this.getDeptTree();
          }
          this.$emit("updateSelectIds", this.formInline)
          return false
        } else {
          this.showDeptTree = false
          if (this.hasDept) {
            this.getDeptList()
          }

        }
        this.$emit("updateSelectIds", this.formInline)
      },
      getDeptTree() {
        this.turnDeptRoom = []
        post("/base/dept/getMyDeptTree", {
          showHospital: 0,
          showNoDeptHospital: 0,
          needBaseDept: this.needBaseDept,
          hospitalId: this.formInline.hospitalId,
          menusId: this.menuId
        }).then(data => {
          if (data && data.resCode == 200) {
            this.turnDeptRoom = data.model;
          }
        });
      },
      getDeptList() {
        this.deptList = []
        let params = {
          pid: this.formInline.hospitalId,
          menusId: this.menuId
        }
        if (this.multiDept) {
          params.baseIdList = this.formInline.baseId
        } else {
          params.baseId = this.formInline.baseId
        }
        post("/base/dept/listMyDept", params).then(res => {
          if (res.resCode == 200) {
            this.deptList = res.model
          } else {
            this.$message({
              message: res.resMsg,
              type: 'warning'
            });
          }
        });
      },
      getBaseList() {
        post("/base/dept/listMyBase", {
          pid: this.formInline.hospitalId,
          menusId: this.menuId
        }).then(res => {
          if (res.resCode == 200) {
            this.baseList = res.model;
          } else {
            this.$message({
              message: res.resMsg,
              type: 'warning'
            });
          }
        });
      },
      getHospital() {
        post("/base/dept/listMyHospital", {
          type: this.hospitalType != -1 ? this.hospitalType : 1,
          menusId: this.menuId
        }).then(res => {
          if (res.resCode == 200) {
            this.hospitalList = res.model;
          } else {
            this.$message({
              message: res.resMsg,
              type: 'warning'
            });
          }
        });
      },
    }
  }
</script>
<style>
  .selectHosBasedept .hasFormItem .el-select {
    width: 120px;

  }

  .selectHosBasedept .multipleSele .el-select {
    width: 210px;
  }

  .selectHosBasedept .multipleSeleDept.el-select {
    width: 210px;
  }

  .selfTree.el-tree {
    padding-right: 13px;
  }

  .selfTree {
    border: none;
  }
</style>
<style scoped>
  .selectHosBasedept {
    display: inline-block;
  }
</style>