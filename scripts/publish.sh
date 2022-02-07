yarn build &&\ 
cp package.json dist/package.json &&\
yarn patchJSON &&\
cd dist &&\
yarn publish