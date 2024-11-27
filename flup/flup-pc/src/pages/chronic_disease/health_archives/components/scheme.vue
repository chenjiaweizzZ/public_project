<template>
  <el-row class="height100" type="flex">
    <div class="flex1 flex-column border1">
      <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle">
        <div>
          {{label}}
          <el-button type="text" @click="openDialog">查看{{type}}</el-button>
        </div>
        <div>
          <span>自动编号</span>
          <el-switch v-model="showIndex"></el-switch>
        </div>
      </el-row>
      <!-- <DivEditable :class="{'input-content': showIndex}" v-model="content" placeholder="请输入内容"></DivEditable> -->

      <el-input type="textarea" v-model="content" :autosize="{ minRows: 20, maxRows: 30}" maxlength="2000" show-word-limit></el-input>
      <!-- <textarea class="textarea" v-model="content" maxlength="2000" show-word-limit></textarea> -->
    </div>
    <div class="width280px border1 margin-left20">
      <el-tabs v-model="activeName" stretch>
        <el-tab-pane name="1" label="公有模板"></el-tab-pane>
        <el-tab-pane name="2" label="个人模板"></el-tab-pane>
      </el-tabs>
      <el-tree :data="configList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
        <!-- <el-tooltip
          v-if="data.children.length==0"
          slot-scope="{ node, data }"
          effect="dark"
          placement="left"
        >
          <div style="width:500px;word-wrap:break-word;" slot="content">{{data.content}}</div>
          <span style="user-select: none" @dblclick="setContent(data)">{{node.label}}</span>
        </el-tooltip>
        <span v-else style="user-select: none" @dblclick="setContent(data)">{{node.label}}</span>-->

        <template slot-scope="{ node, data }">
          <span v-if="!data.content||data.content.length==0" style="user-select: none">{{node.label}}</span>
          <el-tooltip v-else effect="dark" placement="left">
            <div style="width:500px;word-wrap:break-word;" slot="content">{{data.content}}</div>
            <span style="user-select: none" @dblclick="setContent(data)">{{node.label}}</span>
          </el-tooltip>
        </template>
      </el-tree>
    </div>
    <el-row class="footer" type="flex" justify="end" align="middle">
      <el-button @click="content=''">清空</el-button>
      <el-button type="info" @click="save">保存</el-button>
      <el-button type="primary" @click="execute">生效</el-button>
    </el-row>
    <el-dialog :title="type" :visible.sync="dialogVisible" width="80%" v-if="dialogVisible" :close-on-click-modal="false">
      <el-row v-if="historyList&&historyList.length!==0" type="flex" style="min-height:200px">
        <el-menu class="width310px bgcolor-fb" default-active="0" @select="onSelect">
          <el-menu-item v-for="(item, index) in historyList" :index="index.toString()" :key="item.id">
            <div style="display: flex;align-items: center;">
              <el-tag v-if="item.id==currentConfig.id" class="margin-right10" effect="plain" type="success" size="mini">当前方案</el-tag>
              <el-tooltip class="item" effect="dark" :content="item.doctor" placement="top">
                <span class="textOverflow">{{`${$utils.formatDate(item.updateTime)} ${item.doctor || ''}`}}</span>
              </el-tooltip>
            </div>
          </el-menu-item>
        </el-menu>
        <div class="flex1 margin-left10 border1 padding10 pre-wrap" v-html="selectedConfig.content"></div>
      </el-row>
      <div v-else class="nonexistenceData">一条记录都没有</div>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import DivEditable from '@/components/div_editable';
export default {
  props: {
    type: String,
  },
  components: { DivEditable },
  data() {
    return {
      activeName: '1',
      showIndex: true,
      configList: [],
      defaultProps: {
        label: 'node',
      },
      content: '',
      dialogVisible: false,
      historyList: [],
      label: '',
      currentConfig: {},
      selectedConfig: {},
      configLists: {},
      serialNumberlist: [1],
    };
  },
  watch: {
    activeName() {
      if (this.activeName == 1) {
        this.configList = this.configLists.publicNodeList;
      } else {
        this.configList = this.configLists.privateNodeList;
      }
    },
  },
  mounted() {
    this.queryInterveneConfig();
    this.getCurrentConfig();
  },
  methods: {
    queryInterveneConfig() {
      this.$apis
        .queryInterveneConfig({
          tab: this.type,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.configLists = res;
          this.configList = res.publicNodeList || [];
        });
    },
    setContent(data) {
      // console.log(data);
      // console.log(this.content.length);
      // console.log(data.content.length);
      // if (data.children && data.children.length === 0) {
      if (data.children) {
        if (this.content > 2000 || this.content ? this.content.length + data.content.length > 2000 : data.content.length > 2000) {
          this.$message({
            message: '内容不可超过2000字符!',
            type: 'warning',
          });
          return;
        }
        if (this.content) {
          this.content += '\n\n';
        } else {
          this.content = '';
        }

        if (this.showIndex) {
          var trfa = true;
          do {
            for (var i in this.serialNumberlist) {
              let n = this.serialNumberlist[i] + '·';
              if (this.content.indexOf(n) == -1) {
                this.content += `${this.serialNumberlist[i]}·`;
                this.serialNumberlist.push(this.serialNumberlist[i] + 1);
                trfa = false;
                break;
              } else {
                if (i == this.serialNumberlist.length - 1) {
                  this.serialNumberlist.push(this.serialNumberlist[i] + 1);
                }
              }
            }
          } while (trfa);
        }
        this.content += data.content || '-';
        // if (this.showIndex) {
        //   this.content += `<p class="index">${data.content || '-'}</p>`
        // } else {
        //   this.content += data.content || '-'
        // }
      }
    },
    getCurrentConfig() {
      this.$apis
        .getCurrentConfig({
          typeName: this.type,
          patientId: this.$route.query.userId,
        })
        .then((res) => {
          this.currentConfig = res;
          this.content = res && res.content;
          console.log(res);
          if (res) {
            this.label = '当前方案';
          }
        });
    },
    execute() {
      this.$apis
        .executeCurrentConfig({
          type: this.type,
          patientId: this.$route.query.userId,
          content: this.content,
        })
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '生成成功',
            type: 'success',
          });
        });
    },
    save() {
      this.$apis
        .saveCurrentConfig({
          type: this.type,
          patientId: this.$route.query.userId,
          content: this.content,
        })
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
          });
        });
    },
    openDialog() {
      this.$apis
        .getConfigHistory({
          typeName: this.type,
          patientId: this.$route.query.userId,
        })
        .then((res) => {
          this.historyList = res || [];
          if (this.historyList.length > 0) {
            this.onSelect('0');
          }
        });
      this.dialogVisible = true;
    },
    onSelect(index) {
      index = +index;
      this.selectedConfig = this.historyList[index];
    },
    onSubmit() {
      console.log(this.selectedConfig, this.currentConfig, 'dangqiandangqian');
      this.content = this.selectedConfig.content;
      if (this.selectedConfig && this.currentConfig) {
        if (this.selectedConfig.id === this.currentConfig.id) {
          this.label = '当前方案';
        } else {
          this.label = '非当前方案';
        }
      }
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.textarea {
  border: 0;
  padding: 10px;
  flex: 1;
  font-size: 14px;
  font-family: 'PingFangSC-Regular', 'microsoft yahei', 'Arial' !important;
}
// .input-content {
//   counter-reset:section;
//   p.index:before {
//     content: counter(section) ". ";
//     counter-increment: section;
//   }
// }
</style>