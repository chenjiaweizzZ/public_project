<template>
  <div class="container">
    <div class="queryConditionsBox">
      <div class="conditionbox">
        <span class='conditionbox-text'>状态</span>
        <el-select class="w170 mr-10" clearable v-model="authState" @change="search">
          <el-option v-for="item in auditStatus" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-input
          placeholder="请输入名称搜索"
          v-model="keyword"
          class="input-with-select limiting"
          maxlength="20"
          show-word-limit
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px" stripe>
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="267"></el-table-column>
      <el-table-column prop="typeName" label="类型" min-width="207">
      </el-table-column>
      <el-table-column prop="createTime" label="发起时间" min-width="120">
      </el-table-column>
      <el-table-column prop="authState" label="状态" min-width="130">
        <template slot-scope="{row}">
          <span v-if="row.authState == 0">待审核</span>
          <span v-else-if="row.authState == 1">审核通过</span>
          <span v-else-if="row.authState == 2">审核未通过</span>
          <span v-else>已撤销</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUsername" label="操作人员" min-width="213"></el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="openDetails(row)">查看详情</el-button>
          <el-button type="text" size="small" @click="openTake(row)">审核记录</el-button>
          <el-button type="text" size="small" v-if="!isRole" @click="amendAuditing(row)">修改</el-button>
          <el-button type="text" size="small" v-if="!isRole && (row.authState == 0 || row.authState == 2)" @click="revoke(row)">撤销</el-button>
          <el-button type="text" size="small" @click="auditing(row)" v-if="isRole && row.authState == 0">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNo"
      background
      layout="slot,sizes,prev, pager, next"
      :total="total"
    >
        <span class="el-pagination__total">共有{{ total }}条记录，显示</span>   
    </el-pagination>
    <take ref="take"></take>
    <GroupDialog ref="groupDialog" @refurbish="getList"></GroupDialog>
    <planDialog ref="planDialog" @refurbish="getList"></planDialog>
  </div>
</template>

<script>
import take from "./components/take";
import GroupDialog from './components/groupDialog';
import planDialog from './components/planDialog';
export default {
  components:{
    take,
    GroupDialog,
    planDialog,
  },
  data() {
    return {
      auditStatus:[
        {
          id:0,
          name:'待审核'
        },
        {
          id:1,
          name:'审核通过'
        },
        {
          id:2,
          name:'审核未通过'
        },
        {
          id:3,
          name:'已撤销'
        }
      ],
      authState:'',
      keyword:'',
      pageNo:1,
      tableData: [],
      total: 0,
      pageSize:10,
      isRole:false,  //true 有审核权限 false 没有审核权限
    }
  },
  created(){
    this.getRight()
  },
  mounted() {
    this.getList();
    let type = this.$route.query.type;
    if(type){
      this.removeTab(type)
    }
  },
  methods: {
    removeTab(newType){
      let beforeTitle = newType == 3 ? '宣教审核' : '问卷审核';
        window.parent.postMessage(
          JSON.stringify({
            method: 'removeTab',
            url:'',
            title:'',
            beforeTitle
          }),
          '*'
        )
    },
    search(){
      this.pageNo = 1;
      this.getList();
    },
    async getList(){
      let params = {
        pageNum:this.pageNo,
        pageSize:this.pageSize,
        keyword:this.keyword,
        authState:this.authState,
      }
      let {total,list} = await this.$apis.queryAuth(params);
      this.total = total;
      this.tableData = list;
    },
    //根据用户中心权限控制导入和存模板
    async getRight() {
      let { ret_data } = await this.$apis.getPermissions({})
      if(ret_data.featureList && ret_data.featureList.length > 0){
        this.isRole = ret_data.featureList.some(item => item.feature_id == '678321')
      }
    },
    openTake(row){
      this.$refs.take.init(row.serialNo);
    },
    auditing(row){
      if(row.type == 1){
        this.$refs.planDialog.init(row.serialNo,true);
      }else if(row.type == 2){
        this.$refs.groupDialog.init(row.serialNo,true);
      }else{
        this.onView(row, true)
      }
    },
    amendAuditing(row){
      if(row.type == 1){
        this.$refs.planDialog.init(row.serialNo,false,2);
      }else if(row.type == 2){
        this.$refs.groupDialog.init(row.serialNo,false,2)
      }else{
        this.onEdit(row)
      }
    },
    openDetails(row){
      if(row.type == 1){
        this.$refs.planDialog.init(row.serialNo,true,1);
      }else if(row.type == 2){
        this.$refs.groupDialog.init(row.serialNo,true,1);
      }else{
        this.onView(row)
      }
    },
    revoke(row){
      this.$confirm('确定要撤销审核申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          await this.$apis.authApply({
            authState:3,
            serialNo:row.serialNo,
            type:row.type,
          })
          this.getList();
        }).catch(() => {       
        });
    },
    onView(row, authState = false) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      let url = urlx + '/#/newpreview?serial_no=' + row.serialNo;
      let title = row.type == 3 ? '宣教详情' : '问卷详情'
      if(authState){
        url = urlx + '/#/newpreview?serial_no=' + row.serialNo + '&authState=1';
        title = row.type == 3 ? '宣教审核' : '问卷审核'
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: url,
            title,
          }),
          '*'
        )
      } else {
        window.open(url)
      }
    },
    onEdit(row) {
      if (row.type == 3) {
        this.$router.push('/neweditEducate?serialNo=' + row.serialNo + '&authState=1')
      } else {
        this.$router.push(
          '/neweditQuestionaire/hospital?serialNo=' + row.serialNo + '&authState=1'
        )
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
  },
}
</script>

<style style lang="scss"  scoped>
.w170{
   width: 170px;
}
.mr-10{
    margin-right: 10px;
}
.container {
    .queryConditionsBox{
        padding-left: 6px;
    }
  .conditionbox {
    // width: 100%;
    // height: 50px;
    // padding: 15px;
    // margin-bottom: 15px;
    background-color: #f8f8f8;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &-text{
        margin:0 14px;
    }
    .el-input {
      width: 200px;
    }
    .el-button {
      margin: 0 5px;
    }
    > .el-input {
      width: 300px;
      .el-button {
        margin: -10px -20px;
      }
    }
  }
  .mainbox {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    p {
      width: 50%;
      line-height: 30px;
      .title {
        width: 120px;
        font-weight: 600;
        text-align: right;
        display: inline-block;
        color: #888;
      }
      .main {
        padding-left: 10px;
        display: inline-block;
        color: #666;
      }
    }
  }
  .titlexg {
    padding: 20px;
    color: #888;
    border-bottom: 1px solid #ccc;
    span {
      font-size: 13px;
      color: #555;
    }
  }
}
</style>