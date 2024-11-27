<template>
  <div>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      v-loading="loading"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="11">
          <el-form-item prop="hospital_name" label="医院名称">
            <el-input class="width100" placeholder="请输入医院名称" v-model="form.hospital_name"></el-input>
          </el-form-item>
          <el-form-item prop="organization_code" label="机构编码">
            <el-input class="width100" placeholder="请输入机构编码" v-model="form.organization_code"></el-input>
          </el-form-item>
          <el-form-item prop="level" label="医院等级">
            <el-select class="width100" v-model="form.level" placeholder="请选择医院等级">
              <el-option
                v-for="item in levelList"
                :key="item.dict_node"
                :label="item.dict_name"
                :value="item.dict_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="agency_id" label="上级部门">
            <el-select class="width100" v-model="form.agency_id" placeholder="请选择上级部门" clearable>
              <el-option
                v-for="item in agencysList"
                :key="item.id"
                :label="item.text"
                :value="item.text"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="hospital_short_name" label="医院简称">
            <el-input class="width100" placeholder="请输入医院简称" v-model="form.hospital_short_name"></el-input>
          </el-form-item>
          <el-form-item prop="medical_code" label="医保代码">
            <el-input class="width100" placeholder="请输入医保代码" v-model="form.medical_code"></el-input>
          </el-form-item>
          <el-form-item prop="hospital_type" label="医院类型">
            <el-select class="width100" v-model="form.hospital_type" placeholder="请选择医院类型">
              <el-option
                v-for="item in hospitalTypeList"
                :key="item.dict_node"
                :label="item.dict_name"
                :value="item.dict_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="联系电话">
            <el-input class="width100" placeholder="请输入联系电话" v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form-item prop="website" label="医院网址">
            <el-input class="width100" placeholder="请输入医院网址" v-model="form.website"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="11">
          <el-form-item prop="postcode" label="邮编">
            <el-input class="width100" placeholder="请输入邮编" v-model="form.postcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="email" label="邮箱">
            <el-input class="width100" placeholder="请输入邮编" v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form-item prop="address" label="医院地址">
            <el-select v-model="form.province" style="width:190px" placeholder="请选择医院所在省" clearable>
              <el-option
                v-for="(item,index) in areaList.province_list"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <el-select v-model="form.city" style="width:190px" placeholder="请选择医院所在市" clearable>
              <el-option v-for="(item,index) in cityList" :key="index" :label="item" :value="index"></el-option>
            </el-select>
            <el-select v-model="form.district" style="width:190px" placeholder="请选择医院所在区" clearable>
              <el-option
                v-for="(item,index) in countryList"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <el-input class="margin20X" placeholder="请输入医院地址" v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form-item prop="description" label="医院介绍">
            <el-input
              type="textarea"
              class="width100 hospitalList-textarea"
              placeholder="请输入医院介绍"
              v-model="form.description"
              :autosize="{ minRows: 3 , maxRows:5}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="dialog-footer" type="flex" justify="end">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { areaList } from '@/assets/js/city'

