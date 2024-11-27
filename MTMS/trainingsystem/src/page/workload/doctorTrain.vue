<template>
	<div class="doctorTrain-page">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="培训统计" name="first">
				<div class="wapper">
					<div class="tools">
						<div class="funcTools">
							<el-button type="primary" @click="exportData">批量导出</el-button>
						</div>
						<div class="search">
							<div class="search-input" style="float:left">
								<el-input style="width:200px" v-model="inputquery" placeholder="请输入教师姓名/工号" @keyup.enter.native="doInputQuery"></el-input>
							</div>
							<div class="search-btn" style="float:left;margin-left:20px">
								<el-button type="primary" @click="doInputQuery">搜索</el-button>
							</div>
						</div>
					</div>
					<div class="queryTools">
						<div class="queryAll">
							<el-button type="text" @click="queryAll">全部</el-button>
						</div>
						<el-form style="float:left" :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
							<el-form-item label="基地">
								<el-select v-model="queryForm.newbaseid" filterable placeholder="请选择" @change="newbasechange">
									<el-option label="全部" value=""></el-option>
									<el-option v-for="item in newroomList" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="科室">
								<el-select v-model="queryForm.newdepartment" filterable placeholder="请选择">
									<el-option label="全部" value=""></el-option>
									<el-option v-for="item in newdeptList" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="培训次数">
								<el-select filterable v-model="queryForm.traincount" placeholder="请选择">
									<el-option label="全部" value=""></el-option>
									<el-option v-for="(item,index) in traincountlist" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
						</el-form>
					</div>

					<!--<div class = "funcBtns">
							
								</div>-->

					<div class="dataTable">
						<el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" v-loading="loading" style="width: 100%"
						 @selection-change="handleSelectionChange">
							<!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
							<el-table-column prop="uname" label="姓名" width="120">
								<template slot-scope="scope">
									<div class="actionplansty">
										<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.uname" placement="top">
											<el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.uname}}</el-button>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="username" width="120" label="工号"></el-table-column>
							<el-table-column prop="mobile" label="手机号"></el-table-column>
							<el-table-column prop="techniquename" label="职称"></el-table-column>
							<el-table-column prop="resllist" min-width="220" label="科室">
								<template slot-scope="scope">
									<template v-for="item in scope.row.resllist">
										<div>{{item.deptname}}</div>
									</template>
								</template>
							</el-table-column>
							<el-table-column prop="traincount" label="累计培训次数">
								<template slot-scope="scope">
									<el-button type="text" @click="checkDetail(scope.row.uname)">{{scope.row.traincount}}</el-button>
								</template>
							</el-table-column>
						</el-table>

						<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
						 :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
						 :total="totalCount">
						</el-pagination>
					</div>
					<!-- 职工信息 -->
					<employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
				</div>
			</el-tab-pane>
			<el-tab-pane label="培训明细" name="second">
				<doctorTrainDetail :searchName="searchName"></doctorTrainDetail>
			</el-tab-pane>
		</el-tabs>
	</div>


