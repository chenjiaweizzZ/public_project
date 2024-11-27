<template>
  <div class="configuration">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      :before-leave="beforeLeave"
    >
      <el-tab-pane
        v-for="(item, index) in form.platPackageSpecInfoDtoList"
        :key="item.specId"
        :label="item.specName"
        :name="item.specId"
      >
        <div style="display: flex;">
          <el-form
            :model="item"
            ref="ruleForm"
            class="form"
            label-position="right"
            :rules="rules"
          >
            <el-form-item label="服务内容规格描述" label-width="170px">
              <el-input
                disabled
                type="textarea"
                resize="none"
                :rows="4"
                v-model="item.specDiscription"
                style="width: 260px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="橄榄云端售卖" label-width="170px">
              <el-select v-model="item.showOnCloud" style="width: 260px;">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="售价" prop="price" label-width="170px">
              <el-input-number
                style="width: 260px;"
                v-model="item.price"
                controls-position="right"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="100000"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">元</span>
            </el-form-item>
            <el-form-item label="服务时效" prop="expires" label-width="170px">
              <el-input-number
                style="width: 260px;display: inline-block;"
                v-model="item.expires"
                controls-position="right"
                :step="1"
                :min="1"
                :max="100000"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">天</span>
            </el-form-item>
            <div class="member-sources">
              <!-- <div class="title"><span class="red">*</span>服务成员来源</div> -->
              <div class="title">健康管理计划</div>
              <div class="plan">
                    <el-form-item
                    >
                      <el-select
                        filterable
                        style="width: 260px;"
                        v-model="item.planId"
                        placeholder="请选择健康管理计划"
                        clearable
                      >
                        <el-option
                          v-for="item in planList"
                          :key="item.serialNo"
                          :value="item.serialNo"
                          :label="item.planName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
              </div>
              <!-- <div>
                <el-radio-group v-model="item.bindIdType" @input="changeRadio">
                  <el-radio :label="1">
                    健康管理计划
                    <el-form-item
                      prop="planId"
                      style="display: inline-block;margin-left: 20px;"
                    >
                      <el-select
                        :disabled="item.bindIdType != 1"
                        filterable
                        style="width: 260px;"
                        v-model="item.planId"
                        placeholder="请选择健康管理计划"
                      >
                        <el-option
                          v-for="item in planList"
                          :key="item.serialNo"
                          :value="item.serialNo"
                          :label="item.planName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-radio>
                  <el-radio :label="2">
                    健康管理组&nbsp;&nbsp;&nbsp;
                    <el-form-item
                      prop="flupGroupId"
                      style="display: inline-block;margin-left: 20px;"
                    >
                      <el-select
                        :disabled="item.bindIdType != 2"
                        filterable
                        style="width: 260px;"
                        v-model="item.flupGroupId"
                        placeholder="请选择健康管理组"
                      >
                        <el-option
                          v-for="item in flupGroupList"
                          :key="item.serialNo"
                          :value="item.serialNo"
                          :label="item.groupName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-radio>
                </el-radio-group>
              </div> -->
            </div>
          </el-form>
          <el-form
            ref="ruleForm3"
            :model="item"
            class="form marginLeft"
            label-position="right"
            :rules="rules"
          >
            <el-form-item
              label="缩略图"
              label-width="110px"
              prop="displayPicUrl"
            >
              <el-upload
                ref="upload"
                action
                list-type="picture-card"
                :before-upload="beforeUpload"
                :file-list="fileList"
                :http-request="httpRequest"
                :on-remove="onRemove"
                :on-change="onChange"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <el-form
          :model="item"
          ref="ruleForm1"
          class="form"
          label-position="right"
          :rules="rules"
        >
          <el-form-item
            label="服务内容规格详细描述"
            prop="specPackageDiscription"
            label-width="170px"
          >
            <quill-editor
              class="quill"
              v-model="item.specPackageDiscription"
              ref="myQuillEditor"
              :options="editorOption"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event, 100000)"
            ></quill-editor>
            <input
              type="file"
              style="display: none"
              :id="imageId"
              name="file"
              accept="image/*"
              @change="changeImage()"
            />
            <input
              type="file"
              style="display:none"
              :id="videoId"
              name="file"
              accept="video/*"
              @change="changeVideo()"
            />
          </el-form-item>
        </el-form>
        <el-form
          :model="item"
          ref="ruleForm4"
          class="ruleForm4"
          label-width="160px"
          label-position="right"
        >
          <template v-for="(items, index) in item.platSpecDeviceDTOList">
            <el-form-item label="添加设备">
              <el-select
                v-model="items.deviceCode"
                style="width: 260px;"
                @change="onDeviceChange(items.deviceCode, index)"
                clearable
              >
                <el-option
                  v-for="instrument in deviceList"
                  :key="instrument.serial_no"
                  :label="instrument.dict_name"
                  :value="instrument.serial_no"
                  :disabled="getDeviceDisable(instrument.serial_no)"
                ></el-option>
              </el-select>
              <el-button class="marginLeft10" type="text" @click="addInstrument"
                >新增</el-button
              >
              <el-button
                type="text"
                class="marginLeft10"
                v-if="index > 0"
                @click="removeInstrument(index)"
                >删除</el-button
              >
            </el-form-item>
          </template>
        </el-form>
        <div class="split-setting">
          <div class="split-setting-title">
            <div class="title">
              分成设置
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改后即时生效，仅对新的订单生效，老的订单按原比例分成"
              placement="top-start"
            >
              <div class="box">
                ?
              </div>
            </el-tooltip>
          </div>
          <el-form
            ref="ruleForm5"
            class="form input-number-range"
            label-position="right"
          >
            <el-form-item
              label-width="160px"
              v-if="isHaveDevice(item.selectedDeviceList)"
            >
              <template slot="label">
                <div class="tooltip">
                  <span style="margin-right: 5px;">设备成本</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="后续利益分配会根据售价减去设备成本后进行分配"
                    placement="top-start"
                  >
                    <div class="box">
                      ?
                    </div>
                  </el-tooltip>
                </div>
              </template>
              <el-input-number
                v-model="item.deviceCost"
                style="width: 260px;"
                controls-position="right"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="item.price"
              >
              </el-input-number>
              <span style="padding: 10px 0 0 10px;">元</span>
            </el-form-item>
            <el-form-item label="医院比例" label-width="160px">
              <el-input-number
                v-model="item.moneyHospitalPercent"
                style="width: 260px;"
                controls-position="right"
                :precision="0"
                :step="1"
                :min="0"
                :max="100"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">%</span>
            </el-form-item>
            <el-form-item label="健康管理组比例" label-width="160px">
              <el-input-number
                v-model="item.moneyGroupPercent"
                style="width: 260px;"
                controls-position="right"
                :precision="0"
                :step="1"
                :min="0"
                :max="100"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">%</span>
            </el-form-item>
            <el-form-item label="公司比例" label-width="160px">
              <el-input-number
                v-model="item.companyProportion"
                style="width: 260px;"
                controls-position="right"
                :precision="0"
                :step="1"
                :min="0"
                :max="100"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">%</span>
            </el-form-item>
            <el-form-item label="第四方比例" label-width="160px">
              <el-input-number
                v-model="item.moneyOtherPercent"
                style="width: 260px;"
                controls-position="right"
                :precision="0"
                :step="1"
                :min="0"
                :max="100"
              ></el-input-number>
              <span style="padding: 10px 0 0 10px;">%</span>
            </el-form-item>
            <div class="error" v-if="isSumHundred">
              请配置正确的分成比例
            </div>
          </el-form>
        </div>
        <div class="split-setting" style="margin-top: 20px;">
          <div class="split-setting-title">
            <div class="title">
              核销设置
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改后即时生效，仅对新的订单生效，老的订单不受影响"
              placement="top-start"
            >
              <div class="box">
                ?
              </div>
            </el-tooltip>
          </div>
          <div class="form-table">
            <section>
              <div class="item" style="width: 20%;">项目</div>
              <div class="item" style="width: 40%;">次数</div>
              <div class="item" style="width: 40%;">操作</div>
            </section>
            <div
              v-for="(rowItem, rowIndex) in form
                .allPlatPackageVerifyItemsDtoList[Key]
                .platPackageVerifyItemsDtoList"
              :key="rowIndex"
              class="list"
            >
              <div class="item" style="width: 20%;">
                <el-select
                  v-model="rowItem.verifyItemCode"
                  placeholder="请选择"
                  @change="Change"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in DictList"
                    :key="item.serial_no"
                    :label="item.dict_name"
                    :value="item.dict_code"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </div>
              <div class="item" style="width: 40%;">
                <el-input-number
                  v-model="rowItem.verifyTimes"
                  :step="1"
                  :min="0"
                  step-strictly
                ></el-input-number>
              </div>
              <div
                class="item"
                style="width: 40%;display: flex;align-items: center;"
              >
                <el-button
                  type="text"
                  @click="moveUp(rowIndex)"
                  :disabled="rowIndex == 0"
                  >上移</el-button
                >
                <el-button
                  :disabled="
                    rowIndex ==
                      form.allPlatPackageVerifyItemsDtoList[Key]
                        .platPackageVerifyItemsDtoList.length -
                        1
                  "
                  type="text"
                  @click="moveDown(rowIndex)"
                  >下移</el-button
                >
                <el-button
                  type="text"
                  @click="DeleteVerifyItemsDtoList(rowIndex, rowItem)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  v-if="
                    rowIndex ==
                      form.allPlatPackageVerifyItemsDtoList[Key]
                        .platPackageVerifyItemsDtoList.length -
                        1
                  "
                  @click="AddVerifyItemsDtoList"
                  >新增</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-save">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import { Video } from "../../../assets/js/quillVideo";
