
cd dist
yarn link
cd ../


cd ./node_modules/react
yarn link
cd ../../
cd ./node_modules/react-dom
yarn link
cd ../../
cd ./node_modules/three
yarn link
cd ../../
cd ./node_modules/@react-three/fiber
yarn link
cd ../../../

# for d in ./examples/* ; do
#     cd $d
#     yarn link lamina
#     yarn link react
#     yarn link react-dom
#     yarn link three
#     yarn link @react-three/fiber
#     cd ../../
# done

cd ./examples/mesh-gradients
yarn link lamina
yarn link react
yarn link react-dom
yarn link three
yarn link @react-three/fiber
cd ../../