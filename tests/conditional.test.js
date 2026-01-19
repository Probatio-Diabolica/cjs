import {run , assert} from "./includes.js";


assert(
  run(`
    int main() {
      if (0) return 1;
      else return 2;
    }
  `) === 2,
  "else branch not executed"
);

assert(
  run(`
    int main() {
      if (1) return 1;
      else return 2;
    }
  `) === 1,
  "then branch incorrect"
);
