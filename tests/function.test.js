import {run , assert} from "./includes.js";

assert(
    run(`
        int add(int a, int b) {
            return a + b;
        }

        int main() {
            return add(2, 3);
        }
    `) === 5,
    "function call failed"
);

//recursive tests

// factorial
assert(
  run(`
    int fact(int n) {
      if (n == 0) {
        return 1;
      }
      return n * fact(n - 1);
    }

    int main() {
      return fact(5);
    }
  `) === 120,
  "factorial recursion failed"
);

// fibonacci 
assert(
  run(`
    int fib(int n) {
      if (n <= 1) {
        return n;
      }
      return fib(n - 1) + fib(n - 2);
    }

    int main() {
      return fib(6);
    }
  `) === 8,
  "fibonacci recursion failed"
);

