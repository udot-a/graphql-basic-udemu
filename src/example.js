const sumArray = arr =>
  (function recurse(idx) {
    return idx < arr.length && arr[idx] + recurse(++idx)
  })(0)

console.log(sumArray([1,2,3,4,5]));

const fact = n =>
  n < 2 ? 1 : n * fact(--n);

console.log(fact(4));

const pause = ms => new Promise((r) => setTimeout(() => r(), ms));

// console.log("ONE...")
// pause(2000).then(() => console.log("TWOO..."))
// pause(4000).then(() => console.log("THIRD..."))
(async() => {
  console.log("START...");
  await pause(1000);
  console.log("ONE...");
  await pause(1000);
  console.log("TWO...");
  await pause(1000);
  console.log("THREE...");

})()

const user = {
  firstName: "Andrii",
  lastName: "Udot",
  age: 42,
  city: "Kharkiv",
  [Symbol.iterator]: function*(){
    for (let key in this) {
      yield this[key]
    }
  }
}

console.log([...user]);

const counterClouser = n => () => ++n;

const counter = counterClouser(0);

const counterGenerator = startCount =>
  function* () {
    while (true) {
      yield ++startCount;
    }
  }

const genCount = counterGenerator(0);

for (let i= 0; i<=10; i++) {
  console.log(counter());
  console.log("Generator counter: ", genCount().next().value);

}

const proxy = new Proxy({}, {
  get: function (obj, prop) {
    if (!obj[prop]) {
      return "Value is empty!!!"
    }

    return obj[prop];
  }
});

console.log(proxy.a)

