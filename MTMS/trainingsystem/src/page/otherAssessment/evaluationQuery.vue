<template>
	<div class="evaluationQuery-page">
		<el-tabs type="card" v-model="activeName">
			<el-tab-pane label="带教考核明细" name="first">
				<div class="wapper">
					<div class="tools graduationTools">
						<div class="funcTools">
							<el-button v-if="ceremonial" class="querybtn" type="primary" @click='exportList'>批量导出</el-button>
						</div>
					</div>
					<div class="topTools">
						<div class="queryTools newQueryTools">
							<el-row>
								<el-col :span="1">
									<div class="queryAll" style="float:left; margin-right: 20px;">
										<el-button type="text" @click="queryAll">全部</el-button>
									</div>
								</el-col>
								<el-col :span="18">
									<div class="queryTools zy-clear">
										<el-form :inline="true" ref="queryForm" label-width="80px">
											<div class="mainQuery">
												<el-form-item label="科室" label-width="80px">
													<el-select v-model="hosDeptName" placeholder="全部" @change="changeDept">
														<el-option label="全部" value=""></el-option>
														<el-tree :data="hosDeptTree" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
														 ref="treeDom" class="selfTree"></el-tree>
													</el-select>
												</el-form-item>
												<el-form-item label="评价完成率" label-width="90px">
													<el-select v-model="finishedrate" filterable placeholder="请选择">
														<el-option label='全部' value=''></el-option>
														<el-option v-for="item in RateList" :key="item && item.name" :label="item && item.name" :value="item && item.id">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
											<div class="additionQuery">
												<el-form-item label="日期">
													<el-date-picker style="width: 130px" v-model="queryForm.starttime" type="month" placeholder="开始日期" format="yyyy-MM" @change="gettime">
													</el-date-picker>
													-
													<el-date-picker style="width: 130px" v-model="queryForm.endtime" type="month" placeholder="结束日期" format="yyyy-MM" @change="getendtime">
													</el-date-picker>
												</el-form-item>
												<el-form-item class="search-input" style="margin-left:10px;">
													<el-input style="width:200px" v-model="input" placeholder="请输入姓名/工号" @keyup.enter.native="lookup"></el-input>
												</el-form-item>
											</div>
										</el-form>
									</div>

								</el-col>
								<el-col :span="5">
									<div class="queryWrap" style="float:right">
										<el-button type="primary" @click="lookup" class="new-el-button">查询</el-button>
									</div>
								</el-col>
							</el-row>
						</div>
					</div>
					<div class="dataTable">
						<el-table ref="detailTable" :data="TeachersList" border :max-height="$tabelMaxHeight" tooltip-effect="dark" v-loading="showLoading"
						 :element-loading-text="loadingText" style="z-index:50">
							<el-table-column prop="username" fixed="left" width="120" label="带教老师">
								<template slot-scope="scope">
									<div class="actionplansty">
										<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.username" placement="top">
											<el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.username}}</el-button>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="code" width="100" label="工号"></el-table-column>
							<el-table-column prop="mobile" label="手机号"></el-table-column>
							<el-table-column prop="deptname" label="所属科室">
								<template slot-scope="scope">
									<div class="actionplansty">
										<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
											<span>
												{{scope.row.deptname}}
											</span>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="title" label="职称"></el-table-column>
							<el-table-column prop="position" label="职位"></el-table-column>
							<el-table-column prop="unfinishedcount" label="未评价人数">
								<template slot-scope="scope">
									<el-button @click="showevalutenumdialog(scope.$index, scope.row,0,'未评价人数')" type="text" size="small">
										{{scope.row.unfinishedcount}}
									</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="finishedrate" label="评价完成率"></el-table-column>

							<el-table-column prop="evaluationcount" label="带教学员总数">
								<template slot-scope="scope">
									<el-button @click="showevalutenumdialog(scope.$index, scope.row,'','带教学员总数')" type="text" size="small">
										{{scope.row.evaluationcount}}
									</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="recmdrate" label="优秀带教推荐率"></el-table-column>
							<el-table-column prop="workload" label="带教学员/每人/每月"></el-table-column>
						</el-table>
						<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
						 :current-page="currentpage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
						 :total="totalcount">
						</el-pagination>
					</div>

					<el-dialog :title="evaluationTitle" :visible.sync="dialognonevaluatednumber" :close-on-click-modal="false">
						<div v-if="ceremonial">
							<el-button type="primary" @click="non_evalute_export()" style="margin-bottom: 15px;">批量导出</el-button>
						</div>
						<div class="dataTable">
							<el-table ref="detailTable" :data="nonevanumList" border tooltip-effect="dark" style="width: 100%">
								<!--<el-table-column type ="index" label= "序号" width = "65" ></el-table-column>-->
								<el-table-column prop="name" label="姓名"></el-table-column>
								<el-table-column prop="username" label="学号"></el-table-column>
								<el-table-column prop="mobile" width="110" label="手机号"></el-table-column>
								<el-table-column prop="tecname" label="带教老师"></el-table-column>
								<el-table-column prop="deptname" label="科室" width="120">
									<template slot-scope="scope">
										<div class="actionplansty">
											<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
												<span>
													{{scope.row.deptname}}
												</span>
											</el-tooltip>
										</div>
									</template>
								</el-table-column>

								<el-table-column prop="evaluationmonth" label="评价日期"></el-table-column>
							</el-table>
						</div>
					</el-dialog>
					<!-- 职工信息 -->
					<employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
				</div>
			</el-tab-pane>
			<el-tab-pane label="护培生考核明细" name="second">
				<residentDoctoRevaluation></residentDoctoRevaluation>
			</el-tab-pane>
		</el-tabs>
	</div>

