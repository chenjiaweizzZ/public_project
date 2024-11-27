<template>
	<div class="wapper">
		<div class="tools">
			<div class="funcTools">
				<el-button type="primary" @click="exportData">批量导出</el-button>
			</div>
		</div>
		<div class="queryTools newQueryTools">
			<el-row>
				<el-col :span="1">
					<el-button type="text" @click="queryAll">全部</el-button>
				</el-col>
				<el-col :span="18">
					<div class="queryTools zy-clear">
						<div class="mainQuery">
							<el-form :model="queryForm" :inline="true" ref="queryForm" label-width="100px">
								<el-form-item label="所属院区">
									<el-select v-model="queryForm.hospitalId" placeholder="全部">
										<el-option label="全部" value></el-option>
										<el-option :label="item.name" :value="item.id" v-for="item in hospitalList"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="专业基地">
									<el-select v-model="queryForm.baseName" placeholder="全部" @change="changeBase">
										<el-option label="全部" value=""></el-option>
										<el-tree :data="baseList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClickBase"
										 ref="treeDom" class="selfTree"></el-tree>
									</el-select>
								</el-form-item>
								<el-form-item label="年级">
									<el-select v-model="queryForm.grade" filterable placeholder="请选择">
										<el-option value="" label="全部"></el-option>
										<el-option v-for="item in gradlist" :key="item.key" :label="item.name" :value="item.key">
										</el-option>
									</el-select>
								</el-form-item>

								<!-- <el-form-item label="学员类型">
									<el-select v-model="queryForm.stdtype" filterable placeholder="请选择">
										<el-option value="" label="全部"></el-option>
										<el-option v-for="item in stuTypeList" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item> -->
								<!--<span class="hfiaff">
									<el-form-item label="学员身份">
										<el-select v-model="queryForm.identity" multiple placeholder="请选择">
											<el-option v-for="item in identityList" :key="item.id" :label="item.name" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
								</span>-->

								<el-form-item label="日期" prop="">
									<el-date-picker style="width: 130px" v-model="queryForm.startime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="gettime">
									</el-date-picker>
									-
									<el-date-picker style="width: 130px" v-model="queryForm.endtime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getendtime">
									</el-date-picker>
								</el-form-item>

								<el-form-item>
									<el-input style="width:200px;margin-left: 15px;" v-model="queryForm.inputquery" placeholder="请输入学生姓名/学号/手机号" @keyup.enter.native="doSelectQuery"></el-input>

								</el-form-item>
							</el-form>
						</div>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="queryWrap" style="float:right">
						<el-button type="text" @click="showAdditionQuery=!showAdditionQuery" :class="{'retract':showAdditionQuery,'open':!showAdditionQuery}">

						</el-button>
						<el-button class="querybtn" type="primary" @click="doSelectQuery" style="float:right">查询</el-button>
					</div>
				</el-col>
			</el-row>

		</div>

		<div class="dataTable">
			<el-table ref="detailTable" :data="rateList" @sort-change="PercentileOrdering" border tooltip-effect="dark" v-loading="loading"
			 style="width: 100%">
				<!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
				<el-table-column prop="name" fixed="left" label="姓名" width="130">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
								<!-- <span>
									{{scope.row.name}}
								</span> -->
								<el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>

							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="username" width="100" label="学号"></el-table-column>
				<!-- <el-table-column prop="stutypename" width="120" label="学员类型"></el-table-column> -->
				<!-- <el-table-column prop="identity" width="120" label="学员身份"></el-table-column> -->
				<el-table-column prop="sexname" label="性别"></el-table-column>
				<el-table-column prop="mobile" width="110" label="手机号码"></el-table-column>
				<el-table-column prop="hospitalname" width="110" label="所属院区"></el-table-column>
				<el-table-column prop="basename" label="专业基地" min-width="120">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.basename" placement="top">
								<span>
									{{scope.row.basename}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="turngrade" label="年级"></el-table-column>
				<el-table-column prop="address" :label="item.name" v-for="(item, index) in teachTypeList" :key="index" align="center">
					<template slot="header" slot-scope="scope">
						{{item.name}}/次
					</template>
					<template slot-scope="scope">{{scope.row[teachtypeVlaue[index]]}}</template>
				</el-table-column>
				<el-table-column prop='totalcount' sortable="custom" label="总计/次" width="90"></el-table-column>
			</el-table>
			<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="totalCount">
			</el-pagination>
		</div>
		<!-- 个人档案 -->
		<student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
	</div>
</template>
<script>
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel, getStorage, get } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
	import hospitalBaseDept from "../../components/hospitalBaseDept"

	export default {
		data() {
			return {
				teachTypeList: [],
				teachtypeVlaue: ['type4', 'type1', 'type3', 'type2', 'type5', 'type7', 'type8', 'type6'],
				defaultProps: {
					label: 'name',
					children: 'childrens'
				},
				hospitalType: 0,
				dialogRecords: false,
				studentDetailId: "",
				queryForm: {
					hospitalId: "",
					hospital: '',
					baseName: "",
					newbaseid: '',
					grade: '',
					stdtype: '',
					startime: '',
					endtime: '',
					inputquery: '',
					identity: []
				},
				identityList: [
					{ id: 1, name: "学生" },
					{ id: 2, name: "护培生" },
					// { id: 3, name: "实习生" },
					// { id: 4, name: "进修生" },
					// { id: 5, name: "护培生" },
					// { id: 6, name: "专培生" },
					// { id: 7, name: "全科医生" }
				],
				gradlist: [],//年级
				orderflag: '',
				//全部
				baseidlist: [],
				officeidlist: [],
				areaidlist: [],

				newroomList: [],
				newdeptList: [],
				newareaList: [],

				baseList: [],
				newRoomList: [],
				arealist: [],
				rateList: [],
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				endmonth: '',
				enddaydate: '',
				turnofficeList: [],//轮转科室列表
				usePage: false,
				exportOptions: {},
				loading: false,
				showAdditionQuery: false,
				hospitalList: []
			}
		},
		components: {
			studentPersonalInfo,
			hospitalBaseDept
		},
		computed: {
			...mapState(['stuTypeList', 'sysTypeNum'])
		},
		mounted() {
			this.gethospitaltree();
			this.getgreadlist();
			// this.getStdStand()
			this.queryAll()
			this.getHospitalList();
			this.getBaseList();
			this.getTeachType()
		},
		watch: {
		},
		methods: {
			getTeachType() {
				get(`/base/level/getByCode?code=teachtype&sysType=${this.sysTypeNum}`).then(res => {
					if (res.resCode == 200) {
						this.teachTypeList = res.model
					} else {
						this.$message({
							message: '请求查询信息失败',
							type: 'error'
						});
					}

				})
			},
			nodeClickBase(node) {
				if (node.deptlevel == 1) {
					return false;
				}
				this.queryForm.newbaseid = node.id
				this.queryForm.baseName = node.name
			},
			getBaseList() {
				post("/base/dept/getHosBaseTree").then(res => {
					if (res && res.resCode == 200) {
						this.baseList = res.model
					} else {
						this.$message({
							type: "error",
							message: res.resMsg || "请求基地列表报错"
						})
					}
				})
			},
			getHospitalList() {
				post("/base/dept/listMyHospital", {
					type: 3
				}).then(res => {
					if (res && res.resCode == 200) {
						this.hospitalList = res.model
					} else {
						this.$message({
							type: "error",
							message: res.resMsg || "请求医院列表报错"
						})
					}
				})
			},
			changeBase(val) {
				if (val == undefined || val == null || val == "") {
					this.queryForm.newbaseid = ""
					this.queryForm.baseName = ""
				}
			},
			personalDetail(index, row) {
				this.dialogRecords = true;
				this.studentDetailId = row.uid
			},
			//带权限的基地科室和病区
			gethospitaltree: function () {
				let self = this;
				post('/deptinfo/getusermanagerdeptlist', {
					command: 'deptinfo/getusermanagerdeptlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.newroomList = data.beanlist.baselist;
						let date = new Date;
						self.endmonth = Number(date.getMonth() + 1);
						self.enddaydate = date.getDate();
						if (self.endmonth < 10) {
							self.endmonth = '0' + self.endmonth;
						};
						if (self.enddaydate < 10) {
							self.enddaydate = '0' + self.enddaydate
						};
						self.queryForm.startime = date.getFullYear() + '-' + self.endmonth + '-' + '01';
						self.queryForm.endtime = date.getFullYear() + '-' + self.endmonth + '-' + self.enddaydate;
						self.inittable(self.pageno, self.pagesize, '', '', '', self.queryForm.startime, self.queryForm.endtime, '', '', this.queryForm.identity);
					}
				}).catch(function (error) {
					//console.log(error)
				})
			},
			//年级列表
			getgreadlist: function () {
				let self = this;
				post('/turnbaseinfo/turnbaseinfolevel', {
					command: 'turnbaseinfo/turnbaseinfolevel',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					code: 'turngrade'
				}).then((data) => {
					if (data && data.errcode == 0) {
						self.gradlist = JSON.parse(data.baseinfolevellist);
					}
				}).catch(() => {
				})
			},

			//批量导出
			exportData: function () {
				let self = this;
				let data = {
					command: 'teachingreport/stdteachingplanreport',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
					statuslist: 2,
					hospital: self.queryForm.hospital,
					...self.exportOptions
				}
				exportExcel(data);
			},

			//升序降序排列
			PercentileOrdering(column) {
				this.ordername = column.prop;
				if (column && column.order == 'descending') {
					this.orderflag = 0;
				} else if (column && column.order == 'ascending') {
					this.orderflag = 1;
				} else {
					this.orderflag = '';
				}
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid, this.queryForm.grade, this.queryForm.stdtype,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery, this.orderflag, this.queryForm.identity);
			},

			queryAll: function () {
				let self = this;
				self.queryForm.newbaseid = '';
				self.queryForm.grade = '';
				self.queryForm.stdtype = '';
				self.queryForm.startime = '';
				self.queryForm.endtime = '';
				self.queryForm.inputquery = '';
				self.queryForm.hospitalId = ""
				let date = new Date;
				self.endmonth = Number(date.getMonth() + 1);
				self.enddaydate = date.getDate();
				if (self.endmonth < 10) {
					self.endmonth = '0' + self.endmonth;
				};
				if (self.enddaydate < 10) {
					self.enddaydate = '0' + self.enddaydate
				};
				self.queryForm.startime = date.getFullYear() + '-' + self.endmonth + '-' + '01';
				self.queryForm.endtime = date.getFullYear() + '-' + self.endmonth + '-' + self.enddaydate;
				self.inittable(this.pageno, this.pagesize, '', '', '', self.queryForm.startime, self.queryForm.endtime, '', '');
			},
			inittable: function (pageno, pagesize, base, grade, stdtype, startime, endtime, inputquery, orderflag, identity) {
				let self = this;
				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					hospital: self.queryForm.hospitalId,
					base: base,
					grade: grade,   //年级
					stdtype: stdtype,   //学员类型
					starttime: startime,
					endtime: endtime,
					usersearchinfo: inputquery,
					orderflag: orderflag,   //0降序；1升序
					identity: identity,
				}
				self.loading = true;
				post('/teachingreport/stdteachingplanreport', {
					command: 'teachingreport/stdteachingplanreport',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
					page: pageno,
					reqnum: pagesize,
					hospital: self.queryForm.hospitalId,
					base: base,
					grade: grade,   //年级
					stdtype: stdtype,   //学员类型
					starttime: startime,
					endtime: endtime,
					usersearchinfo: inputquery,
					statuslist: 2,
					orderflag: orderflag,   //0降序；1升序
					identity: identity
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.rateList = data.beanlist;
						self.totalCount = data.count;
						self.usePage = false;
					}
				}).catch(function (error) {
					self.loading = false;
					//console.log(error)
				})
			},

			/*分页区*/
			handleSizeChange(size) {
				this.pagesize = size;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid, this.queryForm.grade, this.queryForm.stdtype,
					this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery, this.orderflag, this.queryForm.identity);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid, this.queryForm.grade, this.queryForm.stdtype,
					this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery, this.orderflag, this.queryForm.identity);
			},
			gettime: function (date) {		//选取时间段
				let self = this;
				self.time = date;
				self.queryForm.startime = this.time;//选取时间段
			},
			getendtime: function (date) {		//选取时间段
				let self = this;
				self.time = date;
				self.queryForm.endtime = this.time;//选取时间段
			},

			doSelectQuery: function () {//查询方法
				let self = this;
				if (!self.queryForm.startime) {
					self.queryForm.startime = '';
				};
				if (!self.queryForm.endtime) {
					self.queryForm.endtime = '';
				};
				self.inittable(self.pageno, self.pagesize,
					self.queryForm.newbaseid, self.queryForm.grade, self.queryForm.stdtype,
					self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery, self.orderflag, this.queryForm.identity
				)
			},

		}
	}
