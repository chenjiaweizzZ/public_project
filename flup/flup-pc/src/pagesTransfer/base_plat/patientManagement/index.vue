<template>
  <div class="patientManagement">
    <div>
      <div class="sxk">
        <div class="queryconditions1">
          <el-button class="margin-left10" type="primary" @click="adddata('新增')" plain>新增</el-button>
          <el-input
            style=" width: 380px; margin-left: 20px;"
            :maxlength="searchKey=='phone'?11:searchKey=='idNo'?18:20"
            show-word-limit
            placeholder="请输入内容"
            v-model="searchValue"
            class="input-with-select limiting"
            clearable
          >
            <el-select style=" width: 100px;" v-model="searchKey" slot="prepend" placeholder="请选择">
              <el-option label="姓名" value="patientName"></el-option>
              <el-option label="身份证号" value="idNo"></el-option>
              <el-option label="手机号码" value="phone"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="Inquire"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:60px">
      <el-table-column prop="patientName" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="idNo" label="身份证" min-width="200"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNo"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>

    <el-dialog :title="title+'病人信息'" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :close-on-press-esc="false">
      <div class="formbox">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名" prop="patientName">
            <el-input class="limiting" v-model="ruleForm.patientName" maxlength="5" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNo">
            <el-input :disabled="title == '修改'" class="limiting" v-model="ruleForm.idNo" maxlength="18" show-word-limit @input="getIdInformation"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="ruleForm.sex" :disabled="true" clearable></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="dateOfBirth">
            <el-input v-model="ruleForm.dateOfBirth" :disabled="true" clearable></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="clan">
            <el-select v-model="ruleForm.clan" placeholder="请选择" clearable @change="codexz(ruleForm.clan,clanList,'dictName','dictCode','clan')">
              <el-option v-for="(item, index) in clanList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职业" prop="occupationType">
            <el-select
              v-model="ruleForm.occupationType"
              placeholder="请选择"
              clearable
              @change="codexz(ruleForm.occupationType,occupationTypeList,'dictName','dictCode','occupationType')"
            >
              <el-option v-for="(item, index) in occupationTypeList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文化程度" prop="educationLevel">
            <el-select
              v-model="ruleForm.educationLevel"
              placeholder="请选择"
              clearable
              @change="codexz(ruleForm.educationLevel,educationLevelList,'dictName','dictCode','educationLevel') "
            >
              <el-option v-for="(item, index) in educationLevelList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="婚姻状况" prop="maritalStatus">
            <el-select
              v-model="ruleForm.maritalStatus"
              placeholder="请选择"
              clearable
              @change="codexz(ruleForm.maritalStatus,maritalStatusList,'dictName','dictCode','maritalStatus')"
            >
              <el-option v-for="(item, index) in maritalStatusList" :key="index" :label="item.dictName" :value="item.dictCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="家庭号码" prop="mobile">
            <el-input class="limiting" @input="ruleForm.mobile = String(ruleForm.mobile).replace(/[^\d]/g,'')" v-model.number="ruleForm.mobile" maxlength="11" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input class="limiting" @input="ruleForm.phone = String(ruleForm.phone).replace(/[^\d]/g,'')" v-model.number="ruleForm.phone" maxlength="11" show-word-limit></el-input>
          </el-form-item>
          <el-form-item style="width:100%" label="现住址">
            <div class="addressbox">
              <el-select v-model="ruleForm.homeAddrState" placeholder="— —省— —" @change="state" clearable>
                <el-option v-for="(item,index) in areaList.province_list" :key="index" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="ruleForm.homeAddrCity" placeholder="— —市— —" @change="city" clearable>
                <el-option v-for="(item,index) in cityList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="ruleForm.homeAddrCounty" placeholder="— —区— —" clearable>
                <el-option v-for="(item,index) in countryList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
              <el-input class="txinput limiting" v-model="ruleForm.homeAddrVillage" maxlength="50" show-word-limit></el-input>
            </div>
          </el-form-item>
          <el-form-item label="医保卡号" prop="medicalInsuranceCardNo">
            <el-input class="limiting" v-model="ruleForm.medicalInsuranceCardNo" maxlength="18" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="工作单位" prop="nameOfEmployer">
            <el-input class="limiting" v-model="ruleForm.nameOfEmployer" maxlength="20" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input class="limiting" v-model="ruleForm.contactName" maxlength="5" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="联系人关系" prop="contactType">
            <el-input class="limiting" v-model="ruleForm.contactType" maxlength="5" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactPhone">
            <el-input
              class="limiting"
              @input="ruleForm.contactPhone = String(ruleForm.contactPhone).replace(/[^\d]/g,'')"
              v-model="ruleForm.contactPhone"
              maxlength="11"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人地址" prop="contactAddr">
            <el-input class="limiting" v-model="ruleForm.contactAddr" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInformation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { areaList } from '@/assets/js/city';
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      // if (!(/^1[3456789]\d{9}$/.test(value) || /0\d{2}\d{7,8}/.test(value))) {
      if (!/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value)) {
        callback(new Error('无效手机号'));
      } else {
        callback();
      }
    };
    return {
      title: '新增',
      areaList: areaList,
      dialogVisible: false,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      rules: {
        patientName: [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
        idNo: [{ required: true, message: '请输入身份证号码', trigger: ['blur', 'change'] }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] },
        ],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: ['blur', 'change'] }],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] },
        ],
        sex: [
          {
            required: true,
            message: '请输入正确的身份证号码以便获取信息',
            trigger: 'change',
          },
        ],
      },
      searchValue: null,
      searchKey: 'patientName',
      ruleForm: {
        patientName: null,
        idNo: null,
        sex: null,
        dateOfBirth: null,
        clanCode: null,
        clan: null,
        occupationTypeCode: null,
        occupationType: null,
        educationLevelCode: null,
        educationLevel: null,
        maritalStatusCode: null,
        maritalStatus: null,
        phone: null,
        mobile: null,
        homeAddrState: null,
        homeAddrCity: null,
        homeAddrCounty: null,
        homeAddrVillage: null,
        medicalInsuranceCardNo: null,
        nameOfEmployer: null,
        contactName: null,
        contactType: null,
        contactPhone: null,
        contactAddr: null,
      },
      maritalStatusList: [],
      clanList: [],
      educationLevelList: [],
      occupationTypeList: [],
    };
  },

  created() {
    this.getlist();
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Nomal',
        parentDictCode: 'MaritalStatus',
      })
      .then((res) => {
        this.maritalStatusList = res;
      });
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Nomal',
        parentDictCode: 'Nation',
      })
      .then((res) => {
        this.clanList = res;
      });
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Nomal',
        parentDictCode: 'Degree',
      })
      .then((res) => {
        this.educationLevelList = res;
      });
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Nomal',
        parentDictCode: 'Occupational',
      })
      .then((res) => {
        this.occupationTypeList = res;
      });
  },
  computed: {
    cityList() {
      if (!this.ruleForm.homeAddrState) {
        this.ruleForm.homeAddrCity = '';
        this.ruleForm.homeAddrCounty = '';
        return {};
      }
      let obj = Object.assign({}, this.areaList.city_list);
      let areaListCode = null;
      for (let i in this.areaList.province_list) {
        if (this.areaList.province_list[i] == this.ruleForm.homeAddrState) {
          areaListCode = i;
          break;
        }
      }
      if (!areaListCode) {
        areaListCode = this.ruleForm.homeAddrState;
      }
      Object.keys(this.areaList.city_list).forEach((element) => {
        if (element.slice(0, 2) != areaListCode.slice(0, 2)) {
          delete obj[element];
        }
      });
      return obj;
    },
    countryList() {
      if (!this.ruleForm.homeAddrCity) {
        this.ruleForm.homeAddrCounty = '';
        return {};
      }

      let obj = { ...this.areaList.county_list };

      let citylistCode = null;
      for (let i in this.areaList.city_list) {
        if (this.areaList.city_list[i] == this.ruleForm.homeAddrCity) {
          citylistCode = i;
          break;
        }
      }
      if (!citylistCode) {
        citylistCode = this.ruleForm.homeAddrCity;
      }
      Object.keys(this.areaList.county_list).forEach((element) => {
        if (element.slice(0, 4) != citylistCode.slice(0, 4)) {
          delete obj[element];
        }
      });
      return obj;
    },
  },
  watch: {},
  methods: {
    addInformation() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$apis
            .editPatientBasicInfo({
              ...this.ruleForm,
            })
            .then((res) => {
              if (res) {
                this.$message({
                  message: '调用成功',
                  type: 'success',
                });
                this.dialogVisible = false;
                this.getlist();
              }
            });
        } else {
          return false;
        }
      });
    },
    state() {
      this.ruleForm.homeAddrCity = null;
      this.ruleForm.homeAddrCounty = null;
    },
    city() {
      this.ruleForm.homeAddrCounty = null;
    },
    codexz(valeu, list, listName, listCoed, name) {
      let code = name + 'Code';
      for (let i in list) {
        if (valeu == list[i][listCoed]) {
          this.ruleForm[name] = list[i][listName];
        }
      }
    },
    adddata(title) {
      this.title = title;
      let ruleForm = {
        patientName: null,
        idNo: null,
        sex: null,
        dateOfBirth: null,
        clanCode: null,
        clan: null,
        occupationTypeCode: null,
        occupationType: null,
        educationLevelCode: null,
        educationLevel: null,
        maritalStatusCode: null,
        maritalStatus: null,
        phone: null,
        mobile: null,
        homeAddrState: null,
        homeAddrCity: null,
        homeAddrCounty: null,
        homeAddrVillage: null,
        medicalInsuranceCardNo: null,
        nameOfEmployer: null,
        contactName: null,
        contactType: null,
        contactPhone: null,
        contactAddr: null,
      };
      this.ruleForm = ruleForm;
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].resetFields();
      }
      this.dialogVisible = true;
    },
    edit(row) {
      this.adddata('修改');
      this.ruleForm = JSON.parse(JSON.stringify(row));
      this.getIdInformation(this.ruleForm.idNo);
    },
    Inquire() {
      this.pageNo = 1;
      this.getlist();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlist();
    },
    getlist() {
      this.$apis
        .getPatientBasicInfoList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchKey: this.searchKey,
          searchValue: this.searchValue,
        })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.total;
        });
    },
    getIdInformation(value) {
      if (/^\d{17}(\d|x)$/i.test(value)) {
        let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子
        let arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; //校验码
        let sum = 0,
          idx;
        for (let i = 0; i < value.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
        }
        // 计算模（固定算法）
        idx = sum % 11;
        // 检验第18为是否与校验码相等
        if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
          let getCarInfo = this.getCarInfo(value);
          this.ruleForm.dateOfBirth = getCarInfo.birthday;
          this.ruleForm.sex = getCarInfo.sex;
        } else {
          this.ruleForm.dateOfBirth = null;
          this.ruleForm.sex = null;
        }
      } else {
        this.ruleForm.dateOfBirth = null;
        this.ruleForm.sex = null;
      }
    },
    getCarInfo(UUserCard) {
      //获取输入身份证号码

      var arr = {};

      if (UUserCard != null && UUserCard != '') {
        //获取出生日期

        var birthday = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14);

        arr.birthday = birthday;

        //获取性别

        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
          arr.sex = '男';
        } else {
          arr.sex = '女';
        }

        //获取年龄

        var myDate = new Date();

        var month = myDate.getMonth() + 1;

        var day = myDate.getDate();

        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;

        if (UUserCard.substring(10, 12) < month || (UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day)) {
          age++;
        }

        arr.age = age;

        //$("#age").val(age);

        //年龄 age
      }

      return arr;
    },
  },
};
</script>

<style lang="scss">
.patientManagement {
  padding: 0 20px;
  .sxk {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f8f8f8;
  }
  .queryconditions1 {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    p {
      width: 80px;
      margin: 0 0 0 20px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
    }
  }
  .recordbox {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
  .formbox {
    height: 400px;
    overflow: scroll;
    .el-form {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;

      .el-form-item {
        width: 49%;
      }
      .el-select {
        width: 100%;
      }
      .addressbox {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .el-select,
        .txinput {
          width: 24%;
        }
      }
    }
  }
}
</style>