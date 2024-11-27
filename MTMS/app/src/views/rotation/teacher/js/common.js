import $ from 'jquery'
import methods from '@/methods'

const api = {
    judgeStuWrite(id) {
        return new Promise((resolve, reject) => {
            methods.post('/turnAppraise/tecValidate', {
                command: 'turnAppraise/tecValidate',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                detailId: id,
            }).done(function (data) {
                resolve(data.validate);
            }).fail(function (error) {
                reject(error);
            })
        })
    }
}

export default api;