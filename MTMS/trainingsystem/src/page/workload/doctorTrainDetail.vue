<template>
	<div class="wapper">
		<div class="tools">
			<div class="funcTools">
				<el-button type="primary" @click="addresult">添加</el-button>
				<el-button type="primary" @click="dialogTableVisible=true">批量导入</el-button>
				<el-button type="primary" @click="is_export()">批量导出</el-button>
				<el-button type="primary" @click="batchdelete()">批量删除</el-button>
			</div>
		</div>

		<!--批量导入-->
		<el-dialog title="" :visible.sync="dialogTableVisible">
			<div class="import-popup">
				<div>
					<span class="tip-circle">1</span>
					<span>下载师资培训明细模板，批量填写师资培训信息</span>
					<!---->
					<el-button @click="dowloadstutemplate" type="primary" class="import-popup-btn">
						<!--<a target= _Blank :href = "dowloadurl">下载</a>-->下载
					</el-button>
					<span>
					</span>
				</div>
				<div>
					<div>
						<span class="tip-circle">2</span><span>上传填写好的师资培训明细表</span>
					</div>
					<div>
						<!--<el-upload class="upload-demo"
					action="/import/importExcel"
					:data="uploadData"
					:on-success="handleSuccess"
					:show-file-list="false">
		            <el-button type="primary">选择文件</el-button>
		        </el-upload>-->
						<el-upload style="display:inline-block;margin:10px 40px" action="/import/importExcel" ref="upload" :file-list="fileList"
						 :data="uploadData" :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile" :on-success="uploadSuccess"
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

		<div class="queryTools">
			<div class="queryAll">
				<el-button type="text" @click="queryAll">全部</el-button>
			</div>
			<el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
				<el-form-item label="基地">
					<el-select filterable v-model="queryForm.newbaseid" placeholder="请选择" @change="newbasechange">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="(item,index) in newroomList" :key="item.index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="科室">
					<el-select filterable v-model="queryForm.newdepartment" placeholder="请选择">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="(item,index) in newdeptList" :key="item.index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="培训日期" prop="" style="width: 350px;">
					<el-date-picker v-model="queryForm.startime" type="date" style="width: 130px;" placeholder="选择开始时间" format="yyyy-MM-dd" @change="gettime">
					</el-date-picker>
					-
					<el-date-picker v-model="queryForm.endtime" type="date" style="width: 130px;" placeholder="选择结束时间" format="yyyy-MM-dd" @change="getendtime">
					</el-date-picker>
					<!--<el-date-picker
			      v-model="queryForm.startime_endtime"
			      type="daterange"
			      placeholder="选择日期范围" format="yyyy-MM" @change="gettime">
			    </el-date-picker>-->
				</el-form-item>

				<el-form-item label="" style="align-content: 200px;">
					<el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入姓名或工号搜索" @keyup.enter.native="doSelectQuery"
					/>
				</el-form-item>

				<el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
			</el-form>
		</div>

		<!--弹窗-->
		<el-dialog :title="dialogTitle" :visible.sync="dialogAdd" :close-on-click-modal="false" @close="closeDialog('addStudentFormRef')"
		 class='dialogAdd'>
			<el-form :model="dialogForm" ref="addStudentFormRef" label-width="80px">
				<el-row :gutter="23">
					<el-col :span="12">
						<div class="newandedit">
							<label><span class="red">*</span>工号 : </label>
							<div>
								<el-select v-model="hospitalnumber" filterable remote placeholder="请输入工号搜索" :remote-method="queryteacherByworknum" @change="setName">
									<el-option v-for="(item,index) in teachnumlist" :key="item.index" :label="item.code" :value="item.id">
									</el-option>
								</el-select>
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="newandedit">
							<label><span class="red">*</span>姓名 : </label>
							<div>
								<el-input v-model="name" disabled></el-input>
							</div>
						</div>
					</el-col>
				</el-row>

				<el-row :gutter="22">
					<el-col :span="22">
						<div class="newandedit">
							<label><span class="red">*</span>培训日期 : </label>
							<div>
								<el-date-picker v-model="trainingdate" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getexamtime">
								</el-date-picker>
							</div>
						</div>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-button v-if="dialogshow == 1" @click="addsave" type="primary" class="bottomBtnsSure">保存</el-button>
					<el-button v-if="dialogshow == 2" @click="editsave" type="primary" class="bottomBtnsSure">保存</el-button>
					<el-button @click="dialogAdd = false" class="bottomBtns">取消</el-button>
				</el-row>

			</el-form>
		</el-dialog>

		<div class="dataTable">
			<el-table ref="detailTable" :data="rateList" border v-loading="loading" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="45"></el-table-column>
				<!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
				<el-table-column prop="uname" width="120" label="姓名">
					<template slot-scope="scope">
						<div class="actionplansty">
							<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.uname" placement="top">
								<el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.uname}}</el-button>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="username" width="100" label="工号"></el-table-column>
				<el-table-column prop="mobile" width="150" label="手机号码"></el-table-column>
				<el-table-column prop="techniquename" label="职称"></el-table-column>
				<el-table-column prop="resllist" min-width="200" label="科室">
					<template slot-scope="scope">
						<template v-for="item in scope.row.resllist">
							<span>{{item.deptname}}&nbsp;&nbsp;
								<!--<span v-if="scope.row.resllist.length > 1"></span>-->
							</span>
						</template>
					</template>
				</el-table-column>
				<el-table-column prop="traindatestr" label="培训日期"></el-table-column>
				<el-table-column fixed="right" width="120" label="操作">
					<template slot-scope="scope">
						<el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
						<el-button @click="singledelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
