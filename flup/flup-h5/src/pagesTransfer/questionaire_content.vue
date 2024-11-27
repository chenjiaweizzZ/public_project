<template>
  <section ref="section">
    <div class="taskDetail" v-if="mergingState">
      <div class="taskTop">
        <p>{{ title }}</p>
        <span v-if="flupStartTime">{{ flupStartTime }}</span>
      </div>
      <div class="taskContent">
        <div class="taskTitle">
          <p>内容</p>
        </div>
        <div class="taskInfo">
          <span>{{ description }}</span>
          <template v-if="state == 0">
            <div class="question flex-align-self-start" style="width: 100%" v-for="(item, index) in questionList.slice(
                startQuestion,
                endQuestion + 1
              )" :key="index">
              <el-form v-if="item.type !== 'addPage'" :model="item" ref="form">
                <el-form-item v-if="showInventoryProblem(item, index + startQuestion)" prop="value" :required="item.required" :rules="[
                    {
                      required: item.required,
                      message:
                        item.type === 'image' ? '请上传图片' : '请输入问题答案',
                    },
                  ]">
                  <p>{{ item.key + "、" + item.label }}</p>
                  <el-input v-model="item.value" v-if="item.type === 'input'" placeholder="请输入内容" maxlength="50" show-word-limit></el-input>
                  <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-if="item.type === 'textarea'" v-model="item.value" maxlength="200" show-word-limit></el-input>
                  <select class="select" v-model="item.value" placeholder="请选择" v-if="item.type === 'select'">
                    <option value disabled selected style="display: none">
                      请选择
                    </option>
                    <option v-for="item1 in showOptions(item)" :key="item1.label" :label="item1.label" :value="item1.label">
                      {{ item1.label }}
                    </option>
                  </select>

                  <van-radio-group @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'inventoryProblem' && !item.multiple">
                    <van-radio class="vanRadio" :style="
                        item.value == item1.label
                          ? 'border: 1px solid #409eff;'
                          : 'border:1px solid #ddd;'
                      " v-for="(item1, index) in showOptions(item)" :key="index" :name="item1.label" icon-size="14px">
                      {{ item1.label }}
                      <template v-if="item.value == item1.label" #icon="props">
                        <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                      </template>
                    </van-radio>
                  </van-radio-group>

                  <!-- <el-checkbox-group
                @change="getPoint(item, $event)"
                v-model="item.value"
                v-if="item.type === 'inventoryProblem'&&item.multiple"
              >
                <el-checkbox
                  v-for="item1 in  showOptions(item)"
                  :key="item1.label"
                  border
                  :label="item1.label"
                >{{ item1.label }}</el-checkbox>
              </el-checkbox-group>-->

                  <van-checkbox-group v-model="item.value" @change="getPoint(item, $event)" v-if="item.type === 'inventoryProblem' && item.multiple">
                    <van-checkbox class="vanRadio" :style="
                        item.value.indexOf(item1.label) != -1
                          ? 'border: 1px solid #409eff;'
                          : 'border:1px solid #ddd;'
                      " shape="square" icon-size="15px" v-for="item1 in showOptions(item)" :key="item1.label" border :name="item1.label">{{ item1.label }}</van-checkbox>
                  </van-checkbox-group>

                  <van-radio-group v-model="item.value" v-if="item.type === 'radio'" @change="item.otherOption = ''">
                    <template v-for="(item1, index) in showOptions(item)">
                      <div :key="index">
                        <van-radio class="vanRadio" :style="
                            item.value == item1.label
                              ? 'border: 1px solid #409eff;'
                              : 'border:1px solid #ddd;'
                          " :name="item1.label" icon-size="14px">
                          {{ item1.label }}
                          <template v-if="item.value == item1.label" #icon="props">
                            <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                          </template>
                        </van-radio>

                        <el-input v-if="item.value == item1.label && item1.supplement" class="margin-bottom5" autosize placeholder="请输入补充说明" v-model="item.otherOption" maxlength="200"></el-input>
                      </div>
                    </template>

                    <van-radio v-if="item.hasOtherOption" @change="selectOther(item)" class="vanRadio" :style="
                        item.value === undefined
                          ? 'border: 1px solid #409eff;'
                          : 'border:1px solid #ddd;'
                      " icon-size="14px">
                      其它
                      <template v-if="item.value === undefined" #icon="props">
                        <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                      </template>
                    </van-radio>
                  </van-radio-group>
                  <el-radio-group v-model="item.value" v-if="item.type === 'radio'">
                    <!-- <el-radio
                  v-for="(item1,index) in item.options"
                  :key="index"
                  :label="item1.label"
                  :value="item1.label"
                  border
                ></el-radio>-->
                    <!-- <el-radio @change="selectOther(item)" v-if="item.hasOtherOption" border>其它</el-radio> -->
                    <el-input class="margin-top10" type="textarea" autosize placeholder="请输入" v-model="item.otherOption" v-if="item.hasOtherOption && item.value === undefined"></el-input>
                  </el-radio-group>
                  <!-- 引用题 -->
                  <el-radio-group v-model="item.value" v-if="item.type === 'refProblem'">
                    <el-radio v-for="jitem in getRefOptions(item)" :key="jitem.key" :value="jitem.value" :label="jitem.label" border></el-radio>
                  </el-radio-group>

                  <van-checkbox-group @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'checkbox'">
                    <van-checkbox class="vanRadio" :style="
                        item.value.indexOf(item1.label) != -1
                          ? 'border: 1px solid #409eff;'
                          : 'border:1px solid #ddd;'
                      " shape="square" icon-size="15px" v-for="item1 in showOptions(item)" :key="item1.label" border :name="item1.label">{{ item1.label }}</van-checkbox>
                  </van-checkbox-group>

                  <!-- <p>日期</p> -->
                  <div v-if="item.type === 'datePickerinput'" class="datePickerinput">
                    <el-input type="number" v-model="item.value[0]" maxlength="4"></el-input>
                    <p>年</p>
                    <el-input type="number" v-model="item.value[1]" maxlength="2"></el-input>
                    <p>月</p>
                    <el-input type="number" v-model="item.value[2]" maxlength="2"></el-input>
                    <p>日</p>
                  </div>
                  <el-date-picker v-if="item.type === 'datePicker'" v-model="item.value" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                  <div v-if="item.type === 'image'">
                    <uploadImage :imgList.sync="item.value" :limit="10" @changeImage="() => changevalidateField('form', index)"></uploadImage>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <el-row class="page-button flex-align-justify width100pct">
              <el-button type="success" plain class="flex1" v-if="currentPage !== 1" @click="current_change('up')">上一页</el-button>
              <el-button type="success" plain class="flex1" v-if="currentPage !== pagesize.length" @click="current_change('down')">下一页</el-button>
              <el-button :disabled="repeatedly" type="success" plain class="flex1" v-if="currentPage === pagesize.length && !isHideSubmit && !isWeChat" @click="submit">提交</el-button>
            </el-row>
          </template>
          <template v-if="state == 1">
            <el-row class="width100pct margin-top20" v-for="(item, index) in questionList" :key="index">
              <div style="word-break: break-all">
                {{ index + 1 }}、{{ item.label }}
              </div>

              <div v-if="item.value instanceof Array" class="padding-left20">
                <div v-if="
                    item.value.every((event) => /^http(s)?:\/\//.test(event))
                  ">
                  <uploadImage :imgList="item.value" :isPreview="true" :limit="10"></uploadImage>
                </div>
                <div v-else>
                  <template v-for="(item, index) in item.value">
                    <p style="margin-bottom: 10px; word-break: break-all" :key="index">
                      {{ item }}
                    </p>
                  </template>
                </div>
              </div>
              <div class="padding-left20" v-else>{{ item.value }}</div>
            </el-row>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="ignore tel-content flex-column-align paddingX20 padding-bottom20">
      <div v-for="(items, indexOne) in questionLists" :key="indexOne">
        <div class="questionTitle">{{ items.title }}</div>
        <div class="questionDescription">{{ items.description }}</div>
        <template v-if="items.state == 0">
          <div class="question flex-align-self-start" style="width: 100%" v-for="(item, index) in items.questionList.slice(
              items.startQuestion,
              items.endQuestion + 1
            )" :key="index">
            <el-form v-if="item.type !== 'addPage'" :model="item" :ref="'form' + indexOne">
              <el-form-item v-if="
                  showInventoryProblemTow(
                    item,
                    indexOne,
                    indexOne + items.startQuestion,
                    items
                  )
                " :label="item.key + '、' + item.label" prop="value" :required="item.required" :rules="[
                  {
                    required: item.required,
                    message:
                      item.type === 'image' ? '请上传图片' : '请输入问题答案',
                  },
                ]">
                <el-input :disabled="used(indexOne)" v-model="item.value" v-if="item.type === 'input'" placeholder="请输入内容"></el-input>
                <el-input :disabled="used(indexOne)" type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-if="item.type === 'textarea'" v-model="item.value"></el-input>
                <select :disabled="used(indexOne)" class="select" v-model="item.value" placeholder="请选择" v-if="item.type === 'select'">
                  <option value disabled selected style="display: none">
                    请选择
                  </option>
                  <option v-for="item1 in showOptionsTwo(item, indexOne)" :key="item1.label" :label="item1.label" :value="item1.label">
                    {{ item1.label }}
                  </option>
                </select>
                <van-radio-group :disabled="used(indexOne)" @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'inventoryProblem' && !item.multiple">
                  <van-radio class="vanRadio" :style="
                      item.value == item1.label
                        ? 'border: 1px solid #409eff;'
                        : 'border:1px solid #ddd;'
                    " v-for="(item1, index) in showOptionsTwo(item, indexOne)" :key="index" :name="item1.label" icon-size="14px">
                    {{ item1.label }}
                    <template v-if="item.value == item1.label" #icon="props">
                      <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                    </template>
                  </van-radio>
                </van-radio-group>
                <el-checkbox-group @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'inventoryProblem' && item.multiple">
                  <el-checkbox v-for="item1 in showOptions(item)" :key="item1.label" border :label="item1.label">{{ item1.label }}</el-checkbox>
                </el-checkbox-group>

                <van-radio-group :disabled="used(indexOne)" v-model="item.value" v-if="item.type === 'radio'">
                  <van-radio class="vanRadio" :style="
                      item.value == item1.label
                        ? 'border: 1px solid #409eff;'
                        : 'border:1px solid #ddd;'
                    " v-for="(item1, index) in showOptionsTwo(item, indexOne)" :key="index" :name="item1.label" icon-size="14px">
                    {{ item1.label }}
                    <template v-if="item.value == item1.label" #icon="props">
                      <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                    </template>
                  </van-radio>
                  <van-radio v-if="item.hasOtherOption" @change="selectOther(item)" class="vanRadio" :style="
                      item.value === undefined
                        ? 'border: 1px solid #409eff;'
                        : 'border:1px solid #ddd;'
                    " icon-size="14px">
                    其它
                    <template v-if="item.value === undefined" #icon="props">
                      <img style="width: 14px; height: 14px" class="img-icon" :src="props.checked ? getImgUrls() : getImgUrls()" />
                    </template>
                  </van-radio>
                </van-radio-group>
                <el-radio-group v-model="item.value" v-if="item.type === 'radio'">
                  <!-- <el-radio
                    :disabled="used(indexOne)"
                    v-for="item1 in item.options"
                    :key="item1.label"
                    :label="item1.label"
                    :value="item1.label"
                    border
                  ></el-radio>
                  <el-radio @change="selectOther(item)" v-if="item.hasOtherOption" border>其它</el-radio>-->
                  <el-input :disabled="used(indexOne)" class="margin-top10" type="textarea" autosize placeholder="请输入" v-model="item.otherOption" v-if="item.hasOtherOption && item.value === undefined"></el-input>
                </el-radio-group>
                <el-checkbox-group v-model="item.value" v-if="item.type === 'checkbox'">
                  <el-checkbox :disabled="used(indexOne)" v-for="item1 in showOptionsTwo(item, indexOne)" :key="item1.label" border :label="item1.label">{{ item1.label }}</el-checkbox>
                </el-checkbox-group>
                <!-- <p>日期</p> -->
                <div v-if="item.type === 'datePickerinput'" class="datePickerinput">
                  <el-input type="number" v-model="item.value[0]" :disabled="used(indexOne)"></el-input>
                  <p>年</p>
                  <el-input type="number" v-model="item.value[1]" :disabled="used(indexOne)"></el-input>
                  <p>月</p>
                  <el-input type="number" v-model="item.value[2]" :disabled="used(indexOne)"></el-input>
                  <p>日</p>
                </div>
                <el-date-picker :disabled="used(indexOne)" v-if="item.type === 'datePicker'" v-model="item.value" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                <div v-if="item.type === 'image'">
                  <uploadImage :imgList.sync="item.value" :limit="10" @changeImage="
                      () => changevalidateField('form' + indexOne, index)
                    "></uploadImage>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <el-row class="page-button flex-align-justify width100pct">
            <el-button :disabled="used(indexOne)" type="success" plain class="flex1" v-if="items.currentPage !== 1" @click="current_change_two('up', items, indexOne)">上一页</el-button>
            <el-button :disabled="used(indexOne)" type="success" plain class="flex1" v-if="items.currentPage !== items.pagesize.length" @click="current_change_two('down', items, indexOne)">下一页</el-button>
            <el-button :disabled="used(indexOne) || repeatedly" type="success" plain class="flex1" v-if="
                items.currentPage === items.pagesize.length && !isHideSubmit
              " @click="submitTow(items, indexOne)">提交</el-button>
          </el-row>
        </template>
        <template v-if="items.state == 1">
          <el-row class="width100pct margin-top20" v-for="(item, index) in items.questionList" :key="index">
            <div>{{ index + 1 }}、{{ item.label }}</div>

            <div v-if="item.value instanceof Array" class="padding-left20">
              <p style="margin-bottom: 10px" v-for="(item, index) in item.value" :key="index">
                {{ item }}
              </p>
            </div>
            <div class="padding-left20" v-else>{{ item.value }}</div>
          </el-row>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
