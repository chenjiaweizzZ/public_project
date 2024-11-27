<template>
    <div class="messageReminder marginX20">
        <OperationHeader style="margin-bottom:20px">
            <el-button type="primary" plain @click="add">新建</el-button>
            <template v-slot:right>
                <p style="width:80px">&emsp;名称</p>
                <el-input placeholder="请输入名称" v-model="name" class="input-with-select limiting" maxlength="20"
                    show-word-limit>
                    <el-button slot="append" icon="el-icon-search" @click="getMessageList(true)"></el-button>
                </el-input>
            </template>
        </OperationHeader>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="templateName" label="名称" width="180"></el-table-column>
            <el-table-column prop="msContent" label="内容">
                <template slot-scope="scope">
                    <span>{{ scope.row.msContent | filterBr }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 15px; text-align: right">
            <el-pagination class="pageBottom" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="pageIndex" :page-sizes="[10, 20,]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
        </div>
        <el-dialog :title="diaTitle == 1 ? '新增' : '编辑'" :visible.sync="dialogVisible" width="30%"
            :before-close="handleClose" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="标题" prop="name">
                    <el-input v-model="form.name" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model="form.content" maxlength="300" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: "",
            templateId: "",
            pageIndex: 1,
            pageSize: 10,
            total: 3,
            diaTitle: 1,
            dialogVisible: false,
            form: {
                name: "",
                content: ""
            },
            tableData: [],
            rules: {
                name: [
                    { required: true, message: '请输入模板标题', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入模板内容', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        this.getMessageList()
    },
    filters: {
        filterBr(value) {
            return value.replace(/<br>/g, '\n')
        }
    },
    methods: {
        getMessageList(init = false) {
            init ? this.pageIndex = 1 : ''
            this.$apis.selectMessage({
                name: this.name,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }).then(res => {
                this.tableData = res.list
                this.total = res.total
            })
        },
        add() {
            this.diaTitle = 1
            this.dialogVisible = true
            if (this.$refs.form) {
                this.$refs.form.resetFields()
            }
            this.form.name = ""
            this.form.content = ""
        },
        edit(item) {
            console.log(item)
            this.diaTitle = 2
            if (this.$refs.form) {
                this.$refs.form.resetFields()
            }
            this.templateId = item.templateId
            this.form.name = item.templateName
            this.form.content = item.msContent.replace(/<br>/g, '\n')
            this.dialogVisible = true
        },
        del(item) {
            this.$confirm('删除后不可恢复,是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$apis.deleteMessage(item.templateId).then(res => {
                    this.$message({
                        message: '删除成功!',
                        type: 'success'
                    });
                    this.getMessageList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.diaTitle == 1) {
                        this.$apis.addMessage({
                            name: this.form.name,
                            content: this.form.content.replace(/\n/g, '<br>')
                        }).then(res => {
                            this.$message({
                                message: '新增成功!',
                                type: 'success'
                            });
                            this.dialogVisible = false
                            this.getMessageList()
                        })
                    }else {
                        this.$apis.updateMessage({
                            templateId: this.templateId,
                            name: this.form.name,
                            content: this.form.content.replace(/\n/g, '<br>')
                        }).then(res => {
                            this.$message({
                                message: '编辑成功!',
                                type: 'success'
                            });
                            this.dialogVisible = false
                            this.getMessageList()
                        })
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.getMessageList(true)
        },
        handleCurrentChange(pageIndex) {
            this.pageIndex= pageIndex
            this.getMessageList()
        },
        handleClose() {
            this.dialogVisible = false
        }
    }
}
</script>
