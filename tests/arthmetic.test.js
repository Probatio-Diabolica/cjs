import {run , assert} from "./includes.js";


assert(
  run(`int main(){ return 1 + 2 * 3; }`) === 7,
  "precedence failed"
);

assert(
  run(`int main(){ return (1 + 2) * 3; }`) === 9,
  "parentheses failed"
);

assert(
  run(`int main(){ return 5 % 2; }`) === 1,
  "modulo failed"
);
