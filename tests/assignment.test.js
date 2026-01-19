import {run , assert} from "./includes.js";

assert(
  run(`
    int main() {
      int x = 10;
      int y = 11;
      if (x < y) x = y;
      return x;
    }
  `) === 11,
  "assignment failed"
);

assert(
  run(`
    int main() {
      int x = 1;
      x = x + 2;
      return x;
    }
  `) === 3,
  "self-assignment failed"
);
