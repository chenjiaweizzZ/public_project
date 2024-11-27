<template>
	<div class="wapper patroldeptfrequency">
		<div class="tools">
			<div class="funcTools">
				<el-button type="primary" @click="exportData">批量导出</el-button>
			</div>
		</div>
		<div class="queryTools">
			<div class="queryAll">
				<el-button type="text" @click="queryAll">全部</el-button>
			</div>
			<el-form style="float:left" :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
				<el-form-item label="时间" prop="" style="width: 350px;">
					<el-date-picker style="width: 130px" v-model="queryForm.startime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="gettime">
					</el-date-picker>
					-
					<el-date-picker style="width: 130px" v-model="queryForm.endtime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getendtime">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<el-input style="width:230px" v-model="inputquery" placeholder="请输入教师姓名/工号/手机号" @keyup.enter.native="doSelectQuery"></el-input>
			<el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
		</div>

		<div class="dataTable">
			<el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%"
			 v-loading="loading" @selection-change="handleSelectionChange">
				<!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
				<el-table-column prop="name" label="巡查人员">
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
				<el-table-column prop="deptname" min-width="120" label="所在科室">
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
				<el-table-column prop="techname" label="职称"></el-table-column>
				<el-table-column prop="code" width="100" label="工号"></el-table-column>
				<el-table-column prop="mobile" label="手机号码"></el-table-column>
				<el-table-column prop="count" label="巡查/科次"></el-table-column>
			</el-table>
			<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="totalCount">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	import moment from 'moment'
	var _ = require('lodash');

	export default {
		data() {
			return {
				queryForm: {
					base: '', docoroffcie: '', area: '', startime: '', endtime: '',
					newbaseid: [],
					newdepartment: [],
					newarea: [],
				},
				//全部
				isnewbaseid: '',
				isnewdepartment: '',
				isnewarea: '',

				baseidlist: [],
				officeidlist: [],
				areaidlist: [],

				newroomList: [],
				newdeptList: [],
				newareaList: [],

				studentsList: [{}],
				inputquery: '',
				baseList: [],
				newRoomList: [],
				arealist: [],
				rateList: [],
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				usePage: true,
				exportOptions: {},
				loading: false,
			}
		},
		computed: {
		},
		mounted() {
			this.inittable(this.pageno, this.pagesize, '', '', '');
		},
		watch: {

		},
		methods: {
			exportData: function () {			//批量导出
				let self = this;
				let data = {
					command: 'teachingactivityplan/patroldeptstainfo',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					type: 7,
					...self.exportOptions
				}
				exportExcel(data);
			},
			queryAll: function () {
				var self = this;
				self.queryForm.startime = '';
				self.queryForm.endtime = '';
				self.inputquery = '';
				self.inittable(self.pageno, self.pagesize, '', '', '');
			},
			inittable: function (pageno, pagesize, startime, endtime, inputquery) {
				var self = this;
				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					startdate: startime,
					enddate: endtime,
					searchinfo: inputquery,
				}
				self.loading = true;
				post('/teachingactivityplan/patroldeptstainfo', {
					command: 'teachingactivityplan/patroldeptstainfo',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					type: 7,
					pagenum: pageno,
					pagepersize: pagesize,
					startdate: startime,
					enddate: endtime,
					searchinfo: inputquery,
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.rateList = data.stainfolist;
						self.totalCount = data.totalcount;
						self.usePage = false;
					}
				}).catch(function (error) {
					self.loading = false;
					//console.log(error)
				})
			},
			doSelectQuery: function () {//查询方法
				var self = this;
				self.inittable(self.pageno, self.pagesize,
					self.queryForm.startime, self.queryForm.endtime, self.inputquery)
			},
			/*分页区*/
			handleSizeChange(size) {
				this.pagesize = size;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.startime, this.queryForm.endtime, this.inputquery);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.startime, this.queryForm.endtime, this.inputquery);
			},
			gettime: function (date) {		//选取时间段
				var self = this;
				self.time = date;
				self.queryForm.startime = this.time;//选取时间段
			},
			getendtime: function (date) {		//选取时间段
				var self = this;
				self.time = date;
				self.queryForm.endtime = this.time;//选取时间段
			},
			handleSelectionChange: function () {//全选的方法
				//console.log();
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
		width: 1000px;
	}

	.queryAll {
		float: left;
		margin-right: 12px;
	}

	.queryTools .el-form-item {
		width: 190px;
		margin-bottom: 10px;
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
		margin-left: 20px;
	}
</style>
<style>
	.patroldeptfrequency .queryTools .el-date-editor .el-input__inner {
		width: 135px;
	}
</style>