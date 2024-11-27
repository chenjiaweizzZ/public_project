<template>
  <div>
    <el-dialog custom-class="custom-small" :title="dialogTitle" :visible.sync="isShow" :close-on-click-modal="false" @close="closeDialog">
      <el-form ref="addEmployeeFormRef" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <p class="baseInfo">基本信息</p>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <span class="detailItem">：{{currentDataInfo.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="2"> &nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="性别">
              <span class="detailItem">：{{currentDataInfo.sex==0?'男':'女'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="工号" prop="username">
              <span class="right">：{{currentDataInfo.username}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="1"> &nbsp;</el-col>
          <el-col :span="12" style="float:right;padding-left:calc(4.167% - 10px)">
            <el-form-item label="医师资格证号" label-width="100px">
              <span class="detailItem">：{{currentDataInfo.doctor_qualification_number}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="手机号" prop="mobile">
              <span class="detailItem">：{{currentDataInfo.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="2"> &nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="年龄">
              <span class="detailItem" v-if="currentDataInfo.age">：{{ currentDataInfo.age }}岁</span>
              <span class="detailItem" v-else-if="currentDataInfo.addEmpYear">：{{(new Date().getFullYear()-currentDataInfo.addEmpYear)+'岁'}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="学历">
              <span class="detailItem">：{{currentDataInfo.educational}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="2"> &nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="学位" prop="degree">
              <span class="detailItem">：{{currentDataInfo.degree}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件类型">
              <span class="detailItem">：{{currentDataInfo.card_type_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="2"> &nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="证件号">
              <span class="detailItem">：{{currentDataInfo.card_num}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!--是否参加培训-->
        <el-row :gutter="20">
          <el-col :span="13">
            <el-form-item label="是否参加院内培训" prop="isjointrain">
              <span class="right">：{{currentDataInfo.isjointrain=='0'?'不参加':'参加'}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <!--原技术职称-->
            <el-form-item label="技术职称" prop="technique_id">
              <span class="detailItem">：{{currentDataInfo.technique}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资格时间" prop="technique_validate_date">
              <span class="detailItem">：{{currentDataInfo.technique_validate_date}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="聘用时间" prop="validate_date">
              <span class="detailItem">：{{currentDataInfo.technique_engage_date}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="教学职称" prop="teching_id">
              <span class="detailItem">：{{currentDataInfo.teching}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资格时间" prop="teching_validate_date">
              <span class="detailItem">：{{currentDataInfo.teching_validate_date}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="聘用时间" prop="teching_engage_date">
              <span class="detailItem">：{{currentDataInfo.teching_engage_date}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!--备注-->
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="备注">
              <span class="detailItem">：{{currentDataInfo.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-form-item label="科室信息" prop="roomInfo"></el-form-item>
        </el-row>

        <el-row :key="index" v-for="(officeInfo,index) in currentDataInfo.depts">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="科室">
                <span class="detailItem">：{{officeInfo.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务">
                <span class="detailItem">：{{officeInfo.positionname}}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="3">
              <el-button v-if="officeInfo.deleteflag==0&& showMode ==0" type="primary" @click="roomInfoDel(index)" class="roomInfoDel">移除</el-button>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="所属角色" class="pickRoles" prop="roles">
              <span class="detailItem">：{{officeInfo.roles | rolesFilter}}</span>
            </el-form-item>
          </el-row>
          <div v-if="index < currentDataInfo.depts.length-1" style="height:20px;">
            <div style="border:1px solid #ddd;border-bottom:0;width:95%;margin:0 auto;"></div>
          </div>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-button v-if="showMode ==0" type="primary" @click="roomInfoAdd" class="roomInfoAdd">添加科室</el-button>
        </el-row> -->
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { post, getCookie } from '../config/util'
  export default {
    props: {
      dialogEmployee: {
        type: Boolean,
        default() {
          return false;
        }
      },
      currentDataId: {
        type: String,
        default() {
          return ""
        }
      }
    },
    filters: {
      rolesFilter(val) {
        let temp = []
        val.forEach(item=>{
          temp.push(item.name)
        })
        return temp.join("、")
      },
    },
    watch: {
      dialogEmployee(newVal, oldVal) {
        this.isShow = newVal;
        this.dialogEmployee = newVal
        if (newVal) {
          this.personInfo()
        }
      }
    },
    data() {

      return {
        currentDataInfo: {},
        isShow: false,
        dialogTitle: "职工详情",
        rules: {
          name: [{ required: true }],
          mobile: [{ required: true }],
          technique_id: [{ required: true }], //变更增加
          username: [{ required: true }],
          isjointrain: [{ required: true }],
          roomInfo: [{ required: true }]
        },
      }
    },
    methods: {
      personInfo() {
        // 查询个人信息
        if (!this.currentDataId) {
          return false;
        }
        post('/dept/listdepttech', {
          command: 'dept/listdepttech',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          zpflag: 1,
          sizePerPage: 10,
          requestPage: 1,
          uid: this.currentDataId
        }).then((data) => {
          // self.loading = false;
          if (data && data.errcode == 0) {
            this.currentDataInfo = data.techlist[0];
            // self.totalCount = data.count;
          }
        }).catch(() => {
          this.$message.error({ message: '请求失败，请检查网络！' })
        })
      },
      closeDialog() {
        this.$emit('update:dialogEmployee', false)
      },
    }
  }
</script>
<style scoped>
  .baseInfo {
    margin-left: 10px;
  }
</style>