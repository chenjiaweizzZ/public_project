//健康干预模板
<template>
  <div class="container">
    <el-tabs v-model="activeName1" @tab-click="handleClick">
      <el-tab-pane label="常规模板" name="常规模板"></el-tab-pane>
      <el-tab-pane label="用药指导" name="用药指导"></el-tab-pane>
      <el-tab-pane label="运动方案" name="运动方案"></el-tab-pane>
      <el-tab-pane label="饮食建议" name="饮食建议"></el-tab-pane>
    </el-tabs>
    <div class="flex">
      <div style="flex: 1; padding: 20px 0px 20px 0px;">
        <el-tabs v-model="activeName2" type="border-card" @tab-click="empty">
          <el-tab-pane label="共有模板" name="共有模板">
            <div style="border: 1px solid #e6e6e6;padding: 20px;">
              <el-tree
                :data="data.publicNodeList"
                show-checkbox
                node-key="id"
                default-expand-all
                draggable
                @node-drag-start="dragTheStart"
                @node-drop="dragTheEnter"
                :expand-on-click-node="false"
              >
                <span
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @click="()=>bj(node,data)"
                >
                  <span @dblclick="()=>rechristen(data)">{{ data.node }}</span>
                  <span>
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        <!-- ●●● -->
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu>
                        <span class="xf" @click="() => remove(node, data)">删除节点</span>
                        <span
                          v-if="node.level < hierarchy"
                          class="xf"
                          @click="() => append(data)"
                        >添加子节点</span>
                        <span v-if="node.key" class="xf" @click="handleCommand(data)">设为个人模板</span>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span>
              </el-tree>
              <div style="display: flex;justify-content:center;padding-top:20px">
                <el-button type="primary" plain @click="commonalityEstablish">新增</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="个人模板" name="个人模板">
            <div style="border: 1px solid #e6e6e6;padding: 20px;">
              <el-tree
                :data="data.privateNodeList"
                show-checkbox
                node-key="id"
                default-expand-all
                draggable
                @node-drag-start="dragTheStart"
                @node-drop="dragTheEnter"
                :expand-on-click-node="false"
              >
                <span
                  class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @click="()=>bj(node,data)"
                >
                  <span @dblclick="()=>rechristen(data)">{{ data.node }}</span>
                  <span>
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        <!-- ●●● -->
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu>
                        <span class="xf" @click="() => remove(node, data)">删除节点</span>
                        <span
                          v-if="node.level < hierarchy"
                          class="xf"
                          @click="() => append(data)"
                        >添加子节点</span>
                        <span v-if="activeName2 == '共有模板'" class="xf" @click="handleCommand">设为个人模板</span>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span>
              </el-tree>
              <div style="display: flex;justify-content:center;padding-top:20px">
                <el-button type="primary" plain @click="personageEstablish">新增</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="flex: 2;padding: 20px;border: 1px solid #e6e6e6; margin: 20px 0 20px 20px;">
        <p v-html="content.content" class="hh" v-if="xzorbj" style="padding-bottom:20px"></p>
        <el-input
          v-else
          type="textarea"
          :autosize="{ minRows: 20}"
          placeholder="请输入内容"
          v-model="content.content"
          maxlength="1800"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <div class="foot">
      <el-button :disabled="!this.content.node" type="success" @click="bjbut">编辑</el-button>
      <el-button type="primary" @click="tj">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xzorbj: true,
      content: { content: null },
      value: null,
      checked: true,
      data: [],
      datasource: [],
      activeName1: '常规模板',
      activeName2: '共有模板',
      hierarchy: 0, //层级关系
      hierarchylist: {},
      pitchonnode: [],
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.getinterveneconfig()
    this.$apis
      .getFlupConfigList({
        hospitalId: this.$global.hospital_id,
        moduleCode: 'chronicDiseaseSetting ',
      })
      .then((res) => {
        res.forEach((element) => {
          this.hierarchylist[element.componentKey] = element.componentValue
        })
        this.hierarchy = this.hierarchylist.commonTemplateLevel
      })
  },
  methods: {
    getCount(arr) {
      var list = []
      var num = 0
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].children instanceof Array) {
          for (var j = 0; j < arr[i].children.length; j++) {
            list.push(arr[i].children[j])
          }
        }
      }
      if (list.length) {
        num = 1
        num += this.getCount(list)
      }
      return num
    },

    dragTheStart() {
      this.pitchonnode = JSON.parse(JSON.stringify(this.data))
    },
    dragTheEnter(before, after) {
      let a
      if (this.activeName2 == '共有模板') {
        a = this.getCount(this.data.publicNodeList)
      } else {
        a = this.getCount(this.data.privateNodeList)
      }
      if (a >= this.hierarchy) {
        this.$message({
          message: '拖拽层级禁止大于' + this.hierarchy + '级',
          type: 'warning',
        })
        this.data = this.pitchonnode
      }
    },
    handleCommand(data) {
      this.$apis
        .configsaveToPrivate({
          id: data.id,
          tab: this.activeName1,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '设置成功',
              type: 'success',
            })
            this.getinterveneconfig()
          }
        })
    },
    bjbut() {
      this.xzorbj = false
    },
    bj(node, data) {
      this.content = data
    },
    commonalityEstablish() {
      let newChild = {
        node: '双击输入节点名称',
        children: [],
        index: this.data.publicNodeList.length,
      }
      this.data.publicNodeList.push(newChild)
    },
    personageEstablish() {
      let newChild = {
        node: '双击输入节点名称',
        children: [],
        index: this.data.privateNodeList.length,
      }
      this.data.privateNodeList.push(newChild)
    },
    rechristen(data) {
      this.$prompt('', '请输入节点名称', {
        customClass: 'putInBox',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入节点名称,长度在 1 到 10 个字符',
        inputPattern: /^[\S]{1,10}$/,
      })
        .then(({ value }) => {
          data.node = value
        })
        .catch(() => {})
    },
    append(data) {
      let newChild = {
        node: '双击输入节点名称',
        children: [],
        index: data.index + '-' + data.children.length,
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    tj() {
      this.$apis
        .postinterveneconfig({
          ...this.data,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.getinterveneconfig()
            this.xzorbj = true
          }
        })
    },
    remove(node, data) {
      this.$confirm('您将删除该目录及该目录下所有内容，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (data.id) {
            this.$apis.deleteconfignode(data.id).then((res) => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.getinterveneconfig()
              }
            })
          } else {
            let parent = node.parent
            let children = parent.data.children || parent.data
            let index = children.findIndex((d) => d.index == data.index)
            children.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    getinterveneconfig() {
      this.$apis.getinterveneconfig().then((res) => {
        let datasource = [
          {
            tab: '常规模板',
            privateNodeList: [],
            publicNodeList: [],
          },
          {
            tab: '用药指导',
            privateNodeList: [],
            publicNodeList: [],
          },
          {
            tab: '运动方案',
            privateNodeList: [],
            publicNodeList: [],
          },
          {
            tab: '饮食建议',
            privateNodeList: [],
            publicNodeList: [],
          },
        ]

        let a = [...res, ...datasource]

        this.datasource = a.reduce((item, next) => {
          a[next.tab] ? '' : (a[next.tab] = item.push(next))
          return item
        }, [])
        this.datasource.forEach((row) => {
          if (row.tab == this.activeName1) {
            this.data = row
          }
        })
      })
    },
    handleClick(tab, event) {
      this.datasource.forEach((row) => {
        if (row.tab == tab.paneName) {
          this.data = row
        }
      })

      if (tab.paneName == '常规模板') {
        this.hierarchy = this.hierarchylist.commonTemplateLevel
      } else if (tab.paneName == '用药指导') {
        this.hierarchy = this.hierarchylist.medicationGuideLevel
      } else if (tab.paneName == '运动方案') {
        this.hierarchy = this.hierarchylist.sportsProgramLevel
      } else if (tab.paneName == '饮食建议') {
        this.hierarchy = this.hierarchylist.dietAdviseLevel
      }
      this.empty()
    },
    empty() {
      this.content = { content: null }
      this.xzorbj = true
    },
  },
}
</script>

<style style lang="scss"  scoped>
.container {
  position: relative;
  .pos {
    position: absolute;
    top: 20px;
    right: 24px;
  }
  .functionmenu {
    display: flex;
    padding: 10px;
    border: 1px solid #e6e6e6;
    border-top: 0;
    padding-left: 30px;
    // justify-content: space-around;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .hh {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }
  .foot {
    position: fixed;
    padding-right: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 66px;
    background: #ffffff;
    box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.18);
    .el-button--success {
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-button--success:hover {
      background-color: #5eaeff;
    }
  }
}
.el-popper {
  padding: 10px 0;
}
.xf {
  display: block;
  padding: 5px 10px;
  text-align: center;
}
.xf:hover {
  color: #32ae57;
  background-color: rgba(50, 174, 87, 0.2);
}
</style>