let hasPath;
import "element-ui/lib/theme-chalk/index.css";
import uploadImage from "@/components/uploadImage.vue";
import {
  Row,
  Button,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  DatePicker,
} from "element-ui";
import { mapActions } from "vuex";
export default {
  beforeRouteEnter(to, from, next) {
    next(() => {
      //console.log(from);
      hasPath = from.path;
      console.log(12371371, hasPath);
    });
  },
  name: "tel_preview",
  components: {
    [Row.name]: Row,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [DatePicker.name]: DatePicker,
    uploadImage,
  },
  data() {
    return {
      state: -1,
      isTel: true,
      currentPage: 1, //默认开始的页面
      pagesize: [],
      total: 0, //默认数据总数
      endQuestion: 0,
      startQuestion: 0,
      questionList: [],
      description: "",
      title: "",
      flupStartTime: "",
      mergingState: false,
      questionLists: [],
      submitList: [],
      repeatedly: false,
      isHideSubmit: false,
    };
  },
  computed: {
    getImgUrls() {
      return function () {
        return require("@/assets/images/dxxz.png");
      };
    },
  },
  async created() {
    this.isWeChat = this.$route.query.isWeChat
      ? this.$route.query.isWeChat
      : false;
    this.mergingState = !this.$route.query.mergingState;
    this.isHideSubmit = this.$route.query.isHideSubmit
      ? this.$route.query.isHideSubmit
      : false;
    console.log(
      this.$route.query.serialNo &&
        this.$route.query.hospitalId &&
        this.mergingState
    );
    if (
      this.$route.query.serialNo &&
      this.$route.query.hospitalId &&
      this.mergingState
    ) {
      if (!this.$route.query.isWeChat) {
        await this.$apis
          .templatequerySaveContent({
            serialNo: this.$route.query.serialNo,
            hospitalId: this.$route.query.hospitalId,
          })
          .then((res) => {
            var result = JSON.parse(res.retData.result);
            this.questionList = result.questionList || result.questionListNew;
            this.description = result.description;
            this.title = result.title;
            this.flupStartTime = res.retData.flupStartTime;
            this.state = res.retData.state;
            this.total = this.questionList ? this.questionList.length : 0;
            for (let i = 0, count = 0; i < this.total; i++, count++) {
              if (
                this.questionList[i].type === "addPage" ||
                i === this.total - 1
              ) {
                if (!this.pagesize.length) {
                  this.endQuestion = count;
                }
                this.pagesize.push(count);
                count = 0;
              }
            }
          });
      } else {
        this.$apis
          .queryTemplateContent(
            {
              serialNo: this.$route.query.serialNo,
            },
            {
              token: this.$route.query.token,
            }
          )
          .then((res) => {
            var result = JSON.parse(res.retData.contentHtml);
            this.questionList = result.questionList || result.questionListNew;
            this.description = result.description;
            this.title = result.title;
            this.state = 0;
            this.total = this.questionList ? this.questionList.length : 0;
            for (let i = 0, count = 0; i < this.total; i++, count++) {
              if (
                this.questionList[i].type === "addPage" ||
                i === this.total - 1
              ) {
                if (!this.pagesize.length) {
                  this.endQuestion = count;
                }
                this.pagesize.push(count);
                count = 0;
              }
            }
          });
      }
    } else {
      this.$apis
        .queryMergeSaveContent(this.$route.query.serialNo)
        .then((res) => {
          let list =
            res.retData && res.retData.length > 1
              ? [res.retData[0]]
              : res.retData;
          let resultList = list;
          this.questionLists = [];
          let completeness = resultList.filter((res) => {
            if (res.state == 0) return true;
          });
          if (!completeness.length) {
            let query = {
              hospitalId: this.$route.query.hospitalId,
            };
            if (hasPath !== "/") {
              query.back = true;
            }
            this.$router.replace({
              name: "/submit",
              // query: {
              //   hospitalId: this.$route.query.hospitalId,
              //   back: hasPath == "/" ? false : true
              // },
              query,
            });
            return;
          }
          for (let i in resultList) {
            if (resultList[i].state == 0) {
              let result = JSON.parse(resultList[i].result);
              let obj = {
                questionList: result.questionList,
                description: result.description,
                title: result.title,
                state: resultList[i].state,
                total: result.questionList ? result.questionList.length : 0,
                pagesize: [],
                startQuestion: 0,
                endQuestion: 0,
                serialNo: resultList[i].serialNo,
                hospitalId: resultList[i].hospitalId,
                currentPage: 1,
              };
              for (let i = 0, count = 0; i < obj.total; i++, count++) {
                if (
                  obj.questionList[i].type === "addPage" ||
                  i === obj.total - 1
                ) {
                  if (!obj.pagesize.length) {
                    obj.endQuestion = count;
                  }
                  obj.pagesize.push(count);
                  count = 0;
                }
              }
              this.questionLists.push(obj);
            }
          }
        });
    }
    // else {
    //   await this.$apis
    //     .getSaveContent({
    //       ...this.$route.query,
    //     })
    //     .then((res) => {
    //       this.questionList = res.dataList.questionList
    //       this.description = res.dataList.description
    //       this.title = res.dataList.title
    //       this.state = res.state
    //     })
    //   this.total = this.questionList.length
    //   for (let i = 0, count = 0; i < this.total; i++, count++) {
    //     if (this.questionList[i].type === 'addPage' || i === this.total - 1) {
    //       if (this.pagesize.length === 0) {
    //         this.endQuestion = count
    //       }
    //       this.pagesize.push(count)
    //       count = 0
    //     }
    //   }
    // }
  },
  methods: {
    ...mapActions("chat", ["getImInfo"]),
    used(index) {
      for (let i in this.submitList) {
        if (this.submitList[i] == index) return true;
      }
    },
    selectOther(item) {
      item.otherOption = "";
    },
    getPoint(obj, value) {
      if (obj.type === "inventoryProblem" && !obj.multiple) {
        obj.score = obj.options.find((element) => {
          return element.label === value;
        }).score;
      } else {
        obj.score = 0;
        obj.options.forEach((element) => {
          value.forEach((item) => {
            if (element.label === item) {
              obj.score += element.score;
            }
          });
        });
      }
    },
    ifAbnormal(element) {
      if ("input|textarea|datePicker".indexOf(element.type) > -1) {
        return element.value != "" && element.abnormal == true;
      } else if ("datePickerinput" == element.type) {
        return (
          element.value != "" &&
          element.abnormal == true &&
          element.value.length == 3
        );
      } else {
        let abnormal = false;
        for (let i in element.options) {
          if (Array.isArray(element.value)) {
            for (let j in element.value) {
              if (element.options[i].label == element.value[j]) {
                abnormal = element.options[i].abnormal;
              }
              if (abnormal) {
                return abnormal;
              }
            }
          } else {
            if (element.options[i].label == element.value) {
              abnormal = element.options[i].abnormal;
            }
            if (abnormal) {
              return abnormal;
            }
          }
        }
        // element.options.forEach((jelement) => {
        //   if (jelement.label === element.value) {
        //     abnormal = jelement.abnormal
        //   }
        //   if (abnormal) {
        //     return abnormal
        //   }
        // })
        return abnormal;
      }
    },
    submit() {
      this.repeatedly = true;
      this.setRepeatedly();
      let flag = true;
      for (let i in this.$refs.form) {
        this.$refs.form[i].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
            return;
          }
        });
        if (!flag) {
          return;
        }
      }

      this.questionList = this.questionList.filter((element) => {
        return element.type !== "addPage" && element.relatedList
          ? element.relatedList.length
            ? element.value
            : true
          : true;
      });

      let questionList = this.questionList.map((element) => {
        if (
          typeof element.value === "object" &&
          element.type.indexOf("datePicker") != -1
        ) {
          if (element.value.length == 3) {
            element.value = element.value.join("-");
          }
        }
        return {
          firstTimeMedicationFeel: element.firstTimeMedicationFeel,
          firstTimeMedicationTime: element.firstTimeMedicationTime,
          label: element.label,
          value:
            element.value && element.otherOption
              ? element.value + "," + element.otherOption
              : element.value || element.otherOption || "",
          point: element.score || 0,

          abnormal: this.ifAbnormal(element),
          key: element.key,
        };
      });
      let answer_content = {
        title: this.title,
        description: this.description,
        questionList,
      };

      // this.$refs.form.forEach((element) => {
      //   element.validate((valid) => {
      //     if (valid) {
      //       flag = true
      //     } else {
      //       flag = false
      //     }
      //   })
      // })

      if (flag) {
        if (this.$route.query.serialNo && this.$route.query.hospitalId) {
          this.$apis
            .templatesaveTemplateContent({
              master_id: this.$route.query.master_id,
              target_ext_user_id: this.$route.query.user_id,
              version_number: this.$route.query.version_number,
              answerContentJson: JSON.stringify(answer_content),
              serialNo:
                this.$route.query.serialNo == null
                  ? this.$route.query.master_id
                  : this.$route.query.serialNo,
              hospitalId: this.$route.query.hospitalId,
              taskid: this.$route.query.taskid,
            })
            .then((res) => {
              if (res.retCode == 0) {
                console.log(res);
                if (this.$route.query.isChat) {
                  this.jumpseek();
                } else if (this.$route.query.url) {
                  window.location.replace(decodeURI(this.$route.query.url));
                } else if (this.$route.query.isBack) {
                  this.$router.go(-1);
                } else {
                  let query = {
                    hospitalId: this.$route.query.hospitalId,
                    title: this.title,
                    showModule: JSON.stringify(res.retData.medicalSide),
                  };
                  if (hasPath !== "/") {
                    query.back = true;
                  }
                  this.$router.replace({
                    name: "submit",
                    params: { message: res.retData },
                    // query: {
                    //   hospitalId: this.$route.query.hospitalId,
                    //   title: this.title,
                    //   showModule: JSON.stringify(res.retData.medicalSide),
                    //   back: hasPath == "/" ? false : true
                    // },
                    query,
                  });
                }
              } else {
                // this.$router.replace('submit')
                this.$toast.fail("该份问卷提交失败!");
              }
            });
        } else {
          // this.$apis
          //   .saveContent({
          //     master_id: this.$route.query.master_id,
          //     target_ext_user_id: this.$route.query.user_id,
          //     version_number: this.$route.query.version_number,
          //     answer_content_json: JSON.stringify(answer_content),
          //     serial_no:
          //       this.$route.query.serial_no == null
          //         ? this.$route.query.master_id
          //         : this.$route.query.serial_no,
          //     hospital_id: this.$route.query.hospital_id,
          //     taskid: this.$route.query.taskid,
          //   })
          //   .then((res) => {
          //     if (res) {
          //       this.$router.replace({
          //         name: 'submit',
          //         params: { message: res.result },
          //       })
          //     } else {
          //       this.$router.replace('/submit')
          //     }
          //   })
        }
      }
    },
    showInventoryProblem(item, index) {
      let a = this.questionList;

      if (!item.relatedList || !item.relatedList.length) return true;
      let flag = 0;
      if (item.relatedList.length < 2 || item.relatedWay !== "and") {
        for (let i = 0; i < index; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (this.questionList[i].type == "checkbox") {
                  this.questionList[i].value.forEach((zelement) => {
                    if (
                      zelement === this.questionList[i].options[jelement].label
                    ) {
                      flag = 1;
                    }
                  });
                } else {
                  if (
                    this.questionList[i].value ===
                    this.questionList[i].options[jelement].label
                  ) {
                    flag = 1;
                  }
                }
              });
            }
          });
          // }
        }
        return flag;
      } else if (item.relatedWay === "and") {
        for (let i = 0; i < index; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (this.questionList[i].type == "checkbox") {
                  this.questionList[i].value.forEach((zelement) => {
                    if (
                      zelement === this.questionList[i].options[jelement].label
                    ) {
                      flag++;
                    }
                  });
                } else {
                  if (
                    this.questionList[i].value ===
                    this.questionList[i].options[jelement].label
                  ) {
                    flag++;
                  }
                }
              });
            }
          });
          // }
        }
        return flag === item.relatedList.length;
      }
    },
    current_change(direction) {
      if (direction === "up") {
        this.currentPage--;
      } else {
        let flag = true;
        this.$refs.form.forEach((element) => {
          element.validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              flag = false;
            }
          });
        });
        if (!flag) {
          return;
        }
        this.currentPage++;
      }
      this.startQuestion = 0;
      this.endQuestion = 0;
      for (let i = 0; i < this.currentPage; i++) {
        if (i !== this.currentPage - 1) {
          this.startQuestion += this.pagesize[i];
        }
        this.endQuestion += this.pagesize[i];
      }
    },
    current_change_two(direction, items, indexOne) {
      if (direction === "up") {
        items.currentPage--;
      } else {
        let flag = true;
        let x = "form" + indexOne;
        this.$refs[x].forEach((element) => {
          element.validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              flag = false;
            }
          });
        });
        if (!flag) {
          return;
        }
        items.currentPage++;
      }
      items.startQuestion = 0;
      items.endQuestion = 0;
      for (let i = 0; i < items.currentPage; i++) {
        if (i !== items.currentPage - 1) {
          items.startQuestion += items.pagesize[i];
        }
        items.endQuestion += items.pagesize[i];
      }
    },

    showInventoryProblemTow(item, indexOne, index, items) {
      if (!item.relatedList || !item.relatedList.length) return true;
      let flag = 0;
      console.log(this.questionLists);
      if (item.relatedList.length < 2 || item.relatedWay !== "and") {
        for (let i = 0; i <= index + 1; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (
                  this.questionLists[indexOne].questionList[i].type ==
                  "checkbox"
                ) {
                  this.questionLists[indexOne].questionList[i].value.forEach(
                    (zelement) => {
                      if (
                        zelement ===
                        this.questionLists[indexOne].questionList[i].options[
                          jelement
                        ].label
                      ) {
                        flag = 1;
                      }
                    }
                  );
                } else {
                  if (
                    this.questionLists[indexOne].questionList[i].value ===
                    this.questionLists[indexOne].questionList[i].options[
                      jelement
                    ].label
                  ) {
                    flag = 1;
                  }
                }
              });
            }
          });
          // }
        }
        return flag;
      } else if (item.relatedWay === "and") {
        for (let i = 0; i < index; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (
                  this.questionLists[indexOne].questionList[i].type ==
                  "checkbox"
                ) {
                  this.questionLists[indexOne].questionList[i].value.forEach(
                    (zelement) => {
                      if (
                        zelement ===
                        this.questionLists[indexOne].questionList[i].options[
                          jelement
                        ].label
                      ) {
                        flag++;
                      }
                    }
                  );
                } else {
                  if (
                    this.questionLists[indexOne].questionList[i].value ===
                    this.questionLists[indexOne].questionList[i].options[
                      jelement
                    ].label
                  ) {
                    flag++;
                  }
                }
              });
            }
          });
          // }
        }
        return flag === item.relatedList.length;
      }
    },

    submitTow(items, indexOne) {
      this.repeatedly = true;
      this.setRepeatedly();
      items.questionList = items.questionList.filter((element) => {
        return element.type !== "addPage";
      });
      let questionList = items.questionList.map((element) => {
        if (typeof element.value == "object") {
          if (element.value.length == 3) {
            element.value = element.value.join("-");
          }
        }
        return {
          label: element.label,
          value:
            element.value && element.otherOption
              ? element.value + "," + element.otherOption
              : element.value || element.otherOption || "",
          point: element.score || 0,
          abnormal: this.ifAbnormal(element),
          key: element.key,
        };
      });
      let answer_content = {
        title: items.title,
        description: items.description,
        questionList,
      };

      let flag = true;
      let x = "form" + indexOne;
      for (let i in this.$refs[x]) {
        this.$refs[x][i].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
            return;
          }
        });
        if (!flag) {
          return;
        }
      }

      // let flag = false
      // this.$refs[x].forEach((element) => {
      //   console.log(element)
      //   element.validate((valid) => {
      //     if (valid) {
      //       flag = true
      //     } else {
      //       flag = false
      //     }
      //   })
      // })
      if (flag) {
        // console.log(JSON.stringify(answer_content))
        this.$apis
          .templatesaveTemplateContent({
            answerContentJson: JSON.stringify(answer_content),
            serialNo: items.serialNo,
            hospitalId: items.hospitalId,
          })
          .then((res) => {
            if (res.retInfo == "操作成功") {
              this.submitList.push(indexOne);
              if (
                this.submitList &&
                this.questionLists &&
                this.submitList.length == this.questionLists.length
              ) {
                if (this.$route.query.isChat) {
                  this.jumpseek();
                } else if (this.$route.query.url) {
                  window.location.replace(decodeURI(this.$route.query.url));
                } else if (this.$route.query.isBack) {
                  this.$router.go(-1);
                } else {
                  let query = {
                    hospitalId: this.$route.query.hospitalId,
                  };
                  if (hasPath !== "/") {
                    query.back = true;
                  }
                  this.$router.replace({
                    name: "submit",
                    params: { message: res.retData },
                    query,
                    // query: {
                    //   hospitalId: this.$route.query.hospitalId,
                    //   back: hasPath == "/" ? "" : true
                    // },
                  });
                }
              }
            } else {
              this.$toast.fail("该份问卷提交失败!");
            }
            // debugger
            // if (this.submitList.length != this.questionLists.length) {
            //   this.submitList.push(indexOne)
            // } else {
            //   if (res) {
            //     this.$router.replace({
            //       name: 'submit',
            //       params: { message: res.result },
            //     })
            //   } else {
            //     this.$router.replace('/submit')
            //   }
            // }
          });
      }
    },

    getRefOptions(item) {
      let options = [];
      let mul = this.questionList[item.refOption - 1].value;
      if (mul) {
        mul.forEach((i) => {
          options.push({ key: i, value: i, label: i });
        });
      }
      return options;
    },
    showOptions(item) {
      let options = [];
      item.options.forEach((element) => {
        let flag = 0;
        //添加选项关联且选项大于1
        if (
          element.optionRelated &&
          element.optionRelated.optionIndex &&
          element.optionRelated.optionIndex.length
        ) {
          element.optionRelated.optionIndex.forEach((jelement) => {
            //多选框的value是Array
            if (
              this.questionList[element.optionRelated.questionIndex].type ==
              "checkbox"
            ) {
              this.questionList[
                element.optionRelated.questionIndex
              ].value.forEach((zelement) => {
                if (
                  zelement ===
                  this.questionList[element.optionRelated.questionIndex]
                    .options[jelement].label
                ) {
                  flag++;
                }
              });
            } else {
              if (
                this.questionList[element.optionRelated.questionIndex].value ===
                this.questionList[element.optionRelated.questionIndex].options[
                  jelement
                ].label
              ) {
                flag++;
              }
            }

            //如果是and类型。全部选择方可添加options
            if (element.optionRelated.relatedWay == "and") {
              if (flag == element.optionRelated.optionIndex.length) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            } else {
              //如果是or类型，满足其中一个方可添加options
              if (flag > 0) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            }
          });
        } else {
          //选项未被关联
          options.push(element);
        }
      });
      let showRequire =
        item.oriRequired == undefined ? item.required : item.oriRequired;
      if (!options.length) {
        item.oriRequired = showRequire;
        item.required = false;
      } else {
        item.required = showRequire;
      }
      return options;
    },
    showOptionsTwo(item, indexOne) {
      let options = [];
      item.options.forEach((element) => {
        let flag = 0;
        //添加选项关联且选项大于1
        if (
          element.optionRelated &&
          element.optionRelated.optionIndex &&
          element.optionRelated.optionIndex.length
        ) {
          element.optionRelated.optionIndex.forEach((jelement) => {
            //多选框的value是Array
            if (
              this.questionLists[indexOne].questionList[
                element.optionRelated.questionIndex
              ].type == "checkbox"
            ) {
              this.questionLists[indexOne].questionList[
                element.optionRelated.questionIndex
              ].value.forEach((zelement) => {
                if (
                  zelement ===
                  this.questionLists[indexOne].questionList[
                    element.optionRelated.questionIndex
                  ].options[jelement].label
                ) {
                  flag++;
                }
              });
            } else {
              if (
                this.questionLists[indexOne].questionList[
                  element.optionRelated.questionIndex
                ].value ===
                this.questionLists[indexOne].questionList[
                  element.optionRelated.questionIndex
                ].options[jelement].label
              ) {
                flag++;
              }
            }

            //如果是and类型。全部选择方可添加options
            if (element.optionRelated.relatedWay == "and") {
              if (flag == element.optionRelated.optionIndex.length) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            } else {
              //如果是or类型，满足其中一个方可添加options
              if (flag > 0) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            }
          });
        } else {
          //选项未被关联
          options.push(element);
        }
      });
      let showRequire =
        item.oriRequired == undefined ? item.required : item.oriRequired;
      if (!options.length) {
        item.oriRequired = showRequire;
        item.required = false;
      } else {
        item.required = showRequire;
      }
      return options;
    },
    setRepeatedly() {
      setTimeout(() => {
        this.repeatedly = false;
      }, 1000);
    },
    changevalidateField(formName, idx) {
      this.$refs[formName][idx].validate((valid) => {});
    },
    async jumpseek() {
      let serialNo = this.$route.query.newSerialNo;
      let sourceId = this.$route.query.sourceId;
      let patientId = this.$route.query.patientId;
      let patientName = this.$route.query.patientName;
      let serviceStatus = this.$route.query.serviceStatus;
      try {
        let { retData } = await this.getImInfo({
          orderSerialNo: serialNo,
          hospitalId: sourceId,
        });
        // let imUrl = JSON.parse(retData.imUrl);
        let imData = await this.$apis.getIMData(retData.patientId);
        let imUrl = JSON.parse(imData.retData);
        if (imUrl) {
          let userSig = imUrl.userSig;
          let roomId = retData.roomId;
          localStorage.setItem("userId", retData.patientId);
          localStorage.setItem("userSig", userSig);
          // localStorage.setItem('roomId',roomId);
          let consultId = retData.id;
          this.$router.replace({
            path: "/chat",
            query: {
              consultId,
              serviceStatus,
              patientId,
              patientName,
              roomId,
            },
          });
        }
      } catch (e) {
        this.$toast.fail(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.taskDetail {
  position: relative;
  .taskTop {
    padding: 0 20px;
    padding-bottom: 80px;
    background: url("../assets/images/taskTopBg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    p {
      margin: 24px 0 12px;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: #ffffff;
    }
    span {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.17px;
      color: #ffffff;
    }
  }
  .taskContent {
    margin-top: -43px;
    padding-top: 23px;
    padding-bottom: 50px;
    border-radius: 24px 24px 0px 0px;
    background: #ffffff;
    .taskTitle {
      padding-bottom: 10px;
      border-bottom: 1px solid #c6c9ce;
      p {
        position: relative;
        padding: 0 28px;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #333333;
        &::before {
          content: "";
          display: block;
          width: 3px;
          height: 16px;
          border-radius: 1.5px;
          background: #32ae57;
          position: absolute;
          top: 1px;
          left: 14px;
        }
      }
    }
    .taskInfo {
      margin-bottom: 8px;
      padding: 17px 3.75%;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.2px;
      color: #111111;
    }
  }
}
.datePickerinput {
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 0 10px;
    white-space: nowrap;
  }
}
/deep/.ignore {
  img {
    max-width: 100%;
    height: auto;
  }
  .select {
    width: 100%;
    border-radius: 5px;
    border: solid 1px #dcdfe6;
    height: 40px;
    padding: 0 10px;
    background-color: #fff;
    outline: 0;
  }

  .page-button {
    margin-top: 20px;
  }

  .questionTitle {
    font-size: 22px;
    text-align: center;
    margin-top: 20px;
  }

  .questionDescription {
    font-size: 14px;
    margin-top: 10px;
  }

  .question {
    .el-radio-group,
    .el-checkbox-group {
      display: flex;
      flex-direction: column;
    }

    .el-radio + .el-radio {
      margin-top: 10px;
      margin-left: 0;
    }

    .el-checkbox + .el-checkbox {
      margin-top: 10px;
      margin-left: 0;
    }

    .el-radio,
    .el-checkbox {
      width: 100%;
      height: max-content;
    }

    .el-form-item {
      display: flex;
      flex-direction: column;
    }
    .el-form-item__label {
      text-align: left;
      word-break: break-all;
    }
    .el-checkbox__label {
      word-break: break-all;
      overflow-wrap: break-word;
      white-space: break-spaces;
    }
  }
}
.vanRadio {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
