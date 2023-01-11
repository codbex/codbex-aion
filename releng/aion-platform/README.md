# codbex-aion-platform

The `codbex` `aion` platform package

To build the docker image:

    docker build -t codbex-aion-platform:latest .

To run a container:

    docker run --name aion --rm -p 8080:8080 -p 8081:8081 codbex-aion-platform:latest
    
To stop the container:

    docker stop aion

To tag the image:

    docker tag codbex-aion-platform codbex.jfrog.io/codbex-docker/codbex-aion-platform:latest

To push to JFrog Container Registry:

    docker push codbex.jfrog.io/codbex-docker/codbex-aion-platform:latest

To pull from JFrog Container Registry:

    docker pull codbex.jfrog.io/codbex-docker/codbex-aion-platform:latest