</template>
<script>
	import employeeInfo from "../../components/employeeInfo.vue"
	import { post, getCookie, setTitle, exportMouldExcel, exportExcel, getStorage } from '../../config/util'
	import { mapState, mapActions } from 'vuex'
	const _ = require('lodash');

	export default {
		props: {
			searchName: '',
		},
		data() {
			return {
				currentDataId: "", // 当前点击职工详情信息
				dialogEmployee: false, //职工详情弹窗
				//成绩导入
				Blank: '_Blank',
				dowloadurl: '',//获取下载模板的url和端口
				hasFile: false,
				dialogTableVisible: false,
				fileList: [],
				uploadData: {
					_upload_data: JSON.stringify({
						"1": {
							command: 'turntrain/importteachertrainedlist',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
						}
					})
				},

				//筛选
				allvalue: '',
				turnplanlist: [],//轮转计划数组

				queryForm: {
					startime: '',
					endtime: '',
					turnplanid: '',
					inputquery: '',
					newbaseid: '',
					newdepartment: ''
				},
				//弹窗
				dialogTitle: '',
				dialogAdd: false,
				teachnumlist: [],//工号列表
				hospitalnumber: '',//住培学号
				name: '',		//姓名
				trainingdate: '',
				editid: '',
				dialogForm: {		//知道

				},
				dialogshow: '',//1增加；2编辑
				editturnplanid: '',//编辑提交的轮转计划id
				turnplanflag: true,
				//全部
				newroomList: [],
				newdeptList: [],
				newareaList: [],

				rateList: [],
				pageno: 1,
				pagesize: 10,
				totalCount: 0,
				deletelist: [],
				usePage: false,
				exportOptions: {},
				loading: false,
				menuId: ""
			}
		},
		computed: {
		},
		mounted() {
			// this.gethospitaltree();
			this.menuId = getStorage("menuId")
			this.getNewTree()
		},
		components: {
			employeeInfo
		},
		watch: {
			searchName(newVal, oldVal) {
				this.queryForm.inputquery = newVal
				this.doSelectQuery();

			},
		},
		methods: {
			getNewTree() {
				let self = this;
				post("/base/dept/getMyHosBaseDeptTree", {
					menusId: this.menuId
				}).then(res => {
					let arr = [];
					res.model.forEach(i => {
						arr.push(...i.childrens)
					})
					self.newroomList = arr
				});
			},
			employeeDetail(index, row) {
				this.dialogEmployee = true
				this.currentDataId = row.uid;
			},
			dowloadstutemplate: function () {
				window.open('/file/download2?file=http://' + window.location.host + '/static/excel/training-for-teacher.xls');
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
						self.inittable(self.pageno, self.pagesize, '', '', '', '', '');

					}
				}).catch(function (error) {
					//console.log(error)
				})
			},
			newbasechange: function () {		//权限下的科室
				let self = this;
				self.queryForm.newdepartment = '';
				self.queryForm.newarea = '';
				self.newdeptList = [];
				self.newareaList = [];
				self.newroomList.map(function (index, item) {
					if (self.queryForm.newbaseid == item.id) {
						self.newdeptList = item.childrens
					}
				})
			},
			gettime: function (date) {			//选取时间段
				let self = this;
				self.time = date;
				self.queryForm.startime = this.time;
			},
			getendtime: function (date) {
				let self = this;
				self.time = date;
				self.queryForm.endtime = this.time;
			},
			getexamtime: function (date) {		//考试时间
				let self = this;
				self.time = date;
				self.trainingdate = this.time;
			},

			submitUpload() {				//导入
				if (!this.hasFile) {
					this.$message({
						showClose: true,
						message: '请先选择上传的Excel文件！',
						type: 'warning'
					});
				}
				this.$refs.upload.submit();
			},
			downloadModel: function () {		//下载导入模板
				//这个是静态模板     地址   misrobot-service\src\main\webapp\static\excel\师资培训管理导入模板.xls
				let data = {
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					command: "turnannualresult/turnannualscoremould",
				};
				exportMouldExcel(data);
			},
			changeFile(file, list) {		//文件状态改变
				if (list.length > 1) {
					list.shift();
				}
				if (list.length > 0) {
					this.hasFile = true;
				}
			},
			submitUpload() {						//上传按钮
				if (!this.hasFile) {
					this.$message({
						showClose: true,
						message: '请先选择上传的Excel文件！',
						type: 'warning'
					});
				}
				this.$refs.upload.submit();
			},
			checkFile(file) {			//上传文件之前 限制文件类型
				const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';

				if (!isExcel) {
					this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
				}
				this.hasFile = false;
				return isExcel;
			},
			uploadSuccess(res) {					//上传成功
				if (res.errcode == 0) {
					this.$message({
						type: 'success',
						message: '上传成功'
					});
				} else if (res.errcode == 9903) {
					const h = this.$createElement;
					if (res.errorlist[0].errorlist[0].code == '4023') {
						this.$message.error('请上传正确模板!!!');
					} else {
						let messgelist = [];
						res.errorlist[0].errorlist.map(function (index, item) {
							messgelist.push(item.message)
						});
						this.$msgbox({
							title: '错误提示',
							message: h('p', null, [
								h('span', null, res.errorlist[0].linenum),
								h('span', null, messgelist)
							]),
							type: 'error',
							confirmButtonText: '确定',
						});
					};
				} else {

				}
				this.$refs.upload.clearFiles();
				this.dialogTableVisible = false;
				this.hasFile = false;
				this.$loading().close();
			},
			onProgress() {			//文件上传时-显示进度条
				this.$loading();
			},
			is_export: function () {			//导出
				let self = this;
				let data = {
					command: 'turntrain/queryturndoctortrainlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					...self.exportOptions
				}
				console.log(data)
				exportExcel(data);
			},


			addresult: function () {			//增加成绩
				let self = this;
				self.dialogAdd = true;
				self.turnplanflag = true;
				self.dialogTitle = '添加';
				self.dialogshow = 1;
				self.hospitalnumber = '';
				self.name = '';
				self.trainingdate = '';//培训日期

				self.teachnumlist = [];
			},
			queryteacherByworknum(query) {		//学号改变  查询学号列表
				let self = this;
				if (query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						post('/cls/queryteacher', {
							command: 'cls/queryteacher',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
							searchinfo: query//self.hospitalnumber,
						}).then(function (data) {
							if (data && data.errcode == 0) {
								self.teachnumlist = data.teacherlist;
								if (self.turnplanflag == false) {
									self.nameid = data.teacherlist[0].id
								}
							}
						})
					}, 200);
				};
			},
			setName(val) {
				this.teachnumlist.forEach((item) => {
					if (item.id === val) {
						this.name = item.name;
						this.nameid = item.id;
					}
				})
			},
			closeDialog(formName) {
				this.$refs[formName].resetFields();
			},
			addsave: function () {				//增加保存按钮
				let self = this;
				if (self.name == '' || self.name == '查无此人') {
					self.$message({
						message: '请输入正确的学号！！',
						type: 'warning'
					});
				} else if (self.trainingdate == '' || !self.trainingdate) {
					self.$message({
						message: '请选择培训日期！！',
						type: 'warning'
					});
				} else {
					post('/turntrain/addturndoctortrain', {
						command: 'turntrain/addturndoctortrain',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						uid: self.nameid,
						traindate: self.trainingdate
					}).then(function (data) {
						if (data && data.errcode == 0) {
							self.$message({
								message: '添加成功',
								type: 'success'
							});
							self.inittable(self.pageno, self.pagesize, '', '', '', '', '');
							self.dialogAdd = false;
						} else if (data && data.errcode == 400201) {
							self.$message({
								message: '只有老师能够录入师资培训信息!',
								type: 'success'
							});
						} else if (data && data.errcode == 400202) {
							self.$message({
								message: '培训日期不能大于当前日期!',
								type: 'success'
							});
						} else if (data && data.errcode == 400203) {
							self.$message({
								message: '录入用户在此培训日期已有培训记录!',
								type: 'success'
							});
						} else {
							self.$message({
								message: data.errdesc,
								type: 'warning'
							});
						}
					}).catch(function (error) {
						//console.log(error)
					})
				}
			},

			queryAll: function () {
				let self = this;
				self.queryForm.newdepartment = '';
				self.queryForm.newbaseid = '';
				self.queryForm.startime = '';
				self.queryForm.endtime = '';
				self.queryForm.inputquery = '';
				self.inittable(this.pageno, this.pagesize, '', '', '', '', '');
			},
			inittable: function (pageno, pagesize, base, docoroffcie, startime, endtime, inputquery) {
				let self = this;

				if (this.usePage) {
					pageno = this.pageno;
				} else {
					pageno = this.pageno = 1;
				}
				self.exportOptions = {
					baseid: base,
					officeid: docoroffcie,
					trainbegin: startime,
					trainend: endtime,
					nameorusername: inputquery
				}
				self.loading = true;
				post('/turntrain/queryturndoctortrainlist', {
					command: 'turntrain/queryturndoctortrainlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					page: pageno,
					reqnum: pagesize,
					baseid: base,
					officeid: docoroffcie,
					trainbegin: startime,
					trainend: endtime,
					nameorusername: inputquery
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.rateList = data.list;
						self.totalCount = data.count;
					}
					self.usePage = false;
				}).catch(function (error) {
					self.loading = false;
					//console.log(error)
				})
			},

			/*编辑区*/
			edit: function (index, row) {
				let self = this;
				self.dialogAdd = true;
				self.hospitalnumber = '';
				self.turnplanflag = false;
				self.dialogTitle = '编辑';
				self.dialogshow = 2;

				post('/turntrain/getturndoctortrainbyId', {
					command: 'turntrain/getturndoctortrainbyId',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					id: row.id,
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.editid = data.bean.id;		//编辑id
						self.hospitalnumber = data.bean.username;		//工号
						self.name = data.bean.uname;				//姓名
						self.trainingdate = data.bean.traindatestr
						let a = data.bean.username;
						self.queryteacherByworknum(a);	//查询工号
					}
				}).catch(function (error) {
					//console.log(error)
				})

			},

			editsave: function () {
				let self = this;
				if (self.name == '' || self.name == '查无此人') {
					self.$message({
						message: '请输入正确的学号！！',
						type: 'warning'
					});
				} else if (self.trainingdate == '' || !self.trainingdate) {
					self.$message({
						message: '请选择培训日期！！',
						type: 'warning'
					});
				} else {
					post('/turntrain/updateturndoctortrain', {
						command: 'turntrain/updateturndoctortrain',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						id: self.editid,
						uid: self.nameid,
						traindate: self.trainingdate,
					}).then(function (data) {
						if (data && data.errcode == 0) {
							self.$message({
								message: '编辑成功',
								type: 'success'
							});
							self.usePage = true;
							self.inittable(self.pageno, self.pagesize, '', '', '', '', '');
							self.dialogAdd = false;
						} else if (data && data.errcode == 400201) {
							self.$message({
								message: '只有老师能够录入师资培训信息!',
								type: 'success'
							});
						} else if (data && data.errcode == 400202) {
							self.$message({
								message: '培训日期不能大于当前日期!',
								type: 'success'
							});
						} else if (data && data.errcode == 400203) {
							self.$message({
								message: '录入用户在此培训日期已有培训记录!',
								type: 'success'
							});
						} else {
							self.$message({
								message: data.errdesc,
								type: 'warning'
							});
						}
					}).catch(function (error) {
						//console.log(error)
					})


				}
			},

			/*分页区*/
			handleSizeChange(size) {
				this.pagesize = size;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid,
					this.queryForm.newdepartment,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery);
			},
			handleCurrentChange(currentPage) {
				this.pageno = currentPage;
				this.usePage = true;
				this.inittable(this.pageno, this.pagesize,
					this.queryForm.newbaseid,
					this.queryForm.newdepartment,
					this.queryForm.startime, this.queryForm.endtime,
					this.queryForm.inputquery);
			},
			doSelectQuery: function () {//查询方法
				let self = this;
				self.inittable(self.pageno, self.pagesize,
					self.queryForm.newbaseid,
					self.queryForm.newdepartment,
					self.queryForm.startime, self.queryForm.endtime,
					self.queryForm.inputquery)
			},
			singledelete: function (index, row, batch) {	//单个删除
				let self = this;
				let _turnscoreid = [];
				_turnscoreid.push(row.id);
				self.$confirm('确定删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					post('/turntrain/deleteturndoctortrain', {
						command: 'turntrain/deleteturndoctortrain',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						idlist: _turnscoreid,	//成绩id
					}).then(function (data) {
						if (data && data.errcode == 0) {
							self.$message({
								message: '删除成功',
								type: 'success'
							});
							self.inittable(self.pageno, self.pagesize, '', '', '', '', '')
						}
					}).catch(function (error) {
						//console.log(error)
					})
				}).catch(() => {
					self.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			handleSelectionChange: function (item) {//全选的方法
				let self = this;	//0未开始1进行中2已结束
				self.deletelist = [];
				for (let i = 0; i < item.length; i++) {
					self.deletelist.push(item[i].id)
				}
			},
			batchdelete: function () {		//批量删除
				let self = this;
				if (self.deletelist.length == 0) {
					self.$message({
						showClose: true,
						message: '请先勾选多项需要删除的数据！',
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
					self.$confirm('确定批量删除数据吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						post('/turntrain/deleteturndoctortrain', {
							command: 'turntrain/deleteturndoctortrain',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
							idlist: self.deletelist,	//成绩id
						}).then(function (data) {
							if (data && data.errcode == 0) {
								self.$message({
									message: '删除成功',
									type: 'success'
								});
								self.inittable(self.pageno, self.pagesize, '', '', '', '', '')
							}
						}).catch(function (error) {
							//console.log(error)
						})
					}).catch(() => {
						self.$message({
							type: 'info',
							message: '已取消删除'
						});
					});

				}
			}
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

	.import-popup-btn a {
		color: #fff;
	}

	.right {
		margin-left: 10px;
	}

	.elRowStyle {
		overflow-x: hidden;
	}

	.upload-demo {
		display: inline-block;
		margin: 0px 15px;
	}

	/*弹窗内容样式*/
	.red {
		color: red;
	}

	.newandedit {
		margin: 8px 0px;
	}

	.newandedit .row {
		display: flex;
		margin-top: 10px;
	}

	.newandedit label {
		width: 85px;
		text-align: right;
		display: inline-block;
	}

	.newandedit>.el-input {
		display: inline-block;
	}

	.newandedit>div>.el-select {
		width: 192px;
	}

	.newandedit>div {
		display: inline-block;
	}

	.row label {
		flex: 3;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.row>div {
		flex: 7;
	}

	.bottomBtnsSure {
		margin-left: 69%;
	}

	.querybtn {
		margin-left: 20px;
		display: inline-block;
	}
</style>