export default {
  props: ['serial_no'],
  computed: {
    isEdit() {
      return !!this.serial_no
    },
    cityList() {
      if (!this.form.province) {
        this.form.city = ''
        this.form.district = ''
        return {}
      }
      let obj = { ...this.areaList.city_list }
      Object.keys(this.areaList.city_list).forEach(element => {
        if (element.slice(0, 2) !== this.form.province.slice(0, 2)) {
          delete obj[element]
        }
      })
      return obj
    },
    countryList() {
      if (!this.form.city) {
        this.form.district = ''
        return {}
      }
      let obj = { ...this.areaList.county_list }
      Object.keys(this.areaList.county_list).forEach(element => {
        if (element.slice(0, 4) !== this.form.city.slice(0, 4)) {
          delete obj[element]
        }
      })
      return obj
    }
  },

  data() {
    return {
      areaList: areaList,
      loading: true,
      rules: {
        hospital_name: [
          { required: true, message: '请输入医院名称', trigger: 'blur' }
        ],
        hospital_short_name: [
          { required: true, message: '请输入医院简称', trigger: 'blur' }
        ],
        organization_code: [
          { required: false, message: '请输入机构编码', trigger: 'blur' }
        ],
        medical_code: [
          { required: false, message: '请输入医保代码', trigger: 'blur' }
        ],
        level: [{ required: true, message: '请选择医院等级', trigger: 'blur' }],
        hospital_type: [
          { required: true, message: '请选择医院类型', trigger: 'blur' }
        ],
        agency_id: [
          { required: false, message: '请选择上级部门', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        website: [
          { required: false, message: '请输入医院网址', trigger: 'blur' }
        ],
        postcode: [{ required: false, message: '请输入邮编', trigger: 'blur' }],
        email: [{ required: false, message: '请输入邮箱', trigger: 'blur' }],
        province: [
          { required: false, message: '请选择医院所在省', trigger: 'blur' }
        ],
        city: [
          { required: false, message: '请选择医院所在市', trigger: 'blur' }
        ],
        district: [
          { required: false, message: '请选择医院所在区', trigger: 'blur' }
        ],
        address: [
          { required: false, message: '请输入医院地址', trigger: 'blur' }
        ],
        description: [
          { required: false, message: '请输入医院介绍', trigger: 'blur' }
        ]
      },
      form: {
        hospital_name: '',
        hospital_short_name: '',
        organization_code: '',
        medical_code: '',
        level: '',
        hospital_type: '',
        agency_id: '',
        phone: '',
        website: '',
        postcode: '',
        email: '',
        province: '',
        city: '',
        district: '',
        address: '',
        description: ''
      },
      toGetLevel: {
        dictCode: 'HospitalLevel'
      },
      toGetHospitalType: {
        dictCode: 'HospitalType'
      },
      levelList: [],
      hospitalTypeList: [],
      agencysList: []
    }
  },
  created() {
    if (this.isEdit) {
      this.$apis
        .getHospitalBySerialNo({
          serial_No: this.serial_no,
          _: +new Date()
        })
        .then(res => {
          if (res) {
            let resItem = res
            for (let key in this.form) {
              if (key in resItem) {
                this.form[key] = resItem[key]
              }
            }
            Promise.all([
              this.getLevelList(),
              this.getHospitalTypeList(),
              this.getAgencysList()
            ]).then(values => {
              this.loading = false
            })
          } else {
            this.$message({
              message: '获取用户信息失败',
              type: 'error'
            })
          }
        })
    } else {
      Promise.all([
        this.getLevelList(),
        this.getHospitalTypeList(),
        this.getAgencysList()
      ]).then(values => {
        this.loading = false
      })
    }
  },
  methods: {
    //获取医院等级列表
    async getLevelList() {
      await this.$apis
        .getLevelList({
          ...this.toGetLevel,
          _: +new Date()
        })
        .then(res => {
          this.levelList = res
        })
    },
    //获取医院类型列表
    async getHospitalTypeList() {
      await this.$apis
        .getLevelList({
          ...this.toGetHospitalType,
          _: +new Date()
        })
        .then(res => {
          this.hospitalTypeList = res
        })
    },
    //获取上级部门列表
    async getAgencysList() {
      await this.$apis
        .getAgencys({
          _: +new Date()
        })
        .then(res => {
          this.agencysList = res
        })
    },
    onCancel() {
      this.$emit('onCancel')
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$apis
            .hospitalSaveHospital({
              serial_no: this.serial_no,
              ...this.form
            })
            .then(res => {
              if (res) {
                this.$message({ message: '操作成功', type: 'success' })
                this.$emit('onSubmit')
              } else {
                this.$message({ message: '添加失败', type: 'error' })
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.hospitalList-textarea {
  .el-textarea__inner {
    resize: none;
  }
}
</style>


<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.vue-treeselect--multi {
  line-height: 15px;
}

.vue-treeselect__control {
  height: 32px;
}
</style>
