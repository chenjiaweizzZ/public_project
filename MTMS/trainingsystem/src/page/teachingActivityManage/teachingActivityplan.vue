<template>
    <div class="wapper teachingPlab-self">
        <div class="page-tools">
            <el-button type="primary"
                v-if="roleAuthority['baseplat:addTeachingActive'] || roleAuthority['dms:addTeachingActive']"
                @click="openDialog">新增</el-button>
            <el-button type="primary" v-if="roleAuthority['escort:teachingActiveImport']"
                @click="dialogTableVisible = true">批量导入</el-button>
            <el-button type="primary" v-if="roleAuthority['escort:teachingActiveDelete']"
                @click="batchdeleting">批量删除</el-button>
            <el-button type="primary" v-if="roleAuthority['escort:teachingActiveExport']"
                @click="is_export">批量导出</el-button>
        </div>

        <!--批量导入-->
        <el-dialog title="批量导入" :visible.sync="dialogTableVisible">
            <div class="import-popup">
                <div>
                    <span class="tip-circle">1</span>
                    <span>下载教学活动计划模板，批量填写教学活动计划</span>
                    <span>
                        <el-button type="primary" class="import-popup-btn" @click="downloadModel">下载</el-button>
                    </span>
                </div>
                <div>
                    <div>
                        <span class="tip-circle">2</span><span>上传填写好的教学活动计划</span>
                    </div>
                    <div>
                        <el-upload style="display:inline-block;margin:10px 40px" action="/import/importExcel" ref="upload"
                            :file-list="fileList" :data="uploadData" :show-file-list="true" :auto-upload="false"
                            :before-upload='checkFile' :on-change="changeFile" :on-success="uploadmodelSuccess"
                            :on-progress="onProgress">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div style="margin:10px auto;width:60px">
                    <el-button type="primary" @click="submitUpload">上传</el-button>
                </div>
            </div>
        </el-dialog>

        <!--顶部搜索-->
        <div class="topTools">
            <div class="queryTools newQueryTools">
                <el-row>
                    <el-col :span="1">
                        <el-button type="text" @click="queryAll">全部</el-button>
                    </el-col>
                    <el-col :span="18">
                        <div class="queryTools zy-clear">
                            <div class="mainQuery">
                                <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="80px">
                                    <!-- <hospital-base-dept :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hospitalType="hospitalType" :canNoBase="canNoBase"
                                        :needBaseDept="needBaseDept"></hospital-base-dept> -->
                                    <el-form-item label="科室" prop="" style="width: 300px;" class="hosDeptBox">
                                        <el-select v-model="hosDeptName" placeholder="请选择科室" multiple collapse-tags
                                            @remove-tag="removeNode">
                                            <el-option disabled style="height: auto;" value="">
                                                <el-tree ref="tree" :data="hosDeptTree" node-key="id" :check-strictly="true"
                                                    :check-on-click-node="true" :expand-on-click-node="true"
                                                    :props="defaultProps" @check-change="handleCheckChange1"
                                                    class="selfTree" show-checkbox></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="活动类型">
                                        <el-select v-model="queryForm.activitytype" placeholder="请选择">
                                            <el-option :key="0" label="全部" value=""></el-option>
                                            <el-option v-for="(item, index) in activittypelist" :key="item.key"
                                                :label="item.name" :value="item.key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="状态">
                                        <el-select v-model="queryForm.state" @change="changeQuery" placeholder="请选择">
                                            <el-option :key="0" label="全部" value=""></el-option>
                                            <el-option v-for="(item, index) in progress" :key="index.value"
                                                :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <span class="coll"></span>
                                    <el-form-item label="主讲人/主持人" class="speaker-input">
                                        <el-input v-model="queryForm.inputSearch" placeholder="请输入教学活动主讲人/主持人"
                                            @keyup.enter.native="queryseach"></el-input>
                                    </el-form-item>
                                    <el-form-item label="时间">
                                        <el-date-picker v-model="queryForm.firsttime" type="date" :clearable="false"
                                            placeholder="选择时间" format="yyyy-MM-dd" @change="gettimefirst">
                                        </el-date-picker>

                                        -

                                        <el-date-picker v-model="queryForm.lasttime" type="date" :clearable="false"
                                            placeholder="选择时间" format="yyyy-MM-dd" @change="gettimelast">
                                        </el-date-picker>
                                    </el-form-item>

                                </el-form>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="queryWrap" style="float:right">
                            <el-button type="primary" @click="queryseach">查询</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!--左树右列表区域-->
        <div class="tree-data low-index">
            <!-- <div class="emp-tree" style="height:100%">
                <el-tree :expand-on-click-node="true" :default-expanded-keys="expandedKeys" :current-node-key="currentDeptId" v-loading="loadingShow.tree"
                    :highlight-current="true" node-key="id" :data="deptData" style="height:100%" :props="defaultProps" @node-click="handleNodeClick">
                </el-tree>
            </div> -->
            <div class="data-table">
                <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" v-loading="loadingShow.table"
                    style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="45"></el-table-column>
                    <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
                    <el-table-column prop="theme" label="教学活动主题" width="180" :show-overflow-tooltip='true'>
                    </el-table-column>
                    <el-table-column prop="typename" label="活动类型" width="130"></el-table-column>
                    <el-table-column prop="deptname" label="科室" width="120" :show-overflow-tooltip='true'></el-table-column>
                    <el-table-column label="签到率">
                        <template slot-scope="scope">
                            <template>
                                <span>{{ scope.row.signpersent | getSignpersent }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动时间" width="280">
                        <template slot-scope="scope">
                            <template>
                                <el-tooltip effect="dark" popper-class="zy-limit-width" :content="scope.row.place"
                                    placement="top">
                                    <p class="table-time">
                                        <span><img src="../../assets/images/icon-time.svg">{{ scope.row.time1 }}</span>
                                        <span v-if="scope.row.time2 != ''"><img src="../../assets/images/icon-time.svg">{{
                                            scope.row.time2 }}</span>
                                    </p>
                                    <div slot="content">
                                        <p v-for="(item, index) in scope.row.actiontime" class="tool-tips" :key="index">
                                            <span><img src="../../assets/images/icon-time.svg">{{ item.date }}
                                                {{ item.startTime }}-{{ item.endTime }}</span>
                                        </p>
                                    </div>
                                </el-tooltip>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="period" label="学时"></el-table-column>
                    <el-table-column prop="place" label="活动地点" :show-overflow-tooltip='true'></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <!-- <template v-if="scope.row.status == 0">
                                未开始
                            </template>
                            <template v-else-if="scope.row.status == 1">
                                进行中
                            </template>
                            <template v-else-if="scope.row.status == 2">
                                已结束
                            </template> -->
                            <template>{{ scope.row.status == 0 ? '未开始' : scope.row.status == 1 ? '进行中' : scope.row.status ==
                                2 ? '已结束' : '' }}</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop='speakerlist' label="主讲人/主持人" :show-overflow-tooltip='true' width='200'
                        class="speaker-column">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <span>{{ scope.row.speakerlist | speakeshowStr }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="attendinfolist" label="参与人" :show-overflow-tooltip='true' width='200'>
                        <template slot-scope="scope">
                            <span v-if="scope.row.actionplanlevel != 'hospital'">
                                {{ scope.row.attendinfolist | showStr }}
                            </span>
                            <span v-else>{{ scope.row.attendercount }}人</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="uname" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="createtimestr" width="180" label="创建时间"></el-table-column>
                    <el-table-column label="操作" min-width="350" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.editflag == 1" @click="dataedit(scope.row)" type="text"
                                size="small">修改</el-button>
                            <el-button v-if="scope.row.delflag == 1" @click="delete_this(scope.row)" type="text"
                                size="small">删除</el-button>
                            <el-button @click="detail(scope.row)" type="text" size="small"
                                v-if="roleAuthority['escort:activedetail']">查看详情</el-button>
                            <el-button @click="openuploadvideoAndfile(scope.row)" type="text" size="small"
                                v-if="roleAuthority['escort:activeuploadvideoAndfile']">上传课件 </el-button>
                            <!-- <el-button @click="openuploadvideo(scope.row)" type="text" size="small">上传视频</el-button>
                            <el-button @click="openuploadfile(scope.row)" type="text" size="small">上传附件</el-button> -->
                            <el-button @click="openuploadActivities(scope.row)" type="text" size="small"
                                v-if="roleAuthority['escort:activeuploadActivities']">活动记录 </el-button>
                            <el-button @click="openuploadIndicator(scope.row)" type="text" size="small"
                                v-if="roleAuthority['escort:activeuploadIndicator']">指标上传 </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="pageno" :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!--弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="activeplandialog" size="small" class="class-activit"
            :close-on-click-modal="false" @close="closeDialog()"
            :class="{ 'overdialog': activeplandialog && showdialogtype == 2 }">
            <el-form :model="dialogForm" label-width="80px" style="height: 100%"
                :class="{ 'detailForm': showdialogtype == 2 }">
                <div class="detailfromtop" v-if="showdialogtype == 2">
                    <el-button @click="quitpdf(echartid)" type="primary"
                        style="height: 32px;margin-top: 10px;">导出PDF</el-button>
                    <el-tabs v-model="activeName" @tab-click="jumpthere">
                        <el-tab-pane label="活动详情" name="first"></el-tab-pane>
                        <el-tab-pane label="签到情况" name="second"></el-tab-pane>
                        <el-tab-pane label="现场记录" name="third"></el-tab-pane>
                        <el-tab-pane label="活动反馈" name="fourth"></el-tab-pane>
                        <el-tab-pane label="活动记录" name="fifth"></el-tab-pane>
                        <el-tab-pane label="学员指标" name="sixth"></el-tab-pane>
                    </el-tabs>
                </div>
                <div id="dialogscollid" class="dialogtitletab"
                    style="max-height:500px;overflow-y: scroll;padding-bottom: 50px">
                    <div class="locationpoint locationpoint_one" id="btn" v-if="showdialogtype == 2">活动详情 </div>

                    <el-row :gutter="24">
                        <!-- <el-col :span="12"> -->
                        <el-col :span="3" style="text-align: right">
                            <label style="margin-right: 5px"><span class="red">*</span>活动级别:</label>
                        </el-col>

                        <el-col :span="8" v-if="showdialogtype == 0 || showdialogtype == 1"
                            style="padding-left:12px;padding-right: 0px">
                            <el-radio-group @change="radiochange" v-model="dialogForm.activityCategory"
                                :disabled="disabled">
                                <el-radio v-for="(item, index) in radiolist" :key="index" :label="item.levelcode"
                                    style="margin-right: 10px" v-if="item.levelvalue != 0">
                                    {{ item.levelname }}
                                </el-radio>
                            </el-radio-group>
                        </el-col>
                        <!-- v-if="item.levelvalue != 0"  -->
                        <el-col :span="8" v-if="showdialogtype == 2">
                            {{ dialogForm.actionlevelname }}
                        </el-col>
                        <!-- </el-col> -->

                        <!-- <el-col :span="12"> -->
                        <el-col :span="3" style="text-align: right;padding-right: 12px">
                            <label><span class="red">*</span>科室:</label>
                        </el-col>

                        <el-col :span="8">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-select v-model="dialogForm.doctorOffice" @change="changeOffice" placeholder="请选择"
                                    style="width: 100%" v-if="dialogForm.activityCategory == 'hospital'">
                                    <el-option v-for="(item, index) in doctorOfficeList" :key="item.id" :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="dialogForm.doctorOffice" placeholder="请选择" style="width: 100%" v-else>
                                    <el-option hidden key="id" :value="dialogForm.doctorOffice"
                                        :label="dialogForm.doctorOfficeName" />
                                    <el-tree ref="treeDom" :data="doctorOfficeList" node-key="id" :check-strictly="true"
                                        :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                                        class="selfTree"></el-tree>
                                </el-select>
                            </div>
                            <div v-if="showdialogtype == 2">
                                {{ dialogForm.deptname }}
                            </div>
                        </el-col>
                        <!-- </el-col> -->

                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="3">
                            <label><span class="red">*</span>活动主题:</label>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-input v-model="dialogForm.activityTheme" maxlength="32">
                                </el-input>
                            </div>
                            <div v-if="showdialogtype == 2">
                                {{ dialogForm.theme }}
                            </div>
                        </el-col>

                        <el-col :span="3">
                            <label><span class="red">*</span>活动类型:</label>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-select v-model="dialogForm.activityType" placeholder="请选择" style="width: 100%;">
                                    <el-option v-for="item in activittypelist" :key="item.key" :label="item.name"
                                        :value="item.key">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="showdialogtype == 2">
                                {{ dialogForm.typename }}
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24" v-for="(item, index) in timeArr" :key="index">
                        <el-col :span="3">
                            <label><span class="red">*</span>活动日期:</label>
                        </el-col>
                        <el-col :span="6" v-if="showdialogtype != 2">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-date-picker v-model="item.date" placeholder="选择日期" :disabled="item.disabled"
                                    @change="changeDate($event, index)" type="date" :picker-options="pickerOptions"
                                    format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </el-col>
                        <el-col :span="6" v-if="showdialogtype == 2">
                            <div>
                                {{ item.date }}
                            </div>
                        </el-col>

                        <el-col :span="3" v-if="showdialogtype != 2">
                            <label><span class="red">*</span>起止时间:</label>
                        </el-col>
                        <el-col :span="10" v-if="showdialogtype != 2">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1" class="timeClass">
                                <!-- <el-date-picker v-model="dialogFormsendTime" type="datetime" :picker-options="pickerOptions" @change="dialoggetendtime" format="yyyy-MM-dd HH:mm:ss"> -->
                                <!-- </el-date-picker> -->
                                <el-time-select v-model="item.startTime" :disabled="item.disabled"
                                    @change="changeTime($event, index, 0)" :picker-options="{
                                        start: '00:00',
                                        step: '00:15',
                                        end: '23:45'
                                    }" placeholder="开始时间">
                                </el-time-select>

                                <el-time-select v-model="item.endTime" :disabled="item.disabled"
                                    @change="changeTime($event, index, 1)" :picker-options="{
                                        start: '00:15',
                                        step: '00:15',
                                        end: '23:59',
                                        minTime: item.startTime
                                    }" placeholder="结束时间">
                                </el-time-select>
                                <span class="delete-span">
                                    <i class="el-icon-delete" v-if="!item.disabled" @click="deleteTime(index)"
                                        :class="{ 'disabledBtn': timeArr.length == 1, 'deleteBtn': true }"></i>
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="6" v-if="showdialogtype == 2">
                            <div><span class="red">*</span>开始时间：{{ item.startTime }}</div>
                        </el-col>
                        <el-col :span="6" v-if="showdialogtype == 2">
                            <div><span class="red">*</span>结束时间：{{ item.endTime }}</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" @click="addTimeArr" type="flex" justify="end"
                        v-if="showdialogtype == 0 || (showdialogtype == 1 && showAddtime)">
                        <el-col :span="3"></el-col>
                        <el-col :span="21">
                            <div @click="addTimeArr" class="addTimeBtn"><img src="../../assets/images/icon-add.svg"
                                    class="addTimeicon" /><span>添加活动时间</span></div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="14">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <div v-if="dialogForm.activityType == '3' || dialogForm.activityType == '13'">
                                    <el-col :span="6">
                                        <label><span class="red" style="margin-left: 30px">*</span>学时:</label>
                                    </el-col>
                                    <el-col :span="5"><el-input value="2"></el-input></el-col>
                                </div>
                                <div v-if="dialogForm.activityType == '10'">
                                    <el-col :span="6">
                                        <label><span class="red" style="margin-left: 30px">*</span>学时:</label>
                                    </el-col>
                                    <el-col :span="5"><el-input value="1"></el-input></el-col>
                                </div>
                            </div>
                            <div v-if="showdialogtype == 2">
                                <el-col :span="6">
                                    <label><span class="red" style="margin-left: 30px">*</span>学时:</label>
                                </el-col>
                                <el-col :span="5"> {{ dialogForm.period }}</el-col>

                            </div>
                        </el-col>
                    </el-row>
                    <!-- <el-col :span="5">
                               <div v-if="dialogForm.activityType == '3' || dialogForm.activityType == '13' ||dialogForm.activityType == '10'" >
                                 <div v-if="dialogForm.activityType == '3' || dialogForm.activityType == '13' " >
                                   <el-input value="2" ></el-input>
                                 </div>
                                 <div v-if="dialogForm.activityType == '10' ">
                                   <el-input  value="1"></el-input>
                                 </div> 
                                 </div>  
                                 <div v-if="showdialogtype == 2" >
                                    {{ dialogForm.period }}
                                </div>   
                           </el-col>
                        </el-col> -->
                    <el-row :gutter="24">
                        <el-col :span="5">
                            <label><span class="red" style="margin-left: 30px">*</span>主讲人/主持人:</label>
                        </el-col>
                        <el-col :span="7">
                            <div v-if="showdialogtype == 0">
                                <el-select v-model="dialogForm.speaker" multiple filterable :filter-method="seachspeak"
                                    @visible-change="closeseachselect" style="width:100%">
                                    <el-option v-for="(item, index) in speakerList" :key="item.id" :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="showdialogtype == 1">
                                <el-select v-model="checkspeakerlist" multiple filterable :filter-method="seachspeak"
                                    @visible-change="closeseachselect" style="width:100%">
                                    <el-option v-for="(item, index) in speakerList" :key="item.id" :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>

                            <div v-if="showdialogtype == 2">
                                <span style="margin-right: 5px" v-for="item in dialogForm.speakerlist">
                                    {{ item.uname }}
                                </span>
                            </div>
                        </el-col>

                        <el-col :span="3">
                            <label><span class="red">*</span>活动地点:</label>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-input v-model="dialogForm.activityPlace" maxlength="64">
                                </el-input>
                            </div>
                            <div v-if="showdialogtype == 2">
                                {{ dialogForm.place }}
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="3">
                            <label>参与人员:</label>
                        </el-col>
                        <el-col :span="8" v-if="showdialogtype == 0 || showdialogtype == 1">
                            <div class="eltag">
                                <div v-if="hospitalcount && (dialogForm.activityCategory == 'hospital')">
                                    <el-button> {{ hospitalcount }}</el-button>
                                </div>
                                <div v-if="dialogForm.activityCategory != 'hospital'">
                                    <el-tooltip v-if="dialogForm.particiPatelist.length > 0" placement="right"
                                        effect="light">
                                        <div slot="content">
                                            <span v-for="item in dialogForm.particiPatelist">
                                                {{ item.name }}&nbsp;&nbsp;&nbsp;
                                            </span>
                                        </div>
                                        <div v-if="dialogForm.particiPatelist.length > 0">
                                            <el-button>
                                                {{ dialogForm.particiPatelist[0].name }}...
                                            </el-button>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="20" v-if="showdialogtype == 2">
                            <div v-if="dialogForm.actionplanlevel == 'office'">
                                <span v-if="dialogForm.attendinfolist">{{ dialogForm.attendinfolist.length }}人</span>
                            </div>
                            <div v-if="dialogForm.actionplanlevel == 'hospital'">
                                <span v-if="dialogForm.attendercount">{{ dialogForm.attendercount }}人</span>
                            </div>
                            <div v-if="dialogForm.actionplanlevel == 'base'">
                                <span v-for="item in dialogForm.attendinfolist" style="margin-right: 5px">
                                    <span v-if="item.type == 0">{{ item.attendbusinfo }}</span>

                                    <span v-else>{{ item.attendbusinfo }}人</span>
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="4" v-if="showdialogtype == 0 || showdialogtype == 1">
                            <el-button type="primary" @click="openchoicepeople">选择</el-button>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="3">
                            <label>备注:</label>
                        </el-col>
                        <el-col :span="20">
                            <div v-if="showdialogtype == 0 || showdialogtype == 1">
                                <el-input type="textarea" :rows="4" v-model="dialogForm.remark" maxlength="100">
                                </el-input>
                            </div>
                            <div v-if="showdialogtype == 2">
                                {{ dialogForm.remark }}
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="24">
                            <div class="text_upload" v-if="showdialogtype != 2">
                                附件( 支持.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.类型文件，20M以内 )
                            </div>
                        </el-col>
                        <el-col :span="24" v-if="showdialogtype == 0 || showdialogtype == 1">
                            <el-upload class="upload-demo" action="/file/upload" :on-preview="clickthisfile" multiple
                                :limit="3" :on-exceed="handleExceed" :on-remove="handleRemove" :before-remove="beforeRemove"
                                :on-success="uploadsuccess" :file-list="fileList">
                                <el-button type="primary">点击上传</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="24" v-if="showdialogtype == 2">
                            <el-col :span="3" style="text-align: right;">
                                <p>附件&nbsp;&nbsp;</p>
                            </el-col>
                            <el-col :span="20">
                                <div v-for="item in dialogForm.fileuploadlist">
                                    <!--detail_filelist-->
                                    <a target="_blank"
                                        :href="'/file/download2?file=' + fileurltitle + item.fileurl + '&name=' + item.filename"
                                        :download="item.filename">
                                        {{ item.filename }}
                                    </a>

                                    <a target="_blank"
                                        :href="'/file/download2?file=' + fileurltitle + item.url + '&name=' + item.name"
                                        :download="item.name">
                                        {{ item.name }}
                                    </a>
                                </div>
                                <!--2018-11-17 视频位-->
                                <div v-for="item in detailvideolist">
                                    <a target="_blank"
                                        :href="'/file/download2?file=' + fileurltitle + item.fileurl + '&name=' + item.filename"
                                        :download="item.filename">
                                        {{ item.filename }}
                                    </a>
                                </div>
                            </el-col>
                        </el-col>
                    </el-row>
                    <!-- 保存，取消 -->
                    <el-row :gutter="24" v-if="showdialogtype != 2">
                        <el-col :span="24" class=”saveCancelBtn“>
                            <el-button type="primary" :disabled="fromupdisabled" @click="sureDialogForm"
                                v-if="showdialogtype == 0" class="bottomBtnsSure">保存</el-button>
                            <el-button type="primary" :disabled="fromupdisabled" @click="editsureDialogForm"
                                v-if="showdialogtype == 1" class="bottomBtnsSure">保存</el-button>
                            <el-button class="bottomBtns" @click="cancelAdd">取消</el-button>
                        </el-col>
                    </el-row>

                    <div v-show="showdialogtype == 2" class="separation_line"></div>
                    <div v-if="showdialogtype == 2">
                        <div class="locationpoint locationpoint_two" id="btn1">签到情况</div>

                        <el-row :gutter="24" v-if="showdialogtype == 2">
                            <el-col :span="12">
                                <div id="echart" style="width: 320px;height:300px;"></div>
                            </el-col>
                            <el-col :span="12" class="sigincoun">
                                <el-form-item label="签到率:">
                                    <div>
                                        {{ signform.signpercent || 0 }}%
                                    </div>
                                </el-form-item>
                                <el-form-item label="应到人数:">
                                    {{ signform.signnormalcount }}
                                </el-form-item>
                                <el-form-item label="实到人数:">
                                    {{ signform.signincount }}
                                </el-form-item>
                                <el-form-item label="请假人数:">
                                    {{ signform.signleavecount }}
                                </el-form-item>
                                <el-form-item label="缺勤人数:">
                                    {{ signform.signabsencecount }}
                                </el-form-item>
                                <el-form-item label="计划外签到人数:">
                                    {{ signform.signoutcount }}
                                </el-form-item>
                            </el-col>

                            <el-col :span="24">
                                <el-tabs v-model="ecattabactiveName" v-if="showdialogtype == 2">
                                    <el-tab-pane :label="signincountlabel" name="ecattabfirst">
                                        <div class="siginnormal" v-for="item in signform.signinlist">
                                            <span>{{ item.uname }}</span>
                                            <span class="signspan">{{ item.username }}</span>
                                            <span>{{ item.statusstr }}</span>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane :label="signabsencecountlabel" name="ecattabsecond">
                                        <div class="siginnormal" v-for="item in signform.notsignpclist">
                                            <span>{{ item.uname }}</span>
                                            <span class="signspan">{{ item.username }}</span>
                                            <span>{{ item.statusstr }}</span>
                                        </div>
                                    </el-tab-pane>

                                    <el-tab-pane :label="signleavecountlabel" name="ecattabthird">
                                        <div class="siginnormal" v-for="item in signform.signleavelist">
                                            <span>{{ item.uname }}</span>
                                            <span class="signspan">{{ item.username }}</span>
                                            <span>{{ item.statusstr }}</span>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane :label="signoutcountlabel" name="ecattabfourth">
                                        <div class="siginnormal" v-for="item in signform.signoutlist">
                                            <span>{{ item.uname }}</span>
                                            <span class="signspan">{{ item.username }}</span>
                                            <span>{{ item.statusstr }}</span>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                                <div class="detailmore" @click="clickdetailmore">查看更多</div>
                            </el-col>
                        </el-row>
                    </div>

                    <div v-show="showdialogtype == 2" class="separation_line"></div>

                    <div class="recodespot" v-if="showdialogtype == 2">
                        <div class="locationpoint locationpoint_three" id="btn2">现场记录</div>
                        <!--出科考核类型下增添的内容-->
                        <el-row class="position_relative" :gutter="24" v-if="dialogForm.typename == '出科考核'">
                            <el-col :span="24">
                                <div class="grid-content bg-purple">
                                    <label>&nbsp;&nbsp;&nbsp;出科考核类型: </label>
                                    <span>{{ fieldrecordlist.cktypename }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24" v-if="fieldrecordlist.cktype == 1">
                                <div class="grid-content bg-purple-light">
                                    <label>&nbsp;&nbsp;&nbsp;考核项目:</label>
                                    <span>{{ fieldrecordlist.ckproname }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-light">
                                    <label>&nbsp;&nbsp;&nbsp;考核老师:</label>
                                    <span style="margin-right: 5px" v-for="item in dialogForm.speakerlist">
                                        {{ item.uname }}
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-light">
                                    <label style="display: block;float: left">&nbsp;&nbsp;&nbsp;被考核学员:</label>
                                    <span v-if="dialogForm.actionplanlevel == 'hospital'">
                                        {{ dialogForm.attendercount }}人
                                    </span>
                                    <span v-else class="kaohepeople">
                                        <span v-for="item in dialogForm.attendinfolist">{{ item.attendbusinfo }}</span>
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-light">
                                    <label>&nbsp;&nbsp;&nbsp;考核时间:</label>
                                    <span>{{ dialogForm.starttimestr }} - {{ dialogForm.endtimestr }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-light">
                                    <label>&nbsp;&nbsp;&nbsp;考核地点:</label>
                                    <span>{{ dialogForm.place }}</span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div><label style="width: 100px;text-align: right">&nbsp;&nbsp;&nbsp;成绩汇总表:</label></div>
                                <div class="field_situation">
                                    <span v-for="(item, index) in examinationpiclist1">
                                        <img v-if="item.type == 4" @click="exambigpicture1 = true; activeItemIndex = index"
                                            :src="detailpicurl + item.fileurl">
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div><label>&nbsp;&nbsp;&nbsp;{{ fieldrecordlist.cktype == 1 ? "技能考核评分原始表" :
                                    "综合面对面考核评分原始表" }}:</label></div>
                                <div class="field_situation">
                                    <span v-for="(item, index) in examinationpiclist2">
                                        <img v-if="item.type == 5" @click="exambigpicture2 = true; activeItemIndex = index"
                                            :src="detailpicurl + item.fileurl" />
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div><label>&nbsp;&nbsp;&nbsp;{{ fieldrecordlist.cktype == 1 ? "技能考核现场图片" :
                                    "综合面对面考核现场图片" }}:</label></div>
                                <div class="field_situation">
                                    <span v-for="(item, index) in examinationpiclist3">
                                        <img v-if="item.type == 6" @click="exambigpicture3 = true; activeItemIndex = index"
                                            :src="detailpicurl + item.fileurl" />
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <label>活动纪要:</label>
                                    <span>{{ fieldrecordlist.description }}</span>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row class="position_relative" :gutter="24" v-else>
                            <div class="field_situation">
                                <span v-for="(item, index) in fieldrecordlist.piclist">
                                    <img v-if="item.type == 2" @click="bigpicture = true; activeItemIndex = index"
                                        :src="detailpicurl + item.fileurl" />
                                </span>
                            </div>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <label style="width:78px;float:left;">活动纪要:</label>
                                    <span style="width: 450px;float: left">{{ fieldrecordlist.description }}</span>
                                </div>
                            </el-col>
                        </el-row>

                        <div v-if="dialogForm.teachtypekey == 2 || dialogForm.teachtypekey == 3">
                            <el-row>
                                <el-col :span="24">
                                    <el-col :span="12">
                                        <div class="grid-content bg-purple"><label>住&nbsp&nbsp院&nbsp&nbsp号:
                                            </label><span>{{ fieldrecordlist.inpatientno }}</span></div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="grid-content bg-purple-light">
                                            <label>床号:</label><span>{{ fieldrecordlist.bedno }}</span>
                                        </div>
                                    </el-col>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content bg-purple-dark">
                                        <label>&nbsp;&nbsp;&nbsp;主要诊断:</label>
                                        <span>{{ fieldrecordlist.maindiagnosis }}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content bg-purple-dark">
                                        <label style="float:left;">&nbsp;&nbsp;&nbsp;病情简介:</label>
                                        <div style="width: 450px;float: left">{{ fieldrecordlist.caseinfo }}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <el-row class="position_relative" :gutter="24">
                            <div class="field_situation">
                                <span v-for="(item, index) in type3piclist">
                                    <img v-if="item.type == 3" @click="bigpicture2 = true; activeItemIndex = index"
                                        :src="detailpicurl + item.fileurl" />
                                </span>
                            </div>
                        </el-row>
                    </div>

                    <div v-show="showdialogtype == 2" class="separation_line"></div>

                    <div class="active-btm recodespot" v-if="showdialogtype == 2">
                        <div class="locationpoint locationpoint_four" id="btn3">活动反馈</div>
                        <el-row :gutter="20">
                            <el-col :span="20">
                                <div style="margin:5px;">
                                    <span>得分 :{{ score }}分&nbsp;/&nbsp;总分{{ totalscore }}分</span>
                                    <span style="float: right;">反馈人数
                                        :{{ evaluatepeoplecount }}人&nbsp;/&nbsp;总人数{{ evaluatepeopletotalcount }}人</span>
                                </div>
                            </el-col>
                            <el-col :span="20" v-for="(item, index) in evaluationlist" :key="item.id">
                                <div style="margin: 5px;">
                                    <span>{{ item.title }}</span>
                                    <span class="crode_right">&nbsp;
                                        <i :class='{ active: i == index }' @click="showScoreTemp(item.id, index)"
                                            class='u-icon-arr icon el-icon-arrow-down'></i>
                                    </span>
                                    <span class="crode_right" @click="showScoreTemp(item)">{{ item.avgscore }}分</span>
                                </div>
                                <div v-if="dscoringflag && item.id == thisdscorid">
                                    <div v-for="item in detailscore">
                                        <div style="margin: 5px;">
                                            <span>&emsp;{{ item.name }}</span>
                                            <span class="crode_right">{{ item.score }}分</span>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="20">
                                <div style="margin: 5px;">收获和建议:</div>
                            </el-col>
                            <el-col :span="20" v-for="(item, index) in suglist" :key="index">
                                <div style="margin: 5px;">
                                    <div style="word-break: break-all"> <i>{{ index + 1 }}.</i>{{ item.advise }}</div>
                                    <div style="margin: 5px;">
                                        <span></span>
                                        <span class="crode_right">{{ item.uname }}</span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>


                    <div class="active-btm recodespot" v-if="showdialogtype == 2">
                        <div class="locationpoint locationpoint_fifth" id="btn4">活动记录</div>
                        <el-row :gutter="20">
                            <el-col :span="20">
                                <div style="margin: 5px;">活动记录:</div>
                            </el-col>
                            <el-col :span="20">
                                <div v-for="item in propActivities">
                                    <a target="_blank"
                                        :href="'/file/download2?file=' + fileurltitle + item.fileurl + '&name=' + item.filename"
                                        :download="item.filename">
                                        {{ item.filename }}
                                    </a>

                                    <a target="_blank"
                                        :href="'/file/download2?file=' + fileurltitle + item.url + '&name=' + item.name"
                                        :download="item.name">
                                        {{ item.name }}
                                    </a>
                                </div>
                            </el-col>





                            <!-- <el-col :span="20" v-for="(item, index) in suglist" :key="index">
                                <div style="margin: 5px;">
                                    <div style="word-break: break-all"> <i>{{ index + 1 }}.</i>{{ item.advise }}</div>
                                    <div style="margin: 5px;">
                                        <span></span>
                                        <span class="crode_right">{{ item.uname }}</span>
                                    </div>
                                </div>
                            </el-col> -->
                        </el-row>
                    </div>
                </div>
            </el-form>
        </el-dialog>

        <!--查看type2大图的轮播-->
        <el-dialog title="查看大图" size="small" :visible.sync="bigpicture" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="bigpicture">
                <el-carousel-item v-if="item.type == 2" v-for="(item, index) in fieldrecordlist.piclist" :key="item.id">
                    <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!--查看type3大图的轮播-->
        <el-dialog title="查看大图" size="small" :visible.sync="bigpicture2" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="bigpicture2">
                <el-carousel-item v-if="item.type == 3" v-for="(item, index) in type3piclist" :key="item.id">
                    <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!--查看type4大图的轮播-->
        <el-dialog title="查看大图" size="small" :visible.sync="exambigpicture1" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="exambigpicture1">
                <el-carousel-item v-if="item.type == 4" v-for="(item, index) in examinationpiclist1" :key="item.id">
                    <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!--查看type5大图的轮播-->
        <el-dialog title="查看大图" size="small" :visible.sync="exambigpicture2" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="exambigpicture2">
                <el-carousel-item v-if="item.type == 5" v-for="(item, index) in examinationpiclist2" :key="item.id">
                    <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!--查看type6大图的轮播-->
        <el-dialog title="查看大图" size="small" :visible.sync="exambigpicture3" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="exambigpicture3">
                <el-carousel-item v-if="item.type == 6" v-for="(item, index) in examinationpiclist3" :key="item.id">
                    <img style="max-width:100%;max-height:100%;" :src="detailpicurl + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!--参与人员弹窗-->
        <el-dialog title="选择参与人员" :visible.sync="participantsdialog" size="large" :close-on-click-modal="false"
            @close="participantsdialog = false">
            <el-row>
                <el-col :span="11">
                    <div class="userListHeader">
                        <div>学生列表</div>
                    </div>

                    <div class="userListHeader">
                        <div class="search-input" style="float:left">
                            <el-input style="width:200px" v-model="firstInput" placeholder="请输入姓名或学号"></el-input>
                        </div>
                        <div class="search-btn" style="float:left;margin-left:10px">
                            <el-button type="primary" @click="queryUsers">查询</el-button>
                        </div>
                    </div>

                    <!--参与人左边展示区域-->
                    <div class="typeOrGrade" style="height:500px;overflow-y:scroll">
                        <!--院级-->
                        <!--<div v-if="dialogForm.activityCategory == 'hospital'">
                            <div v-show="typeOrGradeisshow">
                                <el-radio-group v-model="typeOrGraderadio" @change="radioCheck">
                                    <el-radio :label="1">年级</el-radio>
                                    <el-radio :label="2">学员类型</el-radio>
                                </el-radio-group>
                            </div>
                        </div>-->

                        <!--基地级-->
                        <div v-if="dialogForm.activityCategory == 'base'">
                            <div>
                                <el-radio-group v-model="typeOrGraderadio" @change="radioCheck">
                                    <!-- <el-radio :label="1">正在该基地轮转的学员</el-radio> -->
                                    <el-radio :label="2">专业在该基地的学员</el-radio>
                                </el-radio-group>
                            </div>
                        </div>

                        <!--科室级-->
                        <div v-if="dialogForm.activityCategory == 'office'">
                            <div v-show="typeOrGradeisshow">
                                <el-checkbox-group v-model="doctor_trainee_list" @change="checkOfficeChange">
                                    <el-checkbox label="1">护陪生</el-checkbox>
                                    <el-checkbox label="2">实习生</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>

                        <!--左边下面列表-->
                        <div class="c-table">
                            <el-table :data="tableLeftData" ref="participantsDialog" @selection-change="leftTableCheck"
                                style="width: 100%">
                                <el-table-column type="index" width="65" label="序号"></el-table-column>
                                <el-table-column type="selection" width="45"></el-table-column>
                                <el-table-column prop="name" label="姓名"></el-table-column>
                                <el-table-column prop="username" label="人数/学号/工号"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>

                <el-col :span="3" style="height:600px;line-height:600px;text-align: center">
                    <el-button type="primary" @click="c_Transfer">添加 >>> </el-button>
                </el-col>

                <!--参与人右边展示区-->
                <el-col :span="9">
                    <div class="userListHeader">
                        已选学生
                    </div>
                    <div class="userListHeader" style="text-align: left">
                        <el-button type="primary" @click="c_del_right_data"> 删 除 </el-button>
                    </div>

                    <div class="right-selectedTable">
                        <el-table :data="tableRightData" @selection-change="rightTableCheck" style="width: 100%">
                            <el-table-column type="index" width="65" label="序号"></el-table-column>
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="username" label="人数/学号/工号"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" @click="saveTableListInOut" class="bottomBtnsSure">保存</el-button>
                <el-button @click="participantsdialog = false" class="bottomBtns">取消</el-button>
            </el-row>
        </el-dialog>

        <!--院级活动参与人-->
        <el-dialog title="选择参与人员" :visible.sync="checkhospitaldialog" size="small" class="checkhospitaldialog">
            <!-- <hospital-activityplan @hospitalsubmitdata="hospitaldatasubmit" @hospitalactivityplanclose="checkhospitaldialog = false"
                :activityhosplan_list="activityhosplan_list" :editinitlist="editparticiPatelist" :activiflag='clearhosactivi'>
            </hospital-activityplan> -->
            <hospital-activityplan1 :particiPatelist="dialogForm.particiPatelist" :key="dialogForm.activityCategory"
                :type="dialogForm.activityCategory" :searchItem="selectedDept" :studentDeptid="studentDeptid"
                @closeDailog="closeDailog" @submitdata="hospitaldatasubmit" :timeArr="timeArr"
                :show="checkhospitaldialog"></hospital-activityplan1>
        </el-dialog>

        <!--详情查看更多参与人员列表-->
        <el-dialog title="参与人员" :visible.sync="detailmoredialog" size="small" :close-on-click-modal="false"
            @close="detailmoredialog = false">
            <el-button type="primary" @click="more_export">批量导出</el-button>
            <div class="moreseach">
                <div>
                    <el-input v-model="moremodel"></el-input>
                </div>
                <el-button type="primary" @click="moreseach">查询</el-button>
            </div>

            <el-table :data="moreData" style="width: 100%">
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="username" label="学号/工号">
                </el-table-column>
                <el-table-column prop="statusstr" label="状态">
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 上传课件 -->

        <el-dialog title="上传课件" :visible.sync="uploadvideodialog" v-if="uploadvideodialog"
            @closevideo="uploadvideodialog = false" class="uploaddialog">

            <div>上传视频</div>
            <upload-Video :datalist="propvideolist" :noButton="noButton" @click="openuploadvideo" @videoUrl="videoUrl">
            </upload-Video>
            <div>上传附件</div>
            <upload-File :datalist="propfilelist" :noButton="noButton" @click="openuploadfile"
                @fileUrl="fileUrl"></upload-File>
            <div class="upload-submitVideoFile">
                <el-button type="primary" @click="submitVideoFile">确定</el-button>
                <el-button @click="uploadVideoFileClose">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="活动记录" :visible.sync="uploadActivitiesdialog" v-if="uploadActivitiesdialog">
            <upload-File :datalist="propActivities" @fileUrl="fileUrl" :onlyone="onlyone" :limit="limit"
                :noButton="noButton"></upload-File>
            <div class="upload-submitVideoFile">
                <el-button type="primary" @click="submitActivitieslist(8)">确定</el-button>
                <el-button @click="activitieslistFileClose(8)">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="指标上传" :visible.sync="uploadPointdialog" v-if="uploadPointdialog">
            <upload-File :datalist="propPoints" @fileUrl="fileUrl" :onlyone="onlyone" :limit="limit"
                :noButton="noButton"></upload-File>
            <div class="upload-submitVideoFile">
                <el-button type="primary" @click="submitPointslist(9)">确定</el-button>
                <el-button @click="activitieslistFileClose(9)">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="指标上传" :visible.sync="TeacherPointListDialog" v-if="TeacherPointListDialog">
            <div class="upload-submitVideoFile">
                <el-table :data="TeacherPointList" border style="width: 100%">
                    <el-table-column prop="name" label="学员姓名" width="100">
                    </el-table-column>
                    <el-table-column prop="name" label="学员附件">
                        <template slot-scope="scope">
                            <el-upload
                                class="upload-demo"
                                action="/file/upload"
                                :on-preview="handlePreview2"
                                :on-remove="handleRemove2"
                                :before-remove="beforeRemove"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="scope.row.fileurlist">
                                <el-button size="small" type="primary" v-if="!scope.row.fileurlist.length">点击上传</el-button>
                            </el-upload>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="带教附件">
                        <template slot-scope="scope">
                            <el-upload
                                class="upload-demo"
                                action="/file/upload"
                                :on-preview="handlePreview2"
                                :on-remove="handleRemove2"
                                :before-remove="beforeRemove"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="scope.row.fileurlist2">
                                <el-button size="small" type="primary" v-if="!scope.row.fileurlist2.length">点击上传</el-button>
                            </el-upload>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="submitTeacherPointslist(9)">确定</el-button>
                <el-button @click="activitieslistFileClose(10)">取消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="预览" :visible.sync="dialogVisibleScore" v-if="dialogVisibleScore" width="80%" class="selfComp">
            <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
        </el-dialog>
    </div>
</template>

<script>
import { post, get, getCookie, exportWord, setTitle, exportMouldExcel, exportExcel, importExcel, exportPdf, showErrorImport, getStorage } from '../../config/util';
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import * as echarts from 'echarts';
// import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import uploadVideo from '../../components/uploading_video.vue';
import uploadFile from '../../components/upload_file.vue';
import hospitalActivityplan from '../../components/activityplan_hospital.vue';
import hospitalActivityplan1 from '../../components/activityplan_hospital1.vue';
import hospitalBaseDept from "../../components/hospitalBaseDept";
import scoringTable from "../../components/scoringTable.vue";

const _ = require('lodash');

export default {
    data() {
        const getLastYear = () => {
            const now = new Date()
            now.setFullYear(now.getFullYear() - 1)
            return now
        }
        const formDate = (date) => {
            const year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return year + '-' + month + '-' + day;
        }
        const firsttime = getLastYear()
        const lasttime = new Date()

        this.top_firsttime = formDate(firsttime); // 开始时间
        this.top_lasttime = formDate(lasttime); // 结束时间
        return {
            limit: 2,
            onlyone: false,
            noButton: false,
            fileUrlData: [],
            videoUrlData: [],
            noButton: false,
            dialogVisibleScore: false,
            needHeader: true,
            isAnswer: true,
            previewId: "",
            hosDeptName: [],
            needBaseDept: 0,
            hospitalType: 0,
            tempValue: "",
            //2019-01-08
            searchConfig: {
                pid: 0,
                id: 0
            },
            canNoBase: true,
            uploadfiledialog: false,
            uploadActivitiesdialog: false,
            uploadActivities: '',
            uploadPointdialog: false,
            uploadPoint: '',
            propPoints: [],
            propfilelist: [],
            propActivities: [],
            submitfileid: '',
            //12-03 科室级参与人自带实习生
            inittranieelist: [],

            //11-19 院级活动参与人
            hospital: [],
            activityhosplan_list: {
                startime: '',
                endtime: '',
                actiontime: "",
                datalist: [],
                hosplanflag: 'new'
            },  //数据列表
            clearhosactivi: '',
            checkhospitaldialog: false,
            hospitalcount: '',//院级参与人人数展示
            hosinitdata: [], //编辑时初始化的值
            hosplanflag: 'new',
            hospitaldatasubmitlist: [],
            //11-15  新增上传视频操作
            uploadvideodialog: false,
            uploadvideoprop: [], // 基本信息
            propvideolist: [],
            detailvideolist: [],//查看视频列表
            //07-15 更改的参与人弹窗
            tableLeftData: [],//左边下面的列表
            tableRightData: [],//右边展示的列表
            check_left_list: [],   //左边列表选中
            check_right_list: [],  //右边列表选中
            doctor_trainee_list: [],
            trainee_list: [],
            doctor_list: [],
            //开始和结束时间限制无法选择过期时间
            pickerOptions: {
                minTime: '',
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            /*导入*/
            hasFile: false,
            dialogTableVisible: false,
            uploadData: {
                _upload_data: JSON.stringify({
                    "1": {
                        command: 'actionplan/importteachingactionplan',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        menusId: getStorage('menuId')
                    }
                })
            },
            flag: 1,
            _uploadfilelist: [],
            fileList: [],  //增加弹窗上传的文件列表
            fileurltitle: '',//查看附件时候的拼接头部地址
            sucessfilelist: [],
            detail_filelist: [],//查看窗口文件列表

            /*筛选区域*/
            queryForm: {
                hospitalId: "",
                deptId: [],
                baseId: "",
                activitytype: '',   //活动类型
                state: '',          //状态
                inputSearch: '',     //主题/主讲人
                firsttime: "",      //开始时间
                lasttime: "",       //结束时间
            },

            activitytypeList1: [],   //活动类型列表
            progress: [              //状态列表
                { name: '未开始', value: '0' },
                { name: '进行中', value: '1' },
                { name: '已结束', value: '2' },
            ],

            /*左边树*/
            expandedKeys: [99],      //默认展开节点的Key的数组
            currentDeptId: '',       //当前选中节点的 key，只写属性
            defaultProps: {
                label: 'name',
                children: 'childrens',
                disabled: function (data, node) {
                    if (data.havePermission != 1) {
                        return true
                    }
                }
            },
            deptData: [],            //展示树的数据
            loadingShow: {
                table: false,
                tree: false,
            },
            /*右边列表区域*/
            selectItems: [], //表格勾选id列表
            deletelist: [],//批量勾选
            tableData: [],//表格数据

            /*弹窗*/
            disabled: false,
            showadd: false,
            radiolist: [],   //活动类别数组
            showdialogtype: '',//0新增、1编辑，2查看
            dialogTitle: '',//弹窗标题
            activeplandialog: false,//默认关闭弹窗
            dialogForm: {        //弹窗表单
                activityCategory: '',//活动类别/0院级1基地级2科室级
                doctorOffice: '',//科室
                doctorOfficeName: "",
                activityTheme: '',//活动主题
                activityType: '',//活动类型
                speaker: [],//主讲人列表
                activityPlace: '',//活动地点
                particiPatelist: [],//参与人员列表
                remark: '',//备注
                starTime: '',
                endTime: '',
                studentType: "", //学员身份
                period: 1
            },
            dialogFormstarTime: '',//开始时间
            dialogFormsendTime: '',//结束时间
            doctorOfficeList: [],//科室列表
            activittypelist: [],//活动类型列表
            speakerList: [],//主讲人列表
            dialogeditid: '',//编辑提交id
            doctorOfficeeditid: '',//kesi
            fromupdisabled: false,
            checkspeakerlist: [],

            //弹窗附件上传
            //参与人员
            gradlist: [],//所有年级
            typeidlist: [],//所有类型
            participantsdialog: false,//参与人员弹窗
            firstInput: '',//姓名或者学号搜索
            dialogLeftTreeData: [],//左边树的数据列表
            dlogRightTableData: [],//右边数据表格
            rightSelectedUsers: [],//右边所选学生的
            forminbaseorturn: '',//基地下选择的第一个还是第二个
            typeOrGraderadio: '',//
            greadlisttwodialog: [],
            checkedgread: [],    //选中的年级
            rightcheckedgread: [],//youbian
            checkAlloffice: false,   //住院医默认不全选
            editparpantlist: [],//编辑情况下赋值参与人员
            seachcheckshowright: [], //单独展示搜索出来的学生
            editparticiPatelist: [], // 参与人员列表
            basecount: {
                turncount: '',
                basecount: ''
            },
            editchecktop: [],
            editchecktoplist: [],
            editcheckbomlist: [],
            seacherlist: [],
            /*实习生test*/
            checkAll: false,        //实习生默认不全选
            checkedCities: [],
            testlist: [],

            turnorbaseflag: true,
            //住院医选中的和实习生选中的
            checktoplist: [],
            checkbtmlist: [],
            checkedseachlist: [],// 科室下  参与人员  搜索选中数组
            setkongflag: true,  //为空状态许可
            checkseachlist: [],//搜索出来的
            checkleftlist: [],   //选中的列表
            typeOrGradeisshow: true,//展示原始还是单独搜索
            hospitalGradeortype: '',//医院下选中的类型年级或人员类型
            hospitaltype: '',        //查询出来的bustype
            hoschecklist: [],    //编辑下传送选中的人
            seachcheckmodel: [],//编辑查看搜索列表默认选中
            isedit: false,
            /*详情*/
            activeName: 'first',    //默认顶部为活动详情
            //echant 区域
            signpercentage: '',      //签到率
            signlist: [],
            latelist: [],
            intheplanlist: [],
            outtheplanlist: [],
            echartid: '',
            opinionData: [],
            signform: {},
            //饼图区域参与人员名单
            ecattabactiveName: 'ecattabfirst',  //默认顶部为活动详情
            signincountlabel: '',//     计划内签到人员
            signabsencecountlabel: '',//       缺勤人员
            signleavecountlabel: '',//      请假人数
            signoutcountlabel: '',//       计划外签到人员

            //现场记录
            detailpicurl: '',        //图片展示需要拼接的url头部信息
            minipiclist: [],     //照片
            picremarks: '',      //备注信息
            minipiclist: [],//
            fieldrecordlist: [], //现场记录
            examinationpiclist1: [],//出科考核下的三种类型的图片
            examinationpiclist2: [],
            examinationpiclist3: [],
            //查看大图区域
            minipiclist: [],
            bigpicturefirst: false,
            bigpicture: false,
            bigpicture2: false,
            exambigpicture1: false,
            exambigpicture2: false,
            exambigpicture3: false,
            bigpiclist: [],
            picremarks: '',//上传图片的备注信息
            signpercentage: '',//签到率
            detailspeakerlist: [],
            type3piclist: [],
            //活动反馈
            score: '',           //得分
            totalscore: '',      //总分
            evaluatepeoplecount: '',//反馈人数
            evaluatepeopletotalcount: '',//总人数
            evaluationlist: [],  //
            suglist: [],
            i: '',//样式控制
            dialog: '',
            dscoringflag: false,
            thisdscorid: "",
            detailscore: [],

            //查看更多参与人
            detailmoredialog: false,
            moreData: [],
            moremodel: '',
            inpatientWardpiclist: [],//病区详情照片列表
            //dialog分页
            requestPage: 1,          //页
            sizePerPage: 20,         //条/页
            dialogtotalCount: 0,     //总条

            //分页
            treedeptid: '',
            pageno: 1,   //页
            pagesize: 10,//条
            totalCount: 0,//总数
            deletethis_id: '',//删除数据id
            idList: [],
            //走马灯选中序号
            activeItemIndex: 0,
            //导出参数
            exportOptions: {
                starttime: this.top_firsttime,//开始时间
                endtime: this.top_lasttime,      //结束时间
            },
            showAddtime: false,
            selectedDept: {
                id: "",
                baseId: "",
                hospitalId: "",
            },
            timeArr: [
                {
                    date: "",
                    startTime: "",
                    endTime: ""
                }
            ],
            studentDeptid: '',
            menuId: "",
            hosDeptTree: [],
            hospitalIdList: [],
            baseIdlist: [],
            deptIdList: [],
            TeacherPointList: [],
            TeacherPointListLength: 0,
            TeacherPointListDialog: false
        }
    },

    components: {
        uploadVideo,
        hospitalActivityplan,
        hospitalActivityplan1,
        uploadFile,
        hospitalBaseDept,
        scoringTable
    },
    computed: {
        ...mapState(['roleAuthority']),
    },
    mounted() {
        this.getRoleAuthority()
        this.menuId = getStorage("menuId")
        this.queryForm.firsttime = moment(new Date()).startOf("month").format("YYYY-MM-DD")
        this.queryForm.lasttime = moment(new Date()).endOf("month").format("YYYY-MM-DD")
        this.queryseach();
        this.getactivityTypeList();
        this.getradiolist();//活动类别
        this.getgreadlist();//所有年级
        this.gettypeIDlist();//所有类型
        this.inittraineeplan();//需要自带参与人的活动类型
        this.initDeptTree()
    },

    watch: {
        'dialogFormstarTime': function (val, oldval) {
            if (oldval && val && oldval != val) {
                this.dialogFormsendTime = '';
            }
        },
        'dialogForm.particiPatelist': function (val, oldval) {
            this.$set(this.dialogForm, "particiPatelist", val)
        },
        'dialogForm.doctorOffice': function (val, oldval) {
            if (val && val != oldval) {
                this.checkplanpeople()
            };
            // if (val != oldval) {
            //     this.getspeakerList();
            // };
        },
        'firstInput': function (val, oldval) {
            if (oldval && val == '') {  //无搜索值，显示默认结果
                this.typeOrGradeisshow = true;
                if (this.dialogForm.activityCategory == 'hospital') {
                    if (this.typeOrGraderadio == 1) {
                        this.getstudentforgrend({ type: 'grade' });
                    } else if (this.typeOrGraderadio == 2) {
                        this.getstudentforgrend({ type: 'type' });
                    } else { }
                    //   this.greadlisttwodialog = [];
                } else if (this.dialogForm.activityCategory == 'office') {
                    this.getstudentforgrend({ type: 'turndoctor' });
                    this.getstudentforgrend({ type: 'trainee' });
                } else {

                }
            } else if (oldval && val != '') {  //有搜索值，显示搜索结果
                this.typeOrGradeisshow = false;
                this.tableLeftData = [];
            } else { }
        },
        'dialogForm.activityCategory': function (val, oldval) {
            if (val != oldval) {
                this.checkplanpeople()
            };
            if (oldval && val && oldval != val) {
                this.setkongflag = true;
            };
        },
        'dialogForm.activityType': function (val, oldval) {
            if (val != oldval) {
                this.checkplanpeople()
            };
        },

        'dialogFormsendTime': function (val, oldval) {
            if (val && val != oldval) {
                this.checkplanpeople()
            };
        }
    },

    filters: {
        showStr(arg) {
            let str = '';
            if (arg && Array.isArray(arg)) {
                str = arg.map((item) => item.attendbusinfo).join('、');
            }
            return str;
        },
        speakeshowStr(arg) {
            let str = '';
            if (arg && Array.isArray(arg)) {
                str = arg.map((item) => item.uname).join('、');
            }
            return str;
        },
        getSignpersent(signpersent) {
            if (typeof signpersent === 'number') {
                return `${signpersent}%`
            } else {
                return ''
            }
        }
    },

    methods: {
        ...mapActions(['showErrorImport', 'getRoleAuthority']),
        uploadVideoFileClose() {
            this.propvideolist = [],
                this.propfilelist = [],
                this.uploadvideodialog = false
        },
        activitieslistFileClose(type) {
            if (type == 8) {
                this.propActivities = [],
                    this.uploadActivitiesdialog = false
            } else if (type == 9) {
                this.propPoints = [],
                    this.uploadPointdialog = false
            } else if (type == 10) {
                this.TeacherPointList = [],
                    this.TeacherPointListDialog = false
            }
        },
        videoUrl(data) {
            this.videoUrlData = data
        },
        fileUrl(data) {
            this.fileUrlData = data
        },
        openuploadvideoAndfile(item) {
            this.openuploadvideo(item),
                this.openuploadfile(item)
        },
        // this.uploadvideodialog = true,
        //     this.submitVideoFile(),
        clickDept() {
            if (this.dialogForm.studentType.length == 0 || this.dialogForm.studentType == undefined) {
                this.$message({
                    type: "warning",
                    message: "请先选择学员身份"
                })
            }
        },
        showScoreTemp(item) {
            if (item.id !== null && item.id) {
                this.previewId = item.id
                this.dialogVisibleScore = true
            } else {
                this.$message("暂无详情");
            }
        },
        initDeptTree() {
            post('/base/dept/getMyDeptTree', {
                showBase: 1
            }).then((data) => {
                if (data && data.resCode == 200) {
                    this.hosDeptTree = data.model
                } else {
                    this.$message({
                        type: "error",
                        message: data.resMsg
                    })
                }
            }).catch(() => {
                this.$message({
                    type: "error",
                    message: data.resMsg
                })
            })
        },
        removeNode(e) {
            this.queryForm.deptId = []
            this.hosDeptName = []
            this.hospitalIdList = []
            this.baseIdlist = []
            this.deptIdList = []
            let response = this.$refs.tree.getCheckedNodes();
            response.forEach(item => {
                if (e != item.name) {
                    this.hosDeptName.push(item.name)
                    this.queryForm.deptId.push(item.id)
                    if (item.deptlevel == 1 && item.type == 0) {
                        this.hospitalIdList.push(item.id)
                    } else if (item.deptlevel == 2 && item.type == 0) {
                        this.baseIdlist.push(item.id)
                    } else if (item.type == 1) {
                        this.deptIdList.push(item.id)
                    }
                }
            })
            this.$refs.tree.setCheckedKeys(this.queryForm.deptId);
        },
        handleCheckChange1(data, dataObj) {
            if (data.havePermission != 1) {
                return false;
            }
            this.hosDeptName = []
            this.hospitalIdList = []
            this.baseIdlist = []
            this.deptIdList = []
            let response = this.$refs.tree.getCheckedNodes();
            response.forEach(item => {
                this.hosDeptName.push(item.name)
                if (item.deptlevel == 1 && item.type == 0) {
                    this.hospitalIdList.push(item.id)
                } else if (item.deptlevel == 2 && item.type == 0) {
                    this.baseIdlist.push(item.id)
                } else if (item.type == 1) {
                    this.deptIdList.push(item.id)
                }
            })
        },
        closeDailog() {
            this.checkhospitaldialog = false
        },
        changeOffice(val) {
            this.selectedDept = {
                id: val
            }
            this.getspeakerList();
        },
        nodeClick(node) {
            if (node.deptlevel == 1 || (this.dialogForm.activityCategory == "office" && node.havePermission != 1)) {
                return false;
            }
            this.selectedDept = node
            this.dialogForm.doctorOffice = node.id
            this.dialogForm.doctorOfficeName = node.name
            this.studentDeptid = node.id;
            this.getspeakerList();
        },
        cancelAdd() {
            this.activeplandialog = false
            this.showAddtime = false
        },
        changeDate(val, index) {
            let current = this.timeArr[index]
            if (val == undefined || val == "") {
                current.start = ""
                current.end = ""
            } else {

                if (current.startTime != "") {
                    let temp = moment(current.date).format('YYYY-MM-DD')
                    current.start = new Date(temp + " " + current.startTime).getTime()
                }
                if (current.endTime != "") {
                    let temp = moment(current.date).format('YYYY-MM-DD')
                    current.end = new Date(temp + " " + current.endTime).getTime()
                }
            }
            this.timeArr.splice(index, 1, current)
        },
        changeTime(val, index, type) {
            let current = this.timeArr[index]
            if (current.startTime != "" && current.endTime != "") {
                let tempS = current.startTime.split(":")
                let tempE = current.endTime.split(":")
                if (Number(tempS[0]) > Number(tempE[0])) {
                    current.endTime = ""
                    this.$message({
                        message: "开始时间不得大于结束时间！",
                        type: 'warning'
                    })
                } else if (Number(tempE[0]) == Number(tempS[0]) && Number(tempS[1]) > Number(tempE[1])) {
                    current.endTime = ""
                    this.$message({
                        message: "开始时间不得大于结束时间！",
                        type: 'warning'
                    })
                }

            }
            if (current.date != "" && current.date != undefined) {
                let temp = moment(current.date).format('YYYY-MM-DD')
                if (type == 0) {

                    current.start = !!val ? new Date(temp + " " + val).getTime() : ""
                }
                if (type == 1) {
                    current.end = !!val ? new Date(temp + " " + val).getTime() : ""
                }
            }
            this.timeArr.splice(index, 1, current)

        },
        addTimeArr() {
            this.timeArr.push({
                date: "",
                startTime: "",
                endTime: "",
                start: "",
                end: ""
            })
        },
        deleteTime(index) {
            if (this.timeArr.length == 1) {
                return false;
            }
            this.timeArr.splice(index, 1)
        },
        submitVideoFile() {
            let _submitlistvideo = [];
            let _submitlistfile = [];
            this.videoUrlData.map((item, index) => {
                _submitlistvideo.push(
                    {
                        uid: getCookie('uid'),
                        actionplanid: this.submitfileid,
                        fileurl: item.uri,
                        filename: item.name,
                        type: 7,
                    }
                )
            });
            this.fileUrlData.map((item, index) => {
                _submitlistfile.push(
                    {
                        uid: getCookie('uid'),
                        actionplanid: this.submitfileid,
                        fileurl: item.uri,
                        filename: item.name,
                        type: 1
                    }
                )
            });
            let listCourseAndVideo = _submitlistvideo.concat(_submitlistfile)
            console.log(_submitlistfile, _submitlistvideo, listCourseAndVideo, "sss")
            post('/actionplan/uploadCourseAndVideo', {
                command: "/actionplan/uploadCourseAndVideo",
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                actionplanid: this.submitfileid,
                piclist: listCourseAndVideo,
                deltypelist: [7]
            }).then((data) => {
                if (data && data.errcode == 0) {
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.uploadvideodialog = false;
                } else {
                    this.$message({
                        message: data.errdesc,
                        type: 'warning'
                    })
                }
            })
        },
        //查询是否有上传附件的权限并获取所有的附件
        openuploadfile(item) {
            let self = this;
            let _list = [];
            self.submitfileid = item.id;
            post('/actionplan/validuploadenclosure', {
                command: 'actionplan/validuploadenclosure',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                id: item.id,
                actionplanid: item.id,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    self.singelgetpicinfo({ actionplanid: item.id, key: 3 })
                } else {
                    self.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                }
            })
        },
        //单独上传附件
        // submitfilelist(data) {
        //     let _submitlist = [];
        //     data.map((item, index) => {
        //         _submitlist.push(
        //             {
        //                 uid: getCookie('uid'),
        //                 actionplanid: this.submitfileid,
        //                 fileurl: item.uri,
        //                 filename: item.name,
        //                 type: 1
        //             }
        //         )
        //     });
        //     post('/actionplan/uploadenclosure', {
        //         command: 'actionplan/uploadenclosure',
        //         sessionid: getCookie('sid'),
        //         loginid: getCookie('uid'),
        //         uid: getCookie('uid'),
        //         actionplanid: this.submitfileid,
        //         piclist: _submitlist,
        //     }).then((data) => {
        //         if (data && data.errcode == 0) {
        //             this.$message({
        //                 message: '上传成功！',
        //                 type: 'success'
        //             });
        //             this.uploadfiledialog = false;
        //         } else {
        //             this.$message({
        //                 message: data.errdesc,
        //                 type: 'warning'
        //             });
        //         }
        //     })
        // },
        //导出PDF
        quitpdf(id) {
            let self = this;
            let data = {
                command: "actionplan/exportactionplandetailpdf",
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                clientflag: 0,
                actionplanid: id
            };
            exportPdf(data);
        },
        // 18-12-03 科室级活动特定类型下选中参与人
        // 查询需要自动带出参与人地方
        inittraineeplan() {
            let self = this;
            post('/actionplanbase/getautocheckteachtype', {
                command: 'actionplanbase/getautocheckteachtype',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.inittranieelist = data.beanlist;
                }
            }).catch(function (error) {
                //console.log(error)
            })
        },
        checkplanpeople() {
            let self = this;
            if (self.showdialogtype == 0) {
                if (self.dialogForm.activityCategory != 'office' || !self.dialogForm.activityCategory) {
                    return
                } else if (self.dialogForm.doctorOffice == '' || !self.dialogForm.doctorOffice) {
                    return
                } else if (self.dialogForm.activityCategory == '' || !self.dialogForm.activityCategory) {
                    return
                } else if (self.dialogFormstarTime == '' || !self.dialogFormstarTime) {
                    return
                } else if (self.dialogFormsendTime == '' || !self.dialogFormsendTime) {
                    return
                } else {
                    let _startime = moment(self.dialogFormstarTime).format('YYYY-MM-DD HH:mm:ss');
                    let _endtime = moment(self.dialogFormsendTime).format('YYYY-MM-DD HH:mm:ss');
                    if (Date.parse(_endtime.replace('-', '/').replace('-', '/')) < Date.parse(_startime.replace('-', '/').replace('-', '/'))
                        || Date.parse(_endtime.replace('-', '/').replace('-', '/')) == Date.parse(_startime.replace('-', '/').replace('-', '/'))
                    ) {
                        self.$message({
                            showClose: true,
                            message: '活动结束时间必须大于活动开始时间！',
                            type: 'warning'
                        });
                    } else {
                        this.timeArr.forEach(item => {
                            item.date = moment(item.date).format("YYYY-MM-DD");
                        })
                        self.inittranieelist.map(item => {
                            if (self.dialogForm.activityType == item.id) {
                                post('/actionplanbase/getattender', {
                                    command: 'actionplanbase/getattender',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    actionplanlevel: self.dialogForm.activityCategory,//活动类别,
                                    // starttime: moment(self.dialogFormstarTime).format('YYYY-MM-DD HH:mm:ss'),
                                    // endtime: moment(self.dialogFormsendTime).format('YYYY-MM-DD HH:mm:ss'),
                                    actiontime: JSON.stringify(self.timeArr),
                                    officeattend: 'trainee',
                                    deptid: self.dialogForm.doctorOffice,
                                }).then(function (data) {
                                    if (data && data.errcode == 0) {
                                        data.result.attendlist.map(function (item, index) {
                                            item.type = 3;
                                        })
                                        self.tableRightData = data.result.attendlist;
                                        // self.dialogForm.particiPatelist = self.tableRightData;
                                        this.$set(this.dialogForm, 'particiPatelist', self.tableRightData)
                                    }
                                }).catch(function (error) {
                                    //console.log(error)
                                })
                                return
                            } else {
                                self.tableRightData = [];
                                // self.dialogForm.particiPatelist = [];
                                this.$set(this.dialogForm, 'particiPatelist', [])
                            };
                        })
                    }
                };
            };
        },

        // 2018-11-19 院级活动参与人优化
        // 选中的院级参与人
        hospitaldatasubmit(submitlist) {
            this.hospitaldatasubmitlist = submitlist;
            // this.dialogForm.particiPatelist = submitlist
            this.$set(this.dialogForm, 'particiPatelist', submitlist)
            console.log(this.dialogForm.particiPatelist.length)
            this.hospitalcount = submitlist.count;
            this.closeDailog()      //人数
        },
        //2018-11-15  新需求上传视频
        //查询是否有上传视频的权限

        openuploadActivities(item) {
            let self = this;
            let _list = [];
            self.uploadActivities = item.id;
            post('/actionplan/validuploadenclosure', {
                command: 'actionplan/validuploadenclosure',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                id: item.id,
                actionplanid: item.id,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    self.singelgetpicinfo({ actionplanid: item.id, key: 4 })
                } else {
                    self.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                }
            })
        },
        // 指标上传
        openuploadIndicator(item) {
            let self = this;
            self.uploadPoint = item.id;
            post('/actionplan/validUploadIndicator', {
                command: 'actionplan/validUploadIndicator',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                id: item.id,
                actionplanid: item.id,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    if(data.isStd) {
                        self.getTeacherPointList(item.id)
                    }else {
                        self.singelgetpicinfo({ actionplanid: item.id, key: 5 })
                    }
                } else {
                    self.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                }
            })
        },
        submitTeacherPointslist(type) {
            console.log(type)
        },
        submitPointslist(type) {
            let _submitlist = [];
            this.fileUrlData.map((item, index) => {
                _submitlist.push(
                    {
                        uid: getCookie('uid'),
                        actionplanid: this.uploadPoint,
                        fileurl: item.uri,
                        filename: item.name,
                        type
                    }
                )
            });
            post('/actionplan/uploadIndicator', {
                command: 'actionplan/uploadIndicator',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                actionplanid: this.uploadPoint,
                piclist: _submitlist,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.uploadPointdialog = false;
                } else {
                    this.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                }
            })
        },
        submitActivitieslist(type) {
            let _submitlist = [];
            this.fileUrlData.map((item, index) => {
                _submitlist.push(
                    {
                        uid: getCookie('uid'),
                        actionplanid: this.uploadActivities,
                        fileurl: item.uri,
                        filename: item.name,
                        type
                    }
                )
            });
            post('/actionplan/uploadActiveRecord', {
                command: 'actionplan/uploadActiveRecord',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                actionplanid: this.uploadActivities,
                piclist: _submitlist,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.uploadActivitiesdialog = false;
                } else {
                    this.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                }
            })
        },

        openuploadvideo(item) {
            let self = this;
            let _list = [];
            // self.uploadvideoprop = item;
            self.submitfileid = item.id;
            if (item.status == 0) {
                self.$message({
                    message: '未开始的活动不能上传！',
                    type: 'warning'
                });
            } else {
                post('/actionplan/validuploadvideo', {
                    command: 'actionplan/validuploadvideo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    id: item.id,
                    actionplanid: item.id,
                    type: 8
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        self.singelgetpicinfo({ actionplanid: item.id, key: 2 })
                    } else {
                        self.$message({
                            message: data.errdesc,
                            type: 'warning'
                        });
                    }
                })

            }
        },
        // submitvideolist(data) {
        //     let _submitlist = [];
        //     //    console.log('父组件接受的子组件值',data)
        //     data.map((item, index) => {
        //         _submitlist.push(
        //             {
        //                 uid: getCookie('uid'),
        //                 actionplanid: this.uploadvideoprop.id,
        //                 fileurl: item.uri,
        //                 filename: item.name,
        //                 type: 7
        //             }
        //         )
        //     });
        //     post('/actionplan/uploadvideo', {
        //         command: 'actionplan/uploadvideo',
        //         sessionid: getCookie('sid'),
        //         loginid: getCookie('uid'),
        //         uid: getCookie('uid'),
        //         actionplanid: this.uploadvideoprop.id,
        //         piclist: _submitlist,
        //         deltypelist: [7],
        //         type:9
        //     }).then((data) => {
        //         if (data && data.errcode == 0) {
        //             this.$message({
        //                 message: '上传成功！',
        //                 type: 'success'
        //             });
        //             this.uploadvideodialog = false;
        //         } else {
        //             this.$message({
        //                 message: data.errdesc,
        //                 type: 'warning'
        //             });
        //         }
        //     })
        // },

        //顶部导入
        submitUpload() {
            if (!this.hasFile) {
                this.$message({
                    showClose: true,
                    message: '请先选择上传的Excel文件！',
                    type: 'warning'
                });
            }
            this.$refs.upload.submit();
        },
        //顶部下载导入模板
        downloadModel() {
            let data = {
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                command: "actionplan/teachingactionplanmould",
                actionlevel: 'office'
            };
            exportMouldExcel(data);
        },
        changeFile(file, list) {     //文件状态改变
            if (list.length > 1) {
                list.shift();
            }
            if (list.length > 0) {
                this.hasFile = true;
            }
        },
        submitUpload() {                        //上传按钮
            if (!this.hasFile) {
                this.$message({
                    showClose: true,
                    message: '请先选择上传的Excel文件！',
                    type: 'warning'
                });
            }
            this.$refs.upload.submit();
        },
        checkFile(file) {           //上传文件之前 限制文件类型
            const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
            }
            this.hasFile = false;
            return isExcel;
        },
        //顶部上传模板成功
        uploadmodelSuccess(res) {                   //上传成功
            if (res.errcode == 0) {
                this.$message({
                    type: 'success',
                    message: '上传成功'
                })
            } else if (res.errcode == 9903) {
                this.showErrorImport(res.errorlist)
            } else {
                this.$message({
                    type: 'warning',
                    message: res.errdesc
                })
            }
            this.$refs.upload.clearFiles()
            this.dialogTableVisible = false
            this.hasFile = false
            this.$loading().close()
        },
        onProgress() {          //文件上传时-显示进度条
            this.$loading();
        },
        /*顶部区域导出*/
        is_export() {           //导出
            let self = this;
            let data = {
                command: "actionplan/listactionplan",
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                clientflag: 0,//终端标志位0 pc 1 app
                ...this.exportOptions
            };
            exportExcel(data);
        },

        //筛选区全部
        queryAll() {
            let self = this;
            self.pageno = 1;
            this.queryForm.hospitalId = ""
            this.queryForm.baseId = ""
            this.queryForm.deptId = []
            this.hospitalIdList = []
            this.baseIdlist = []
            this.deptIdList = []
            this.hosDeptName = []
            self.rightTableList({ page: self.pageno, reqnum: self.pagesize });
            self.queryForm.activitytype = "";   //活动类型
            self.queryForm.state = "";          //状态
            self.queryForm.inputSearch = "";     //主题/主讲人
            self.queryForm.firsttime = "";      //开始时间
            self.queryForm.lasttime = "";       //结束时间
        },
        //获取活动类型下拉数据
        getactivityTypeList() {
            let self = this;
            post('/turnbaseinfo/turnbaseinfolevel', {
                command: 'turnbaseinfo/turnbaseinfolevel',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                code: 'teachtype',
            }).then((data) => {
                if (data && data.errcode == 0) {
                    self.activittypelist = JSON.parse(data.baseinfolevellist);
                }
            })
        },
        //选择状态
        changeQuery(val) {
            let opt = {};
            this.changeProgress = val;
            if (val != -1) {
                opt.progress = val;         //progress 列表的筛选
            }
        },
        /*开始时间和结束时间*/
        gettimefirst(value) {       //开始时间
            this.queryForm.firsttime = value;//筛选
            this.top_firsttime = value;
        },
        gettimelast(value) {        //结束时间
            this.queryForm.lasttime = value;//筛选
            this.top_lasttime = value;
        },

        /*查询*/
        queryseach() {       //按条件查询，查询按钮
            let option = {
                type: this.queryForm.activitytype,//教学活动类型
                status: this.queryForm.state,    //状态
                starttime: this.queryForm.firsttime,//开始时间
                endtime: this.queryForm.lasttime,      //结束时间
                speakername: this.queryForm.inputSearch,//主题或主讲人
                hospitalIdList: this.hospitalIdList,
                baseIdList: this.baseIdlist,
                deptIdList: this.deptIdList
            }
            this.exportOptions = option;
            this.rightTableList(option)
        },

        /*右表*/
        rightTableList(option = {}) {      //右边table列表
            let self = this;
            this.loadingShow.table = true;
            post('/actionplan/listactionplan', {
                command: 'actionplan/listactionplan',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                clientflag: 0,//终端标志位0 pc 1 app
                page: self.pageno,//查询页数
                reqnum: self.pagesize,//每页显示数
                ...option,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    let tempList = data.result.beanlist
                    tempList.forEach(item => {
                        let actionTime = JSON.parse(item.actiontime);
                        item.actiontime = actionTime
                        // actionTime[0].startTime = action
                        item.time1 = actionTime[0].date + " " + actionTime[0].startTime + "-" + actionTime[0].endTime
                        item.time2 = actionTime.length > 1 ? (actionTime[1].date + " " + actionTime[1].startTime + "-" + actionTime[1].endTime) : ""
                    })
                    self.tableData = tempList;
                    self.totalCount = data.result.count;
                } else {
                    self.tableData = [];
                    self.totalCount = 0;
                }
                this.usePage = false;
                this.loadingShow.table = false;
            }).catch(() => {
                this.loadingShow.table = false;
                this.$message.error({ message: '请求失败，请检查网络！' })
            })
        },

        //表格多个数据删除勾选数组
        handleSelectionChange(item) {
            let self = this;    //0未开始1进行中2已结束
            self.deletelist = [];
            for (let i = 0; i < item.length; i++) {
                if (item[i].status == 0) {
                    if (item[i].delflag == 0) {
                        self.$message({
                            showClose: true,
                            message: '您无权删除非本级别或科室的教学活动,请重新选择！',
                            type: 'warning'
                        });
                        self.$refs.multipleTable.clearSelection();
                    } else {
                        self.deletelist.push(item[i].id)
                    }
                } else {
                    self.$message({
                        showClose: true,
                        message: '请注意只能删除未开始的教学活动！',
                        type: 'warning'
                    });
                    self.$refs.multipleTable.clearSelection();
                }
            }
        },

        /*分页列表*/
        handleSizeChange(size) {             // 查询学生每页显示数据量变更
            this.pagesize = size;
            this.pageno = 1;
            this.queryseach()
        },
        handleCurrentChange(currentPage) {   // 查询学生页码变更
            this.pageno = currentPage;
            this.usePage = true;
            this.queryseach();
        },

        /*新增弹窗*/
        openDialog: function () {      //打开弹窗
            let self = this;
            self.showdialogtype = 0;
            self.disabled = false;
            self.fromupdisabled = false;
            self.dialogForm = {
                activityCategory: '',//活动类别/0院级1基地级2科室级
                doctorOffice: '',//科室
                activityTheme: '',//活动主题
                activityType: '',//活动类型
                statTime: '',//活动开始时间
                endTime: '',//结束时间
                speaker: [],//主讲人
                activityPlace: '',//活动地点
                particiPatelist: [],//参与人员列表
                remark: '',//备注
            };
            self.dialogFormstarTime = '';//开始时间
            self.dialogFormsendTime = '';//结束时间
            //参与人员清除
            self.checkedgread = [];
            self.greadlisttwodialog = [];
            self.checkleftlist = [];
            self.fileList = [];             //附件
            self.sucessfilelist = [];
            self.typeOrGraderadio = '';     //参与人员选中类别

            self.seachcheckshowright = [];
            self.checkAlloffice = false;
            self.checkAll = false;
            self.checkedCities = [];
            self.checkedseachlist = [];

            self.doctor_trainee_list = [];  //科室下参与人员类别选中列表
            self.tableRightData = [];       //参与人员右边列表
            self.activityhosplan_list = {
                startime: '',
                endtime: '',
                actiontime: "",
                datalist: [],
                hosplanflag: 'new'
            };  //数据列表
            self.hospitalcount = '';//院级参与人人数展示
            self.clearhosactivi = 'clear';
            self.editparticiPatelist = [];
            self.dialogTitle = '新增教学活动计划';
            self.activeplandialog = true;
            this.timeArr = [{ date: "", startTime: "", endTime: "" }]
        },

        //查询账号的权限可创建到的教学活动级别
        //活动类别
        getradiolist: function () {    //获取活动类别
            let self = this;
            post('/actionplanbase/getactionplanlevel', {
                command: 'actionplanbase/getactionplanlevel',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.radiolist = data.actionplanlevellist;
                }
            }).catch(function (error) {
            })
        },

        //0院级1基地2科室
        radiochange: function (value) {
            let self = this;

            if (value) {
                self.getdoctoroffice(value)
            };
            if (self.setkongflag) {
                this.selectedDept = {}
                self.dialogForm.doctorOffice = '';//科室
                self.dialogForm.doctorOfficeName = "",
                    self.dialogForm.speaker = [];//主讲人
                self.dialogForm.particiPatelist = [];//参与人员
                self.tableRightData = [];    //参与人员右边选中列表
                self.checkspeakerlist = [];
            }
        },

        getdoctoroffice: function (value) {
            let self = this;
            let thisdata = [];
            self.doctorOfficeList = [];
            let url = "/base/dept/listMyHospital"
            let params = {
                menusId: this.menuId
            }
            if (value == 'hospital') {
                url = "/base/dept/listMyHospital"
                params.type = 3
            } else if (value == 'base') {
                url = "/base/dept/getHosBaseTree"
            } else if (value == 'office') {
                url = "/base/dept/getMyDeptTree"
                params.needBaseDept = 1
            }
            post(url, params).then(data => {
                if (data.resCode == 200) {
                    this.doctorOfficeList = data.model
                } else {
                    this.$message({
                        type: "error",
                        message: data.resMsg
                    })
                }
            })
        },

        //新增窗口查询主讲人列表
        getspeakerList: function () {              //新增窗口查询主讲人列表
            let self = this;
            let param = {}
            if (self.dialogForm.activityCategory && self.dialogForm.doctorOffice) {
                if (this.dialogForm.activityCategory == 'hospital') {
                    param = {
                        hospitalId: this.selectedDept.id
                    }
                } else if (this.dialogForm.activityCategory == 'base') {
                    param = {
                        hospitalId: this.selectedDept.hospitalId,
                        baseId: this.selectedDept.id,
                    }
                } else {
                    param = {
                        hospitalId: this.selectedDept.hospitalId,
                        deptId: this.selectedDept.id
                    }
                }
                post('/base/teachers/listSpeaker', param).then(function (data) {
                    if (data && data.resCode == 200) {
                        data.model.forEach(item => {
                            item.id = Number(item.id)
                        })
                        self.speakerList = data.model;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            }
        },
        //全局搜索主讲人
        seachspeak(param) {
            let self = this;
            if (!self.dialogForm.activityCategory) {
                self.$message({
                    message: '请先选择活动级别',
                    type: 'warning'
                });
            } else {
                if (param != '') {
                    let data = {}
                    if (this.dialogForm.activityCategory == 'hospital') {
                        data = {
                            hospitalId: this.selectedDept.id
                        }
                    } else if (this.dialogForm.activityCategory == 'base') {
                        data = {
                            hospitalId: this.selectedDept.hospitalId,
                            baseId: this.selectedDept.id,
                        }
                    } else {
                        data = {
                            hospitalId: this.selectedDept.hospitalId,
                            deptId: this.selectedDept.id
                        }
                    }
                    post('/base/teachers/listSpeaker', {
                        keyword: param,
                        ...data
                    }).then(res => {
                        if (res && res.resCode == 200) {
                            res.model.forEach(item => {
                                item.id = Number(item.id)
                            })
                            this.speakerList = res.model;
                        }
                    }).catch(function (error) {
                        //console.log(error)
                    })
                }
            }
        },
        /*关闭下拉框时恢复为默认科室下的主讲人*/
        closeseachselect: function (flag) {
            if (!flag) {
                this.getspeakerList()
            }
        },

        /*选择参与人员穿梭框*/
        //获取所有年级列表id
        getgreadlist: function () {
            let self = this;
            self.gradlist = [];
            post('/turnbaseinfo/turnbaseinfolevel', {
                command: 'turnbaseinfo/turnbaseinfolevel',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                code: 'turngrade'
            }).then((data) => {
                if (data && data.errcode == 0) {
                    JSON.parse(data.baseinfolevellist).map(function (item, index) {
                        self.gradlist.push(item.id)
                    })
                }
            }).catch(() => {
            })
        },
        //获取所有的人员类型id
        gettypeIDlist: function () {
            let self = this;
            self.typeidlist = [];
            post('/hr/querylevellist', {
                command: 'hr/querylevellist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                code: 'stud_type'
            }).then((data) => {
                if (data && data.errcode == 0) {
                    data.levellist.map(function (item, index) {
                        self.typeidlist.push(item.key)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        },

        //打开参与人员dialog
        openchoicepeople: function () {
            let self = this;
            var { timeFlag, isempty } = this.checkTime()
            if (!self.dialogForm.activityCategory) {
                self.$message({
                    message: '请先选择活动级别!',
                    type: 'warning'
                });
            } else if (!self.dialogForm.doctorOffice) {
                self.$message({
                    message: '请先选择科室!',
                    type: 'warning'
                });
            } else if (!isempty) {
                self.$message({
                    message: '请选择日期或者时间!',
                    type: 'warning'
                });
            } else if (!timeFlag) {
                self.$message({
                    message: '请检查活动日期是否重复!',
                    type: 'warning'
                });
            } else {
                if (self.dialogForm.activityCategory == 'hospital' || self.dialogForm.activityCategory == 'office') {
                    self.checkhospitaldialog = true;//新版选择院级参与人
                    self.activityhosplan_list = {
                        startime: self.dialogFormstarTime,
                        endtime: self.dialogFormsendTime,
                        actiontime: JSON.stringify(self.timeArr),
                        datalist: self.hosinitdata,
                        hosplanflag: self.hosplanflag,
                    }
                    self.participantsdialog = false;
                    self.clearhosactivi = '';
                } else {
                    self.participantsdialog = true;
                    self.checkhospitaldialog = false;
                }

                self.firstInput = '';
                self.tableLeftData = [];
                //新增时打开
                if (self.typeOrGraderadio && self.typeOrGraderadio == 1) {
                    if (self.dialogForm.activityCategory == 'base') {
                        self.getstudentforgrend({ type: 'turn' })
                    } else if (self.dialogForm.activityCategory == 'hospital') {
                        self.getstudentforgrend({ type: 'grade' });
                    } else { };
                } else if (self.typeOrGraderadio && self.typeOrGraderadio == 2) {
                    if (self.dialogForm.activityCategory == 'base') {
                        self.getstudentforgrend({ type: 'base' })
                    } else if (self.dialogForm.activityCategory == 'hospital') {
                        self.getstudentforgrend({ type: 'type' });
                    } else { };
                } else { };

                if (self.doctor_trainee_list && self.doctor_trainee_list.length == 1) {
                    if (self.doctor_trainee_list[0] == 1) {
                        self.trainee_list = [];
                        self.getstudentforgrend({ type: 'turndoctor' })
                    } else {
                        self.doctor_list = [];
                        self.getstudentforgrend({ type: 'trainee' });
                    }
                } else if (self.doctor_trainee_list && self.doctor_trainee_list.length == 2) {
                    self.getstudentforgrend({ type: 'turndoctor' });
                    self.getstudentforgrend({ type: 'trainee' });
                } else {
                    self.tableLeftData = [];
                }
            }
        },

        //院级下 - 获取按年级分类学生树或学员类型
        //基地下 - 获取两种类型的学生数量
        //科室下 - 获取具体人员
        getstudentforgrend: function (t) {
            let self = this;
            let list = [];
            let option = {};
            if (t.type) {
                if (t.type == 'grade') {
                    list = self.gradlist
                    option = {
                        hospitalattend: t.type,
                        hospitalbusidlist: list,
                    }
                } else if (t.type == 'type') {
                    list = self.typeidlist
                    option = {
                        hospitalattend: t.type,
                        hospitalbusidlist: list,
                    }
                } else if (t.type == 'turn' || t.type == 'base') {
                    option = {
                        deptid: self.dialogForm.doctorOffice,
                        baseattend: t.type,
                    }
                } else if (t.type == 'turndoctor' || t.type == 'trainee') {
                    option = {
                        deptid: self.dialogForm.doctorOffice,
                        officeattend: t.type,
                    }
                } else {
                    return
                }
                self.timeArr.forEach(item => {
                    item.date = moment(item.date).format("YYYY-MM-DD");
                })
                post('/actionplanbase/getattender', {
                    command: 'actionplanbase/getattender',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    actionplanlevel: self.dialogForm.activityCategory,//活动类别,
                    // starttime: moment(self.dialogFormstarTime).format('YYYY-MM-DD HH:mm:ss'),
                    // endtime: moment(self.dialogFormsendTime).format('YYYY-MM-DD HH:mm:ss'),
                    actiontime: JSON.stringify(self.timeArr),
                    ...option
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        /*自然查出来的type为1*/
                        if (self.dialogForm.activityCategory == 'hospital') {
                            data.result.grouplist = data.result.grouplist || []
                            data.result.grouplist.map(function (item, index) {
                                item.type = 1;
                                item.username = item.count;
                            })
                            //self.greadlisttwodialog = data.result.grouplist;
                            //07-16
                            self.tableLeftData = data.result.grouplist;
                        } else if (self.dialogForm.activityCategory == 'base') {
                            if (t.type == 'turn') {
                                self.basecount.turncount = data.result.grouplist[0].count;
                                let _basetable = [];
                                _basetable.push({
                                    id: self.dialogForm.doctorOffice,
                                    name: '正在该基地轮转的学员', //'turn',
                                    username: data.result.grouplist[0].count,
                                    type: 1,
                                    bustype: 'turn'
                                })
                                self.tableLeftData = _basetable;
                            } else if (t.type == 'base') {
                                self.basecount.basecount = data.result.grouplist[0].count;
                                let _basetable = [];
                                _basetable.push(
                                    {
                                        id: self.dialogForm.doctorOffice,
                                        name: '专业在该基地的学员',//'turn',
                                        username: data.result.grouplist[0].count,
                                        type: 1,
                                        bustype: 'base'
                                    }
                                )
                                self.tableLeftData = _basetable;
                            } else { }
                        } else if (self.dialogForm.activityCategory == 'office') {
                            if (t.type == 'turndoctor') {
                                data.result.attendlist.map(function (item, index) {
                                    item.type = 2;
                                })
                                self.doctor_list = data.result.attendlist;
                            } else {
                                data.result.attendlist.map(function (item, index) {
                                    item.type = 3;
                                })
                                self.trainee_list = data.result.attendlist;
                            }
                            self.tableLeftData = self.doctor_list.concat(self.trainee_list)
                        } else {
                            return
                        }
                    }
                }).catch(function (error) {
                    //console.log(error)
                })

            }
        },

        //选中第一个还是第二个 年级或学员类型
        radioCheck(v) {
            let self = this;
            if (self.dialogForm.activityCategory == 'hospital' || self.dialogForm.activityCategory == 'base') {
                if (v == 1) {
                    if (self.dialogForm.activityCategory == 'hospital') {
                        self.getstudentforgrend({ type: 'grade' });
                    } else if (self.dialogForm.activityCategory == 'base') {
                        self.getstudentforgrend({ type: 'turn' })
                    } else { }
                } else if (v == 2) {
                    if (self.dialogForm.activityCategory == 'hospital') {
                        self.getstudentforgrend({ type: 'type' });
                    } else if (self.dialogForm.activityCategory == 'base') {
                        self.getstudentforgrend({ type: 'base' })
                    } else { }
                } else { };
                //把右边相反类型的数据清空
                if (self.tableRightData && self.tableRightData.length > 0) {
                    for (let i = self.tableRightData.length - 1; i >= 0; i--) {
                        if (self.tableRightData[i].type == 1) {
                            self.tableRightData.splice(i, 1);
                        }
                    }
                }
            };
        },
        //选中的住院医实习生
        checkOfficeChange(t) {
            this.tableLeftData = [];
            if (t && t.length == 1) {
                if (t[0] == 1) {
                    this.trainee_list = [];
                    this.getstudentforgrend({ type: 'turndoctor' })
                } else {
                    this.doctor_list = [];
                    this.getstudentforgrend({ type: 'trainee' });
                }
            } else if (t && t.length == 2) {
                this.getstudentforgrend({ type: 'turndoctor' });
                this.getstudentforgrend({ type: 'trainee' });
            } else {
                this.tableLeftData = [];
            }
        },
        //参与人员查找
        queryUsers: function () {
            let self = this;
            if (!self.dialogForm.activityCategory) {
                self.$message({
                    message: '请选择活动类别',
                    type: 'warning'
                });
            } else {
                post('/actionplanbase/getattenderforsearch', {
                    command: 'actionplanbase/getattenderforsearch',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    actionplanlevel: self.dialogForm.activityCategory,//活动类别
                    attendername: self.firstInput,                  //搜索姓名
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        //搜索出来的人type为0
                        data.attendlist.map(function (item, index) {
                            item.type = 0;
                        })
                        self.tableLeftData = data.attendlist;
                        self.typeOrGradeisshow = false;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            }
        },

        //左边的列表选中的人
        leftTableCheck(item) {
            let _list = [];
            item.map((item, index) => {
                _list.push(item)
            });
            this.check_left_list = _list;
        },
        //把左边的选中添加到右边列表
        c_Transfer() {
            let obj = {};
            let self = this;
            let _table_right = self.tableRightData;
            console.log(self.tableRightData, self.check_left_list)
            let _table_left = self.check_left_list;
            _table_left.forEach(item => {
                _table_right.forEach(citem => {
                    if (item.id == citem.id) {
                        citem.username = item.username
                    }
                })
            })
            for (let item_l of _table_left) {
                _table_right.push(item_l);
            }
            self.tableRightData = _table_right.reduce(function (item, next) {
                obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                return item;
            }, []);
            self.$refs.participantsDialog.clearSelection();       //清空左边列表的选择
            self.check_left_list = [];
            _table_left = []; _table_right = [];
        },
        //右边列表选中的
        rightTableCheck(item) {
            let _r_list = [];
            item.map((item, index) => {
                _r_list.push(item)
            })
            this.check_right_list = _r_list;
        },
        //右边列表数据删除
        c_del_right_data() {
            let self = this;
            if (this.tableRightData.length > 0) {
                for (let i = 0; i < this.check_right_list.length; i++) {
                    for (let j = 0; j < this.tableRightData.length; j++) {
                        if (this.check_right_list[i].name == this.tableRightData[j].name && this.check_right_list[i].username == this.tableRightData[j].username) {
                            this.tableRightData.splice(j, 1)
                        }
                    }
                }
            };
        },

        saveTableListInOut() {
            let self = this;
            self.dialogForm.particiPatelist = self.tableRightData;
            if (self.dialogForm.activityCategory == 'base') { //基地下
                if (self.typeOrGraderadio == 1) {             //互斥选择；第一个还是第二个
                    self.forminbaseorturn = 'turn';
                } else if (self.typeOrGraderadio == 2) {
                    self.forminbaseorturn = 'base';
                } else { }
            } else if (self.dialogForm.activityCategory == 'hospital') {
                //  //医院下；是选择了年级还是人员类型的
                if (self.typeOrGraderadio == 1) {
                    self.hospitalGradeortype = 'grade';
                } else if (self.typeOrGraderadio == 2) {
                    self.hospitalGradeortype = 'type';
                } else {
                    self.hospitalGradeortype = ''; //没选就传空
                }
                self.hospitaltype = '';
            } else { };
            self.participantsdialog = false;
        },

        //文件上传区域
        handleRemove(file, fileList) {      //  文件列表移除文件时的钩子
            let self = this;
            self.flag = 0;
            self.sucessfilelist = fileList;
        },
        beforeRemove(file, fileList) {      //移除文件之前的钩子
            let self = this;
            return self.$confirm(`确定移除 ${file.name}？`);
        },
        clickthisfile: function (file) { },
        handleExceed(file, fileList) {  //文件超出限制
            this.$message({
                showClose: true,
                message: '最多能一次上传3个文件！',
                type: 'warning'
            });
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        uploadsuccess: function (file, fileList) {
            let self = this;
            if (file && file.code && file.code == 200) {
                if (self.flag) {
                    self.sucessfilelist.push(fileList);
                } else {
                    self.sucessfilelist.push(fileList);
                    for (let i = 0; i < self.sucessfilelist.length; i++) {
                        if (self.sucessfilelist[i].url == fileList.url) {
                            self.sucessfilelist.splice(i, 1);
                            return
                        }
                    }
                }
            } else {
                this.$message({
                    message: '文件上传失败,请重新上传！',
                    type: 'warning'
                })
                this.sucessfilelist = [];
                this.fileList = [];
            }
        },

        //关闭新增弹窗
        closeDialog: function () {
            this.dialog = false;
            this.activeplandialog = false;
            this.editinitlist = [];
            this.showAddtime = false
        },
        checkTime() {
            let timeFlag = true
            let isempty = true
            this.timeArr.forEach((item, index) => {
                if (item.date == "") {
                    isempty = false
                } else if (item.startTime == "") {
                    isempty = false
                } else if (item.endTime == "") {
                    isempty = false
                }

                if (isempty) {
                    this.timeArr.forEach((citem, cindex) => {
                        if (index != cindex) {
                            if (!(citem.start >= item.end || citem.end <= item.start)) {
                                timeFlag = false
                            }

                        }
                    })
                }

            })
            return { timeFlag, isempty }

        },

        //提交新增表单
        sureDialogForm: function () {
            let self = this;
            let _speakerlist = [];
            let _h = {};
            let _attendinfo = {};
            let _attendinfolist = [];
            let _uploadfilelist = [];
            let option = {};
            let _startime = moment(self.dialogForm.starTime).format('YYYY-MM-DD HH:mm:ss');
            let _endtime = moment(self.dialogForm.sendTime).format('YYYY-MM-DD HH:mm:ss');
            //新增的附件上传
            if (self.sucessfilelist.length > 0) {
                for (let i = 0; i < self.sucessfilelist.length; i++) {
                    _uploadfilelist.push(
                        {
                            'uid': getCookie('uid'),
                            'fileurl': self.sucessfilelist[i].response.data.uri,
                            'filename': self.sucessfilelist[i].response.data.fullname,
                            'type': 1
                        }
                    )
                }
            };
            var { timeFlag, isempty } = this.checkTime()
            if (!self.dialogForm.activityCategory || self.dialogForm.activityCategory == '') {
                self.$message({
                    message: '请选择活动级别',
                    type: 'warning'
                });
                return false
            } else if (self.dialogForm.doctorOffice == '') {
                self.$message({
                    message: '请选择科室',
                    type: 'warning'
                });
                return false
            } else if (self.dialogForm.activityTheme == '') {
                self.$message({
                    message: '请输入活动主题',
                    type: 'warning'
                });
                return false
            } else if (self.dialogForm.activityType == '') {
                self.$message({
                    message: '请选择活动类型',
                    type: 'warning'
                });
                return false
            } else if (!isempty) {
                self.$message({
                    message: '请选择日期或者时间!',
                    type: 'warning'
                });
                return false
            } else if (!timeFlag) {
                self.$message({
                    message: '请检查活动日期是否重复!',
                    type: 'warning'
                });
                return false
            }
            else if (self.dialogForm.speaker.length == 0) {
                self.$message({
                    message: '请选择主讲人',
                    type: 'warning'
                });
                return false
            } else if (self.dialogForm.activityPlace == '') {
                self.$message({
                    message: '请输入活动地点',
                    type: 'warning'
                });
                return false
            } else {
                if (self.dialogForm.activityCategory == 'hospital' || self.dialogForm.activityCategory == 'office') {
                    //有参与人员再处理
                    if (self.dialogForm.particiPatelist.length > 0) {
                        self.dialogForm.particiPatelist.map(function (item, index) {
                            _attendinfolist.push({
                                attendbusid: item.id,
                                attendbusinfo: item.name + '-' + item.username,
                                name: item.name,
                                username: item.username,
                                type: 0,
                                bustype: ''
                            })
                        })
                        _attendinfo = {
                            actionplanlevel: self.dialogForm.activityCategory,
                            deptid: self.dialogForm.doctorOffice,
                            starttime: _startime,
                            endtime: _endtime
                        }
                    }
                } else if (self.dialogForm.activityCategory == 'base') {
                    console.log(self.dialogForm.particiPatelist, "-----")
                    //基地下的参与人员查询条件，只传deptid
                    if (self.dialogForm.particiPatelist) {
                        _attendinfo = {
                            actionplanlevel: self.dialogForm.activityCategory,
                            deptid: self.dialogForm.doctorOffice,
                            actiontime: JSON.stringify(self.timeArr),
                            baseattend: self.forminbaseorturn,
                        };
                        self.dialogForm.particiPatelist.map(function (item, index) {
                            _attendinfolist.push(
                                {
                                    attendbusid: item.id,
                                    attendbusinfo: item.name + '-' + item.username,
                                    type: item.type,
                                    bustype: item.bustype
                                },
                            )
                        })
                    };

                } else {
                    self.$message({
                        message: '请选择活动级别',
                        type: 'warning'
                    });
                };
            };
            self.dialogForm.speaker.map(function (item, iendex) {      //主讲人
                _speakerlist.push({ uid: item })
            });

            // 时间格式处理
            this.timeArr.forEach(item => {
                item.date = moment(item.date).format("YYYY-MM-DD");
            })
            self.fromupdisabled = true;
            if (self.dialogForm.activityType == '3' || self.dialogForm.activityType == '13') {
                self.dialogForm.period = 2
            } else {
                self.dialogForm.period = 1
            };
            post('/actionplan/addactionplan', {
                command: 'actionplan/addactionplan',
                uid: getCookie('uid'),
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                actionplanlevel: self.dialogForm.activityCategory,			//活动级别
                deptid: self.dialogForm.doctorOffice,		//科室*
                theme: self.dialogForm.activityTheme,		//活动主题*
                type: self.dialogForm.activityType,		//教学活动类型名称*
                actiontime: JSON.stringify(this.timeArr), //活动时间
                speakerlist: _speakerlist,			//主讲人列表
                place: self.dialogForm.activityPlace,		//教学活动地点
                attendinfo: _attendinfo,				// 参与人列表查询封装条件
                attendinfolist: _attendinfolist,		//--参与人列表
                remark: self.dialogForm.remark,			//备注
                filelist: _uploadfilelist,			//--文件列表(附件)
                period: self.dialogForm.period
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.activeplandialog = false;
                    self.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    self.queryseach()
                    self.fromupdisabled = false;
                } else if (data && data.errdesc) {
                    self.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                    self.fromupdisabled = false;
                } else {
                    self.$message({
                        message: '后台响应失败！！！',
                        type: 'warning'
                    })
                    self.fromupdisabled = false;
                }
            }).catch(function (error) {
                //console.log(error)
                self.fromupdisabled = false;
            })
        },

        /*编辑查询*/
        dataedit(row) {
            let self = this;
            let _speakerlist = [];
            this.showdialogtype = 1;
            this.dialogTitle = '修改教学活动计划';
            this.dialogForm.doctorOffice = '';//科室
            this.dialogForm.activityTheme = '';//活动主题
            this.dialogForm.activityType = '';//活动类型
            this.dialogForm.activityPlace = '';//活动地点
            this.dialogForm.remark = '';//备注
            this.dialogForm.starTime = '';
            this.dialogForm.endTime = '';
            this.dialogForm.speaker = [];
            this.dialogForm.particiPatelist = [];
            this.speakerList = [];      //主讲人下拉列表
            this.sucessfilelist = [];
            this.fileList = [];
            this.dialogForm.activityCategory = '';
            this.dialogFormstarTime = '';
            this.dialogFormsendTime = '';
            this.isedit = true;
            this.setkongflag = false;
            this.fieldrecordlist = [];
            this.dialogeditid = row.id;
            this.disabled = false;
            this.dialogForm.period = 1;
            this.propActivities = [];
            post('/actionplan/getactionplandetail', {
                command: 'actionplan/getactionplandetail',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                clientflag: 0,
                actionplanid: row.id,
                //修改计划ID
            }).then((data) => {
                if (data && data.errcode == 0) {
                    this.hosinitdata = data.bean.attendinfolist;
                    this.hosplanflag = 'edit';
                    if (data.bean.status != 0) {
                        this.disabled = true;
                    }
                    this.dialogForm.period = JSON.parse(data.bean.period)
                    this.timeArr = JSON.parse(data.bean.actiontime)
                    this.timeArr.forEach(item => {
                        let currentTime = new Date().getTime()
                        item.start = new Date(item.date + " " + item.startTime).getTime()
                        item.end = new Date(item.date + " " + item.endTime).getTime()
                        let tempS = item.startTime.split(":")
                        let tempE = item.endTime.split(":")
                        item.startTime = tempS[0] + ":" + tempS[1]
                        item.endTime = tempE[0] + ":" + tempE[1]
                        item.status = data.bean.status
                        if (data.bean.status != 0) {
                            if (item.start > currentTime) {
                                item.disabled = false
                                this.showAddtime = true
                            } else {
                                item.disabled = true
                            }
                        } else {
                            item.disabled = false
                            this.showAddtime = true
                        }

                    })
                    this.getdoctoroffice(data.bean.actionplanlevel)
                    this.doctorOfficeeditid = data.bean.deptid;
                    this.dialogForm.activityCategory = String(data.bean.actionplanlevel);	//活动类别
                    this.dialogForm.activityTheme = data.bean.theme;			//活动主题
                    this.dialogForm.activityType = String(data.bean.type);			//活动类型\n
                    this.dialogFormstarTime = moment(data.bean.starttimestr).format(); //开始时间
                    this.dialogFormsendTime = moment(data.bean.endtimestr).format();	//结束时间
                    let _checkspeaklist = [];
                    data.bean.speakerlist.map((item, index) => {  ///主讲人
                        this.dialogForm.speaker.push(item.uid);
                        _checkspeaklist.push(item.uid)
                        _speakerlist.push({
                            id: item.uid,
                            name: item.uname,
                            nameandusername: item.uname + '-' + item.username,
                            username: item.username,
                        })
                    })
                    this.checkspeakerlist = _checkspeaklist;
                    this.speakerList = _speakerlist;
                    this.dialogForm.activityPlace = data.bean.place;//活动地点
                    this.editparticiPatelist = data.bean.attendinfolist;        //参与人员列表
                    if (data.bean.actionplanlevel == 'hospital') {
                        this.activityhosplan_list = {
                            starttime: data.bean.starttimestr,
                            endtime: data.bean.endtimestr,
                            actiontime: JSON.stringify(this.timeArr),
                            deptid: data.bean.deptid,
                            datalist: data.bean.attendinfolist,
                        }
                        this.selectedDept.id = data.bean.hospital
                    } else if (data.bean.actionplanlevel == 'base') {
                        this.selectedDept.id = data.bean.base
                        this.selectedDept.hospitalId = data.bean.hospital
                    } else {
                        this.selectedDept.id = data.bean.deptid
                        this.selectedDept.baseId = data.bean.base
                        this.selectedDept.hospitalId = data.bean.hospital
                    }
                    let _particiPatelist = [];
                    data.bean.attendinfolist.map((item, index) => {
                        this.hospitalcount = item.attendbusinfo; //参与人数
                        if (item.attendbusinfo.split('-')[0] == '正在该基地轮转的学员') {
                            this.forminbaseorturn = 'turn';
                            this.typeOrGraderadio = 1
                        } else if (item.attendbusinfo.split('-')[0] == '专业在该基地的学员') {
                            this.forminbaseorturn = 'base';
                            this.typeOrGraderadio = 2
                        } else { };
                        if (item.bustype) {
                            this.hospitaltype = item.bustype;
                        };
                        let tempArr = item.attendbusinfo.split('-')
                        _particiPatelist.push(
                            {
                                id: item.attendbusid,
                                name: tempArr.splice(0, tempArr.length - 1).join(""),
                                username: tempArr.splice(tempArr.length - 1, tempArr.length).join(""),
                                type: item.type,
                                count: tempArr.splice(tempArr.length - 1, tempArr.length).join(""),
                                bustype: item.bustype,
                                //"actionplanid": 466,
                            }
                        )

                    })
                    this.dialogForm.doctorOffice = data.bean.deptid

                    this.dialogForm.doctorOfficeName = data.bean.deptname


                    this.dialogForm.particiPatelist = _particiPatelist;
                    this.tableRightData = _particiPatelist;
                    this.dialogForm.remark = data.bean.remark;       //备注
                    // self.dialogForm.doctorOffice = data.bean.deptid;        //医院/基地/科室
                    //上传文件列表//
                    this.$nextTick(() => {
                        if (data.bean.actionplanlevel != 'hospital') {
                            console.log(data.bean.deptid)
                            console.log(this.$refs)
                            this.$refs.treeDom.setCheckedKeys([data.bean.deptid])
                        }
                    })
                    this.$set(this, "dialogForm", this.dialogForm)
                    if (data.bean.fileuploadlist) {
                        let querythisfile = data.bean.fileuploadlist;
                        for (let i = 0; i < querythisfile.length; i++) {
                            if (querythisfile[i].type == 1) {
                                this.fileList.push(
                                    {
                                        'name': querythisfile[i].filename,
                                        'url': querythisfile[i].fileurl
                                    }
                                )
                            }
                        }
                        this.sucessfilelist = this.fileList;
                    };
                    this.getspeakerList();
                    this.activeplandialog = true;//打开弹窗
                    this.setkongflag = false;
                }
            }).catch(function (error) {
                //console.log(error);
            })

        },

        /*编辑提交*/
        editsureDialogForm: function () {
            let self = this;
            let _speakerlist = [];
            let _h = {};
            let _attendinfo = {};
            let _attendinfolist = [];
            let _uploadfilelist = [];
            let _startime = moment(self.dialogFormstarTime).format('YYYY-MM-DD HH:mm:ss');
            let _endtime = moment(self.dialogFormsendTime).format('YYYY-MM-DD HH:mm:ss');
            // if (self.dialogForm.activityCategory == 'hospital') {
            //     if (self.hospitaldatasubmitlist.editflag == true) {
            //         self.dialogForm.particiPatelist = self.hospitaldatasubmitlist.concat(self.hospitaldatasubmitlist.stutypelist).concat(self.hospitaldatasubmitlist.baselist)
            //     } else {
            //         self.dialogForm.particiPatelist = self.editparticiPatelist;  //未处理的数组
            //     }
            // };
            //有参与人员列表处理；无参与人员列表，传空数组
            if (self.dialogForm.particiPatelist.length > 0) {
                if (self.dialogForm.activityCategory == 'hospital' || self.dialogForm.activityCategory == 'office') {
                    self.dialogForm.particiPatelist.map(function (item, index) {
                        _attendinfolist.push({
                            attendbusid: item.id,
                            attendbusinfo: item.name + '-' + item.username,
                            type: 0
                        })
                    })
                    _attendinfo = {
                        actionplanlevel: self.dialogForm.activityCategory,
                        deptid: self.dialogForm.doctorOffice,
                        starttime: _startime,
                        endtime: _endtime,
                    };
                } else if (self.dialogForm.activityCategory == 'base') {
                    //基地下的参与人员查询条件，只传deptid
                    _attendinfo = {
                        actionplanlevel: self.dialogForm.activityCategory,
                        deptid: self.dialogForm.doctorOffice,
                        starttime: _startime,
                        endtime: _endtime,
                        baseattend: self.forminbaseorturn
                    };
                    if (self.dialogForm.particiPatelist) {
                        self.dialogForm.particiPatelist.map(function (item, index) {
                            if (item.name == '在该基地轮转的人') {
                                item.name = 'turn'
                            } else if (item.name == '专业基地在该基地的人') {
                                item.name = 'base'
                            } else { }
                            _attendinfolist.push(
                                {
                                    attendbusid: item.id,
                                    attendbusinfo: item.name + '-' + item.username,
                                    type: item.type,
                                    bustype: self.forminbaseorturn,
                                },
                            )
                        })
                    };
                } else {
                    self.$message({
                        message: '请选择活动级别',
                        type: 'warning'
                    });
                };
            };

            //处理附件列表
            let _uploadfilelist_edit = [];
            for (let i = 0; i < self.sucessfilelist.length; i++) {
                if (self.sucessfilelist[i].response) {
                    self.sucessfilelist[i] = {
                        'url': self.sucessfilelist[i].response.data.uri,
                        'name': self.sucessfilelist[i].response.data.fullname,
                    }
                }
                _uploadfilelist_edit.push(
                    {
                        'uid': getCookie('uid'),
                        'fileurl': self.sucessfilelist[i].url,
                        'filename': self.sucessfilelist[i].name,
                        'actionplanid': self.dialogeditid,
                        'type': 1
                    }
                )
            };
            var { timeFlag, isempty } = self.checkTime()
            console.log(timeFlag, isempty, "11111", self.timeArr)
            if (!self.dialogForm.activityCategory || self.dialogForm.activityCategory == '') {
                self.$message({
                    message: '请选择活动级别',
                    type: 'warning'
                });
            } else if (self.dialogForm.doctorOffice == '') {
                self.$message({
                    message: '请选择科室',
                    type: 'warning'
                });
            } else if (self.dialogForm.activityTheme == '') {
                self.$message({
                    message: '请输入活动主题',
                    type: 'warning'
                });
            } else if (self.dialogForm.activityType == '') {
                self.$message({
                    message: '请选择活动类型',
                    type: 'warning'
                });
            } else if (!isempty) {
                self.$message({
                    message: '请选择日期或者时间!',
                    type: 'warning'
                });
            } else if (!timeFlag) {
                self.$message({
                    message: '请检查活动日期是否重复!',
                    type: 'warning'
                });
            } else if (self.checkspeakerlist.length == 0) {
                self.$message({
                    message: '请选择主讲人',
                    type: 'warning'
                });
            } else if (self.dialogForm.activityPlace == '') {
                self.$message({
                    message: '请输入活动地点',
                    type: 'warning'
                });
            } else {
                //主讲人
                self.checkspeakerlist.map(function (item, iendex) {
                    _speakerlist.push({ uid: item })
                });

                // 时间格式处理
                self.timeArr.forEach(item => {
                    item.date = moment(new Date(item.date)).format("YYYY-MM-DD");
                    // item.startTime = item.startTime.split(":").length > 2 ? item.startTime : item.startTime + ":00"
                    // item.endTime = item.endTime.split(":").length > 2 ? item.endTime : item.endTime + ":00"
                })
                self.fromupdisabled = true;

                if (self.dialogForm.activityType == '3' || self.dialogForm.activityType == '13') {
                    self.dialogForm.period = 2
                } else {
                    self.dialogForm.period = 1
                };
                post('/actionplan/updateactionplan', {
                    command: 'actionplan/updateactionplan',
                    id: self.dialogeditid,
                    uid: getCookie('uid'),
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    actionplanlevel: self.dialogForm.activityCategory,			//活动级别
                    deptid: self.dialogForm.doctorOffice,		//科室*
                    theme: self.dialogForm.activityTheme,		//活动主题*
                    type: self.dialogForm.activityType,		//教学活动类型名称*
                    actiontime: JSON.stringify(self.timeArr),
                    // starttime: moment(self.dialogFormstarTime).format('YYYY-MM-DD HH:mm:ss'),	//开始时间
                    // endtime: moment(self.dialogFormsendTime).format('YYYY-MM-DD HH:mm:ss'),		//结束时间
                    speakerlist: _speakerlist,			//主讲人列表
                    place: self.dialogForm.activityPlace,		//教学活动地点
                    attendinfo: _attendinfo,				// 参与人列表查询封装条件
                    attendinfolist: _attendinfolist,		//--参与人列表
                    remark: self.dialogForm.remark,			//备注
                    filelist: _uploadfilelist_edit,		//--文件列表(附件)
                    period: self.dialogForm.period
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.activeplandialog = false;
                        self.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        // let option = {
                        //     deptid: self.treedeptid,
                        //     type: self.queryForm.activitytype,//教学活动类型
                        //     status: self.queryForm.state,    //状态
                        //     starttime: self.top_firsttime,//开始时间
                        //     endtime: self.top_lasttime,      //结束时间
                        //     speakername: self.queryForm.inputSearch,//主题或主讲人
                        // }
                        // self.rightTableList(option)
                        self.queryseach()
                        self.fromupdisabled = false;
                    } else if (data && data.errdesc) {
                        self.$message({
                            message: data.errdesc,
                            type: 'warning'
                        });
                        self.fromupdisabled = false;
                    } else {
                        self.$message({
                            message: '后台响应失败！！！',
                            type: 'warning'
                        })
                        self.fromupdisabled = false;
                    }
                }).catch(function (error) {
                    //console.log(error)
                    self.fromupdisabled = false;
                });

            }
        },

        /*查看弹窗头部锚点查看*/
        jumpthere: function (t, v) {
            if (t.index == 0) {
                document.getElementById('btn').scrollIntoView();
            } else if (t.index == 1) {
                document.getElementById('btn1').scrollIntoView();
            } else if (t.index == 2) {
                document.getElementById('btn2').scrollIntoView();
            } else if (t.index == 3) {
                document.getElementById('btn3').scrollIntoView(true);
            } else if (t.index == 4) {
                document.getElementById('btn4').scrollIntoView();
            } else {
                return
            }
        },

        //查看教学活动计划
        detail: function (row) {
            let self = this;
            self.showdialogtype = 2;
            self.dialogTitle = '查看教学活动计划';
            self.echartid = row.id;
            self.dialogForm = {};
            self.dialogForm.speaker = [];
            if (self.dialogForm.activityType == '3' || self.dialogForm.activityType == '13') {
                self.dialogForm.period = 2
            } else {
                self.dialogForm.period = 1
            };
            post('/actionplan/getactionplandetail', {
                command: 'actionplan/getactionplandetail',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                clientflag: 0,
                actionplanid: row.id,   //修改计划ID
                period: self.dialogForm.period
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.dialogForm = data.bean;
                    self.fileurltitle = data.fdfsurl;
                    self.timeArr = JSON.parse(data.bean.actiontime)
                    self.getdetailechart();//查询饼图数据
                    self.getscorefeedbackstatistics();//活动反馈
                    self.singelgetpicinfo({ actionplanid: row.id, key: 1 });//活动记录
                    self.activeplandialog = true;//打开弹窗
                    self.$nextTick(function () {
                        self.activeName = 'first';
                        document.getElementById('btn').scrollIntoView();
                    });
                }
            }).catch(function (error) {
                //console.log(error);
            })
        },

        //饼图 echart 数据查询接口调用
        getdetailechart() {
            let self = this;
            post('/actionplan/signinfo', {
                command: 'actionplan/signinfo',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                actionplanid: self.echartid,     //修改计划ID
                uid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    //人数
                    self.opinionData = [
                        { 'value': data.bean.signpercent, 'name': '签到率' },
                        { 'value': 100 - Number(data.bean.signpercent), 'name': '缺勤率' },
                    ];
                    self.signform = data.bean;
                    self.signincountlabel = '计划内签到人员' + '(' + data.bean.signincount + ')';
                    self.signabsencecountlabel = '缺勤人员' + '(' + data.bean.signabsencecount + ')';
                    self.signleavecountlabel = '请假人员' + '(' + data.bean.signleavecount + ')';
                    self.signoutcountlabel = '计划外签到人员' + '(' + data.bean.signoutcount + ')';
                    self.$nextTick(function () {
                        self.initpie('echart')
                    });
                }
            }).catch(function (error) {
                //console.log(error);
            });
        },
        //饼图
        initpie: function (id) {
            let self = this;
            self.chart = echarts.init(document.getElementById(id));
            self.chart.setOption({
                title: {
                    text: '签到情况统计',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'top',
                    data: ['签到人数', '缺勤人数']
                },
                series: [
                    {
                        name: '签到情况统计',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: self.opinionData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'// ['#00b4f4','#f7c416']//
                            }
                        }
                    }
                ]
            });
        },
        getTeacherPointList(id) {
            let self = this
            get(`/base/teaching_action_plan/indicatorList?actionPlanId=${id}`).then(res => {
                if (res.resCode == 200 || res.resCode == 0) {
                    res.rows.forEach(i => {
                        i.fileurlist = i.fileurl?[{name:i.filename,url:i.fileurl}]:[]
                        i.fileurlist2 = i.fileurl2?[{name:i.filename2,url:i.fileurl2}]:[]
                    })
                    self.TeacherPointList = res.rows
                    self.TeacherPointListLength = res.total
                    self.TeacherPointListDialog = true
                }
            })
        },
        handlePreview2(file) {
            console.log('view',file)
        },
        handleRemove2(file) {
            console.log(file,this.TeacherPointList)
            // let i = 0
            // this.TeacherPointList.forEach(i => {
            //     i.fileurlist.forEach(i => {
            //         if(i.)
            //     })
            // })
        },
        //2019-01-10 修改，获取现场记录图片，视频 ，附件
        singelgetpicinfo(obj) {
            let self = this;
            let _list = [];
            post('/actionplan/getuploadpicinfo', {
                command: 'actionplan/getuploadpicinfo',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                actionplanid: obj.actionplanid,
                searchflag: 1,//0查询暂存    1：查询实际提交信息
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    if (obj.key == 1) {
                        //现场记录
                        self.type3piclist = [];
                        self.examinationpiclist1 = [];
                        self.examinationpiclist2 = [];
                        self.examinationpiclist3 = [];
                        self.detailvideolist = [];
                        self.fieldrecordlist = data.bean;
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 3) {
                                    self.type3piclist.push(item)
                                } else if (item.type == 4) {
                                    self.examinationpiclist1.push(item)
                                } else if (item.type == 5) {
                                    self.examinationpiclist2.push(item)
                                } else if (item.type == 6) {
                                    self.examinationpiclist3.push(item)
                                } else if (item.type == 7) {
                                    self.detailvideolist.push(item)
                                }
                            })
                        }
                        self.detailpicurl = data.fdfsurl;
                    } else if (obj.key == 2) {
                        //视频位
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 7) {
                                    _list.push(
                                        {
                                            name: item.filename,
                                            uri: item.fileurl,
                                            url: data.fdfsurl + item.fileurl
                                        }
                                    )
                                };
                            })
                        };
                        self.propvideolist = _list;
                        self.uploadvideodialog = true;
                    } else if (obj.key == 3) {
                        //附件
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 1) {
                                    _list.push(
                                        {
                                            name: item.filename,
                                            uri: item.fileurl,
                                            url: data.fdfsurl + item.fileurl
                                        }
                                    )
                                };
                            })
                        };
                        self.propfilelist = _list;
                        self.uploadfiledialog = true;
                    } else if (obj.key == 4) {
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 8) {
                                    _list.push(
                                        {
                                            name: item.filename,
                                            uri: item.fileurl,
                                            url: data.fdfsurl + item.fileurl
                                        }
                                    )
                                };
                            })
                        };
                        self.propActivities = _list;
                        self.uploadActivitiesdialog = true;
                    } else if (obj.key == 5) {
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 9) {
                                    _list.push(
                                        {
                                            name: item.filename,
                                            uri: item.fileurl,
                                            url: data.fdfsurl + item.fileurl
                                        }
                                    )
                                };
                            })
                        };
                        self.propPoints = _list;
                        self.uploadPointdialog = true;
                    } else if (obj.key == 6) {
                        if (data.bean.piclist && data.bean.piclist.length > 0) {
                            data.bean.piclist.map(item => {
                                if (item.type == 9) {
                                    _list.push(
                                        {
                                            name: item.filename,
                                            uri: item.fileurl,
                                            url: data.fdfsurl + item.fileurl
                                        }
                                    )
                                };
                            })
                        };
                        self.propPoints = _list;
                        self.uploadPointdialog = true;
                    }
                    else {
                        return
                    };
                } else if (data && data.errdesc) {
                    self.$message({
                        message: data.errdesc,
                        type: 'warning'
                    });
                } else {
                    self.$message({
                        message: '后台响应失败！！！',
                        type: 'warning'
                    })
                };
            }).catch(function (error) {
                //console.log(error);
            });
        },


        //反馈评分统计
        getscorefeedbackstatistics: function () {
            let self = this;
            post('/teachingactivityplan/teachingactionplancountV2', {
                command: 'teachingactivityplan/teachingactionplancountV2',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                teachingPlanId: self.echartid,       //修改计划ID
                menusId: this.menuId
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.score = data.avgScore;
                    self.totalscore = data.totalScore;
                    self.evaluatepeoplecount = data.hasScoreCount;
                    self.evaluatepeopletotalcount = data.totalScoreCount;
                    self.evaluationlist = data.scoreSubmitRecordDetails;
                    // self.suglist = data.suglist;
                }
            }).catch(function (error) {
                //console.log(error);
            });
        },

        //查看更多
        clickdetailmore: function (v) {
            let self = this;
            self.detailmoredialog = true;
            self.moremodel = '';
            if (!v.seachname) {
                v.seachname = '';
            }
            post('/actionplanbase/getactionplanuser', {
                command: 'actionplanbase/getactionplanuser',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                actionplanid: self.echartid,
                name: v.seachname,
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    self.moreData = data.beanlist;
                }
            }).catch(function (error) {
                //console.log(error)
            })
        },
        //查看更多单个搜索
        moreseach: function () {
            this.clickdetailmore({ seachname: this.moremodel });
        },
        //查看更多-批量导出
        more_export() {
            console.log(this.echartid)
            let data = {
                command: "actionplanbase/getactionplanuser",
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                actionplanid: this.echartid,
                name: ''
            };
            exportExcel(data);
        },

        //单个删除
        delete_this: function (row) {
            let self = this;
            if (self.deletelist < 2) {
                self.deletethis_id = row.id;
            };
            self.$confirm('确定删除此数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/actionplan/delactionplanbyid', {
                    command: 'actionplan/delactionplanbyid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: self.deletethis_id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        // let option = {
                        //     deptid: self.queryForm.doctorOffice,
                        //     type: self.queryForm.activitytype,//教学活动类型
                        //     status: self.queryForm.state,    //状态
                        //     starttime: self.top_firsttime,//开始时间
                        //     endtime: self.top_lasttime,      //结束时间
                        //     speakername: self.queryForm.inputSearch,//主题或主讲人
                        // };
                        // self.rightTableList(option);
                        self.queryseach()
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            }).catch(() => {

            });
        },
        //批量删除
        batchdeleting: function () {
            let self = this;
            if (self.deletelist.length == 0) {
                self.$message({
                    showClose: true,
                    message: '请先勾选权限内未开始的教学活动！',
                    type: 'warning'
                });
                return;
            } else if (self.deletelist.length < 2) {
                self.$message({
                    showClose: true,
                    message: '请最少选择两条数据！',
                    type: 'warning'
                });
                return;
            } else {
                post('/actionplan/delactionplanbatch', {
                    command: 'actionplan/delactionplanbatch',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    idlist: self.deletelist,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.$message({
                            message: '批量删除成功',
                            type: 'success'
                        });
                        // let option = {
                        //     deptid: self.queryForm.doctorOffice,
                        //     type: self.queryForm.activitytype,//教学活动类型
                        //     status: self.queryForm.state,    //状态
                        //     starttime: self.top_firsttime,//开始时间
                        //     endtime: self.top_lasttime,      //结束时间
                        //     speakername: self.queryForm.inputSearch,//主题或主讲人
                        // };
                        // self.rightTableList(option);
                        self.queryseach()
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.teachingPlab-self {
    .topTools {
        div.newQueryTools {
            div.zy-clear {
                div.mainQuery {
                    .hosDeptBox {
                        .el-select {
                            width: 180px
                        }
                    }
                }

                span.coll {
                    width: 60px;
                    display: inline-block;
                }

                .speaker-input {
                    input {
                        width: 220px
                    }
                }
            }
        }
    }
}

.wapper {
    padding: 0 20px;
}

.tool-tips {
    margin-bottom: 3px;
}

.table-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tool-tips img,
.table-time img {
    vertical-align: -2px;
    margin-right: 5px;
}

.delete-span {
    display: inline-block;
    width: 20px;
}

.red {
    color: red;
}

.el-col {
    line-height: 36px;
}

// .page-tools {
//     margin: 15px 0px;
// }

.queryTools {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}

.queryAll {
    float: left;
    margin-right: 12px;
}

.queryTools .el-form-item {
    width: 190px;
    margin-bottom: 10px;
}

.queryTools .el-select {
    width: 120px;
}

.upload-demo {
    display: inline-block;
    margin: 15px 0;
}

.text_upload {
    width: 100%;
}

.eltag {
    width: auto;
    max-height: 70px;
    overflow: hidden;
}

.doctoroffice {
    display: inline;
}

.separation_line {
    width: 100%;
    margin: 15px 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
}

.field_situation {
    width: 100%;
    margin: 15px;

}

.field_situation img {
    width: 80px;
    height: 80px;
    display: inline-block;
    margin-right: 8px;
}

.position_relative {
    position: relative;
}

.bigpicture {
    width: 600px;
    height: 50%;
    z-index: 999;
}

.crode_right {
    display: inline-block;
    float: right
}

.picremark {
    margin: 15px;
}

.tree-data {
    margin-top: 10px;
    clear: both;
}

.tree-data:after {
    clear: both;
    display: block;
    content: '';
}

.emp-tree {
    float: left;
    width: 22%;
    clear: both;
}

.data-table {
    float: left;
    width: 100%;
    // border: 1px solid #dfe6ec;
    box-sizing: border-box;
}

.el-row {
    margin: 15px 0 0;
}

.el-col-4>label {
    width: 100%;
    height: 100%;
    text-align: right;
    line-height: 36px;
}

.el-radio-group {
    line-height: 36px;
}

.checkallfont {
    font-weight: 900;
}

.userListHeader {
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    padding: 10px 10px;
    border: 1px solid #d3dce6;
}

.headerText {
    float: left;
    line-height: 40px;
    margin-left: 200px;
}

.typeOrGrade {
    clear: both;
    margin: 0px 0px 20px 0px;
    border: 1px solid #d3dce6;
}

.leftTree {
    float: left;
    width: 30%;
    box-sizing: border-box;
}

.rightTable {
    float: left;
    width: 70%;
    min-height: 500px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
}

.delBtn {
    float: left;
    margin-left: 10px;
}

.selectedTable {
    height: 560px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
    overflow-y: auto;
}

.right-selectedTable {
    height: 500px;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
    overflow-y: auto;
}

/* .bottomBtnsSure {
        margin-left: 75%;
    } */

.querybtn {
    margin-left: 20px;
}

.dialogtitletab {
    width: 100%;
    height: auto;
    // border: 1px solid #e6e6e6;
    overflow: scroll;
}

.el-tab-pane {
    max-height: 350px;
}

.siginnormal {
    display: inline-block;
    text-align: center;
}

.siginnormal>span {
    min-width: 40px;
    margin: 0px 10px;
}

.siginnormal>.siginspan {
    min-width: 60px;
    margin: 0px 15px;
}

.detailmore {
    width: 95%;
    text-align: right;
    color: #409eff;
}

.moreseach {
    width: 277px;
    float: right;
    margin-bottom: 20px;
}

.moreseach>div {
    width: 200px;
    float: left;
}

.moreseach>.el-button {
    margin-left: 15px;
}

.moretable {
    clear: both;
    margin-top: 20px;
}

.sigincoun .el-form-item {
    margin-bottom: 0px;
}

.meetingmar>.el-col-4 {
    padding-right: 0px;
    text-align: right;
}

.meetingmar>.el-col-20 {
    padding-left: 0px;
}

.overdialog {
    height: 100%;
    overflow: inherit;
}

.active-btm {
    padding-bottom: 80px;
}

.el-carousel__item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.kaohepeople {
    display: inline-block;
    width: 470px;
    float: left;
    margin-left: 5px;
}

.kaohepeople span {
    width: 150px;
    text-overflow: ellipsis;
    line-height: 15px;
}

.locationpoint {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0px 0px 15px;
}

.recodespot>.el-row {
    margin-left: 10px !important;
}

.grid-content label {
    width: 100px;
    text-align: right;
}

.locationpoint_one,
.locationpoint_two {
    margin-left: 18px;
}

.locationpoint_three,
.locationpoint_four {
    margin-left: 23px;
}

.queryTools .el-form-item {
    margin-bottom: 10px;
    margin-right: 5px;
    width: auto;
}

.timeClass {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 305px;
}

.addTimeBtn {
    width: calc(100% - 85px);
    border: 1px solid #CDCDCD;
    border-radius: 4px;
    color: #0096FF;
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
}

.deleteBtn {
    color: #0096FF;
    font-size: 16px;
}

.disabledBtn {
    color: #999;
}

::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
}

.detailForm {
    padding-left: 15px;
    border: 1px solid #e6e6e6;
    /* display: flex; */
    /* justify-content: space-between;
            align-items: center; */
}

.boxDetail {
    border: 1px solid #e6e6e6;
}

.addTimeicon {
    width: 16px;
    height: 16px;
    vertical-align: -3px;
    margin-right: 3px;
}

.addTimeBtn span {
    line-height: 36px;
}

.activeTime {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.formBtn {
    display: flex;
    justify-content: flex-end;
}

.editActiveDailog {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
}

.halfWidth {
    width: 50%;
}

.saveCancelBtn {
    margin-right: 0;
    text-align: right;
}

/* .detialImg {} */
</style>
<!--仅在教学活动中覆盖框架样式-->
<style lang="scss">
.class-activit>.el-dialog>.el-dialog__body {
    padding: 0px 30px 30px 30px;
}

.teachingPlab-self .el-date-editor {
    width: 138px !important;
}

.teachingPlab-self .el-dialog {
    width: 840px !important;
}

.checkhospitaldialog .el-dialog {
    width: 1100px !important;
}

.teachingPlab-self .el-col-3 {
    margin-left: 25px;
    text-align: right;
}

.teachingPlab-self .class-activit .el-form {
    padding: 0 20px;
    padding-top: 18px;
    padding-right: 15px;
}

.teachingPlab-self .addActiveDailog.el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.teachingPlab-self .addActiveDailog.el-form .el-form-item {
    max-width: 50%;
    flex-shrink: 1;
}

.teachingPlab-self .activeTime .el-form-item {
    max-width: 54%;
}

.teachingPlab-self .detailForm .el-form-item {
    width: 50%;
    margin-bottom: 15px;
}

.teachingPlab-self .addActiveDailog.el-form .el-input {
    width: 240px;
}

.teachingPlab-self .el-form .el-form-item.widthFull {
    min-width: 100% !important;
}

.teachingPlab-self .el-form-item.detailTime .el-form-item__content {
    margin-left: 0px !important;
}

.el-form-item .el-form-item__label {
    width: 100px !important;
}

.teachingPlab-self .uploaddialog .el-dialog {
    max-height: 900px
}

.uploaddialog .el-dialog .el-dialog__body .upload-demo {
    margin-bottom: 20px;
}

.teachingPlab-self {
    .topTools {
        div.newQueryTools {
            div.zy-clear {
                .speaker-input {
                    input {
                        width: 220px
                    }
                }
            }
        }
    }

    div.low-index {
        div.data-table {
            .speaker-column {
                .actionplansty {
                    overflow: hidden;
                    text-overflow: ellipsis !important;
                }
            }

            tbody>.el-table__row {
                td {
                    padding: 0;
                }
            }
        }
    }
}

/* .el-dialog__wrapper .el-dialog{
    height: 280px
} */
</style>
