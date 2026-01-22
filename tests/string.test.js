import {run , assert} from "./includes.js"

assert(
  run(`
    int main() {
        char s[4] = "hi";
        return s[0] == 'h';
    }
  `) === 1,
  "string literal should expand to char array with null terminator"
);



let threw = false;
try {
  run(`
    int main() {
        char s[2] = "hi";
        return 0;
    }
  `);
} catch {
  threw = true;
}

assert(threw, "string literal too long should throw");
