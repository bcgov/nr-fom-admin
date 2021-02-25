
FROM node:12-alpine AS ui-admin
WORKDIR /usr/src/app/
COPY . ./nr-fom-admin/
WORKDIR /usr/src/app/nr-fom-admin
RUN npm cache clean --force && npm install @angular/cli && npm install && npm run build

FROM node:12-alpine AS server-build
WORKDIR /root/
COPY --from=ui-admin /usr/src/app/nr-fom-admin/dist nr-fom-admin/dist
COPY ./openshift/package*.json ./
RUN npm install
COPY ./openshift/server.js .

EXPOSE 4200

CMD ["node", "server.js"]
