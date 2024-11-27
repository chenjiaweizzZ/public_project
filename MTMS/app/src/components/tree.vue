<template>
    <!-- <div> -->
        <ul>
			<li v-for="item in data">
				<div :class="{ icon: true, 'targe': item.targe ,bagc:item.children.length==0}" @click="toggleClass(item)"></div>
                <input type="radio" class="radio" :checked="item.check==item.id" :name='item.id' @click="select(item)">
				{{item.name}}
				<tree v-show="!item.targe" @showselectName="select" :data="item.children"></tree>
			</li>
		</ul>
    <!-- </div> -->
</template>
<script>
	import methods from "../methods";
	import { mapState, mapActions } from 'vuex'
    export default{
		name:"tree",
		props: {
			data: Array,
			name: String,
			loading: Boolean
		},
		data(){
			return {
				// data:[],
				list:'',
				selectlist:[],
			}
		},
		created(){
		},
		methods:{
			toggleClass(item){
				if(item.targe){
					item.targe=false
				}else{
					item.targe=true
				}
				var data=this.data
				this.data=[]
				this.data=data
			},
			select(val){
				var data=this.data
				this.data=[]
				this.data=data
				// this.data=this.data.splice(0,this.data.length)
				this.$emit('showselectName',val)
			},
		},
		watch:{
		
		}
		
	}   
</script>
<style scoped>
	.icon{
		display: inline-block;
		width:0;
		height:0;
		border-width:0.2rem 0.15rem 0;
		border-style:solid;
		border-color:#6e7070 transparent transparent;/*灰 透明 透明 */
		position:relative;
	}
	.targe{
		transform: rotate(-90deg);
		-ms-transform: rotate(-90deg); /* IE 9 */
		-webkit-transform: rotate(-90deg);
	}
	.bagc{
		border-color:transparent;/*灰 透明 透明 */
	}
	li{
		margin-top: 0.1rem;
		padding-left:0.4rem;
		vertical-align:bottom;
		font-size: 0.3rem !important;
	}
	input{
		width: 0.3rem;
		height: 0.3rem;
	}
</style>
