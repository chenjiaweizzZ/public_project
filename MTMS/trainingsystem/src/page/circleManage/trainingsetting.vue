<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" size="small" @click="addPlan">添加</el-button>
            </div>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" border tooltip-effect="dark" style="width: 100%" v-loading="loading"
                :data="trainingprogrammelist">
                <el-table-column prop="name" label="培训方案"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="适用学员">
                    <template slot-scope="scope">
                        <span v-for="item in scope.row.degreelist" style="padding:0 4px">
                            {{ item.name }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="最后操作人" prop="updatename"></el-table-column>
                <el-table-column label="最后操作时间" prop="updatetime"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.stop="editPlan(scope.row)">编辑</el-button>
                        <el-button size="small" type="text" @click.stop="deletePlan(scope.row)">删除</el-button>
                        <el-button size="small" type="text" @click.stop="planSettingFn(scope.row.id)">方案设置</el-button>
                        <el-button size="small" type="text" @click.stop="copySetting(scope.row.id)">复制</el-button>
                    </template>
                </el-table-column>

            </el-table>

        </div>
        <!--添加-->
        <el-dialog :visible.sync="addvisible" :title="trainingprogramme.title">
            <div class="plan-box">
                <el-form ref="planform" :rules="trainingrules" :model="trainingprogramme">
                    <el-form-item label="培训方案:" prop="name" label-width="100px">
                        <el-input v-model="trainingprogramme.name" type="textarea" :maxlength="50" :rows="1"></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="100px">
                        <el-input v-model="trainingprogramme.description" type="textarea" max="50"></el-input>
                    </el-form-item>
                    <el-form-item label="适用学员:" label-width="100px" prop="degreelist">
                        <el-checkbox-group v-model="trainingprogramme.degreelist">
                            <el-checkbox  v-for="item in stud_degree"  :label="item.key" >
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>

                    </el-form-item>
                    <el-form-item align="right">
                        <el-button @click.stop="cancel">取消</el-button>
                        <el-button type="primary" @click.stop="addSubmit" :class="{ noclick: issubmit }"
                            v-if="!trainingprogramme.isedit" v-loading='btnloading'>确定</el-button>
                        <el-button v-loading='btnloading' type="primary" @click="editSubmit" :class="{ noclick: issubmit }"
                            v-if="trainingprogramme.isedit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--方案设置-->
        <plan-setting :datalist="plansettinglist" ref="plansetting"
            @getTrainingProgrammeList="getTrainingProgrammeList"></plan-setting>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import planSetting from '../../components/plansetting';
import { currentYear, getCookie, post, exportExcel } from '../../config/util'
export default {
    data() {
        //判断培训方案是否重名
        let judgingSameName = (rule, value, callback) => {
            if (!value.trim()) {
                callback('请输入培训方案')
            } else {
                for (let i = 0; i < this.trainingprogrammelist.length; i++) {
                    let ai = this.trainingprogrammelist[i];
                    if (ai.name == value.trim()) {
                        callback('培训方案重名');
                        return;
                    }
                }
                callback();

            }
        };
        return {
            loading: false,
            stud_degree: [
                { key: 1, name: "大专" },
                { key: 2, name: "本科" },
                { key: 3, name: "专硕" }
            ],
            issubmit: false,
            trainingprogrammeid: '',
            datalist: [{ name: '11' }],
            arr: [],
            isbtnloading: false,
            trainingprogramme: {
                title: '添加培训方案',
                name: '',
                description: '',
                degreelist: [],
                isedit: false,
            },
            btnloading: false,
            applystd: [],
            trainingprogrammelist: [],
            addvisible: false,
            plansettinglist: {
                visible: false,
                title: '方案设置',
                id: ''
            },
            trainingrules: {
                name: { required: true, validator: judgingSameName, trigger: 'blur' },
                degreelist: { required: true, message: '请选择适用学员' }
            }
        }
    },
    components: {
        planSetting,
        ...mapState([
            'sysTypeNum'
        ])
    },
    methods: {
        //适用学员类型
        ...mapActions(['initStagecount']),
        // getTraineeStudent() {
        //     post('/traineestudent/queryDictionaryList', {
        //         command: 'traineestudent/queryDictionaryList',
        //         sessionid: getCookie('sid'),
        //         loginid: getCookie('uid'),
        //         uid: getCookie('uid'),
        //         code: "turn_degree",
        //         sysType: this.sysTypeNum
        //     }).then(res => {
        //         if (res && res.errcode) {
        //             if (res.errcode == 0) {
        //                 this.stud_degree = res.dic_list;

        //             }

        //         } else {
        //             this.$message({
        //                 type: 'warning',
        //                 message: res.errdesc
        //             })
        //         }
        //     });
        // },
        //复制方案
        copySetting(id) {
            this.loading = true;
            post('/trainingprogramme/copy', {
                command: 'trainingprogramme/copy',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id
            }).then(res => {
                this.issubmit = false;
                this.loading = false;
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        this.$message({
                            type: "success",
                            message: '复制成功'
                        })
                        this.getTrainingProgrammeList();
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            }).catch(() => {
                this.issubmit = false;
                this.$message({
                    type: 'warning',
                    message: '服务器错误，请联系管理员'
                });
                this.loading = false;
            });
        },
        addPlan() {
            this.addvisible = true;
            this.trainingprogramme.isedit = false;
            this.trainingprogramme.description = '';
            this.trainingprogramme.name = '';
            this.trainingprogramme.degreelist = [];
        },
        editPlan(row) {
            this.trainingprogrammeid = row.id;
            this.trainingprogramme.isedit = true;
            this.trainingprogramme.degreelist = [];
            this.addvisible = true;
            this.trainingprogramme.title = '编辑 ';
            this.trainingprogramme.name = row.name;
            this.trainingprogramme.description = row.description;
            this.trainingprogramme.description = row.description;
            row.degreelist.map(item => {
                this.trainingprogramme.degreelist.push(item.id)
            });
        },
        //培训方案列表
        getTrainingProgrammeList() {
            this.loading = true;
            post('/trainingprogramme/list', {
                command: 'trainingprogramme/list',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                name: "",
                sysType: this.sysTypeNum
            }).then(res => {
                this.issubmit = false;
                this.loading = false;
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        this.trainingprogrammelist = res.list;
                        this.applystd = this.trainingprogrammelist.degreelist
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            }).catch(() => {
                this.issubmit = false;
                this.$message({
                    type: 'warning',
                    message: '服务器错误，请联系管理员'
                });
                this.loading = false;
            })
        },
        addSubmit() {
            this.$refs['planform'].validate(valid => {
                if (valid) {
                    this.issubmit = true;
                    this.btnloading = true;
                    post('/trainingprogramme/add', {
                        command: 'trainingprogramme/add',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        name: this.trainingprogramme.name,
                        description: this.trainingprogramme.description,
                        degreelist: this.trainingprogramme.degreelist,
                        sysType: this.sysTypeNum
                    }).then(res => {
                        this.issubmit = false;
                        this.btnloading = false;
                        if (res && res.errcode == 0) {
                            this.addvisible = false;
                            this.$message({
                                type: 'success',
                                message: "提交成功"
                            });
                            this.getTrainingProgrammeList();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    }).catch(() => {
                        this.issubmit = false;
                        this.btnloading = false;
                        this.$message({
                            type: 'warning',
                            message: '服务器错误，请联系管理员'
                        })
                    });
                }
            })


        },
        //删除方案
        deletePlan(row) {
            this.$confirm('是否删除此方案, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.issubmit = true;
                this.btnloading = true;
                post('/trainingprogramme/delete', {
                    command: 'trainingprogramme/delete',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id
                }).then(res => {
                    this.issubmit = false;
                    this.btnloading = false;
                    if (res && res.errcode == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTrainingProgrammeList();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                }).catch(() => {
                    this.issubmit = false;
                    this.btnloading = false;
                    this.$message({
                        type: 'warning',
                        message: '服务器错误，请联系管理员'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        editSubmit() {
            this.issubmit = true;
            this.btnloading = true;
            post('/trainingprogramme/edit', {
                command: 'trainingprogramme/edit',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                name: this.trainingprogramme.name,
                description: this.trainingprogramme.description,
                degreelist: this.trainingprogramme.degreelist,
                id: this.trainingprogrammeid
            }).then(res => {
                this.issubmit = false;
                this.btnloading = false;
                if (res && res.errcode == 0) {
                    this.addvisible = false;
                    this.$message({
                        type: 'success',
                        message: "提交成功"
                    });
                    this.getTrainingProgrammeList();
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            }).catch(() => {
                this.issubmit = false;
                this.btnloading = false;
                this.$message({
                    type: 'warning',
                    message: '服务器错误，请联系管理员'
                })
            })

        },
        cancel() {
            this.addvisible = false;
        },
        planSettingFn(id) {
            this.trainingprogrammeid = id;
            this.plansettinglist.visible = true;
            this.plansettinglist.id = id;
            this.$refs.plansetting.getAddMajorList();
        },
        cancelDialog() {

        },
        //阶段默认配置
        getStageCount() {
            post('/commparaconf/querycommparaconflist', {
                command: 'commparaconf/querycommparaconflist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                paramcode: 'turn_phase'
            }).then(res => {
                if (res && res.errcode == 0) {
                    let data = res.commparaconflist;
                    this.stagecount = Number(data[0].paramvalue);
                    this.initStagecount({ k: 'stagecount', v: this.stagecount })
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            })
        },
    },
    mounted() {
        //培训方案列表
        this.getTrainingProgrammeList();
        // this.getTraineeStudent();
        this.getStageCount();
    },
    watch: {
        trainingprogramme(val) {
        },
        arr(val) {

        }
    }
}
</script>
<style scoped lang="scss">
.wapper {
    padding: 0 20px;
    padding-bottom: 20px;
}

.tools {
    margin-bottom: 15px;
}

.plan-box {
    width: 65%;
    margin: 0 auto;

    .enableform {
        margin-bottom: 5px;
    }

    .el-checkbox {
        margin-left: 0;
        margin-right: 15px;
    }
}
</style>