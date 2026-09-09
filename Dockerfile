FROM node:24-alpine
ARG COD5_REVISION
LABEL org.opencontainers.image.revision=$COD5_REVISION
WORKDIR /app
ENV NODE_ENV=production PORT=8080 COD5_DATABASE_FILE=/data/editorial.sqlite
COPY output/server.mjs /app/server.mjs
COPY dist /app/dist
COPY server/backup.mjs /app/backup.mjs
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:8080/api/telegram/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "/app/server.mjs"]
