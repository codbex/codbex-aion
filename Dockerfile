# Docker descriptor for codbex-aion
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:1.6.0

COPY codbex-aion target/dirigible/repository/root/registry/public/codbex-aion
COPY codbex-aion-data target/dirigible/repository/root/registry/public/codbex-aion-data
COPY codbex-aion-ext target/dirigible/repository/root/registry/public/codbex-aion-ext

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-aion/gen/index.html
