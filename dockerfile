#Descarga la imagen node para instalar angular
FROM node:lts-alpine

ARG APP_NAME


# Arrancar un nuevo proyecto
# RUN npm i -g @vue/cli && npm i -g @vue/cli-init;
# WORKDIR /usr/src/apps
# CMD rm -r -f ${APP_NAME}\
#     && vue create --no-git --default --force --skipGetStarted ${APP_NAME}\
#     && cd ${APP_NAME}\
#     && chmod 777 -R .\
#     && npm run serve;

#Para proyecto migrado
# WORKDIR /usr/src/apps/${APP_NAME}
# CMD npm install &&\
#     chmod 777 -R .&&\ 
#     npm run serve;

# Para proyecto en desarrollo
WORKDIR /usr/src/apps/${APP_NAME}
RUN npm i -g yarn --force;
CMD chmod 777 -R .&&\
    npm run serve;

EXPOSE 8080
