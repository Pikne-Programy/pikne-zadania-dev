FROM node:14.15
WORKDIR /app
COPY package*.json ./
RUN npm install
# https://github.com/angular/angular-cli/issues/17017#issuecomment-609921036
RUN ./node_modules/.bin/ngcc --properties es2015
COPY . .
CMD npm run build -- --output-path=dist --watch
