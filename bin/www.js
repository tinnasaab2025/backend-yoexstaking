#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../server/server.js";
import DBG from "debug";
const debug = DBG("backend:server");
import { createServer } from "http";
import emitter from "events";

// import Redis from 'ioredis';

// emitter.defaultMaxListeners = emitter.defaultMaxListeners + 3;
emitter.defaultMaxListeners = 500;

// const redis = new Redis();

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 3006;


app.set("port", port);

/**
 * Create HTTP server.
 */

let server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}