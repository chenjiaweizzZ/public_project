import $ from 'jquery'
import methods from '@/methods'

const api = {
    // 验证是否可以审核
    validateCheck(list) {
        return new Promise((resolve, reject) => {
            methods.post('/turnManual/validateCheck', {
                command: 'turnManual/validateCheck',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                beanList: list,
            }).done((data) => {
                if (data && data.errcode == 0) {
                    if (data.itemList.length > 0) {
                        let arrId = [];
                        data.itemList.map((item, index) => {
                            let val = Object.keys(item);
                            arrId.push(val[0]);
                        })
                        reject(arrId);
                    } else {
                        resolve(data);
                    }
                }
            })
        })
    },
}

export default api;