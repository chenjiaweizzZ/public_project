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
                    <div class="addImage-list__actions">
                        <i class="el-icon-delete" @click="removeImage(item)"></i>
                    </div>
                </div>
            </template>
            <el-upload
                v-if="imgList.length < limit"
                :http-request="httprequest"
                :show-file-list="false"
                action=""
                :before-upload="beforeupload"
            >
                <div class="addImage-btn">
                    <i class="el-icon-plus"></i>
                </div>
            </el-upload>
        </template>
    </div>
</template>
<script>
export default{
    props:{
        imgList:{
            type:Array,
            default:() => []
        },
        limit:{
            type:Number,
            default:5,
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
    data(){
        return {
        }
    },
    methods:{
        async httprequest(e){
            console.log(111,e)
            var formData = new FormData()
            formData.append('file', e.file)
            //调用cos上传文件编排
            let res = await this.$apis.upload(formData);
            let imageUrl = this.$baseURL.ICDMApiUrl + '/file/image/' + res.id;
            this.imgList.push(imageUrl);
        },
        beforeupload(file){
            console.log(1122,this.listType)
            const isJPG =  this.listType.includes(file.type);
            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG,PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
            }
            return isJPG && isLt2M;
        },
        removeImage(url){
            let list = JSON.parse(JSON.stringify(this.imgList));
            list = list.filter(item => item != url);
            this.$emit('update:imgList',list);
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
        overflow: hidden;
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