Quill.register({ "formats/video": Video }, true);
export default {
  components: {
    quillEditor
  },
  data() {
    var selectPlanId = (rule, value, callback) => {
      if (this.form.platPackageSpecInfoDtoList[this.Key].bindIdType == 1) {
        if (!value) {
          return callback(new Error("请选择健康管理计划"));
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    };
    // flupGroupId
    var selectFlupGroupId = (rule, value, callback) => {
      if (this.form.platPackageSpecInfoDtoList[this.Key].bindIdType == 2) {
        if (!value) {
          return callback(new Error("请选择健康管理组"));
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    };
    return {
      dialogVisible: false,
      editableTabsValue: "",
      form: {},
      rules: {
        ruleId: [
          { required: true, message: "请选择规则名称", trigger: "change" }
        ],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        expires: [
          { required: true, message: "请输入服务天数", trigger: "change" }
        ],
        specPackageDiscription: [
          {
            required: true,
            message: "请输入服务内容规格详细描述",
            trigger: ["change"]
          }
        ],
        displayPicUrl: [
          {
            required: true,
            message: "请上传服务内容缩略图",
            trigger: "change"
          }
        ],
        planId: [
          {
            validator: selectPlanId,
            trigger: "change"
          }
        ],
        flupGroupId: [
          {
            validator: selectFlupGroupId,
            trigger: "change"
          }
        ]
      },
      optionsList: {},
      deleteId: [],
      optionsListAll: {},
      Key: 0,
      ruleKey: 0,
      isEdit: false,
      packageId: "",
      fileList: [],
      ceshi: false,
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
              ["blockquote", "code-block"], // 引用
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
              [{ script: "sub" }, { script: "super" }], // 上标/下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
              [{ font: [] }], // 字体种类
              [{ align: [] }], // 对齐方式
              ["clean"], // 清除文本格式
              ["link", "image", "video"] // 链接、图片、视频
            ],
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.getElementById("uploadImg").click();
                } else {
                  this.quill.format("image", false);
                }
              },
              video: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.getElementById("uploadVideo").click();
                } else {
                  this.quill.format("video", false);
                }
              }
            }
          }
        }
      },
      imageId: "uploadImg",
      videoId: "uploadVideo",
      addImgRange: null,
      addVideoRange: null,
      deviceList: [],
      selectedDeviceList: [],
      planList: [],
      flupGroupList: [],
      isSumHundred: false,
      DictList: [],
      deleteList: []
    };
  },
  created() {
    this.getParamValue();
    this.getPackageInfo(true);
    this.GetHMDictItems();
  },
  computed: {
    isSum() {
      if (this.form.platPackageSpecInfoDtoList) {
        let arr = [];
        if (
          !this.isEmpty(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyHospitalPercent
          )
        ) {
          arr.push(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyHospitalPercent
          );
        }
        if (
          !this.isEmpty(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyGroupPercent
          )
        ) {
          arr.push(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyGroupPercent
          );
        }
        if (
          !this.isEmpty(
            this.form.platPackageSpecInfoDtoList[this.Key].companyProportion
          )
        ) {
          arr.push(
            this.form.platPackageSpecInfoDtoList[this.Key].companyProportion
          );
        }
        if (
          !this.isEmpty(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyOtherPercent
          )
        ) {
          arr.push(
            this.form.platPackageSpecInfoDtoList[this.Key].moneyOtherPercent
          );
        }
        return arr;
      } else {
        return [];
      }
    },
    platPackageVerifyItemsDtoList() {
      return this.form.allPlatPackageVerifyItemsDtoList[this.Key]
        .platPackageVerifyItemsDtoList;
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        if (oldValue.classId && newValue.classId) {
          this.isEdit = true;
        }
      },
      deep: true
    },
    isSum: {
      handler(newValue, oldValue) {
        console.log(newValue)
        if (
          newValue.length == 4 &&
          newValue[0] * 1 + newValue[1] * 1 + newValue[2] * 1 +  newValue[3] * 1 == 100
        ) {
          this.isSumHundred = false;
        } else {
          this.isSumHundred = true;
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 获取字典
     */
    async getBaseDictGetDictItems() {
      await this.$apis
        .BaseDictGetDictItems({
          parentId: "20240418000000000001"
        })
        .then(res => {
          this.DictList = res;
        });
    },
    /**
     * 健康管理计划查询
     */
    async getQueryFlupPlanForPackage(deptId) {
      await this.$apis
        .queryFlupPlanForPackage({
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
          deptId
        })
        .then(res => {
          this.planList = res;
        });
    },
    /**
     * 健康管理组查询
     */
    async getFlupGroupList(deptId) {
      await this.$apis
        .groupgetFlupGroupList({
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
          deptId,
          pageNo: 1,
          pageSize: 999
        })
        .then(res => {
          this.flupGroupList = res.list;
        });
    },
    /**
     * 获取服务包详情
     */
    getPackageInfo(isBool) {
      this.$apis
        .getPackageInfo({
          packageId: this.packageId,
          flag: true
        })
        .then(async res => {
          await this.getQueryFlupPlanForPackage(res.deptId);
          await this.getFlupGroupList(res.deptId);
          await this.getBaseDictGetDictItems();
          this.form = res;
          this.form.platPackageSpecInfoDtoList.forEach(item => {
            item.price = (item.price / 100).toFixed(2);
            item.deviceCost = (item.deviceCost / 100).toFixed(2);
            item.selectedDeviceList = [];
            this.$set(
              item,
              "companyProportion",
              100 - item.moneyHospitalPercent - item.moneyGroupPercent - item.moneyOtherPercent
            );
            if (item.bindIdType == 2) {
              this.$set(item, "flupGroupId", item.planId);
              this.$set(item, "planId", "");
            } else {
              this.$set(item, "flupGroupId", "");
              this.$set(item, "planId", item.planId);
            }
          });
          if (isBool) {
            this.editableTabsValue = res.platPackageSpecInfoDtoList[0].specId;
          }
          let arr1 = this.form.platPackageSpecInfoDtoList[this.Key]
            .platSpecDeviceDTOList;
          let planId = this.form.platPackageSpecInfoDtoList[this.Key].planId;
          this.getPlanDetail(planId);
          res.allPlatPackageVerifyItemsDtoList.forEach(item => {
            if (item.platPackageVerifyItemsDtoList.length == 0) {
              item.platPackageVerifyItemsDtoList.push({
                verifyItemCode: "",
                verifyTimes: 0
              });
            }
          });
          this.Change();
          // 初始化时，后端返回的为null，而前端默认要展示哟条数据
          if (!arr1) {
            this.form.platPackageSpecInfoDtoList[
              this.Key
            ].platSpecDeviceDTOList = [];
            this.form.platPackageSpecInfoDtoList[
              this.Key
            ].platSpecDeviceDTOList.push({
              deviceCode: "",
              deviceName: "",
              specId: this.form.platPackageSpecInfoDtoList[this.Key].specId
            });
          } else {
            this.form.platPackageSpecInfoDtoList[
              this.Key
            ].selectedDeviceList = arr1.map(item => item.deviceCode);
          }
          // 缩略图显示
          if (this.form.platPackageSpecInfoDtoList[this.Key].displayPicUrl) {
            this.fileList.push({
              url: this.form.platPackageSpecInfoDtoList[this.Key].displayPicUrl
            });
          } else {
            this.fileList = [];
          }
          this.$nextTick(() => {
            this.isEdit = false;
            this.$refs.ruleForm[this.Key].clearValidate();
          });
        });
    },
    /**
     * 保存
     */
    save() {
      if (this.isSumHundred) {
        this.$message({
          type: "warning",
          message: "请配置正确的分成比例"
        });
      } else {
        let p1 = new Promise((reslove, reject) => {
          this.$refs.ruleForm[this.Key].validate(valid => {
            if (valid) {
              return reslove();
            } else {
              return;
            }
          });
        });
        let p2 = new Promise((reslove, reject) => {
          this.$refs.ruleForm1[this.Key].validate(valid => {
            if (valid) {
              return reslove();
            } else {
              return;
            }
          });
        });
        let p4 = new Promise((reslove, reject) => {
          this.$refs.ruleForm3[this.Key].validate(valid => {
            if (valid) {
              return reslove();
            } else {
              return;
            }
          });
        });
        let p5 = new Promise((reslove, reject) => {
          this.$refs.ruleForm4[this.Key].validate(valid => {
            if (valid) {
              return reslove();
            } else {
              return;
            }
          });
        });
        Promise.all([p1, p2, p4, p5]).then(() => {
          this.$confirm("确定要保存修改吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "hm-width"
          })
            .then(() => {
              let form = JSON.parse(JSON.stringify(this.form));
              let index = form.platPackageSpecInfoDtoList[
                this.Key
              ].displayPicUrl.lastIndexOf("/");
              form.platPackageSpecInfoDtoList[
                this.Key
              ].displayPicUrl = form.platPackageSpecInfoDtoList[
                this.Key
              ].displayPicUrl.slice(index + 1);
              form.platPackageSpecInfoDtoList[
                this.Key
              ].deletedPlatSpecRuleIdList =
                this.deleteId.length > 0 ? this.deleteId : null;
              // 过滤设备无用的数据
              form.platPackageSpecInfoDtoList[
                this.Key
              ].platSpecDeviceDTOList = form.platPackageSpecInfoDtoList[
                this.Key
              ].platSpecDeviceDTOList.filter(item => item.deviceCode);
              if (
                form.platPackageSpecInfoDtoList[this.Key].platSpecDeviceDTOList
                  .length < 1
              ) {
                form.platPackageSpecInfoDtoList[this.Key].deviceCost = 0;
              } else {
                form.platPackageSpecInfoDtoList[this.Key].deviceCost =
                  form.platPackageSpecInfoDtoList[this.Key].deviceCost * 100;
              }
              form.platPackageSpecInfoDtoList = [
                form.platPackageSpecInfoDtoList[this.Key]
              ];
              form.platPackageSpecInfoDtoList[0].price =
                form.platPackageSpecInfoDtoList[0].price * 100;
              form.platPackageSpecInfoDtoList[0].planId =
                form.platPackageSpecInfoDtoList[0].planId
              let arr = form.allPlatPackageVerifyItemsDtoList[
                this.Key
              ].platPackageVerifyItemsDtoList.filter(item => {
                return (
                  (item.verifyItemCode && item.verifyTimes > 0) || item.serialNo
                );
              });
              let newArr = arr.map((item, index) => {
                let obj = {
                  ...item,
                  specId: form.platPackageSpecInfoDtoList[0].specId,
                  verifyItemName:
                    this.DictList.filter(items => {
                      return item.verifyItemCode == items.dict_code;
                    }).length > 0
                      ? this.DictList.filter(items => {
                          return item.verifyItemCode == items.dict_code;
                        })[0].dict_name
                      : "",
                  showOrder: index
                };
                return obj;
              });
              form.allPlatPackageVerifyItemsDtoList = [
                {
                  // platPackageVerifyItemsDtoList: this.uniqueArr([
                  //   ...newArr,
                  //   ...this.deleteList
                  // ])
                  platPackageVerifyItemsDtoList: [...newArr, ...this.deleteList]
                }
              ];
              this.$apis.saveSpecRule(form).then(res => {
                // this.$message({
                //   message: "操作成功",
                //   type: "success"
                // });
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                });
                this.$refs.upload[this.Key].clearFiles();
                this.fileList = [];
                this.deleteList = [];
                this.getPackageInfo(false);
              });
            })
            .catch(err => {
              console.log(err);
            });
        });
      }
    },
    beforeLeave(activeName, oldActiveName) {
      var p = new Promise((resolve, reject) => {
        if (!oldActiveName || oldActiveName == 0) {
          resolve();
        } else {
          if (this.isEdit) {
            this.$confirm("离开后修改的数据不会保存，是否离开？", "提示", {
              confirmButtonText: "离开",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "hm-width"
            })
              .then(() => {
                this.clearValidate();
                this.$refs.ruleForm[this.Key].clearValidate();
                this.$refs.ruleForm1[this.Key].clearValidate();
                this.$refs.ruleForm3[this.Key].clearValidate();
                this.fileList = [];
                // 获取索引
                let i = this.form.platPackageSpecInfoDtoList.findIndex(item => {
                  return item.specId == activeName;
                });
                this.Key = i;
                this.ruleKey = 0;
                this.getPackageInfo();
                resolve();
              })
              .catch(err => {
                reject();
              });
          } else {
            this.clearValidate();
            this.fileList = [];
            // 获取索引
            let i = this.form.platPackageSpecInfoDtoList.findIndex(item => {
              return item.specId == activeName;
            });
            this.Key = i;
            this.ruleKey = 0;
            this.getPackageInfo();
            resolve();
          }
        }
      });
      return p;
    },
    getStr(arr) {
      let str = arr
        .map(item => {
          return item.interventionBenchmark;
        })
        .join("、");
      return str;
    },
    getParamValue() {
      let url = decodeURIComponent(window.location.href);
      let i = url.indexOf("=");
      if (i == -1) return null;
      this.packageId = url.slice(i + 1);
    },
    onEditorChange(e, decimalNum) {
      this.$refs.ruleForm1[this.Key] &&
        this.$refs.ruleForm1[this.Key].validate();
      if (e.quill.getLength() > decimalNum + 1) {
        this.$message1("最多输入" + decimalNum + "个字符", "warning");
        e.quill.setText(e.quill.getText(0, decimalNum));
        return;
      }
    },
    changeImage() {
      let that = this;
      let quill = that.$refs.myQuillEditor[that.Key].quill;
      var suffix = "image/jpg,image/jpeg,image/png,image/bmp".toLowerCase();
      var file = document.getElementById(that.imageId).files[0];
      if (suffix.indexOf(file.type.toLowerCase()) == -1) {
        return that.$message({
          message: "不支持该文件类型的上传！",
          type: "success"
        });
      }
      var formData = new FormData();
      formData.append("file", file);
      //调用cos上传文件编排
      that.$apis.upload(formData).then(res => {
        let imageUrl = that.$baseURL.ICDMApiUrl + "/file/image/" + res.id;
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "image", imageUrl);
        quill.setSelection(length + 1);
      });
    },
    changeVideo() {
      let that = this;
      let quill = that.$refs.myQuillEditor[that.Key].quill;
      var suffix = "video/mp4".toLowerCase();
      var file = document.getElementById(that.videoId).files[0];
      var formData = new FormData();
      if (suffix.indexOf(file.type.toLowerCase()) == -1) {
        return that.$message({
          message: "不支持该文件类型的上传！",
          type: "success"
        });
      }
      formData.append("file", file);
      that.$apis.upload(formData).then(res => {
        let videoUrl = this.$baseURL.ICDMApiUrl + "/file/video/" + res.id;
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "video", videoUrl);
        quill.setSelection(length + 1);
      });
    },
    /**
     * 图片上传
     */
    beforeUpload(file) {
      let fileMsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (
        fileMsg == "JPEG" ||
        fileMsg == "JPG" ||
        fileMsg == "PNG" ||
        fileMsg == "jpeg" ||
        fileMsg == "jpg" ||
        fileMsg == "png"
      ) {
        this.ceshi = false;
        return true;
      } else {
        this.$message.error("请上传JPEG，JPG，PNG类型文件!");
        this.ceshi = true;
        return false;
      }
    },
    httpRequest(v) {
      const formDataFile = new FormData();
      formDataFile.append("file", v.file);
      this.$apis.upload(formDataFile).then(res => {
        // let imageUrl = this.$baseURL.ICDMApiUrl + "/file/image/" + res.id;
        let imageUrl = "/file/image/" + res.id;
        this.form.platPackageSpecInfoDtoList[this.Key].displayPicUrl = imageUrl;
        this.$refs.ruleForm3[this.Key].validate();
      });
    },
    onChange(file, fileList) {
      this.$nextTick(() => {
        if (fileList.length > 1 && !this.ceshi) {
          fileList.splice(0, 1);
        }
        this.fileList = fileList;
        this.ceshi = false;
      });
    },
    onRemove() {
      if (this.form.previewUrl && !this.ceshi) {
        this.form.platPackageSpecInfoDtoList[this.Key].displayPicUrl = "";
        this.$refs.ruleForm3[this.Key].validate();
      }
    },
    clearValidate() {
      this.$refs.ruleForm[this.Key] &&
        this.$refs.ruleForm[this.Key].clearValidate();
      this.$refs.ruleForm1[this.Key] &&
        this.$refs.ruleForm1[this.Key].clearValidate();
      this.$refs.ruleForm3[this.Key] &&
        this.$refs.ruleForm3[this.Key].clearValidate();
      this.$refs.ruleForm4[this.Key] &&
        this.$refs.ruleForm4[this.Key].clearValidate();
    },
    limitInput(value, rowItem) {
      rowItem.price =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
    },
    // 获取设备列表
    GetHMDictItems() {
      this.$apis
        .GetHMDictItems({
          parentId: "20230816000000000001"
        })
        .then(res => {
          res.forEach(item => {
            item.disabled = false;
          });
          this.deviceList = res;
        });
    },
    onDeviceChange(value, index) {
      this.form.platPackageSpecInfoDtoList[this.Key].selectedDeviceList[
        index
      ] = value;
      if (value) {
        // 根据value拿到name
        const arr = this.deviceList.filter(item => {
          return item.serial_no === value;
        });
        this.form.platPackageSpecInfoDtoList[this.Key].platSpecDeviceDTOList[
          index
        ].deviceName = arr[0].dict_name;
      } else {
        this.form.platPackageSpecInfoDtoList[this.Key].platSpecDeviceDTOList[
          index
        ].deviceName = "";
      }
    },
    getDeviceDisable(value) {
      if (
        this.form.platPackageSpecInfoDtoList[
          this.Key
        ].selectedDeviceList.indexOf(value) >= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 添加设备
    addInstrument() {
      if (
        this.form.platPackageSpecInfoDtoList[this.Key].platSpecDeviceDTOList
          .length === this.deviceList.length
      ) {
        this.$message({
          message: "已无设备可添加",
          type: "warning"
        });
      } else if (
        this.form.platPackageSpecInfoDtoList[this.Key].platSpecDeviceDTOList
          .length < 3
      ) {
        this.form.platPackageSpecInfoDtoList[
          this.Key
        ].platSpecDeviceDTOList.push({
          deviceCode: "",
          deviceName: "",
          specId: this.form.platPackageSpecInfoDtoList[this.Key].specId
        });
      } else {
        this.$message({
          message: "最多只能添加3个设备!",
          type: "warning"
        });
      }
    },
    // 删除设备
    removeInstrument(v) {
      this.form.platPackageSpecInfoDtoList[
        this.Key
      ].platSpecDeviceDTOList.splice(v, 1);
      this.form.platPackageSpecInfoDtoList[this.Key].selectedDeviceList[v] = "";
    },
    // 根据计划ID获取计划详情
    getPlanDetail(planId) {
      if (!planId) return;
      let newArr = this.planList.filter(item => {
        return item.serialNo == planId;
      });
      if (newArr.length > 0) return;
      this.$apis
        .flupPlanqueryFollowPlanById({
          serialNo: planId
        })
        .then(res => {
          this.planList.unshift(res);
        });
    },
    changeRadio(v) {
      if (v == 1) {
        this.form.platPackageSpecInfoDtoList[this.Key].flupGroupId = "";
        this.$nextTick(() => {
          this.$refs.ruleForm[this.Key].clearValidate(["flupGroupId"]);
        });
      } else {
        this.form.platPackageSpecInfoDtoList[this.Key].planId = "";
        this.$nextTick(() => {
          this.$refs.ruleForm[this.Key].clearValidate(["planId"]);
        });
      }
    },
    isEmpty(value) {
      return value === null || value === undefined || value === "";
    },
    isHaveDevice(arr) {
      if (arr.length < 1) return false;
      return arr.some(item => {
        if (item) return true;
        return false;
      });
    },
    // 新增
    AddVerifyItemsDtoList() {
      let list = this.form.allPlatPackageVerifyItemsDtoList[this.Key]
        .platPackageVerifyItemsDtoList;
      if (list.length >= this.DictList.length) {
        this.$message({
          type: "warning",
          message: "没有更多了！"
        });
        return;
      }
      list.push({
        verifyTimes: 0,
        verifyItemCode: ""
      });
    },
    // 删除
    DeleteVerifyItemsDtoList(index, item) {
      if (item.serialNo) {
        this.deleteList.push({
          ...item,
          delVerifyId: item.serialNo
        });
      }
      let list = this.form.allPlatPackageVerifyItemsDtoList[this.Key]
        .platPackageVerifyItemsDtoList;
      if (list.length == 1) {
        list[0].verifyItemCode = "";
        list[0].verifyItemName = "";
        list[0].verifyTimes = 0;
        list[0].delVerifyId = "";
        list[0].serialNo = "";
        this.Change();
      } else {
        list.splice(index, 1);
        this.Change();
      }
    },
    // 上移
    moveUp(index) {
      const arr = this.form.allPlatPackageVerifyItemsDtoList[this.Key]
        .platPackageVerifyItemsDtoList;
      this.form.allPlatPackageVerifyItemsDtoList[
        this.Key
      ].platPackageVerifyItemsDtoList = this.handleMove(0, index, arr);
    },
    // 下移
    moveDown(index) {
      const arr = this.form.allPlatPackageVerifyItemsDtoList[this.Key]
        .platPackageVerifyItemsDtoList;
      this.form.allPlatPackageVerifyItemsDtoList[
        this.Key
      ].platPackageVerifyItemsDtoList = this.handleMove(1, index, arr);
    },

    handleMove(status, index, arr) {
      // status: 0-表示上移|1-表示下移;index表示当前下标; arr数组
      const data = JSON.parse(JSON.stringify(arr)); // 数组属于引入类型
      if (status == 0) {
        if (index != 0) {
          // 上移第一项无需上移
          data.splice(index - 1, 2, arr[index], arr[index - 1]);
        } else {
          console.log("已经是首项了");
        }
      } else if (status == 1) {
        // 下移最后一项无需下移
        if (index != arr.length - 1) {
          data.splice(index, 2, arr[index + 1], arr[index]);
        } else {
          console.log("已经是最后一项了");
        }
      }
      return data;
    },
    Change() {
      this.DictList.forEach(item1 => {
        let result = this.form.allPlatPackageVerifyItemsDtoList[
          this.Key
        ].platPackageVerifyItemsDtoList.some(item2 => {
          return item1.dict_code == item2.verifyItemCode;
        });
        if (result) {
          item1.disabled = true;
          return;
        }
        item1.disabled = false;
      });
    },
    uniqueArr(arr) {
      if (arr.length < 1) return [];
      const newArr = arr.filter((item, index, self) => {
        return index === self.findIndex(obj => obj.serialNo === item.serialNo);
      });
      return newArr;
    }
  }
};
</script>
<style lang="scss" scoped>
.configuration {
  padding: 20px 24px 86px;
  .form,
  .ruleForm4 {
    margin-top: 20px;
    .marginLeft10 {
      margin-left: 10px;
    }
  }
  .footer-save {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding-right: 20px;
    background: #ffffff;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.18);
    height: 66px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    .el-button--primary {
      padding: 8px 17px !important;
      min-width: 0 !important;
    }
  }
  .rule-item {
    display: inline-block;
    padding: 2px 10px;
    margin-right: 8px;
    margin-bottom: 10px;
    border: 1px solid #d7dae0;
    border-radius: 4px;
    color: #111111;
  }
  .form-table {
    border: 1px solid #e6e6e6;
    section {
      border-bottom: 1px solid #e6e6e6;
      height: 57px;
      display: flex;
      .item {
        line-height: 57px;
        border-right: 1px solid #e6e6e6;
        text-align: center;
      }
    }
    .list {
      display: flex;
      border-bottom: 1px solid #e6e6e6;
      .item {
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #e6e6e6;
        margin: 0 !important;
        padding: 4px 4px 18px 4px !important;
      }
    }
  }

  .marginLeft {
    margin-left: 135px;
  }
  .minwidth60 {
    min-width: 60px !important;
  }

  .tooltip {
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .member-sources {
    display: flex;
    align-items: center;
    .title {
      width: 170px;
      // padding-top: 20px;
      padding-right: 14px;
      text-align: right;
      .red {
        color: #db524b;
        margin-right: 3px;
      }
    }
    .plan {
      display: flex;
      align-items: center;
    }
  }
  .split-setting {
    background-color: #fbfbfb;
    padding: 20px;
    .split-setting-title {
      display: flex;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 1px solid#D7DAE0;
      .title {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .box {
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border: 1.4px solid #999999;
      border-radius: 50%;
      color: #999999;
    }
    .error {
      margin-left: 160px;
      color: #db524b;
    }
  }
  .form-table {
    margin-top: 20px;
    border: 1px solid #e6e6e6;
    section {
      border-bottom: 1px solid #e6e6e6;
      height: 41px;
      display: flex;
      background: #ffffff;
      .item {
        line-height: 41px;
        border-right: 1px solid #e6e6e6;
        text-align: left;
        padding-left: 20px;
      }
    }
    .list {
      display: flex;
      border-bottom: 1px solid #e6e6e6;
      .item {
        text-align: left;
        box-sizing: border-box;
        border-right: 1px solid #e6e6e6;
        margin: 0 !important;
        padding: 18px 4px 18px 20px !important;
      }
    }
  }
}
</style>
<style lang="scss">
.configuration {
  .disabled {
    color: #b2b2b2;
  }
  .member-sources {
    .el-form-item {
      margin-top: 18px;
    }
  }
  .teshu {
    .el-form-item__content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .width80 {
    .el-form-item__content {
      width: 80% !important;
    }
  }
  .el-upload--picture-card {
    height: 90px !important;
    line-height: 90px !important;
    width: 90px !important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    height: 90px !important;
    line-height: 90px !important;
    width: 90px !important;
    .el-icon-upload-success {
      position: absolute;
      top: 0px;
      left: 13px;
    }
  }
  .el-upload-list__item {
    transition: none !important;
    -webkit-transition: nonne !important;
  }
  .el-upload-list__item-name {
    transition: none !important;
    -webkit-transition: nonne !important;
  }
  .el-input-number {
    max-width: none !important;
  }
  .quill {
    .ql-container {
      height: 375px;
    }
    .ql-snow {
      .ql-picker-label {
        display: flex;
      }
    }
  }
  .input-number-range {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }
  .el-radio-group {
    display: block;
    .el-radio {
      display: block;
    }
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    height: 38px;
    line-height: 38px;
  }
}
</style>
