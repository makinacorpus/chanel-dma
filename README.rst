Chanel Digital Asset Management
===============================

Install
-------

::
    sudo apt-get install git
    git clone git@github.com:makinacorpus/chanel-dma.git ./tmp
    mv ./tmp/.git .
    rm -rf ./tmp
    git reset --hard HEAD
    bin/buildout -Nv