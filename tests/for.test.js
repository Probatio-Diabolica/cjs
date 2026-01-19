import {run , assert} from "./includes.js";


assert(
  run(`
    int main() {
      int sum = 0;
      for (int i = 1; i <= 5; i = i + 1) {
        sum = sum + i;
      }
      return sum;
    }
  `) === 15,
  "for loop failed"
);
