FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY index.html vite.config.ts vite-env.d.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src

ARG VITE_API_BASE_URL
ARG VITE_SOCKET_SERVER_URL
ARG VITE_QUEUE_SERVER_URL
ARG VITE_OPENCV_SCRIPT_URL
ARG VITE_FONT_STYLESHEET_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_SERVER_URL=$VITE_SOCKET_SERVER_URL
ENV VITE_QUEUE_SERVER_URL=$VITE_QUEUE_SERVER_URL
ENV VITE_OPENCV_SCRIPT_URL=$VITE_OPENCV_SCRIPT_URL
ENV VITE_FONT_STYLESHEET_URL=$VITE_FONT_STYLESHEET_URL

RUN test -n "$VITE_API_BASE_URL" \
  && test -n "$VITE_SOCKET_SERVER_URL" \
  && test -n "$VITE_QUEUE_SERVER_URL" \
  && test -n "$VITE_OPENCV_SCRIPT_URL" \
  && test -n "$VITE_FONT_STYLESHEET_URL"

RUN npm run build

FROM nginx:1.28-alpine

RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '}' \
  > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
