FROM public.ecr.aws/docker/library/node:18.15-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn --silent
COPY . /app
RUN mkdir /app/images
CMD ["yarn", "start_serv"]