/**
 * 创建Promise
 * @param {*}} cb 
 * @returns 
 */
export function createPromise(cb) {
	var promise = new Promise((resolve, reject) => {
		let success = function (...args) {
			return resolve(...args);
		};
		let error = function (...args) {
			return reject(...args);
		};
		try {
			cb && cb(success, error)
		} catch (ex) {
			error(ex);
		}
	});

	return promise;
}