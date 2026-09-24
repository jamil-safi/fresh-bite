import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 4000;

// Defense in depth: every route is already wrapped in asyncHandler, but this
// ensures a stray unhandled rejection elsewhere logs loudly instead of
// silently killing the process (Node terminates on unhandled rejections by
// default since v15).
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`FreshBites API listening on port ${PORT}`);
});
