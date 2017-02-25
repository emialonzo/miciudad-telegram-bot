FROM node:6.9.1
MAINTAINER Lu Pa <admin@tedic.org>

RUN mkdir code

ADD package.json code
ADD src/ code/src
ADD .env code

WORKDIR code

RUN npm install

CMD ["npm", "start"]

