<template>
	<div class="turnPlanDetailCount">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="按学员查询" name="first">
				<div class="wapper studentSearch">
					<div class="zy-clear" style="min-height:50px;">
						<div class="queryTools">
							<el-form :model="queryFormOne" :inline="true" ref="queryFormOne" label-width="70px">
								<el-row>
									<hospital-base-dept1 @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
									<el-form-item label="学位" prop="degre_id">
										<el-select v-model="queryFormOne.degre_id" placeholder="请选择">
											<el-option label="全部" value=""></el-option>
											<el-option v-for="item in degree" :key="item.key" :label="item.name" :value="item.key">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="学员类型" prop="type_id">
										<el-select v-model="queryFormOne.type_id" placeholder="请选择">
											<el-option label="全部" value=""></el-option>
											<el-option v-for="item in stuTypeList" :key="item.key" :label="item.name" :value="item.key">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item prop="input">
										<el-input style="width:210px" v-model="queryFormOne.input" placeholder="请输入学号/手机号或姓名"></el-input>
									</el-form-item>
								</el-row>
								<el-row>
									<el-form-item prop="starttime" label="统计日期" class="classSearch">
										<el-date-picker v-model="queryFormOne.timeArr" type="monthrange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
										 format="yyyy-MM" @change="getPicktime" :clearable="clearable" style="width: 260px">
										</el-date-picker>
									</el-form-item>
									<el-button type="primary" @click="selectQuery">查询</el-button>
									<el-button type="primary" @click="editTurn">轮转调整</el-button>
								</el-row>
							</el-form>
						</div>
					</div>

					<div class="show-color">
						<div v-for="(item,index) in showcolorlist">
							<span :style="{'background':computeColor(item)}"></span>
							{{item.name}}
						</div>
					</div>
					<div class="detailTable zy-clear" style="position:relative;">
						<div style="width:100%;overflow-x: auto;position: static;" class="table-wrapper">
							<div id="plan-content" class="zy-clear" style="position: static;">
								<el-table ref="detailTableS" :data="planDetailsDatas" border tooltip-effect="dark" class="custom-table" style="width:1187px;overflow:hidden;float:left;position:static;"
								 @selection-change="handleSelectionChange">
									<el-table-column type="selection" fixed="left" width="55"></el-table-column>
									<el-table-column prop="name" class="test2" fixed="left" width="200" label="姓名">
										<template slot-scope="scope">
											<el-button type="text" @click="showNameDetail(scope.row)">{{scope.row.name}}</el-button>
										</template>
									</el-table-column>
									<el-table-column prop="username" width="130" label="学号"></el-table-column>
									<el-table-column prop="mobile" width="150" label="手机号"></el-table-column>
									<el-table-column prop="period" width="150" label="年级"></el-table-column>
									<el-table-column prop="degree" width="150" label="学位"></el-table-column>
									<el-table-column prop="base" width="200" label="专业基地"></el-table-column>
									<el-table-column prop="type" width="150" label="学员类型"></el-table-column>
								</el-table>

								<div style="float:left">
									<circle-detail :height="rowHeight" :alltime="alltime" :circleData="circleData"></circle-detail>
								</div>
							</div>
						</div>
						<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChangeOne" @current-change="handleCurrentChangeOne"
						 :current-page="pageNums" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeS" layout="total, sizes, prev, pager, next, jumper"
						 :total="totalPagesS">
						</el-pagination>
					</div>
					<el-dialog :title="lunzhuanTitle" :visible.sync="showLunzhuan" class="dialogHeight" width="80%">
						<el-table :data="circlePlanDetail">
							<el-table-column property="deptname" label="轮转科室"></el-table-column>
							<el-table-column property="planTime" label="计划轮转时间"></el-table-column>
							<el-table-column property="realTime" label="实际轮转时间"></el-table-column>
							<el-table-column property="djls" label="带教老师">
								<template slot-scope="scope">
									<div class="actionplansty">
										<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.teacher" placement="top">
											<span>
												{{scope.row.teacher}}
											</span>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
							<el-table-column property="outDepartState" label="出科状态"></el-table-column>
							<el-table-column property="turnstatueName" label="轮转状态"></el-table-column>
						</el-table>
					</el-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="按科室查询" name="second">
				<div class="wapper">
					<div class="funcTools">
						<el-button type="primary" @click="exportData">批量导出</el-button>
					</div>
					<div class="topTools">
						<div class="queryTools">
							<div class="queryAll">
								<el-button type="text" @click="queryAll">全部</el-button>
							</div>
							<el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
								<hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryForm" :hasHospital="hasHospital" :showDeptTree="showDeptTree"
								 :hasBase="hasHospital"></hospital-base-dept1>
								<!-- <hospital-base-dept :clearAll="rightNowClear" :deptTitle="selectDeptTitle" :key="filterStatus" @updateSelectIds="setQueryForm"></hospital-base-dept> -->
								<el-form-item label="计划">
									<el-select v-model="queryForm.turnplanid" filterable placeholder="请选择计划">
										<el-option :key="0" label="全部" value=""></el-option>
										<el-option v-for="(item,index) in turnplanlist" :key="item.index" :label="item.period" :value="item.turnplanid">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="年份" style="width: 200px;">
									<el-date-picker style="width: 130px;" v-model="queryForm.years" align="right" type="year" format="yyyy" @change="gettime"
									 placeholder="选择年份">
									</el-date-picker>
								</el-form-item>

								<el-button class="querybtn" type="primary" @click="query">查询</el-button>
							</el-form>
						</div>
					</div>

					<div class="dataTable">
						<div style="float:left;">( 实际人数/计划人数 )</div>
						<div class="tabletitle">
							<span class="titlegreen"></span>实际人数等于计划人数
							<span class="titlered"></span>实际人数大于计划人数
							<span class="titleorange"></span>实际人数小于计划人数
						</div>
						<el-table ref="deptname" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
							<el-table-column width="120" fixed='left' v-if="index == 0" v-for="(item,index) in tabletitlelistadd" :key="index" :label="item.yearmonthname">
								<template slot-scope="scope">
									<template v-if="index == 0 ">
										<!--在第一列显示科室名称-->
										<div class="actionplansty">
											<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
												<span>
													{{scope.row.deptname}}
												</span>
											</el-tooltip>
										</div>
									</template>
								</template>
							</el-table-column>

							<el-table-column width="100" v-for="(item,index) in tabletitlelist" :key="item.yearmonth" :label="item.yearmonthname">
								<template slot-scope="scope">
									<template v-for="(item2,index2) in scope.row.detailcountlist">
										<template v-if="item.yearmonth === item2.yearmonth">
											<div @click="detailabnormallist(item.yearmonth,scope.row.deptid)">
												<div v-if="item.tableyearmouth < nowyearmouth || item.tableyearmouth == nowyearmouth " :style="{color:colorinfo(item2)}">
													{{item2.actualcount}}&nbsp;/{{item2.plancount}}
												</div>
												<div v-else="item.yearmonth">
													{{item2.plancount}}
												</div>
											</div>
										</template>
									</template>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination style="float:right;margin:10px 10px" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
						 @current-change="handleCurrentChange" :current-page="pagenum" :page-size="pagesize" :total="totalCount">
						</el-pagination>
					</div>

					<!--不正常人员名单-->
					<el-dialog title="异常人员列表" :visible.sync="abnormalPersonnel" size="large" :close-on-click-modal="false" @close="abnormalPersonnel = false">
						<el-button type="primary" @click="dialogexportData" style="margin-bottom: 15px;">批量导出</el-button>
						<el-table ref="detailTable" :data="abnormalData" border tooltip-effect="dark" :span-method="arraySpanMethod">
							<el-table-column type="index" label="序号"></el-table-column>
							<el-table-column prop="name" label="姓名">
								<template slot-scope="scope">
									<div class="actionplansty">
										<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
											<span>
												{{scope.row.name}}
											</span>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="username" label="学号"></el-table-column>
							<el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
							<el-table-column prop="baseName" label="专业基地" width="120"></el-table-column>
							<el-table-column prop="teachername" label="带教老师" width="120"></el-table-column>
							<el-table-column prop="error" label="异常" width="100"></el-table-column>
							<el-table-column prop="turntime" label="出入科时间" width="200"></el-table-column>
							<el-table-column prop="realbegintime" label="实际出入科时间" width="200">
								<template slot-scope="scope">
									{{scope.row.realbegintime}}<span v-if="scope.row.realbegintime"> ~ </span>{{scope.row.realendtime}}
								</template>
							</el-table-column>
						</el-table>
					</el-dialog>

				</div>
			</el-tab-pane>
		</el-tabs>
		<circleAdjustDialog ref="adjustDialog" :selectItems="selectItems" @resertList="selectQuery"></circleAdjustDialog>
	</div>

