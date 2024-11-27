<template>
	<div class="wapper">
		<div v-if="show == 1">
			<div class="dataTable allheight">
				<div class="titleclass" v-for="(item, index) in titlelist" :key='item.index' @click="detailnotication(item)">
					<p>{{ item.title }}</p><span>{{ item.release_time }}</span>
				</div>
			</div>
			<el-pagination class="pageclass" style="float:right;margin:10px 10px" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" :current-page="pageno" :page-sizes="[10, 20, 50, 100]"
				:page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
			</el-pagination>
		</div>
		<div v-if="show == 2">
			<div class="page-title">
				<span class="basecolor" style="cursor:pointer;" @click="backout">通知公告 </span>
				<span class=""> / </span> 详情
			</div>
			<div style="text-align: center;">
				<h2>{{ text_title }}</h2>
			</div>
			<div style="text-align: center;">
				<h3>发布时间:{{ text_time }}</h3>
			</div>
			<div class="ql-container ql-snow">
				<div class="ql-editor">
					<div id="text">
					</div>
				</div>
			</div>
			<div class="filestyle">
				<div v-if="detailfilelist.length > 0">附件:</div>
				<div v-for="(item, index) in detailfilelist" :key="index">
					<a target="_blank" :href="'/file/download2?file=' + fileurltitle + item.url + '&name=' + item.name"
						:title="item.name">{{ item.name }}</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
import { mapState, mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'

export default {
	data() {
		return {
			text_title: '',
			text_time: '',
			show: 1,
			titlelist: [],//标题列表
			detailfilelist: [],//附件列表
			fileurltitle: '',
			pageno: 1,
			pagesize: 10,
			totalCount: 0,
		}
	},
	computed: {
	},
	mounted() {
		this.inittable(1, 10)
	},
	watch: {

	},
	methods: {
		inittable: function (pageno, pagesize) {            //公告列表
			var self = this;
			post('/consult/list', {
				command: 'consult/list',
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
				pageno: pageno,
				pagesize: pagesize,
				type: 2,
				status: 1,
				title: ''
			}).then(function (data) {
				if (data && data.errcode == 0) {
					self.titlelist = data.consultlist;
					self.totalCount = data.allcount;
				}
			}).catch(function (error) {
				//console.log(error)
			})
		},
		detailnotication: function (item) {				//公告详情
			var self = this;
			self.show = 2;
			post('/consult/detail', {
				command: 'consult/detail',
				sessionid: getCookie('sid'),
				loginid: getCookie('uid'),
				id: item.id
			}).then(function (data) {
				if (data && data.errcode == 0) {
					self.fileurltitle = data.web_domain;
					document.getElementById('text').innerHTML = ""
					self.text_title = data.title;
					self.text_time = data.release_time;
					document.getElementById('text').innerHTML = data.content
					self.detailfilelist = data.attachs;
				}
			}).catch(function (error) {
				//console.log(error)
			})

		},
		backout: function () {
			this.show = 1;
			document.getElementById('text').innerHTML = ""
			//	this.inittable(1,10 ,'');
		},
		/*分页区*/
		handleSizeChange(size) {
			this.pagesize = size;
			this.inittable(this.pageno, this.pagesize);
		},
		handleCurrentChange(currentPage) {
			this.pageno = currentPage;
			this.inittable(this.pageno, this.pagesize);
		}
	}
}
</script>

<style scoped>
.wapper {
	margin-left: 20px;
}

.blue {
	color: blue;
}

.page-title {
	font-size: 16px;
	font-weight: 700;
	color: #606266;
}

.allheight {
	height: calc(100vh - 220px);
	overflow-y: auto;
}

.titleclass {
	margin: 15px 0;
	cursor: pointer;
}

.titleclass:hover {
	color: #ff0000;
}

.titleclass>p {
	display: inline-block;
}

.titleclass>span {
	display: inline-block;
	text-align: right;
	float: right;
	margin-right: 50px;
}

.basecolor:hover {
	color: #409eff;
}

.filestyle {
	margin: 10px 0px;
}

.filestyle>div>a {
	color: #00A0E9;
	margin: 5px 0px;
}

.ql-container.ql-snow {
	border: none;
	min-height: auto;
}
</style>