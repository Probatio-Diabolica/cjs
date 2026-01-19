import {run , assert} from "./includes.js";


assert(
  run(`int main(){ if (5 > 3) return 1; return 0; }`) === 1,
  "> failed"
);

assert(
  run(`int main(){ if (5 < 3) return 1; return 0; }`) === 0,
  "< failed"
);

assert(
  run(`int main(){ if (5 == 5) return 1; return 0; }`) === 1,
  "== failed"
);

assert(
  run(`int main(){ if (5 != 5) return 1; return 0; }`) === 0,
  "!= failed"
);

assert(
  run(`int main(){ if (3 + 2 * 2 == 7) return 1; return 0; }`) === 1,
  "precedence + comparison failed"
);
