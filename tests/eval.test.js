import {run , assert} from "./includes.js";


const source = `
int main() {
  if(0) return 11;
  return 0;
}
`;


assert(run(source)==0, "Expected program to return 0");
