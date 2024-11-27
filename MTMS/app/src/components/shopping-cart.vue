<template>
	<div class="shopping-wraper">
		<div class="shopping-cart-bottom">
			<div class="shopping-cart-num shopping-cart-70"  @click="continue_toggle(2)" v-if="show_continue_mark == 1">
				<span class="shopping-cart-icon"></span>
				<span class="shopping-cart-txt">已选中{{shopping_total}}件商品</span>
			</div>
			<div class="shopping-cart-num shopping-cart-50" @click="continue_toggle(1)" v-if="show_continue_mark == 2">
				<div class="shopping-continue-btn">继续添加</div>
			</div>
			<div class="shopping-save-btn" :class="show_continue_mark == 2 ? 'shopping-cart-50' : 'shopping-cart-30'" >
				<a href="javascript:void(0)" @click="saveShooping" >保存</a>
			</div>
		</div>
		<div class="shopping-cart-list" v-if="show_continue_mark == 2">
			<ul class="shopping-cart-ul">
				<li v-for="(item,index) in shopping_checked_list">
					<div class="shopping-list-name">
						<a href="javascript:void(0)" class="shopping-list-del" @click="delete_shopping_item(index)"></a>
						<span>{{item.assetname}}</span>
					</div>
					<div class="shopping-cart-count">
						<a href="javascript:void(0)" @click="shopping_count_reduce(item)">-</a>
						<span class="shopping-cart-counts">{{item.storenum || 0}}</span>
						<a href="javascript:void(0)" @click="shopping_count_add(item)">+</a>
					</div>
				</li>
			</ul>
		</div>
		<div class="shopping-gray" v-show="show_continue_mark == 2"></div>
	</div>
</template>

<script>
	export default{
		name:"shopingCart",
		props:["shoppingSelectedList"],
		data(){
			return {
				show_continue_mark:1,
				shopping_checked_list:[],
				shopping_total:0
			}
		},
		created(){
			this.shopping_checked_list = this.shoppingSelectedList;
		},
		methods:{
			saveShooping(){
				this.$router.push({name:"borrow_form"});
				this.$emit("total_num_fn",this.shopping_total);
			},
			continue_toggle(mark){
				this.show_continue_mark = mark;
			},
			shopping_count_add(item){
				
				item.storenum++;
				this.shopping_total++;
			},
			
			shopping_count_reduce(item){
				if(item.storenum > 0){
					item.storenum--;
					this.shopping_total--;
				}else{
					return;
				}
			},
			delete_shopping_item(index){
				this.shopping_checked_list.splice(index,1);
				this.shopping_total = this.shopping_total-this.shopping_checked_list[index].storenum;
			}
		},
		watch:{
			shoppingSelectedList(newval){
				this.shopping_checked_list = newval;
			}
		}
		
	}
</script>

<style scoped="scoped">
	.shopping-wraper{
		width:100%;
		position:fixed;
		background: #fff;
		bottom:0;
	}
	.shopping-cart-bottom{
		width:100%;
		height:0.7rem;
		background:#fff;
		border-top:1px solid #ddd;
		position: fixed;
		bottom:0;
		z-index:2;
	}
	
	.shopping-cart-icon{
		background-image:url("../assets/images/shoppingcart.png");
		background-size:cover;
		display:block;
		width:0.4rem;
		height:0.4rem;
		margin-top:0.1rem;
		margin-left:0.1rem;
	}
	.shopping-cart-num{
		float:left;
	}
	.shopping-cart-50{
		width:50%;
		text-align:center;
		background:#ddd;
	}
	.shopping-cart-70{
		width:70%;
	}
	.shopping-cart-num span{
		float:left;
		line-height: 0.6rem;
	}
	.shopping-cart-num span:nth-child(2){
		margin-left:10px;
	}
	.shopping-save-btn{
		float:right;
	}
	.shopping-save-btn a{
		display:block;
		float:right;
		background:#3499db;
		text-align:center;
		line-height:0.6rem;
		color:#fff;
		width:100%;
	}
	.shopping-continue-btn{
		line-height:0.6rem;
	}
	.shopping-cart-30{
		width:30%;
	}
	.shopping-cart-count{
		flex:3;
		font-size:0.3rem;
	}
	.shopping-cart-list{
		position:fixed;
		bottom:0.7rem;
		background:#fff;
		width:100%;
		display:flex;
		z-index:2;
	}
	.shopping-cart-ul{
		width:100%;
	}
	.shopping-cart-ul li{
		display:flex;
		height:1rem;
		border-top:1px solid #ddd;
		line-height:1rem;
	}
	.shopping-cart-ul li .shopping-list-name{
		flex:7;
		
	}
	.shopping-list-name a,.shopping-list-name span{
		float:left;
		line-height:1rem;
	}
	.shopping-cart-ul li .shopping-cart-counts{
		line-height:0.6rem;
		font-size:0.3rem;
		padding:0 0.25rem;
		background:#ddd;
		height:0.6rem;
		margin-top:0.2rem;
	}
	.shopping-list-del{
		display:block;
		width:0.4rem;
		height:0.4rem;
		background-image:url("../assets/images/delshopping.png");
		background-size:cover;
		margin-top:0.3rem;
	}
	.shopping-gray{
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.5);
		position:fixed;
		left:0;
		top:0;
		
	}
</style>