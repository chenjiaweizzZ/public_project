<template>
    <div class="sugAndFed">
        <div class="sugAndFed-searchGroup">
            <div><span class="sugAndFed-searchGroup-title">提交时间:</span>
                <el-date-picker v-model="date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                    @change="search(true)">
                </el-date-picker>
            </div>
            <div><span class="sugAndFed-searchGroup-title">科室:</span>
                <el-select v-model="deptId" placeholder="请选择" clearable filterable @change="search(true)">
                    <el-option v-for="item in AllDeptList" :key="item.serialNo" :label="item.deptName"
                        :value="item.serialNo"></el-option>
                </el-select>
            </div>
            <div><span class="sugAndFed-searchGroup-title">健康管理组:</span>
                <el-select v-model="groupId" placeholder="请选择" clearable filterable @change="search(true)">
                    <el-option v-for="item in FlupGroupList" :key="item.serialNo" :label="item.groupName"
                        :value="item.serialNo"></el-option>
                </el-select>
            </div>
            <div><span class="sugAndFed-searchGroup-title">满意度:</span>
                <el-select v-model="satisfactionValue" placeholder="请选择" clearable filterable @change="search(true)">
                    <el-option v-for="item in satisfactionValueList" :key="item.key" :label="item.key"
                        :value="item.value"></el-option>
                </el-select>
            </div>
            <div><span class="sugAndFed-searchGroup-title">姓名:</span>
                <el-input v-model="name" placeholder="请输入内容" class="width150px limiting"></el-input>
            </div>
            <div><span class="sugAndFed-searchGroup-title">联系方式:</span>
                <el-input v-model="contactPhone" placeholder="请输入内容" class="width150px limiting"></el-input>
            </div>
            <div class="sugAndFed-searchGroup-last">
                <span class="sugAndFed-searchGroup-title">状态:</span>
                <el-select v-model="replied" placeholder="请选择" clearable filterable @change="search(true)">
                    <el-option v-for="item in repliedList" :key="item.key" :label="item.key"
                        :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="sugAndFed-searchGroup-btns">
                <el-button @click="clear()">清空</el-button>
                <el-button type="primary" @click="search(true)">搜索</el-button>
                <el-button type="primary" @click="exportt()">导出</el-button>
            </div>
        </div>
        <div class="sugAndFed-table">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
                <el-table-column prop="patientName" label="姓名" width="100"></el-table-column>
                <el-table-column prop="contactPhone" label="联系方式" width="160"></el-table-column>
                <el-table-column prop="packageName" label="订单名称" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="specName" label="订单规格" width="100"></el-table-column>
                <el-table-column prop="orderAmount" label="订单金额" width="100">
                    
                </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" width="100"></el-table-column>
                <el-table-column prop="managerName" label="健康管理师" width="160"></el-table-column>
                <el-table-column prop="satisfactionValue" label="满意度" width="100">
                    <template slot-scope="scope">
                        <span>{{ getSatisfaction(scope.row.satisfactionValue) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="advice" label="反馈与建议" show-overflow-tooltip></el-table-column>
                <el-table-column prop="address" label="状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.feedbackContents ? "已回复" : "未回复" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="sugAndFed-pag">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="pageNo" :page-sizes="[10, 20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
        </div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose"
            :close-on-click-modal="false">
            <el-row class="sugAndFed-dia-row">
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">姓名:</div>
                    <div class="sugAndFed-dia-content">{{ patientName }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">联系方式:</div>
                    <div class="sugAndFed-dia-content">{{ contactPhone }}</div>
                </el-col>
            </el-row>
            <el-row class="sugAndFed-dia-row">
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">提交时间:</div>
                    <div class="sugAndFed-dia-content">{{ detail.createTime }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">满意度:</div>
                    <div class="sugAndFed-dia-content">{{ detail.satisfactionValue | getSat }}</div>
                </el-col>
            </el-row>
            <el-row class="sugAndFed-dia-row">
                <el-col :span="24">
                    <div class="sugAndFed-dia-title">反馈内容:</div>
                    <div class="sugAndFed-dia-content">{{ detail.advice }}</div>
                </el-col>
            </el-row>
            <el-row class="sugAndFed-dia-row">
                <el-col :span="24">
                    <div class="sugAndFed-dia-title">图片信息:
                        
                    </div>
                    <div v-if="detail.fileIds" class="sugAndFed-dia-content">
                            <el-image v-for="(item,index) in detail.files" :src="item"  :preview-src-list="detail.files" :key="index"></el-image>
                        </div>
                    <div v-else class="sugAndFed-dia-content">暂无图片</div>
                </el-col>
            </el-row>
            <hr v-if="detail.orderDetail"/>
            <el-row class="sugAndFed-dia-row" v-if="detail.orderDetail">
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">订单名称:</div>
                    <div class="sugAndFed-dia-content">{{ detail.orderDetail.packageName }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">订单规格:</div>
                    <div class="sugAndFed-dia-content">{{ detail.orderDetail.specName}}</div>
                </el-col>
            </el-row>
            <el-row class="sugAndFed-dia-row" v-if="detail.orderDetail">
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">订单金额:</div>
                    <div class="sugAndFed-dia-content">{{ detail.orderDetail.price | divice }}</div>
                </el-col>
                <el-col :span="12">
                    <div class="sugAndFed-dia-title">订单状态:</div>
                    <div class="sugAndFed-dia-content">{{ detail.orderDetail.flowStatusName }}</div>
                </el-col>
            </el-row>
            <el-row class="sugAndFed-dia-row" v-if="detail.orderDetail">
                <el-col :span="24">
                    <div class="sugAndFed-dia-title">健康管理师:</div>
                    <div class="sugAndFed-dia-content">{{ manager }}</div>
                </el-col>
            </el-row>
            <hr />
            <el-row class="sugAndFed-dia-row">
                <el-col :span="24">
                    <div class="sugAndFed-dia-title">回复:</div>
                    <div class="sugAndFed-dia-content2">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="detail.feedbackContents" maxlength="100" show-word-limit>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="feedback">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DeptList from '@/mixins/deptList'

export default {
    mixins: [DeptList],
    created() {
        this.iniTime()
        this.getDeptListByHospitalId()
        this.getFlupGroupList()
        this.search()
    },
    filters: {
        divice(value) {
            return value * 0.01
        },
        getSat(rate) {
            switch (rate) {
                case 1:
                    return "非常不满意"
                case 2:
                    return "不满意"
                case 3:
                    return "一般"
                case 4:
                    return "满意"
                case 5:
                    return "非常满意"
                default:
                    return ""
            }
        }
    },
    data() {
        return {
            // textarea: '',
            detail: {
                feedbackContents: ''
            },
            date: [],
            deptId: '',
            name: '',
            contactPhone: '',
            replied: "",
            satisfactionValue: '',
            groupId: '',
            pageNo: 1,
            pageSize: 10,
            total: 0,
            dialogVisible: false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            satisfactionValueList: [
                { key: '非常不满意', value: 1 },
                { key: '不满意', value: 2 },
                { key: '一般', value: 3 },
                { key: '满意', value: 4 },
                { key: '非常满意', value: 5 },
            ],
            repliedList: [
                { key: '已回复', value: true },
                { key: '未回复', value: false },
            ],
            FlupGroupList: [],
            tableData: [],
            manager: "",
            patientName: "",
            contactPhone: ""
        };
    },
    methods: {
        iniTime() {
            this.date = this.getDatesArray()
        },
        getDatesArray() {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 31);
            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            const datesArray = [formatDate(thirtyDaysAgo), formatDate(today)];
            return datesArray;
        },
        dateChange() {
            this.search()
        },
        getFlupGroupList() {
            this.$apis
                .groupgetFlupGroupList({
                    hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
                    pageNo: 1,
                    pageSize: 999
                })
                .then(res => {
                    this.FlupGroupList = res.list
                });
        },
        clear() {
            this.date = ["", ""]
            this.deptId = ""
            this.name = ""
            this.satisfactionValue = ""
            this.contactPhone = ""
            this.replied = ""
            this.groupId = ""
            this.search(true)
        },
        search(initPageIndex = false) {
            if (initPageIndex) this.pageNo = 1
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                submitStartDate: this.date ? this.date[0] : '',
                submitEndDate: this.date ? this.date[1] : '',
                satisfactionValue: this.satisfactionValue,
                name: this.name,
                contactPhone: this.contactPhone,
                deptId: this.deptId,
                groupId: this.groupId
            }
            if (this.replied === true || this.replied === false) {
                params.replied = this.replied
            }
            this.$apis.feedbackList(params).then(res => {
                this.tableData = res.list
                this.total = res.total
            })
        },
        exportt() {
            this.$apis.exportFeedbackRecords({
                pageNo: '',
                pageSize: '',
                submitStartDate: this.date ? this.date[0] : '',
                submitEndDate: this.date ? this.date[1] : '',
                satisfactionValue: this.satisfactionValue,
                name: this.name,
                contactPhone: this.contactPhone,
                deptId: this.deptId,
                groupId: this.groupId
            }).then(res => {
                let url = window.URL.createObjectURL(
                    // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
                    new Blob([res], { type: "application/ms-excel" })
                );
                // 进行基本思路的操作
                let link = document.createElement("a");
                link.href = url;
                link.download = "反馈与建议统计.xlsx";
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
        },
        getSatisfaction(value) {
            switch (value) {
                case "1":
                    return "非常不满意"
                case "2":
                    return "不满意"
                case "3":
                    return "一般"
                case "4":
                    return "满意"
                case "5":
                    return "非常满意"
                default:
                    return value
            }
        },
        viewDetail(row) {
            this.manager = row.managerName
            this.patientName = row.patientName
            this.contactPhone = row.contactPhone
            this.$apis.feedbackDetail(row.recordId).then(res => {
                this.detail = res
                if(res.fileIds) {
                    this.detail.files = []
                    let arr = res.fileIds.split(",")
                    arr.forEach(i => {
                        this.detail.files.push(this.$baseURL.ICDMApiUrl + "/file/image/" + i)
                    })  
                }
                this.dialogVisible = true
            })
        },
        feedback() {
            if(this.detail.feedbackContents == null || this.detail.feedbackContents == '') {
                this.$message.error('请输入回复!');
                return
            }
            this.$apis.feedbackReply({
                recordId: this.detail.recordId,
                feedbackContent: this.detail.feedbackContents
            }).then(res => {
                this.$message({
                    message: '反馈成功',
                    type: 'success'
                });
                this.dialogVisible = false
                this.search()
            })
        },
        handleClose() {
            this.dialogVisible = false
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.search(true)
        },
        handleCurrentChange(pageNo) {
            this.pageNo = pageNo
            this.search()
        }
    }
};
</script>

<style lang="scss" scoped>
.sugAndFed {
    &-searchGroup {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        background: #FBFBFB;
        padding: 10px 0;
        &-last {
            margin-right: 320px;
        }

        &-btns {
            position: absolute;
            right: 20px;
            bottom: 10px;
        }

        &-title {
            display: inline-block;
            margin: 10px 20px 20px 20px;

        }
    }

    &-table {
        margin-top: 10px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 50px;
    }

    &-pag {
        position: fixed;
        bottom: 10px;
        left: 20px;
        right: 20px;
        background: #FFF;
    }

    &-dia-row {
        margin-bottom: 10px;

        .el-col {
            display: flex;
        }
    }

    &-dia-line {
        margin-bottom: 10px;
    }

    &-dia-content {
        img {
            width: 80px;
            height: 80px;
            margin-right: 10px;
        }
    }

    &-dia-title {
        width: 90px;
        min-width: 90px;
        text-align: right;
        padding-right: 10px;
    }

    &-dia-content2 {
        width: 100%;
    }

    hr {
        margin: 10px 0;
    }
}
</style>

<style lang="scss">
.sugAndFed {
    &-dia-content {
        .el-image {
            width: 80px;
            height: 80px;
            margin-right: 10px;
        }
    }
}
</style>