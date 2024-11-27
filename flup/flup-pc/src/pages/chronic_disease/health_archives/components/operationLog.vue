<template>
    <div class="operation-log">
        <el-dialog :title=title :visible.sync="dialogVisible" width="60%" :before-close="changeShow">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
                <el-table-column prop="operatorUserName" label="操作人员" width="100">
                </el-table-column>
                <el-table-column prop="operateType" label="操作" width="150">
                </el-table-column>
                <el-table-column prop="operateTime" label="操作时间"  width="200">
                </el-table-column>
                <el-table-column prop="operateContents" label="操作内容">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
  
<script>

export default {
    name: 'operation-log',
    props: {
        tableData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            title: '操作记录',
            dialogVisible: false
        }
    },
    methods: {
        changeShow() {
            this.dialogVisible = !this.dialogVisible
        },
        add() {
            this.changeShow()
        },
    }
}
</script>