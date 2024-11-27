<!-- 合并患者 -->
<template>
  <div class="content" v-loading="loading">
    <div class="left-part">
      <div class="patient-info">
        <div class="blue-box"></div>
        患者信息
      </div>
      <el-button class="save-btn" type="primary" size="mini" plain @click="submitForm"
        >保存</el-button
      >
      <div class="major-info">
        <div class="title-box">
          <div class="blue-box"></div>
          <div class="text">基本信息</div>
        </div>
        <div class="info">
          <el-form
            :inline="true"
            label-position="right"
            label-width="80px"
            :rules="rules"
            ref="ruleForm"
            :model="autoMergePatient"
            :show-message="false"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="autoMergePatient.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="autoMergePatient.sex" placeholder="请选择">
                <el-option
                  v-for="item in genderArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idcardNo">
              <el-input v-model="autoMergePatient.idcardNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="autoMergePatient.birthDate"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="血型" prop="bloodType">
              <el-select v-model="autoMergePatient.bloodType" placeholder="请选择">
                <el-option
                  v-for="item in bloodTypeArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="phoneHome">
              <el-input v-model="autoMergePatient.phoneHome" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="国籍">
              <el-select v-model="autoMergePatient.country" placeholder="请选择">
                <el-option
                  v-for="item in nationalityArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯">
              <div class="block">
                <el-cascader v-model="address" :options="options" :props="Props"></el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="民族">
              <el-select v-model="autoMergePatient.nation" placeholder="请选择">
                <el-option
                  v-for="item in nationalArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学历">
              <el-select v-model="autoMergePatient.culturalLevel" placeholder="请选择">
                <el-option
                  v-for="item in educationArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职业">
              <el-select v-model="autoMergePatient.occupation" placeholder="请选择">
                <el-option
                  v-for="item in occupationArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="婚姻状况">
              <el-select v-model="autoMergePatient.maritalStatus" placeholder="请选择">
                <el-option
                  v-for="item in maritalStatusArray"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="birth-info">
        <div class="title-box">
          <div class="blue-box"></div>
          <div class="text">出生地信息</div>
        </div>
        <div class="info">
          <el-form
            :inline="true"
            label-position="right"
            label-width="70px"
            :model="autoMergePatient"
          >
            <el-form-item label="出生地省">
              <el-select
                v-model="autoMergePatient.birthPlace"
                @change="choosePlace1"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in birthProvinceArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生地市">
              <el-select
                v-model="autoMergePatient.birthPlace1"
                @change="choosePlace2"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in birthCityArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生地县">
              <el-select v-model="autoMergePatient.birthPlace2" placeholder="请选择">
                <el-option
                  v-for="item in birthCountiesArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="work-info">
        <div class="title-box">
          <div class="blue-box"></div>
          <div class="text">工作单位</div>
        </div>
        <div class="info">
          <el-form
            :inline="true"
            label-position="right"
            label-width="70px"
            :model="autoMergePatient"
          >
            <el-form-item label="名称">
              <el-input v-model="autoMergePatient.workUnit" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="autoMergePatient.workAddress" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="autoMergePatient.phoneBusiness" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="contactPerson-info">
        <div class="title-box">
          <div class="blue-box"></div>
          <div class="text">联系人信息</div>
        </div>
        <div class="info">
          <el-form
            :inline="true"
            label-position="right"
            label-width="70px"
            :model="autoMergePatient"
          >
            <el-form-item label="关系">
              <el-input v-model="autoMergePatient.relationship" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="autoMergePatient.nextKin" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="autoMergePatient.nextKinPhone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="address-info">
        <div class="blue-box"></div>
        地址信息
      </div>
      <div class="table-info">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="addressType" label="地址类型" width="180"> </el-table-column>
          <el-table-column label="地址信息" prop="addressinfo">
            <template slot-scope="scope">
              <el-input v-model="scope.row.addressinfo"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right-part">
      <div class="patient-info-compare">
        <div class="patient-info-title">
          <div class="blue-box"></div>
          患者信息对比
        </div>
        <div class="table-content">
          <el-table
            v-if="transData.length > 0"
            :data="transData"
            border
            stripe
            :header-cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column
              min-width="180px"
              show-overflow-tooltip
              v-for="(item, index) in transTitle"
              :fixed="index === 0"
              :key="index"
            >
              <template slot="header">
                <div class="slot-style">
                  <img
                    style="margin-right:4px"
                    src="../../../assets/images/mainKey.svg"
                    v-if="index === 1"
                    alt=""
                  />
                  {{ item }}
                </div>
              </template>
              <template slot-scope="scope">
                {{ scope.row[index] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mergeViewData, getEnumList, merge, getProvinceList } from "@/service/empi"
import { EventBus } from "../../../event-bus"
import { mapMutations } from "vuex"
export default {
  name: "mergePatient",
  components: {},
  data() {
    return {
      loading: false,
      defaultProvice: "",
      defaultCity: "",
      tableData: [
        {
          addressType: "户籍地址",
          addressinfo: "",
        },
        {
          addressType: "现住址",
          addressinfo: "",
        },
        {
          addressType: "工作地址",
          addressinfo: "",
        },
      ],
      testData: [],
      originTitle: [
        "姓名",
        "性别",
        "身份证号",
        "出生日期",
        "联系电话",
        "血型",
        "国籍",
        "籍贯",
        "民族",
        "学历",
        "职业",
        "婚姻状况",
        "工作单位名称",
        "单位地址",
        "现住址",
      ],
      transTitle: [""],
      postParamsAddress: "",
      address: "",
      rules: {
        name: [{ required: true }],
        sex: [{ required: true }],
        idcardNo: [{ required: true }],
        birthDate: [{ required: true }],
        bloodType: [{ required: true }],
        phoneHome: [{ required: true }],
      },

      nationalityArray: [], //国籍
      nativePlaceArray: [], //籍贯
      maritalStatusArray: [], //婚姻状况
      birthProvinceArray: [], //出生省
      educationArray: [], //学历
      bloodTypeArray: [], //血型
      occupationArray: [], //职业
      genderArray: [], //性别
      nationalArray: [], //民族
      birthCityArray: [], //出生市
      birthCountiesArray: [], //出生县
      autoMergePatient: {}, // 左边数据
      childPatientList: {}, //右边数据
      transData: [],
      chooseProviceId: "", //省id
      chooseStateId: "", //市id
      value: [],
      Props: {
        children: "children",
        label: "name",
        value: "id",
        lazy: true,
        leaf: "leaf",
        lazyLoad(node, resolve) {
          if (node.value) {
            let params = {
              isProvince: "false",
              parentId: "",
            }
            params.parentId = node.value
            getProvinceList(params)
              .then((res) => {
                this.birthCityArray = res
                let nodes = []
                res.forEach((i) => {
                  let obj = {}
                  obj.id = i.id
                  obj.name = i.name
                  obj.children = []
                  nodes.push(obj)
                  obj.leaf = node.level >= 2
                })
                resolve(nodes)
              })
              .catch(() => {})
          }
        },
      },
      options: [],
      old: [],
    }
  },
  created() {
    this.getEnumList()
    this.getMergeViewData()
    this.getProviceName()
    // this.getProviceName()
  },
  watch: {
    "$route.query.list"() {
      if (this.$route.query.list) {
        if (this.$route.query.list.toString() == this.old.toString()) {
        } else {
          this.getEnumList()
          this.getMergeViewData()
          this.getProviceName()
          this.loading = false
        }
      }
    },
  },
  methods: {
    ...mapMutations("menu", ["removeLabelByPath"]),
    getEnumList() {
      this.loading = true
      getEnumList()
        .then((res) => {
          this.loading = false
          this.nationalityArray = res.nationalityArray
          this.nativePlaceArray = res.nativePlaceArray
          this.maritalStatusArray = res.maritalStatusArray
          this.educationArray = res.educationArray
          this.bloodTypeArray = res.bloodTypeArray
          this.occupationArray = res.occupationArray
          this.genderArray = res.genderArray
          this.nationalArray = res.nationalArray
        })
        .catch(() => {})
    },
    getProviceName() {
      let params = {
        isProvince: "",
        parentId: "",
      }
      params.isProvince = true
      this.loading = true
      getProvinceList(params)
        .then((res) => {
          this.birthProvinceArray = res
          this.options = res
          this.options.forEach((i) => {
            i.children = []
          })
          this.loading = false
        })
        .catch(() => {})
    },
    choosePlace1() {
      let params = {
        isProvince: "",
        parentId: "",
      }
      params.isProvince = false
      params.parentId = this.autoMergePatient.birthPlace
      getProvinceList(params)
        .then((res) => {
          this.birthCityArray = res
          this.autoMergePatient.birthPlace1 = ""
          this.autoMergePatient.birthPlace2 = ""
        })
        .catch(() => {})
    },
    choosePlace2() {
      let params = {
        isProvince: "",
        parentId: "",
      }
      params.isProvince = false
      params.parentId = this.autoMergePatient.birthPlace1
      getProvinceList(params)
        .then((res) => {
          this.birthCountiesArray = res
          this.autoMergePatient.birthPlace2 = ""
        })
        .catch(() => {})
    },
    getMergeViewData() {
      let params = this.$route.query.list
      this.old = this.$route.query.list

      mergeViewData(params)
        .then((res) => {
          this.autoMergePatient = res.autoMergePatient
          this.address = res.originPlaceIdList
          this.defaultProvice = res.birthPlaceIdList[0]
          let proviceParams = {
            isProvince: false,
            parentId: this.defaultProvice,
          }
          getProvinceList(proviceParams)
            .then((res) => {
              this.birthCityArray = res
            })
            .catch(() => {})
          this.defaultCity = res.birthPlaceIdList[1]
          let cityParams = {
            isProvince: false,
            parentId: this.defaultCity,
          }
          getProvinceList(cityParams)
            .then((res) => {
              this.birthCountiesArray = res
            })
            .catch(() => {})
          this.getOptions(this.address)
          this.tableData[0].addressinfo = this.autoMergePatient.householdAddress
          this.tableData[1].addressinfo = this.autoMergePatient.currAddress
          this.tableData[2].addressinfo = this.autoMergePatient.workAddress
          this.testData = []
          res.childPatientList.forEach((i) => {
            let obj = {
              name: i.name,
              sex: i.sex,
              idcardNo: i.idcardNo,
              birthDate: i.birthDate,
              phoneHome: i.phoneHome,
              bloodType: i.bloodType,
              country: i.country,
              originPlace: i.originPlace + i.originPlace1 + i.originPlace2,
              nation: i.nation,
              culturalLevel: i.culturalLevel,
              occupation: i.occupation,
              maritalStatus: i.maritalStatus,
              workUnit: i.workUnit,
              workAddress: i.workAddress,
              currAddress: i.currAddress,
            }
            this.testData.push(obj)
          })
          this.transTitle = [""]
          for (let i = 0; i < res.childPatientList.length; i++) {
            this.transTitle.push(`患者${i + 1}`)
          }
          let matrixData = this.testData.map((row) => {
            let arr = []
            for (let key in row) {
              arr.push(row[key])
            }
            return arr
          })
          // 加入标题拼接最终的数据
          this.transData = matrixData[0].map((col, i) => {
            return [
              this.originTitle[i],
              ...matrixData.map((row) => {
                return row[i]
              }),
            ]
          })
        })
        .catch(() => {})
    },

    getOptions(list) {
      Promise.all([
        getProvinceList({ isProvince: true }),
        getProvinceList({ isProvince: false, parentId: list[0] }),
        getProvinceList({ isProvince: false, parentId: list[1] }),
      ]).then((result) => {
        let activeRegion = result[2].find((i) => {
          return i.id === list[2]
        })
        if (activeRegion) activeRegion.leaf = true
        let activeCity = result[1].find((i) => {
          return i.id === list[1]
        })
        if (activeCity) activeCity.children = result[2]
        let activeProvices = result[0].find((i) => {
          return i.id === list[0]
        })
        if (activeProvices) activeProvices.children = result[1]
        this.options = result[0]
      })
    },

    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            patientPo: {
              name: this.autoMergePatient.name,
              sex: this.autoMergePatient.sex,
              idcardNo: this.autoMergePatient.idcardNo,
              birthDate: this.autoMergePatient.birthDate,
              bloodType: this.autoMergePatient.bloodType,
              phoneHome: this.autoMergePatient.phoneHome,
              country: this.autoMergePatient.country,
              originPlace: this.address[0],
              originPlace1: this.address[1],
              originPlace2: this.address[2],
              nation: this.autoMergePatient.nation,
              culturalLevel: this.autoMergePatient.culturalLevel,
              occupation: this.autoMergePatient.occupation,
              maritalStatus: this.autoMergePatient.maritalStatus,
              birthPlace: this.autoMergePatient.birthPlace,
              birthPlace1: this.autoMergePatient.birthPlace1,
              birthPlace2: this.autoMergePatient.birthPlace2,
              workUnit: this.autoMergePatient.workUnit,
              workAddress: this.autoMergePatient.workAddress,
              phoneBusiness: this.autoMergePatient.phoneBusiness,
              relationship: this.autoMergePatient.relationship,
              nextKin: this.autoMergePatient.nextKin,
              nextKinPhone: this.autoMergePatient.nextKinPhone,
              householdAddress: this.tableData[0].addressinfo,
              currAddress: this.tableData[1].addressinfo,
              workAddress: this.tableData[2].addressinfo,
            },
            pidList: this.$route.query.list,
          }
          merge(params)
            .then(() => {
              this.removeLabelByPath("/empi/mergePatient")
              this.$router.push({
                name: "patientMasterIndex",
              })
              EventBus.$emit("initIndex", {
                isInit: true,
              })
              this.$message({
                message: "合并成功",
                type: "success",
              })
            })
            .catch(() => {
              console.log(err,"err");
              this.$message({
                message: "合并失败",
                type: "error",
              })
            })
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.content-box-module {
  margin: 10px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .title-box {
    display: flex;
    align-items: center;
    background: #fbfbfb;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    .blue-box {
      width: 4px;
      background: #0075ff;
      height: 16px;
      display: inline-block;
      margin-right: 10px;
    }
    .text {
      font-size: 14px;
      line-height: 22px;
    }
  }
  .info {
    padding-left: 5px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
  }
}
.content {
  width: calc(99%);
  height: calc(100vh - 50px);
  background-color: white;
  margin: 10px;
  display: flex;
  .left-part {
    width: 56%;
    height: 100%;
    overflow: auto;
    .patient-info {
      padding: 10px;
      display: flex;
      align-items: center;
      .blue-box {
        width: 4px;
        background: #0075ff;
        height: 17px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .save-btn {
      margin-left: 10px;
    }
    .major-info {
      @extend .content-box-module;
    }
    .birth-info {
      @extend .content-box-module;
    }
    .work-info {
      @extend .content-box-module;
    }
    .contactPerson-info {
      @extend .content-box-module;
    }
    .address-info {
      padding: 10px;
      display: flex;
      align-items: center;
      .blue-box {
        width: 4px;
        background: #0075ff;
        height: 17px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .table-info {
      margin: 0 10px;
    }
  }
  .right-part {
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    margin-top: 10px;
    width: 43.5%;
    .patient-info-compare {
      .patient-info-title {
        padding: 10px;
        display: flex;
        align-items: center;
        .blue-box {
          width: 4px;
          background: #0075ff;
          height: 17px;
          display: inline-block;
          margin-right: 5px;
        }
      }
      .table-content {
        margin-left: 10px;
        height: 100%;
        .slot-style {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
.el-button--primary.is-plain {
  background: white;
  color: #0075ff;
}
.el-button--mini {
  line-height: 14px !important;
}
.el-form-item {
  margin-bottom: 0px;
}
::v-deep .el-table__fixed {
  height: 448px !important;
}
</style>
<style lang="scss">
.major-info {
  .el-input__inner {
    width: 160px;
  }
}
.birth-info {
  .el-input__inner {
    width: 140px;
  }
}
.work-info {
  .el-input__inner {
    width: 140px;
  }
}
.contactPerson-info {
  .el-input__inner {
    width: 140px;
  }
}
</style>
