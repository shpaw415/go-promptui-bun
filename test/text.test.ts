import { test } from "bun:test";
import { text } from "../src";

test("Text prompt", () => {
  text({
    label: "Label:",
    default: "Default value",
    validate: (input) => {
      console.log("Validating input:", input);
      if (input.length < 3) {
        return "Input must be at least 3 characters long.";
      }
      return null;
    },
  });
});
