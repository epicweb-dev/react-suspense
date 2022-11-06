FROM gitpod/workspace-full:latest

# Custom node version
# https://www.gitpod.io/docs/introduction/languages/javascript#node-versions
RUN bash -c 'VERSION="18.12.0" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
