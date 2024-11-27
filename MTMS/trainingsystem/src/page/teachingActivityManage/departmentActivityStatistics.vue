<template>
	<div class="wapper departmentActivityStatistics">
		<div class="tools">
			<div class="funcTools">
				<el-button type="primary" @click="exportData">批量导出</el-button>
			</div>
		</div>
		<div class="queryTools">
			<div class="queryTools newQueryTools">
				<el-row>
					<el-col :span="1">
						<el-button type="text" @click="queryAll">全部</el-button>
					</el-col>
					<el-col :span="18">
						<div class="queryTools zy-clear">
							<el-form :model="queryForm" :inline="true" ref="queryForm" label-width="80px">
								<el-form-item label="科室" prop="" style="width: 300px;" class="hosDeptBox">
									<el-select v-model="queryForm.hosDeptName" placeholder="请选择科室" multiple collapse-tags @remove-tag="removeNode">
										<el-option disabled style="height: auto;" value="">
											<el-tree ref="selectTree" :data="hosDeptTree" node-key="id" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="true"
											 :props="defaultProps" @check-change="handleCheckChange1" class="selfTree" show-checkbox></el-tree>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="科室名称">
									<el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入科室名称" @keyup.enter.native="doSelectQuery"></el-input>
								</el-form-item>
								<el-form-item label="时间" prop="">
									<el-date-picker style="width: 130px" v-model="queryForm.startime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="gettime">
									</el-date-picker>
									-
									<el-date-picker style="width: 130px" v-model="queryForm.endtime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getendtime">
									</el-date-picker>
								</el-form-item>
							</el-form>
						</div>
					</el-col>
					<el-col :span="5">
						<div class="queryWrap" style="float:right">
							<el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>

		<!--<div class = "funcBtns">

	</div>-->

		<div class="dataTable">
			<el-table ref="detailTable" :data="rateList" @sort-change="PercentileOrdering" border tooltip-effect="dark" style="width: 100%"
			 v-loading="loading">
				<el-table-column type="index" width="65" label="序号" align="center"></el-table-column>
				<el-table-column prop="doctorofficename" width="120" label="科室" align="center">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.doctorofficename" placement="top">
								<span>
									{{scope.row.doctorofficename}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="address" :label="item.name" v-for="(item, index) in teachTypeList" :key="index" align="center">
					<template slot="header" slot-scope="scope">
						{{item.name}}/次
					</template>
					<template slot-scope="scope">{{scope.row[teachtypeVlaue[index]]}}</template>
				</el-table-column>
				<el-table-column prop='totalcount' sortable="custom" label="总计/次" align="center"></el-table-column>
			</el-table>
			<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="totalCount">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel, get } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	import hospitalBaseDept from "../../components/hospitalBaseDept"

	export default {
		data() {
			return {
				teachTypeList: [],
				teachtypeVlaue: ['type4', 'type1', 'type3', 'type2', 'type5', 'type7', 'type8', 'type6'],
				defaultProps: {
					label: 'name',
					children: 'childrens',
					disabled: function (data, node) {
						if (data.havePermission != 1) {
							return true
						}
					}
				},
				queryForm: {
					hospitalId: "",
					newbaseid: '',
					newdepartment: [],
					startime: '',
					endtime: '',
					inputquery: '',
					hosDeptName: []
				},
				orderflag: '',
				//全部
				newdeptList: [],     //科室列表
				newroomList: [],     //基地列表
				officeList: [],      //过度科室列表
				rateList: [],
				startime: '',
				endtime: '',
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				endmonth: '',
				enddaydate: '',
				usePage: false,
				exportOptions: {},
				loading: false,
				showAdditionQuery: false,
				hosDeptTree: []
			}
		},
		computed: {
		},
		components: {
			hospitalBaseDept,
			...mapState(['sysTypeNum'])
		},
		mounted() {
			this.gethospitaltree()
			this.initDeptTree()
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
				})
			},
			removeNode(e) {
				this.queryForm.newdepartment = []
				this.queryForm.hosDeptName = []
				this.hospitalIdList = []
				this.baseIdlist = []
				this.deptIdList = []
				let response = this.$refs.selectTree.getCheckedNodes();
				response.forEach(item => {
					if (e != item.name) {
						this.queryForm.hosDeptName.push(item.name)
						this.queryForm.newdepartment.push(item.id)
						if (item.deptlevel == 1 && item.type == 0) {
							this.hospitalIdList.push(item.id)
						} else if (item.deptlevel == 2 && item.type == 0) {
							this.baseIdlist.push(item.id)
						} else if (item.type == 1) {
							this.deptIdList.push(item.id)
						}
					}
				})
				this.$refs.selectTree.setCheckedKeys(this.queryForm.newdepartment);
			},
			handleCheckChange1(data, dataObj) {
				if (data.havePermission != 1) {
					return false;
				}
				this.queryForm.hosDeptName = []
				this.hospitalIdList = []
				this.baseIdlist = []
				this.deptIdList = []
				this.queryForm.newdepartment = this.$refs.selectTree.getCheckedKeys();
				let response = this.$refs.selectTree.getCheckedNodes();
				response.forEach(item => {
					this.queryForm.hosDeptName.push(item.name)
					if (item.deptlevel == 1 && item.type == 0) {
						this.hospitalIdList.push(item.id)
					} else if (item.deptlevel == 2 && item.type == 0) {
						this.baseIdlist.push(item.id)
					} else if (item.type == 1) {
						this.deptIdList.push(item.id)
					}
				})
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
						self.officeList = data.beanlist.officelist;
						/*
						 **
						 * 默认查询当前月1号到当月当天的数据，(查询所有时也一样)
						 ** */
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
						self.inittable(self.pageno, self.pagesize, '', '', self.queryForm.startime, self.queryForm.endtime, '', '', '');
					}
				}).catch(function (error) {
				})
			},

			//批量导出
			exportData: function () {
				let self = this;
				let data = {
					command: 'teachingreport/deptteachingplanreport',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					statuslist: 2,
					startime: self.queryForm.startime,
					endtime: self.queryForm.endtime,
					orderflag: self.orderflag,
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
					this.queryForm.newbaseid, this.queryForm.newdepartment,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery, this.orderflag);
			},
			queryAll: function () {
				let self = this;
				self.queryForm.hospitalId = '';
				self.queryForm.newbaseid = '';
				self.queryForm.newdepartment = [];
				self.queryForm.hosDeptName = [];
				self.queryForm.startime = '';
				self.queryForm.endtime = '';
				self.queryForm.inputquery = '';
				this.hospitalIdList = []
				this.baseIdlist = []
				this.deptIdList = []
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
				self.inittable(this.pageno, this.pagesize, '', '', self.queryForm.startime, self.queryForm.endtime, '', '');
			},

			inittable: function (pageno, pagesize, base, doctoroffice, startime, endtime, inputquery, orderflag) {
				let self = this;
				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					base: base,
					doctoroffice: doctoroffice,
					starttime: startime,
					endtime: endtime,
					doctorofficename: inputquery,
					orderflag: orderflag,
					hospitalIdList: this.hospitalIdList,
					baseIdList: this.baseIdlist,
					deptIdList: this.queryForm.deptIdList,

				};
				self.loading = true;
				post('/teachingreport/deptteachingplanreport', {
					command: 'teachingreport/deptteachingplanreport',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					page: pageno,
					reqnum: pagesize,
					hospitalIdList: this.hospitalIdList,
					baseIdList: this.baseIdlist,
					deptIdList: this.deptIdList,
					starttime: startime,
					endtime: endtime,
					doctorofficename: inputquery,
					orderflag: orderflag,   //0降序；1升序
					statuslist: 2,
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
					this.queryForm.newbaseid, this.queryForm.newdepartment,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery, this.orderflag);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize, this.queryForm.newbaseid, this.queryForm.newdepartment,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery, this.orderflag);
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
				self.inittable(
					self.pageno, self.pagesize,
					self.queryForm.newbaseid, self.queryForm.newdepartment,
					self.queryForm.startime,
					self.queryForm.endtime,
					self.queryForm.inputquery,
					self.orderflag
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

	.el-form.el-form--inline {
		margin-bottom: 10px;
	}

	.queryAll {
		float: left;
		margin-right: 12px;
	}

	.queryTools .el-form-item {
		/* width: 190px; */
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
	.departmentActivityStatistics .queryTools .el-date-editor .el-input__inner {
		width: 135px;
	}

	.departmentActivityStatistics .el-input {
		width: 200px;
	}
</style>