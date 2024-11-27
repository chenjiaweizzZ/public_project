//健康档案
<template>
  <section class="health_monitor" v-on:click.stop="closeCur">
    <div class="test">
      <div style="padding-bottom: 50px;" class="health_monitor_wrapper">
        <div class="health_monitor_aside" style="padding: 0px; background-color: #fff">
          <div class="padding20 bgcolor-fb border-bottom1">
            <div>
              <span class="color-111 font-size2 bold">{{
                $route.query.name || "-" | hideInfo("name")
              }}</span>
              <span class="color-111 margin-left20">{{
                $route.query.sex || "-"
              }}</span>
              <span class="color-111 margin-left20">{{
                $route.query.age || "-"
              }}</span>
              <!-- <span class="color-111 margin-left20">
                <el-button type="text" @click="viewDischarge">病程记录</el-button>
              </span> -->
            </div>
            <div style="display: flex;flex-wrap: wrap;align-items: center;">
              <el-tag type="success" effect="plain" style="margin:4px;border-color:#32AE57;" closable v-for="crowd in curCrowdTypeList" :key="crowd.dict_code" @close="deleteCrow(crowd)">{{ crowd.dict_name }}</el-tag>
              <i style="color: #0283ef; font-size: 17px; font-weight: 600" class="el-icon-circle-plus-outline" @click.stop="filterCrow"></i>
            </div>
            <div id="crowEnable" v-if="addCrowEnable">
              <el-input class="width200px value" v-model="keyValue" placeholder="请输入" clearable>
                <el-button slot="append" icon="el-icon-search" @click="filterCrow"></el-button>
              </el-input>
              <div class="optForTagBox">
                <div>
                  <el-tag type="success" effect="plain" style="margin:4px;border-color:#32AE57;" @click="addCrow(crow)" v-for="crow in othCrowdTypeList" :key="crow.dict_code">{{ crow.dict_name }}</el-tag>
                </div>
              </div>
            </div>
            <div class="margin-top16 piList">
              <span class="color-666">联系电话</span>
              <span class="color-111 margin-left20">{{
                $route.query.phone || "-" | hideInfo("phone")
              }}</span>
            </div>
            <div class="margin-top16 piList">
              <span class="color-666">入组时间</span>
              <span class="color-111 margin-left20">{{
                $route.query.dateTime || "-"
              }}</span>
            </div>
            <div class="margin-top16 piList">
              <div class="piList_options">
                <span class="remark" @click="openRemark">
                  <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 3px;" src="~@/assets/images/icon/edit.png" alt />
                  <el-button type="text">备注</el-button>
                </span>
                <!-- <span class="remark" @click="upAudio">上传录音</span> -->
                <el-upload ref="upload" :action="$baseURL.ICDMApiUrl + '/file/upload'" :show-file-list="false" :on-success="(res) => handleAvatarSuccess(res)" :before-upload="beforeAvatarUpload" class="list-btns__upload">
                  <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 7px;" src="~@/assets/images/icon/audio-upload.png" alt />
                  <el-button type="text"  :title="types">上传文件</el-button>
                </el-upload>
                <span class="remark options_remark">
                  <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 3px;" src="~@/assets/images/icon/op-log.png" alt />
                  <el-button type="text" @click="getOperation">操作记录</el-button>
                </span>
              </div>
              <!-- <div
                class="color-111 remarkOne"
                v-if="remarks.length && !remarkIsOpen"
                >
                <div v-if="remarks[0].remarkType == 2">
                  <audio  controls>
                        <source :src="remarks[0].remarkUrl" type="audio/Wav" />
                        <embed height="100" width="100" :src="remarks[0].remarkUrl" />
                  </audio>
                </div>
                  <span v-else>
                    {{ remarks[0].createTime + " " + remarks[0].remarkContent }}
                  </span>
                </div> -->
            </div>
            <div class="margin-top16 remarkContent">
              <el-input type="textarea" autosize placeholder="请输入内容" v-model="textareaRemark" @blur="newRemark" v-if="remarkIsOpen">
              </el-input>
              <div class="remarkList" v-for="(item, index) in remarks" :key="index">
                <section v-if="remarkIsOpen || index == 0">
                  <div class="remarkTime">
                    {{ item.createTime }}
                    <el-button type="text" @click="editRemark(item,index)">编辑</el-button>
                    <span @click="deleteRemark(item.remarkId)" class="remark-del">删除</span>
                  </div>
                  <el-input type="textarea" autosize placeholder="请输入内容" v-model="item.remarkContent2" @blur="editRemarkSave(item)" v-if="index === editIndex && item.remarkType == 1">
                  </el-input>
                  <div v-else-if="item.remarkType == 2" class="audio-line">
                    <!-- <audio  :src="item.remarkUrl" controls controlsList="nodownload noplaybackrate">
                        <source :src="item.remarkUrl" type="audio/Wav" />
                        <embed height="100" width="100" :src="item.remarkUrl" />
                  </audio> -->
                    <span :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</span>
                    <img style="width: 20px; height: 20px; margin-right: 10px;position: relative;bottom: 5px;" src="~@/assets/images/bf.png" alt @click="play(item.remarkUrl)" />
                  </div>
                  <div v-else-if="item.remarkType == 3" class="audio-line audio-line2">
                    <div class="demo-image__preview">
                      <el-image style="width: 100px; height: 100px" :src="item.remarkUrl" :preview-src-list="srcList">
                      </el-image>
                    </div>
                    <div :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</div>
                    <!-- <el-button type="text" class="v1ew" @click="viewPic(item)">查看图片</el-button> -->
                    <!-- <img style="width: 20px; height: 20px; margin-right: 10px;position: relative;bottom: 5px;" src="~@/assets/images/bf.png" alt @click="play(item.remarkUrl)" /> -->
                  </div>
                  <div v-else-if="item.remarkType == 4" class="audio-line">
                    <span :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</span>
                    <img style="width: 20px; height: 20px; margin-right: 10px;position: relative;bottom: 5px;" src="~@/assets/images/v1ew.png" alt @click="viewFile(item)" />
                  </div>
                  <div class="remarkDetail" v-else>{{ item.remarkContent }}</div>
                  <el-button type="text" @click="topRemark(item)" v-if="item.isTop">取消置顶</el-button>
                  <el-button type="text" @click="topRemark(item)" v-else>置顶</el-button>
                </section>
              </div>
            </div>
            <div class="more" v-if="remarks.length > 1">
              <span class="more-box" @click="openRemark" v-if="remarkIsOpen">
                <span class="more-text">收起</span>
                <i class="el-icon-arrow-up"></i>
              </span>
              <span class="more-box" @click="openRemark" v-else>
                <span class="more-text">更多</span>
                <i class="el-icon-arrow-down"></i>
              </span>

            </div>
            <!-- <div
              class="margin-top16"
              style="display: flex;align-items: center;justify-content: space-between;"
            >
              <span class="color-666">综合配合度</span>
              <span>
                <el-rate :value="patientInfo.coordination" disabled></el-rate>
              </span>
            </div>-->
          </div>
          <div class="margin-top20">
            <el-menu :default-active="currentComponent" @select="openMenu">
              <el-menu-item index="PatientInfo">个人档案</el-menu-item>
              <!-- <el-menu-item :disabled="conceal" index="Report">评估报告</el-menu-item> -->
              <el-menu-item index="Report">评估报告</el-menu-item>
              <el-menu-item index="viewPatientPlan">随访任务</el-menu-item>
              <el-menu-item :disabled="conceal" index="healthMonitor">健康监测</el-menu-item>

              <!-- <el-menu-item :disabled="conceal" index="Medication">用药指导</el-menu-item>
              <el-menu-item :disabled="conceal" index="Sport">运动方案</el-menu-item>
              <el-menu-item :disabled="conceal" index="Diet">饮食建议</el-menu-item> -->

              <el-menu-item index="Medication">用药指导</el-menu-item>
              <el-menu-item index="Sport">运动方案</el-menu-item>
              <el-menu-item index="Diet">饮食建议</el-menu-item>

              <el-menu-item :disabled="conceal" index="Message">发送消息</el-menu-item>
            </el-menu>
          </div>
        </div>
        <div style="margin: 0 auto" v-if="type == 'Report' && !isSelect">
          <img style="height: 212px; width: 160px" src="~@/assets/images/empty.png" />
        </div>
        <div v-else-if="type == 'Report'" class="health_monitor_main">
          <component :is="currentComponent" :contentJson="contentJson" :huanzheVisible="huanzheVisible" :serialNo="serialNo"></component>
        </div>
        <div v-else-if="type == 'viewPatientPlan'" class="health_monitor_main">
          <component :is="currentComponent" :huanzheVisible="huanzheVisible" :serialNo="newSerialNo"></component>
        </div>
        <div v-else class="health_monitor_main">
          <component :is="currentComponent" :huanzheVisible="huanzheVisible" :serialNo="serialNo"></component>
        </div>
      </div>
    </div>
    <operation-log ref="dialogPackage" :tableData="tableData"></operation-log>
    <el-dialog title="编辑备注" :visible.sync="editFileName" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入备注名称" v-model="filename">
          <!-- <template slot="append">{{ fileRemark.suffix }}</template> -->
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="editFileRemarkSave">确 定</el-button>
      </span>
    </el-dialog>
    <div class="audio-box" v-if="recordUrl">
      <audio :src="recordUrl" controls="controls" ref="recordAudio" controlsList="nodownload noplaybackrate">
        <source :src="recordUrl" type="audio/Wav" />
        <embed height="100" width="100" :src="recordUrl" />
      </audio>
      <span class="audio-close" @click="playClose">
        <i class="el-icon-close"></i>
      </span>
    </div>
  </section>
