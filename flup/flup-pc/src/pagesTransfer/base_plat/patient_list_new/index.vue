<template>
  <section class="patient-list-new">
    <div class="queryConditionsBox">
      <div class="queryConditions" v-show="queryConditionsShow">
        <p>患者类型</p>
        <el-select class="margin-left10 width150px" v-model="search.patientTypeCode" placeholder="患者类型" @change="changeMainList">
          <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName" :disabled="item.enabled == 0"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <div class="flex">
          <el-select class="margin-left10 width110px select-time-key" v-model="search.searchTimeKey">
            <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="search.searchTimeVal"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <el-input class="margin-left10 width200px limiting" style="margin-right: 10px" v-model="search.searchVal" maxlength="20" show-word-limit>
          <el-select class="width120px" v-model="search.searchKey" slot="prepend">
            <el-option v-for="item in searchKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
        </el-input>
      </div>
      <div class="queryConditions">
        <div v-if="search.patientTypeCode != patientModel.sign ">
          <p>科室</p>
          <el-select clearable class="margin-left14 width200px" v-model="search.deptId" placeholder="请选择" @change="onSearch" filterable>
            <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>
        </div>
        <!-- <div v-else-if="search.patientTypeCode == patientModel.transfer" class="queryConditions">
          <p>转院科室</p>
          <el-select class="width180px" v-model="search.deptId" clearable>
            <el-option
              v-for="(item, index) in wardList"
              :key="index"
              :label="item.dischargeWard"
              :value="item.dischargeWardCode"
            ></el-option>
          </el-select>
        </div>-->
        <div v-else class="queryConditions">
          <p>签约服务内容</p>
          <el-select class="width200px" v-model="search.packageCode" placeholder="请选择" clearable @change="onSearch">
            <el-option v-for="item in packageList" :key="item.serialNo" :value="item.serialNo" :label="item.packageName"></el-option>
          </el-select>
        </div>
      </div>
      <div style="display: flex;align-items: center;" class="butBox">
        <el-button class="margin-left15" @click="onSearch" plain>查询</el-button>
        <!-- <el-button class="margin-left15" @click="downloadTemplate" :disabled="importEnable" plain>导入模板下载</el-button>
        <el-upload
          class="margin-left10 margin-right10"
          ref="upload"
          :headers="{ token: token }"
          :action="$baseURL.ICDMApiUrl + '/b/Patient/b/importExcelData'"
          :data="{
          hospitalId: $global.hospital_id,
          patientTypeCode: search.patientTypeCode,
        }"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="false"
        >
          <el-button type="info" :disabled="importEnable" plain>导入</el-button>
        </el-upload>-->
        <el-button type="primary" :disabled="importEnable" @click="book" plain v-if="search.patientTypeCode != patientModel.sign">患者登记</el-button>
        <!-- <el-button class="margin-left10" style="margin-right: 10px" type="primary" size="small" @click="onSynchronization">手动同步</el-button> -->
        <i style="margin-left: 15px; font-size: 20px; color: #999" class="el-icon-s-tools" @click="sz"></i>
      </div>
    </div>

    <el-table class="margin-top20 margin-bottom60" :data="mainList" border stripe>
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <!-- <el-table-column label="科室" prop="admissionWard"></el-table-column>
      <el-table-column label="病区" prop="dischargeWard"></el-table-column>-->
      <el-table-column v-for="(item, index) in baseColumnsV2" :key="index" show-overflow-tooltip :prop="item.fieldName" :label="item.displayName">
        <template slot-scope="scope">
          <el-button v-if="item.displayName == '患者姓名'" @click="onView(scope.row)" type="text">{{ scope.row.patientName | hideInfo('name') }}</el-button>
          <p v-else>{{ scope.row[item.fieldName] | hideInfo(item.fieldName) }}</p>
        </template>
      </el-table-column>
      <el-table-column width="220" label="随访/慢病组" prop="groupCondition"></el-table-column>
      <el-table-column width="220" label="随访/慢病人员" prop="planDoctorCondition"></el-table-column>
      <el-table-column width="220" fixed="right" label="操作">
        <template slot-scope="scope">
          <!-- <el-button @click="changeState(scope.row)" type="text">变更状态</el-button>
          <el-button @click="goTimeline(scope.row)" type="text">查看随访时间轴</el-button>-->
          <el-button @click="editForm(scope.row)" v-if="!scope.row.nurseRecordId" type="text">填写照护表</el-button>
          <el-button @click="readForm(scope.row)" v-if="scope.row.nurseRecordId && scope.row.recordStatus == 0" type="text">填写照护表</el-button>
          <el-button @click="readForm(scope.row)" v-if="scope.row.nurseRecordId && scope.row.recordStatus == 1" type="text">查看照护表</el-button>
          <el-button @click="evaluate(scope.row)" type="text" v-if="scope.row.nurseRecordId">健康管理计划</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pageBottom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
    <el-dialog class title="变更状态" :close-on-click-modal="false" :close-on-press-esc="false" :before-close="closeStatusDialog" :visible="dialogVisiable" width="418px">
      <div>
        <span>患者状态</span>
        <el-select class="margin-left14 width200px" v-model="currentRow.patientStateCode" placeholder="患者状态">
          <el-option v-for="item in patientStateList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="closeStatusDialog">取 消</el-button>
        <el-button type="primary" @click="confirmChangeState">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置显示字段" :visible.sync="dialogVisibleSetting" width="90%" top="10vh" :close-on-click-modal="false" :close-on-press-esc="false" :before-close="closeDialog">
      <div>
        患者类型
        <el-select v-model="patientTypeTc" placeholder="请选择患者类型" @change="getlists">
          <el-option v-for="item in patientTypeList" :key="item.patientTypeName" :value="item.patientTypeName" :label="item.patientTypeName" :disabled="item.enabled == 0"></el-option>
        </el-select>
        <input style="display: none; border: 0" type="text" v-model="userId" />
      </div>
      <div style="padding: 20px" class="flex">
        <div class="checklistbox" style="flex: 4">
          <h4 style="color: #666">可选字段</h4>
          <div>
            <div v-for="(item, index) in modules" :key="index">
              <h3 style="padding: 10px 0px">{{ item.moduleName }}</h3>
              <div class="checkxbox">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox v-for="(item2, index) in item.columns" :key="index" :label="item2.id">{{ item2.displayName }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="justify-content: center;display: flex;color: darkgray;">按住列名可拖动改变顺序</p>
          <div class="xdzd" style="flex: none">
            <h4 style="color: #666; text-align: center">当前选定字段</h4>
            <el-tree :data="baseColumns" node-key="id" default-expand-all draggable @node-drag-start="dragTheStart" @node-drop="dragTheEnter" :expand-on-click-node="false">
              <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.displayName }}</span>
                <span style="float: right; margin-bottom: 3px">
                  <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="bc">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="synchronization" width="70%" :close-on-click-modal="false">
      <div class="block">
        <div class="flex">
          <el-select class="width110px select-time-key" v-model="search.searchTimeKey">
            <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="search.searchTimeVal"
            value-format="yyyyMMdd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          ></el-date-picker>
          <el-button class="margin-left14" type="primary" plain @click="onSearchs">查询</el-button>
        </div>
      </div>
      <el-table :data="gridData" style="margin-top:20px">
        <el-table-column prop="index" label="序号" width="100px"></el-table-column>
        <el-table-column prop="sysnParameterDateSQL" label="出院日期"></el-table-column>
        <el-table-column prop="synchronizeTime" label="同步日期"></el-table-column>
        <el-table-column prop="synchronizeStatus" label="同步状态"></el-table-column>
        <el-table-column prop="count" label="同步患者数量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="onTb(scope.row)">手工同步</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page.sync="pageIndex1"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize1"
        background
        layout="total, sizes, prev, pager, next"
        :total="total1"
      ></el-pagination>
    </el-dialog>
    <el-dialog :visible.sync="assessmentVisible" width="80%" :close-on-click-modal="false">
      <div class="block">
        <div class="formTitle">
          <span>照护需求评估表</span>
          <img src="~@/assets/images/iconEdit.png" title="编辑需求评估表" @click="toEdit" v-if="isRead" />
        </div>
        <div class="baseInfo">
          <div class="infoPart">
            <label>姓名</label>
            <span>{{patientInfo.patientName}}</span>
          </div>
          <div class="infoPart">
            <label>性别</label>
            <span>{{patientInfo.sex}}</span>
          </div>
          <div class="infoPart">
            <label>年龄</label>
            <span>{{patientInfo.age}}岁</span>
          </div>
          <div class="infoPart">
            <label>身份证</label>
            <span>{{patientInfo.idNo}}</span>
          </div>
        </div>
        <div class="formcontent">
          <el-form ref="form" :rules="rules" :model="assessmentForm" label-width="118px">
            <div class="queryConditions">
              <!-- <p>诊断</p> -->
              <el-form-item label="诊断" class="width100">
                <el-input type="textarea" v-model="patientInfo.clinicalDiagnosis" placeholder="请输入诊断" :disabled="isRead"></el-input>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>主要照护者</p> -->
              <el-form-item label="主要照护者">
                <el-radio-group v-model="assessmentForm.server">
                  <el-radio :label="1" :disabled="isRead">子</el-radio>
                  <el-radio :label="2" :disabled="isRead">女</el-radio>
                  <el-radio :label="3" :disabled="isRead">夫</el-radio>
                  <el-radio :label="4" :disabled="isRead">妻</el-radio>
                  <el-radio :label="5" :disabled="isRead">父</el-radio>
                  <el-radio :label="6" :disabled="isRead">母</el-radio>
                  <el-radio :label="7" :disabled="isRead">看护</el-radio>
                  <el-radio :label="8" :disabled="isRead">其他</el-radio>
                  <!-- <el-radio v-for="(item,index) in list1" :label="item.lable" :disabled="isRead" :key=index>{{ item.name }}</el-radio> -->
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>身心状况</p> -->
              <el-form-item label="身心状况">
                <el-radio-group v-model="assessmentForm.situation">
                  <!-- <el-radio :label="1" :disabled="patientInfo.nurseRecordId">意识</el-radio> -->
                  <el-radio :label="2" :disabled="isRead">清醒</el-radio>
                  <el-radio :label="3" :disabled="isRead">模糊</el-radio>
                  <el-radio :label="4" :disabled="isRead">嗜睡</el-radio>
                  <el-radio :label="5" :disabled="isRead">昏睡</el-radio>
                  <el-radio :label="6" :disabled="isRead">昏迷</el-radio>
                  <el-radio :label="7" :disabled="isRead">谵妄</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>情绪</p> -->
              <el-form-item label="情绪">
                <el-radio-group v-model="assessmentForm.emotion">
                  <el-radio :label="1" :disabled="isRead">平静</el-radio>
                  <el-radio :label="2" :disabled="isRead">焦虑</el-radio>
                  <el-radio :label="3" :disabled="isRead">忧愁</el-radio>
                  <el-radio :label="4" :disabled="isRead">冷漠</el-radio>
                  <el-radio :label="5" :disabled="isRead">激动</el-radio>
                  <el-radio :label="6" :disabled="isRead">哭闹可安抚</el-radio>
                  <el-radio :label="7" :disabled="isRead">哭闹不可安抚</el-radio>
                  <el-radio :label="8" :disabled="isRead">无法评估</el-radio>
                  <el-radio :label="9" :disabled="isRead">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>沟通</p> -->
              <el-form-item label="沟通">
                <el-radio-group v-model="assessmentForm.talk">
                  <el-radio :label="1" :disabled="isRead">能理解</el-radio>
                  <el-radio :label="2" :disabled="isRead">不能理解</el-radio>
                  <el-radio :label="3" :disabled="isRead">失语</el-radio>
                  <el-radio :label="4" :disabled="isRead">无法评估</el-radio>
                  <el-radio :label="5" :disabled="isRead">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>视力</p> -->
              <el-form-item label="视力">
                <el-radio-group v-model="assessmentForm.sight">
                  <el-radio :label="1" :disabled="isRead">清晰</el-radio>
                  <el-radio :label="2" :disabled="isRead">近视</el-radio>
                  <el-radio :label="9" :disabled="isRead">远视</el-radio>
                  <el-radio :label="3" :disabled="isRead">重影</el-radio>
                  <el-radio :label="4" :disabled="isRead">视野缺损</el-radio>
                  <el-radio :label="5" :disabled="isRead">视野模糊</el-radio>
                  <el-radio :label="6" :disabled="isRead">失明</el-radio>
                  <el-radio :label="7" :disabled="isRead">无法评估</el-radio>
                  <el-radio :label="8" :disabled="isRead">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>听力</p> -->
              <el-form-item label="听力">
                <el-radio-group v-model="assessmentForm.heard">
                  <el-radio :label="1" :disabled="isRead">正常</el-radio>
                  <el-radio :label="2" :disabled="isRead">重听</el-radio>
                  <el-radio :label="3" :disabled="isRead">失聪</el-radio>
                  <el-radio :label="4" :disabled="isRead">无法评估</el-radio>
                  <el-radio :label="5" :disabled="isRead">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>呼吸</p> -->
              <el-form-item label="呼吸">
                <el-radio-group v-model="assessmentForm.breath">
                  <el-radio :label="1" :disabled="isRead">自呼</el-radio>
                  <el-radio :label="2" :disabled="isRead">鼻导管</el-radio>
                  <el-radio :label="3" :disabled="isRead">氧气面罩</el-radio>
                  <el-radio :label="4" :disabled="isRead">气切导管</el-radio>
                  <el-radio :label="7" :disabled="isRead">气管专管</el-radio>
                  <el-radio :label="5" :disabled="isRead">呼吸器</el-radio>
                  <el-radio :label="6" :disabled="isRead">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="summary">
              <!-- <div>皮肤</div> -->
              <el-form-item label="皮肤">
                <div>
                  <div class="queryConditions">
                    <!-- <p>1、皮肤</p> -->
                    <!-- <el-form-item label="呼吸">
                <el-radio-group v-model="assessmentForm.skin">
                  <el-radio :label="1" :disabled="patientInfo.nurseRecordId">完整</el-radio>
                  <el-radio :label="2" :disabled="patientInfo.nurseRecordId">不完整</el-radio>
                  <el-radio :label="3" :disabled="patientInfo.nurseRecordId">其他</el-radio>
                </el-radio-group>
                    </el-form-item>-->
                  </div>
                  <table class="ori-tablE">
                    <tbody>
                      <tr>
                        <td>皮肤</td>
                        <td>
                          <el-radio-group v-model="assessmentForm.skin">
                            <el-radio :label="1" :disabled="isRead">完整</el-radio>
                            <el-radio :label="2" :disabled="isRead">不完整</el-radio>
                            <el-radio :label="3" :disabled="isRead">其他</el-radio>
                          </el-radio-group>
                        </td>
                      </tr>
                      <tr>
                        <td>伤口</td>
                        <td>
                          <div style="display: flex">
                            <el-form-item label="部位">
                              <el-input class="margin-right20 width300px" v-model="assessmentForm.part" placeholder="请输入" :disabled="isRead"></el-input>
                            </el-form-item>
                            <el-form-item label="大小(长度深cm)">
                              <el-input class="width300px" v-model="assessmentForm.deep" placeholder="请输入" :disabled="isRead"></el-input>
                            </el-form-item>
                          </div>
                          <div style="width: 440px">
                            <el-form-item label="类型">
                              <el-select class="width150px" v-model="assessmentForm.type" placeholder="请选择" :disabled="isRead">
                                <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <!-- <el-input class="margin-left10 width150px" v-model="assessmentForm.type" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input> -->
                        </td>
                      </tr>
                      <tr>
                        <td>压疮</td>
                        <td>
                          <div style="display: flex">
                            <el-form-item label="部位">
                              <el-input class="margin-right20 width300px" v-model="assessmentForm.part2" placeholder="请输入" :disabled="isRead"></el-input>
                            </el-form-item>
                            <el-form-item label="大小(长度深cm)">
                              <el-input class="width300px" v-model="assessmentForm.deep2" placeholder="请输入" :disabled="isRead"></el-input>
                            </el-form-item>
                          </div>
                          <div style="width: 440px">
                            <el-form-item label="类型">
                              <el-select class="width150px" v-model="assessmentForm.level" placeholder="请选择" :disabled="isRead">
                                <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- <div class="queryConditions">
                <p>2、伤口</p>
                <div>
                  部位
                  <el-input class="margin-left10 margin-right20 width300px" v-model="assessmentForm.part" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                </div>
                <div>
                  大小（长度深cm）
                  <el-input class="margin-left10 margin-right20 width300px" v-model="assessmentForm.deep" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                </div>
                <div>
                  类型
                  <el-input class="margin-left10 width150px" v-model="assessmentForm.type" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                  <el-select class="margin-left10 width150px" v-model="assessmentForm.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeList" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
                  </div>-->
                  <!-- <div class="queryConditions">
                <p>2、压疮</p>
                <div>
                  部位
                  <el-input class="margin-left10 margin-right20 width300px" v-model="assessmentForm.part2" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                </div>
                <div>
                  大小（长度深cm）
                  <el-input class="margin-left10 margin-right20 width300px" v-model="assessmentForm.deep2" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                </div>
                <div>
                  类型
                  <el-input class="margin-left10 width150px" v-model="assessmentForm.level" placeholder="请输入" :disabled="patientInfo.nurseRecordId"></el-input>
                  <el-select class="margin-left10 width150px" v-model="assessmentForm.level" placeholder="请选择">
                    <el-option
                      v-for="item in typeList" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
                  </div>-->
                </div>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>照护问题</p> -->
              <el-form-item label="照护问题" class="width100">
                <el-input v-model="assessmentForm.assessment" placeholder="照护问题" :disabled="isRead"></el-input>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>服务需求</p> -->
              <el-form-item label="服务需求" prop="goal" class="noBottomMargin">
                <el-checkbox-group v-model="assessmentForm.goal">
                  <el-checkbox :label="1" :disabled="isRead">健康管理</el-checkbox>
                  <el-checkbox :label="2" :disabled="isRead">转诊</el-checkbox>
                  <el-checkbox :label="3" :disabled="isRead">居家随访</el-checkbox>
                  <el-checkbox :label="4" :disabled="isRead">随访</el-checkbox>
                  <el-checkbox :label="5" :disabled="isRead">其他</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="queryConditions2" v-if="disFollowupShow && !isRead && !recordStatus">
              <el-form-item>
                <div class="patient">
                  <div class="patient-info">
                    <span>请为患者分配随访/慢病人员</span>
                    <i class="el-icon-user-solid"></i>
                    <span>患者:{{ patientInfo.patientName }}</span>
                  </div>
                  <div class="queryConditions">
                    <p>健康管理计划</p>
                    <el-select class="margin-left10 width200px" v-model="planId" placeholder="健康患者管理计划" @change="changePlanList">
                      <el-option v-for="item in planList" :key="item.serialNo" :value="item.serialNo" :label="item.planName" :disabled="item.enabled == 0"></el-option>
                    </el-select>
                  </div>
                  <div class="order" v-for="m in orderList" :key="m.serialNo">
                    <div>
                      <span>
                        订单号：
                        <span class="orderValue">{{m.serialNo}}</span>
                      </span>
                      <span class="margin-left20">
                        订单状态：
                        <span class="orderValue">{{m.flowStatusName}}</span>
                      </span>
                    </div>
                  </div>
                  <div class="queryConditions">
                    <p>执行科室</p>
                    <el-select v-model="executiveDept" class="margin-left10 width200px" placeholder="请选择" disabled>
                      <el-option v-for="(item, index) in deptlist" :key="index" :label="item.deptName" :value="item.serialNo"></el-option>
                    </el-select>
                  </div>
                  <div class="queryConditions">
                    <p>随访组</p>
                    <el-select v-model="fuGroupId" placeholder="请选择随访组" class="margin-left10 width200px" disabled>
                      <el-option v-for="(item, index) in fuGrouplist" :key="index" :label="item.groupName" :value="item.serialNo"></el-option>
                    </el-select>
                  </div>
                  <div class="queryConditions">
                    <p>随访人员</p>
                    <el-select v-model="fuDoctorId" placeholder="请选择随访人员" class="margin-left10 width200px">
                      <el-option v-for="(item, index) in fuDoctorlist" :key="index" :label="item.realName" :value="item.userId"></el-option>
                    </el-select>
                  </div>
                  <div class="queryConditions" v-if="needStartDate">
                    <span class="queryConditions-tip2">
                      <span>*</span>任务开始时间
                    </span>
                    <el-date-picker class="margin-left10 width200px" v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <!-- <p>异动说明</p> -->
              <el-form-item label="异动说明" class="width100">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="assessmentForm.yiDongShuoMing" :disabled="isRead"></el-input>
              </el-form-item>
            </div>
            <div class="queryConditions">
              <div style="display: flex">
                <el-form-item label="职称">
                  <el-select class="width150px" v-model="assessmentForm.zhiCheng" placeholder="请选择" :disabled="isRead">
                    <el-option v-for="item in proList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="记录人">
                  <el-input class="width150px" v-model="assessmentForm.jiLuRen" placeholder="请输入记录人" :disabled="isRead"></el-input>
                </el-form-item>
                <el-form-item label="记录日期">
                  <el-date-picker v-model="assessmentForm.jiLuRiQi" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="isRead"></el-date-picker>
                </el-form-item>
              </div>
              <!-- <div>
                  职称
                  <el-select class="margin-left10 width150px" v-model="assessmentForm.zhiCheng" placeholder="请选择">
                    <el-option
                      v-for="item in proList" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  记录人
                  <el-input class="margin-left10 width300px" v-model="assessmentForm.jiLuRen" placeholder="请输入记录人" :disabled="patientInfo.nurseRecordId"></el-input>
                </div>
                <div>
                  记录日期
                  <el-date-picker
                    v-model="assessmentForm.jjiLuRiQi"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    >
                  </el-date-picker>
              </div>-->
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isRead">
        <!-- <el-button @click="closeDialog">取 消</el-button> -->
        <el-button type="primary" @click="clear()">清空</el-button>
        <el-button @click="cancel()">取消</el-button>
        <el-button @click="submit()">保存</el-button>
        <el-button type="primary" @click="submit3(1)" v-if="referralShow && !recordStatus">门诊转诊</el-button>
        <el-button type="primary" @click="submit3(2)" v-if="referralShow && !recordStatus">住院转诊</el-button>
        <!-- <el-button type="primary" @click="submit4()">test</el-button> -->
        <!-- <el-button type="primary" @click="submit5()">tpost</el-button> -->
        <el-button type="primary" @click="submit2()" v-if="!referralShow && !recordStatus">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="evaluationVisible" width="50%" :close-on-click-modal="false" class="evaluation" :before-close="closeEvaluationDialog">
      <div class="block">
        <div>
          请为患者分配随访/慢病人员
          <span v-if="needStartDate">和任务开始时间</span>
        </div>
        <div>患者：【{{patientInfo.patientName}}】</div>
        <div class="queryConditions">
          <p>健康管理计划</p>
          <el-select class="margin-left10 width200px" v-model="planId" placeholder="健康患者管理计划" @change="changePlanList">
            <el-option v-for="item in planList" :key="item.serialNo" :value="item.serialNo" :label="item.planName" :disabled="item.enabled == 0"></el-option>
          </el-select>
        </div>
        <div class="order" v-for="m in orderList" :key="m.serialNo">
          <div>
            <span>
              订单号：
              <span class="orderValue">{{m.serialNo}}</span>
            </span>
            <span class="margin-left20">
              订单状态：
              <span class="orderValue">{{m.flowStatusName}}</span>
            </span>
          </div>
        </div>
        <div class="queryConditions">
          <p>执行科室</p>
          <el-select v-model="executiveDept" class="margin-left10 width200px" placeholder="请选择" disabled>
            <el-option v-for="(item, index) in deptlist" :key="index" :label="item.deptName" :value="item.serialNo"></el-option>
          </el-select>
        </div>
        <div class="queryConditions">
          <p>随访组</p>
          <el-select v-model="fuGroupId" placeholder="请选择随访组" class="margin-left10 width200px" disabled>
            <el-option v-for="(item, index) in fuGrouplist" :key="index" :label="item.groupName" :value="item.serialNo"></el-option>
          </el-select>
        </div>
        <div class="queryConditions">
          <p>随访人员</p>
          <el-select v-model="fuDoctorId" placeholder="请选择随访人员" class="margin-left10 width200px">
            <el-option v-for="(item, index) in fuDoctorlist" :key="index" :label="item.realName" :value="item.userId"></el-option>
          </el-select>
        </div>
        <div class="queryConditions" v-if="needStartDate">
          <span class="queryConditions-tip">
            <span>*</span>任务开始时间
          </span>
          <el-date-picker class="margin-left10 width200px" v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEvaluationDialog">取 消</el-button>
        <el-button type="primary" @click="evaluationSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="alreadyIngroupVisible" width="30%" :close-on-click-modal="false" class="evaluation" title="提示">
      <div class="block">
        <!-- <div>请为患者分配随访/慢病人员</div> -->
        <div>患者：{{patientInfo.patientName}}已入组{{patientInfo.flupPlan}},继续执行入组操作？</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alreadyIngroupVisible=false">取 消</el-button>
        <el-button type="primary" @click="continueEvaluate">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="referralTitle" :visible.sync="referralVisible" width="90%">
      <iframe :src="iframeUrl" frameborder="0" class="iframe" ref="iframe" scrolling="auto" id="referralIframe"></iframe>
    </el-dialog>
  </section>
