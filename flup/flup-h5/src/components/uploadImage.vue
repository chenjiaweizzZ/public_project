<template>
    <div class="addImage">
        <template v-if="isPreview">
            <template v-for="item in imgList">
                <div class="addImage-list" :key="item">
                    <img class="addImage-list__img" :src="item" alt="">
                </div>
            </template>
            <div class="addImage-btn" v-if="!imgList.length">
                <i class="el-icon-plus"></i>
            </div>
        </template>
        <template v-else>
            <template v-for="item in imgList">
                <div class="addImage-list" :key="item">
                    <img class="addImage-list__img" :src="item" alt="">
                    <!-- <div class="addImage-list__actions">
                        <i class="el-icon-delete" @click="removeImage(item)"></i>
                    </div> -->
                    <div class="addImage-list__remove" @click="removeImage(item)">
                        <i class="el-icon-circle-close"></i>
                    </div>
                </div>
            </template>
            <!-- <el-upload
                v-if="imgList.length < limit"
                :http-request="httprequest"
                :show-file-list="false"
                action=""
                :before-upload="beforeupload"
            >
                <div class="addImage-btn">
                    <i class="el-icon-plus"></i>
                </div>
            </el-upload> -->
            <van-uploader result-type="file" :before-read="beforeupload" :after-read="httprequest">
                <div class="addImage-btn">
                    <i class="el-icon-plus"></i>
                </div>
            </van-uploader>
        </template>
    </div>
</template>
<script>
import {
  Upload
} from "element-ui";
import axios from 'axios'
export default{
    props:{
        imgList:{
            type:Array,
            default:() => []
        },
        limit:{
            type:Number,
            default:10,
        },
        listType:{
            type:Array,
            default:() => ['image/jpeg',"image/png"]
        },
        isPreview:{
            type:Boolean,
            default:false,
        }
    },
    components: {
        [Upload.name]: Upload,
    },
    data(){
        return {
        }
    },
    methods:{
        async httprequest(e){
            console.log(111,e)
            var formData = new FormData()
            formData.append('file', e.file)
            this.$toast.loading({
              duration: 0,
              forbidClick: true,
            });
            //调用cos上传文件编排
            try{
                let res = await axios({
                    method: 'post',
                    url: this.$baseURL.ICDMApiUrl + '/file/upload',
                    headers: {
                    openId:localStorage.getItem('openId')|| (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).openId),
                    'content-type': 'multipart/form-data',
                    },
                    data: formData,
                });
                let imageUrl = this.$baseURL.ICDMApiUrl + '/file/image/' + res.data.retData.id;
                this.imgList.push(imageUrl);
                this.$nextTick(() => {
                    this.$emit('changeImage');
                })
            }finally{
                this.$toast.clear();
            }
        },
        beforeupload(file){
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$toast('上传图片大小不能超过 20MB!');
            }
            return  isLt2M;
        },
        removeImage(url){
            let list = JSON.parse(JSON.stringify(this.imgList));
            list = list.filter(item => item != url);
            this.$emit('update:imgList',list);
            this.$nextTick(() => {
                this.$emit('changeImage');
            })
        }
    }
}
</script>
<style scoped lang="scss">
.addImage{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &-list{
        &:hover{
            .addImage-list__actions{
                opacity:1;
            }
        }
        position: relative;
        margin-right: 5px;
        margin-bottom: 5px;
        width: 100px;
        height: 100px;
        // overflow: hidden;
        &__img{
            width: 100px !important;
            height: 100px !important;
            object-fit: cover;
            border-radius: 6px;
        }
        &__actions{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: 6px;
            cursor: default;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0,0,0,.5);
            transition: opacity .3s;
            .el-icon-delete{
                cursor: pointer;
            }
        }
        &__remove{
            position: absolute;
            right: 0;
            top:0;
            z-index: 10;
            line-height: 1;
            transform: translate(50%,-50%);
            .el-icon-circle-close{
                font-size: 20px;
                color: #f00;
            }
        }
    }
    &-btn{
        width: 100px;
        height: 100px;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        vertical-align: top;
        text-align: center;
        line-height: 100px;
        .el-icon-plus{
            font-size: 28px;
        }
    }
}
</style>