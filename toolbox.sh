function setup() {
  npm install
  export PATH=$PATH:$PWD/node_modules/.bin
}

function test() {
  truffle test
}

function coverage() {
  truffle run coverage
}