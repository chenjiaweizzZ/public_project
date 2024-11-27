<template>
  <el-container style="margin-bottom: 50px;">
    <el-aside width="300px">
      <EditAside
        @addQuestion="addQuestion"
        @importTemplate="importTemplate"
        @exportTemplate="exportTemplate"
        @setResult="predictVisible = true"
        @setDimensional="dimensional = true"
        @setScoringRubric="setScoringRubric"
      ></EditAside>
    </el-aside>
    <el-container style="margin-bottom: 60px;">
      <el-header>
        <el-row v-if="routeType==='hospital'" type="flex" class="margin20X flex-align-start flex-align">
          <span>模板归属</span>
          <el-select class="marginX20" v-model="dept" placeholder="请选择">
            <el-option v-for="item in newDeptOptions" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>

          <!-- <div class="flex"> -->
          <span>标签</span>
          <el-select class="marginX20" multiple collapse-tags style="display: inline-block;" v-model="fluptypes" placeholder="请选择">
            <el-option v-for="item in labelList " :key="item.dict_code" :label="item.dict_name" :value="item.dict_code"></el-option>
          </el-select>
          <el-button @click="openMoreSetting" type="primary" style="margin-right:20px">更多设置</el-button>
          <!-- </div> -->
        </el-row>
        <el-row v-else type="flex" class="margin20X flex-align-start flex-align">
          <span>问卷分类</span>
          <!-- <treeselect
            class="width200px marginX10"
            v-model="category"
            :value="null"
            :options="categoryList"
            placeholder="请选择分类"
            @select="selectCategory"
          />-->
        </el-row>
      </el-header>
      <el-main>
        <div class="edit-questionaire-title">
          <el-input placeholder="请输入问卷标题" v-model="title" maxlength="20" show-word-limit></el-input>
        </div>
        <div class="margin10X edit-questionaire-description">
          <el-input type="textarea" :autosize="{ minRows: 2}" placeholder="请输入问卷描述内容" v-model="description" maxlength="150" show-word-limit></el-input>
        </div>
        <div class="flex-column-align">
          <div v-for="(item,index) in questionList" :key="index" class="margin20X width85">
            <!--    题目-->
            <el-row v-if="item.type!=='addPage'" class="flex-align question" type="flex">
              <el-col :span="1">{{index-page(index)+1}}、</el-col>
              <el-col :span="12">
                <el-input v-model="item.label" placeholder="请设置题目" maxlength="100" show-word-limit></el-input>
              </el-col>
              <el-col class="flex-align-end" :span="11">
                <el-checkbox-group v-if="item.type==='radio'" v-model="item.hasOtherOption">
                  <el-checkbox label="其他选项"></el-checkbox>
                </el-checkbox-group>

                <el-checkbox-group v-if="item.type!='datePickerinput'" class="margin-left10" v-model="item.required">
                  <el-checkbox label="必选"></el-checkbox>
                </el-checkbox-group>

                <el-checkbox-group v-if="'inventoryProblem'.indexOf(item.type)>-1" class="margin-left10" v-model="item.multiple" @change="setValType(item)">
                  <el-checkbox label="多选"></el-checkbox>
                </el-checkbox-group>

                <el-checkbox-group v-if="'input|textarea|datePicker|datePickerinput'.indexOf(item.type)>-1" v-model="item.abnormal" class="margin-left10">
                  <el-checkbox label="设为异常"></el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-if="'datePicker'.indexOf(item.type)>-1" class="margin-left10" v-model="item.firstTimeMedicationTime">
                  <el-checkbox label="首次用药时间"></el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-if="'radio'.indexOf(item.type)>-1" class="margin-left10" v-model="item.firstTimeMedicationFeel">
                  <el-checkbox label="首次用药感受"></el-checkbox>
                </el-checkbox-group>

                <i v-if="item.type !=='addPage'" class="el-icon-share icon" title="设置关联题" @click="relate(item,index)"></i>
                <i class="el-icon-s-promotion icon" title="设置题目跳转" style="color:#80808059"></i>
                <i v-if="'select|radio|checkbox|inventoryProblem'.includes(item.type)" class="el-icon-link icon" title="设置选项关联" @click="optionRelated(item,index)"></i>
              </el-col>
            </el-row>
            <!--    单行文本框，多行文本框-->
            <el-row v-if="'input|textarea'.indexOf(item.type)>-1" class="margin10X flex-align">
              <el-col :offset="1" :span="10">
                <div v-if="item.type==='input'" class="single-text"></div>
                <div v-if="item.type==='textarea'" class="mutiple-text"></div>
              </el-col>
              <el-col class="flex-align-end" :span="14">
                <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
              </el-col>
            </el-row>
            <!--    下拉框，单选框，多选框，量表题-->
            <div v-if="'addPage|input|refProblem|textarea|datePicker|datePickerinput|image'.indexOf(item.type)===-1">
              <el-row v-for="(jitem,jindex) in item.options" :key="jindex" v-model="jitem.label" class="margin10X flex-align">
                <el-col class="flex-align-end" :span="1">
                  <i v-if="item.type==='select'" class="el-icon-arrow-down option-icon"></i>
                  <i v-if="item.type==='radio'" class="el-icon-remove-outline option-icon"></i>
                  <i v-if="item.type==='checkbox'" class="el-icon-circle-check option-icon"></i>
                  <i v-if="item.type==='inventoryProblem'" class="el-icon-star-off option-icon"></i>
                </el-col>
                <el-col class="flex-align" :span="7">
                  <el-input v-model="jitem.label" placeholder="请设置选项" maxlength="50" show-word-limit></el-input>
                </el-col>
                <el-col class="flex-align" v-if="item.type==='inventoryProblem'" :offset="1" :span="6">
                  <span>分数</span>
                  <el-input-number class="marginX10" v-model="jitem.score" :min="0" :max="9999" label="分数" v-wordLimit="'4'"></el-input-number>
                </el-col>
                <el-col class="flex-align-end" :span="span(item)">
                  <el-switch
                    v-if="item.type==='inventoryProblem'"
                    v-model="jitem.ifScore"
                    class="marginX10"
                    active-color="#00bc9c"
                    inactive-color="#dcdfe6"
                    active-text="不计分"
                    :active-value="false"
                    :inactive-value="true"
                  ></el-switch>
                  <i class="el-icon-arrow-up icon" title="上移选项" @click="moveOption('up',item,index,jindex)"></i>
                  <i class="el-icon-arrow-down icon" title="下移选项" @click="moveOption('down',item,index,jindex)"></i>
                  <i class="el-icon-close icon" title="删除选项" @click="deleteOption(item,index,jindex)"></i>
                  <el-checkbox-group v-model="jitem.abnormal" class="margin-left10">
                    <el-checkbox label="设为异常"></el-checkbox>
                  </el-checkbox-group>
                  <el-checkbox-group v-if="item.type==='radio'" v-model="jitem.supplement" class="margin-left10">
                    <el-checkbox label="允许填空"></el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :offset="1">
                  <div class="flex-align addOption" @click="addOption(item)">
                    <i class="el-icon-plus"></i>
                    <span>添加选项</span>
                  </div>
                </el-col>
                <el-col class="flex-align-end">
                  <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                  <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                  <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
                </el-col>
              </el-row>
            </div>
            <!-- 引用题 -->
            <div v-if="item.type === 'refProblem'">
              <el-row class="margin10X flex-align">
                <el-col class="flex-align-justify" :span="4">
                  <i class="el-icon-question option-icon" style="font-size: 15px; ">引用题目内容</i>
                </el-col>
                <el-col class="flex-align" :span="7">
                  <el-select v-model="item.refOption" placeholder="请选择">
                    <el-option v-for="jitem in options(index)" :key="jitem.key" :value="jitem.key" :label="jitem.label" :disabled="jitem.disabled"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col class="flex-align-end">
                  <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                  <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                  <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
                </el-col>
              </el-row>
            </div>
            <!--    分页-->
            <el-row v-if="item.type==='addPage'" type="flex" class="margin20X">
              <el-col class="flex-align-end">{{`[第${page(index)}页/共${totalPage}页]`}}</el-col>
              <el-col class="flex-align-end">
                <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
              </el-col>
            </el-row>
            <!--    日期输入框-->
            <div v-if="item.type==='datePickerinput'" style="display: flex;align-items: center;" class="margin20X">
              <div class="datePickerinput">
                <!-- <p>日期</p> -->
                <el-input v-model="item.value[0]" disabled></el-input>
                <p>年</p>
                <el-input v-model="item.value[1]" disabled></el-input>
                <p>月</p>
                <el-input v-model="item.value[2]" disabled></el-input>
                <p>日</p>
              </div>
              <el-col class="flex-align-end">
                <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
              </el-col>
            </div>
            <!--    日期控件-->
            <div v-if="item.type==='datePicker'" style="display: flex;align-items: center;" class="margin20X">
              <div class="datePickerinput">
                <el-date-picker v-model="item.value" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </div>
              <el-col class="flex-align-end">
                <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
              </el-col>
            </div>
             <!--    图片-->
             <div v-if="item.type==='image'" style="display: flex;align-items: center;" class="margin20X">
              <uploadImage :imgList.sync="item.value"></uploadImage>
              <el-col class="flex-align-end">
                <i class="el-icon-caret-top icon" title="上移题目" @click="moveQuestion('up',item,index)"></i>
                <i class="el-icon-caret-bottom icon" title="下移题目" @click="moveQuestion('down',item,index)"></i>
                <i class="el-icon-delete-solid icon" title="删除题目" @click="deleteQuestion(item,index)"></i>
              </el-col>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <div class="butbox">
      <el-button class="marginX10" type="primary" @click="toSave">{{componentValue == 1 || authState == 1 ? '提交审核':'保 存'}}</el-button>
      <el-button class="marginX10" @click="$router.go(-1)">取 消</el-button>
      <el-button class="marginX10" type="warning" plain @click="toPreview">预 览</el-button>
    </div>
    <!-- <el-row class="footer flex-align">
      <el-col :offset="1" :span="6">
        <el-button class="marginX10" type="primary" @click="toSave">保 存</el-button>
        <el-button class="marginX10" @click="$router.go(-1)">取 消</el-button>
        <el-button class="marginX10" type="warning" plain @click="toPreview">预 览</el-button>
      </el-col>
    </el-row>-->
    <el-dialog v-if="predictVisible" title="设置测评结果" width="50%" class="predictDialog" center :visible.sync="predictVisible" :before-close="closeDialog">
      <PredictedResults :predictList="predictList" :scoringRules="scoringRules" :dimensionalList="dimensionalList" @close="closeDialog" @modifyPredictList="modifyPredictList"></PredictedResults>
    </el-dialog>
    <el-dialog v-if="relateVisible" title="设置关联题目" width="40%" class="predictDialog" center :visible.sync="relateVisible" :before-close="closeDialog">
      <RelateQuestion :questionList="totalQuestionList.questionList" :relateIndex="relateIndex" @deleteRelated="deleteRelated" @close="closeDialog" @modifyRelate="modifyRelate" />
    </el-dialog>
    <el-dialog v-if="relateOptionVisible" :visible.sync="relateOptionVisible" :before-close="closeDialog" title="设置选项关联" width="40%" class="predictDialog" center>
      <RelateOption :questionList="totalQuestionList.questionList" :relateIndex="relateIndex" @close="closeDialog" @modifyOptionRelate="modifyOptionRelate" />
    </el-dialog>

    <el-dialog v-if="previewVisible" width="100%" fullscreen class="predictDialog" :visible.sync="previewVisible" :before-close="closeDialog">
      <Preview :totalQuestionList="totalQuestionList" />
    </el-dialog>
    <el-dialog v-if="moreSettingVisible" width="50%" :visible.sync="moreSettingVisible" :before-close="closeMoreSetting" title="更多设置">
      <el-row type="flex" class="margin20X flex-align">
        <span>&emsp;&emsp;模板归属</span>
        <el-select class="marginX20" v-model="dept" placeholder="请选择">
          <el-option v-for="item in newDeptOptions" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
      </el-row>
      <el-row type="flex" style=" align-items: center;">
        <span>&ensp;评测结果展示&emsp;</span>
        <div>
          <el-radio-group v-model="evaluationEnabled">
            <el-radio-button :label="1">展示</el-radio-button>
            <el-radio-button :label="0">不展示</el-radio-button>
          </el-radio-group>
        </div>
        <!-- <el-radio-group style="border: none;" class="marginX20" v-model="evaluationEnabled">
          <el-radio label="1" value="1" border>展示</el-radio>
          <el-radio label="0" value="0" border>不展示</el-radio>
        </el-radio-group>-->
      </el-row>
      <div v-if="evaluationEnabled != 0" class="setShowBox">
        <div>
          <span style=" margin-right: 10px;">&ensp;患者端小程序</span>
          <el-checkbox-group v-model="medicalSide">
            <el-checkbox-button label="score">总分</el-checkbox-button>
            <el-checkbox-button :disabled="wdList.length==0" label="dimension">维度分</el-checkbox-button>
            <el-checkbox-button label="result">评测结果</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div>
          <span style=" margin-right: 10px;">医生端/管理端</span>
          <el-checkbox-group v-model="patientSide">
            <el-checkbox-button label="score">总分</el-checkbox-button>
            <el-checkbox-button :disabled="wdList.length==0" label="dimension">维度分</el-checkbox-button>
            <el-checkbox-button label="result">评测结果</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setMoreSettingVisible">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="维度设置" :visible.sync="dimensional" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
      <Dimensional ref="wdRef" :questionList="questionList" :dimensionalList="dimensionalListDelivery" :scoringRules="scoringRules" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dimensional = false">取 消</el-button> -->
        <el-button type="primary" @click="closeDimensional">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置得分规则" :visible.sync="scoringRubric" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
      <ScoringRubric
        ref="scoring"
        :dimensional.sync="dimensional"
        :scoringRules="scoringRules"
        :questionList="questionList"
        :dimensionalList="dimensionalList"
        :predictList="predictList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="scoringRubric = false">取 消</el-button>
        <el-button type="primary" @click="scoringRubric = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请输入问卷标题" :visible.sync="dialogTitle" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>
        <el-input placeholder="请输入问卷标题" v-model="title" maxlength="20" show-word-limit></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTitle = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import EditAside from './components/edit_aside';