</template>
<script>
	import doctorTrainDetail from "./doctorTrainDetail.vue"
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel,getStorage } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	import employeeInfo from "../../components/employeeInfo.vue"
	export default {
		data() {
			return {
				searchName: "",
				activeName: 'first',
				currentDataId: "", // 当前点击职工详情信息
				dialogEmployee: false, //职工详情弹窗
				traincountlist: [		//查询次数
					{
						name: '一次',
						id: 1
					},
					{
						name: '二次',
						id: 2
					},
					{
						name: '三次及以上',
						id: 3
					},
				],
				queryForm: {
					base: '',
					docoroffcie: '',
					traincount: '',
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

				newroomList: [],
				newdeptList: [],

				inputquery: '',
				baseList: [],
				arealist: [],
				rateList: [],
				startime: '',
				endtime: '',
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				usePage: false,
				exportOptions: {},
				loading: false,
				menuId: ""
			}
		},
		components: {
			employeeInfo,
			doctorTrainDetail
		},
		computed: {
		},
		mounted() {
			// this.gethospitaltree();
			this.menuId = getStorage("menuId")
			this.getNewTree()
		},
		watch: {

		},
		methods: {
			getNewTree() {
				let self = this;
				post("/base/dept/getMyHosBaseDeptTree", { menusId: this.menuId }).then(res => {
					let arr = [];
					res.model.forEach(i => {
						arr.push(...i.childrens)
					})
					self.newroomList = arr
				});
			},
			checkDetail(name) {
				this.searchName = name
				this.activeName = "second"
			},
			handleClick() {
				this.searchName = ""
			},
			employeeDetail(index, row) {
				this.currentDataId = row.uid;
				this.dialogEmployee = true
			},
			//带权限的基地科室和病区
			gethospitaltree: function () {
				let self = this;
				post('/turnbaseinfo/getusermanagerdepttree', {
					command: 'turnbaseinfo/getusermanagerdepttree',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					uid: getCookie('uid'),
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.newroomList = data.depttree.childlist;
						self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '');
					}
				}).catch(function (error) {
					//console.log(error)
				})
			},
			newbasechange: function () {
				let self = this;
				self.queryForm.newdepartment = '';
				self.newdeptList = [];
				self.newroomList.map(item => {
					if (self.queryForm.newbaseid == item.id) {
						self.newdeptList = item.childrens;
					}
				})
			},

			exportData: function () {			//批量导出
				let self = this;
				let data = {
					command: 'turntrain/getusertraincount',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					...self.exportOptions
				}
				exportExcel(data);
			},
			queryAll: function () {
				let self = this;
				self.queryForm.newbaseid = '';
				self.queryForm.newdepartment = '';
				self.queryForm.traincount = '';
				self.inputquery = '';
				self.inittable(self.pageno, self.pagesize, '', '', '', '');
			},
			inittable: function (pageno, pagesize, base, docoroffcie, traincount, inputquery) {
				let self = this;

				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					baseid: base,
					officeid: docoroffcie,
					traincount: traincount,
					nameorusername: inputquery,
					hospitalid: '',
					trainbegin: '',
					trainend: ''
				}
				self.loading = true;
				post('/turntrain/getusertraincount', {
					command: 'turntrain/getusertraincount',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					page: pageno,
					reqnum: pagesize,
					baseid: base,
					officeid: docoroffcie,
					traincount: traincount,
					nameorusername: inputquery,
					hospitalid: '',
					trainbegin: '',
					trainend: ''
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.rateList = data.bean.list;
						self.totalCount = data.bean.count;
					}
					self.usePage = false;
				}).catch(function (error) {
					self.loading = false;
					//console.log(error)
				})
			},

			/*分页区*/
			handleSizeChange(size) {
				this.pagesize = size;
				this.inittable(this.pageno, this.pagesize,
					this.isnewbaseid, this.isnewdepartment,
					this.queryForm.traincount, this.inputquery);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.isnewbaseid, this.isnewdepartment,
					this.queryForm.traincount, this.inputquery);
			},
			doInputQuery: function () { //搜索方法
				let self = this;
				self.queryForm.newbaseid = '';
				self.queryForm.newdepartment = '';
				self.queryForm.traincount = '';
				self.inittable(self.pageno, self.pagesize, '', '', '', self.inputquery);
			},
			doSelectQuery: function () {//查询方法
				let self = this;
				self.inittable(self.pageno, self.pagesize,
					self.queryForm.newbaseid,
					self.queryForm.newdepartment,
					self.queryForm.traincount, '')
			},
			handleSelectionChange: function () {//全选的方法
				//console.log();
			},
		}
	}
</script>

<style scoped>
	.doctorTrain-page {
		padding: 0 20px;
	}

	.wapper {
		padding: 0;
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
		margin-left: 5px;
	}
</style>