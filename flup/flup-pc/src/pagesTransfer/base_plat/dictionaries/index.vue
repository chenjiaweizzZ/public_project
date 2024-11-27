<template>
  <el-container>
    <el-aside class="fixed height100 scroll-y" width="220px">
      <LeftAside :menuList="menuList" @handleMenu="handleMenu" @handleAdd="handleMenuAdd" @handleEdit="handleMenuEdit" @handleDelete="del"></LeftAside>
    </el-aside>
    <el-main style="margin-left:230px;padding-top:0">
      <OperationHeader style="margin-bottom:20px">
        <el-button type="primary" @click="handleAdd" plain>新增</el-button>
        <template v-slot:right>
          <p style="width:50px">搜索</p>
          <el-input placeholder="请输入名称/编号" v-model="searchKey" class="input-with-select limiting" maxlength="20" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="getMainList"></el-button>
          </el-input>
        </template>
      </OperationHeader>
      <el-dialog :title="`${serial_no?'编辑':'新增'}字典信息`" :visible.sync="dialogVisible" width="700px" v-if="dialogVisible" :close-on-click-modal="false">
        <planForm :menuId="menuId" :serial_no="serial_no" :fatherName="fatherName" :fatherId="fatherId" @onCancel="dialogVisible = false" @onSubmit="onSubmit"></planForm>
      </el-dialog>
      <el-table class="margin-top10" :data="list" stripe border>
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip v-for="item in thList" :prop="item.value" :key="item.value" :label="item.key"></el-table-column>
        <el-table-column label="有效" :width="140">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" active-value="1" inactive-value="0" @change="onEnable(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
            <!-- <el-button @click="del(scope.row)" type="text" icon="el-icon-delete">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import LeftAside from './components/left_aside';
import PlanForm from './components/plan_form';

export default {
  name: 'index',
  components: {
    LeftAside,
    PlanForm,
  },
  data() {
    return {
      menuList: [],
      menuId: '',
      dialogVisible: false,
      serial_no: '',
      searchKey: '',
      fatherId: '',
      fatherName: '',
      list: [],
      thList: [
        { value: 'dict_name', key: '名称' },
        { value: 'dict_code', key: '编号' },
        { value: 'description', key: '备注' },
      ],
    };
  },
  async created() {
    this.$startLoading();
    await this.getItemTypesForTree();
    this.$stopLoading();
  },
  methods: {
    //获取菜单
    getItemTypesForTree() {
      return this.$apis.BaseDictGetItemTypesForTree({}).then((res) => {
        this.menuList = res;
      });
    },
    //获取数据
    getMainList() {
      let query = {
        keyWord: this.searchKey,
        parentId: this.fatherId,
      };
      if (!this.fatherId) {
        delete query.parentId;
      }
      this.$apis
        .BaseDictGetDictItems({
          ...query,
        })
        .then((res) => {
          console.log(res);

          this.list = res;
        });
    },
    //点击菜单
    handleMenu(id, name) {
      this.fatherId = id;
      this.fatherName = name;
      this.searchKey = '';
      this.getMainList();
    },
    //点击菜单新增
    handleMenuAdd(item) {
      this.menuId = item.parentnodes;
      this.serial_no = '';
      this.dialogVisible = true;
    },
    //新增
    handleAdd() {
      this.menuId = '';
      if (this.fatherId) {
        this.serial_no = '';
        this.dialogVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: '请选择字典分类',
          type: 'warning',
        });
      }
    },
    //是否有效
    onEnable(item) {
      this.$apis.BaseDictChengeEnabled(item.serial_no).then((res) => {
        if (res) {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.getMainList();
        }
      });
    },
    //编辑
    edit(item) {
      this.menuId = '';
      this.serial_no = item.serial_no;
      this.dialogVisible = true;
    },
    //点击菜单编辑
    handleMenuEdit(item) {
      this.menuId = item.parentnodes;
      this.serial_no = item.id;
      this.dialogVisible = true;
    },
    //删除
    del(item) {
      this.$confirm(`确定要删除"${item.dict_name ? item.dict_name : item.text}"这条数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.BaseDictDeleteDictBySerialNo(item.serial_no ? item.serial_no : item.id).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              // if (item.id) {
              //   this.fatherId = ''
              //   this.fatherName
              // }
              this.list = [];
              this.getItemTypesForTree();
              this.handleMenu(this.fatherId, this.fatherName);
            }
          });
        })
        .catch(() => {});
    },
    //提交
    onSubmit(form) {
      this.$apis
        .BaseDictSaveDictType({
          serial_no: this.serial_no,
          ...form,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.dialogVisible = false;
            this.getMainList();
            this.getItemTypesForTree();
          }
        });
    },
  },
};
</script>

<style lang="scss">
.el-tooltip__popper {
  max-width: 80%;
}
</style>
