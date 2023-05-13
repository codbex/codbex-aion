# Docker descriptor for codbex-aion
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:latest

COPY codbex-aion target/dirigible/repository/root/registry/public/codbex-aion
COPY codbex-aion-data target/dirigible/repository/root/registry/public/codbex-aion-data
COPY codbex-ext target/dirigible/repository/root/registry/public/codbex-ext

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-aion/gen/index.html
