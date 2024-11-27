echo ${BASE_URL}

find /usr/share/nginx/html/js/*.js | xargs sed -i "s/https:\/\/cdrapi.zwjk.com/${BASE_URL}/g"
nginx -g "daemon off;"
