these scripts were just extract out of the lambda docker image.
Just have them here for reference
there are some flasg in localstack that let you override these easily if you really need to


check out the localstack source code
https://vscode.dev/github/localstack/localstack/blob/master/localstack-core/localstack/services/lambda_/invocation/docker_runtime_executor.py#L404

basically
debug-bootstrap.sh should be a copy of lambda-entrypont.sh but point to your own version of bootstrap
in bootstrap you can modify how node is called etc


# DEV: 0 (default) Enable for mounting of RIE init binary and delve debugger
LAMBDA_INIT_DEBUG=true
# dlv binarry required aswell just an implmentation detail
LAMBDA_INIT_DELVE_PATH=/app/scripts/lambda-debug/dlv
# # DEV: path to entrypoint script (e.g., var/rapid/entrypoint.sh)
LAMBDA_INIT_BOOTSTRAP_PATH=/app/scripts/lambda-debug/debug-bootstrap.sh

# # DEV: path to RIE init binary (e.g., var/rapid/init) optional
LAMBDA_INIT_BIN_PATH =
