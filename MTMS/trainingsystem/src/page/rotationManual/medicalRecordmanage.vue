<template>
    <div class="wapper">
        <div class="func-tools">
            <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
        <div class="content">
            <el-table :data="caseList" border tooltip-effect="dark" style="width: 100%">
                <el-table-column label="内容名称" prop="content" min-width="150"></el-table-column>
                <el-table-column label="是否有子项" prop="type" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 0">否</span>
                        <span v-if="scope.row.type == 1">是</span>
                    </template>
                </el-table-column>
                <el-table-column label="最后操作人" prop="operatorName" min-width="120"></el-table-column>
                <el-table-column label="最后操作时间" prop="updateTime" min-width="150"></el-table-column>
                <el-table-column fixed="right" min-width="160" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加dialog -->
        <el-dialog :title="addEditDialogTitle" :visible.sync="addEditDialog" :close-on-click-modal="false"
            @close="resetForm('caseDialogRef')">
            <el-form class="addEdit-box" :model="dialogForm" :rules="rules" ref="caseDialogRef" label-width="120px">
                <el-form-item label="内容名称:" prop="caseName">
                    <el-input v-model.trim="dialogForm.caseName" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="是否有子项:" prop="caseDetail">
                    <el-radio-group v-model="dialogForm.caseDetail">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
               
                <div class="fun-footer-box">
                    <el-button type="primary" @click="submitForm('caseDialogRef')" :loading="saveStatus">保存</el-button>
                    <el-button @click="resetForm('caseDialogRef')">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { post, getCookie, exportMouldExcel, exportExcel } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import api from '../../config/common_data.js';
    var _ = require('lodash');
    export default {
        data() {
            return {
                caseList: [],
                // 添加 编辑 dialog
                addEditDialog: false,
                addEditDialogType: 0, // 0 添加 1 编辑
                addEditDialogTitle: '添加',
                saveStatus: false,
                currentCaseId: '',
                dialogForm: {
                    caseName: '',
                    caseDetail: '',
                },
                // 验证规则
                rules: {
                    caseName: [{ required: true, message: '请输入内容名称', trigger: 'blur' }],
                    caseDetail: [{ type: 'number', required: true, message: '请选择是否有子项', trigger: 'change' }]
                }
            }
        },
        computed: {

        },
        methods: {
            // 添加
            handleAdd() {
                this.dialogForm = {
                    caseName: '',
                    caseDetail: '',
                };
                this.addEditDialog = true;
                this.addEditDialogType = 0;
                this.addEditDialogTitle = '添加';
            },
            // 病种列表查询
            queryCaseList() {
                api.queryCases().then((data) => {
                    this.caseList = data.list;
                });
            },

            // 提交表单
            submitForm(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 提交按钮loading状态
                        this.saveStatus = true;
                        let option = {};
                        // 添加
                        if (this.addEditDialogType == 0) {
                            option = {
                                content: this.dialogForm.caseName,
                                type: String(this.dialogForm.caseDetail),
                                operator: getCookie('uid'),
                            }
                        }
                        // 编辑 
                        if (this.addEditDialogType == 1) {
                            option = {
                                id: this.currentCaseId,
                                content: this.dialogForm.caseName,
                                type: String(this.dialogForm.caseDetail),
                                operator: getCookie('uid'),
                            }
                        }
                        post('/turnManual/saveOrUpdateTurnManualManage', {
                            command: 'turnManual/saveOrUpdateTurnManualManage',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            ...option
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    message: this.addEditDialogType == 0 ? '添加成功!' : '编辑成功',
                                    type: 'success'
                                });
                                this.addEditDialog = false;
                                this.saveStatus = false;
                                // 查询列表
                                this.queryCaseList();
                            } else {
                                this.$message({
                                    message: data.errdesc,
                                    type: 'warning'
                                });
                                this.saveStatus = false;
                            }
                        }).catch(() => {
                            this.saveStatus = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            // 重置表单
            resetForm(form) {
                this.addEditDialog = false;
                try {
                    this.$refs[form].resetFields();
                } catch (e) {

                }
            },

            // table 操作
            editRow(index, row) {
                this.addEditDialog = true;
                this.addEditDialogType = 1;
                this.addEditDialogTitle = '编辑';
                this.currentCaseId = row.id;
                this.dialogForm.caseName = row.content;
                this.dialogForm.caseDetail = parseInt(row.type);
            },
            deleteRow(index, row) {
                if(row.deleteFlag == 1) {
                    this.$confirm('确认删除该条记录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        post('/turnManual/deleteTurnManualManage', {
                            command: 'turnManual/deleteTurnManualManage',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id: row.id,
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.queryCaseList();
                            }
                        }).catch(() => {
                            this.$message({
                                type: 'success',
                                message: '删除失败!'
                            });
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '已被引用,请解除引用后,在删除'
                    })
                }
            },
        },
        mounted() {
            this.queryCaseList();
        }
    }
</script>

<style lang="scss" scoped>
    .wapper {
        padding: 0 20px;
    }
    .content {
        margin-top: 10px;
    }

    .addEdit-box {
        width: 80%;
        margin: 0 auto;
    }

    .fun-footer-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .fun-footer-box button {
        margin-right: 5px;
    }

    .caseInfo-box {
        margin-top: 10px;
    }

    .case-func-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
    }
</style>