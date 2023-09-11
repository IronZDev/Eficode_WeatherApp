# Use Node 16 LTS
FROM node:16
# Declare build args with defaults
ARG PORT=9000
ARG ENV=prod
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
# Install npm packages
RUN npm install
# Bundle app source
COPY . .
# Expose desired port
EXPOSE $PORT
# Run app
RUN echo "The env is: $ENV"
# Copy build arg to ENV var
ENV ENV $ENV
# Excec command
CMD if [ "$ENV" = "dev" ]; \
    then npm run dev; \
    else npm start; \
    fi