</template>

<script>
import PatientInfo from "./components/patient_info";
import Medication from "./components/medication";
import Diet from "./components/diet";
import Sport from "./components/sport";
import Report from "./components/report";
import healthMonitor from "./components/healthMonitor";
import Message from "./components/message";
import viewPatientPlan from "../../../pagesTransfer/followup/patient_plan/index";
import operationLog from "./components/operationLog";
import { Base64 } from "js-base64";
export default {
  name: "health_archives",
  data() {
    return {
      userId: "",
      huanzheVisible: true,
      currentComponent: "PatientInfo",
      remarkIsOpen: false,
      isSelect: false,
      type: null,
      conceal: this.$route.query.conceal ? true : false,
      contentJson: "",
      crowdTypeList: [],
      curType: [],
      curCrowdTypeList: [],
      othCrowdTypeList: [],
      remarks: [],
      patientInfo: {},
      addCrowEnable: false,
      updateCur: false,
      keyValue: "",
      fromPlan: false,
      serialNo: "",
      textareaRemark: "",
      newSerialNo: "",
      editIndex: "",
      tableData: [],
      recordUrl: "",
      dischargeList: [],
      url: "",
      srcList: [],
      editFileName: false,
      filename: "",
      fileRemark: {
        suffix: "",
      },
      types: '.mp3 .wav .jpeg .jpg .png .pdf .docx .doc .xlsx .xls'
    };
  },
  provide() {
    // 在爷爷组件中提供一个方法
    return {
      callBack: this.newOpenMenu,
    };
  },
  components: {
    PatientInfo,
    Medication,
    Report,
    viewPatientPlan,
    healthMonitor,
    Diet,
    Sport,
    Message,
    operationLog,
  },
  async created() {
    await this.$apis
      .BaseDictGetDictItems({
        keyWord: "",
        parentId: "20170915191220011928",
      })
      .then((res) => {
        this.crowdTypeList = res;
      });
    this.getDischargeList();
  },
  watch: {
    curCrowdTypeList() {
      // this.addCrowEnable = fasle
      var dics = this.curCrowdTypeList.map((x) => x.dict_code);
      this.othCrowdTypeList = this.crowdTypeList.filter(
        (x) => !dics.includes(x.dict_code)
      );
      this.curType = this.curCrowdTypeList.map((x) => x.dict_code);
      if (this.updateCur) {
        this.$apis
          .editPatientCrowdType({
            userId: this.$route.query.userId,
            crowdType: this.curType.join(","),
          })
          .then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: "人群标签更新成功",
              });
            }
          });
        if (this.addCrowEnable) this.addCrowEnable = false;
      }
    },
  },
  mounted() {
    let userId = this.$route.query.userId;
    this.userId = this.$route.query.userId;
    this.$apis.getEmrPatientBaseInfo({ userId }).then((res) => {
      this.patientInfo = res;
      // if (res.crowdType) {
      this.curType = res.crowdType ? res.crowdType.split(",") : [];
      this.curCrowdTypeList = this.crowdTypeList.filter((x) =>
        this.curType.includes(x.dict_code)
      );
      this.othCrowdTypeList = this.crowdTypeList.filter(
        (x) => !this.curType.includes(x.dict_code)
      );
      // }
    });
    this.getRemarkList();
    this.fromPlan = this.$route.query.fromPlan;
    this.serialNo = this.$route.query.serialNo;
    if (this.$route.query.anchorPoint || this.$route.query.fromPlan) {
      this.type = "viewPatientPlan";
      this.currentComponent = "viewPatientPlan";
    }
    if (!this.conceal) {
      this.$apis
        .queryChronicDiseaseDetailByFlupPlanId({
          flupPlanId: this.$route.query.flupPlanId,
        })
        .then((res) => {
          if (res.isSelect) {
            this.isSelect = true;
            this.contentJson = res.contentJson;
          }
        });
    }
  },
  methods: {
    openMenu(val) {
      this.type = val;
      this.newSerialNo = "";
      if (this.$options.components[val]) {
        this.currentComponent = val;
      } else {
        this.currentComponent = "";
      }
    },
    newOpenMenu(val, serialNo) {
      this.type = val;
      this.newSerialNo = serialNo;
      if (this.$options.components[val]) {
        this.currentComponent = val;
      } else {
        this.currentComponent = "";
      }
    },
    addCrow(val) {
      this.updateCur = true;
      this.curCrowdTypeList.push(val);
    },
    deleteCrow(crow) {
      this.updateCur = true;
      this.curCrowdTypeList.splice(
        this.curCrowdTypeList.map((x) => x.dict_code).indexOf(crow.dict_code),
        1
      );
    },
    filterCrow() {
      this.addCrowEnable = false;
      this.othCrowdTypeList = this.crowdTypeList.filter(
        (x) =>
          !this.curType.includes(x.dict_code) &&
          x.dict_name.search(this.keyValue) > -1
      );
      this.addCrowEnable = true;
    },
    closeCur(e) {
      var sp = document.getElementById("crowEnable");
      if (sp) {
        if (!sp.contains(e.target)) {
          this.keyValue = "";
          if (e.target.classList.length > 0) {
            if (e.target.classList.contains("el-input__clear")) {
              this.filterCrow();
            }
          } else {
            this.addCrowEnable = false;
          }
        }
      }
    },
    getRemarkList() {
      this.$apis.getPatientRemark({ userId: this.userId }).then((res) => {
        this.remarks = res.map((i) => ({
          ...i,
          edit: false,
          remarkContent2: i.remarkContent,
        }));
        this.remarks.forEach((i) => {
          if (i.remarkType == 3) {
            this.srcList.push(i.remarkUrl);
          }
        });
        //  this.getAudioData()
      });
    },
    getNewRemark() {
      this.$apis.getPatientRemark({ userId: this.userId }).then((res) => {
        this.remarks.unshift({
          ...res[0],
          edit: false,
          remarkContent2: res[0].remarkContent,
        });
      });
    },
    async getAudioData() {
      await this.remarks.forEach(async (i) => {
        if (i.remarkType == 2) {
          i.remarkUrl = await this.$apis.getAudio(i.remarkUrl);
        }
      });
    },
    async play(url) {
      this.recordUrl = await this.$apis.getAudio(url);
      this.$nextTick(() => {
        let audio = this.$refs.recordAudio;
        audio.currentTime = 0;
        audio.play();
      });
    },
    openRemark() {
      this.remarkIsOpen = !this.remarkIsOpen;
    },
    editRemark(item, index) {
      if (item.remarkType == 1) {
        this.editIndex = index;
        this.remarks[index].remarkContent2 = item.remarkContent;
      } else {
        this.editFileName = true;
        this.fileRemark = item;
        // let name = this.splitFilenameAndExtension(item.remarkContent)
        this.filename = item.remarkContent;
        // this.fileRemark.suffix = name.extension
      }
    },
    splitFilenameAndExtension(filePath) {
      let lastDotIndex = filePath.lastIndexOf(".");
      if (lastDotIndex == -1) {
        return {
          filename: filePath,
          extension: "",
        };
      }
      let filename = filePath.substring(0, lastDotIndex);
      let extension = filePath.substring(lastDotIndex + 1);
      return {
        filename: filename,
        extension: extension,
      };
    },
    deleteRemark(id) {
      this.$confirm(`确定要删除该备注吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.deletePatientRemark(id).then((res) => {
            this.$notify({
              title: "删除成功",
              type: "success",
            });
            this.getRemarkList();
          });
        })
        .catch(() => {});
    },
    newRemark() {
      if (this.textareaRemark) {
        this.$confirm(`确定保存备注吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            console.log("fhajfafafa");
            this.$apis
              .insertPatientRemark({
                userId: this.userId,
                remarkContent: this.textareaRemark,
                remarkType: 1,
                remark_url: "",
              })
              .then((res) => {
                this.$notify({
                  title: "保存成功",
                  type: "success",
                });
                this.textareaRemark = "";
                // this.getRemarkList()
                this.getNewRemark();
              });
          })
          .catch(() => {});
      }
    },
    editRemarkSave(item) {
      console.log(item);
      if (item.remarkContent2) {
        this.$confirm(`确定保存备注吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            console.log(item);
            this.$apis
              .editPatientRemark({
                remarkId: item.remarkId,
                remarkContent: item.remarkContent2,
              })
              .then((res) => {
                this.$notify({
                  title: "编辑成功",
                  type: "success",
                });
                this.getRemarkList();
                this.editIndex = "";
              });
          })
          .catch(() => {
            this.editIndex = "";
          });
      } else {
        this.editIndex = "";
      }
    },
    topRemark(item) {
      let isTop 
      let message
      if(item.isTop) {
        isTop = 0
        message = "取消置顶"
      }else {
        isTop = 1
        message = "置顶"
      }
      this.$confirm(`确定${message}吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(res => {
          this.$apis.topPatientRemark(item.remarkId, isTop).then(res => {
            this.$notify({
              title: `${message}成功`,
              type: "success"
            });
          this.getRemarkList()
      })
      })
      .catch(() => {
          });
    },
    editFileRemarkSave() {
      if (!this.filename) {
        this.$message.error("请输入备注名称");
        return;
      }
      this.$confirm(`确定保存备注吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then((res) => {
          this.$apis
            .editPatientRemark({
              remarkId: this.fileRemark.remarkId,
              remarkContent: `${this.filename}`,
            })
            .then((res) => {
              this.$notify({
                title: "编辑成功",
                type: "success",
              });
              this.editFileName = false;
              this.filename = "";
              this.fileRemark = {
                suffix: "",
              };
              this.getRemarkList();
            });
        })
        .catch(() => {
          this.editFileName = false;
          this.filename = "";
          this.fileRemark = {
            suffix: "",
          };
        });
    },
    getOperation() {
      this.$apis
        .getPatientRemarkLog({
          userId: this.userId,
        })
        .then((res) => {
          this.tableData = res;
        });
      this.$refs.dialogPackage.add();
    },
    beforeAvatarUpload(file) {
      let audioFileType = [
        "audio/mpeg",
        "audio/x-wav",
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain"
      ];
      const isAudio = audioFileType.includes(file.type);
      if (!isAudio) {
        this.$message.error("请上传正确的文件类型(.mp3 .wav .jpeg .jpg .png .pdf .docx .doc .xlsx .xls)");
      }
      return isAudio;
    },
    handleAvatarSuccess(res) {
      let { retData } = res;
      if (retData.suffix == ".mp3" || retData.suffix == ".wav") {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/audio/" + retData.id,
            remark_url: retData.id,
            remarkType: 2,
            remarkFormat: retData.suffix,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      } else if (
        retData.suffix == ".pdf" ||
        retData.suffix == ".docx" ||
        retData.suffix == ".doc" ||
        retData.suffix == ".xlsx" ||
        retData.suffix == ".xls" ||
        retData.suffix == ".txt"
      ) {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/other/" + retData.id,
            remark_url: retData.id,
            remarkType: 4,
            remarkFormat: retData.suffix,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      } else if (
        retData.suffix == ".png" ||
        retData.suffix == ".PNG" ||
        retData.suffix == ".jpeg" ||
        retData.suffix == ".jpg" ||
        retData.suffix == ".JPG" ||
        retData.suffix == ".JPEG"
      ) {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/image/" + retData.id,
            remark_url: retData.id,
            remarkType: 3,
            remarkFormat: retData.suffix,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      }
    },
    playClose() {
      this.recordUrl = null;
    },
    getDischargeList() {
      let userId = this.$route.query.userId || "";
      this.$apis.getEmrDischargeRecordList({ userId }).then((res) => {
        this.dischargeList = res;
      });
    },
    viewDischarge() {
      if (this.dischargeList && this.dischargeList.length) {
        window.open(
          `http://192.168.0.145/CDR/tongyist/ShiJianZhou?bingrenid=${this.dischargeList[0].inpNo}&bingrenlx=2&sysid=1253309348403257344&userid=1043&token=072c0a0fb13949dca3457002784bacb7#ShiJianZhou`
        );
      } else {
        this.$message("暂无出院记录");
      }
    },
    viewFile(item) {
      let encodedUrl
      if(this.containsFileExtension(item.remarkContent)) {
        encodedUrl = encodeURIComponent(Base64.encode(`${item.remarkUrl}?fullfilename=${item.remarkContent}`));
      }else {
        encodedUrl = encodeURIComponent(Base64.encode(`${item.remarkUrl}?fullfilename=${item.remarkContent}${item.remarkFormat}`));
      }
      let previewUrl = `${this.$baseURL.onlineViewUrl}?url=${encodedUrl}`;
      window.open(previewUrl);
    },
    containsFileExtension(str) {
      const fileExtensions = [".pdf", ".docx", ".doc", ".xlsx", ".xls"];
      return fileExtensions.some((extension) => str.endsWith(extension));
    },
    handleClose() {
      this.editFileName = false;
      this.filename = "";
      this.fileRemark = {
        suffix: "",
      };
    },
  },
};
</script>

