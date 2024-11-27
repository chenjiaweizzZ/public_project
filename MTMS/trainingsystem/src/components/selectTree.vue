<template>
  <div style="display: inline-block">
    <el-select v-model="selectValue.value" placeholder="请选择" @change="changeDept" class="selfDeptSelect" v-if="single" :disabled="editDisabled"
      ref="selectDept">
      <el-option hidden :value="selectValue.value" :label="selectValue.name"></el-option>
      <el-tree :data="turnDeptRoom" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
        ref="treeDom" :class="{'baseSelect': hasBase,'selfTree': true,'deptSelfTree':true}"></el-tree>
    </el-select>
    <el-select v-model="selectDeptName" placeholder="请选择" @change="changeDept" class="selfDeptSelect" multiple v-else :disabled="editDisabled"
      collapse-tags>
      <el-option :value="selectDeptName" class="setstyle">
        <el-tree :data="turnDeptRoom" :props="defaultProps" ref="treeDom" show-checkbox check-strictly :expand-on-click-node="true"
          node-key="id" check-on-click-node @check-change="changeSelected" :class="{'baseSelect': hasBase,'selfTree': true,'deptSelfTree':true}"></el-tree>
      </el-option>
    </el-select>
  </div>

</template>
<script>
  import { post, getCookie, getStorage } from "../config/util";
  export default {
    props: {
      initValue: {
        default: ""
      },
      valueId: {
        type: Object,
        default: {}
      },
      clearAll: {
        type: Boolean,
        default: false
      },
      groupDeptTree: {
        type: String,
        default: ""
      },
      isAll: {
        type: Boolean,
        default: false
      },
      single: {
        type: Boolean,
        default: false
      },
      hasBase: {
        type: Boolean,
        default: false
      },
      hosBase: {
        type: Boolean,
        default: false
      },
      editDisabled: {
        type: Boolean,
        default: false
      },
      needBaseDept: {
        type: Number,
        default: 1
      },

    },
    data() {
      return {
        menuId: "",
        flag: false,
        mulSelectValue: [],
        collapse: true,
        defaultProps: {
          label: 'name',
          children: 'childrens'
        },
        selectValue: {
          name: "",
          value: ""
        },
        selectDeptName: [],
        selectDeptIds: [],
        turnDeptRoom: []
      }
    },
    watch: {
      clearAll(newVal, oldVal) {
        if (newVal > 0) {
          this.selectValue.value = ""
          this.selectValue.name = ""
          this.selectDeptName = []
          this.selectDeptIds = []
          this.$refs.treeDom.setCheckedKeys([])
          if (this.initValue != "" && this.single) {
            this.$set(this.selectValue, "value", Number(this.initValue.deptid))
            this.$set(this.selectValue, "name", this.initValue.deptname)
          }
        }
      }
    },

    created() {
      this.menuId = getStorage("menuId")
      if (this.valueId && this.valueId != null && this.valueId !== {}) {
        this.selectValue = {
          value: this.valueId.deptid,
          name: this.valueId.deptname
        }
      }
      if (this.groupDeptTree != "") {
        this.flag = true
        this.groupDeptTreeList()
      } else {
        if (this.hasBase) {
          if (this.isAll) {
            this.getAll()
          } else {
            this.flag = true
            this.initTurnBaseDept()
          }
        } else if (this.hosBase) {
          this.getHospBase()
        } else {
          if (this.isAll) {
            this.initAllDept();
          } else {
            this.flag = true
            this.initTurnDept();
          }
        }
      }
      if (this.initValue != "" && this.single) {
        this.$set(this.selectValue, "value", this.initValue.deptid == "" ? this.initValue.deptid : Number(this.initValue.deptid))
        this.$set(this.selectValue, "name", this.initValue.deptname)
      }

    },
    methods: {
      initAllDept() {
        this.turnDeptRoom = []
        post("/base/dept/getDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0
        }).then(data => {
          if (data && data.resCode == 200) {
            this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
          }
        })
        console.log(this.initValue)
        
  
      },
      groupDeptTreeList() {
        this.turnDeptRoom = []
        post(`/base/dept/getTraineeGroupDeptTree?traineeGroupBaseId =${this.groupDeptTree}`).then(data => {
          if (data && data.resCode == 200) {
            this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
          }
        });
      },
      getAll() {
        this.turnDeptRoom = []
        post("/base/dept/getHosBaseDeptTree").then(data => {
          if (data && data.resCode == 200) {
            this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
          }
        });
      },
      getHospBase() {
        this.turnDeptRoom = []
        post("/base/dept/getHosBaseTree", { menusId: this.menuId }).then(data => {
          if (data && data.resCode == 200) {
            this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
          }
        });
      },
      nodeClick(node) {
        if (this.turnDeptRoom.length == 0) {
          return false;
        }
          if (node.deptlevel == 1 || (this.flag && node.havePermission != 1)) {
            return false;
          }
          if ((this.hasBase && node.deptlevel == 2) || (this.flag && node.havePermission != 1)) {
            return false
        }
        this.selectValue = {
          name: node.name,
          value: node.id
        }
        this.$emit("updateSingleDept", node)
        // this.$refs.selectDept.handleClose();
      },
        initTurnBaseDept() {
          this.turnDeptRoom = []
          post("/base/dept/getMyHosBaseDeptTree", { menusId: this.menuId }).then(data => {
            if (data && data.resCode == 200) {
          this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
        }
          });
  },
  /*搜索条件 轮转科室 and 待轮转科室*/
  initTurnDept() {
    this.turnDeptRoom = []
    post("/base/dept/getMyDeptTree", {
      showHospital: 1,
      showNoDeptHospital: 0,
      menusId: this.menuId,
      needBaseDept: this.needBaseDept
    }).then(data => {
      if (data && data.resCode == 200) {
        data.model.forEach(item => {
          if (item.childrens != null) {
            item.childrens.forEach(citem => {
              citem.disabled = citem.havePermission == 1 ? false : true
              if (citem.childrens != null) {
                citem.childrens.forEach(ccitem => {
                  ccitem.disabled = ccitem.havePermission == 1 ? false : true
                  if (ccitem.childrens != null) {
                    ccitem.childrens.forEach(v => {
                      v.disabled = v.havePermission == 1 ? false : true
                    })
                  }
                })
              }
            })
          }
        })
        this.turnDeptRoom = this.turnDeptRoom.concat(data.model);
      }
    });
  },
  // removetag() {

  // },
  changeDept(val) {
    if (!val || val == undefined) {
      this.selectValue = {
        name: this.single ? "" : [],
        value: this.single ? "" : []
      }
      this.$refs.treeDom.setCheckedKeys([])
    } else {
      if (!this.single && (this.selectDeptName.length < this.selectDeptIds.length)) {
        this.selectDeptIds.splice(0, 1)
        this.$refs.treeDom.setCheckedKeys(this.selectDeptIds)
      } else {
        let temp = this.single ? [val] : this.selectDeptIds
        this.$refs.treeDom.setCheckedKeys(temp)
      }
      this.$emit("updateDept", { selectDeptIds: this.single ? [val] : this.selectDeptIds })
    }
  },
  changeSelected(e, v) {
    console.log(e, v, "00000000000000")
    let selectDeptIds = []
    let selectDeptName = []
    let valueObj = []
    if (this.turnDeptRoom.length == 0) {
      return false
    }
    let data = this.$refs.treeDom.getCheckedNodes()
    data.forEach(item => {
      selectDeptIds.push(item.id)
      selectDeptName.push(item.name)
    })
    this.selectValue = {
      name: selectDeptName,
      value: selectDeptIds
    }
    this.selectDeptIds = selectDeptIds
    this.selectDeptName = selectDeptName
    console.log(selectDeptIds, "_++")
    this.$emit("updateDept", { selectDeptIds: this.selectDeptIds, selectDeptName: this.selectDeptName })
  },
      }
    };