</template>

<script>
import { patientModel } from '@/mixins/enum.js';
import baseURL from '@/mixins/baseURL';
export default {
  mixins: [patientModel, baseURL],
  data() {
    return {
      iframeUrl: '',
      checkList: [],
      alllist: [],
      baseColumns: [],
      baseColumnsV2: [],
      patientTypeTc: '',
      patientTypeTcOri: '',
      dialogVisible: false,
      dialogVisibleSetting: false,
      queryConditionsShow: true,
      // token: this.$cookie.get('token'),
      token: this.$route.query.token,
      dialogVisiable: false,
      patientStateChanged: '',
      mainList: [],
      currentRow: {},
      modules: [],
      wardList: [],
      deptList: [],
      patientTypeList: [],
      timeKeyList: [
        { label: '入院时间', value: 'admissionDatetime' },
        { label: '出院时间', value: 'dischargeDatetime' },
        { label: '就诊时间', value: 'medicalDate' },
        { label: '创建时间', value: 'createDatetime' },
        //{ label: '手术时间', value: 'unknown1', disabled: true },
        //{ label: '记录时间', value: 'registerDatetime' },
        //{ label: '转院时间', value: 'transferDatetime' },
        //{ label: '签约时间', value: 'signTime', disabled: true },
        //{ label: '服务失效时间', value: 'validityDatetime', disabled: true },
      ],
      typeList: ['1.可疑的深部组织损伤', '2.I期', '3.II期', '4.III期', '5.IV期', '6.不明确分期'],
      proList: ['护士', '护师', '主管护师', '副主任护师', '主任护师', '个案管理师', '医生', '其他'],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '病案号', value: 'patientId' },
        { label: '诊断', value: 'dischargeDiagnosis' },
        //{ label: '门诊号', value: 'unknown', disabled: true },
        //{ label: '电话', value: 'flupPhone' },
        { label: '身份证号', value: 'idNo' },
        //{ label: '入组情况', value: 'planCondition' },
        //{ label: '签约服务包', value: 'packageName', disabled: true },
      ],
      stateList: [
        { label: '未随访', value: 1 },
        { label: '正常随访', value: 2 },
        { label: '居民死亡', value: 4 },
        { label: '电话错号', value: 5 },
        { label: '电话空号', value: 6 },
        { label: '电话关机', value: 7 },
        { label: '无人接听', value: 8 },
        { label: '拒绝随访', value: 9 },
        { label: '电话停机', value: 10 },
      ],
      patientStateList: [
        { label: '正常', value: '1' },
        { label: '死亡', value: '3' },
        { label: '拒绝', value: '4' },
        { label: '终止', value: '5' },
      ],
      search: {
        patientTypeCode: '',
        searchKey: 'patientName',
        searchVal: '',
        searchTimeKey: 'admissionDatetime',
        packageCode: '',
        searchTimeVal: null,
        deptId: null,
        wardId: null,
      },
      hospitalId: null,
      zc: [],
      packageList: [],
      userId: null,
      currentStatus: '',
      importEnable: false,
      pageSize: 10,
      synchronization: false,
      gridData: [],
      sysnParameterDate: [],
      pageIndex1: 1,
      pageSize1: 10,
      total1: 0,
      patientInfo: {},
      disFollowupShow: false,
      referralShow: false,
      btnShow: true,
      isRead: false,
      recordStatus: false,
      referralVisible: false,
      referralTitle: '',
      assessmentForm: {
        server: '',
        situation: '',
        emotion: '',
        talk: '',
        sight: '',
        heard: '',
        breath: '',
        skin: '',
        part: '',
        deep: '',
        type: '',
        part2: '',
        deep2: '',
        level: '',
        assessment: '',
        goal: [],
        yiDongShuoMing: '',
        zhiCheng: '',
        jiLuRen: '',
        jiLuRiQi: '',
      },
      assessmentVisible: false,
      evaluationVisible: false,
      executiveDeptId: null, //执行科室
      executiveDept: null,
      fuGroupId: null,
      fuDoctorId: null,
      startDate: '',
      needStartDate: false,
      fuGrouplist: [],
      planId: '',
      planList: [],
      fuDoctorlist: [],
      deptlist: [],
      orderList: [],
      alreadyIngroupVisible: false,
      rules: {
        goal: [
          {
            required: true,
            message: '至少选择一个服务需求',
            trigger: 'change',
          },
        ],
      },
      followup: {},
      list1: [
        { label: 1, name: '子' },
        { label: 1, name: '女' },
        { label: 1, name: '夫' },
        { label: 1, name: '妻' },
        { label: 1, name: '父' },
        { label: 1, name: '母' },
        { label: 1, name: '看护' },
        { label: 1, name: '其他' },
      ],
    };
  },
  async created() {
    // this.$apis
    //   .BaseDictGetDictsByDictCode({
    //     dictCode: 'FLupPlanPatientType',
    //   })
    //   .then((res) => {
    //     this.patientTypeList = res
    //   })
    await this.$apis.queryPatientTypeAll().then((res) => {
      // this.patientTypeList = res.filter((x) => x.enabled);
      if (this.$route.query.patientTypeCode) {
        let patientTypeCode = this.$route.query.patientTypeCode.split(',');
        if (patientTypeCode.length == 1) {
          this.queryConditionsShow = false;
        }
        let patientTypeList = res.filter((x) => this.$route.query.patientTypeCode.includes(x.patientTypeCode));
        this.patientTypeList = patientTypeList;
        let obj = patientTypeList.find((i) => i.patientTypeCode == patientTypeCode[0]);
        this.search.patientTypeCode = obj.patientTypeCode;
        this.patientTypeTc = obj.patientTypeName;
        // this.search.patientTypeCode = patientTypeList[0].patientTypeCode;
        // this.patientTypeTc = patientTypeList[0].patientTypeName;
      } else {
        this.patientTypeList = res;
        this.search.patientTypeCode = this.patientTypeList[0].patientTypeCode;
        this.patientTypeTc = this.patientTypeList[0].patientTypeName;
      }

      this.changeMainList();
      this.getBaseUrl('/referral/web');
    });
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    window.addEventListener('refresh-data', this.onSearch);

    let e = this.$apis.flupPlanqueryDischargeWard({
      hospitalId: this.hospitalId,
      type: 1,
    });
    let g = this.$apis.getAllPackageList({
      pageStatus: false,
      hospitalId: this.hospitalId,
    });
    let f = this.$apis.systemManagequeryCurrentUserDept();
    this.$http.all([e, g]).then(
      this.$http.spread((res5, res7) => {
        this.wardList = res5;
        // this.deptList = res6;
        this.packageList = res7.list;
      })
    );
    ///原权限内科室换为所有随访科室
    // await this.$apis
    //   .departmentquery({
    //     flupDepartment: 1,
    //     hospitalId: this.hospitalId,
    //     pageNo: 1,
    //     pageSize: 1000,
    //   })
    //   .then((res) => {
    //     this.deptList = res.list;
    //   });
    await this.$apis
      .selectDeptByUserGroup({
        hospitalId: this.hospitalId,
        userId: JSON.parse(sessionStorage.getItem('global')).userId || '',
      })
      .then((res) => {
        this.deptList = res;
      });
    this.onSearch();
    this.listenMessage();
    console.log(this.$baseURL);
  },
  computed: {
    plan() {
      return this.planList.find((item) => item.serial_no === this.search.flup_plan_id);
    },
  },
  watch: {
    checkList() {
      this.baseColumns = [];
      for (let i in this.checkList) {
        for (let j in this.alllist) {
          if (this.checkList[i] == this.alllist[j].id) {
            this.baseColumns.push(this.alllist[j]);
          }
        }
      }
    },
    'assessmentForm.goal': {
      handler(newVal) {
        this.disFollowupShow = newVal.includes(1);
        if (!this.disFollowupShow) this.continueEvaluate(false);
        this.referralShow = newVal.includes(2);
      },
    },
    // 'search.patientTypeCode': {
    //   handler(newValue) {
    //     console.log(newValue)
    //   }
    // }
  },
  destroyed() {
    window.removeEventListener('refresh-data', this.onSearch);
  },
  methods: {
    removearia() {
      const elements = document.querySelectorAll('[aria-hidden]');
      elements.forEach((element) => {
        element.setAttribute('aria-hidden', 'false');
      });
    },
    listenMessage() {
      window.addEventListener(
        'message',
        (e) => {
          // if(e && e.data && e.data.data) {
          //   console.log(JSON.parse(e.data))
          // }
          // console.log(e.data)
          // console.log(typeof e.data)
          if (typeof e.data == 'string') {
            let message = JSON.parse(e.data);
            if (message.method && message.method == 'closePop') {
              if (message.type && message.type == 1) this.referralVisible = false;
            }
          }
        },
        false
      );
    },
    onSynchronization() {
      this.synchronization = true;
    },
    onSearchs() {
      this.getMainsList();
    },
    onTb(row) {
      this.$apis
        .sysnDisPatData({
          dischargeDate: row.sysnParameterDate,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          console.log(res);
          if (res == 1) {
            this.$message({
              message: '同步成功',
              type: 'success',
            });
          } else {
            this.$message.error('同步失败');
          }
        });
    },
    getMainsList() {
      this.$apis
        .getPatientSysnRecordList({
          beginDate: this.search.searchTimeVal != '' ? '' : this.search.searchTimeVal[0],
          endDate: this.search.searchTimeVal != '' ? '' : this.search.searchTimeVal[1],
          pageNo: this.pageIndex1,
          pageSize: this.pageSize1,
        })
        .then((res) => {
          this.gridData = res.list;
          this.total1 = res.total;
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].synchronizeStatus == '未同步') {
              this.sysnParameterDate = res.list[i].sysnParameterDate.split('-').join('');
            }
          }
        });
    },
    goTimeline(row) {
      console.log(row);
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/flupTimeline?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${row.age}&phone=${row.phone}&recordSerialNo=${row.recordSerialNo}&joinPlanPatientType=${this.search.patientTypeCode}&flupPlanId=${row.flupPlan}&token=${this.$route.query.token}&dischargeWardCode=${row.dischargeWardCode}`,
          title: '随访时间轴',
        }),
        '*'
      );
      // console.log(
      //   urlx +
      //     `#/flupTimeline?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${row.age}&phone=${row.phone}&recordSerialNo=${row.recordSerialNo}
      //       &joinPlanPatientType=${this.search.patientTypeCode}&flupPlanId=${row.flupPlan}&token=${this.$route.query.token}`
      // )
    },
    dragTheStart() {
      this.zc = JSON.parse(JSON.stringify(this.baseColumns));
    },
    dragTheEnter(before, after) {
      if (after.childNodes.length != 0) {
        this.baseColumns = this.zc;
      }
    },
    sz() {
      this.patientTypeTcOri = String(this.patientTypeTc);
      this.getlists();
      this.dialogVisibleSetting = true;
      this.patientTypeTcOri = String(this.patientTypeTc);
    },
    bc() {
      let arr = [];
      for (let i in this.baseColumns) {
        let a = {
          columnId: this.baseColumns[i].id,
          page: '患者列表',
          sortOrder: Number(i) + 1,
          type: this.patientTypeTc,
          userId: this.userId,
        };
        arr.push(a);
      }
      if (arr.length != 0) {
        this.$apis.columnsavePageColumns(arr).then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.dialogVisibleSetting = false;
            this.search.patientTypeCode = this.patientTypeList.find((item) => item.patientTypeName == this.patientTypeTc).patientTypeCode;
            this.getMainList();
          }
        });
      } else {
        this.$message({
          message: '至少配置一个显示字段',
          type: 'warning',
        });
      }
    },
    remove(node, data) {
      for (let i in this.checkList) {
        if (this.checkList[i] == data.id) {
          this.checkList.splice(i, 1);
        }
      }
    },
    getlists() {
      this.$apis
        .columnqueryPageColumnConfigDisplayExt({
          page: '患者列表',
          type: this.patientTypeTc,
        })
        .then((res) => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: '患者列表',
          type: this.patientTypeTc,
        })
        .then((res) => {
          this.checkList = [];
          this.baseColumns = res.baseColumns;
          this.baseColumnsV2 = res.baseColumns;
          this.baseColumns.forEach((element) => {
            this.checkList.push(element.id);
          });
        });
    },
    book() {
      // if (this.$isProduction) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + '/#/newpatientregisterV2?type=' + this.search.patientTypeCode,
          title: `患者登记`,
        }),
        '*'
      );
      // } else {
      // window.open(
      //   location.origin +
      //     '/pc/#/newpatientregisterV2?type=' +
      //     this.search.patientType
      // )
      // }
    },
    onSearch() {
      this.pageIndex = 1;
      this.getMainList();
    },
    changeMainList() {
      //设置筛选条件签约专属
      if (this.search.patientTypeCode == this.patientModel.sign) {
        this.search.searchTimeKey = 'signTime';
        this.searchKeyList.forEach((item) => {
          if (item.value == 'packageName') {
            this.$set(item, 'disabled', false);
          }
        });
        this.timeKeyList.forEach((item) => {
          if (item.value == 'validityDatetime' || item.value == 'signTime') {
            this.$set(item, 'disabled', false);
          } else {
            this.$set(item, 'disabled', true);
          }
        });
        this.importEnable = false;
      } else if (this.search.patientTypeCode == this.patientModel.transfer) {
        this.importEnable = true;
        this.search.searchTimeKey = 'transferDatetime';
        this.timeKeyList.forEach((item) => {
          if (item.value != 'transferDatetime' && item.value != 'dischargeDatetime' && item.value != 'admissionDatetime') {
            this.$set(item, 'disabled', true);
          } else {
            this.$set(item, 'disabled', false);
          }
        });
      } else if (this.search.patientTypeCode == this.patientModel.family) {
        this.search.searchTimeKey = 'medicalDate';
        this.timeKeyList.forEach((item) => {
          if (item.value == 'medicalDate') {
            this.$set(item, 'disabled', false);
          } else {
            this.$set(item, 'disabled', true);
          }
        });
      } else {
        this.searchKeyList.forEach((item) => {
          if (item.value == 'packageName') {
            this.$set(item, 'disabled', true);
          }
        });
        this.timeKeyList.forEach((item) => {
          if (item.value == 'validityDatetime' || item.value == 'signTime' || item.value == 'transferDatetime' || item.value == 'createDatetime') {
            this.$set(item, 'disabled', true);
          } else {
            this.$set(item, 'disabled', false);
          }
        });
        this.importEnable = false;
      }
      if (this.search.patientTypeCode == 'ADMISSION_PATIENT') {
        this.timeKeyList.forEach((item) => {
          if (item.value != 'admissionDatetime' && item.value != 'registerDatetime') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'FAMILY_PATIENT') {
        this.timeKeyList.forEach((item) => {
          if (item.value != 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'INTERNET_PATIENT') {
        this.search.searchTimeKey = 'medicalDate';
        this.timeKeyList.forEach((item) => {
          if (item.value != 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'OUT_PATIENT') {
        this.search.searchTimeKey = 'medicalDate';
        this.timeKeyList.forEach((item) => {
          if (item.value != 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'DISCHARGE_PATIENT') {
        this.search.searchTimeKey = 'admissionDatetime';
        this.timeKeyList.forEach((item) => {
          if (item.value == 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'ADMISSION_PATIENT') {
        this.search.searchTimeKey = 'admissionDatetime';
        this.timeKeyList.forEach((item) => {
          if (item.value == 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'EXAMINATION_PATIENT') {
        this.search.searchTimeKey = 'medicalDate';
        this.timeKeyList.forEach((item) => {
          if (item.value != 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      if (this.search.patientTypeCode == 'OPERATION_PATIENT') {
        this.search.searchTimeKey = 'medicalDate';
        this.timeKeyList.forEach((item) => {
          if (item.value != 'medicalDate') {
            this.$set(item, 'disabled', true);
          }
        });
      }
      this.pageIndex = 1;
      this.getMainList();
    },
    getMainList() {
      this.patientTypeList.forEach((rsp) => {
        if (rsp.patientTypeCode == this.search.patientTypeCode) {
          this.patientTypeTc = rsp.patientTypeName;
        }
      });

      this.getlists();
      let query = { ...this.search };
      if (query.patientTypeCode == this.patientModel.sign) {
        query.deptId = '';
      } else {
        query.packageCode = '';
      }
      query.searchTimeVal = query.searchTimeVal ? this.search.searchTimeVal.join(',') : '';
      return this.$apis
        .getUserGroupPatientList2({
          ...query,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          let _this = this;
          setTimeout(function () {
            _this.mainList = res.list;
            _this.total = res.total;
          }, 300);
        });
    },
    refresh() {
      this.dialogVisiable = false;
      this.dialogVisibleSetting = false;
      this.pageIndex = 1;
      this.getMainList();
    },
    changeState(row) {
      this.currentRow = row;
      this.currentStatus = row.patientStateCode;
      this.dialogVisiable = true;
    },
    downloadTemplate() {
      let host = this.$baseURL.ICDMApiUrl;
      if (this.search.patientTypeCode == this.patientModel.admission) {
        location.href = host + '/templates/emr_admission_record.xlsx';
      } else if (this.search.patientTypeCode == this.patientModel.discharge) {
        location.href = host + '/templates/emr_discharge_record.xlsx';
      } else {
        location.href = host + '/templates/clinic_record.xlsx';
      }
    },
    onSuccess(response) {
      if (response.retCode === 0) {
        this.$notify({
          title: '导入完成',
          message: response.retData.errMessage,
          duration: 0,
        });
        this.getMainList();
      } else {
        this.$notify({
          title: '导入失败',
          message: response.retData ? response.retData.errMessage : '',
          type: 'error',
          duration: 0,
        });
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '导入失败',
      });
    },
    formatPatientType(row, col, val) {
      let obj = this.patientTypeList.find((item) => item.dict_code === val);
      return obj && obj.dict_name;
    },
    formatIdNo(row, col, val) {
      return this.$utils.shield(val, 3);
    },
    formatState(row, col, val) {
      let obj = this.stateList.find((item) => item.value === val);
      return obj && obj.label;
    },
    async confirmChangeState() {
      this.dialogVisiable = false;
      await this.$apis
        .PatientupdateEmrPatientStatus({
          serialNo: this.currentRow.serialNo,
          status: this.currentRow.patientStateCode,
          patientTypeCode: this.search.patientTypeCode,
          recordSerialNo: this.currentRow.recordSerialNo,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
          }
        });
      this.getMainList();
    },
    onView(row) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(row.createDatetime)}
             &recordSerialNo=${row.recordSerialNo}
            &joinPlanPatientType=${this.search.patientTypeCode}&flupPlanId=${row.flupPlanId ? row.flupPlanId : ''}&conceal=${true}`,
          title: '健康档案',
        }),
        '*'
      );
    },
    closeEvaluationDialog() {
      this.evaluationVisible = false;
      this.needStartDate = false;
    },
    closeDialog() {
      this.dialogVisibleSetting = false;
      this.patientTypeTc = this.patientTypeTcOri;
      this.getlists();
    },
    closeStatusDialog() {
      this.dialogVisiable = false;
      this.currentRow.patientStateCode = this.currentStatus;
    },
    handleCurrentChange(index) {
      this.pageIndex = index;
      this.getMainList();
    },
    handleSizeChange(size) {
      this.pageIndex = 1;
      this.pageSize = size;
      this.getMainList();
    },
    handleCurrentChange1(index) {
      this.pageIndex1 = index;
      this.getMainsList();
    },
    handleSizeChange1(size) {
      this.pageIndex1 = 1;
      this.pageSize1 = size;
      this.getMainsList();
    },
    editForm(row) {
      this.isRead = false;
      this.recordStatus = false;
      this.patientInfo = row;
      this.assessmentForm = {
        server: '',
        situation: '',
        emotion: '',
        talk: '',
        sight: '',
        heard: '',
        breath: '',
        skin: '',
        part: '',
        deep: '',
        type: '',
        part2: '',
        deep2: '',
        level: '',
        assessment: '',
        goal: [],
        yiDongShuoMing: '',
        zhiCheng: '',
        jiLuRen: '',
        jiLuRiQi: '',
      };
      this.assessmentVisible = true;
      this.continueEvaluate(false);
      if (this.$refs['form']) this.$refs['form'].resetFields();
      this.$nextTick(() => {
        this.removearia();
      });
    },
    toEdit() {
      this.isRead = false;
    },
    readForm(row) {
      this.isRead = true;
      this.recordStatus = true;
      if (this.$refs['form']) this.$refs['form'].resetFields();
      this.patientInfo = { ...row };
      this.continueEvaluate(false);
      this.$apis
        .getPatientNurseRecord({
          nurseId: row.nurseRecordId,
        })
        .then((res) => {
          this.patientInfo.clinicalDiagnosis = res.clinicalDiagnosis;
          // this.assessmentForm.goal = res.fuWuXuQiu;
          this.assessmentForm.goal = res.serviceRequirement || [];
          this.assessmentForm.talk = res.gouTong || '';
          this.assessmentForm.breath = res.huXi || '';
          this.assessmentForm.server = res.mainCaregiver || '';
          this.assessmentForm.skin = res.piFu || '';
          this.assessmentForm.emotion = res.qingXu || '';
          this.assessmentForm.part = res.shangKouBuWei || '';
          this.assessmentForm.deep = res.shangKouDaXiao || '';
          this.assessmentForm.type = res.shangKouLeiXing || '';
          this.assessmentForm.situation = res.shenXinZhuangKuang || '';
          this.assessmentForm.sight = res.shiLi || '';
          this.assessmentForm.heard = res.tingLi || '';
          this.assessmentForm.part2 = res.yaChuangBuWei || '';
          this.assessmentForm.deep2 = res.yaChuangDaXiao || '';
          this.assessmentForm.level = res.yaChuangFenJi || '';
          this.assessmentForm.assessment = res.zhaoHuWenTi || '';
          this.assessmentForm.yiDongShuoMing = res.yiDongShuoMing || '';
          this.assessmentForm.zhiCheng = res.zhiCheng || '';
          this.assessmentForm.jiLuRen = res.jiLuRen || '';
          this.assessmentForm.jiLuRiQi = res.jiLuRiQi || '';
          this.recordStatus = res.recordStatus;
        });
      this.assessmentVisible = true;
      this.$nextTick(() => {
        this.removearia();
      });
    },
    evaluate(row) {
      this.patientInfo = row;
      if (this.patientInfo.groupCondition) {
        this.alreadyIngroupVisible = true;
      } else {
        this.continueEvaluate();
      }
    },
    continueEvaluate(visible = true) {
      this.alreadyIngroupVisible = false;
      this.planId = '';
      this.executiveDept = '';
      this.fuGroupId = '';
      this.fuDoctorId = '';
      this.orderList = [];
      this.getPlanList();
      this.getOrder();
      this.evaluationVisible = visible;
    },
    getPlanList() {
      this.$apis
        .queryPatientFlupPlanList({
          hospitalId: this.$global.hospital_id,
          pageNo: 1,
          pageSize: 100,
        })
        .then((res) => {
          this.planList = res.list;
        });
    },
    changePlanList(item) {
      this.$apis.queryFlupPlanDetail(item).then((res) => {
        this.needStartDate = res.needStartDate;
        this.startDate = '';
      });
      let planItem = this.planList.find((i) => {
        return i.serialNo == item;
      });
      this.executiveDept = planItem.executiveDept;
      this.executiveDeptId = planItem.executiveDeptId;
      this.getfuGrouplist();
      this.fuGroupId = planItem.fuGroupId;
      this.getOrder();
    },
    getOrder() {
      this.orderList = [];
      this.$apis
        .listUserFlowByPlanId({
          pageNum: 1,
          pageSize: 10,
          userId: this.patientInfo.userId,
          planId: this.planId,
          flowStatus: '1,2,3',
          // token:'',
        })
        .then((res) => {
          if (res) {
            this.orderList = res.list;
            // console.log(res);
          }
        });
    },
    getfuGrouplist() {
      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: this.executiveDeptId,
        })
        .then((res) => {
          this.fuGrouplist = res;
          this.getfuDoctorlist();
        });
    },
    getfuDoctorlist() {
      this.fuDoctorId = '';
      this.$apis
        .systemManagequeryFlupGroupMembersByGroupId({
          groupId: this.fuGroupId,
        })
        .then((res) => {
          this.fuDoctorlist = res;
        });
    },
    //提交照护表
    submit() {
      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      if (!this.startDate && this.needStartDate) {
        this.$message.error('请选择任务开始时间');
        return;
      }
      this.$apis
        .patientNurseRecordSave({
          clinicNo: this.patientInfo.clinicNo,
          clinicalDiagnosis: this.patientInfo.clinicalDiagnosis,
          fuWuXuQiu: this.assessmentForm.goal,
          gouTong: this.assessmentForm.talk,
          huXi: this.assessmentForm.breath,
          mainCaregiver: this.assessmentForm.server,
          nurseId: this.patientInfo.nurseRecordId,
          patientTypeCode: this.search.patientTypeCode,
          piFu: this.assessmentForm.skin,
          qingXu: this.assessmentForm.emotion,
          shangKouBuWei: this.assessmentForm.part,
          shangKouDaXiao: this.assessmentForm.deep,
          shangKouLeiXing: this.assessmentForm.type,
          shenXinZhuangKuang: this.assessmentForm.situation,
          shiLi: this.assessmentForm.sight,
          tingLi: this.assessmentForm.heard,
          yaChuangBuWei: this.assessmentForm.part2,
          yaChuangDaXiao: this.assessmentForm.deep2,
          yaChuangFenJi: this.assessmentForm.level,
          zhaoHuWenTi: this.assessmentForm.assessment,
          patientRecordSerialNo: this.patientInfo.recordSerialNo,
          patientClinicNo: this.patientInfo.inpNo || this.patientInfo.clinicNo,
          yiDongShuoMing: this.assessmentForm.yiDongShuoMing,
          zhiCheng: this.assessmentForm.zhiCheng,
          jiLuRen: this.assessmentForm.jiLuRen,
          jiLuRiQi: this.assessmentForm.jiLuRiQi,
        })
        .then((res) => {
          // if (ToEvaluationSubmit) {
          //   this.evaluationSubmit();
          // }
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.assessmentVisible = false;
          this.getMainList();
          // }
          //     });
          // }
        });
    },
    submit2() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.startDate && this.needStartDate) {
            this.$message.error('请选择任务开始时间');
            return;
          }
          let groupPatients = [];
          let patient = {
            groupPatientRecordSerialNo: this.patientInfo.recordSerialNo,
            groupPatientRecordTime: this.patientInfo.groupDatetime,
            patientName: this.patientInfo.patientName,
            userId: this.patientInfo.userId,
            packageCode: this.patientInfo.packageCode || null,
            deptName: this.patientInfo.deptName || null,
            deptCode: this.patientInfo.deptCode || null,
            dateOfBirth: this.patientInfo.dateOfBirth,
            idNo: this.patientInfo.idNo,
          };
          groupPatients.push(patient);
          let joinGroup = null;
          if (this.disFollowupShow) {
            joinGroup = {
              patientTypeCode: this.search.patientTypeCode,
              joinType: this.patientTypeTc,
              flupPlanId: this.planId,
              groupPatients: groupPatients,
              fuDoctorName: this.fuDoctorName,
              fuDoctorId: this.fuDoctorId,
              hospitalId: this.hospitalId,
              startDate: this.startDate,
            };
          }
          this.$apis
            .patientNurseRecordSubmit({
              joinGroup,
              save: {
                clinicNo: this.patientInfo.clinicNo,
                clinicalDiagnosis: this.patientInfo.clinicalDiagnosis,
                fuWuXuQiu: this.assessmentForm.goal,
                gouTong: this.assessmentForm.talk,
                huXi: this.assessmentForm.breath,
                mainCaregiver: this.assessmentForm.server,
                nurseId: this.patientInfo.nurseRecordId,
                patientTypeCode: this.search.patientTypeCode,
                piFu: this.assessmentForm.skin,
                qingXu: this.assessmentForm.emotion,
                shangKouBuWei: this.assessmentForm.part,
                shangKouDaXiao: this.assessmentForm.deep,
                shangKouLeiXing: this.assessmentForm.type,
                shenXinZhuangKuang: this.assessmentForm.situation,
                shiLi: this.assessmentForm.sight,
                tingLi: this.assessmentForm.heard,
                yaChuangBuWei: this.assessmentForm.part2,
                yaChuangDaXiao: this.assessmentForm.deep2,
                yaChuangFenJi: this.assessmentForm.level,
                zhaoHuWenTi: this.assessmentForm.assessment,
                patientRecordSerialNo: this.patientInfo.recordSerialNo,
                patientClinicNo: this.patientInfo.inpNo || this.patientInfo.clinicNo,
                yiDongShuoMing: this.assessmentForm.yiDongShuoMing,
                zhiCheng: this.assessmentForm.zhiCheng,
                jiLuRen: this.assessmentForm.jiLuRen,
                jiLuRiQi: this.assessmentForm.jiLuRiQi,
              },
            })
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.assessmentVisible = false;
              this.getMainList();
              // }
            });
        } else {
          this.$message.error('至少选择一个服务需求');
        }
      });
    },
    submit4() {
      this.baseURL = `https://premisd.zwjk.com`;
      this.iframeUrl = `${this.baseURL}/referral/web/pc/#/listDetail?type=1&transferType=MZ&recordId=&isSee=false&operateType=1&token=${this.$route.query.token}&patientId=${this.patientInfo.userId}&hospitalId=${this.patientInfo.hospitalId}`;
      this.referralVisible = true;
    },
    submit5() {
      window.parent.postMessage(
        JSON.stringify({
          method: 'closePop',
          type: 1,
        }),
        '*'
      );
    },
    clear() {
      this.$confirm('确定清空该护照表吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.clearForm();
          this.$message({
            type: 'success',
            message: '清空成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    cancel() {
      this.assessmentVisible = false;
    },
    clearForm() {
      this.patientInfo.clinicalDiagnosis = '';
      this.assessmentForm = {
        server: '',
        situation: '',
        emotion: '',
        talk: '',
        sight: '',
        heard: '',
        breath: '',
        skin: '',
        part: '',
        deep: '',
        type: '',
        part2: '',
        deep2: '',
        level: '',
        assessment: '',
        goal: [],
        yiDongShuoMing: '',
        zhiCheng: '',
        jiLuRen: '',
        jiLuRiQi: '',
      };
    },
    async submit3(type) {
      await this.submit2();
      let referralURL = this.$baseURL.referralUrl;
      if (type == 1) {
        this.iframeUrl = `${referralURL}/pc/#/listDetail?type=1&transferType=MZ&recordId=&isSee=false&operateType=1&token=${this.$route.query.token}&patientId=${this.patientInfo.userId}&hospitalId=${this.patientInfo.hospitalId}`;
      } else if (type == 2) {
        this.iframeUrl = `${referralURL}/pc/#/beInHospital?type=1&recordId=&isSee=false&operateType=1&token=${this.$route.query.token}&patientId=${this.patientInfo.userId}&hospitalId=${this.patientInfo.hospitalId}`;
      }
      document.getElementById('referralIframe') ? document.getElementById('referralIframe').contentWindow.location.reload() : '';
      this.referralVisible = true;
    },
    //评估(入组)
    evaluationSubmit() {
      if (!this.startDate && this.needStartDate) {
        this.$message.error('请选择任务开始时间');
        return;
      }
      let groupPatients = [];
      let patient = {
        groupPatientRecordSerialNo: this.patientInfo.recordSerialNo,
        groupPatientRecordTime: this.patientInfo.groupDatetime,
        patientName: this.patientInfo.patientName,
        userId: this.patientInfo.userId,
        packageCode: this.patientInfo.packageCode || null,
        deptName: this.patientInfo.deptName || null,
        deptCode: this.patientInfo.deptCode || null,
        dateOfBirth: this.patientInfo.dateOfBirth,
        idNo: this.patientInfo.idNo,
      };
      groupPatients.push(patient);
      this.$apis
        .AddIcdmPatientManage({
          patientTypeCode: this.search.patientTypeCode,
          joinType: this.patientTypeTc,
          flupPlanId: this.planId,
          groupPatients: groupPatients,
          fuDoctorName: this.fuDoctorName,
          fuDoctorId: this.fuDoctorId,
          hospitalId: this.hospitalId,
          startDate: this.startDate,
        })
        .then((res) => {
          // console.log(res, 'ssssssssssssss');
          this.dialogVisibleV2 = false;
          let succeedCount = 0;
          let errorList = [];
          this.startDate = '';
          for (let i in res) {
            if (res[i].groupCount == 0) {
              errorList.push(res[i]);
            } else {
              succeedCount += res[i].groupCount;
            }
          }
          if (succeedCount > 0) {
            this.$message({
              message: '操作成功，共生成 ' + succeedCount + ' 条任务',
              type: 'success',
            });
            this.evaluationVisible = false;
            this.getMainList();
          }
          if (errorList.length > 0) {
            const h = this.$createElement;
            this.$notify.error({
              title: '失败',
              duration: 0,
              message: res.length > 0 ? res[0].groupInfo : '',
              // message: h('NewPatientAlert', {
              //   props: {
              //     errorList,
              //   },
              // }),
            });
          }
        });
    },
  },
};
</script>

<style lang="scss">
.patient-list-new {
  .iframe {
    height: 70vh;
    width: 100%;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #333;
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #333;
  }
  .el-input.is-disabled .el-input__inner {
    color: #333;
  }
  .width100 {
    width: 100%;
  }
  padding: 20px;
  font-size: 14px;
  color: #111;
  .el-input-group__prepend {
    color: rgb(96, 98, 102);
    background-color: #fff;
  }
  .el-button--text {
    color: #0283ef;
  }
  .select-time-key {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  .select-time-val {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  /deep/.dialog {
    .el-dialog__body {
      border: 0;
    }
  }
}
.xdzd {
  padding: 10px 30px 10px 30px;
  border: 1px solid #ccc;
  span,
  i {
    color: #32ae57;
  }
}
.checkxbox {
  .el-checkbox {
    padding: 5px 0px;
    min-width: 150px;
  }
}
.block {
  .baseInfo {
    display: flex;
    height: 64px;
    line-height: 64px;
    opacity: 1;
    background: #f8f8f8;
    margin-bottom: 24px;
    padding-left: 20px;
    .infoPart {
      width: 100%;
      // display: flex;
      // justify-content: center;
      label {
        margin: 0 20px;
      }
    }
  }
  .formTitle {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 24px;
      width: 24px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .formcontent {
    display: flex;
    flex-direction: column;
    .ori-tablE {
      border-collapse: collapse;
      td,
      th {
        border: 1px solid #e6e6e6;
        padding: 8px 16px;
        text-align: center;
      }
    }
    .queryConditions {
      display: flex;
      // margin-bottom: 15px;
      p {
        margin-right: 20px;
        width: 120px;
        display: flex;
        justify-content: end;
      }
      .el-form-item__label {
        line-height: 32px;
      }
      .noBottomMargin {
        margin-bottom: 0px;
      }
    }
    .queryConditions2 {
      .width200px {
        width: 200px;
        margin-bottom: 10px;
      }
      p {
        margin-right: 20px;
        width: 150px;
        display: flex;
        justify-content: end;
      }
      .patient {
        background: #fbfbfb;
        padding: 14px;
        &-info {
          display: flex;
          align-items: center;
          &::before {
            content: '';
            display: inline-block;
            width: 3px;
            height: 16px;
            background-color: #32ae57;
            margin-right: 8px;
          }
          i {
            color: #32ae57;
            margin: 0 6px 0 20px;
          }
        }
      }
      .fm-item {
        &-title {
          width: 200px;
        }
      }
    }
    .summary {
      .queryConditions {
        p {
          align-items: center;
          justify-content: center;
          display: flex;
        }
        .el-form-item__label {
          line-height: 32px;
        }
      }
    }
  }
}
.queryConditions-tip2 {
  align-items: center;
  justify-content: right;
  display: flex;
  width: 150px;
  margin-right: 20px;
  span {
    color: #f56c6c;
  }
}
.evaluation {
  .block {
    .queryConditions {
      display: flex;
      margin-bottom: 10px;
      p {
        align-items: center;
        justify-content: right;
        display: flex;
        width: 150px;
        margin-right: 10px;
      }
      &-tip {
        align-items: center;
        justify-content: right;
        display: flex;
        width: 150px;
        margin-right: 10px;
        span {
          color: #f56c6c;
        }
      }
    }
    .order {
      margin-left: 100px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      .orderValue {
        color: #333;
      }
    }
  }
}
</style>