<style lang="scss" scope>
.health_monitor {
  padding: 0px 20px 20px 20px;
  &_wrapper {
    display: flex;
  }

  &_list {
    flex: 1;
    margin-top: 20px;
    overflow: hidden;
  }
  &_main {
    flex: 1;
    margin-left: 20px;
  }
  .el-menu-item {
    line-height: 30px;
  }
  .el-menu-item.is-active:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    height: 30px;
    width: 3px;
    background: #32ae57;
  }
  .health_monitor_aside {
    width: 300px;
    min-width: 300px;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    position: sticky;
    top: 20px;
    padding: 0;
    height: calc(100vh - 40px);
    border: 1px solid #d7dae0;
    border-bottom: 1px solid #e6e6e6;
    .bgcolor-fb {
      border-bottom: 1px solid #e6e6e6;
      background-color: #f8f8f8;
    }
  }
  .optForTagBox {
    width: 238px;
    height: 150px;
    min-width: 218px;
    max-width: 278px;
    padding: 14px 0px;
    margin-top: 10px;
    margin-left: -20px;
    background: #ffffff;
    border-top: 1px solid #e6e6e6;
    box-shadow: 0 2px 4px 0 rgba(193, 193, 193, 0.5);
    overflow: scroll;
    > div {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }
  .piList {
    // display: flex;
    display: block;
    span:first-child {
      flex-shrink: 0;
    }
    &_options {
      display: flex;
    }
  }
  .audio-line {
    display: flex;
    align-items: center;
    .remark-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    img {
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .audio-line2 {
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    img {
      cursor: pointer;
      margin-left: 10px;
    }
    .demo-image__preview {
      margin-right: 20px;
    }
  }
  .remark {
    color: rgb(2, 131, 239);
    cursor: pointer;
    position: relative;
    top: 4px;
  }
  .options_remark {
    position: relative;
    top: 4px;
  }
  .list-btns__upload {
    position: relative;
    top: 4px;
    margin-right: 5px;
  }
  .remarkOne {
    word-break: break-all;
    margin-top: 16px;
    display: inline-block;
  }
  .remarkContent {
    .el-textarea {
      margin-bottom: 10px;
    }
    .remarkList {
      margin-bottom: 10px;
      background-color: #eef7ff;
      padding-left: 10px;
      .remarkDetail {
        word-break: break-all;
      }
      audio {
        width: 250px;
        height: 35px;
      }
    }
    .remark-del {
      display: inline-block;
      margin-left: 10px;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
    .remarkTime {
      color: #666666;
      margin-bottom: 8px;
      padding-top: 10px;
    }
    .remarkDetail {
      padding-bottom: 8px;
    }
    .remark-content {
      margin-bottom: 8px;
    }
    .remarkTime .remark-del {
      display: inline-block;
      margin-left: 10px;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
  .more {
    display: flex;
    justify-content: center;
    align-items: center;
    .more-box {
      cursor: pointer;
      .more-text {
        color: #606266;
      }
    }
  }
  .audio-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    audio {
      width: 250px;
    }
    .audio-close {
      cursor: pointer;
      display: inline-block;
      height: 28px;
      width: 28px;
      background-color: #f1f3f4;
      border-radius: 50%;
      margin: 0 10px 0 0;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .audio-close:hover {
      background-color: #e5e7e8;
    }
    .audio-close::after {
      content: "";
      display: inline-block;
      height: 100%;
      width: 100%;
      border-radius: 100px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      transition: all 0.4s;
    }
    .audio-close::after {
      background-color: #f1f3f4;
    }
  }
}
</style>

<style lang="scss">
.health_monitor {
  .test {
    .health_monitor_wrapper {
      .piList_options {
        .el-upload--text {
          background-color: transparent;
        }
        .el-button--text:hover {
          text-decoration: none;
        }
        .el-upload button {
          padding: 0;
        }
      }
      .remarkContent {
        .el-button--text:hover {
          text-decoration: none;
        }
        .v1ew {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
