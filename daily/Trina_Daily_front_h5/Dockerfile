FROM nginx:1.13.7-alpine
COPY ./default.conf /etc/nginx/conf.d/
COPY ${dist} /usr/share/nginx/html/
ADD ./start.sh /usr/local/
RUN chmod +x /usr/local/start.sh
ENTRYPOINT ["sh","-c","/usr/local/start.sh"]