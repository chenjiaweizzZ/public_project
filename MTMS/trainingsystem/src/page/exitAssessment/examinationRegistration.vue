<template>
	<div class="wapper">
		<div class="tools">
			<el-button type="primary" @click="exportData">批量导出</el-button>
		</div>
		<div class="queryTools">

			<el-form style="float:left;display: flex;align-items: flex-start" :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
				<div class="queryAll">
					<el-button type="text" @click="queryAll">全部</el-button>
				</div>
				<hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital"></hospital-base-dept1>
				<el-form-item label="报名日期" prop="" style="width: 300px;">
					<el-date-picker v-model="queryForm.registrationTime" type="month" placeholder="请选择报名日期" value-format="yyyy-MM" @change="gettime">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="考试项目">
					<el-select v-model="newVariable.examtype" filterable placeholder="请选择" @change="">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in newItem.examItem" :key="item.key" :label="item.name" :value="item.key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="报名类型">
					<el-select v-model="newVariable.enlisttype" filterable placeholder="请选择" @change="">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in newItem.enrollType" :key="item.key" :label="item.name" :value="item.key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="margin-left:20px;">
					<el-input style="width: 200px;" v-model="queryForm.inputquery" placeholder="请输入姓名/手机号/学号" @keyup.enter.native="doSelectQuery"></el-input>
				</el-form-item>
				<el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
			</el-form>
		</div>
		<div class="funcBtns">
		</div>
		<div class="dataTable">
			<el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading">
				<el-table-column type="selection" width="45"></el-table-column>
				<!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
				<el-table-column prop="stuname" fixed="left" width="120" label="姓名">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stuname" placement="top">
								<el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.stuname}}</el-button>

							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="stuno" width="110" label="学号"></el-table-column>
				<el-table-column prop="type" width="110" label="学员类型">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.type" placement="top">
								<span>
									{{scope.row.type}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="mobile" width="110" label="手机号码"></el-table-column>
				<el-table-column prop="turngradename" label="年级"></el-table-column>
				<el-table-column prop="stubasename" width="120" label="专业基地">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stubasename" placement="top">
								<span>
									{{scope.row.stubasename}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="studeptname" width="120" label="科室">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.studeptname" placement="top">
								<span>
									{{scope.row.studeptname}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="deptname" width="120" label="出科科室">
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
				<el-table-column prop="ckdate" width="110" label="出科日期"></el-table-column>
				<el-table-column prop="turndeptname" width="120" label="报名时轮转科室">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turndeptname" placement="top">
								<span>
									{{scope.row.turndeptname}}
								</span>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="createtimestr" width="110" label="报名日期">
					<template slot-scope="scope">
						<template>
							<div v-if="scope.row.createtimestr">
								{{ scope.row.createtimestr.substring(0,7) }}
							</div>
						</template>
					</template>
				</el-table-column>

				<template v-if="owned">
					<el-table-column prop="theorystatus" label="理论考试"></el-table-column>
					<el-table-column prop="skillstatus" label="技能考试"></el-table-column>
					<el-table-column prop="comprestatus" label="综合考试"></el-table-column>
					<el-table-column prop="enlisttype" label="报名类型"></el-table-column>
					<el-table-column label="操作" fixed="right" width="120">
						<template slot-scope="scope">
							<el-button @click="deletethis(scope.$index,scope.row)" type="text" size="small">删除</el-button>
						</template>
					</el-table-column>
				</template>


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
	import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel, _ajax } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
	var _ = require('lodash');

	export default {
		data() {
			return {
				rightNowClear: 0,
				dialogRecords: false,
				studentDetailId: "",
				queryForm: {
					hospitalIdForBase: "",
					hospitalId: "",
					base: '',
					docoroffcie: '',
					inputquery: '',
					registrationTime: '',
					newbaseid: "",
					newdepartment: "",
					newarea: [],
				},
				hasHospital: false,
				loading: false,
				//全部
				newroomList: [],
				newdeptList: [],
				inputquery: '',
				baseList: [],
				arealist: [],
				rateList: [],
				startime: '',
				starmonth: '',//报名日期
				endtime: '',
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				newItem: {
					examItem: [
						{ key: 1, name: '理论考试' },
						{ key: 2, name: '技能考试' },
						{ key: 3, name: '综合考试' },
					],
					enrollType: [
						{ key: 1, name: '出科报名' },
						{ key: 2, name: '补考报名' },
					],
				},
				newVariable: {
					examtype: '',
					enlisttype: '',
				},
				ports: {
					deleteItem: '/turnexam/deleteexamination',
				},
				owned: 1,//暂时没有用处的功能
				usePage: false,
				exportOptions: {}
			}
		},
		computed: {
		},
		mounted() {
			this.inittable(this.pageno, this.pagesize, '', '', '', '');
		},
		watch: {

		},
		components: {
			studentPersonalInfo,
			hospitalBaseDept1
		},
		methods: {
			setQueryFormOne(form) {
				if (form.hospitalIdForBase == "") {
					this.queryForm.newbaseid = form.baseId
					this.queryForm.hospitalIdForBase = ""
				} else {
					this.queryForm.hospitalIdForBase = form.hospitalIdForBase
					this.queryForm.newbaseid = ""
				}
				if (form.hospitalId == "") {
					this.queryForm.hospitalId = ""
					this.queryForm.newdepartment = form.deptId
				} else {
					this.queryForm.hospitalId = form.hospitalId
					this.queryForm.newdepartment = ""
				}


			},
			personalDetail(index, row) {
				this.dialogRecords = true;
				this.studentDetailId = row.stuid
			},
			deletethis: function (index, row) {
				let port = this.ports.deleteItem;
				let option = {
					command: port.substr(1),
					id: row.id,
				};
				//删除单个报名信息
				let self = this;
				this.$confirm('是否要删除选中的学生?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_ajax(this.ports.deleteItem, option).then((data) => {
						if (data && data.errcode == 0) {
							let msg = '删除成功！';
							let type = 'success';
							if (data.flag == '1') {
								type = 'error';
								msg = data.message ? data.message : '已录入成绩，不能删除!';
							} else {
								//更新列表
								this.doSelectQuery();
							}
							self.$message({
								type: type,
								message: msg
							});

						} else {
							self.$message({
								type: 'error',
								message: data.errdesc,
							});
						}
					}).catch(() => {
						self.$message({
							type: 'error',
							message: '删除失败！'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
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
						self.newroomList = data.depttree.childlist
						self.inittable(self.pageno, self.pagesize, '', '', '', '');
					}
				}).catch(function (error) {
					//console.log(error)
				})
			},
			// newbasechange: function () {
			// 	let self = this;
			// 	self.queryForm.newdepartment = '';
			// 	self.newdeptList = [];
			// 	self.newroomList.map(item => {
			// 		if (self.queryForm.newbaseid == item.id) {
			// 			self.newdeptList = item.childlist
			// 		}
			// 	})
			// },

			exportData: function () {			//批量导出
				let self = this;
				let data = {
					command: 'turnexam/queryturnexaminationlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'), //姓名
					status: 10,
					type: 1,
					...self.exportOptions
				};
				exportExcel(data);
			},
			queryAll: function () {
				let self = this;
				self.queryForm.registrationTime = '';
				self.newVariable.examtype = '';
				self.newVariable.enlisttype = '';
				self.queryForm.hospitalId = '';
				self.queryForm.newbaseid = '';
				self.queryForm.newdepartment = '';
				self.queryForm.newarea = '';
				self.starmonth = '';
				self.queryForm.startime_endtime = '';
				self.queryForm.inputquery = '';
				this.pageno = 1;
				this.rightNowClear = this.rightNowClear + 1
				self.inittable(this.pageno, this.pagesize, '', '', '', '');
			},
			inittable: function (pageno, pagesize, base, docoroffcie, starmonth, inputquery) {
				var self = this;
				self.loading = true;
				let examtype = self.newVariable.examtype;
				examtype = examtype == 0 ? '' : examtype;
				let enlisttype = self.newVariable.enlisttype;
				enlisttype = enlisttype == 0 ? '' : enlisttype;

				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					hospitalId: this.queryForm.hospitalId,
					baseid: base,
					deptid: docoroffcie,
					createtimeyearmonth: starmonth,		//报名日期
					nameorno: inputquery,		//姓名
					examtype: examtype,//考试项目
					enlisttype: enlisttype,//报名类型
					hospitalIdForBase: self.queryForm.hospitalIdForBase
				}
				post('/turnexam/queryturnexaminationlist', {
					command: 'turnexam/queryturnexaminationlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					baseid: base,
					hospitalId: this.queryForm.hospitalId,
					deptid: docoroffcie,
					createtimeyearmonth: starmonth,		//报名日期
					page: pageno,
					reqnum: pagesize,
					nameorno: inputquery,		//姓名
					status: 10,
					examtype: examtype,//考试项目
					enlisttype: enlisttype,//报名类型
					type: 1,
					hospitalIdForBase: self.queryForm.hospitalIdForBase
					//审核状态  //1审核打回5审核10审核通过
					// 下面这三个有什么用？注释都可以正常发送请求
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.rateList = data.beanlist;
						self.totalCount = data.count;
					}
					self.usePage = false;
				}).catch(function (error) {
					this.loading = false;
					//console.log(error)
				})
			},

			/*分页区*/
			handleSizeChange(size) {
				this.pagesize = size;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid,
					this.queryForm.newdepartment,
					this.starmonth,
					this.queryForm.inputquery);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid,
					this.queryForm.newdepartment,
					this.starmonth,
					this.queryForm.inputquery);
			},
			gettime: function (date) {		//选取时间段
				this.starmonth = date;
			},
			doSelectQuery: function () {//查询方法
				let self = this;
				self.pageno = 1;
				self.inittable(self.pageno, self.pagesize,
					self.queryForm.newbaseid,
					self.queryForm.newdepartment,
					self.starmonth,
					self.queryForm.inputquery,
				)
			},
		}
	}
</script>

<style scoped>
	.wapper {
		padding: 0 20px 90px 20px;
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