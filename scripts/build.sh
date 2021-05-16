cd riffle-client &&
npm install &&
ng build --output-path ../riffle-server/lib/static &&
cd ../riffle-server &&
npm run clean &&
npm install &&
tsc &&
node node_modules/copyfiles/copyfiles package.json ./lib &&
node node_modules/copyfiles/copyfiles arena.env ./lib