</template>
<script>
	import residentDoctoRevaluation from "./residentDoctoRevaluation.vue"
	import { post, getCookie, exportExcel, currentYear } from '../../config/util';
	import employeeInfo from "../../components/employeeInfo.vue"
	import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
	import moment from 'moment';
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name',
					children: 'childrens'
				},
				hosDeptTree: [],
				hosDeptName: "",
				activeName: 'first',
				currentDataId: "", // 当前点击职工详情信息
				dialogEmployee: false, //职工详情弹窗
				TeachersList: [],
				TeacherStudents: [
					// {uesrname:'未为晚也',mobile:'15601598900',deptname:'神经外科（设计好好了就流口水）',period:'2014级'}
				],
				dialogTeacherDetail: false,
				dialogEvaluation: false,
				evaluationList: [
					// {evaluationmonth:'2017年5月',totalscore:'80'}
				],
				input: '',
				inputStu: '',
				// seachStudent:'',
				totalcount: 0,
				currentpage: 1,
				pagesize: 10,
				// 学生列表分页
				totalcountStu: 0,
				currentpageStu: 1,
				pagesizeStu: 20,
				teacherid: '',

				usernameStu: '',
				mobileStu: '',

				basenameid: '',
				periodname: '',
				deptId: '',
				//未评价人数弹窗
				dialognonevaluatednumber: false,//
				nonevanumList: [],

				//新增下拉框
				queryForm: {
					starttime: currentYear(),
					endtime: currentYear(),
				},
				finishedrate: '',
				RateList: [
					{ id: '1', name: '100%' },
					{ id: '0', name: '100%以下' },
					//传0是    对应页面上100%以下，   1 是对应100%，   传空时对应页面全部
				],
				ports: {
					teacher: '/dailyevaluation/queryteachingteacher',
					student: '/dailyevaluation/queryteachingstudent',
					note: '/dailyevaluation/queryevaluateturndoctor',//dailyevaluation/querynotevaluateturndoctor
				},
				hospitalId: "",
				ceremonial: 1,
				exportDataAppraised: {},
				showLoading: false,
				loadingText: '数据加载中',
				detailDeptId: '',
				usePage: false,
				deptBaseList: [],
				deptList: [],
				exportOptions: {},
				showAdditionQuery: false,
				evaluationTitle: '',
			}
		},
		watch: {
			'inputStu': function (val, oldval) {
				if (val == '') {
					this.usernameStu = ''
					this.mobileStu = ''
					this.queryteachingstudent(this.currentpage, this.pagesize)
				}
				let mobilereg = /^(-)?\d+(\.\d+)?$/;
				if (mobilereg.test(val)) {
					this.mobileStu = val
				} else {
					this.usernameStu = val
				}
			}
		},
		components: {
			employeeInfo,
			residentDoctoRevaluation,
			hospitalBaseDept1
		},
		computed: {
			//	...mapState(['gradeList']),
		},
		mounted() {
			this.queryteachingteacher(this.currentpage, this.pagesize)
			//    this.initOptionList({type:'card',mutation:'initCardList'});
			this.gethospitaltree();
			this.getDeptList()
		},
		methods: {
			changeDept(val) {
				if (val == undefined || val == null || val == "") {
					this.deptId = ""
					this.hospitalId = ""
				}
			},
			nodeClick(node) {
				if (node.havePermission != 1) {
					return false;
				}
				if (node.deptlevel == 1) {
					this.deptId = ""
					this.hosDeptName = node.name
					this.hospitalId = node.id
				} else {
					this.deptId = node.id
					this.hosDeptName = node.name
					this.hospitalId = ""
				}
			},
			getDeptList() {
				this.hosDeptTree = []
				post("/base/dept/getMyDeptTree", {
					showHospital: 1,
					showNoDeptHospital: 0,
					needBaseDept: false,
				}).then(data => {
					if (data && data.resCode == 200) {
						this.hosDeptTree = data.model;
					}
				});
			},
			employeeDetail(index, row) {
				this.dialogEmployee = true
				// textData-fix
				this.currentDataId = row.teacherid;
			},
			//	...mapActions(['initGradeList']),
			showevalutenumdialog: function (index, row, evaluationstatus, title) {		//未评价人数
				let self = this;
				self.evaluationTitle = title;
				self.dialognonevaluatednumber = true;

				let option = {
					command: this.ports.note.substr(1),
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					teacherid: '' + row.teacherid,
					type: '4',
					starttime: self.queryForm.starttime,
					endtime: self.queryForm.endtime,
					deptid: row.deptid,
					evaluationstatus: evaluationstatus
				};
				this.exportDataAppraised = option;

				//nonevanumList
				post(this.ports.note, option).then((data) => {
					if (data && data.errcode == 0) {
						self.nonevanumList = data.turndoctorlist;
					}
				})
			},
			non_evalute_export: function () {//导出未评价人数
				let data = { ...this.exportDataAppraised };
				exportExcel(data);
			},

			// 基地科室联动
			gethospitaltree: function () {					//带权限的基地科室和病区
				let self = this;
				post('/turnbaseinfo/getusermanagerdepttree', {
					command: 'turnbaseinfo/getusermanagerdepttree',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.deptBaseList = data.depttree.childlist
					}
				}).catch(function (error) {
					//console.log(error)
				})
			},
			newbasechange: function () {
				let self = this;
				self.deptId = '';
				if (self.basenameid == '') {
					self.deptList = [];
				} else {
					self.deptBaseList.map(item => {
						if (self.basenameid == item.id) {
							self.deptList = item.childlist;
						}
					})
				}
			},
			//导出 筛选后的数据
			exportList() {
				let port = this.ports.teacher;
				let data = {
					command: port.substr(1),
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					...this.exportOptions, 
				}
				exportExcel(data);
			},
			getFilterData() {
				let self = this;
				let option = { ...self.queryForm };
				option.finishedrate = self.resetValue(self.finishedrate);
				option.baseid = self.resetValue(self.basenameid);
				option.deptid = self.resetValue(self.deptId);
				option.searchinfo = self.input;
				return option;
			},
			// 选择基地和 科室后查找
			lookup() {
				this.currentpage = 1;
				this.queryteachingteacher(this.currentpage, this.pagesize)
			},
			// 查询带教老师信息
			queryteachingteacher(pagenum = 1, pagesize = this.pagesize) {
				let self = this;
				let option = { ...self.queryForm };
				option.finishedrate = self.resetValue(self.finishedrate);
				option.hospitalId = self.resetValue(self.hospitalId);
				option.deptid = self.resetValue(self.deptId);

				option.searchinfo = self.input;
				// let host='http://172.16.254.210:20080/misrobot-service/';
				let host = '';
				let port = this.ports.teacher;

				//显示loading
				this.showLoading = true;

				if (this.usePage) {
					pagenum = this.currentpage;
				} else {
					pagenum = this.currentpage = 1;
				}
				self.exportOptions = {
					...option
				}
				post(host + port, {
					command: port.substr(1),
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					pagenum: pagenum,
					pagepersize: pagesize,
					...option
				}).then(function (data) {
					self.TeachersList = data.teacherinfolist;
					self.totalcount = data.totalcount;
					self.showLoading = false;
					self.usePage = false;
				}).catch(function (error) {
					//console.log(error);
					self.showLoading = false;
				})
			},
			// 每页显示数据量变更
			handleSizeChange(val) {
				this.pagesize = val
				this.queryteachingteacher(this.currentpage, this.pagesize)
			},
			// 页码变更
			handleCurrentChange(val) {
				this.currentpage = val;
				this.usePage = true;
				this.queryteachingteacher(this.currentpage, this.pagesize)
			},

			// 点击带教记录查看
			showTeachRecords(index, row) {
				this.dialogTeacherDetail = true;
				this.teacherid = row.teacherid;
				this.queryteachingstudent(row.deptid)
			},
			// 选择年级查询
			selectGrade() {
				// alert(this.periodname)
				// let self = this
				this.inputStu = ''
				this.usernameStu = ''
				this.mobileStu = ''
				this.queryteachingstudent()
			},
			// 点击搜索学生
			seachStu() {
				// let self = this
				// alert(self.periodname)
				this.periodname = ''
				this.queryteachingstudent()
			},
			// 查询学生每页显示数据量变更
			handleSizeChangeStu(val) {
				this.pagesizeStu = val
				this.queryteachingstudent()
				// alert(val)
			},
			// 查询学生页码变更
			handleCurrentChangeStu(val) {
				// alert(val)
				this.currentpageStu = val;
				this.usePage = true;
				this.queryteachingstudent()
			},
			// 查询带教学生信息
			queryteachingstudent(deptid = this.deptId) {
				let self = this;

				let pagenum = 1;
				if (this.usePage) {
					pagenum = this.currentpageStu;
				} else {
					pagenum = this.currentpageStu = 1;
				}

				post(this.ports.student, {
					command: this.ports.student.substr(1),
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					teacherid: self.teacherid,
					period: self.periodname,
					deptid: self.resetValue(deptid),
					username: self.usernameStu,
					mobile: self.mobileStu,
					pagenum: pagenum,
					pagepersize: self.pagesizeStu
				}).then(function (data) {
					self.TeacherStudents = data.studentinfolist
					self.totalcountStu = data.totalcount;
					self.usePage = false;
				}).catch(function (error) {
					//console.log(error)
				})
			},
			// 点击查看详情列表
			showEvaluations(row) {
				let self = this
				this.dialogEvaluation = true;
				post('/dailyevaluation/queryteachingevaluate', {
					command: 'dailyevaluation/queryteachingevaluate',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					teacherid: self.teacherid,
					period: row.period,
					stuid: row.uid,
					deptid: self.resetValue(self.deptId)
				}).then(function (data) {
					self.evaluationList = data.evaluateinfolist
				}).catch(function (error) {
					//console.log(error)
				})
			},

			//新增事件
			gettime(time) {
				this.queryForm.starttime = moment(new Date(time)).format("YYYY-MM");
			},
			getendtime(time) {
				this.queryForm.endtime = moment(new Date(time)).format("YYYY-MM");
			},
			queryAll() {
				//初始化查询数据
				this.hospitalId = ""
				this.basenameid = '';
				this.deptId = '';
				this.hosDeptName = ""
				this.input = '';
				for (let key of Object.keys(this.queryForm)) {
					this.queryForm[key] = '';
				}
				this.finishedrate = '';
				this.input = '';
				this.currentpage = 1;
				this.queryteachingteacher();
			},
			//展示完成率
			showRate(num) {
				switch (num) {
					case '0':
						return '100%以下';
					case '1':
						return '100%';
					default:
						return '';
				}
			},
			//将-1的重置为''
			resetValue(num) {
				return num == -1 ? '' : num;
			},
		}
	}
</script>
<style scoped>
	.evaluationQuery-page {
		padding: 0 20px;
	}

	.wapper {
		padding: 0;
	}

	.el-dialog__body>.el-button {
		margin-bottom: 15px;
	}

	.topTools {
		min-height: 50px;
	}

	.queryTools .el-form-item {
		margin-bottom: 10px;
		margin-right: 5px;
		width: auto;
	}

	.queryTools .el-select {
		width: 120px;
	}

	.search {
		float: right;
	}

	.dialogContainer {
		width: 100%;
		height: 100%;
		border-top: 1px solid #d3dce6;
		display: flex;
	}

	.dialogLeft {
		width: 20%;
		height: 40px;
		border-right: 1px solid #d3dce6;
		box-sizing: border-box;
		text-align: center;
		font-weight: bolder;
		/*font-size: 20px;*/
		line-height: 40px;
	}

	.dialogRight {
		width: 80%;
	}

	.querybtn {
		margin-left: 5px;
	}
</style>