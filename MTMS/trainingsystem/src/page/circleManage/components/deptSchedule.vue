<template>
    <div class="schedule-c">
        <div class="search">
            <div class="search-input">
                <el-input style="width:200px" v-model="search_info" placeholder="请输入姓名/手机号/学号" size="small" @keyup.enter.native="doInputQuery"></el-input>
                <el-button type="primary" @click="doInputQuery" size="small">搜索</el-button>
            </div>
        </div>
        <div class="queryTools">
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                <el-col :span="18">
                    <el-form-item label="基地">
                        <el-select filterable v-model="queryForm.base_id" placeholder="请选择" @change="newbasechange" size="small">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item,index) in newroomList" :key="item.index" :label="item.deptname" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="科室">
                        <el-select filterable v-model="queryForm.stud_dept_id" placeholder="请选择" size="small">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item,index) in newdeptList" :key="item.index" :label="item.deptname" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学位">
                        <el-select filterable v-model="queryForm.degre_id" placeholder="请选择" size="small">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="item in selectOptions.degree" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学员类型">
                        <el-select filterable v-model="queryForm.type_id" placeholder="请选择" size="small">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="item in selectOptions.stud_type" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-col>
                <el-col :span="6">
                    <el-button type="primary" class="btn-search" size="small" @click.stop="doQuery">查询</el-button>
                </el-col>
            </el-form>
        </div>
        <div class="detailTable zy-clear" style="position:relative;">
            <div style="width:100%;overflow-x: auto;position: static;">
                <div id="plan-content" class="zy-clear" style="position: static;">
                    <el-table ref="detailTable" :data="planDetailsDatas" border tooltip-effect="dark" v-loading="loading" class="custom-table"
                        style="width:1367px;overflow:hidden;float:left;position:static;">
                        <el-table-column type="index" width="55" label="序号"></el-table-column>
                        <el-table-column prop="name" class="test2" fixed="left" width="200" label="姓名">
                        </el-table-column>
                        <el-table-column prop="username" width="130" label="学号"></el-table-column>
                        <el-table-column prop="mobile" width="150" label="手机号"></el-table-column>
                        <el-table-column prop="period" width="150" label="年级"></el-table-column>
                        <el-table-column prop="degree" width="150" label="学位"></el-table-column>
                        <el-table-column prop="base" width="200" label="专业基地"></el-table-column>
                        <el-table-column prop="deptName" width="180" label="科室"></el-table-column>
                        <el-table-column prop="type" width="150" label="学员类型"></el-table-column>
                    </el-table>

                    <div style="float:left">
                        <circle-detail :height="rowHeight" :alltime="alltime" :circleData="circleData"></circle-detail>
                    </div>
                </div>
            </div>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="reqnum" layout="total, sizes, prev, pager, next, jumper"
                :total="totalPages">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../../config/util';
    import { mapState, mapActions } from 'vuex'
    import circleDetail from '../../../components/circleDetailLayout'
    export default {
        name: "deptEquilibrium",
        data() {
            return {
                input: '',
                loading: false,
                queryForm: {
                    base_id: '',
                    stud_dept_id: '',
                    degre_id: '',
                    type_id: ''
                },
                search_info: '',
                newroomList: [],
                newdeptList: [],
                // 结果展示
                planDetailsDatas: [],
                planyearmontlist: [],
                page: 1,
                reqnum: 10,
                totalPages: 0,
                rowHeight: 0,
                usePage: false,
                exportInput: false,
            }
        },
        components: {
            circleDetail,
        },
        computed: {
            ...mapState(['gradeList', 'allOption', 'selectOptions']),
            circleData() {
                return this.planDetailsDatas.map((item) => item.detail);
            },
            alltime() {
                return this.planyearmontlist;
            },

        },
        methods: {
            ...mapActions(['initSelectList']),
            //带权限的基地科室和病区
            ...mapActions(['initGradeList']),
            doQuery() {
                this.queryTurnPlanDetailList();
            },
            gethospitaltree: function () {
                var self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        // newroomList  newdeptList  newareaList
                        self.newroomList = data.depttree.childlist
                        // let treeidlist = data.depttree.childlist
                        // treeidlist.map(item => {
                        //     self.baseidlist.push(item.id)
                        //     item.childlist.map(item2 => {
                        //         self.officeidlist.push(item2.id)
                        //     })
                        // })
                        // self.clearSelect();
                        // self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            //权限下的科室
            newbasechange: function () {
                let self = this;
                self.newdeptList = [];
                self.newroomList.map(item => {
                    if (self.queryForm.base_id == item.id) {
                        self.newdeptList = item.childlist
                    }
                })
            },
            calculateWid() {
                this.$nextTick(() => {
                    let width = (document.getElementsByClassName('custom-table')[0].offsetWidth) + (document.getElementsByClassName('circleDetail')[0].offsetWidth + 10)
                    document.getElementById('plan-content').style.width = width + "px"
                });
            },
            // 查询结果
            queryTurnPlanDetailList(queryTurnPlanDetailList) {
                this.loading = true;
                post('turn/queryTurnPlanDetailTempList', {
                    command: 'turn/queryTurnPlanDetailTempList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    plan_id: this.$route.query.planid,
                    reqnum: this.reqnum,
                    search_info: queryTurnPlanDetailList,
                    starttime: this.$route.query.startTime,
                    endtime: this.$route.query.endTime,
                    page: this.page,
                    base_id: this.queryForm.base_id,
                    stud_dept_id: this.queryForm.stud_dept_id,
                    degre_id: this.queryForm.degre_id,
                    type_id: this.queryForm.type_id
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.loading = false;
                        this.planDetailsDatas = data.turn_plan_detail;
                        this.planyearmontlist = data.planyearmontlist;
                        this.totalPages = data.count;
                        this.usePage = false;
                        this.$nextTick(() => {                            
                            this.rowHeight = document.getElementsByTagName('tr')[0].offsetHiehgt + (2.25 / this.planDetailsDatas.length);
                        });
                        this.calculateWid();

                    }
                })
            },

            handleSizeChange(size) {
                this.reqnum = size;
                this.doInputQuery();
            },
            handleCurrentChange(page) {
                this.page = page;
                this.doInputQuery();

            },
            // 条件筛选查找
            selectQuery() { },
            // 搜索
            doInputQuery() {
                for (let key in this.queryForm) {
                    this.queryForm[key] = '';
                }
                this.queryTurnPlanDetailList(this.search_info)

            },
        },
        mounted() {
            this.initSelectList({ type: 'degree,stud_type' })
            this.gethospitaltree();
            this.initGradeList();
            // 查询智能排结果
            this.queryTurnPlanDetailList();
        }
    }
</script>

<style lang="scss" scoped>
    .search {
        /*position: absolute;*/
        /*right: 20px;*/
        /*top: 16px;*/
        height: 40px;
        .search-input {
            float: right;
        }

    }

    .queryTools {
        margin-top: 16px;
        margin-bottom: 10px !important;
    }

    .queryTools .el-form-item {
        width: 190px;
        margin-bottom: 10px;
    }

    .el-select {
        width: 120px;
    }

    .btn-search {
        margin-left: 10px;
        float: right;
    }

    .show-color {
        width: 100%;
        margin: 15px 0px;
    }

    .show-color div {
        display: inline-block;
        margin-right: 20px;
        line-height: 20px;
    }

    .show-color span {
        display: inline-block;
        width: 40px;
        height: 15px;
        margin-right: 10px;
    }

    #plan-content {
        width: 6000px;
    }

    .inline {
        text-align: center;
        margin: 0px 0px 10px 0px;
    }

    .el-table /deep/ td {
        height: 40px;
    }
</style>