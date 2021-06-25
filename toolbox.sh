function setup() {
  npm install
  export PATH=$PATH:$PWD/node_modules/.bin
}

function test() {
  truffle test
}

function coverage() {
  truffle run coverage
  sleep 3
  rm coverage.json # CLI option does not seem to exist from --help output
}

function coverage-html() {
  coverage
  open coverage/index.html
}
