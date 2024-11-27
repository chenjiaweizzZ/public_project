export default {
	data() {
		return {
			categoryList: [],
			category: null
		}
	},
	methods: {
		getCategory(params) {
			return this.$apis
				.getQuestionnarireCategory({
					type: params
				})
				.then((res) => {
					const mapFn = (arr) => {
						return arr.map((element) => {
							let obj = {}
							obj.label = element.text
							obj.id = element.id
							obj.isDefaultExpanded = element.isexpand
							if (element.ChildNodes.length > 0) {
								obj.children = mapFn(element.ChildNodes)
							}
							return obj
						})
					}
					this.categoryList = mapFn(res)
				})
		},
		getCategoryV2(params) {
			let a = null
			if (params == 3) {
				a = 'XJFL'
			} else if (params == 2) {
				a = 'WJFL'
			}
			// return this.$apis.BaseDictGetDictsByDictCode({
			//   dictCode: a
			// }).then((res) => {
			//   const mapFn = (arr) => {
			//     return arr.map(element => {
			//       let obj = {}
			//       obj.label = element.dict_name
			//       obj.id = element.serial_no
			//       obj.isDefaultExpanded = element.isexpand
			//       if (element.children) {
			//         if (element.children.length > 0) {
			//           obj.children = mapFn(element.children)
			//         }
			//       }
			//       return obj
			//     })
			//   }
			//   this.categoryList = mapFn(res)
			// })
		}
	}
}
