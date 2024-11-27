FROM nginx:alpine

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY flup-pc/dist /usr/share/nginx/html/pc
COPY flup-h5/dist /usr/share/nginx/html/h5
COPY flup-wecom/dist /usr/share/nginx/html/wecom

#覆盖父容器的 ENTRYPOINT ["/docker-entrypoint.sh"] 方便使用自己的命令启动nginx
#ENTRYPOINT [""]

# CMD 只能有一个  所以使用&& 执行多个命令  url里面有"/"需要使用","作为分隔符
 CMD  echo "开始替换url $ICDMApiUrl, $SmartFormUrl " \
 && sed -i "s,https://zjhmdemoapi.zwjk.com,$ICDMApiUrl,g"   /usr/share/nginx/html/pc/static/js/*.js\
 && sed -i "s,https://zjhmdemoform.zwjk.com,$SmartFormUrl,g"   /usr/share/nginx/html/pc/static/js/*.js\
 && sed -i "s,https://zjhmdemoapi.zwjk.com,$ICDMApiUrl,g"   /usr/share/nginx/html/h5/static/js/*.js\
 && sed -i "s,https://bkplatformphoneclient_test.zwjk.com,$YTHYY,g"   /usr/share/nginx/html/h5/static/js/*.js\
 && /docker-entrypoint.sh nginx  -g  "daemon off;"
