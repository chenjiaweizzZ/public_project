import request from "@/plugins/request";

export function getTableDictionaryList(params) {
  return request({
    url: "/getTableDictionaryList",
    method: "post",
    params,
  });
}

export function getDictionaryByType(params) {
  return request({
    url: "/getDictionaryByType",
    method: "post",
    params,
  });
}

export function addTableDictionary(data) {
  return request({
    url: "/addTableDictionary",
    method: "post",
    data,
  });
}

export function updateTableDictionary(data) {
  return request({
    url: "/updateTableDictionary",
    method: "post",
    data,
  });
}