</script>

<style scoped>
	.wapper {
		padding: 0 20px;
	}

	.tools {
		height: 50px;
	}

	.funcTools {
		float: left;
	}

	.search {
		float: right;
	}

	.queryTools {
		float: left;
		width: 100%;
	}

	.queryAll {
		float: left;
		margin-right: 12px;
	}

	.queryTools .el-form-item {
		width: 190px;
		margin-bottom: 10px;
		margin-right: 0 !important;
	}

	.funcBtns {
		width: 80px;
		float: left;
	}

	.el-select {
		width: 120px;
	}

	.import-popup {
		font-size: 20px;
	}

	.footerBtn {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.tip-circle {
		display: inline-block;
		margin-right: 10px;
		width: 30px;
		height: 30px;
		font-size: 28px;
		text-align: center;
		color: white;
		background-color: #58b7ff;
		border-radius: 30px;
	}

	.import-popup-btn {
		position: relative;
		left: 10px;
		top: -2px;
	}

	.right {
		margin-left: 10px;
	}

	.elRowStyle {
		overflow-x: hidden;
	}

	.querybtn {
		margin-left: 10px;
	}

	.queryTools .el-form-item {
		margin-bottom: 10px;
		margin-right: 5px;
		width: auto;
	}
</style>

<style>
	.hfiaff .el-select {
		width: 240px;
	}

	.mainQuery .el-date-editor .el-input__inner {
		width: 135px;
	}
</style>