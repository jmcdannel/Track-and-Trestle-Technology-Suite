import { createConsola } from "consola";

const logger = createConsola({
  level: 4,
  fancy: true,
  formatOptions: {
      colors: true,
      compact: false,
      date: false,
  }
});

export default logger;
