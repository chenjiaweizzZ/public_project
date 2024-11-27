<template>
        <div class="evaluate_wrap">
            <!--loading-->
             <v-loading v-show="loading"></v-loading>
             <!--详情显示-->
             <div v-for='(item,index) in list' class="list" v-if="$route.query.id!=undefined">
                <h2>{{item.category}}</h2>
                <div v-for='(pro,key) in item.evaluationitems' class="problems">
                    <h3>{{pro.title}}</h3>
                    <ul>
                        <li v-for='v in pro.items' @click='check(v,index,key)'>
                            <input type="radio" class="radio" :name='index*10+key' :value='v.id' :checked="v.checkflag" ><span>{{v.name}}{{v.content}}</span></li>
                    </ul>
                </div>
            </div>
            <!--评分显示-->
             <div v-for='(item,index) in list' class="list" v-if="!($route.query.id!=undefined)">
                <h2>{{item.category}}</h2>
                <div v-for='(pro,key) in item.evaluationitems' class="problems">
                    <h3>{{pro.title}}</h3>
                    <ul>
                        <li v-for='v in pro.items' @click='check(v,index,key)'>
                            <input type="radio" class="radio" :name='index*10+key' :value='v.id' ><span>{{v.name}}{{v.content}}</span></li>
                    </ul>
                </div>
            </div>
        </div>
