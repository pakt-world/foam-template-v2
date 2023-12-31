#!/bin/bash
# no verbose
set +x
# config
envFilename='.env'
nextFolder='./.next/'
function apply_path {
  # read all config file  
  while read line; do
    echo "${line}"
    # no comment or not empty
    if [ "${line:0:1}" == "#" ] || [ "${line}" == "" ]; then
      continue
    fi
    # split
    configName="$(cut -d'=' -f1 <<<"$line")"
    configValue="$(cut -d'=' -f2 <<<"$line")"
    # get system env
    envValue=$(env | grep "^$configName=" | grep -oe '[^=]*$');
    echo "values-to-replace: ${configValue}----${envValue}"
    
    # if config found
    if [ -n "$configValue" ] && [ -n "$envValue" ]; then
      # replace all
      echo "Replace: ${configValue} with: ${envValue} for: ${configName}"
      find $nextFolder \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#$configValue#$envValue#g"
    fi
  done < $envFilename
}
apply_path
echo "Starting Nextjs"
exec "$@"