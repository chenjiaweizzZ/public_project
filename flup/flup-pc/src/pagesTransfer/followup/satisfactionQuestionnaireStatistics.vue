<template>
    <div class="sugAndFed">
        <div class="sugAndFed-searchGroup">
            <div><span class="sugAndFed-searchGroup-title">提交时间:</span>
                <el-date-picker v-model="date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                    @change="search(true)">
                </el-date-picker>
            </div>
            <div><span class="sugAndFed-searchGroup-title">机构:</span>
                <el-select v-model="sourceId" placeholder="请选择" clearable filterable @change="search(true)">
                    <el-option v-for="item in hospitaList" :key="item.serial_no" :label="item.hospital_name"
                        :value="item.serial_no" :disabled="item.serial_no!==$global.hospital_id"></el-option>
                </el-select>
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
            <div><span class="sugAndFed-searchGroup-title">患者姓名:</span>
                <el-input v-model="patientName" placeholder="请输入内容" class="width150px limiting"></el-input>
            </div>
            <div><span class="sugAndFed-searchGroup-title">联系方式:</span>
                <el-input v-model="contactPhone" placeholder="请输入内容" class="width150px limiting"></el-input>
            </div>
            <div><span class="sugAndFed-searchGroup-title">满意度:</span>
                <el-select v-model="satisfactionValue" placeholder="请选择" clearable filterable multiple @change="search(true)">
                    <el-option v-for="item in satisfactionValueList" :key="item.key" :label="item.key"
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
                <el-table-column prop="recycleTime" label="提交时间" width="180"></el-table-column>
                <el-table-column prop="patientName" label="患者姓名" width="100"></el-table-column>
                <el-table-column prop="contactPhone" label="联系方式" width="150"></el-table-column>
                <el-table-column prop="deptName" label="科室" width="160"></el-table-column>
                <el-table-column prop="groupName" label="健康管理组" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="packageName" label="服务内容" show-overflow-tooltip></el-table-column>
                <el-table-column prop="specification" label="规格" width="120"></el-table-column>
                <el-table-column prop="verifyItemName" label="核销权益"></el-table-column>
                <el-table-column prop="sumValue" label="总体满意度" width="120">
                    <template slot-scope="scope">
                        <span>{{ getSatisfaction(scope.row.sumValue) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="procedureValue" label="流程满意度" width="120">
                    <template slot-scope="scope">
                        <span>{{ getSatisfaction(scope.row.procedureValue) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="serviceValue" label="服务满意度" width="120">
                    <template slot-scope="scope">
                        <span>{{ getSatisfaction(scope.row.serviceValue) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="advice" label="意见建议" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="address" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div class="sugAndFed-pag">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="pageNo" :page-sizes="[10, 20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
        </div>
    </div>
</template>

<script>
import DeptList from '@/mixins/deptList'
export default {
    mixins: [DeptList],
    created() {
        this.iniTime()
        this.getHosList()
        this.getDeptListByHospitalId()
        this.getFlupGroupList()
        this.search()
    },
    data() {
        return {
            date: [],
            sourceId: "",
            deptId: '',
            groupId: '',
            patientName: '',
            contactPhone: '',
            satisfactionValue: [],
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
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
            FlupGroupList: [],
            hospitaList: [],
            satisfactionValueList: [
                { key: '非常不满意', value: 1 },
                { key: '不满意', value: 2 },
                { key: '一般', value: 3 },
                { key: '满意', value: 4 },
                { key: '非常满意', value: 5 },
            ],
        }
    },
    methods: {
        iniTime() {
            this.date = this.getDatesArray()
        },
        clear() {
            this.date = []
            this.sourceId = ""
            this.deptId = ""
            this.groupId = ""
            this.patientName = ""
            this.contactPhone = ""
            this.satisfactionValue = []
            this.search(true)
        },
        getSatisfaction(value) {
            switch (value) {
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
                    return value
            }
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
        getHosList() {
            this.$apis.hospitalgetAllHospitals().then((res) => {
                this.hospitaList = res
            })
        },
        getFlupGroupList() {
            this.$apis
                .groupgetGroupByPrivileges({
                    hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
                    pageNo: 1,
                    pageSize: 999
                })
                .then(res => {
                    this.FlupGroupList = res
                });
        },
        search(initPageIndex = false) {
            if (initPageIndex) this.pageNo = 1
            let params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                submitStartDate: this.date ? this.date[0] : '',
                submitEndDate: this.date ? this.date[1] : '',
                satisfactionValue: this.satisfactionValue,
                patientName: this.patientName,
                contactPhone: this.contactPhone,
                deptId: this.deptId,
                groupId: this.groupId,
                sourceId: this.sourceId,
            }
            // if (this.replied === true || this.replied === false) {
            //     params.replied = this.replied
            // }
            this.$apis.getSatisfactionList(params).then(res => {
                this.tableData = res.list
                this.total = res.total
            })
        },
        exportt() {
            this.$apis.exportSatisfaction({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                submitStartDate: this.date ? this.date[0] : '',
                submitEndDate: this.date ? this.date[1] : '',
                satisfactionValue: this.satisfactionValue,
                patientName: this.patientName,
                contactPhone: this.contactPhone,
                deptId: this.deptId,
                groupId: this.groupId,
                sourceId: this.sourceId,
            }).then(res => {
                let url = window.URL.createObjectURL(
                    // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
                    new Blob([res], { type: "application/ms-excel" })
                );
                // 进行基本思路的操作
                let link = document.createElement("a");
                link.href = url;
                link.download = "满意度调查统计.xlsx";
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
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
}
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
}
</style>