</template>
<script>
    import cHeader from '@/views/header';
    import methods from '@/methods';
    import noContent from '@/views/no_content';
    import { mapState,mapActions } from 'vuex';
    import vLoading from '@/components/vLoading'
    export default {
        name: 'rd_evaluate_score',
        components: {
            cHeader,
            noContent,
            vLoading
        },
        props:{
          evaluatedlist:{
            default(){
                return [];
            }
          }
        },
        data() {
            return {
                deptid:'',
                showDetail: false,
                showEvaluate: false,
                hospital: '',
                title: '护培生师规范化培训科室带教综合评价表',
                answer: [],
                evaluationList: [],
                checkedlist: [],
                date: '',
                recommend:'',
                advise:'',
                detaillist:[],
                noContent: false,
                type:'',
                issubmit:false,
                list:[],//答题
                itemid: [],
                totalScore:0,
                loading:false
            }
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        created(){
            // this.hospital = this.getSchoolName('cn')
            this.deptid =this.turninfo.deptid ;
            this.type = this.$route.query.message ? this.$route.query.type : this.$route.query.param;
        },
        watch:{
          evaluatedlist(newV,oldV){
              let self=this;
              this.evaluatedlist = newV;
              self.evaluationList = this.evaluatedlist;
              let arr = [];
              let list = [];
              for (let i = 0; i < self.evaluationList.length; i++) {
                  arr.push(self.evaluationList[i].category)
              }
              //分为4个大类;
              for (let i = 0; i < self.unique(arr).length; i++) {
                  list.push({
                      category: self.unique(arr)[i],
                      evaluationitems: []
                  })
              }
              for (let s in self.unique(arr)) {
                  for (let i = 0; i < self.evaluationList.length; i++) {
                      if (self.unique(arr)[s] == self.evaluationList[i].category) {
                          list[s].evaluationitems.push({
                              'title': self.evaluationList[i].title,
                              'id': self.evaluationList[i].id,
                              'items': self.evaluationList[i].itemlist
                          })
                      }
                  }
              }
              self.list = list;
              self.getInitScore();
          }
        },
        mounted() {
            let self = this;
            self.registerToNative('goBack', function (data) {
                self.back();
            });
            if(!this.$route.query.id){
                 this.init();
            }

        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setTurninfo'
            ]),
             unique: function (arr) {
                let res = [];
                let json = {};
                for (var i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            init(){
                let self = this;
                self.loading=true;
                self.post('/turn/queryevaluationitems', {
                    command: 'turn/queryevaluationitems',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type: 14
                }).done(function (data) {
                    self.evaluationList = data.evaluationList;
                    self.loading=false;
                    let arr = []
                    let list = []
                    for (let i = 0; i < self.evaluationList.length; i++) {
                        arr.push(self.evaluationList[i].category)
                    }
                    for (let i = 0; i < self.unique(arr).length; i++) {
                        list.push({
                            category: self.unique(arr)[i],
                            evaluationitems: []
                        })
                    }
                    for (let s in self.unique(arr)) {
                        for (let i = 0; i < self.evaluationList.length; i++) {
                            if (self.unique(arr)[s] == self.evaluationList[i].category) {
                                list[s].evaluationitems.push({
                                    'title': self.evaluationList[i].title,
                                    'id': self.evaluationList[i].id,
                                    'items': self.evaluationList[i].evaluationitems
                                })
                            }
                        }
                    }
                    self.list = list;
                    // 成功时调用，得到每一项的具体答案
                }).fail(function (error) {
                    self.noContent = true
                });
            },
            getInitScore(){
                let self=this;
                self.checkedlist = [];
                if(this.$route.query.id){
                    self.list.map(function (item, index, arr) {
                        item.evaluationitems.map(function (item1, index1, arr1) {
                            item1.items.map(function (item2, index2, arr2) {
                                if (item2.checkflag) {
                                    self.checkedlist.push({
                                        id: item2.id,
                                        score: item2.evascore
                                    })
                                }
                            })
                        })
                    })
                }else{
                    self.list.map(function (item, index, arr) {
                        item.evaluationitems.map(function (item1, index1, arr1) {
                            item1.items.map(function (item2, index2, arr2) {
                                if (item2.checked) {
                                    self.checkedlist.push({
                                        id: item2.id,
                                        score: item2.score
                                    })
                                }
                            })
                        })
                    });
                }
                //计算总得分
                this.getScore();
            },
            // 点击评分的时候点击每个选项的时候
            check(item, index,key) {
                let self = this;
                if(this.$route.query.id){
                    self.list[index].evaluationitems[key].items.map(function (item, index, arr) {
                        if (item.checkflag) {
                            item.checkflag=0;
                        }
                    })
                    if (typeof item.checked == 'undefined') {
                        self.$set(item, 'checkflag', 1)
                    }
                }else{
                    self.list[index].evaluationitems[key].items.map(function (item, index, arr) {
                        if (item.checked) {
                            delete item.checked
                        }
                    })
                    if (typeof item.checked == 'undefined') {
                        self.$set(item, 'checked', true)
                    }
                }

                self.checkedlist=[];
                if(this.$route.query.id){
                    self.list.map(function (item, index, arr) {
                        item.evaluationitems.map(function (item1, index1, arr1) {
                            item1.items.map(function (item2, index2, arr2) {
                                if (item2.checkflag) {
                                    self.checkedlist.push({
                                        id: item2.id,
                                        score: item2.evascore
                                    });
                                }
                            });
                        });
                    });
                }else{
                    self.list.map(function (item, index, arr) {
                        item.evaluationitems.map(function (item1, index1, arr1) {
                            item1.items.map(function (item2, index2, arr2) {
                                if (item2.checked) {
                                    self.checkedlist.push({
                                        id: item2.id,
                                        score: item2.score
                                    });
                                }
                            });
                        });
                    });
                }
                //计算总得分
                this.getScore();
            },
            getScore(){
                this.totalScore = 0;
                for (let item of this.checkedlist) {
                    this.totalScore += item.score;
                }
                this.$emit('getTotalScore',{score:this.totalScore,checkedlist:this.checkedlist});
            }
        }
    }

</script>
<style scoped lang="scss">
    @import "../../scss/mixin.scss";
    .g-main{
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .title {
        color: black;
        text-align: center;
        /*height: 1rem;*/
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        /*padding-top: 0.1rem;*/
        margin-bottom: 0;
        font-size: 0.26rem;
    }

    .explain {
        /*margin-top: 0.2rem;*/
        height: auto;
        /*background: #ffa81d;*/
        padding: 0.1rem;
        font-size: 0.24rem;
        background: rgb(244,226,198);
        /*opacity: 0.2;*/
    }

    .explain span {
        color: red;
    }
    .list{
        &>h2{
            height: 0.6rem;padding: 0;line-height: 0.6rem;
            padding-left:0.2rem;font-weight: normal;font-size: 0.24rem;
            border:none;
            background:#e4e4e4;
        }
        .problems{
            padding:0 0.2rem;
            h3{font-weight:normal;line-height: 1.3;border:none;}
            ul{
                overflow: hidden;
                li{
                    font-size: 0.22rem;
                }
            }
        }
    }
    .radio {
        width: .25rem;
        height: .25rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;

        background-image: url('../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }


    h2,h3{
        border-bottom: solid 1px rgb(240, 240, 240);
        padding: 0.1rem 0;
        font-size:0.2rem;
    }
    ul li input{
        margin-right: 0.1rem;
        float: left;
    }

    .radio:checked {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    .teacher{
        margin: 0.1rem 0;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*height: 1rem;*/
        /*align-items: center;*/
        /*border-bottom: solid 0.01rem #c3c3c3;*/
        padding: 0.1rem;
        background: white;
    }
    .teacher label{
        position: relative;
        top:-0.08rem;
        margin-top: 0.1rem;
        margin-left: 0.2rem;
    }
    .teacher label:nth-last-of-type(1){
        margin-left: 1.2rem;
    }
    .radio:checked {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    .teacher label input{
        position: relative;
        top: 0.08rem;
    }
    .advise{
        padding: 0.1rem;
        background: white;
    }
    .advise textarea{
        width: 100%;
        height: 2rem;
        border: solid 0.01rem #c3c3c3;
        padding: 0.1rem;
    }
    .remark{
        padding: 0.1rem;
        font-size: 0.2rem;
    }
    .remark div{
        padding-left: 0.5rem;
    }
    .remark div p{
        width: 50%;
        float: left;
        /*color: #666666;*/
    }
    .noclick {
        pointer-events: none;
    }
    .problems>ul {width: 100%;overflow: hidden;display: flex;flex-flow: row nowrap;display: -webkit-flex;justify-content:space-around;}
    .problems>ul li{float:left;}
    .problems>ul li input{margin-bottom: 3px;}
</style>
