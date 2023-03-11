npm ci &&
npm run clean -w riffle-server &&
npm run build -w riffle-client -- --configuration=production --output-path ../riffle-server/lib/static &&
npm run build -w riffle-server
