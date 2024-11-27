# 依赖的镜像
FROM nginx:alpine

RUN echo http://mirrors.ustc.edu.cn/alpine/v3.7/main > /etc/apk/repositories 
RUN  echo http://mirrors.ustc.edu.cn/alpine/v3.7/community >> /etc/apk/repositories
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
COPY dist /usr/share/nginx/html
COPY run.sh /run.sh
RUN chmod +x run.sh
CMD ["sh", "run.sh"]


