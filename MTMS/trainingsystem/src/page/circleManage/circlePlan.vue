<template>
	<div class="wapper circlePlanSelf">
		<div>
			<div class="page-tools">
				<el-button type="primary" @click="openDialogAdd" v-if="roleAuthority['addCircelPlan']">新增计划</el-button>
				<el-button type="primary" @click="delPlans" v-if="roleAuthority['deleteCircelPlan']">批量删除</el-button>
				<el-button type="primary" @click="downloadModel" v-if="roleAuthority['downloadStudentTemplete']">下载学员模板</el-button>
			</div>
			<div class="tools">
				<div class="inline-first">进度</div>
				<div class="inline-second">
					<el-select filterable v-model="selectYear" placeholder="请选择" @change="changeQuery">
						<el-option v-for="item in progress" :key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- 全屏loading dialog -->
			<el-dialog title="" :visible.sync="trainingTurnLoading" :close-on-click-modal="false" :show-close="false">
				<div class="loading-box">
					<div v-loading.body="trainingTurnLoading"></div>
					<div class="tranining-turn-tip">
						<div>系统正在处理，请耐心等待</div>
						<el-button type="primary" @click="cancelTrunLoading">取消</el-button>
					</div>
				</div>
			</el-dialog>
			<!--智能排计划弹框-->
			<el-dialog :visible.sync="trainingTurn.visible" :title="trainingTurn.title" :close-on-click-modal="false" @close="cancel('trainingturnform')"
			 class="tarinninPlan">
				<div class="plan-box">
					<el-form ref="trainingturnform" :rules="trainingturnrules" :model="trainingTurn" style="width: 80%;margin:0 auto;">
						<el-form-item label="引用规则:" label-width="120px" prop="rule">
							<el-select v-model="trainingTurn.rule" size="small" required style="width: 100%">
								<el-option v-for="item in roationRulesList" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="选择学员:" label-width="120px" required>
							<el-col :span="10">
								<el-form-item label="年级" prop="std">
									<el-select v-model="trainingTurn.std" size="small" style="width: 60%">
										<el-option v-for="item in gradlist" :key="item.key" :label="item.name" :value="item.key">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="14">
								<el-form-item label="专业基地">
									<el-select v-model="trainingTurn.base" size="small" style="width: 60%">
										<el-option label="全部" value=""></el-option>
										<el-option v-for="item in baseidList" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
									<!-- <select-tree :hosBase="hosBase" @updateDept="updateDept" :single="single" :clearAll="rightNowClear"></select-tree> -->
								</el-form-item>
							</el-col>
						</el-form-item>
						<el-form-item label="开始轮转时间:" prop="turntime" label-width="120px">
							<el-date-picker v-model="trainingTurn.turntime" type="date" placeholder="选择日期" style="width: 100%;" :picker-options="pickerOptions0">
							</el-date-picker>
						</el-form-item>
						<el-form-item align="right">
							<el-button @click.stop="cancel('trainingturnform')">取消</el-button>
							<el-button type="primary" @click.stop="saveIntelligent" :class="{noclick:issubmit}" v-loading="btnloading">确定</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-dialog>
			<div class="show-data">
				<el-table ref="multipleTable" :data="planDatas" border tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" fixed="left"></el-table-column>
					<!--<el-table-column type ="index" label ="序号" width = "65" ></el-table-column>-->
					<el-table-column prop="turnplanname" label="轮转计划名称" min-width="230" align="center">
						<template slot-scope="scope">
							<div class="actionplansty">
								<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turnplanname" placement="top">
									<span>
										{{scope.row.turnplanname}}
									</span>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="comment" label="轮转计划描述" min-width="230" align="center">
						<template slot-scope="scope">
							<div class="actionplansty">
								<el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.comment" placement="top">
									<span>
										{{scope.row.comment}}
									</span>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="begintime" width="95" label="开始时间" align="center"></el-table-column>
					<el-table-column prop="endtime" width="95" label="结束时间" align="center"></el-table-column>
					<el-table-column prop="period" label="年级" align="center"></el-table-column>
					<el-table-column prop="progress" label="进度" align="center"></el-table-column>
					<el-table-column label="操作" min-width="350" fixed="right" align="center">
						<template slot-scope="scope">
							<el-button @click="scheduling(scope.$index, scope.row)" v-if="roleAuthority['intelligenceCirclePlan']" type="text" size="small"
							 style="margin:0;">智能排计划</el-button>
							<el-button @click="importStu(scope.$index, scope.row)" v-if="roleAuthority['importStudentForCircle']" type="text" size="small"
							 style="margin:0;">导入学员</el-button>
							<el-button @click="editPlan(scope.$index, scope.row)" v-if="roleAuthority['editCirclePlan']" type="text" size="small">编辑计划</el-button>
							<el-button @click="delPlan(scope.$index, scope.row)" v-if="roleAuthority['deleteCirclePlan']" type="text" size="small">删除计划</el-button>
							<el-button @click="openBaseManger(scope.$index, scope.row)" v-if="roleAuthority['openBaseManger'] && !scope.row.isBaseDoctorEdit"
							 type="text" size="small">开启基地调整</el-button>
							<el-button @click="openBaseManger(scope.$index, scope.row)" v-if="roleAuthority['openBaseManger'] && scope.row.isBaseDoctorEdit"
							 type="text" size="small">关闭基地调整</el-button>
							<el-button @click="showDetail(scope.$index, scope.row)" v-if="roleAuthority['checkCirclePlanDetail']" type="text" size="small">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				 :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagepersize" layout="total, sizes, prev, pager, next, jumper"
				 :total="totalCount">
				</el-pagination>
			</div>
			<!-- xinzong tankuang -->
			<el-dialog :title="dialogTitle" :visible.sync="dialogAddPlan" :close-on-click-modal="false" @close="closeDialog('addPlanForm')">
				<el-form :model="addPlanForm" :rules="rules" ref="addPlanForm" label-width="80px">
					<el-form-item label="计划名称" prop="turnplanname">
						<el-input style="width:400px" v-model="addPlanForm.turnplanname"></el-input>
					</el-form-item>
					<el-form-item label="年级" prop="period">
						<el-input style="width:400px" v-model="addPlanForm.period"></el-input>
					</el-form-item>
					<el-row>
						<el-col :span="11">
							<el-form-item label="开始时间" prop="begintime">
								<el-date-picker v-model="addPlanForm.begintime" type="date" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="2">&nbsp</el-col>
						<el-col :span="11">
							<el-form-item label="结束时间" prop="endtime">
								<el-date-picker v-model="addPlanForm.endtime" type="date" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="计划描述" prop="comment">
						<el-input type="textarea" :rows="4" v-model="addPlanForm.comment"></el-input>
					</el-form-item>
					<el-row type="flex" justify="center">
						<el-button type="primary" @click="handleSubmitAdd('addPlanForm')" class="bottomBtnsSure" style="margin-left:0;">保存</el-button>
						<el-button @click="dialogAddPlan=false" class="bottomBtns">取消</el-button>
					</el-row>
				</el-form>
			</el-dialog>
			<!-- wenjian shangcchan-->
			<el-dialog title="导入学员" :visible.sync="dialogImportStu" size="tiny" :close-on-click-modal="false">
				<el-upload class="upload-demo" style="display:inline-block;margin-right:10px" action="/service-pub/import/importExcel" ref="upload"
				 :file-list="fileList" :data="uploadData" :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile"
				 :on-success="uploadSuccess" :on-progress="onProgress">
					<el-button type="primary" size="small">选择文件</el-button>
				</el-upload>
				<el-button type="primary" size="small" @click="submitImport">上传</el-button>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import moment from 'moment'
	import { post, get, getCookie, exportMouldExcel, showErrorImport } from '../../config/util';
	import { mapActions, mapState } from 'vuex'
	import selectTree from "../../components/selectTree.vue"
	var _ = require('lodash');
	export default {
		data() {
			var checkDate1 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入开始日期'));
				} else {

					if (this.addPlanForm.endtime !== '') {
						this.$refs.addPlanForm.validateField('endtime');
					}
					callback();
				}
			};
			var checkDate2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入结束日期'));
				} else {
					if (moment(this.addPlanForm.begintime).isAfter(this.addPlanForm.endtime)) {
						callback(new Error('结束日期不能小于开始日期！'));
					}
					callback();
				}
			};
			var currentPlanId = () => {
				return this.currentPlanId;

			};
			var validateBlank = (rule, value, callback) => {
				if (value === '' || value.trim() === '') {
					callback(new Error('请输入计划名称！'));
				} else {
					callback()
				}
			};
			var validatePeriod = (rule, value, callback) => {
				if (value === '' || value.trim() === '') {
					callback(new Error('请输入年级！'));
				} else {
					callback()
				}
			}
			return {
				openType: 1,
				rightNowClear: "",
				single: "",
				hosBase: true,
				baseidList: [], // 基地
				gradlist: [], // 年级
				/* start */
				roationRulesList: '', // 轮转规则列表
				turnPlanId: '', // 轮转计划ID
				startTime: '', // 轮转计划开始时间
				endTime: '', // 轮转计划结束时间
				issubmit: false,
				trainingTurnLoading: false, // loading 
				trainingTurn: {
					visible: false,
					title: '智能排计划',
					rule: '',
					std: '',
					base: '',
					turntime: '',
					turnplanname: ""
				},
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				trainingturnrules: {
					rule: [{ required: 'true', message: "引用计划不能为空" }],
					std: [{ required: 'true', message: "学员不能为空" }],
					base: [{ required: 'true', message: "专业基地不能为空" }],
					turntime: [{ required: 'true', message: "开始轮转时间不能为空" }],

				},
				// 智能排轮转结果弹窗

				/* end */
				loading: false,
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				dialogTitle: '',
				selectYear: '全部',
				progress: [{ name: '全部', value: '-1' }, { name: '未开始', value: '0' }, { name: '进行中', value: '1' }, { name: '已结束', value: '2' },],
				dialogAddPlan: false,
				dialogImportStu: false,
				fileList: [],
				planDatas: [],
				btnloading: false,
				addPlanForm: {
					turnplanname: '',
					comment: '',
					begintime: '',
					endtime: '',
					period: ''
				},
				rules: {
					turnplanname: [
						// { required: true, message: '请输入计划名称', trigger: 'blur' },
						{ required: true, validator: validateBlank, trigger: 'blur' },
						{ max: 100, message: '长度必须小于100个字符', trigger: 'blur' }

					],
					period: [
						// { required: true, message: '请输入年级', trigger: 'blur' },
						{ required: true, validator: validatePeriod, trigger: 'blur' },
						{ max: 20, message: '长度必须小于20个字符', trigger: 'blur' }

					],
					begintime: [
						{ required: true, validator: checkDate1, trigger: 'blur' },
					],
					endtime: [
						{ required: true, validator: checkDate2, trigger: 'blur' },
					],
					comment: [
						{ max: 500, message: '长度必须小于500个字符', trigger: 'blur' }
					]
				},
				hasFile: false,
				selectItems: [],
				currentPlanId: '',
				pagenum: 1,
				pagepersize: 10,
				totalCount: 0,
				changeProgress: -1,
				usePage: false,
				Loop: '',
			}
		},
		components: {
			selectTree
		},
		computed: {
			...mapState([
				"roleAuthority"
			]),
			uploadData() {
				let planId = this.currentPlanId;
				return {
					_upload_data: JSON.stringify({
						"1": {
							command: 'turn/importturnplandetail',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
							planId: planId,
						}
					})
				}
			}
		},
		methods: {
			...mapActions(['getRoleAuthority']),
			openBaseManger(index, row) {
				let tips = ""
				let title = ""
				if (row.isBaseDoctorEdit) {
					//要关闭
					tips = "关闭后，基地秘书不可再调整管辖基地的轮转计划，确认关闭吗？"
					title = "关闭确认"
				}
				if (!row.isBaseDoctorEdit) {
					// 要开启
					tips = "开启后，基地秘书可以调整管辖基地的轮转计划，确认开启吗？"
					title = "开启确认"
				}
				this.$confirm(tips, title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					post("/base/turnplan/changeBaseDoctorEdit", {
						id: row.turnplanid,
						isBaseDoctorEdit: row.isBaseDoctorEdit ? 0 : 1
					}).then(res => {
						if (res && res.resCode == 200) {
							this.$message({
								type: 'success',
								message: '修改基地调整状态成功!'
							});
							this.queryCircleList({})
						} else {
							this.$message({
								type: 'warning',
								message: '修改基地调整状态失败'
							});
						}
					})

				}).catch(() => {
					this.$message({
						type: 'warning',
						message: '修改基地调整状态失败'
					});
				});
			},
			updateDept({ selectDeptIds }) {
				this.trainingTurn.base = selectDeptIds[0]
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
			//基地
			getbaseidList() {
				// upodate===============================
				get(`/base/dept/listBase`).then(res => {
					if (res.resCode == 200) {
						this.baseidList = res.rows
					}
				})
				// let self = this;
				// post('/turnbaseinfo/getusermanagerdepttree', {
				// 	command: 'turnbaseinfo/getusermanagerdepttree',
				// 	sessionid: getCookie('sid'),
				// 	loginid: getCookie('uid'),
				// 	uid: getCookie('uid'),
				// }).then(function (data) {
				// 	if (data && data.errcode == 0) {
				// 		let treeidlist = data.depttree.childlist
				// 		treeidlist.map(function (item, index) {
				// 			self.baseidList.push(item)
				// 		})
				// 	}
				// }).catch(function (error) {
				// 	//console.log(error)
				// })
			},
			// 轮转规则列表
			roationsRulesList() {
				var self = this;
				post('/turnrule/list', {
					command: 'turnrule/list',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
				}).then(function (data) {
					if (data && data.errcode == 0) {
						self.roationRulesList = data.list;
					}
				}).catch(function () {
				});
			},

			cancel(formName) {
				this.trainingTurn.visible = false;
				try {
					this.$refs[formName].resetFields();
				} catch (e) {

				}
			},

			// 开始排轮转计划
			saveIntelligent() {
				this.$refs['trainingturnform'].validate(valid => {
					if (valid) {
						this.issubmit = true;
						this.btnloading = true;
						this.trainingTurnLoading = true;
						let time = moment(this.trainingTurn.turntime).format('YYYY-MM-DD');
						post('/turn/arrange', {
							command: 'turn/arrange',
							sessionid: getCookie('sid'),
							loginid: getCookie('uid'),
							begindate: time,
							turngrade: this.trainingTurn.std,
							baseid: this.trainingTurn.base,
							ruleid: this.trainingTurn.rule,
							planid: this.turnPlanId
						}).then((data) => {
							this.issubmit = false;
							this.btnloading = false;
							if (data && data.errcode == 0) {
								this.trainingTurnLoading = false;
								this.trainingTurn.visible = false
							} else {
								this.trainingTurnLoading = false;
								this.$message({
									type: 'warning',
									message: data.errdesc
								})
							}
						}).catch(function () {
							this.$message({
								type: 'warning',
								message: '服务器错误'
							})
						});
					}
				})
				//延迟一分钟查询排计划结果
				setTimeout(() => {
					clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
					this.Loop = setInterval(() => {
						this.queryRoationPlan();
					}, 1000 * 5);
				}, 60000)

			},
			scheduling(index, row) {
				this.turnPlanId = row.turnplanid;
				this.startTime = row.begintime,
					this.endTime = row.endtime;
				this.trainingTurn.visible = true;
				this.turnplanname = row.turnplanname;
				this.trainingTurn.base = ""
				this.rightNowClear = this.rightNowClear + 1
			},

			cancelTrunLoading() {
				clearInterval(this.Loop);
				this.trainingTurnLoading = false;
			},
			// 查询拍轮转计划的状态值, 失败, 成功, 正在排序中
			queryRoationPlan() {
				let time = moment(this.trainingTurn.turntime).format('YYYY-MM-DD');
				post('/turn/getarrangestatus', {
					command: 'turn/getarrangestatus',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					begindate: time,
					turngrade: this.trainingTurn.std,
					baseid: this.trainingTurn.base,
					ruleid: this.trainingTurn.rule,
					planid: this.turnPlanId
				}).then((data) => {
					if (data && data.errcode == 0) {
						if (data.result == 0) {
							// 成功
							this.trainingTurnLoading = false;
							clearInterval(this.Loop);
							this.$router.push({
								path: '/circlePlan/intelligentPreview',
								query: {
									planid: this.turnPlanId,
									startTime: this.startTime,
									endTime: this.endTime,
									ruleid: this.trainingTurn.rule,
									turngrade: this.trainingTurn.std,
									baseid: this.trainingTurn.base,
									turnplanname: this.turnplanname
								}
							})

						} else if (data.result == 1) {
							this.trainingTurnLoading = false;

						} else if (data.result == 2) {
							// 失败
							this.trainingTurnLoading = false;
							clearInterval(this.Loop);
							this.$message({
								type: 'warning',
								message: '失败'
							})
						}
					}
				}).catch((err) => {
					this.$message({
						type: 'warning',
						message: data.errdesc
					})
				});
			},

			openDialogAdd() {
				this.addPlanForm = {
					turnplanname: '',
					comment: '',
					begintime: '',
					endtime: '',
					period: ''
				};
				this.dialogTitle = '新增计划';
				this.dialogAddPlan = true;
			},
			delPlans() {
				var self = this;
				if (this.selectItems.length === 0) {
					this.$message({
						showClose: true,
						message: '请先勾选删除项！',
						type: 'warning'
					});
					return;
				}
				this.$confirm('是否要删除选中的计划?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					post('/turnplan/deleteturnplan', {
						command: 'turnplan/deleteturnplan',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						turnplanidlist: this.selectItems
					}).then((data) => {
						if (data && data.errcode == 0) {
							self.$message({
								type: 'success',
								message: '删除成功!'
							});
							self.queryCircleList({});
						} else if (data.errcode == '1901') {
							self.$message.error('删除的计划已有学生轮转，若确定删除计划，请先将学生从计划中删除！');
						} else {
							self.$message.error('删除失败！');
						}
					}).catch(function () {
						self.$message.error('删除失败！');
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			downloadModel() {
				let data = {
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),

					command: "turn/turnPlanTempData",
				};
				exportMouldExcel(data);
			},

			changeQuery(val) {
				let opt = {};
				this.changeProgress = val;
				if (val != -1) {
					opt.progress = val;
					``
				}
				this.queryCircleList(opt);
			},
			importStu(index, row) {
				if (row.progress == '已结束') {
					this.$message({
						type: 'warning',
						message: '该轮转计划方案已结束，不能导入学员'
					});
					return;
				}
				this.currentPlanId = row.turnplanid;
				this.dialogImportStu = true;
			},
			changeFile(file, list) {

				if (list.length > 1) {
					list.shift();
				}
				if (list.length > 0) {
					this.hasFile = true;
				}

			},
			submitImport() {
				if (!this.hasFile) {
					this.$message({
						showClose: true,
						message: '请先选择上传的Excel文件！',
						type: 'warning'
					});
				}
				this.$refs.upload.submit();
			},
			checkFile(file) {
				const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';

				if (!isExcel) {
					this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
				}
				this.hasFile = false;
				return isExcel;
			},
			uploadSuccess(res) {
				res = res || res[1]
				console.log(res, "上传结果")
				//上传失败
				console.log(res, "-----")
				if (res.errcode == 0) {
					this.$message({
						type: 'success',
						message: '上传成功'
					});
				} else if (res.errcode == 9903) {
					showErrorImport(res.errorlist)
				} else {
					this.$message({
						type: 'warning',
						message: res.errdesc || "上传失败！"
					});
				}
				this.$refs.upload.clearFiles();
				this.dialogImportStu = false;
				this.hasFile = false;
				this.$loading().close();
			},
			createElement(list) {
				const h = this.$createElement;
				let res = [];
				let line = [];
				list.forEach((item, index) => {
					for (var key in item) {
						item[key].forEach((item1) => {
							for (let key1 in item1) {
								if (key1 == 4008) {
									line.push(item1[key1] + '轮转时间重叠');
								} else if (key1 == 4007) {
									line.push(item1[key1] + '轮转时间超过计划时间')
								} else if (key1 == 4009) {
									line.push(item1[key1])
								} else if (key1 == 2704) {
									line.push(item1[key1])
								} else if (key1 == 3100) {
									line.push(item1[key1])
								} else if (key1 == 4004) {
									line.push(item1[key1])
								}
							}
						})
					}
					res.push(h('p', null, index + 1 + '.序号为' + key + ':' + line.join(';')));
					line = [];
				});
				return res;
			},
			onProgress() {
				this.$loading();
			},
			editPlan(index, data) {
				this.dialogTitle = '编辑计划';
				this.dialogAddPlan = true;
				this.addPlanForm = { ...data };
			},
			delPlan(index, row) {
				let self = this
				this.selectItems = []
				this.selectItems.push(row.turnplanid)
				this.$confirm('是否要删除该条计划?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					post('/turnplan/deleteturnplan', {
						command: 'turnplan/deleteturnplan',
						sessionid: getCookie('sid'),
						loginid: getCookie('uid'),
						turnplanidlist: this.selectItems
					}).then((data) => {
						if (data && data.errcode == 0) {
							self.$message({
								type: 'success',
								message: '删除成功!'
							});
							self.queryCircleList({});
						} else if (data.errcode == '1901') {
							self.$message.error('删除的计划已有学生轮转，若确定删除该计划，请先将学生从计划中删除！');
						} else {
							self.$message.error('删除失败！');
						}
					}).catch(function () {
						self.$message.error('删除失败！');
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			showDetail(index, row) {
				this.$router.push({
					name: 'CirclePlanDetail',
					params: { plan_id: row.turnplanid, process: row.process },
					query: { begintime: row.begintime, endtime: row.endtime, turnplanname: row.turnplanname }
				});
			},

			handleSelectionChange(r) {
				this.selectItems = r.map((i) => i.turnplanid);
			},
			handleSubmitAdd(formName) {
				this.addPlanForm.turnplanname = this.addPlanForm.turnplanname.trim()
				this.addPlanForm.period = this.addPlanForm.period.trim()
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let self = this;
						let begintime = moment(this.addPlanForm.begintime).format('YYYY-MM-DD');
						let endtime = moment(this.addPlanForm.endtime).format('YYYY-MM-DD');
						if (this.addPlanForm.turnplanid) {
							post('/turnplan/updateturnplan', {
								command: 'turnplan/updateturnplan',
								sessionid: getCookie('sid'),
								loginid: getCookie('uid'),
								turnplanname: this.addPlanForm.turnplanname,
								period: this.addPlanForm.period,
								begintime: begintime,
								endtime: endtime,
								comment: this.addPlanForm.comment,
								turnplanid: this.addPlanForm.turnplanid
							}).then(function (data) {
								if (data && data.errcode == 0) {
									self.dialogAddPlan = false;
									self.$message({
										type: 'success',
										message: '编辑成功!'
									});
									self.usePage = true;
									self.queryCircleList({});
								} else if (data && data.errcode == 1901) {
									self.$message.error(data.errdesc);
								} else if (data && data.errcode == 4007) {
									self.$message.error(data.errdesc);
								} else if (data && data.errcode == 4004) {
									self.$message.error('轮转计划中已有学生在轮转，不能修改开始时间！');
								}
								else {
									self.$message.error('编辑失败！');
								}
							}).catch(function () {
								self.$message.error('编辑失败！');
							});
						} else {
							post('/turnplan/addturnplan', {
								command: 'turnplan/addturnplan',
								sessionid: getCookie('sid'),
								loginid: getCookie('uid'),
								turnplanname: this.addPlanForm.turnplanname,
								period: this.addPlanForm.period,
								begintime: begintime,
								endtime: endtime,
								comment: this.addPlanForm.comment
							}).then(function (data) {
								if (data && data.errcode == 0) {
									self.dialogAddPlan = false;
									self.$message({
										type: 'success',
										message: '新增成功!'
									});
									self.queryCircleList({});
								} else if (data && data.errcode == 1901) {
									self.$message.error(data.errdesc);
								} else {
									self.$message.error('新增失败！');
								}
							}).catch(function () {
								self.$message.error('新增失败！');
							});
						}
					} else {
						//console.log('error submit!!');
						return false;
					}
				});




			},
			closeDialog(formName) {
				this.$refs[formName].resetFields();
			},
			handleCancel() {
				this.dialogAddPlan = false;
			},
			handleSizeChange(size) {
				this.pagepersize = size;
				this.queryCircleList({ progress: this.changeProgress });
			},
			handleCurrentChange(page) {
				this.pagenum = page;
				this.usePage = true;
				this.queryCircleList({ progress: this.changeProgress });
			},
			queryCircleList(option) {
				let self = this;
				self.loading = true;
				let pagenum = 1;
				if (this.usePage) {
					pagenum = this.pagenum;
				} else {
					this.pagenum = 1;
				}
				option.pagenum = pagenum;
				post('/turnplan/queryturnplanlist', {
					command: 'turnplan/queryturnplanlist',
					sessionid: getCookie('sid'),
					loginid: getCookie('uid'),
					...option,
					pagenum: pagenum,
					pagepersize: this.pagepersize,
				}).then(function (data) {
					self.loading = false;
					if (data && data.errcode == 0) {
						self.planDatas = data.list.map((item) => {
							return _.mapValues(item, (val, key) => {
								if (key == 'progress') {
									return val == 0 ? '未开始' : (val == 1 ? '进行中' : '已结束');
								}
								return val;
							})
						});
						self.totalCount = data.totalcount;
					}
					this.usePage = false;
				}).catch(() => {
					this.usePage = false;
				})
			}
		},
		mounted() {
			console.log(this.$route.matched)
			this.queryCircleList({});
			this.getRoleAuthority();

			// 智能排轮转
			this.roationsRulesList();
			this.getbaseidList();
			this.getgreadlist();
		}
	}
</script>
<style scoped>
	.tools {
		min-height: 50px;
	}

	.el-select {
		width: 120px;
	}

	.page-title {
		font-size: 20px;
		color: #1f2d3d;
		margin: 10px 0px;
	}

	.page-tools {
		margin: 15px 0;
	}

	.year-select {
		margin: 10px 10px;
		height: 37px;
		width: 500px;
	}

	.inline-first {
		float: left;
		line-height: 37px;
		margin-right: 10px;
	}

	.inline-second {
		float: left;
	}

	.loading-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tranining-turn-tip {
		margin-top: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.tranining-turn-tip div {
		margin-bottom: 12px;
	}

	.circlePlanSelf {
		padding: 0 20px;
	}
</style>
<style>
	.tarinninPlan .el-dialog {
		min-width: 786px;
	}

	.circlePlanSelf .tools .el-input__suffix-inner {
		height: 100%;

	}
</style>