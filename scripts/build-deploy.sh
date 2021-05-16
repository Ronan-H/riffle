sh ./scripts/build.sh &&
git add . &&
git commit -m "$(printf "Build deploy - `date`")" &&
sh ./scripts/deploy.sh