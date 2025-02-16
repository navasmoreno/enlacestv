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
# RUN npm install -g npm@11.1.0;
# CMD echo "----------- START RUNNING -----------"&&\
#     echo "----------- npm-check-updates -----------"&&\
#     npm i -g npm-check-updates && ncu -u &&\
#     echo "----------- npm install -----------"&&\
#     npm install &&\
#     echo "----------- UNINSTALLING CHECK-UPDATES -----------"&&\
#     npm uninstall -g npm-check-updates &&\#     
#     echo "----------- END INSTALLING -----------"&&\
#     echo "----------- RUN SERVER -----------"&&\
#     chmod 777 -R .&&\ 
#     npm run serve;

# Para proyecto en desarrollo
WORKDIR /usr/src/apps/${APP_NAME}
RUN npm update;
CMD echo "----------- START RUNNING -----------"&&\
    chmod 777 -R .&&\
    echo "----------- RUN SERVER -----------"&&\
    npm run serve;

EXPOSE 8080