import PredictedResults from './components/predicted_results';
import RelateQuestion from './components/relate_question';
import RelateOption from './components/relate_option';
import Preview from './preview';
import deptList from '@/mixins/deptList';
import templateCategory from '../../../mixins/templateCategory';
import Dimensional from './components/dimensional';
import ScoringRubric from './components/scoringRubric';
import uploadImage from "./components/uploadImage"
export default {
  components: {
    EditAside,
    PredictedResults,
    RelateQuestion,
    Preview,
    RelateOption,
    Dimensional,
    ScoringRubric,
    uploadImage,
  },
  mixins: [deptList, templateCategory],
  data() {
    return {
      input: '',
      title: '',
      description: '为了提升医院服务，特邀请您来做一次调查，请您花几分钟进行表格的填写。我们会对问卷中的信息进行保密，请放心作答',
      predictVisible: false,
      relateVisible: false,
      relateOptionVisible: false,
      previewVisible: false,
      moreSettingVisible: false,
      evaluationEnabled: 0,
      medicalSide: [],
      patientSide: [],
      isShow: '0',
      relateIndex: '',
      questionList: [],
      predictList: [],
      totalQuestionList: {
        title: '',
        description: '',
        predictList: [],
        questionList: [],
      },
      editSetting: {
        dept: '',
        evaluationEnabled: '0',
        patientSide: [],
        medicalSide: [],
      },
      fluptypes: '',
      labelList: [],
      dimensional: false, //维度面板
      scoringRubric: false, //得分规则面板
      dimensionalList: [], //维度列表 --- 前端判断使用过滤过的
      dimensionalListDelivery: [], //维度列表  --- 传后台
      wdList: [], //绑定题目维度
      scoringRules: [], //得分规则数据集合
      dialogTitle: true,
      componentValue:0,//0 不需要审核 1 需要审核
    };
  },
  computed: {
    routeType() {
      return this.$route.params.type;
    },
    span() {
      return function (item) {
        return item.type === 'inventoryProblem' ? 10 : 16;
      };
    },
    page() {
      return function (index) {
        let pageCount = 0;
        for (let i = 0; i <= index; i++) {
          if (this.questionList[i].type === 'addPage') {
            pageCount++;
          }
        }
        return pageCount;
      };
    },
    totalPage() {
      let pageCount = 1;
      this.questionList.forEach((element) => {
        if (element.type === 'addPage') {
          pageCount++;
        }
      });
      return pageCount;
    },
    serialNo() {
      return this.$route.query.serialNo || '';
    },
    options() {
      return function (index) {
        let options = [];
        for (let i = 0; i < index; i++) {
          if (this.questionList[i].type == 'checkbox') {
            if (this.questionList[i].label) {
              options.push({
                key: this.questionList[i].key,
                label: `题${this.questionList[i].key}、${this.questionList[i].label}`,
                disabled: false,
              });
            }
          }
        }
        return options;
      };
    },
    authState(){
      if(this.$route.query.authState){
        return this.$route.query.authState
      }
      return 0;
    },
  },
  async created() {
    this.$startLoading();
    let res = await this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id,
        moduleCode: 'followUpSetting',
        componentKey: 'wjTemplateCreateAuth',
      })
    if(res){
      this.componentValue = res.componentValue;
    }
    if (this.routeType === 'hospital') {
      await this.getAllNewDept();
    } else {
      await this.getCategory(2);
    }
    if (this.serialNo) {
      this.toGetXJTemplate();
    }
    //获取知识库类型
    this.$apis.BaseDictGetDictItems({ parentId: '202105141723161928q6' }).then((res) => {
      this.labelList = res;
    });
    this.$stopLoading();
  },
  methods: {
    setScoringRubric() {
      this.scoringRubric = true;
      this.$nextTick(() => {
        this.$refs.scoring.computeType = 1;
      });
    },
    closeDimensional() {
      let arr = [];
      this.dimensionalList = this.dimensionalListDelivery.filter((item) => {
        return item.isDelete != 1;
      });
      this.dimensionalList.forEach((item) => {
        if (!item.keyId || item.keyId == '') {
          arr.push(item.dimension);
        }
      });
      if (arr.length != 0) {
        this.$confirm('列表中【' + arr + '】维度未绑定题目,确认关闭弹窗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.dimensional = false;
          })
          .catch(() => {});
      } else {
        this.dimensional = false;
      }
    },
    setValType(item) {
      if (item.multiple) {
        item.value = [];
      } else {
        item.value = '';
      }
    },
    selectCategory(node) {
      this.category = node.id;
      this.categoryName = node.label;
    },
    //获取问卷模板
    toGetXJTemplate() {
      if (this.routeType === 'hospital') {
        this.$apis
          .templatequeryTemplateContent({
            serialNo: this.serialNo,
          })
          .then((res) => {
            console.log('sssssssssss');
            let list = JSON.parse(res.contentHtml) || JSON.parse(res.content);
            this.questionList = list.questionList;
            this.title = list.title;
            this.description = list.description;
            this.predictList = list.predictList;
            this.evaluationEnabled = res.evaluationEnabled.toString();
            this.dept = res.flupDept;
            this.dimensionalList = res.questionnaireDimensions ? res.questionnaireDimensions : [];
            this.dimensionalListDelivery = res.questionnaireDimensions ? res.questionnaireDimensions : [];
            this.scoringRules = res.questionnaireScoringRules ? res.questionnaireScoringRules : [];
            if (this.scoringRules.length) {
              this.scoringRules.forEach((el) => {
                el.mathematicalFormula = JSON.parse(el.mathematicalFormula);
              });
            }
            this.medicalSide = JSON.parse(res.medicalSide) || [];
            this.patientSide = JSON.parse(res.patientSide) || [];
          });
      } else {
        this.$apis
          .getQuBaseTemplate({
            serialNo: this.serialNo,
          })
          .then((res) => {
            this.category = res.dataList.category_code;
            let list = JSON.parse(res.dataList.content);
            this.questionList = list.questionList;
            this.title = list.title;
            this.desc = list.description;
            this.predictList = list.predictList;
            this.evaluationEnabled = list.evaluationEnabled.toString();
          });
      }
    },
    //导入
    importTemplate(list) {
      // this.dept = list.dept
      this.title = list.title;
      this.description = list.description;
      this.questionList = list.questionList;
      this.predictList = list.predictList;
    },
    //导出
    exportTemplate() {
      function saveShareContent(content, fileName) {
        let downLink = document.createElement('a');
        downLink.download = fileName;
        //字符内容转换为blod地址
        let blob = new Blob([content]);
        downLink.href = URL.createObjectURL(blob);
        // 链接插入到页面
        document.body.appendChild(downLink);
        downLink.click();
        // 移除下载链接
        document.body.removeChild(downLink);
      }

      if (this.judge()) {
        saveShareContent(JSON.stringify(this.totalQuestionList), this.title);
      }
    },
    //点击按钮添加题目
    addQuestion(type) {
      if (type === 'datePickerinput') {
        this.questionList.push({
          type: type,
          required: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          value: [],
          label: '',
          abnormal: false,
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'datePicker') {
        this.questionList.push({
          type: type,
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          value: '',
          label: '',
          abnormal: false,
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'addPage') {
        this.questionList.push({ type: type });
      }
      if (type === 'input' || type === 'textarea') {
        this.questionList.push({
          type: type,
          label: '',
          value: '',
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          abnormal: false,
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'select') {
        this.questionList.push({
          type: type,
          label: '',
          value: '',
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          options: [
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
          ],
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'radio') {
        this.questionList.push({
          type: type,
          label: '',
          value: '',
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          hasOtherOption: false,
          otherOption: '',
          options: [
            {
              label: '',
              abnormal: false,
              supplement: false,
            },
            {
              label: '',
              abnormal: false,
              supplement: false,
            },
            {
              label: '',
              abnormal: false,
              supplement: false,
            },
            {
              label: '',
              abnormal: false,
              supplement: false,
            },
          ],
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'checkbox') {
        this.questionList.push({
          type: type,
          label: '',
          value: [],
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          options: [
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
            {
              label: '',
              abnormal: false,
            },
          ],
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'inventoryProblem') {
        this.questionList.push({
          type: type,
          label: '',
          value: '',
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          options: [
            {
              label: '',
              score: 0,
              ifScore: true,
              abnormal: false,
            },
            {
              label: '',
              score: 0,
              ifScore: true,
              abnormal: false,
            },
            {
              label: '',
              score: 0,
              ifScore: true,
              abnormal: false,
            },
            {
              label: '',
              score: 0,
              ifScore: true,
              abnormal: false,
            },
          ],
          relatedList: [],
          relatedWay: 'and',
        });
      }
      if (type === 'refProblem') {
        this.questionList.push({
          type: type,
          label: '',
          value: '',
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          options: [],
          relatedList: [],
          refOption: '',
        });
      }
      if (type === 'image') {
        this.questionList.push({
          type: type,
          label: '',
          value: [],
          required: false,
          multiple: false,
          firstTimeMedicationTime: false,
          firstTimeMedicationFeel: false,
          abnormal: false,
          relatedList: [],
        });
      }
      this.getTotalQuestionList();
    },
    //关闭预测结果对话框
    closeDialog() {
      this.predictVisible = false;
      this.relateVisible = false;
      this.relateOptionVisible = false;
      this.previewVisible = false;
    },
    //修改预测结果
    modifyPredictList(predictList) {
      this.predictList = predictList;
    },
    //关联题目
    relate(item, index) {
      let message = '';
      let haveInventoryProblem = false;

      for (let i = 0; i < index; i++) {
        if (this.questionList[i].type !== 'addPage') {
          haveInventoryProblem = true;
          if ('select|radio|checkbox|inventoryProblem'.includes(this.questionList[i].type)) {
            this.questionList[i].options.forEach((element) => {
              if (!element.label) message = '此题前题目选项不能为空！';
            });
          }
          if (!this.questionList[i].label) message = '此题前题目不能为空！';
        }
      }
      if (!haveInventoryProblem) {
        message = '此题前没有题目！';
      }
      if (!message && haveInventoryProblem) {
        this.relateIndex = index;
        this.getTotalQuestionList();
        this.relateVisible = true;
      } else {
        this.$message({ showClose: true, message: message, type: 'warning' });
      }
    },
    //删除已有关联题目
    deleteRelated(index) {
      this.questionList[index].relatedList = [];
      this.questionList[index].relatedWay = 'and';
      this.closeDialog();
    },
    //修改关联题目
    modifyRelate(relatedList, index, relatedWay) {
      this.questionList[index].relatedList = JSON.parse(JSON.stringify(relatedList));
      this.questionList[index].relatedWay = relatedWay;
      this.closeDialog();
    },
    //修改选项关联
    modifyOptionRelate(index, relateOption) {
      this.questionList[index].options = JSON.parse(JSON.stringify(relateOption));
      this.closeDialog();
    },
    // 移动题目，up上移，down下移
    moveQuestion(direction, item, index) {
      // let arr = this.dimensionalList.filter((element) => {
      //   return element.keyId.split(',').map(Number).indexOf(item.key) != -1
      // })
      // if (arr.length != 0) {
      //   this.$message({
      //     message: '本题已绑定维度,请解除绑定后再移动位置!',
      //     type: 'warning',
      //   })
      //   return
      // }
      let dimensionalArr = this.dimensionalList.filter((i) => i.keyId !== '');
      let scoringQuertionarr = this.scoringRules.filter((i) => i.isSystem === 0);
      if (dimensionalArr.length !== 0 || scoringQuertionarr.length !== 0) {
        this.$message({
          message: '维度已绑定题目或已设置自定义得分规则后，不允许删除或者移动题目!',
          type: 'warning',
        });
        return;
      }

      if (direction === 'up') {
        if (index === 0) {
          this.$message({
            showClose: true,
            message: '无法上移第一个题目！',
            type: 'warning',
          });
          return;
        }
        let arr = this.dimensionalList.filter((element) => {
          return (
            element.keyId
              .split(',')
              .map(Number)
              .indexOf(item.key - 1) != -1
          );
        });
        if (arr.length != 0) {
          this.$message({
            message: '上一题已绑定维度,请解除绑定后再移动位置!',
            type: 'warning',
          });
          return;
        }
        if (item.type !== 'addPage') {
          for (let i of item.relatedList) {
            if (i.questionIndex === index - 1) {
              this.$message({
                showClose: true,
                message: '上一题为本题的关联题！',
                type: 'warning',
              });
              return;
            }
          }
        }
        if (index < this.questionList.length - 1) {
          for (let i = index + 1; i < this.questionList.length; i++) {
            if (this.questionList[i].type !== 'addPage') {
              for (let j of this.questionList[i].relatedList) {
                if (j.questionIndex === index) {
                  j.questionIndex--;
                  continue;
                }
                if (j.questionIndex === index - 1) {
                  j.questionIndex++;
                }
              }
              this.questionList[i].relatedList = _.orderBy(this.questionList[i].relatedList, ['questionIndex'], ['asc']);
            }
          }
        }
        item.key--;
        this.questionList[index - 1].key++;
        this.questionList.splice(index - 1, 2, { ...item }, { ...this.questionList[index - 1] });
      } else {
        if (index === this.questionList.length - 1) {
          this.$message({
            showClose: true,
            message: '无法下移最后一个题目！',
            type: 'warning',
          });
          return;
        }
        let arr = this.dimensionalList.filter((element) => {
          return (
            element.keyId
              .split(',')
              .map(Number)
              .indexOf(item.key + 1) != -1
          );
        });
        if (arr.length != 0) {
          this.$message({
            message: '下一题已绑定维度,请解除绑定后再移动位置!',
            type: 'warning',
          });
          return;
        }
        if (item.type !== 'addPage' && this.questionList[index + 1].type !== 'addPage') {
          for (let i of this.questionList[index + 1].relatedList) {
            if (i.questionIndex === index) {
              this.$message({
                showClose: true,
                message: '本题为下一题的关联题！',
                type: 'warning',
              });
              return;
            }
          }
        }
        if (index < this.questionList.length - 2) {
          for (let i = index + 2; i < this.questionList.length; i++) {
            if (this.questionList[i].type === 'inventoryProblem') {
              for (let j of this.questionList[i].relatedList) {
                if (j.questionIndex === index) {
                  j.questionIndex++;
                  continue;
                }
                if (j.questionIndex === index + 1) {
                  j.questionIndex--;
                }
              }
              this.questionList[i].relatedList = _.orderBy(this.questionList[i].relatedList, ['questionIndex'], ['asc']);
            }
          }
        }
        item.key++;
        this.questionList[index + 1].key--;
        this.questionList.splice(index, 2, { ...this.questionList[index + 1] }, { ...item });
      }
    },
    //删除题目
    deleteQuestion(item, index) {
      let _this = this;
      let dimensionalArr = this.dimensionalList.filter((i) => i.keyId !== '');
      let scoringQuertionarr = this.scoringRules.filter((i) => i.isSystem === 0);
      if (dimensionalArr.length !== 0 || scoringQuertionarr.length !== 0) {
        this.$message({
          message: '维度已绑定题目或已设置自定义得分规则后，不允许删除或者移动题目!',
          type: 'warning',
        });
        return;
      }
      for (let i = index; i < this.questionList.length; i++) {
        if (this.questionList[i].type === 'inventoryProblem') {
          this.questionList[i].relatedList.forEach((element, key) => {
            if (element.questionIndex === index) _this.questionList[i].relatedList.splice(key, 1);
          });
        }
      }
      this.questionList.splice(index, 1);
      this.getTotalQuestionList();
      this.$message({ showClose: true, message: '删除成功！', type: 'success' });
    },
    //移动选项，up上移，down下移
    moveOption(direction, item, index, jindex) {
      if (direction === 'up') {
        if (jindex === 0) {
          this.$message({
            showClose: true,
            message: '无法上移第一个选项！',
            type: 'warning',
          });
          return;
        }
        if (item.type === 'inventoryProblem') {
          for (let i = index; i < this.questionList.length; i++) {
            if (this.questionList[i].type === 'inventoryProblem') {
              this.questionList[i].relatedList.forEach((element) => {
                if (element.questionIndex === index) {
                  if (element.optionIndex.indexOf(jindex) > -1 && element.optionIndex.indexOf(jindex - 1) === -1) element.optionIndex[element.optionIndex.indexOf(jindex)]--;
                  else if (element.optionIndex.indexOf(jindex) === -1 && element.optionIndex.indexOf(jindex - 1) > -1)
                    element.optionIndex[element.optionIndex.indexOf(jindex - 1)]++;
                }
              });
            }
          }
        }
        item.options.splice(jindex - 1, 2, { ...item.options[jindex] }, { ...item.options[jindex - 1] });
      } else {
        if (jindex === item.options.length - 1) {
          this.$message({
            showClose: true,
            message: '无法下移最后一个选项！',
            type: 'warning',
          });
          return;
        }
        if (item.type === 'inventoryProblem') {
          for (let i = index; i < this.questionList.length; i++) {
            if (this.questionList[i].type === 'inventoryProblem') {
              this.questionList[i].relatedList.forEach((element, index) => {
                if (element.questionIndex === index) {
                  if (element.optionIndex.indexOf(jindex) > -1 && element.optionIndex.indexOf(jindex + 1) === -1) element.optionIndex[element.optionIndex.indexOf(jindex)]++;
                  else if (element.optionIndex.indexOf(jindex) === -1 && element.optionIndex.indexOf(jindex + 1) > -1)
                    element.optionIndex[element.optionIndex.indexOf(jindex + 1)]--;
                }
              });
            }
          }
        }
        item.options.splice(jindex, 2, { ...item.options[jindex + 1] }, { ...item.options[jindex] });
      }
    },
    //删除选项
    deleteOption(item, index, jindex) {
      let _this = this;
      console.log(item);
      if (item.options.length === 1) {
        this.$message({
          showClose: true,
          message: '请为题目保留至少一个选项',
          type: 'warning',
        });
        return;
      }
      if (item.type === 'inventoryProblem') {
        for (let i = index; i < this.questionList.length; i++) {
          if (this.questionList[i].type === 'inventoryProblem') {
            this.questionList[i].relatedList.forEach((element, key) => {
              if (element.questionIndex === index && element.optionIndex.indexOf(jindex) > -1) {
                element.optionIndex.length > 1 ? element.optionIndex.splice(element.optionIndex.indexOf(jindex), 1) : _this.questionList[i].relatedList.splice(key, 1);
              }
            });
          }
        }
      }
      item.options.splice(jindex, 1);
      this.$message({ showClose: true, message: '删除成功！', type: 'success' });
    },
    //增加选项
    addOption(item) {
      item.options.push(
        item.type === 'inventoryProblem'
          ? {
              label: '',
              score: 0,
              ifScore: true,
              abnormal: false,
            }
          : item.type === 'radio'
          ? { label: '', abnormal: false, supplement: false }
          : { label: '', abnormal: false }
      );
    },
    getTotalQuestionList() {
      this.totalQuestionList = {
        // dept: this.dept,
        title: this.title,
        description: this.description,
        predictList: this.predictList,
        questionList: [],
      };
      this.questionList.forEach((element, index) => {
        element.key = index - this.page(index) + 1;
        this.totalQuestionList.questionList.push(
          // element.type !== 'addPage'
          //   ?
          // {
          //   ...element,
          //   key: index - this.page(index) + 1,
          // }
          // : { ...element }
          { ...element }
        );
        if (element.type === 'inventoryProblem') {
          element.options.forEach((jelement) => {
            if (!jelement.ifScore) {
              jelement.score = 0;
            }
          });
        }
      });
      this.questionList = this.totalQuestionList.questionList;
    },
    //判断问卷是否设置完整
    judge() {
      if (this.description === '') {
        this.$message({
          showClose: true,
          message: '请为问卷设置问卷描述',
          type: 'warning',
        });
        return false;
      }
      if (this.title === '') {
        this.$message({
          showClose: true,
          message: '请为问卷设置标题',
          type: 'warning',
        });
        return false;
      }
      if (this.questionList.length === 0) {
        this.$message({
          showClose: true,
          message: '请为问卷设置题目',
          type: 'warning',
        });
        return false;
      }
      this.getTotalQuestionList();
      for (let i = 0; i < this.questionList.length; i++) {
        let item = this.totalQuestionList.questionList[i];
        if (item.type !== 'addPage' && item.type !== 'datePicker' && item.type !== 'datePickerinput' && item.type !== 'image') {
          if (item.label === '') {
            this.$message({
              showClose: true,
              message: `请为题${item.key}设置题目`,
              type: 'warning',
            });
            return false;
          }
          for (let j = i + 1; j < this.questionList.length; j++) {
            if (this.totalQuestionList.questionList[j].label === item.label) {
              this.$message({
                showClose: true,
                message: `题${item.key}与题${this.totalQuestionList.questionList[j].key}相同`,
                type: 'warning',
              });
              return false;
            }
          }
          if ('input|textarea'.indexOf(item.type) === -1) {
            if (item.type === 'inventoryProblem' && !this.scoringRules.filter((i) => i.dimensionId === '0').length) {
              this.$message({
                showClose: true,
                message: '请为量表题设置总分得分规则',
                type: 'warning',
              });
              return false;
            }
            if (item.type === 'inventoryProblem' && this.predictList.length === 0) {
              this.$message({
                showClose: true,
                message: '请为量表题设置测评结果',
                type: 'warning',
              });
              return false;
            }
            for (let j = 0; j < item.options.length; j++) {
              if (item.options[j].label === '') {
                this.$message({
                  showClose: true,
                  message: `请为题${item.key}设置选项`,
                  type: 'warning',
                });
                return false;
              }
              for (let k = j + 1; k < item.options.length; k++) {
                if (item.options[k].label === item.options[j].label) {
                  this.$message({
                    showClose: true,
                    message: `请为题${item.key}设置不同选项`,
                    type: 'warning',
                  });
                  return false;
                }
              }
            }

            if (item.type === 'refProblem') {
              if (!item.refOption) {
                this.$message({
                  showClose: true,
                  message: `请为题${item.key}设置引用题`,
                  type: 'warning',
                });
                return false;
              }
            }
          }
        }
      }
      return true;
    },
    //保存
    toSave() {
      if (this.judge()) {
        if (this.routeType === 'hospital') {
          let submitForm = {
            createUser: this.$global.userName,
            questionnaireTypeId: 2,
            hospitalId: this.$global.hospital_id,
            questionnaireName: this.title,
            flupDept: this.dept,
            serialNo: this.serialNo || undefined,
            content: this.description,
            contentHtml: JSON.stringify(this.totalQuestionList),
            questionnaireDimensionList: JSON.stringify(this.dimensionalListDelivery),
            questionnaireScoringRules: JSON.stringify(this.scoringRules),
            patientSide: this.patientSide,
            medicalSide: this.medicalSide,
            // evaluationEnabled: parseInt(this.evaluationEnabled),
            medicalSide: JSON.stringify(this.medicalSide) || [],
            patientSide: JSON.stringify(this.patientSide) || [],
          };

          let formData = new FormData();
          for (let key in submitForm) {
            if (submitForm[key]) formData.append(key, submitForm[key]);
          }
          formData.append('evaluationEnabled', parseInt(this.evaluationEnabled));
          this.$apis.templatesaveTemplateData(formData).then(() => {
            this.$message({
              showClose: true,
              message: '保存成功！',
              type: 'success',
            });
            this.$router.go(-1);
          });
        } else {
          if (!this.category) {
            this.$message({
              showClose: true,
              message: '请选择问卷分类！',
              type: 'warning',
            });
            return;
          }
          let submitForm = {
            create_user: this.$global.real_name,
            template_type: 1,
            template_name: this.title,
            serialNo: this.serialNo || undefined,
            category_code: this.category,
            category_name: this.categoryName,
            content: JSON.stringify(this.totalQuestionList),
          };
          let formData = new FormData();
          for (let key in submitForm) {
            if (submitForm[key]) formData.append(key, submitForm[key]);
          }
          this.$apis.saveQuBaseTemplate(formData).then(() => {
            this.$message({
              showClose: true,
              message: '保存成功！',
              type: 'success',
            });
            this.$router.go(-1);
          });
        }
      }
    },
    ///预览
    toPreview() {
      if (this.judge()) {
        this.previewVisible = true;
      }
    },
    // 选项关联
    optionRelated(item, index) {
      let message = '';
      let haveInventoryProblem = false;

      for (let i = 0; i < index; i++) {
        if (this.questionList[i].type !== 'addPage') {
          haveInventoryProblem = true;
          if ('select|radio|checkbox|inventoryProblem'.includes(this.questionList[i].type)) {
            this.questionList[i].options.forEach((element) => {
              if (!element.label) message = '此题前题目选项不能为空！';
            });
          }
          if (!this.questionList[i].label) message = '此题前题目不能为空！';
        }
      }
      if (!haveInventoryProblem) {
        message = '此题前没有题目！';
      }
      if (!message && haveInventoryProblem) {
        this.relateIndex = index;
        this.getTotalQuestionList();
        this.relateOptionVisible = true;
      } else {
        this.$message({ showClose: true, message: message, type: 'warning' });
      }
    },
    openMoreSetting() {
      this.wdList = this.dimensionalList.filter((item) => {
        return item.keyId && item.keyId != '';
      });
      this.editSetting.dept = this.dept;
      this.editSetting.evaluationEnabled = this.evaluationEnabled;
      this.editSetting.patientSide = [...this.patientSide];
      this.editSetting.medicalSide = [...this.medicalSide];
      this.moreSettingVisible = true;
    },
    closeMoreSetting() {
      this.dept = this.editSetting.dept;
      this.evaluationEnabled = this.editSetting.evaluationEnabled;
      this.patientSide = [...this.editSetting.patientSide];
      this.medicalSide = [...this.editSetting.medicalSide];
      this.moreSettingVisible = false;
    },
    setMoreSettingVisible() {
      if (this.evaluationEnabled != 0) {
        if (
          (this.medicalSide.indexOf('score') == -1 && this.medicalSide.indexOf('dimension') == -1) ||
          (this.patientSide.indexOf('score') == -1 && this.patientSide.indexOf('dimension') == -1)
        ) {
          this.$message({
            message: '展示的情况下请保持【总分】和【维度分】至少有一个选中!',
            type: 'warning',
          });
          return;
        }
      }
      this.moreSettingVisible = false;
    },
  },
};
</script>

<style lang="scss">
/*标题*/
.edit-questionaire-title {
  .el-input {
    display: flex;
    justify-content: center;
  }

  .el-input--small .el-input__inner {
    font-size: 20px;
    border: 0;
    height: 40px;
    text-align: center;
    width: 30%;
  }
}

/*问卷描述*/
.edit-questionaire-description {
  .el-textarea__inner {
    border: 0;
    overflow-y: hidden;
    resize: none;
    text-align: center;
    width: 75%;
  }

  .el-textarea {
    display: flex;
    justify-content: center;
  }
}

/*预测结果对话框顶部边框*/
.predictDialog {
  .el-dialog__body {
    border-top: 0;
  }
}
.datePickerinput {
  margin-left: 4%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 0 10px;
    white-space: nowrap;
  }
}
.setShowBox {
  > div {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
}
.el-input-number.el-input-number--small {
  line-height: 38px !important;
}
// .el-input-number.el-input-number--small {
//   line-height: 38px;
// }
</style>

<style scoped>
.icon {
  margin-left: 10px;
  font-size: 20px;
  cursor: pointer;
}

.icon:hover {
  color: #00bc9c;
}

.option-icon {
  margin-right: 10px;
  font-size: 20px;
}

.addOption {
  font-size: 16px;
  color: #00bc9c;
  cursor: pointer;
}

.single-text {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  height: 30px;
}

.mutiple-text {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  height: 60px;
}
.butbox {
  width: 100%;
  height: 60px;
  padding: 10px 30px;
  position: fixed;
  left: 0;
  bottom: 0;
  box-shadow: 0 -2px 5px -2px rgba(0, 0, 0, 0.18);
  background-color: #fff;
  z-index: 9;
}
</style>
