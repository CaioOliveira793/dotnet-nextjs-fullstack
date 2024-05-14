#/usr/bin/env bash

set -e;

OUTPUT_PATH='out';

rm -rf $OUTPUT_PATH;

dotnet build --configuration 'Release' --output $OUTPUT_PATH;
