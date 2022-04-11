for d in ./examples/* ; do
    cd $d
    yarn add @types/react@latest
    yarn add @types/react-dom@latest
    cd ../../
done