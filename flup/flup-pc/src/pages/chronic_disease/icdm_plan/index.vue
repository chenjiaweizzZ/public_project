<template>
  <section ref="section" class="chronic-disease">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      慢病计划
    </div>-->
    <div class="main">
      <div class="base-info" :class="{'limit':!showMore}">
        <div class="base-info-detail">
          <span v-for="(m, index) in baseInfo" :key="index">{{m.displayName}}:{{baseInfoValue[m.fieldName] }}</span>
        </div>
        <span class="fold-btn" @click="moreData">
          <img src="~@/assets/images/more.png" v-if="showMore" alt />
          <img src="~@/assets/images/fold.png" v-else alt />
        </span>
      </div>
      <div class="type-area">
        <div style="width: 10%;">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <div class="group">
          <el-checkbox-group v-model="checkedList" @change="chooseOne">
            <el-checkbox v-for="(m,index) in typeData" :label="m.name" :key="index">
              <span class="short-line" :class="'color-'+(index+1)"></span>
              {{m.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="main-table">
        <!-- 表格 -->
        <el-row class="row first-line" type="flex">
          <div class="headline">
            <div class="text">日期</div>
          </div>
          <div class="col2" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <span v-if="index == 0" class="pre-page" :disabled="pageIndex == 1">
              <img src="~@/assets/images/left-gray.png" v-if="startIndex == 0" alt style=" cursor: not-allowed;" />
              <img src="~@/assets/images/left.png" v-else alt style=" cursor: pointer;" @click="changeTablePage('pre')" />
            </span>
            <span class="date">{{ item.flupDate }}</span>
            <span v-if="index == inhospitalData.length - 1" class="next-page">
              <img src="~@/assets/images/right-gray.png" v-if="(startIndex+7)>inhospitalDataTotal.length||(startIndex+7)==inhospitalDataTotal.length" alt style=" cursor: not-allowed;" />
              <img src="~@/assets/images/right.png" v-else alt style=" cursor: pointer;" @click="changeTablePage('next')" />
            </span>
          </div>
        </el-row>
        <el-row class="row first-line" type="flex">
          <div class="headline">
            <div class="text">出院天数</div>
          </div>
          <div class="col2" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <div class="text">{{ item.dateOffset }}</div>
          </div>
        </el-row>
        <el-row class="row first-line" type="flex">
          <div class="headline bg">
            <div class="text">常规随访</div>
          </div>
          <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <div v-for="(m, indexs) in item.nomal" :key="`${indexs}`" class="content-parent">
              <div class="content-type" :class="'type-'+m.type">
                <span v-if="m.flupStateId=='Waiting' && !m.isDeleted" class="edit" @click="editPlan(m)">
                  <img height="14" width="14" src="~@/assets/images/edit-deep.png" />
                </span>
                <span @click="toHealthArchives(m)">{{ m.flupContent }}</span>
              </div>
              <span v-if="m.flupStateId=='Overdue' && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/overdue.png" />
              </span>
              <span v-else-if="m.flupStateId=='Finished'&&m.authState!=30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/finish1.png" />
              </span>
              <span v-else-if="m.authState==30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/cancel.png" />
              </span>
              <span v-else-if="m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/expired.png" />
              </span>
            </div>
          </div>
        </el-row>
        <el-row class="row first-line" type="flex">
          <div class="headline">
            <div class="text">检查</div>
          </div>
          <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <div v-for="(m, indexs) in item.jiancha" :key="`${indexs}`" class="content-parent">
              <div class="content-type" :class="'type-'+m.type">
                <span v-if="m.flupStateId=='Waiting'&& !m.isDeleted" class="edit" @click="editPlan(m)">
                  <img height="14" width="14" src="~@/assets/images/edit-deep.png" />
                </span>
                <span @click="toHealthArchives(m)">
                  <span v-for="(n,indexjc) in m.dqjcjyList" :key="indexjc">
                    <span v-if="indexjc==m.dqjcjyList.length-1">{{n.examItemName}}【{{n.examBodyName}}】</span>
                    <span v-else>{{n.examItemName}}【{{n.examBodyName}}】,</span>
                  </span>
                </span>
              </div>
              <span v-if="m.flupStateId=='Overdue' && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/overdue.png" />
              </span>
              <span v-else-if="m.flupStateId=='Finished'&&m.authState!=30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/finish1.png" />
              </span>
              <span v-else-if="m.authState==30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/cancel.png" />
              </span>
              <span v-else-if="m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/expired.png" />
              </span>
            </div>
          </div>
        </el-row>
        <el-row class="row first-line" type="flex">
          <div class="headline bg">
            <div class="text">检验</div>
          </div>
          <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <div v-for="(m, indexs) in item.jianyan" :key="`${indexs}`" class="content-parent">
              <div class="content-type" :class="'type-'+m.type">
                <span v-if="m.flupStateId=='Waiting'&& !m.isDeleted" class="edit" @click="editPlan(m)">
                  <img height="14" width="14" src="~@/assets/images/edit-deep.png" />
                </span>
                <span @click="toHealthArchives(m)">
                  <span v-for="(n,indexjy) in m.dqjcjyList" :key="indexjy">
                    <span v-if="indexjy==m.dqjcjyList.length-1">{{n.ylmc}}【{{n.sampledescribe}}】</span>
                    <span v-else>{{n.ylmc}}【{{n.sampledescribe}}】,</span>
                  </span>
                </span>
              </div>
              <span v-if="m.flupStateId=='Overdue' && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/overdue.png" />
              </span>
              <span v-else-if="m.flupStateId=='Finished'&&m.authState!=30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/finish1.png" />
              </span>
              <span v-else-if="m.authState==30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/cancel.png" />
              </span>
              <span v-else-if="m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/expired.png" />
              </span>
            </div>
          </div>
        </el-row>
        <el-row class="row first-line" type="flex">
          <div class="headline">
            <div class="text">新增</div>
          </div>
          <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}`">
            <div v-for="(m, indexs) in item.new" :key="`${indexs}`" class="content-parent">
              <div class="content-type" :class="'type-'+m.type">
                <span v-if="m.flupStateId=='Waiting'&& !m.isDeleted" class="edit" @click="editPlan(m)">
                  <img height="14" width="14" src="~@/assets/images/edit-deep.png" />
                </span>
                <span @click="toHealthArchives(m)" v-if="m.flupType=='定期检查'">
                  <span v-for="(n,indexjc) in m.dqjcjyList" :key="indexjc">
                    <span v-if="indexjc==m.dqjcjyList.length-1">{{n.examItemName}}【{{n.examBodyName}}】</span>
                    <span v-else>{{n.examItemName}}【{{n.examBodyName}}】,</span>
                  </span>
                </span>
                <span @click="toHealthArchives(m)" v-else-if="m.flupType=='定期检验'">
                  <span v-for="(n,indexjy) in m.dqjcjyList" :key="indexjy">
                    <span v-if="indexjy==m.dqjcjyList.length-1">{{n.ylmc}}【{{n.sampledescribe}}】</span>
                    <span v-else>{{n.ylmc}}【{{n.sampledescribe}}】,</span>
                  </span>
                </span>
                <span @click="toHealthArchives(m)" v-else>{{ m.flupContent }}</span>
              </div>
              <span v-if="m.flupStateId=='Overdue' && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/overdue.png" />
              </span>
              <span v-else-if="m.flupStateId=='Finished'&&m.authState!=30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/finish1.png" />
              </span>
              <span v-else-if="m.authState==30 && !m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/cancel.png" />
              </span>
              <span v-else-if="m.isDeleted" class="status">
                <img height="14" width="14" src="~@/assets/images/expired.png" />
              </span>
            </div>
          </div>
        </el-row>
      </div>
    </div>

    <div class="bottom">
      <el-button type="primary" @click="delay">一键延期</el-button>
      <el-button type="default" @click="showLog">查看变更日志</el-button>
      <el-button type="primary" @click="createPlan" v-if="!expired">新增随访计划</el-button>
    </div>
    <component v-if="dialogVisible" :is="dialogComponent" :show.sync="dialogVisible" v-bind="dialogData"></component>
    <el-dialog title="日志" :visible.sync="dialogTableVisible" class="plan-dialog" width="780px">
      <el-table :data="logList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="80">
          <template slot-scope="scope">{{$utils.getDeptNameByQu(scope.row.operationType,operationList)}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="100"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
        <el-button type="success" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="任务延期" :visible.sync="dialogDelayVisible" width="20%" :before-close="delayClose">
      <div class="delay-content">
        <div class="delay-content-title"><span>*</span>延期天数</div>
        <el-input-number v-model="dealyNum"  :min="1" :precision="0"></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delayClose">取 消</el-button>
        <el-button type="primary" @click="delayConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import idcard from "idcard";
import NewTask from "@/pagesTransfer/followup/patient_plan/newTask";
const typeText = [
  "健康宣教",
  "问卷调查",
  "专科随访",
  "定期复查",
  "定期检查",
  "定期检验",
  "消息提醒",
  "评估报告",
];
export default {
  data() {
    return {
      dialogDelayVisible: false,
      dealyNum: 1,
      baseInfo: [
        { key: "姓名", value: "陈吴迪" },
        { key: "病案号", value: "234562" },
        {
          key: "出院诊断",
          value: "：乳腺癌乳腺癌乳腺癌乳腺癌乳腺癌乳腺癌乳腺癌",
        },
        { key: "内容1", value: "内容内容内容内容内容内容内容内容" },
        { key: "内容2", value: "内容内容内容内容内容内容" },
        {
          key: "内容3",
          value: "陈内容内容内容内容内容内容内容内容内容内容吴迪",
        },
      ],
      baseInfoValue: {},
      showMore: false,
      checkAll: true,
      // typeData: ['健康宣教', '问卷调查', '专科随访', '定期复查', '定期检查', '定期检验', '消息提醒', '评估报告'],
      typeData: [],
      typeList: [],
      isIndeterminate: false,
      checkedList: [],
      inhospitalData: [
        {
          date: "2021-01-12",
          nomal: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "1" },
            { content: "3陈内容内容内容内容内容", type: "3", status: "2" },
          ],
          jiancha: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "2" },
            { content: "5陈内容内容内容内容内容", type: "5", status: "-1" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "-1" },
          ],
          new: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          days: 1,
        },
        {
          date: "2021-01-13",
          nomal: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "1" },
            { content: "3陈内容内容内容内容内容", type: "3", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          jiancha: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "2" },
          ],
          jianyan: [],
          new: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          days: 2,
        },
        {
          date: "2021-01-14",
          nomal: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "3陈内容内容内容内容内容", type: "3", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          jiancha: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "2" },
            { content: "5陈内容内容内容内容内容", type: "5", status: "-1" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "-1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "2" },
          ],
          new: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
          ],
          days: 7,
        },
        {
          date: "2021-01-15",
          nomal: [
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          jiancha: [
            { content: "5陈内容内容内容内容内容", type: "5", status: "-1" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
          ],
          new: [
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "2" },
          ],
          days: 10,
        },
        {
          date: "2021-01-16",
          nomal: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          jiancha: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "2" },
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "-1" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "-1" },
          ],
          new: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
          ],
          days: 30,
        },
        {
          date: "2021-01-17",
          nomal: [
            { content: "2陈内容内容内容内容内容", type: "2", status: "1" },
          ],
          jiancha: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "2" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "-1" },
          ],
          new: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
            { content: "5陈内容内容内容内容内容", type: "5", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          days: 90,
        },
        {
          date: "2021-01-18",
          nomal: [
            { content: "1陈内容内容内容内容内容", type: "1", status: "-1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "1" },
          ],
          jiancha: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "6陈内容内容内容内容内容", type: "6", status: "2" },
          ],
          jianyan: [
            { content: "3陈内容内容内容内容内容", type: "3", status: "1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "-1" },
            { content: "7陈内容内容内容内容内容", type: "7", status: "2" },
          ],
          new: [
            { content: "8陈内容内容内容内容内容", type: "8", status: "-1" },
            { content: "2陈内容内容内容内容内容", type: "2", status: "2" },
            { content: "4陈内容内容内容内容内容", type: "4", status: "1" },
          ],
          days: 120,
        },
      ],
      inhospitalDataTotal: [],
      pageIndex: 1,
      maxIndex: null,
      search: {
        flupPlanId: "",
        searchKey: "userId",
        searchVal: "",
        searchTimeKey: "admissionDatetime",
        searchTimeVal: null,
        smartFlupMethodId: "",
        flupStateId: "All",
        flupType: "",
        patientTypeCode: "",
        userId: "",
      },
      dialogVisible: false,
      dialogComponent: "",
      dialogData: null,
      dialogTableVisible: false,
      logList: [],
      operationList: [
        {
          Text: "全部",
          Value: null,
        },
        {
          Text: "增加",
          Value: 1,
        },
        {
          Text: "修改",
          Value: 2,
        },
        {
          Text: "删除",
          Value: 3,
        },
        {
          Text: "查询",
          Value: 4,
        },
        {
          Text: "执行随访任务",
          Value: 5,
        },
        {
          Text: "其他",
          Value: 6,
        },
        {
          Text: "作废任务",
          Value: 7,
        },
      ],
      startIndex: 0,
      expired: false,
    };
  },
  components: {
    NewTask,
  },
  watch: {},
  created() {
    // sessionStorage.setItem('global', JSON.stringify({ hospital_id: '1118033010334208499' }));
    this.getTypeList();
    this.getList();
    this.getExpired();
  },
  methods: {
    getExpired() {
      if (this.$route.query.expired) {
        if (this.$route.query.expired == "true") {
          this.expired = true;
        }
      }
    },
    handleCheckAllChange(val) {
      console.log(val);
      this.checkedList = val ? this.typeList : [];
      this.isIndeterminate = false;
      if (val) {
        this.search.flupType = "";
      } else {
        this.search.flupType = "null";
      }
      this.getList();
    },
    chooseOne(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.typeData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.typeData.length;
      if (value.length > 0) {
        this.search.flupType = value.join(",");
      } else {
        this.search.flupType = "null";
      }

      this.getList();
    },
    moreData() {
      this.showMore = !this.showMore;
    },
    changeTablePage(type) {
      if (type == "pre") {
        this.startIndex = this.startIndex - 1;
      } else {
        this.startIndex = this.startIndex + 1;
      }
      // console.log(this.pageIndex * 7 - 7, this.pageIndex * 7);
      this.inhospitalData = this.inhospitalDataTotal.slice(
        this.startIndex,
        this.startIndex + 7
      );
    },
    createPlan() {
      // this.editForm = false;
      // this.form = {
      //   name: '',
      //   type: '',
      //   date: '',
      //   content: '',
      //   days: '',
      //   path: '',
      // };
      // this.dialogFormVisible = true;
      this.dialogVisible = true;
      this.dialogComponent = this.$options.components.NewTask;
      this.dialogData = {
        flupPlan: this.$route.query.flupPlan,
        planNameId: this.$route.query.flupPlanId,
        fuRuleId: this.$route.query.fuRuleId,
        fuWay: "2",
        oldTaskSerialNo: this.$route.query.serialNo,
        edit: false,
        editData: {},
      };
    },
    editPlan(item) {
      // this.editForm = true;
      // this.dialogFormVisible = true;
      this.dialogVisible = true;
      this.dialogComponent = this.$options.components.NewTask;
      this.dialogData = {
        flupPlan: this.$route.query.flupPlan,
        planNameId: this.$route.query.flupPlanId,
        fuRuleId: this.$route.query.fuRuleId,
        fuWay: "2",
        oldTaskSerialNo: this.$route.query.serialNo,
        edit: true,
        editData: item,
      };
    },
    toHealthArchives(row) {
      this.$router.push(
        `/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${
          row.sex
        }&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
          row.phone
        }&dateTime=${this.$utils.formatDate(
          row.createTime
        )}&dischargeDate=${this.$utils.formatDate(
          row.dischargeDatetime
        )}&recordSerialNo=${row.recordSerialNo}&joinPlanPatientType=${
          this.patientTypeTc
        }&flupPlanId=${this.search.flupPlanId}&prop=${
          this.$route.query.prop
        }&order=${this.$route.query.order}&fromPlan=true&serialNo=${
          row.serialNo
        }`
      );
    },
    handleChangeNumber() {},
    getTypeList() {
      this.$apis
        .queryFollowTypeList(
          JSON.parse(sessionStorage.getItem("global")).hospital_id
        )
        .then((res) => {
          this.typeData = res.list.filter((item) => {
            return item.enable != 0;
          });
          this.typeList = [];
          this.typeData.forEach((i) => {
            this.typeList.push(i.name);
          });
          this.checkedList = this.typeList;
        });
    },
    getList() {
      this.$apis
        .columnqueryPageColumnConfigDisplay({
          page: "慢病随访",
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.modules = res.modules;
          // console.log(res);
          this.baseInfo = [];
          res.modules.forEach((i) => {
            i.columns.forEach((m) => {
              if (m.sortOrder) {
                this.baseInfo.push(m);
              }
            });
          });
          this.baseInfo.sort(this.compare("sortOrder"));
          // console.log(this.baseInfo);
          // this.alllist = res.baseColumns;
        });
      this.search.flupPlanId = this.$route.query.flupPlanId;
      this.search.patientTypeCode = this.$route.query.joinPlanPatientType;
      // this.search.searchKey = this.$route.query.name;
      this.search.searchVal = this.$route.query.userId;
      let query = { ...this.search };
      // console.log(this.$route);
      this.$apis
        .getFlupPlanPatientListV2({
          ...query,
          "sort.prop": this.$route.query.prop, //this.sort.prop,
          "sort.order": this.$route.query.order, //this.sort.order,
          recordSerialNo: this.$route.query.recordSerialNo,
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
          pageNo: 1,
          pageSize: 10,
          type: 1,
        })
        .then((res) => {
          // console.log(res);
          this.baseInfoValue = res.basicInfo;
          this.inhospitalDataTotal = res.sortedList || [];
          this.maxIndex = Math.ceil(this.inhospitalDataTotal.length / 7);
          this.inhospitalDataTotal.forEach((i) => {
            i.nomal = [];
            i.jiancha = [];
            i.jianyan = [];
            i.new = [];
            if (i.data) {
              i.data.forEach((n) => {
                n.type = null;
                switch (n.flupType) {
                  case "健康宣教":
                    n.type = "1";
                    break;
                  case "调查问卷":
                    n.type = "2";
                    break;
                  case "专科随访":
                    n.type = "3";
                    break;
                  case "定期复诊":
                    n.type = "4";
                    break;
                  case "定期检查":
                    n.type = "5";
                    break;
                  case "定期检验":
                    n.type = "6";
                    break;
                  case "消息提醒":
                    n.type = "7";
                    break;
                  case "慢病评估报告":
                    n.type = "8";
                    break;
                }
                if (n.flupType == "定期检查") {
                  n.dqjcjyList = [];
                  if (n.flupContent.indexOf(",") != -1) {
                    let jcListDatas = n.flupContent.split(",");
                    jcListDatas.forEach((m) => {
                      let arrjc = m.split("|");
                      n.dqjcjyList.push({
                        examTypeId: arrjc[1],
                        examTypeName: arrjc[0],
                        examBodyId: arrjc[3],
                        examBodyName: arrjc[2],
                        examItemId: arrjc[5],
                        examItemName: arrjc[4],
                        type: true,
                      });
                    });
                  } else {
                    let jcList = n.flupContent.split("|");
                    n.dqjcjyList.push({
                      examTypeId: jcList[1],
                      examTypeName: jcList[0],
                      examBodyId: jcList[3],
                      examBodyName: jcList[2],
                      examItemId: jcList[5],
                      examItemName: jcList[4],
                      type: true,
                    });
                  }
                  if (n.intoGroupWay == 2) {
                    i.new.push(n);
                  } else {
                    i.jiancha.push(n);
                  }
                } else if (n.flupType == "定期检验") {
                  n.dqjcjyList = [];
                  if (n.flupContent.indexOf(",") != -1) {
                    let jyListDatas = n.flupContent.split(",");
                    jyListDatas.forEach((m) => {
                      let arrjy = m.split("|");
                      n.dqjcjyList.push({
                        ylmc: arrjy[0],
                        autoid1: arrjy[1],
                        autoid2: arrjy[3],
                        sampledescribe: arrjy[2],
                        type: true,
                      });
                    });
                  } else {
                    let jyList = n.flupContent.split("|");
                    n.dqjcjyList.push({
                      ylmc: jyList[0],
                      autoid1: jyList[1],
                      autoid2: jyList[3],
                      sampledescribe: jyList[2],
                      type: true,
                    });
                  }
                  if (n.intoGroupWay == 2) {
                    i.new.push(n);
                  } else {
                    i.jianyan.push(n);
                  }
                } else {
                  i.nomal.push(n);
                }
              });
            }
          });
          if (this.maxIndex > 1) {
            //定位至最近记录
            let today = this.$utils.formatDate(new Date());
            let todayIndex = this.inhospitalDataTotal.findIndex((i) => {
              return i.flupDate == today;
            });
            //当天有记录
            if (todayIndex != -1) {
              this.startIndex = todayIndex;
              this.inhospitalData = this.inhospitalDataTotal.slice(
                todayIndex,
                todayIndex + 7
              );
            } else {
              //当天没记录
              var daysList = [];
              this.inhospitalDataTotal.forEach((i) => {
                daysList.push(
                  this.$utils.GetDateDiff(i.flupDate, today, "day")
                );
              });
              var min = Math.min.apply(null, daysList);
              // console.log(min, daysList.indexOf(min));
              this.startIndex = daysList.indexOf(min);
              this.inhospitalData = this.inhospitalDataTotal.slice(
                daysList.indexOf(min),
                daysList.indexOf(min) + 7
              );
            }
          } else {
            this.startIndex = 0;
            this.inhospitalData = this.inhospitalDataTotal;
          }
          // console.log(this.inhospitalData);
        });
    },
    showLog() {
      this.dialogTableVisible = true;
      this.getLogList();
    },
    delay() {
      this.dialogDelayVisible = true
    },
    delayClose() {
      this.dialogDelayVisible = false
      this.dealyNum = 1
    },
    delayConfirm() {
      let params = {
        userId: this.$route.query.userId,
        flupPlanId: this.$route.query.flupPlanId,
        offsetDay: this.dealyNum
      }
      this.$apis.offsetDayPatientWaitingPlan(params).then(res => {
          this.$message({
            message: `更新了${res}条计划`,
            type: "success"
          });
          this.dialogDelayVisible = false
          this.dealyNum = 1
          this.getList();
      })
    },
    getLogList() {
      this.$apis
        .systemManagequeryOperationLogList({
          pageNo: 1,
          pageSize: 10,
          userId: this.$route.query.userId,
          flupPlanId: this.$route.query.flupPlanId,
          recordSerialNo: this.$route.query.recordSerialNo,
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
        })
        .then((res) => {
          this.logList = res.list;
          // this.total = res.total;
        });
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];

        var value2 = b[property];

        return value1 - value2;
      };
    },
  },
};
</script>
<style lang="scss">
.chronic-disease {
  .plan-dialog {
    .el-form {
      .el-form-item {
        display: flex;
        width: 100%;
        .el-form-item__label {
          margin-right: 16px;
          padding: 0;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          line-height: 17px;
          text-align: right;
          letter-spacing: 0px;
          color: #333333;
          margin-top: 10px;
          width: 70px;
        }
        .el-form-item__content {
          width: 100%;
          .el-date-editor {
            width: 100%;
          }
          .el-input-number.el-input-number--small .el-input__inner,
          .el-input--small .el-input__inner,
          .el-range-editor--small.el-input__inner {
            height: 38px;
          }
          .el-input-number.el-input-number--small {
            line-height: 36px;
          }
        }
      }
    }
  }
  .delay-content {
    .el-input-number.el-input-number--small .el-input__inner, .el-input--small .el-input__inner, .el-range-editor--small.el-input__inner  {
      height: 32px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.chronic-disease {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f6f6f6;
  .delay-content {
    display: flex;
    align-items: center;
    justify-content: center;
    &-title {
      margin-right: 20px;
      span {
        color: #f56c6c;
      }
    }
  }
  .main {
    background: #fff;
    padding: 20px 24px;
    flex: 1 0 auto;
    .base-info {
      background: #fbfbfb;
      line-height: 17px;
      padding: 16px 40px 16px 12px;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      color: #333333;
      font-weight: 600;
      position: relative;
      opacity: 1;
      .base-info-detail {
        span {
          margin-right: 36px;
        }
      }
      .fold-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
    .limit {
      height: 50px;
      .base-info-detail {
        height: 100%;
        overflow: hidden;
      }
    }
    .type-area {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;

      color: #111111;
      .group {
        .short-line {
          display: inline-block;
          width: 4px;
          height: 14px;
          margin-top: 3px;
          vertical-align: top;
        }
      }
    }
    .color-1,
    .type-1:hover {
      background: #b5b5e5 !important;
    }
    .color-2,
    .type-2:hover {
      background: #8ebffd !important;
    }
    .color-3,
    .type-3:hover {
      background: #80d8ad !important;
    }
    .color-4,
    .type-4:hover {
      background: #f3bcd5;
    }
    .color-5,
    .type-5:hover {
      background: #f6be96 !important;
    }
    .color-6,
    .type-6:hover {
      background: #80dcdf !important;
    }
    .color-7,
    .type-7:hover {
      background: #f7a2a2 !important;
    }
    .color-8,
    .type-8:hover {
      background: #faf873 !important;
    }
    .main-table {
      padding-top: 4px;
      .first-line {
        // border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        text-align: center;
        position: sticky;
        z-index: 1000;
        top: 0px;
        background: white;
        font-weight: bold;
        font-size: 14px;
        display: flex;
        .headline {
          flex-grow: 0;
          flex-basis: 80px;
          position: relative;
          color: #333333;
          border-left: 1px solid #e6e6e6;
          &:nth-child(0) {
            background: #eaf0f9;
          }
          .text {
            height: 100%;
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: normal;
            line-height: 17px;
            letter-spacing: 0px;
            color: #333333;
            font-weight: 600;
          }
        }
        .bg {
          background: #fbfcfe;
          // box-shadow: inset -0.5px 0px 0px 0px #e5e5e5, inset 1px 0px 0px 0px #e5e5e5, inset 0px 1px 0px 0px #e5e5e5, inset 0px -0.5px 0px 0px #e5e5e5;
        }
        .col {
          color: #111;
        }
        // background-color: #909399;
        &:first-child {
          height: 40px;
          border-top: 1px solid #e6e6e6;
        }
      }
      .col2 {
        color: #111111;
        // padding: 8px 8px 0 8px;
        flex: 1;
        display: table-cell;
        min-height: 27px;
        border-left: 1px solid #e6e6e6;
        position: relative;
        .text {
          height: 100%;
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: center;
        }
        .pre-page {
          width: 30px;
          border-right: 1px solid #e6e6e6;
          display: inline-block;
          height: 40px;
          left: 0px;
          position: absolute;
        }
        .next-page {
          width: 30px;
          border-left: 1px solid #e6e6e6;
          display: inline-block;
          height: 40px;
          right: 0px;
          position: absolute;
        }
        img {
          margin-top: 11px;
        }
        .date {
          margin-top: 10px;
          display: inline-block;
        }
        &:last-child {
          border-right: 1px solid #e6e6e6;
        }
      }
      .col {
        color: #111111;
        padding: 8px 8px 0 8px;
        flex: 1;
        display: table-cell;
        min-height: 27px;
        border-left: 1px solid #e6e6e6;
        width: 13%;
        .content-parent {
          position: relative;
          .content-type {
            // display: inline-block;
            border-radius: 4px;
            // height: 28px;
            padding: 6px 10px;
            line-height: 17px;
            margin-bottom: 10px;
            // word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            // &:last-child {
            //   margin-bottom: 0px;
            // }

            .edit {
              display: none;
            }
          }
          .status {
            position: absolute;
            top: -8px;
            right: -8px;
          }
        }

        .content-type:hover {
          white-space: initial;
          cursor: pointer;
          white-space: normal;
          .edit {
            display: inline-block !important;
            cursor: pointer;
          }
        }

        .type-1 {
          background: #ededff;
          border: 0.5px solid #9897de;
        }
        .type-2 {
          background: #e5f0ff;
          border: 0.5px solid #4e97f5;
        }
        .type-3 {
          background: #e2fcef;
          border: 0.5px solid #5bc893;
        }
        .type-4 {
          background: #fff1f8;
          border: 0.5px solid #eb99bf;
        }
        .type-5 {
          background: #fff2ea;
          border: 0.5px solid #f4b588;
        }
        .type-6 {
          background: #eafeff;
          border: 0.5px solid #6ad4d8;
        }
        .type-7 {
          background: #fff0f0;
          border: 0.5px solid #f38f8f;
        }
        .type-8 {
          background: #fdfdec;
          border: 0.5px solid #e7e436;
        }
        .yz-ul {
          li:nth-of-type(n + 6) {
            display: none !important;
          }
        }
        &:last-child {
          border-right: 1px solid #e6e6e6;
        }
      }
    }
  }
  .bottom {
    margin-top: 15px;
    flex: 0 0 auto;
    height: 66px;
    background: #fff;
    padding: 13px 20px;
    width: 100%;
    text-align: right;
    .el-button {
      width: 98px;
      height: 40px;
      padding: 10px 7px;
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      border-radius: 4px;
    }
  }
  .plan-dialog {
    .el-form {
      .el-form-item {
        margin-bottom: 18px;
        display: flex;
        width: 100%;
        .el-form-item__label {
          width: 70px;
          margin-right: 16px;
        }
        .el-form-item__content {
          width: 100%;
        }
      }
    }
  }
}
</style>