</template>
<script>
	import { mapState, mapActions } from 'vuex'
	import { get, post, getCookie, exportExcel } from '../../config/util';
	import moment from 'moment'
	import circleDetail from '../../components/circleDetailLayout'
	import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
	import circleAdjustDialog from "../../components/circleAdjustDialog"
	export default {
		data() {
			return {
				selectItems: [], //勾选选中数组
				totalPagesS: 0,
				rowHeight: 0,
				clearable: false,
				hasHospital: false,
				showDeptTree: true,
				rightNowClear: 0,
				pageSizeS: 10,
				pageNums: 1,
				circlePlanDetail: [],
				lunzhuanTitle: "",
				showLunzhuan: false,
				planyearmontlist: [],
				planDetailsDatas: [],
				showcolorlist: [
					{
						id: 1,
						name: '已轮转'
					},
					{
						id: 2,
						name: '轮转中'
					},
					{
						id: 3,
						name: '待轮转'
					},
					{
						id: 4,
						name: '未轮转'
					}
				],
				queryFormOne: {
					timeArr: [],
					hospitalIdForBase: "",
					plan_id: '',
					base_id: '',
					stud_dept_id: '',
					degre_id: '',
					type_id: '',
					turn_dept_id: '',
					dateRange: '',
					hospitalId: "",
					newbaseid: "",
					newdepartment: "",
					newarea: [],
					input: "",
					starttime: "",
					endtime: "",
				},
				activeName: "first",
				pagenum: 1,
				pagesize: 10,
				totalCount: 0,
				nowyear: '',
				nowmouth: '',
				nowyearmouth: '',
				tableyearmouth: '',
				defaultyears: new Date().getFullYear(),
				turnplanlist: [],//轮转计划数组
				queryForm: {
					deptId: "",
					hospitalId: "",
					baseid: '',
					turnplanid: '',
					years: '',
					inputquery: '',
					newbaseid: "",
					newdepartment: "",
					newarea: [],
				},
				tabletitlelist: [],
				tabletitlelistadd: [],
				//全部
				isnewbaseid: '',
				isnewdepartment: '',
				baseidlist: [],
				officeidlist: [],
				newroomList: [],
				newdeptList: [],

				rateList: [],
				roomList: [],
				baseList: [],
				newRoomList: [],
				startime: '',
				endtime: '',
				centerlist: [],
				exportyear: '',

				/*异常人员名单*/
				abnormalPersonnel: false,
				abnormalData: [],//异常列表
				dialogmonth: '',
				dialogdeptid: '',
				exportOptions: {},
				exportOptionsDialog: {},
				loading: false,
				degree: [],
				stuTypeList: [
				{key: 1,name:"大专"},
				{key: 2,name:"本科"},
				{key: 3,name:"专硕"},
		
				]
			}
		},
		components: {
			circleDetail,
			hospitalBaseDept1,
			circleAdjustDialog
		},
		computed: {
			...mapState(['allOption','sysTypeNum']),
			circleData() {
				return this.planDetailsDatas.map((item) => item.detail);
			},
			alltime() {
				return this.planyearmontlist;
			},
		},
		mounted() {
			let date = new Date();

			this.nowyear = new Date().getFullYear();
			this.nowmouth = date.getMonth() + 1;
			this.queryFormOne.timeArr = [this.nowyear + "-01", this.nowyear + "-12"]
			// this.queryFormOne.endtime = this.nowyear + "-12"
			this.nowyearmouth = moment(date.getFullYear() + '-' + this.nowmouth, 'YYYY-MM-DD HH:mm:ss').valueOf();
			this.gethospitaltree();
			this.getallturnplanlist();
			this.queryStudentList();
			// this.initAllOptionListUG({ type: 'degree' });
			this.getSelect()
		},
		watch: {},
		methods: {
			...mapActions(['initAllOptionListUG']),
			getSelect() {
				let code = "stud_type,degree"
				get(`/base/level/getByCodes?codes=${code}`).then(res => {
					if (res.resCode == 200) {
						this.degree = []
						// this.stuTypeList = []
						res.model.forEach(item => {
							if (item.code == "degree") {
								this.degree.push(item)
							}
					
					})
					}else {
						this.$message({
							message: '请求查询信息失败',
							type: 'error'
						});
					}

				})
			},
			setQueryFormOne(form) {
				// this.queryFormOne.hospitalId = form.hospitalId
				// this.queryFormOne.newbaseid = form.baseId
				// this.queryFormOne.newdepartment = form.deptId

				if (form.hospitalIdForBase == "") {
					this.queryFormOne.newbaseid = form.baseId
					this.queryFormOne.hospitalIdForBase = ""
				} else {
					this.queryFormOne.newbaseid = ""
					this.queryFormOne.hospitalIdForBase = form.hospitalIdForBase
				}
				if (form.hospitalId == "") {
					this.queryFormOne.hospitalId = ""
					this.queryFormOne.newdepartment = form.deptId
				} else {
					this.queryFormOne.newdepartment = ""
					this.queryFormOne.hospitalId = form.hospitalId
				}

			},
			setQueryForm(form) {
				if (form.hospitalId == "") {
					this.queryForm.hospitalId = ""
					this.queryForm.deptId = form.deptId
				} else {
					this.queryForm.deptId = ""
					this.queryForm.hospitalId = form.hospitalId
				}
			},
			getPicktime(val) {
				// if (tag == 0) {
				// 	this.queryFormOne.starttime = val
				// } else if (tag == 1) {
				// 	this.queryFormOne.endtime = val
				// }

				if (this.queryFormOne.timeArr != null && this.queryFormOne.timeArr.length > 0) {
					let start = new Date(this.queryFormOne.timeArr[0]).getTime()
					let end = new Date(this.queryFormOne.timeArr[1]).getTime()
					if (end - start > 3600 * 1000 * 24 * 3 * 365) {
						this.queryFormOne.timeArr = []
						this.$message({
							message: '时间选择范围应在三年内！',
							type: 'warning'
						});
					}
				}
			},
			showNameDetail(row) {
				this.showLunzhuan = true;
				this.lunzhuanTitle = row.name + "的轮转计划"
				this.turnPlanInfo(row.stuId);
			},
			queryStudentList(options = {
				starttime: "",
				endtime: ""
			}) {
				let self = this
				if (this.queryFormOne.timeArr != null && this.queryFormOne.timeArr.length > 0) {
					options.starttime = moment(this.queryFormOne.timeArr[0]).startOf("month").format("YYYY-MM-DD")
					options.endtime = moment(this.queryFormOne.timeArr[1]).endOf("month").format("YYYY-MM-DD")
				}
				post('/turn/queryStudentList', {
					"command": "turn/queryStudentList",
					"sessionid": getCookie('sid'),
					"loginid": getCookie('uid'),
					"reqnum": this.pageSizeS,
					"page": this.pageNums,
					...options
				}).then(data => {
					if (data && data.errcode == 0) {
						this.planDetailsDatas = data.turn_plan_detail
						this.totalPagesS = data.count
						self.planyearmontlist = data.planyearmontlist;
						self.usePage = false;

						self.$nextTick(function () {
							document.querySelectorAll(".el-table__header-wrapper table")[0].style.position = 'static'
							document.getElementsByClassName("monthHeader")[0].style.position = 'static'
							self.rowHeight = document.getElementsByTagName('tr')[0].offsetHiehgt + (2.25 / self.planDetailsDatas.length);

							let height = (self.planDetailsDatas.length + 1) * (document.getElementsByTagName('tr')[0].offsetHiehgt)
							let width = (document.getElementsByClassName('custom-table')[0].offsetWidth) + (document.getElementsByClassName('monthHeader')[0].offsetWidth + 10)
							document.getElementsByClassName("custom-table")[0].style.width = height + "px"
							document.getElementById("plan-content").style.width = width + "px"
							let tableWrapper = document.getElementsByClassName("table-wrapper")[0]
							let h = tableWrapper.offsetTop
							let fixed = document.querySelectorAll('.custom-table .el-table__fixed')[0]
							let s = document.querySelectorAll('.el-table__header-wrapper table')[0]
							let m = document.querySelectorAll('.monthHeader')[0]
							let f = document.querySelectorAll('.el-table__fixed-header-wrapper')[0]
							let t = document.querySelectorAll('.el-table__header-wrapper')[0]
							let b = document.querySelectorAll('.el-table__body-wrapper')[0]
							let d = document.querySelectorAll('.el-table__fixed-body-wrapper')[0]
							let c = document.querySelectorAll('.circleDetailRow')[0]
							let flag = true
							let th = document.getElementsByTagName('tr')[0].offsetHiehgt
							b.addEventListener('mouseover', function () {
								flag = false
								let Myfunction = () => {
									if (!flag) {
										let len = tableWrapper.scrollTop
										let w = document.getElementsByClassName('custom-table')[0].offsetWidth
										let left = tableWrapper.scrollLeft
										fixed.scrollTop = len
										if (len > 0) {
											s.setAttribute('style', `"position": "absolute"; "left": -${left}; "top": "0", "z-index": "4"`)
											m.setAttribute('style', `"position": "absolute", "top": "0", "left": ${w - left}, "z-index": "2"`)
											f.setAttribute('style', `"top": ${len}, "z-index": "4"`)
											b.setAttribute('style', `"top": ${th}`)
											d.setAttribute('style', `"top": ${th}`)
											c.setAttribute('style', `"position": "relative", "top": ${th}`)
										} else {
											s.setAttribute('style', `"position": "static", "left": "0", "top": "0", "z-index": "4"`)
											m.setAttribute('style', `"position": "static", "top": "0", "left": -${w}, "z-index": "2"`)
											f.setAttribute('style', `"top": 0, "z-index": "3"`)
											b.setAttribute('style', `top", ""`)
											d.setAttribute('style', `"top", ${th}`)
											c.setAttribute('style', `"position": "static", "top": "0"`)
										}
									}
								}
								tableWrapper.removeEventListener('scroll', Myfunction)
								tableWrapper.addEventListener('scroll', Myfunction)
							})
							fixed.addEventListener('mouseover', function (e) {
								flag = true
								fixed.addEventListener('scroll', function () {
									if (flag) {
										tableWrapper.scrollTop = fixed.scrollTop
									}
								})
								e.stopPropagation()
							})
						});
					}
				})
			},

			turnPlanInfo(stuId) {
				this.getData('studentFile/turnPlanInfo', stuId).then(res => {
					if (res && res.errcode == 0) {
						this.circlePlanDetail = res.list.list;
					}
				})
			},
			getData(url, param) {
				return new Promise((resolve, reject) => {
					post('/' + url, {
						command: url,
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						id: param
					}).then((data) => {
						if (data && data.errcode == 0) {
							resolve(data);
						}
					}).catch(function (error) {
						reject(error);
					})
				})
			},
			selectQuery() {
				let options = {
					"base_id": this.queryFormOne.newbaseid,
					"hospitalId": this.queryFormOne.hospitalId,
					"dept_id": this.queryFormOne.newdepartment,
					"type_id": this.queryFormOne.type_id,
					"degree": this.queryFormOne.degre_id,
					"search_info": this.queryFormOne.input,
					"starttime": this.queryFormOne.starttime,
					"endtime": this.queryFormOne.endtime,
					"hospitalIdForBase": this.queryFormOne.hospitalIdForBase
				}
				for (let i in options) {
					if (options[i] == "") {
						delete options[i]
					}
				}
				this.queryStudentList(options)
			},
			computeColor(item) {
				if (item.id == 1) {
					return '#d3dce6';
				} else if (item.id == 2) {
					return '#20db9a';
				} else if (item.id == 3) {
					return '#f99e1c';
				} else if (item.id == 4) {
					return '#F56C6C'
				} else {
					return '#d3dce6';
				}
			},
			newbasechange: function () {
				let self = this;
				self.queryFormOne.newdepartment = '';
				self.queryFormOne.newarea = '';
				self.newdeptList = [];
				self.newareaList = [];
				self.newroomList.map(function (index, item) {
					if (self.queryFormOne.newbaseid == item.id) {
						self.newdeptList = item.childlist
					}
				})
			},
			//查看异常人员列表
			detailabnormallist: function (month, deptid) {
				let self = this;
				self.dialogmonth = month;
				self.dialogdeptid = deptid;
				self.abnormalPersonnel = true;
				self.exportOptionsDialog = {
					deptid: deptid,
					month: month
				}
				post('/turn/querydeptturninfobymonth', {
					command: 'turn/querydeptturninfobymonth',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					deptid: deptid,
					month: month
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.abnormalData = data.turninfolist
					}
				}).catch(function (error) {
					console.log(error)
				})
			},
			//分页
			/*分页区*/
			handleSizeChangeOne(size) {
				this.pageSizeS = size
				this.selectQuery()
			},
			handleSizeChange(size) {
				let self = this;
				this.pagesize = size
				this.inittable(
					self.queryForm.hospitalId,
					self.queryForm.deptId,
					self.queryForm.newbaseid,
					self.queryForm.turnplanid,
					self.queryForm.years,
					self.pagenum,
					self.pagesize
				)
			},
			handleCurrentChangeOne(currentPage) {
				this.pageNums = currentPage
				this.selectQuery()
			},
			handleCurrentChange(currentPage) {
				let self = this;
				this.pagenum = currentPage
				this.inittable(
					self.queryForm.hospitalId,
					self.queryForm.deptId,
					self.queryForm.newbaseid,
					self.queryForm.turnplanid,
					self.queryForm.years,
					self.pagenum,
					self.pagesize
				);

			},
			//异常人员列表导出
			dialogexportData: function () {
				let data = {
					command: "turn/querydeptturninfobymonth",
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					deptid: this.dialogdeptid,
					month: this.dialogmonth,
					...this.exportOptionsDialog
				};
				exportExcel(data);
			},
			colorinfo(item2) {
				if (item2.actualcount == item2.plancount) {
					return 'green'
				} else if (item2.actualcount > item2.plancount) {
					return 'red'
				} else if (item2.actualcount < item2.plancount) {
					return 'orange'
				}
			},
			inittable(hospitalId, deptId, base, turnplanid, year, pagenum, pagesize) {	//初始查询
				let self = this;
				self.loading = true;
				self.tabletitlelist = [];
				self.exportOptions = {
					hospitalId: this.queryForm.hospitalId,
					deptId: this.queryForm.deptId,
					baseid: this.queryForm.newbaseid,
					turnplanid: turnplanid,
					year: year ? new Date(year).getFullYear() : self.nowyear,
					baseidlist: self.baseidlist
				};
				post('/turn/turnplandetailcount', {
					command: 'turn/turnplandetailcount',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					baseid: this.queryForm.newbaseid,
					hospitalId: this.queryForm.hospitalId,
					deptId: this.queryForm.deptId,
					turnplanid: turnplanid,
					year: year ? new Date(year).getFullYear() : self.nowyear,
					page: pagenum ? pagenum : 1,
					pagenum: self.pagesize ? self.pagesize : 10,
					baseidlist: self.baseidlist
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.tabletitlelist = data.result.yearmonthlist;
						let _item = { yearmonthname: '科室  |  日期' };
						self.tabletitlelistadd.unshift(_item);
						self.rateList = [];
						self.rateList = data.result.beanlist;
						if (data.result.beanlist && data.result.beanlist != null) {
							data.result.beanlist.map(item => {
								self.centerlist.push(item.detailcountlist)
							})
						}
						self.totalCount = data.result.totalcount;
						if (data.result.yearmonthlist) {
							data.result.yearmonthlist.map(item => {
								self.tableyearmouth = moment(item.yearmonth, 'YYYY-MM-DD HH:mm:ss').valueOf();
								item.tableyearmouth = moment(item.yearmonth, 'YYYY-MM-DD HH:mm:ss').valueOf();
							})
						}
					}
				}).catch(function (error) {
					self.loading = false;
					//console.log(error)
				})
			},
			queryAll: function () {
				let self = this;
				self.queryForm.deptId = '';
				self.queryForm.baseid = '';
				self.queryForm.hospitalId = '';
				self.queryForm.newbaseid = '';
				self.queryForm.turnplanid = '',
					self.queryForm.years = '';
				this.rightNowClear = this.rightNowClear + 1
				self.inittable('', '', '', '', "");
			},
			gettime: function (time) {		//选取时间段
				this.queryForm.years = time;//选取时间段
			},
			handleSelectionChange(r) {
				this.selectItems = r;
			},


			query: function () {			//按条件查询，查询按钮
				let self = this;
				let queryyear = '';
				// if(self.queryForm.years == '' || !self.queryForm.years){
				// 	queryyear = self.nowyear;
				// }else{
				// 	queryyear = self.queryForm.years
				// }
				self.inittable(
					self.queryForm.deptId,
					self.queryForm.hospitalId,
					self.queryForm.newbaseid,
					self.queryForm.turnplanid,
					self.queryForm.years
				)
			},

			exportData: function () {					//批量导出
				let self = this;
				if (self.queryForm.years) {
					self.exportyear = self.queryForm.years
				} else {
					self.exportyear = self.nowyear
				};
				let data = {
					command: 'turn/turnplandetailcount',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					year: self.exportyear,
					...self.exportOptions
				};
				exportExcel(data);
			},

			gethospitaltree: function () {					//带权限的基地科室和病区
				let self = this;
				post('/turnbaseinfo/getusermanagerdepttree', {
					command: 'turnbaseinfo/getusermanagerdepttree',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.newroomList = data.depttree.childlist;
						if (data.depttree.childlist.length > 0) {
							data.depttree.childlist.map(item => {
								self.baseidlist.push(item.id)
							})
						}
					}
					self.inittable('', '', '', '', "");
				}).catch(function (error) {
					console.log(error)
				})
			},

			arraySpanMethod() {
				// alert("合并单元格")
			},

			//查询所有的轮转计划
			getallturnplanlist: function () {
				let self = this;
				post('/turnplan/queryturnplanlist', {
					command: 'turnplan/queryturnplanlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid')
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.turnplanlist = data.list;
					}
				}).catch(function (error) {
					console.log(error)
				})
			},
			editTurn() {
				this.$refs.adjustDialog.init(1, this.selectItems)
			}
		}
	}

