<template>
    <div class="vue-uploader">
        <vue-cslider :filelist="fileItemList" :fdfsurl="fdfsurl" @getSlider="getSlider" :index="index" v-if="sliderVisible" :typeL="typeL"></vue-cslider>
        <div class="upload">
            <div class="imglist">
                <div v-for="(val,index) in fileItemList" v-if="val.type==type" class="imgitem" @click="deletepic(val.fileurl,index,type)">
                    <img class="photos" :src="fdfsurl + val.fileurl">
                    <i class="del" @click.stop="deleteitems(val.fileurl)" v-show="isupload"></i>
                </div>
                <div @click="uploadimg(uploadIndex)" v-show="isuploadflag&&isupload&&type==type" v-if="fileItemList.length < 9">
                    <div>
                        <i class="icon"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import methods from '@/methods'
    import { mapState, mapActions } from 'vuex'
    import vueCslider from './vue_cslider'
    export default {
        name: "vue-cupload",
        props: {
            hehe: {

            },
            fdfsurl: {
                type: String,
                default: 'http://'
            },
            isupload: {
                type: Boolean,
                default: true

            },
            imgList: {
                type: Array,
                default() {
                    return [];
                }
            },
            imgMax: {
                type: Number,
                default: 9
            },
            type: {
                type: Number,
                default: 2
            },
            uploadIndex: {
                type: Number,
                default: 1
            },
            uploadflag: {
                default: 1
            },
            newtype: {

            },
            isuploadflag: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                isWeixin: false,
                size: 0,
                filelist: this.imgList,
                show: false,
                nowurl: '',
                picShow: false,
                sliderVisible: false,
                typeL: '',//传入幻灯组件的type
                fileItemList: [],
                index: ''
            }
        },
        components: {
            vueCslider
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            getSlider(val) {
                this.sliderVisible = val;
            },
            handClick() {
                // alert(1)
            },
            callback() {

            },

            uploadimg(param) {
                // if(this.filelist.length>this.imgMax-1){
                //    this.toast('图片不能超过'+this.imgMax+'张');
                //    // this.imgLength();
                // }else{
                //     this.invokeNative('TakeAndUploadPhoto', {}, this.geturl);
                //     //uploadflag标志删除按钮是否显示;
                //     if (this.uploadflag == 1) {
                //         if (param == 1) {
                //             this.invokeNative('TakeAndUploadPhoto', {}, this.geturl)
                //         } else {
                //             this.invokeNative('TakeAndUploadPhoto', {}, this.geturlcase)
                //         }
                //     }
                // }
                if (this.uploadflag == 1) {
                    if (param == 1) {
                        this.invokeNative('TakeAndUploadPhoto', { imgMax: this.imgMax, currentImg: this.filelist.length }, this.geturl)
                    } else {
                        this.invokeNative('TakeAndUploadPhoto', { imgMax: this.imgMax, currentImg: this.filelist.length }, this.geturlcase)
                    }
                } else if (this.uploadflag == 2) {
                    this.toast('当前计划尚未到记录时间~')
                } else if (this.uploadflag == 3) {
                    this.toast('当前计划已超过记录时间~')
                }

            },
            imgLength() {
                // if (this.filelist.length >this.imgMax) {
                //     this.isuploadflag = false;
                // }
            },
            deleteitems(param) {
                let self = this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: '您是否要删除当前上传的图片？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () { },
                    ok: function () {
                        if (self.filelist) {
                            self.filelist.map((value, index) => {
                                if (value.fileurl == param) {
                                    self.filelist.splice(index, 1);
                                    self.imgLength();
                                }
                            })
                        }

                    },
                })
            },
            deletepic(param, index, type) {
                this.nowurl = param;
                // setTimeout(()=>{
                //      this.sliderVisible=false;
                // },2000)
                this.sliderVisible = true;
                this.typeL = type;
                this.index = index;
            },
            geturl(data) {
                let self = this;
                let me = JSON.parse(data);
                if (me.data instanceof Array) {
                    me.data.forEach(i => {
                        self.filelist.push({ fileurl: i.uri, type: this.type });
                    });
                } else {
                    self.filelist.push({ fileurl: me.data.uri, type: this.type });
                }
                this.fileItemList = this.filelist
                this.$emit('getFilelist', this.filelist);
            },
            geturlcase(data) {
                let self = this;
                let me = JSON.parse(data);
                if (me.data instanceof Array) {
                    me.data.forEach(i => {
                        self.filelist.push({ fileurl: i.uri, type: this.type });
                    });
                } else {
                    self.filelist.push({ fileurl: me.data.uri, type: this.type });
                }
                this.fileItemList = this.filelist
                this.$emit('getFilelist', this.filelist);
            },
        },
        mounted() {
            // setTimeout(()=>{
            this.filelist = this.imgList
            this.fileItemList = this.filelist.filter(val => {
                return val.type == this.type
            })
            // })
        },
        watch: {
            show(newVal, oldVal) {
                if (newVal) {
                    $('.__panel').css({ height: '100%' })
                } else {

                    $('.__panel').css({ height: 'auto' })
                }

            },
            imgList(newVal, oldVal) {
                this.filelist = this.imgList
                this.fileItemList = this.filelist.filter(val => {
                    return val.type == this.type
                });
            },
            fdfsurl(newV, oldV) {
                this.fdfsurl = newV;
            },
        }
    }
</script>

<style scoped lang="scss">
    .vue-uploader {
        .upload {
            display: flex;
            /*border-bottom: 1px solid #eee;*/
            .imglist {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .pic {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    background: rgba(0, 0, 0, 0.3);
                    left: 0;
                    top: 0;
                    z-index: 999;
                    img {
                        width: 80vw;
                        height: auto;
                        z-index: 101;
                    }
                }
            }
            .icon {
                display: inline-block;
                margin: 0.2rem;
                width: 1rem;
                height: 1rem;
                background: url("../assets/images/addpicture.png") 0 0 no-repeat;
                background-size: 100% 100%;
            }
            span {
                width: 1.4rem;
                text-align: center;
            }
            .imgitem {
                display: inline-block;
                position: relative;
                z-index: 100;
                i.del {
                    display: inline-block;
                    width: 0.35rem;
                    height: 0.35rem;
                    background: url("../assets/images/delete.png") 0 0 no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: 0.1rem;
                    left: 1rem;
                    z-index: 10;
                }
                .photos {
                    width: 1rem;
                    height: 1rem;
                    margin: 0.2rem;
                    background: #fff;
                    border-radius: 10px;
                }
                i {
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    position: absolute;
                    top: 0.2rem;
                    left: 0.2rem;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    span {
                        width: 100%;
                        height: 50%;
                        line-height: 0.5rem;
                        text-align: center;
                        color: #333;
                        font-weight: bold;
                    }
                    span:first-child {
                        border-bottom: 1px solid #eee;
                    }
                }
            }
        }
    }
</style>