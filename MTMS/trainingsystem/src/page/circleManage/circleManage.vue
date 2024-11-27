<template>
  <div class="wapper">
    <div class="circleStatus">
      <el-radio-group @change="doFilter" v-model="filterStatus">
        <el-radio-button :disabled="disabled" label="run">轮转中</el-radio-button>
        <el-radio-button :disabled="disabled" label="wait">待入科</el-radio-button>
        <el-radio-button :disabled="disabled" label="not">未轮转</el-radio-button>
        <el-radio-button :disabled="disabled" label="end">已轮转</el-radio-button>
        <el-radio-button :disabled="disabled" label="waitOut">待出科</el-radio-button>
      </el-radio-group>
    </div>
    <div class="exportBtn">
      <el-button type="primary" @click="exportData">批量导出</el-button>
    </div>
    <div class="searchTools zy-clear">
      <div class="search-input" style="float:left">
        <el-input style="width:200px" v-model="input" placeholder="请输入姓名/手机号/学号"
          @keyup.enter.native="queryByInput"></el-input>
      </div>
      <div class="search-btn" style="float:left;margin-left:20px">
        <el-button type="primary" @click="queryByInput">搜索</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="1">
        <div class="queryAll">
          <el-button type="text" @click="queryAll">全部</el-button>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="queryTools zy-clear">
          <el-form style="float:left" :model="queryForm" :inline="true" ref="queryForm" label-width="80px">
            <div class="mainQuery">
                <hospital-base-dept1 :clearAll="rightNowClear" :useMultiSelect="true" @updateSelectIds="setQueryFormOne"
                :hasHospital="hasHospital" :showDeptTree="showDeptTree" :hasDept="hasDept"></hospital-base-dept1>
              <el-form-item label="日期" prop v-if="filterStatus == 'not'" style="width:370px;">
                <el-date-picker style="width: 135px" v-model="queryForm.startTime" type="date"
                  placeholder="选择日期"></el-date-picker>
                -
                <el-date-picker style="width: 135px" v-model="queryForm.endTime" type="date"
                  placeholder="选择日期"></el-date-picker>
              </el-form-item>

              <el-form-item label="计划年级" prop>
                <el-select filterable v-model="queryForm.period" placeholder="请选择">
                  <el-option :key="99" label="全部" :value="allvalue"></el-option>
                  <el-option :label="item.period" :value="item.period" v-for="(item, index) in baseList"
                    :key="index"></el-option>
                  <!-- </el-option> -->
                </el-select>
              </el-form-item>

              <el-form-item label="带教老师" prop v-if="filterStatus == 'run' || filterStatus == 'waitOut'">
                <el-input v-model="queryForm.techName" @keyup.enter.native="queryBySelect"></el-input>
              </el-form-item>
              <el-form-item label="是否符合出科条件" prop v-if="isConnect && filterStatus == 'waitOut'" class="longLable">
                <el-select filterable v-model="queryForm.auditStatus" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) in canOutDeptList"
                    :key="index"></el-option>
                  <!-- </el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item label="计划开始时间" prop v-if="filterStatus == 'wait'" label-width="100px">
                <el-date-picker style="width:120px" v-model="queryForm.planBeginTime" type="month"
                  placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
            <div class="additionQuery" v-show="showAdditionQuery">
              <el-form-item label="性别" prop>
                <el-select filterable v-model="queryForm.sex" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option v-for="item in [{ id: 0, name: '男' }, { id: 1, name: '女' }]" :key="item.id" :label="item.name"
                    :value="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学位" prop>
                <el-select filterable v-model="queryForm.degreeId" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option v-for="item in selectOptions.degree" :key="item.key" :label="item.name"
                    :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学员类型" prop>
                <el-select filterable v-model="queryForm.typeId" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option v-for="item in selectOptions.stud_type" :key="item.key" :label="item.name"
                    :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="完成进度" style="width:180px;margin-right:0px" prop>
                <el-select filterable v-model="queryForm.progressFrom" style="width:90px" placeholder="请选择">
                  <el-option v-for="item in [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="item" :label="item"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="—" label-width="30px" style="width:120px" prop>
                <el-select filterable v-model="queryForm.progressTo" style="width:90px" placeholder="请选择">
                  <el-option v-for="item in [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="item" :label="item"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div style="margin-bottom: 10px" v-if="filterStatus == 'waitOut' && roleAuthority['dms:run:ConfitmOutDept']">
          <el-button type="primary" @click="outBatch()">批量出科</el-button>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="queryWrap" style="float:right">
          <el-button type="text" @click="upDownSelect" :class="{ 'retract': showAdditionQuery, 'open': !showAdditionQuery }">
            <label for>{{ showAdditionQuery === false ? '展开' : '收起' }}</label>
          </el-button>
          <el-button type="primary" @click="queryBySelect" class="new-el-button">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="dataTable low-index">
      <el-table ref="detailTable" v-if="filterStatus == 'run'" key="1" :data="circleManageDatas"
        v-loading="loadingShow.turn" :element-loading-text="loadingShow.text" border tooltip-effect="dark"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column prop="stud_name" width="120" fixed="left" label="姓名">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stud_name" placement="top">
                <el-button type="text" size="small"
                  @click="personalDetail(scope.$index, scope.row)">{{ scope.row.stud_name }}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="学号"></el-table-column>
        <el-table-column prop="mobile" width="110" label="手机号"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="base" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.base" placement="top">
                <span>{{ scope.row.base }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="学员类型" width="100">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.type" placement="top">
                <span>{{ scope.row.type }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="degree" label="学位"></el-table-column>
        <el-table-column prop="turn_dept" width="120" label="轮转科室">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turn_dept" placement="top">
                <span>{{ scope.row.turn_dept }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tech_name" label="带教老师">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.tech_name" placement="top">
                <span>{{ scope.row.tech_name }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="begin_time" width="110" label="实际开始时间"></el-table-column>
        <el-table-column prop="end_time" width="110" label="计划结束时间"></el-table-column>
        <el-table-column prop="progress" width="100" label="完成进度(%)"></el-table-column>
        <el-table-column prop="period" label="计划年级"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="assignTeacher(scope.$index, scope.row)" type="text" size="small"
              v-if="scope.row.isGraduation != 2 && roleAuthority['dms:run:assignTeacher']">分配带教老师</el-button>
            <el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table ref="detailTable" v-if="filterStatus == 'wait'" key="2" :data="circleManageDatas"
        v-loading="loadingShow.turn" :element-loading-text="loadingShow.text" border tooltip-effect="dark"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column prop="stud_name" width="120" fixed="left" label="姓名">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stud_name" placement="top">
                <el-button type="text" size="small"
                  @click="personalDetail(scope.$index, scope.row)">{{ scope.row.stud_name }}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="学号"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="base" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.base" placement="top">
                <span>{{ scope.row.base }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="110" label="学员类型">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.type" placement="top">
                <span>{{ scope.row.type }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="degree" label="学位"></el-table-column>
        <el-table-column prop="turn_dept" width="120" label="待轮转科室">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turn_dept" placement="top">
                <span>{{ scope.row.turn_dept }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="begin_time" width="110" label="计划开始时间"></el-table-column>
        <el-table-column prop="end_time" width="110" label="计划结束时间"></el-table-column>
        <el-table-column prop="progress" width="100" label="完成进度(%)"></el-table-column>
        <el-table-column prop="period" label="计划年级"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="roleAuthority['dms:wait:ConfitmInDept'] && scope.row.isGraduation != 2"
              @click="openrukepanel(scope.row)" type="text" size="small">入科确认</el-button>
            <!-- <el-button v-if="roleAuthority['dms:wait:ConfitmInDept']&&scope.row.isGraduation != 2" @click="inConfirm(scope.$index, scope.row)"
              type="text" size="small">入科确认</el-button> -->
            <el-button v-if="isSecretary && autonotturncheck" @click="notConfirm(scope.$index, scope.row)" type="text"
              size="small">未轮转</el-button>
            <el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table ref="detailTable" v-if="filterStatus == 'not'" key="3" :data="circleManageDatas"
        v-loading="loadingShow.turn" :element-loading-text="loadingShow.text" border tooltip-effect="dark"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column prop="stud_name" fixed="left" label="姓名">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stud_name" placement="top">
                <el-button type="text" size="small"
                  @click="personalDetail(scope.$index, scope.row)">{{ scope.row.stud_name }}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="学号"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="base" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.base" placement="top">
                <span>{{ scope.row.base }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="学员类型" width="110"></el-table-column>
        <el-table-column prop="degree" label="学位"></el-table-column>
        <el-table-column prop="turn_dept" width="120" label="轮转科室"></el-table-column>
        <el-table-column prop="turn_dept" width="120" label="未轮转科室">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turn_dept" placement="top">
                <span>{{ scope.row.turn_dept }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="begin_time" width="110" label="计划开始时间"></el-table-column>
        <el-table-column prop="end_time" width="110" label="计划结束时间"></el-table-column>
        <el-table-column prop="progress" width="100" label="完成进度(%)"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table ref="detailTable" v-if="filterStatus == 'end'" key="4" :data="circleManageDatas"
        v-loading="loadingShow.turn" :element-loading-text="loadingShow.text" border tooltip-effect="dark"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column prop="stud_name" width="120" fixed="left" label="姓名">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stud_name" placement="top">
                <el-button type="text" size="small"
                  @click="personalDetail(scope.$index, scope.row)">{{ scope.row.stud_name }}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="学号"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="base" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.base" placement="top">
                <span>{{ scope.row.base }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="turn_dept" width="120" label="轮转科室">
        </el-table-column>
        <el-table-column prop="type" wdidth="110" label="学员类型"></el-table-column>
        <el-table-column prop="degree" label="学位"></el-table-column>

        <el-table-column prop="begin_time" width="110" label="轮转开始时间"></el-table-column>
        <el-table-column prop="end_time" width="110" label="轮转结束时间"></el-table-column>
        <el-table-column prop="progress" width="110" label="完成进度(%)"></el-table-column>
        <el-table-column prop="period" label="计划年级"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table ref="detailTable" v-if="filterStatus == 'waitOut'" key="4" :data="circleManageDatas"
        v-loading="loadingShow.turn" :element-loading-text="loadingShow.text" border tooltip-effect="dark"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="65" :selectable="selectable"></el-table-column>
        <el-table-column prop="stud_name" width="120" fixed="left" label="姓名">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stud_name" placement="top">
                <el-button type="text" size="small"
                  @click="personalDetail(scope.$index, scope.row)">{{ scope.row.stud_name }}</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="学号"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="base" width="120" label="专业基地">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.base" placement="top">
                <span>{{ scope.row.base }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" wdidth="110" label="学员类型"></el-table-column>
        <el-table-column prop="degree" label="学位"></el-table-column>
        <el-table-column prop="turn_dept" width="120" label="轮转科室">
        </el-table-column>
        <el-table-column prop="tech_name" width="110" label="带教老师"></el-table-column>
        <el-table-column prop="begin_time" width="110" label="实际开始时间"></el-table-column>
        <el-table-column prop="end_time" width="110" label="计划结束时间"></el-table-column>
        <el-table-column prop="progress" width="110" label="完成进度(%)"></el-table-column>
        <el-table-column prop="period" label="计划年级"></el-table-column>
        <el-table-column prop="auditStatus" label="是否符合出科条件" v-if="isConnect" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.auditStatus == 1 ? '是' : scope.row.auditStatus === 0 ? '否' : '待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.auditStatus == 1 && scope.row.isGraduation != 2 && roleAuthority['dms:run:ConfitmOutDept']"
              @click="showCircleConform(scope.$index, scope.row)" type="text" size="small">出科</el-button>
            <el-button @click="showCondition(scope.$index, scope.row)" type="text" size="small"
              v-if="isConnect && roleAuthority['dms:waitout:ourDeptCondition']">出科条件审核</el-button>
            <el-button @click="showDetail(scope.$index, scope.row)" type="text" size="small">轮转详情</el-button>
            <el-button @click="assignTeacher(scope.$index, scope.row)" type="text" size="small"
              v-if="roleAuthority['dms:waitout:assignTeacher']">分配带教老师</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="reqnum"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 分配带教老师 -->
    <el-dialog title="选择带教老师" :visible.sync="dialogChooseTeacher" custom-class="custom-small" v-loading="loading">
      <div class="treeTitle">当前科室</div>
      <div class="topSearch">
        <div style="float:right;margin-right:10px">
          <div class="search-input" style="float:left;">
            <el-input style="width:200px" v-model="tInput" placeholder="请输入姓名"></el-input>
          </div>
          <div class="search-btn" style="float:left;margin-left:10px">
            <el-button type="primary" @click="queryTeacherByInput">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="leftTree">
        <div class="emp-tree">{{ currentDept }}</div>
      </div>
      <div class="rightTable">
        <el-table ref="assignTable" :data="tableData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="tech_name" label="姓名" width="94"></el-table-column>
          <el-table-column prop="username" label="工号"></el-table-column>
          <el-table-column prop="title" label="职称"></el-table-column>
          <el-table-column prop="stud_num" label="带学生数量/人" width="120"></el-table-column>
          <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" @change="cancelOther(scope.$index, scope.row)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="teacherTotalCount > 10" style="float:right;margin:10px 10px" @size-change="handleTSizeChange"
          @current-change="handleTCurrentChange" :current-page="teacherPage" :page-sizes="[10, 20, 50, 100]"
          :page-size="teacherPageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="teacherTotalCount"></el-pagination>
      </div>
      <!-- <div class="bottombtn">
        <el-button :disabled="submit_btn_flag" type="primary" @click="assignTeacherSubmit" :class="{noclick:isSubmit}">确认</el-button>
        <el-button :disabled="submit_btn_flag" @click="dialogChooseTeacher=false">取消</el-button>
      </div> -->
      <div slot="footer" class="bottombtn">
        <el-button :disabled="submit_btn_flag" type="primary" @click="assignTeacherSubmit"
          :class="{ noclick: isSubmit }">确认</el-button>
        <el-button :disabled="submit_btn_flag" @click="dialogChooseTeacher = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 轮转详情 -->
    <el-dialog :title="currentStudent" size="large" :visible.sync="dialogCircleDetail" class="circleDetailDai">
      <el-table ref="detailTable" :data="circleDetailData" border tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="turn_dept" label="轮转科室" width="120">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turn_dept" placement="top">
                <span>{{ scope.row.turn_dept }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="planTurnTime" label="计划轮转时间" width="220"></el-table-column>
        <el-table-column prop="realTurnTime" label="实际轮转时间" width="220"></el-table-column>
        <el-table-column prop="tech_name" label="带教老师"></el-table-column>
        <el-table-column prop="ckstatus" label="出科考核状态"></el-table-column>
        <el-table-column prop="turn_status" label="轮转状态">
          <template slot-scope="scope">
            <template>
              <div v-if="scope.row.turnstatus == 0" style="color: rgb(249, 158, 28)">待入科</div>
              <div v-if="scope.row.turnstatus == 1" style="color: rgb(32, 219, 154)">轮转中</div>
              <div v-if="scope.row.turnstatus == 4" style="color: rgb(245, 108, 108)">未轮转</div>
              <div v-if="scope.row.turnstatus == 3" style="color: rgb(211, 220, 230)">已轮转</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="详情" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.turnstatus == 1 || scope.row.turnstatus == 3"
              @click="showTestDetail(scope.$index, scope.row)" type="text" size="small">详情</el-button>
            <el-button v-if="scope.row.turnstatus == 4" @click="dedailwhynot(scope.row, scope.$index)" type="text"
              size="small">查看原因</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 轮转记录详情 -->
    <el-dialog :title="exammonthtitle" :visible.sync="dialogExamMonths" class="circleDetailRecordSelf">
      <div class="treeTitle">轮转记录</div>
      <div class="topSearch">
        <div class style="text-align: center;line-height: 30px;">{{ thisleftname }}</div>
      </div>
      <div class="leftTree">
        <div class="emp-tree" v-for="(item, index) in kaohelist">
          <!-- {{currentDept}} -->
          <div class="namehover" @click="i = index; kaoheclick(item)">
            <span :class="{ 'active': i == index }">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="rightTable">
        <el-table v-if="thisleftname == '月度考核'" ref="assignTable" :data="rightTableData" border tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="evaluationmonth" label="日期"></el-table-column>
          <el-table-column prop="teachingscore" label="带教评分"></el-table-column>
          <el-table-column prop="teachingteacher" label="带教老师"></el-table-column>
          <el-table-column prop="headnursescore" label="护士长评分"></el-table-column>
          <el-table-column prop="headnurse" label="护士长"></el-table-column>
        </el-table>
        <el-table v-if="thisleftname == '教学活动'" ref="assignTable" :data="rightTableData" border tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="actionname" label="教学活动类型"></el-table-column>
          <el-table-column prop="actioncount" label="教学活动次数"></el-table-column>
        </el-table>
        <div v-if="thisleftname == '出科考核'" class="ckclass">
          <!-- <p>{{val.examdate}}</p> -->
          <el-table ref="assignTable" :data="rightTableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="examitem" label="考核项"></el-table-column>
            <el-table-column prop="precent" label="占比" v-if="testType == 1"></el-table-column>
            <el-table-column prop="score" label="最后得分"></el-table-column>
          </el-table>
        </div>

        <el-table v-if="thisleftname == '年度考核'" ref="assignTable" :data="rightTableData" border tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="examyear" label="考核年度"></el-table-column>
          <el-table-column prop="examdate" label="日期"></el-table-column>
          <el-table-column prop="examstatus" label="考核状态"></el-table-column>
        </el-table>
        <el-table v-if="thisleftname == '考勤统计'" ref="assignTable" :data="rightTableData" border tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="workattendname" label="考勤类型"></el-table-column>
          <el-table-column prop="count" label="天数/天"></el-table-column>
        </el-table>

        <el-table v-if="thisleftname == '轮转手册'" ref="assignTable" :data="rightTableData" border tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="diseaseName" label="任务"></el-table-column>
          <el-table-column prop="count" label="要求例数"></el-table-column>
          <el-table-column prop="waiteCheck" label="待审核例数"></el-table-column>
          <el-table-column prop="finishRate" label="完成进度"></el-table-column>
        </el-table>
        <div v-if="thisleftname == '出科小结'" class="summary-box">
          <div class="stu-box">
            <div class="title">出科小结:</div>
            <div class="content">{{ summaryData.stdAppraise }}</div>
            <div class="date-box">
              <div>{{ summaryData.stdname }}</div>
              <div>{{ summaryData.stdDate }}</div>
            </div>
          </div>
          <div class="tea-box">
            <div class="title">带教评语:</div>
            <div class="content">{{ summaryData.tecAppraise }}</div>
            <!-- <div class="singnature-box">
              <img :src="summaryData.tecsignature" />
            </div> -->
            <div class="date-box" v-if="summaryData.phase > 0">
              <div>{{ summaryData.tecname }}</div>
              <div>{{ summaryData.tecDate }}</div>
            </div>
          </div>
          <div class="director-box">
            <div class="title-box">
              <div class="title">科主任鉴定:</div>
              <el-radio v-if="summaryData.status == 1" class="radio" v-model="summaryData.status"
                label="1">同意出科</el-radio>
              <el-radio v-if="summaryData.status == 0" class="radio" v-model="summaryData.status"
                label="0">不同意出科</el-radio>
            </div>
            <div class="content">{{ summaryData.directorAppraise }}</div>
            <!-- <div class="singnature-box">
              <img :src="summaryData.directorsignature" />
            </div> -->
            <div class="date-box" v-if="summaryData.phase > 1">
              <div>{{ summaryData.directorname }}</div>
              <div>{{ summaryData.directorDate }}</div>
            </div>
          </div>
        </div>
        <div v-if="thisleftname == '日常评价'" class="dailyEvaluate">
          <div v-for="(val, i) in dailyEvaluatelist" :key="i" class="boxEvalute">
            <p>{{ val.dailyEvaluate[0].evaluateDate }}</p>
            <el-table ref="assignTable" :data="val.dailyEvaluate" border tooltip-effect="dark" style="width: 100%">
              <el-table-column prop="evaluateType" label="评价类型"></el-table-column>
              <el-table-column prop="completion" label="已完成情况">
                <template slot-scope="scope">
                  <span v-if="scope.row.completion == null || scope.row.completion === ''">未评</span>
                  <span v-else class="greenColor">已评（{{ scope.row.completion }}分）</span>
                </template>
              </el-table-column>
              <el-table-column prop="evaluationTime" label="评价日期"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>

    <!--未轮转原因 2018-07 新增业务未轮转设置-->
    <el-dialog :title="notdialogtitle" :visible.sync="whynotdialog" @close="whynotdialog = false">
      <div>
        <el-checkbox-group v-model="notcheckList">
          <el-checkbox :disabled="notdiaabled" :label="item.key" v-for="(item, index) in whynotlist"
            :key="index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="mt20">
        <el-input type="textarea" v-if="!notdiaabled" :autosize="{ minRows: 4, maxRows: 6 }" placeholder="请输入未轮转原因"
          v-model="whynottextarea"></el-input>
        <div v-if="notdiaabled">未轮转原因说明：{{ whynottextarea }}</div>
      </div>
      <div v-if="!notdiaabled" style="margin-top: 20px;float: right;">
        <el-button type="primary" @click="suerwhydialog">确认</el-button>
        <el-button @click="whynotdialog = false" class="bottomBtns">取消</el-button>
      </div>
    </el-dialog>
    <!-- 个人档案 -->
    <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    <!-- 出科鉴定 -->
    <el-dialog title="出科鉴定" :visible.sync="circleConfirm">
      <el-card class="box-card" v-if="form.evaluate.length > 0">
        <div slot="header" class="clearfix">
          <span>日常评价</span>
        </div>
        <div v-for="(item, index) in outInfoEvaluate" :key="index" class="text item">
          <p class="yearMonth">{{ item.dailyEvaluate[0].evaluateDate }}</p>
          <div v-for="citem in item.dailyEvaluate">
            <div class="line-box" v-if="citem.flag">
              <p v-if="citem.completion == null || citem.completion === ''">
                {{ citem.evaluateType }}：
                <span class="unqualified">未评</span>
              </p>
              <p v-else>
                {{ citem.evaluateType }}：
                <span class="qualified">已评（{{ citem.completion }}分）</span>
              </p>
              <p v-if="citem.completion != null && citem.completion !== ''">评价时间：{{ citem.evaluationTime }}</p>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" v-if="form.activeSetting">
        <div slot="header" class="clearfix">
          <span>教学活动</span>
        </div>
        <div class="text item">
          <p>要求{{ form.times }}次，完成{{ jxTotal }}次</p>
        </div>
      </el-card>
      <el-card class="box-card" v-if="form.examSetting.length > 0">
        <div slot="header" class="clearfix">
          <span>出科考核</span>
        </div>
        <div class="text item">
          <p class="yearMonth" v-for="(item, index) in scoreInfo" v-if="item.show && ckexamScores.type == 2" :key="index">
            <span>{{ item.title }}：要求{{ item.requestScore }}分，实际得分{{ ckexamScores[item.key] == null || ckexamScores[item.key]
              === "" ? "——" : ckexamScores[item.key] }}分</span>
            <span class="unqualified"
              v-if="ckexamScores[item.key] == null || Number(item.requestScore) > Number(ckexamScores[item.key])">不合格</span>
            <span class="qualified" v-else>合格</span>
          </p>
          <p class="yearMonth" v-for="(item, index) in scoreInfo" :key="index" v-if="ckexamScores.type == 1">
            <span>{{ item.title }}：占比{{ item.percent }}%，得分{{ ckexamScores[item.key] == null || ckexamScores[item.key] === ""
              ? "——" : ckexamScores[item.key] }}分</span>
          </p>
          <p v-if="ckexamScores.type == 1">
            <span>总分：{{ ckexamScores.proportionInfo.passScore }}分合格，实际得分{{ ckexamScores.scoreSum }}</span>
            <span class="unqualified" v-if="ckexamScores.proportionScoreStatus == 3">不合格</span>
            <span class="qualified" v-if="ckexamScores.proportionScoreStatus == 2">合格</span>
            <span v-else>——</span>
          </p>
        </div>
      </el-card>
      <div v-if="form.evaluate.length == 0 && form.examSetting.length == 0 && !form.activeSetting" class="noRequest">无出科要求
      </div>
      <div class="confirm-box">
        <el-button @click="circleConfirm = false">取消</el-button>
        <el-button type="primary" @click="openchukepanel">确认出科</el-button>
      </div>
    </el-dialog>

    <!-- 出科确认提示 -->
    <el-dialog title="提示" :visible.sync="chukepanel" class="outDeptDialog">
      <div>
        <div>
          确认对{{ currentRow.stud_name }}（{{ currentRow.turn_dept }} {{ currentRow.begin_time }}至{{ currentRow.end_time
          }}）进行出科操作吗？
        </div>
        <el-form>
          <el-form-item label="实际出科时间" class="deptDatePicker">
            <el-date-picker v-model="form.chuketime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :picker-options="outPickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="confirm-box">
          <el-button @click="chukepanel = false">取消</el-button>
          <el-button type="primary" @click="outConfirm">确认出科</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 出科条件审核 -->
    <el-dialog title="出科条件审核" :visible.sync="showConditionDialog" class="outDeptDialog">
      <div class="baseinfo">
        <p>学员：{{ currentCondition.name }}</p>
        <p>学号：{{ currentCondition.username }}</p>
        <p>轮转科室：{{ currentCondition.deptName }}</p>
        <p>培训专业：{{ currentCondition.profIdTxt }}</p>
        <p>年级：{{ currentCondition.gradeTxt }}</p>
      </div>
      <el-table :data="turnExamAuditItemVoList" border style="width: 100%" max-height="480">
        <el-table-column prop="content" label="审核项">
          <template slot-scope="scope">
            <el-tooltip effect="light" :content="scope.row.content" placement="top">
              <span class="limitOne">
                {{ scope.row.content }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="text" label="实际完成情况">
          <template slot-scope="scope">
            <p v-if="scope.row.associatedBusiness == 1">考勤签到率</p>
            <p v-if="scope.row.associatedBusiness == 2">教学活动签到率</p>
            <p v-if="scope.row.associatedBusiness == 3" @click="checkCaseDetail(scope.row)"
              :class="{ 'canlink': scope.row.completenessNum > 0 }">已提交{{ scope.row.completeness
                | filterComplete }}份</p>
          </template>
        </el-table-column>
        <el-table-column prop="auditRes" label="审核意见" width="180">
          <template slot-scope="{row,$index}">
            <el-radio-group v-model="row.auditRes" width="180" @input="changeIdea($event, row, $index)" :key="$index">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <p class="lastResultTips">整体审核意见：</p>
      <div class="lastResult">
        <span>是否符合出科条件</span>
        <el-radio-group v-model="allowOutDept" width="180" @input="changeIdea($event, {}, '', 1)">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = true">审核记录</el-button>
        <el-button @click="showConditionDialog = false">取 消</el-button>
        <el-button type="primary" @click="addTurnexamaudit" :disabled="disabledSub">提 交</el-button>
      </span>
    </el-dialog>
    <graduate-require-exa-detail :id="currentCondition.latestTurnExamAuditId" :dialogVisible.sync="dialogVisible"
      :infoWithoutId="infoWithoutId" :onlyRead="true"></graduate-require-exa-detail>
    <!-- 病历详情 -->
    <el-dialog title="病历详情" :visible.sync="showCaseDetail" class="caseDetailWidth">
      <case-detail :caseId="caseId"></case-detail>
    </el-dialog>
    <!-- 入科确认提示 -->
    <el-dialog title="提示" :visible.sync="rukepanel" class="outDeptDialog">
      <div>
        <div>
          是否确认将该学生入科？
        </div>
        <el-form>
          <el-form-item label="实际入科时间" class="deptDatePicker">
            <el-date-picker v-model="form.ruketime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :picker-options="inPickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="confirm-box">
          <el-button @click="rukepanel = false">取消</el-button>
          <el-button type="primary" @click="inConfirm">确认入科</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
import hospitalBaseDept from "../../components/hospitalBaseDept";
import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
import graduateRequireExaDetail from "../../components/graduateRequireExaDetail.vue";
import caseDetail from "../../components/caseDetail.vue";
import moment from "moment";
import { post, get, getCookie, exportExcel, downloadExcelHeader, getStorage } from "../../config/util";
import { mapState, mapActions } from "vuex";
import api from "../../config/common_data.js";
const _ = require("lodash");
export default {
  data() {
    return {
      chukepanel: false,
      rukepanel: false,
      caseId: "",
      showCaseDetail: false,
      turnExamAuditItemVoList: [{
        auditRes: ""
      }],
      disabledSub: true,
      infoWithoutId: {},
      dialogVisible: false,
      allowOutDept: "",
      isConnect: false,
      hasHospital: false,
      showDeptTree: true,
      hasDept:true,
      rightNowClear: 0,
      ckexamScores: {},
      jxTotal: 0,
      outInfoEvaluate: [],
      scoreInfo: [
        { title: "技能考核", show: false, score: "", key: "skillScore", percent: "", type: "1", requestScore: "" },
        { title: "理论考核", show: false, score: "", key: "theoryScore", percent: "", type: "2", requestScore: "" },
        { title: "综合考核", show: false, score: "", key: "compreScore", percent: "", type: "3", requestScore: "" },
        { title: "病历书写", show: false, score: "", key: "bigCaseScore", percent: "", type: "4", requestScore: "" }
      ],
      dailyEvaluatelist: [],
      circleConfirm: false,
      dialogRecords: false,
      studentDetailId: "",
      allvalue: "",
      filterStatus: "run",
      input: "",
      queryMode: 0, //0:filter,1:select,2:input
      exportInput: false,
      tInput: "",
      dialogChooseTeacher: false,
      showAdditionQuery: false,
      dialogCircleDetail: false,
      dialogTestDetail: false,
      dialogExamMonths: false,
      exammonthtitle: "",
      queryForm: {
        hospitalIdForBase: "",
        turnDeptId: "",
        studDeptId: "",
        period: "",
        techName: "",
        planBeginTime: "",
        baseId: "",
        sex: "",
        degreeId: "",
        typeId: "",
        progressFrom: "",
        progressTo: "",
        startTime: "",
        endTime: "",
        hospitalId: "",
        auditStatus: ""
      },
      canOutDeptList: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
        { label: "待审核", value: "2" },
      ],
      deptInBaseList: [],
      circleManageDatas: [],
      circleDetailData: [],
      currentDept: "",
      currentdeptId: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      testType: 0, // 1-按比例 2-按分数'  
      tableData: [],
      page: 1,
      reqnum: 10,
      totalCount: 0,
      teacherPage: 1,
      teacherPageSize: 10,
      teacherTotalCount: 0,
      currentAssignedTeacher: "",
      currentDetaId: "",
      currentStudent: "",
      turnDeptRoom: [],
      evaluationList: [],
      teacherid: "",
      studentid: "",
      evaluatedmonths: [],
      evaluateditems: {},
      selectItems: [],
      disabled: false,
      exportoption: [],
      businessid: "",
      endmonth: "", //默认月份
      iswaitall: "",
      kaohelist: [
        { name: "月度考核" },
        { name: "教学活动" },
        { name: "出科考核" },
        { name: "年度考核" },
        { name: "考勤统计" },
        { name: "轮转手册" },
        { name: "出科小结" },
        { name: "日常评价" }
      ],
      thisleftname: "", //点击的菜单
      turn_statuid: "",
      kh_id: "",
      turnidflag: false,
      rightTableData: [],
      // 2019-07-26 增加轮转手册统计
      waitCheckTotal: "",
      averageRate: "",
      //2018-05-17
      loadingShow: {
        turn: false,
        text: "加载中……"
      },
      usePage: false,
      allactioncount: 0,
      detailid: "", //详情id
      //未轮转原因
      whynotdialog: false,
      notdialogtitle: "",
      notcheckList: [],
      whynotlist: [],
      whynottextarea: "",
      notcheckid: "",
      detalid: "", //未轮转原因id
      notdiaabled: false,
      turnnum: "",
      not_studentid: "",
      autoturncheck: true, //设置自动轮转
      autonotturncheck: true, //设置自动未轮转
      i: "",
      loading: false,
      isSubmit: false,
      teach_blank_flag: "", // 是否分配了带教老师，分配了才可以传空
      submit_btn_flag: false,
      // 2019-08-09 出科小结
      summaryData: {},
      currentRowCon: {},
      currentCondition: {},
      form: {
        evaluate: [],
        activeSetting: 0,
        times: 0,
        examSetting: [],
        score: 0,
        score1: 0,
        score2: 0,
        score3: 0,
        chuketime: "",
        ruketime: ""
      },
      currentRow: {},
      selectDeptTitle: "轮转科室",
      baseList: [],
      showConditionDialog: false,
      outPickerOptions: {
        disabledDate: this.outHandledisabledate
      },
      inPickerOptions: {
        disabledDate: this.inHandledisabledate
      },
    };
  },
  components: {
    studentPersonalInfo,
    hospitalBaseDept,
    hospitalBaseDept1,
    graduateRequireExaDetail,
    caseDetail
  },
  filters: {

    filterComplete(val) {
      val = JSON.parse(val)
      return val.length
    },
  },
  watch: {
    filterStatus(newVal, oldVal) {
      this.selectDeptTitle =
        newVal == "not"
          ? "未轮转科室"
          : newVal == "run" || newVal == "end" || newVal == "waitOut"
            ? "轮转科室"
            : "待轮转科室";
    }
  },
  computed: {
    ...mapState([
      "gradeList",
      "deptList",
      "professionList",
      "educationList",

      "selectOptions",
      "deptBaseList",
      "userRole",
      "deptIdList",
      "allOption",
      "roleAuthority"
    ]),
    isSecretary() {
      return _.indexOf(this.userRole, 6) > -1;
    }
  },

  methods: {
    ...mapActions([
      "initGradeList",
      "initUserRole",
      "initDeptIdList",
      "initAllOptionListUG",
      "getRoleAuthority",
      "initSelectList"
    ]),
    // 入科日期选择禁用
    inHandledisabledate(time) {
      // console.log('this', this)
      // console.log('time', time)
      let currentdate = parseInt(new Date(time).valueOf() / 1000)
      let endstamp = parseInt(new Date(this.currentRow.maxRealEndTime).valueOf() / 1000)
      let nowstamp = parseInt(new Date().valueOf() / 1000)
      return currentdate > nowstamp || currentdate < endstamp
    },
    // 出科日期选择禁用
    outHandledisabledate(time) {
      // console.log('this', this)
      // console.log('time', time)
      // let { realBeginTime } = this.currentRow
      let currentdate = parseInt(new Date(time).valueOf() / 1000)
      let startstamp = parseInt(new Date(this.currentRow.begin_time).valueOf() / 1000)
      let nowstamp = parseInt(new Date().valueOf() / 1000)
      return currentdate > nowstamp || currentdate < startstamp - 24 * 60 * 60   //true 当前时间可以选 入科时间之后可以选   ！（入科时间《=选的时间 《=当天时间 ）
    },
    checkCaseDetail(row) {
      if (row.completeness === null || row.completenessNum == 0) {
        return false
      }
      this.showCaseDetail = true
      this.caseId = JSON.parse(row.completeness)
    },
    changeIdea(val, row, index, type) {
      let tempFlag = true
      if (type != 1) {
        const newRow = Object.assign({ auditRes: val + "" }, row)
        this.$set(this.turnExamAuditItemVoList, index, newRow);
      }
      this.turnExamAuditItemVoList.forEach(item => {
        if (item.auditRes === null || item.auditRes === "") {
          tempFlag = false
        }
      })
      if (this.allowOutDept === null || this.allowOutDept === "") {
        tempFlag = false
      }
      this.disabledSub = !tempFlag ? true : false
    },
    addTurnexamaudit() {
      if (this.allowOutDept === null || this.allowOutDept === "") {
        this.$message({
          type: "warning",
          message: "请选择整体审核意见！"
        })
        return false
      }
      post("/base/turnexamaudit/add", {
        auditUserId: getCookie('uid'),
        turnPlanDetailId: this.currentRowCon.deta_id,
        auditRes: this.turnExamAuditItemVoList,
        auditStatus: this.allowOutDept,
      }).then(res => {
        if (res && res.resCode == 200) {
          this.$message({
            type: "success",
            message: "提交成功！"
          })
          this.allowOutDept = ""
          this.doFilter();
        } else {
          this.$message({
            type: "warning",
            message: "提交失败！"
          })
        }
        this.showConditionDialog = false
      })
    },

    showCondition(index, row) {
      this.showConditionDialog = true
      this.currentRowCon = row
      this.disabledSub = true
      this.allowOutDept = ""
      post(`/base/turnexamaudititem/getStdTurnExamAuditItem?turnPlanDetailId=${row.deta_id}`).then(res => {
        if (res && res.resCode == 200) {
          this.currentCondition = res.model
          this.turnExamAuditItemVoList = res.model.turnExamAuditItemVoList
          this.turnExamAuditItemVoList.forEach(item => {
            item.auditRes = ""
            if (item.associatedBusiness == 3) {
              item.completenessNum = item.completeness == null || JSON.parse(item.completeness).length == 0 ? 0 : JSON.parse(item.completeness).length
            }

          })

          if (res.model.latestTurnExamAuditId == "" || res.model.latestTurnExamAuditId == null) {
            this.infoWithoutId = {
              name: res.model.name,         //学员
              code: res.model.username,        //学号
              deptName: res.model.deptName,       //轮转科室
              profIdTxt: res.model.profIdTxt,        //培训专业
              turngradeTxt: res.model.gradeTxt, //年级
            }
          }
        }
      })
    },
    selectable(row, index) {
      if (this.isConnect) {
        if (row.auditStatus == 1 && this.isConnect && row.isGraduation != 2) {
          return true;
        } else {
          return false
        }
      } else {
        return true;
      }
    },
    setQueryFormOne(form) {
      if (form.hospitalIdForBase == "") {
        this.queryForm.baseId = form.baseId
        this.queryForm.hospitalIdForBase = ""
      } else {
        this.queryForm.baseId = ""
        this.queryForm.hospitalIdForBase = form.hospitalIdForBase
      }
      if (form.hospitalId == "") {
        this.queryForm.hospitalId = ""
        this.queryForm.turnDeptId = form.deptId
      } else {
        this.queryForm.hospitalId = form.hospitalId
        this.queryForm.turnDeptId = ""
      }
    },
    querySetting() {
      post("/commparaconf/queryCommparaConfList", {
        command: "commparaconf/queryCommparaConfList",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        paramcode: "ck_settings"
      }).then(data => {
        // this.commparaConfList = {}
        data.commparaConfList.forEach(item => {
          switch (item.paramvalue) {
            case "3":
              if (item.param1 == 1) {
                this.form.evaluate.push("0");
              }
              if (item.param2 == 1) {
                this.form.evaluate.push("1");
              }
              if (item.param3 == 1) {
                this.form.evaluate.push("2");
              }
              if (item.param4 == 1) {
                this.form.evaluate.push("3");
              }
              break;
            case "4":
              this.form.activeSetting = Number(item.param1);
              this.form.times = item.param2 == null ? 0 : Number(item.param2);
              break;
            case "5":
              if (item.param9 == 0) {
                if (item.param1 == 1) {
                  this.form.examSetting.push("0");
                  this.scoreInfo[0].show = true;
                }
                if (item.param3 == 1) {
                  this.form.examSetting.push("1");
                  this.scoreInfo[1].show = true;
                }
                if (item.param5 == 1) {
                  this.form.examSetting.push("2");
                  this.scoreInfo[2].show = true;
                }
                if (item.param7 == 1) {
                  this.form.examSetting.push("3");
                  this.scoreInfo[3].show = true;
                }
              } else if (item.param9 == 1) {
                this.form.examSetting = ["1", "2", "3", "4"]
                this.scoreInfo.forEach(item => {
                  item.show = true
                })
              }
              break;
            case "9":
              this.isConnect = item.param1 == 1 ? true : false;
              break;
            default:
              break;
          }
        });
      });
    },
    showCircleConform(index, row) {
      this.currentRow = row;
      post("/turn/GraduationIdenty", {
        command: "turn/GraduationIdenty",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        paramcode: "ck_settings",
        paramvalue: "5",
        turnstatus: 3,
        detailid: row.deta_id
      }).then(data => {
        if (data && data.errcode == 0) {
          this.circleConfirm = true;
          this.jxTotal = data.total;
          this.ckexamScores = data.CKExamScore;
          data.dailyEvaluatelist.forEach(item => {
            item.dailyEvaluate.forEach(citem => {
              if (citem.typeId == 1) {
                citem.flag =
                  this.form.evaluate.join(",").indexOf("0") > -1 ? true : false;
              }
              if (citem.typeId == 5) {
                citem.flag =
                  this.form.evaluate.join(",").indexOf("1") > -1 ? true : false;
              }
              if (citem.typeId == 4) {
                citem.flag =
                  this.form.evaluate.join(",").indexOf("2") > -1 ? true : false;
              }
              if (citem.typeId == 12) {
                citem.flag =
                  this.form.evaluate.join(",").indexOf("3") > -1 ? true : false;
              }
            });
          });
          this.scoreInfo.forEach(item => {
            if (data.CKExamScore.type == 1) {
              if (item.type == 1) {
                item.percent = parseInt(Number(data.CKExamScore.proportionInfo.skillScoreProportion) * 100)
              }
              if (item.type == 2) {
                item.percent = parseInt(Number(data.CKExamScore.proportionInfo.theoryScoreProportion) * 100)
              }
              if (item.type == 3) {
                item.percent = parseInt(Number(data.CKExamScore.proportionInfo.compreScoreProportion) * 100)
              }
              if (item.type == 4) {
                item.percent = parseInt(Number(data.CKExamScore.proportionInfo.bigCaseScoreProportion) * 100)
              }

            } else {

              if (item.type == 1) {
                item.requestScore = data.CKExamScore.proportionInfo.passSkillScore
              }
              if (item.type == 2) {
                item.requestScore = data.CKExamScore.proportionInfo.passTheoryScore
              }
              if (item.type == 3) {
                item.requestScore = data.CKExamScore.proportionInfo.passCompreScore
              }
              if (item.type == 4) {
                item.requestScore = data.CKExamScore.proportionInfo.passBigCaseScore
              }

            }
          })
          this.outInfoEvaluate = data.dailyEvaluatelist;
        }
      });
    },
    personalDetail(index, row) {
      this.dialogRecords = true;
      this.studentDetailId = row.stud_id;
    },
    //查询未轮转列表
    getnotinfolist: function () {
      let self = this;
      post("/traineestudent/queryDictionaryList", {
        command: "traineestudent/queryDictionaryList",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        code: "turnnotinfo"
      }).then(data => {
        if (data && data.errcode == 0) {
          self.whynotlist = data.dic_list;
        }
      });
    },

    handleSelectionChange(r) {
      let array = []
      r.forEach(i => {
        array.push({
          "tpdid": i.deta_id,
          "name": i.stud_name,
          "uid": i.stud_id,
          "num": i.turn_num
        })
      })
      this.selectItems = array
      // this.selectItems = r.map(item => {
      //   return item.deta_id;
      // });
    },
    outBatch() {
      if (this.selectItems.length) {
        const h = this.$createElement;
        this.$msgbox({
          title: '批量出科',
          message: h('div', null, [
            h('div', `已选${this.selectItems.length}人`),
            h('div', '确认进行出科操作吗?')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
          post("/turn/batchTurnOutValidate", {
            command: "turn/batchTurnOutValidate",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            turnstatus: 3,
            menusId: getStorage('menuId'),
            list: this.selectItems
          }).then(data => {
            if (data && data.errcode == 0) {
              this.$message({
                message: '批量出科成功',
                type: 'success'
              });
            }
          })
          post("/turn/batchUpdateTurnStatus", {
            command: "turn/batchUpdateTurnStatus",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            turnstatus: 3,
            menusId: getStorage('menuId'),
            list: this.selectItems
          }).then(data => {
            if (data && data.errcode == 0) {
              this.$message({
                message: '批量出科成功',
                type: 'success'
              });
              this.doFilter();
            } else {
              this.$message.error(data.errdesc);
            }
          })

        }).catch(() => {

        });
      } else {
        this.$message({
          message: '至少选择一位学员',
          type: 'warning'
        });
      }
    },
    doFilter() {
      this.queryMode = 0;
      this.input = "";
      this.queryForm = {
        turnDeptId: "",
        studDeptId: "",
        period: "",
        techName: "",
        planBeginTime: "",
        baseId: "",
        sex: "",
        degreeId: "",
        typeId: "",
        progressFrom: "",
        progressTo: "",
        startTime: "",
        endTime: "",
        deptIdName: "",
      };
      let option = {
        queryType: this.filterStatus,
        // query_type: "end",
        turnDeptId: ""
      };
      this.rightNowClear = this.rightNowClear + 1
      this.queryCircleList(option);
      this.disabled = true;
    },
    queryCircleList(option) {
      let self = this;
      if (option.queryType == "wait") {
        if (
          (this.queryForm.planBeginTime == "" ||
            !this.queryForm.planBeginTime) &&
          (!this.input || this.input == "")
        ) {
          let date = new Date();
          self.endmonth = Number(date.getMonth() + 1);
          if (self.endmonth < 10) {
            self.endmonth = "0" + self.endmonth;
          }
          option.planBeginTime =
            date.getFullYear() + "-" + self.endmonth + "-" + "01"; //
          this.queryForm.planBeginTime =
            date.getFullYear() + "-" + self.endmonth + "-" + "01"; //
          this.iswaitall = "wait";
        }
      }
      if (this.isConnect && option.queryType == "waitOut" && this.queryForm.auditStatus !== undefined) {
        option.auditStatus = this.queryForm.auditStatus
      }

      self.exportoption = option;
      option.turnDeptId = null;
      option.deptIdList = (this.queryForm.turnDeptId && this.queryForm.turnDeptId.length > 0) ? this.queryForm.turnDeptId : []
      this.loadingShow.turn = true;
      post(`/base/turn/queryTurnRecordList?pageNum=${this.page}&pageSize=${this.reqnum}`, {
        sessionid: getCookie("sid"),
        loginId: getCookie("uid"),
        ...option
      })
        .then(data => {
          if (data && data.resCode == 200) {
            if (!this.isConnect && this.filterStatus == 'waitOut') {
              data.rows.forEach(item => {
                item.auditStatus = 1
              })
            }
            self.circleManageDatas = data.rows;
            self.totalCount = data.total;
            self.disabled = false;
          } else {
            this.disabled = false;
          }
          this.loadingShow.turn = false;
          this.usePage = false;
        })
        .catch(() => {
          this.loadingShow.turn = false;
          this.usePage = false;
        });
    },
    queryAll() {
      this.queryMode = 1;
      let _plan_begin_time = "";
      if (this.iswaitall == "wait") {
        let date = new Date();
        this.endmonth = Number(date.getMonth() + 1);
        if (this.endmonth < 10) {
          this.endmonth = "0" + this.endmonth;
        }
        _plan_begin_time =
          date.getFullYear() + "-" + this.endmonth + "-" + "01"; //
      }
      this.queryForm = {
        turnDeptId: "",
        studDeptId: "",
        period: "",
        techName: "",
        planBeginTime: _plan_begin_time,
        baseId: "",
        sex: "",
        degreeId: "",
        typeId: "",
        progressFrom: "",
        progressTo: "",
        startTime: "",
        endTime: "",
        hospitalId: "",
        auditStatus: ""
      };
      (this.rightNowClear = this.rightNowClear + 1), (this.input = "");
      this.exportInput = false;
      this.queryCircleList({
        queryType: this.filterStatus,
        turn_dept_id: "",
        planBeginTime: this.queryForm.planBeginTime
      });
    },
    upDownSelect() {
      this.showAdditionQuery = !this.showAdditionQuery;
      this.queryForm.baseId = "";
      this.queryForm.studDeptId = "";
      this.queryForm.sex = "";
      this.queryForm.degreeId = "";
      this.queryForm.typeId = "";
      this.queryForm.progressFrom = "";
      this.queryForm.progressTo = "";
    },
    queryBySelect() {
      // this.page=1;//确保每次都是从一页查找
      this.justQuery();
    },
    justQuery() {
      this.queryMode = 1;
      this.input = "";
      this.queryForm.planBeginTime &&
        (this.queryForm.planBeginTime = moment(
          this.queryForm.planBeginTime
        ).format("YYYY-MM-DD"));
      let deptId = this.queryForm.turnDeptId;
      this.queryForm.startTime &&
        (this.queryForm.startTime = moment(this.queryForm.startTime).format(
          "YYYY-MM-DD"
        ));
      this.queryForm.endTime &&
        (this.queryForm.endTime = moment(this.queryForm.endTime).format(
          "YYYY-MM-DD"
        ));
      this.queryCircleList({
        ...this.queryForm,
        queryType: this.filterStatus,
        turnDeptId: deptId
      });
    },
    queryByInput() {
      // this.page=1;//确保每次都是从一页查找
      this.justInputQuery();
    },
    justInputQuery() {
      this.queryMode = 2;
      this.queryForm = {
        turnDeptId: "",
        studDeptId: "",
        period: "",
        techName: "",
        planBeginTime: "",
        baseId: "",
        sex: "",
        degreeId: "",
        typeId: "",
        progressFrom: "",
        progressTo: "",
        hospitalId: ""
      };
      let option = {
        queryType: this.filterStatus,
        searchInfo: this.input,
        turnDeptId: ""
      };
      // option.page=this.page;
      this.queryCircleList(option);
      this.exportInput = true;
    },
    exportData() {
      let data = {
        ...this.queryForm,
        queryType: this.filterStatus,
        turnDeptId: this.queryForm.turnDeptId,
        menusId: getStorage("menuId"),
        loginId: getCookie("uid"),
      }
      console.log(data)
      let exportName = this.getExportName(this.filterStatus)
      let url = this.serlizeParams("/base/turn/export", data)
      downloadExcelHeader(url, exportName).then(res => {
      });
      // exportExcel(data);
    },
    getExportName(status) {
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      if (status == "run") {
        return `${year}年${month}月轮转中名单`
      } else if (status == "wait") {
        return `${year}年${month}月待入科名单`
      } else if (status == "not") {
        return `${year}年${month}月未轮转名单`
      } else if (status == "end") {
        return `${year}年${month}月已轮转名单`
      } else if (status == "waitOut") {
        return `${year}年${month}月待出科名单`
      }
    },
    serlizeParams(url, params) {
      let paramsStr = "";
      for (let key in params) {
        paramsStr = paramsStr + "&" + key + "=" + params[key];
      }
      paramsStr = paramsStr.substring(1);
      return url + "?" + paramsStr;
    },

    //分配带教老师
    assignTeacher(index, row) {
      let self = this;
      self.teacherPage = 1;
      self.tInput = "";
      self.currentDept = row.turn_dept;
      self.currentdeptId = row.dept_id;
      self.currentDetaId = row.deta_id;
      self.teach_blank_flag = row.tech_name ? true : false;
      self.queryTeacherList({ dept_id: row.dept_id, detailid: row.deta_id });
      self.dialogChooseTeacher = true;
    },
    queryTeacherByInput() {
      if (this.teacherPage == 1) {
        this.queryTeacherList({
          search_info: this.tInput,
          dept_id: this.currentdeptId
        });
      } else {
        this.teacherPage = 1;
      }
    },
    queryTeacherList(option) {
      let self = this;
      post("/turn/queryTeacherList", {
        command: "turn/queryTeacherList",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        reqnum: this.teacherPageSize,
        dept_id: this.currentdeptId,
        ...option
      }).then(data => {
        if (data && data.errcode == 0) {
          self.tableData = data.dept_teach_list;
          self.tableData.forEach(item => {
            if (item.teachingflag) {
              self.$set(item, "checked", true);
              self.currentAssignedTeacher = item.tech_id;
            } else {
              self.$set(item, "checked", false);
            }
          });
          this.teacherTotalCount = data.count
        }
      });
    },
    assignTeacherSubmit() {
      this.isSubmit = true;
      if (this.teach_blank_flag == false && this.currentAssignedTeacher == "") {
        this.$message({
          type: "info",
          message: "请选择一名带教老师!"
        });
        return;
      }
      let self = this;
      self.submit_btn_flag = true;
      post("/turn/assignedTeacher", {
        command: "turn/assignedTeacher",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        deta_id: this.currentDetaId,
        tech_id: this.currentAssignedTeacher
      })
        .then(data => {
          this.isSubmit = false;
          if (data && data.errcode == 0) {
            self.$message({
              type: "success",
              message: "分配成功!"
            });
            self.dialogChooseTeacher = false;
            self.doFilter();
            self.submit_btn_flag = false;
          } else {
            self.$message.error("分配失败");
            self.submit_btn_flag = false;
          }
        })
        .catch(() => {
          self.$message.error("分配失败");
          this.isSubmit = false;
          self.submit_btn_flag = false;
        });
    },
    outConfirm() {
      let self = this;
      if (self.form.chuketime == null) {
          self.$message.error("出科时间不能为空");
          return false
        }
        post("/turn/turnoutvalidate", {
          command: "turn/turnoutvalidate",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          id: self.currentRow.deta_id,
          turnstatus: 10
        })
          .then(data => {
            if (data && (data.errcode == 0 || data.errcode == "400507")) {
              post("/turn/updateturnstatus", {
                command: "turn/updateturnstatus",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                uid: self.currentRow.stud_id,
                tpdid: self.currentRow.deta_id,
                num: self.currentRow.turn_num,
                turnstatus: 3,
                realEndTime: moment(self.form.chuketime).format("YYYY-MM-DD")
              })
                .then(data => {
                  if (data && data.errcode == 0) {
                    self.$message({
                      type: "success",
                      message: "出科成功!"
                    });
                    self.doFilter();
                    self.circleConfirm = false;
                  } else if (data && data.errcode == "4005") {
                    self.$message.error("该住院医未分配带教老师，不能出科！");
                  } else {
                    self.$message.error("出科失败");
                  }
                })
                .catch(() => {
                  self.$message.error("出科失败");
                });
            }
            else {
              self.$message.error("出科提示失败");
            }
          })
          .catch(() => {
            self.$message.error("出科失败");
          });
        self.chukepanel = false
        self.circleConfirm = false
      },

    //入科
    inConfirm(index, row) {
      let self = this;
      if (self.form.ruketime == null) {
        self.$message.error("入科时间不能为空");
        return false
      }
      post("/turn/updateturnstatus", {
        command: "turn/updateturnstatus",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        uid: self.currentRow.stud_id,
        tpdid: self.currentRow.deta_id,
        num: self.currentRow.turn_num,
        turnstatus: 1,
        realBeginTime: moment(self.form.ruketime).format("YYYY-MM-DD")
      })
        .then(data => {
          if (data && data.errcode == 0) {
            self.$message({
              type: "success",
              message: "入科成功!"
            });
            self.doFilter();
          } else if (data && data.errdesc) {
            self.$message.error(data.errdesc);
          } else {
            self.$message.error("入科失败");
          }
        })
        .catch(() => {
          self.$message.error("入科失败");
        });
      self.rukepanel = false
      self.circleConfirm = false
    },

    //未轮转
    notConfirm(index, row) {
      let self = this;
      self.whynotdialog = true;
      self.notdialogtitle = "请选择未轮转原因";
      self.notcheckList = [];
      self.notcheckid = row.deta_id;
      self.turnnum = row.turn_num;
      self.notdiaabled = false;
      self.whynottextarea = "";
      self.not_studentid = row.stud_id;
    },
    //提交未轮转原因
    suerwhydialog() {
      let self = this;
      if (self.notcheckList.length < 1) {
        self.$message({
          type: "warning",
          message: "请至少选择一条未轮转原因!"
        });
      } else {
        post("/turn/updateturnstatus", {
          command: "turn/updateturnstatus",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          uid: self.not_studentid,
          tpdid: self.notcheckid,
          turnstatus: 4,
          num: self.turnnum,
          turnnotkeylist: self.notcheckList, //勾选的未轮转原因,
          remark: self.whynottextarea
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.doFilter();
            self.whynotdialog = false;
          } else {
            self.$message({
              type: "warning",
              message: data.errdesc
            });
          }
        });
      }
    },
    //查看未轮转原因
    dedailwhynot(row, index) {
      let self = this;
      self.notcheckList = [];
      row.turnnotlist.map(item => {
        self.notcheckList.push(String(item.turnnotinfo));
      });
      self.whynottextarea = row.remark;
      self.notdialogtitle = "查看未轮转原因";
      self.whynotdialog = true;
      self.notdiaabled = true;
    },

    //列表转轮转详情
    showDetail(index, row) {
      let self = this;
      self.studentid = "";
      self.studentid = row.stud_id;
      self.detailid = row.deta_id;
      self.currentStudent = row.stud_name + "的轮转详情";
      post("/turn/queryStudTurnRecord", {
        command: "turn/queryStudTurnRecord",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        plan_id: row.plan_id,
        stud_id: row.stud_id
      }).then(data => {
        if (data && data.errcode == 0) {
          self.circleDetailData = data.stud_turn_record.map(item => {
            let str1 = "",
              str2 = "";
            if (item.plan_begin_time || item.plan_end_time) {
              str1 = item.plan_begin_time + " —— " + item.plan_end_time;
            }
            if (item.real_begin_time || item.real_end_time) {
              //(item.real_end_time?item.real_end_time:'正在轮转中');
              str2 = item.real_begin_time + " —— " + item.real_end_time;
            }
            return {
              turn_dept: item.turn_dept,
              planTurnTime: str1,
              realTurnTime: str2,
              tech_name: item.tech_name,
              turn_status: item.turn_status,
              tech_id: item.tech_id,
              businessid: item.rec_id,
              turnstatus: item.turnstatus,
              turnnotlist: item.turnnotlist,
              remark: item.remark,
              ckstatus: item.ckstatus
            };
          });
        }
      });
      this.dialogCircleDetail = true;
    },

    showTestDetail(index, row) {
      this.kh_id = row.businessid;
      this.turn_statuid = row.turnstatus;
      this.kaoheclick({ name: "月度考核" });
      this.i = 0;
      this.exammonthtitle = "【" + row.turn_dept + "】" + this.currentStudent;
      this.dialogExamMonths = true;
    },
    //考核详情列表类别
    kaoheclick(k) {
      let self = this;
      self.rightTableData = [];
      self.thisleftname = k.name;
      if (k.name && k.name == "月度考核") {
        //日常考核
        post("/dailyevaluation/querydailyexambydetailid", {
          command: "dailyevaluation/querydailyexambydetailid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          detailid: self.kh_id //轮转详情id
        }).then(data => {
          if (data && data.errcode == 0) {
            self.rightTableData = data.dailyexamlist;
          }
        });
      } else if (k.name && k.name == "教学活动") {
        //教学活动
        post("/teachingactivityplan/queryactivitycountbydetailid", {
          command: "teachingactivityplan/queryactivitycountbydetailid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          detailid: self.kh_id, //轮转详情id
          turnstatus: self.turn_statuid //轮转状态
        }).then(data => {
          if (data && data.errcode == 0) {
            (self.allactioncount = 0),
              data.activitycountlist.map(item => {
                self.allactioncount += item.actioncount;
              });
            data.activitycountlist.push({
              actioncount: self.allactioncount,
              actionname: "总计"
            });
            self.rightTableData = data.activitycountlist;
          }
        });
      } else if (k.name && k.name == "出科考核") {
        //出科考核
        get(`/base/turnScore/getPlanScore/${self.kh_id}`).then(data => {
          if (data && data.resCode == 200) {
            if (data.model != null || data.model != "") {
              this.testType = data.model.type
              self.rightTableData = [
                { examitem: "理论考试", score: data.model.theoryScore, precent: data.model.type == 1 ? `${parseInt(Number(data.model.proportionInfo.theoryScoreProportion) * 100)}%` : "" },
                { examitem: "技能考试", score: data.model.skillScore, precent: data.model.type == 1 ? `${parseInt(Number(data.model.proportionInfo.skillScoreProportion) * 100)}%` : "" },
                { examitem: "综合考试", score: data.model.compreScore, precent: data.model.type == 1 ? `${parseInt(Number(data.model.proportionInfo.compreScoreProportion) * 100)}%` : "" },
                { examitem: "大病历", score: data.model.bigCaseScore, precent: data.model.type == 1 ? `${parseInt(Number(data.model.proportionInfo.bigCaseScoreProportion) * 100)}%` : "" },
              ]
              if (data.model.type == 1) {
                self.rightTableData.push({ examitem: "总分", score: data.model.scoreSum, precent: data.model.type == 1 ? '--' : "" })
              }
            }
          }
        });
      } else if (k.name && k.name == "年度考核") {
        //年度考核
        post("/turnannualresult/queryannualscorebydetailid", {
          command: "turnannualresult/queryannualscorebydetailid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          detailid: self.kh_id //轮转详情id
        }).then(data => {
          if (data && data.errcode == 0) {
            self.rightTableData = data.annualscorelist;
          }
        });
      } else if (k.name && k.name == "考勤统计") {
        //考勤统计
        post("/workattendance/getuserworkattendcount", {
          command: "workattendance/getuserworkattendcount",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          businessid: self.kh_id, //轮转详情id
          systype: 1
        }).then(data => {
          if (data && data.errcode == 0) {
            self.rightTableData = data.workattendinfo.countlist;
          }
        });
      } else if (k.name && k.name == "轮转手册") {
        post("/turn/getturndetailbyid", {
          command: "turn/getturndetailbyid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          plandetailid: self.kh_id //轮转详情id
        }).then(function (data) {
          if (data && data.errcode == 0) {
            // *** 轮转手册 phase为null 传0, 有值阶段数加一 ***
            let phase = data.detailinfo.phase
              ? parseInt(data.detailinfo.phase) + 1
              : 0;
            self.getTurnManualData(
              data.detailinfo.turnId,
              data.detailinfo.deptid,
              data.detailinfo.stdid,
              phase
            );
          }
        });
      } else if (k.name && k.name == "出科小结") {
        post("/turn/getturndetailbyid", {
          command: "turn/getturndetailbyid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          plandetailid: self.kh_id //轮转详情id
        }).then(function (data) {
          if (data && data.errcode == 0) {
            api
              .getTurnAppraise(data.detailinfo.turnId, self.kh_id)
              .then(res => {
                self.summaryData = res;
              });
          }
        });
      } else if (k.name && k.name == "日常评价") {
        post("/turn/DailyEvaluates", {
          command: "turn/DailyEvaluates",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          detailid: self.kh_id //轮转详情id
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.dailyEvaluatelist = data.dailyEvaluatelist;
          }
        });
      } else {
        return;
      }
    },

    // 获取轮转手册数据
    getTurnManualData(turnId, deptId, stdId, phase) {
      post("/turnManual/queryTurnManualDiseaseDeptList", {
        command: "turnManual/queryTurnManualDiseaseDeptList",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        turnId: turnId,
        deptId: deptId,
        stdId: stdId,
        stage: phase,
        plandetailid: this.kh_id
      }).then(data => {
        if (data && data.errcode == 0) {
          if (data.result.length > 0) {
            let total = 0,
              average = 0;
            data.result.map(item => {
              total += parseInt(item.waiteCheck);
              average += parseFloat(item.finishRate);
              item.finishRate = parseInt(item.finishRate) + "%";
            });

            let averageRate =
              parseFloat(average / data.result.length).toFixed(2) + "%";
            let obj = {
              diseaseName: "总计",
              waiteCheck: total,
              finishRate: averageRate
            };
            data.result.push(obj);
            this.rightTableData = data.result;
          }
        }
      });
    },

    showExamDetail(index, row) {
      let self = this;
      post("/turn/queryevaluationitems", {
        command: "turn/queryevaluationitems",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        evaluatedid: self.studentid,
        type: 4
      }).then(function (data) {
        post("/turn/queryevaluateditems", {
          command: "turn/queryevaluateditems",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          id: row.id
        }).then(function (data) {
          self.evaluateditems = data;
        });
      });
    },
    cancelOther(index, row) {
      this.tableData.forEach((item, idx) => {
        if (idx != index) {
          item.checked && (item.checked = false);
        }
      });
      this.currentAssignedTeacher = row.checked ? row.tech_id : "";
    },

    handleSizeChange(size) {
      this.reqnum = size;
      if (this.input) {
        this.justInputQuery();
      } else {
        this.justQuery();
      }
    },
    handleTSizeChange(size) {
      this.teacherPageSize = size;
      this.teacherPage = 1;
      this.queryTeacherList({
        page: this.teacherPage,
        detailid: this.currentDetaId
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.usePage = true;
      if (this.queryMode === 2) {
        this.justInputQuery();
      } else if (this.queryMode === 1) {
        this.justQuery();
      } else {
        this.doFilter();
      }
    },
    handleTCurrentChange(page) {
      this.teacherPage = page;
      this.queryTeacherList({
        page: this.teacherPage,
        search_info: this.tInput,
        dept_id: this.currentdeptId,
        detailid: this.currentDetaId
      });
    },

    //自动出科配置
    initautoturnckconf: function () {
      post("/turn/ckparaminfo", {
        command: "turn/ckparaminfo",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        code: "autoturnckconf",
        paramvalue: 1
      }).then(data => {
        if (data && data.errcode == 0) {
          this.autoturncheck = data.value == 1 ? false : true;
        }
      });
    },

    //自动未轮转设置
    initautonotturnckconf: function () {
      post("/turn/ckparaminfo", {
        command: "turn/ckparaminfo",
        sessionid: getCookie("sid"),
        loginid: getCookie("uid"),
        code: "autonotturnconf",
        paramvalue: 1
      }).then(data => {
        if (data && data.errcode == 0) {
          this.autonotturncheck = data.value == 1 ? false : true;
        }
      });
    },
    getSelectList() {
      post('/turn/queryPeriodList', {
        command: 'turn/queryPeriodList',
        sessionid: getCookie('sid'),
        loginid: getCookie('uid'),
      }).then(data => {
        if (data && data.errcode == 0) {
          this.baseList = data.period_list
        }
      })
    },
    openrukepanel(row) {
      this.currentRow = row
      this.rukepanel = true
      this.form.ruketime = new Date()
    },
    openchukepanel() {
      this.chukepanel = true
      this.form.chuketime = new Date()
    },



  },

  mounted() {
    this.querySetting();
    this.getRoleAuthority();
    this.initGradeList();
    this.initDeptIdList().then(() => {
      this.doFilter();
    });
    // this.initAllOptionListUG({ type: "degree" });
    this.getSelectList();
    this.initAllOptionListUG({ type: "traineeplangrade" });
    this.initUserRole();
    this.getnotinfolist(); // 未轮转列表
    this.initautoturnckconf();
    this.initautonotturnckconf();
    this.initSelectList({ type: 'stud_type,degree' })
    if (this.$route.query.form) {
      this.filterStatus = this.$route.query.form;
      this.selectDeptTitle =
        this.filterStatus == "not"
          ? "未轮转科室"
          : this.filterStatus == "run"
            ? "轮转科室"
            : "待轮转科室";
    }
  }
};
</script>
<style scoped>
.wapper {
  padding: 0 20px;
}

.canlink {
  color: #1989fa;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.6);
  border-radius: 20px;
}

.dailyEvaluate {
  max-height: 550px;
  overflow-y: scroll;
}

.longLable {
  width: 250px;
}

/* .longLable .el-form-item__label {
    width: 130px;
  } */

.boxEvalute p {
  margin-left: 14px;
  line-height: 38px;
  font-size: 14px;
}

.greenColor {
  color: green;
}

.mt20 {
  margin-top: 20px;
}

.circleStatus {
  display: inline-block;
  height: 37px;
  overflow: hidden;
}

.statusInnerWapper {
  width: 250px;
  height: 45px;
  overflow: hidden;
}

.exportBtn {
  display: inline-block;
  position: relative;
  top: -17px;
  margin-left: 87px;
}

.queryTools {
  float: left;
  width: 100%;
}

.queryAll {
  float: left;
  margin-right: 12px;
}

.additionQuery {
  width: 800px;
}

.showMore {
  width: 50px;
}

.funcBtns {
  width: 80px;
}

.searchTools {
  float: right;
}

.queryTools .el-form-item {
  width: 220px;
  margin-bottom: 10px;
}

.el-select {
  width: 120px;
}

.queryTools .el-input {
  width: 120px;
}

.dataTable {
  margin-top: 20px;
  overflow-y: auto;
}

.tableWapper {
  /*width: 96%;*/
}

.treeTitle {
  width: 20%;
  height: 56px;
  box-sizing: border-box;
  line-height: 56px;
  float: left;
  text-align: center;
  border: 1px solid #dfe6ec;
}

.topSearch {
  padding: 10px 0px;
  width: 80%;
  float: left;
  height: 56px;
  border: 1px solid #dfe6ec;
  box-sizing: border-box;
}

.leftTree {
  width: 20%;
  float: left;
}

.emp-tree {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #dfe6ec;
}

.rightTable {
  width: 80%;
  float: left;
  /* min-height: 514px;
          border:1px solid  #dfe6ec;
          box-sizing: border-box; */
}

.bottombtn {
  clear: both;
  width: 100%;
  height: 50px;
}

.bottombtn>button {
  float: right;
  margin: 5px 10px;
}

.evaluationTable {
  border: solid 1px black;
}

.evaluationTable th {
  height: 50px;
}

.evaluationTable td,
th {
  /*border: solid 1px black;*/
  /*padding:5px;*/
  box-sizing: border-box;
  text-align: center;
}

.evaluationTable tr th:nth-of-type(1),
td:nth-of-type(1) {
  width: 100px;
}

.evaluationTable tr th:nth-of-type(8),
td:nth-of-type(8) {
  width: 100px;
}

.bottomBtnsSure {
  margin-right: 20px;
}

.namehover:hover {
  background-color: #d1dbe5;
}

.namehover>.active {
  color: #0b78e3;
}

.notcol {
  color: #20a0ff;
}

.ckclass>p {
  margin: 15px;
  font-weight: bold;
}

.queryWrap .retract {
  border: 0;
}

.queryWrap .el-button /deep/ span label {
  font-size: 12px;
  vertical-align: middle;
  cursor: pointer;
}

.queryWrap .retract /deep/ span::before {
  width: 20px;
  height: 20px;
  display: inline-block;
  content: "";
  /*background: url("../assets/images/retract.png") no-repeat 0 center;*/
  background-size: 12px 12px;
  vertical-align: middle;
}

.queryWrap .open /deep/ span::before {
  width: 20px;
  height: 20px;
  display: inline-block;
  content: "";
  /*background: url("../assets/images/open.png") no-repeat 0 center;*/
  background-size: 12px 12px;
  vertical-align: middle;
}

.el-input__inner {
  height: 30px;
}

.noclick {
  pointer-events: none;
}

/* 出科小结 */
.summary-box {
  max-height: 468px;
  overflow-y: scroll;
  margin-left: 12px;
}

.stu-box,
.tea-box,
.director-box {
  margin-top: 12px;
}

.title {
  font-weight: 600;
  font-size: 14px;
}

.content {
  margin-top: 8px;
}

.date-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 8px 12px 0 0;
}

.date-box div {
  margin: 0 4px;
}

.date-box div:last-child {
  margin-top: 2px;
}

.singnature-box img {
  width: 200px;
}

.title-box {
  display: flex;
  align-items: center;
}

.title-box .title {
  margin-right: 12px;
}

.box-card {
  margin-bottom: 20px;
}

.line-box {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.line-box p {
  width: 50%;
}

.yearMonth {
  margin-bottom: 10px;
}

.qualified {
  color: green;
}

.unqualified {
  color: red;
}

.confirm-box {
  display: flex;
  justify-content: flex-end;
}

.noRequest {
  height: 150px;
}

.baseinfo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.baseinfo p {
  width: 50%;
  margin-bottom: 15px;
}

.lastResultTips {
  margin-top: 20px;
}

.lastResult span {
  margin-right: 20px;
}

.limitOne {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}</style>
<style>.longLable .el-form-item__label {
  width: 130px !important;
}

.longLable {
  width: 260px !important;
}

.outDeptDialog .el-dialog {
  width: 670px !important;
}
.outDeptDialog .deptDatePicker {
  margin-top: 30px;
}

.caseDetailWidth .el-dialog {
  width: 85%;
}

.circleDetailDai .el-dialog {
  width: 80%;
}

.circleDetailRecordSelf .el-dialog {
  height: 645px;
}</style>