FROM node:8-onbuild

EXPOSE 5000

CMD["node","./server/server.js"]