</script>
<style>
  .selfTree.deptSelfTree .el-tree-node__content .el-checkbox__input {
    display: none;
  }

  .selfTree.deptSelfTree .el-tree-node__children .el-tree-node__content .el-checkbox__input {
    display: inline-block;
  }

  .selfTree.deptSelfTree.baseSelect .el-tree-node__children .el-tree-node__content .el-checkbox__input {
    display: none;
  }

  .selfTree.deptSelfTree.baseSelect .el-tree-node__children .el-tree-node__children .el-tree-node__content .el-checkbox__input {
    display: inline-block;
  }

  .selfTree.deptSelfTree.baseSelect .el-tree-node__children .el-tree-node__children .el-tree-node__content .el-checkbox__input {
    display: inline-block;
  }

  .selfTree.deptSelfTree.el-tree {
    padding-right: 10px;
  }

  .selfDeptSelect .el-select__tags-text {
    max-width: 97px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .selfDeptSelect .el-tag__close {
    margin-top: -15px;
  }

  .selfDeptSelect .el-select__tags>span {
    display: flex;
  }

  /* .selfTree {
        border: none;
      } */
</style>
<style scoped>
  .selfDeptSelect {
    width: 200px;
  }

  .setstyle {
    height: fit-content;
    padding: 0 !important;
    margin: 0;
    overflow: auto;
    cursor: default !important;
  }
</style>