// Copyright 2021 Marcin Zepp <nircek-2103@protonmail.com>
// Copyright 2021 Michał Szymocha <szymocha.michal@gmail.com>
// Copyright 2021 Marcin Wykpis <marwyk2003@gmail.com>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// don't forget to update deno and denon in Dockerfile and denon.dockerfile
export { parse } from "https://deno.land/std@0.100.0/encoding/yaml.ts";
export { existsSync, walkSync } from "https://deno.land/std@0.100.0/fs/mod.ts";
export {
  basename,
  common,
  join,
} from "https://deno.land/std@0.100.0/path/mod.ts";
export { normalize as _normalize } from "https://deno.land/std@0.100.0/path/mod.ts";
export { pbkdf2Sync } from "https://deno.land/std@0.100.0/node/crypto.ts";
export { createHash } from "https://deno.land/std@0.100.0/hash/mod.ts";

export type {
  Context,
  RouterContext,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
export {
  Application,
  HttpError,
  httpErrors,
  Router,
  send,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
export {
  compare,
  hash,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import "https://deno.land/x/bcrypt@v0.2.4/src/worker.ts"; // force caching
export { default as vs } from "https://deno.land/x/value_schema@v3.0.0/mod.ts";
export type {
  ObjectTypeOf,
  SchemaObject,
} from "https://deno.land/x/value_schema@v3.0.0/dist-deno/libs/types.ts";
export { MongoClient } from "https://deno.land/x/mongo@v0.23.1/mod.ts";
export type { Collection } from "https://deno.land/x/mongo@v0.23.1/src/collection/mod.ts";
export {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.2/mod.ts";
export type { Algorithm } from "https://deno.land/x/djwt@v2.2/algorithm.ts";

export {
  browserCrypto,
  MersenneTwister19937,
  Random,
} from "https://cdn.skypack.dev/random-js@v2.1.0?dts";
