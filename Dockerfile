# stage1 - build react app first 
FROM public.ecr.aws/docker/library/node:20-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV VITE_NODE_APP_URL https://api.swapcircle.au
COPY ./package.json /app/
RUN npm i
COPY . /app
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM public.ecr.aws/nginx/nginx:1.27.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]