</script>
<style>
	.dialogHeight .el-dialog__body {
		max-height: 600px;
		overflow: scroll;
	}

	.dialogHeight .el-dialog {
		width: 80%;
	}

	.turnPlanDetailCount .queryTools .el-form-item {
		/* width: 190px; */
		margin-bottom: 10px;
	}

	.turnPlanDetailCount .el-form--inline {
		display: flex;
		flex-wrap: wrap;
	}

	.turnPlanDetailCount .custom-table .el-table__cell .cell {
		height: 23px;
	}

	.turnPlanDetailCount .custom-table .el-button {
		padding: 0;
	}

	.turnPlanDetailCount .el-date-editor--monthrange {
		width: 260px;
	}
</style>
<style scoped lang="scss">
	.flexForm {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.custom-table th {
		box-sizing: border-box
	}

	.detailTable {
		width: 100%;
		overflow: hidden;
	}

	.rowHeight {
		height: 23px;
	}

	.custom-table.el-table /deep/ td {
		height: 23px;
	}

	.custom-table .table-wrapper {
		height: 460px;
		overflow-y: auto;
	}

	.custom-table .el-table__body-wrapper {
		overflow-x: hidden;
	}

	.custom-table /deep/ .el-table__fixed {
		height: 442px !important;
		overflow-y: auto;
	}

	.custom-table /deep/ .el-table__fixed::-webkit-scrollbar {
		display: none;
	}

	.turnPlanDetailCount {
		padding: 0 20px;
	}

	.wapper {
		padding: 10px 0 !important;
	}

	.funcTools {
		margin: 15px 0px;
	}

	.queryTools {
		float: left;
		width: 100%;
		margin-bottom: 15px;
	}

	.queryAll {
		float: left;
		margin-right: 12px;
		margin-top: -2px;
	}

	.queryTools .el-form-item {
		/* width: 190px; */
		margin-bottom: 10px;
	}

	.queryTools .el-select {
		width: 120px;
	}

	.search {
		float: right;
	}

	.tabletitle {
		float: right;
		margin-bottom: 10px;
	}

	.tabletitle span {
		display: inline-block;
		width: 20px;
		height: 10px;
		margin: 0px 5px;
	}

	.titlegreen {
		background: green;
	}

	.titlered {
		background: red;
	}

	.titleorange {
		background: orange;
	}

	.fontgreen {
		color: green;
	}

	.fontred {
		color: red;
	}

	.fontorange {
		color: orange;
	}

	.querybtn {
		margin-left: 5px;
	}

	.show-color {
		width: 100%;
		margin: 15px 0px;
	}

	.show-color div {
		display: inline-block;
		margin-right: 20px;
		line-height: 20px;
	}

	.show-color span {
		display: inline-block;
		width: 40px;
		height: 15px;
		margin-right: 10px;
	}

	.studentSearch {

		th {
			box-sizing: border-box;
		}

		.scrollFixed {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 4;
		}
		.classSearch.el-form-item {
			width: 360px !important;
		}
		.classSearch .el-form-item__label {
			width: 100px;
		}
		.table-wrapper {
			height: 460px;
			overflow-y: auto;
		}

		.custom-table /deep/ .el-table__fixed {
			height: 442px !important;
			overflow-y: auto;
		}

		.custom-table /deep/ .el-table__fixed::-webkit-scrollbar {
			display: none;
		}

		.topTitle {
			width: 100%;
			height: 30px;
		}
		.queryTools {
			float: left;
			/* width: 74%; */
		}

		.searchBtn {
			float: left;
			margin-left: 10px;
			margin-top: 26px;
		}

		.searchTools {
			float: right;
			margin-bottom: 15px;
		}

		.queryTools .el-form-item {
			width: 200px;
			margin-bottom: 10px;
		}

		.el-select {
			width: 120px;
		}

		.detailTable {
			width: 100%;
			overflow: hidden;
		}

		.el-dialog .el-select {
			width: 196px;
		}

		.circleRoomInfo {
			padding-top: 20px;
			padding-bottom: 10px;
			border-top: 1px solid #d3dce6;
		}

		.circleRoom {
			margin-right: 300px;
		}

		.selectDate .el-date-editor {
			width: 196px;
		}

		.addBtn {
			padding-top: 20px;
			border-top: 1px solid #d3dce6;
		}

		/* .rowHeight {
			height: 40px;
		} */

		.el-table__body-wrapper {
			overflow-x: hidden;
		}

		.custom-table {
			position: static !important;
		}

		.show-color {
			width: 100%;
			margin: 15px 0px;
		}

		.show-color div {
			display: inline-block;
			margin-right: 20px;
			line-height: 20px;
		}

		.show-color span {
			display: inline-block;
			width: 40px;
			height: 15px;
			margin-right: 10px;
		}

		#plan-content {
			width: 6000px;
		}

		.inline {
			text-align: center;
			margin: 0px 0px 10px 0px;
		}

		.el-table /deep/ td {
			height: 23px;
		}

		.tjxy-dialog {
			& /deep/ .el-dialog {
				width: 900px;
			}
		}

		.stageitem {
			& /deep/ .el-form-item__content {
				margin-left: 0 !important;
			}
		}
	}
</style>