<template>
  <div class="selectHosBasedept hospitalBaseDept1">
    <div class="hasFormItem">
      <el-form-item label="所属院区" v-if="hasHospital">
        <el-select v-model="formInline.hospitalId" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in hospitalList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业基地" v-if="!multiBase && hasBase" label-width="80px">
        <el-select v-model="formInline.baseName" placeholder="全部" @change="changeBase" :filter-method="($event) => searchDept($event, 'treeDom1')"
          @visible-change="visibleChange($event,'treeDom1')" :filterable="hasPermission== 1 || hasPermission == 3">
          <el-option label="全部" value=""></el-option>
          <el-tree :data="baseList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" :filter-node-method="filterNode"
            @node-click="nodeClickBase" ref="treeDom1" class="selfTree"></el-tree>
        </el-select>
      </el-form-item>
      <el-form-item label="专业基地" v-if="multiBase && hasBase" class="multipleSele" label-width="80px">
        <el-select v-model="formInline.baseIdList" placeholder="全部" multiple collapse-tags :filterable="hasPermission== 1 || hasPermission == 3">
          <el-option :label="item.name" :value="item.id" v-for="item in baseList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" v-if="hasDept" label-width="80px">
        <el-select v-model="formInline.deptIdName" :multipple="useMultiSelect" :filter-method="($event) => searchDept($event, 'multitree')"
          @visible-change="visibleChange($event,'multitree')" :filterable="hasPermission== 1 || hasPermission == 3" collapse-tags
          placeholder="全部" v-if="showDeptTree && !multiDept" @change="changeDept">
          <el-option label="全部" value=""></el-option>
          <el-tree v-if="!useMultiSelect" :data="deptList" node-key="id" :show-checkbox="useMultiSelect" :filter-node-method="filterNode"
            :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick" ref="multitree"
            class="selfTree"></el-tree>
          <el-tree v-if="useMultiSelect" :data="deptList" node-key="id" :show-checkbox="useMultiSelect" :filter-node-method="filterNode"
            :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @check-change="nodeClick1" ref="multitree"
            class="selfTree"></el-tree>
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
        formInline: {
          name: "",
          baseId: "",
          deptId: "",
          deptIdName: "",
          baseName: "",
          hospitalIdForBase: "",
          hospitalId: ""
        },
        deptList: [],
        baseList: [],
        hospitalList: [],
        defaultProps: {
          label: 'name',
          children: 'childrens'
        },
      }
    },
    props: {
      // 0 默认 1 带权限 带筛选  2 带权限 不筛选 3 不带权限 筛选   当前只有0,1有使用
      hasPermission: {
        type: Number,
        default: 3
      },
      clearAll: {
        type: Number,
        default: 0
      },
      useMultiSelect: {
        type: Boolean,
        default: false
      },
      multiDept: {
        type: Boolean,
        default: false
      },
      showDeptTree: {
        type: Boolean,
        default: true
      },
      multiBase: {
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
    },
    watch: {
      clearAll(newVal, oldVal) {
        if (newVal > 0) {
          this.formInline.hospitalIdForBase = ""
          this.formInline.hospitalId = ""
          this.formInline.baseId = this.multiBase ? [] : ""
          this.formInline.baseName = ""
          this.formInline.baseIdList = []
          this.formInline.deptId = ""
          this.formInline.deptIdName = ""
          this.formInline.deptIdList = []
          if (this.$refs['treeDom1'] != undefined) {
            this.$refs['treeDom1'].setCheckedKeys([])
          }
          if (this.$refs['multitree'] != undefined) {
            this.$refs['multitree'].setCheckedKeys([])
          }
        }
      }
    },
    created() {
      if (this.hasHospital) {
        this.getHospitalList()
      }
      if (this.hasDept) {
        this.getDeptList()
      }
      if (this.hasBase) {
        this.getBaseList()
      }
    },
    methods: {
      visibleChange(e, name) {
        this.$refs[name].filter()
      },

      searchDept(val, name) {
        if (this.$refs[name] == undefined) {
          return false
        }
        this.$refs[name].filter(val);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      nodeClick1(data, dataObj) {
        this.formInline.deptIdName = []
        this.formInline.deptId = []
        this.formInline.deptIdList = []
        // this.formInline.dept = this.$refs.multitree.getCheckedKeys();
        let response = this.$refs.multitree.getCheckedNodes();
        response.forEach(item => {
          this.formInline.deptIdList.push(item.id)
          this.formInline.deptId.push(item.id)
          this.formInline.deptIdName.push(item.name)
        })
        this.$emit("updateSelectIds", this.formInline)
      },
      nodeClickBase(node) {
        if (node.deptlevel == 1) {
          this.formInline.hospitalIdForBase = node.id
        } else {
          this.formInline.hospitalIdForBase = ""
        }
        this.formInline.baseId = node.id
        this.formInline.baseName = node.name
        this.$emit("updateSelectIds", this.formInline)
      },
      nodeClick(node) {
        if (node.havePermission != 1) {
          return false;
        }
        if (node.deptlevel == 1) {
          this.formInline.hospitalId = node.id
        } else {
          this.formInline.hospitalId = ""
        }
        this.formInline.deptId = node.id
        this.formInline.deptIdName = node.name
        this.$emit("updateSelectIds", this.formInline)
      },
      getHospitalList() {
        post("/base/dept/listHospital").then(res => {
          if (res && res.resCode == 200) {
            this.hospitalList = res.rows
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "请求医院列表报错"
            })
          }
        })
      },
      getBaseList() {
        let url = ""
        if (this.hasPermission == 1 || this.hasPermission == 2) {
          url = "/base/dept/getMyHosBaseTree"
        } else {
          url = "/base/dept/getHosBaseTree"
        }
        post(url).then(res => {
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
      getDeptList() {
        this.deptList = []
        post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: false,
          // hospitalId: this.formInline.hospitalId,
          // menusId: this.menuId
        }).then(data => {
          if (data && data.resCode == 200) {
            this.deptList = data.model;
          }
        });
      },
      changeBase(val) {
        if (val == undefined || val == null || val == "") {
          this.formInline.baseId = ""
          this.formInline.hospitalIdForBase = ""
        } else {
          this.formInline.baseId = val
        }
        this.$emit("updateSelectIds", this.formInline)
      },
      changeDept(val) {

        if (val == undefined || val == null || val == "") {
          this.formInline.deptId = ""
          this.formInline.hospitalId = ""
        } else {
          this.formInline.deptId = val
        }
        this.$emit("updateSelectIds", this.formInline)
      },
    }
  }

</script>
<style scoped>
  .selectHosBasedept {
    display: inline-block;
    width: 442px;
  }
</style>
<style>
.selectHosBasedept.hospitalBaseDept1 .el-form-item__content {
  width: 130px;
}
.selectHosBasedept .hasFormItem .el-form-item {
  vertical-align: baseline;
}
</style>