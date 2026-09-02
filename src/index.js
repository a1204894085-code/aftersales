var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../usr/local/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd2) {
    this.fd = fd2;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd2) {
    this.fd = fd2;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../usr/local/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process2 extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../usr/local/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../usr/local/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// index.js
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2 = class {
  static {
    __name(this, "PerformanceEntry");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3 = class PerformanceMark22 extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMark2");
  }
  static {
    __name2(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMeasure");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2 = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2 = class {
  static {
    __name(this, "Performance");
  }
  static {
    __name2(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2 = class {
  static {
    __name(this, "PerformanceObserver");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
if (!("__unenv__" in performance2)) {
  const proto = Performance2.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2, key, desc);
      }
    }
  }
}
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
  return BigInt(Date.now() * 1e6);
}, "bigint"), "bigint") });
var ReadStream2 = class {
  static {
    __name(this, "ReadStream");
  }
  static {
    __name2(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd2) {
    this.fd = fd2;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream2 = class {
  static {
    __name(this, "WriteStream");
  }
  static {
    __name2(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd2) {
    this.fd = fd2;
  }
  clearLine(dir32, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env22) {
    return 1;
  }
  hasColors(count32, env22) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION2 = "22.14.0";
var Process2 = class _Process extends EventEmitter2 {
  static {
    __name(this, "_Process");
  }
  static {
    __name2(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd22) {
    this.#cwd = cwd22;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2}`;
  }
  get versions() {
    return { node: NODE_VERSION2 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var workerdProcess2 = getBuiltinModule2("node:process");
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess2.nextTick
});
var { exit: exit2, features: features2, platform: platform2 } = workerdProcess2;
var {
  _channel: _channel2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _disconnect: _disconnect2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _handleQueue: _handleQueue2,
  _kill: _kill2,
  _linkedBinding: _linkedBinding2,
  _maxListeners: _maxListeners2,
  _pendingMessage: _pendingMessage2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _send: _send2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  assert: assert22,
  availableMemory: availableMemory2,
  binding: binding2,
  channel: channel2,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  disconnect: disconnect2,
  dlopen: dlopen2,
  domain: domain2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exitCode: exitCode2,
  finalization: finalization2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getMaxListeners: getMaxListeners2,
  getuid: getuid2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  hrtime: hrtime32,
  initgroups: initgroups2,
  kill: kill2,
  listenerCount: listenerCount2,
  listeners: listeners2,
  loadEnvFile: loadEnvFile2,
  mainModule: mainModule2,
  memoryUsage: memoryUsage2,
  moduleLoadList: moduleLoadList2,
  nextTick: nextTick2,
  off: off2,
  on: on2,
  once: once2,
  openStdin: openStdin2,
  permission: permission2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  reallyExit: reallyExit2,
  ref: ref2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  send: send2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  setuid: setuid2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  sourceMapsEnabled: sourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  throwDeprecation: throwDeprecation2,
  title: title2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  unref: unref2,
  uptime: uptime2,
  version: version2,
  versions: versions2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = /* @__PURE__ */ __name2(function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
}, "freb");
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = /* @__PURE__ */ __name2((function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
}), "hMap");
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var shft = /* @__PURE__ */ __name2(function(p) {
  return (p + 7) / 8 | 0;
}, "shft");
var slc = /* @__PURE__ */ __name2(function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
}, "slc");
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = /* @__PURE__ */ __name2(function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
}, "err");
var wbits = /* @__PURE__ */ __name2(function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
}, "wbits");
var wbits16 = /* @__PURE__ */ __name2(function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
}, "wbits16");
var hTree = /* @__PURE__ */ __name2(function(d, mb) {
  var t = [];
  for (var i2 = 0; i2 < d.length; ++i2) {
    if (d[i2])
      t.push({ s: i2, f: d[i2] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i22].f ? i0++ : i22++];
    r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i2 = 1; i2 < s; ++i2) {
    if (t2[i2].s > maxSym)
      maxSym = t2[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i2 < s; ++i2) {
      var i2_1 = t2[i2].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i2].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt; --i2) {
      var i2_3 = t2[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
}, "hTree");
var ln = /* @__PURE__ */ __name2(function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
}, "ln");
var lc = /* @__PURE__ */ __name2(function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = /* @__PURE__ */ __name2(function(v) {
    cl[cli++] = v;
  }, "w");
  for (var i2 = 1; i2 <= s; ++i2) {
    if (c[i2] == cln && i2 != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i2];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
}, "lc");
var clen = /* @__PURE__ */ __name2(function(cf, cl) {
  var l = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l += cf[i2] * cl[i2];
  return l;
}, "clen");
var wfblk = /* @__PURE__ */ __name2(function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i2 = 0; i2 < s; ++i2)
    out[o + i2 + 4] = dat[i2];
  return (o + 4 + s) * 8;
}, "wfblk");
var wblk = /* @__PURE__ */ __name2(function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    ++lcfreq[lclt[i2] & 31];
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    ++lcfreq[lcdt[i2] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p + 3 * i2, lct[clim[i2]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    var sym = syms[i2];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
}, "wblk");
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = /* @__PURE__ */ __name2(function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = /* @__PURE__ */ __name2(function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    }, "hsh");
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i2 + 2 < s; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s - i2;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l] == dat[i2 + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i2 - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
      syms[li++] = dat[i2];
      ++lf[dat[i2]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i2, st.w = wi;
    }
  } else {
    for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
      var e = i2 + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i2, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
}, "dflt");
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i2 = 0; i2 < 256; ++i2) {
    var c = i2, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i2] = c;
  }
  return t;
})();
var crc = /* @__PURE__ */ __name2(function() {
  var c = -1;
  return {
    p: /* @__PURE__ */ __name2(function(d) {
      var cr = c;
      for (var i2 = 0; i2 < d.length; ++i2)
        cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
      c = cr;
    }, "p"),
    d: /* @__PURE__ */ __name2(function() {
      return ~c;
    }, "d")
  };
}, "crc");
var dopt = /* @__PURE__ */ __name2(function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
}, "dopt");
var mrg = /* @__PURE__ */ __name2(function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
}, "mrg");
var wbytes = /* @__PURE__ */ __name2(function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
}, "wbytes");
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
__name(deflateSync, "deflateSync");
__name2(deflateSync, "deflateSync");
var fltn = /* @__PURE__ */ __name2(function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
}, "fltn");
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i2 = 0; i2 < str.length; ++i2)
      ar_1[i2] = str.charCodeAt(i2);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = /* @__PURE__ */ __name2(function(v) {
    ar[ai++] = v;
  }, "w");
  for (var i2 = 0; i2 < l; ++i2) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i2 << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i2);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
__name(strToU8, "strToU8");
__name2(strToU8, "strToU8");
var exfl = /* @__PURE__ */ __name2(function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
}, "exfl");
var wzh = /* @__PURE__ */ __name2(function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
}, "wzh");
var wzf = /* @__PURE__ */ __name2(function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
}, "wzf");
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i2 = 0; i2 < files.length; ++i2) {
    var f = files[i2];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
__name(zipSync, "zipSync");
__name2(zipSync, "zipSync");
var XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
function escXml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
__name(escXml, "escXml");
__name2(escXml, "escXml");
function colLetter(index) {
  let s = "";
  let i2 = index + 1;
  while (i2 > 0) {
    const m = (i2 - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    i2 = Math.floor((i2 - 1) / 26);
  }
  return s;
}
__name(colLetter, "colLetter");
__name2(colLetter, "colLetter");
function contentTypesXml() {
  return XML_DECL + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;
}
__name(contentTypesXml, "contentTypesXml");
__name2(contentTypesXml, "contentTypesXml");
function rootRelsXml() {
  return XML_DECL + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}
__name(rootRelsXml, "rootRelsXml");
__name2(rootRelsXml, "rootRelsXml");
function workbookXml(sheetName) {
  const name = String(sheetName).slice(0, 31);
  return XML_DECL + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${escXml(name)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;
}
__name(workbookXml, "workbookXml");
__name2(workbookXml, "workbookXml");
function workbookRelsXml() {
  return XML_DECL + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;
}
__name(workbookRelsXml, "workbookRelsXml");
__name2(workbookRelsXml, "workbookRelsXml");
function sharedStringsXml(strings) {
  const items = strings.map((s) => `<si><t xml:space="preserve">${escXml(s)}</t></si>`).join("");
  return XML_DECL + `<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
}
__name(sharedStringsXml, "sharedStringsXml");
__name2(sharedStringsXml, "sharedStringsXml");
function stylesXml() {
  return XML_DECL + `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="3">
  <font><sz val="11"/><name val="Calibri"/></font>
  <font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font>
  <font><color rgb="FF4A90D9"/><u/><sz val="11"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
  <fill><patternFill patternType="none"/></fill>
  <fill><patternFill patternType="gray125"/></fill>
  <fill><patternFill patternType="solid"><fgColor rgb="FF4A90D9"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
  <border><left/><right/><top/><bottom/><diagonal/></border>
  <border><left style="thin"><color rgb="FFD5D9E0"/></left><right style="thin"><color rgb="FFD5D9E0"/></right><top style="thin"><color rgb="FFD5D9E0"/></top><bottom style="thin"><color rgb="FFD5D9E0"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
  <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
  <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
  <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" horizontal="center"/></xf>
  <xf numFmtId="2" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" horizontal="center"/></xf>
  <xf numFmtId="1" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" horizontal="center"/></xf>
  <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
}
__name(stylesXml, "stylesXml");
__name2(stylesXml, "stylesXml");
function makeXlsx({ headers, rows, hyperlinks = [], sheetName = "Sheet1" }) {
  const shared = [];
  const strIndex = /* @__PURE__ */ new Map();
  function addShared(s) {
    if (strIndex.has(s)) return strIndex.get(s);
    const idx = shared.length;
    shared.push(s);
    strIndex.set(s, idx);
    return idx;
  }
  __name(addShared, "addShared");
  __name2(addShared, "addShared");
  const colCount = headers.length;
  let colsXml = "<cols>";
  headers.forEach((h, i2) => {
    colsXml += `<col min="${i2 + 1}" max="${i2 + 1}" width="${h.width}" customWidth="1"/>`;
  });
  colsXml += "</cols>";
  let sheetData = `<row r="1">`;
  headers.forEach((h, i2) => {
    const ref22 = `${colLetter(i2)}1`;
    sheetData += `<c r="${ref22}" t="s" s="1"><v>${addShared(h.header)}</v></c>`;
  });
  sheetData += "</row>";
  rows.forEach((row, ri) => {
    const r = ri + 2;
    let maxLines = 1;
    let cells = "";
    headers.forEach((h, ci) => {
      const val = row[ci];
      const ref22 = `${colLetter(ci)}${r}`;
      if (typeof val === "number" && Number.isFinite(val)) {
        cells += `<c r="${ref22}" s="${h.style}"><v>${val}</v></c>`;
      } else {
        const s = val == null ? "" : String(val);
        const nl = s.split("\n").length;
        if (nl > maxLines) maxLines = nl;
        cells += `<c r="${ref22}" t="s" s="${h.style}"><v>${addShared(s)}</v></c>`;
      }
    });
    sheetData += `<row r="${r}" ht="${Math.max(22, maxLines * 15 + 8)}" customHeight="1">${cells}</row>`;
  });
  let hyperlinksXml = "";
  if (hyperlinks.length > 0) {
    hyperlinksXml = "<hyperlinks>";
    hyperlinks.forEach((h, i2) => {
      const ref22 = `${colLetter(h.col || 0)}${h.row}`;
      hyperlinksXml += `<hyperlink ref="${ref22}" r:id="rId${i2 + 1}"/>`;
    });
    hyperlinksXml += "</hyperlinks>";
  }
  let sheetRelsXml = XML_DECL + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
  hyperlinks.forEach((h, i2) => {
    sheetRelsXml += `<Relationship Id="rId${i2 + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escXml(h.url)}" TargetMode="External"/>`;
  });
  sheetRelsXml += "</Relationships>";
  const worksheetXml = XML_DECL + `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
${colsXml}
<sheetData>${sheetData}</sheetData>
${hyperlinksXml}
</worksheet>`;
  const files = {
    "[Content_Types].xml": strToU8(contentTypesXml()),
    "_rels/.rels": strToU8(rootRelsXml()),
    "xl/workbook.xml": strToU8(workbookXml(sheetName)),
    "xl/_rels/workbook.xml.rels": strToU8(workbookRelsXml()),
    "xl/styles.xml": strToU8(stylesXml()),
    "xl/sharedStrings.xml": strToU8(sharedStringsXml(shared)),
    "xl/worksheets/sheet1.xml": strToU8(worksheetXml),
    "xl/worksheets/_rels/sheet1.xml.rels": strToU8(sheetRelsXml)
  };
  return zipSync(files, { level: 6 });
}
__name(makeXlsx, "makeXlsx");
__name2(makeXlsx, "makeXlsx");
var JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
var DATA_STYLE = { reg_date: 3, product_name: 2, quantity: 5, unit_price: 4, refund_amount: 4, aftersale_type: 3, reason: 2, original_tracking: 2, return_tracking: 2, screenshots: 6, dealer: 3, payee_name: 3, card_no: 2, bank: 3, manager: 3 };
var EXCEL_HEADERS = [
  { header: "\u767B\u8BB0\u65E5\u671F", key: "reg_date", width: 12 },
  { header: "\u4EA7\u54C1\u540D\u79F0", key: "product_name", width: 22 },
  { header: "\u6570\u91CF", key: "quantity", width: 8 },
  { header: "\u5355\u4EF7", key: "unit_price", width: 10 },
  { header: "\u9000\u6B3E\u91D1\u989D", key: "refund_amount", width: 12 },
  { header: "\u552E\u540E\u7C7B\u578B", key: "aftersale_type", width: 12 },
  { header: "\u552E\u540E\u539F\u56E0", key: "reason", width: 26 },
  { header: "\u539F\u5FEB\u9012\u5355\u53F7", key: "original_tracking", width: 20 },
  { header: "\u9000\u56DE\u5FEB\u9012\u5355\u53F7", key: "return_tracking", width: 20 },
  { header: "\u622A\u56FE", key: "screenshots", width: 46 },
  { header: "\u7ECF\u9500\u5546", key: "dealer", width: 14 },
  { header: "\u94F6\u884C\u5361\u59D3\u540D", key: "payee_name", width: 12 },
  { header: "\u5361\u53F7", key: "card_no", width: 22 },
  { header: "\u5F00\u6237\u884C", key: "bank", width: 18 },
  { header: "\u7ECF\u7406\u540D", key: "manager", width: 12 }
];
var MAX_IMAGE_SIZE = 10 * 1024 * 1024;
var MAX_IMAGES = 9;
var DEFAULT_KEEP_DAYS = 30;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
__name(json, "json");
__name2(json, "json");
function isDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
__name(isDate, "isDate");
__name2(isDate, "isDate");
function dateClause(query) {
  const { date, start, end } = query;
  if (isDate(date)) {
    return { where: "reg_date = ?", params: [date], label: `-${date}` };
  }
  if (isDate(start) && isDate(end)) {
    return { where: "reg_date >= ? AND reg_date <= ?", params: [start, end], label: `-${start}_\u81F3_${end}` };
  }
  if (isDate(start)) {
    return { where: "reg_date >= ?", params: [start], label: `-${start}_\u8D77` };
  }
  if (isDate(end)) {
    return { where: "reg_date <= ?", params: [end], label: `-\u622A\u81F3_${end}` };
  }
  return { where: "1=1", params: [], label: "" };
}
__name(dateClause, "dateClause");
__name2(dateClause, "dateClause");
function recordWhereClause(query) {
  const d = dateClause(query);
  const q = String(query.q || "").trim();
  const params = [...d.params];
  let where = d.where;
  let label = d.label;
  if (q) {
    const fields = ["product_name", "aftersale_type", "reason", "original_tracking", "return_tracking", "dealer", "payee_name", "card_no", "bank", "manager"];
    const like = `%${q}%`;
    const extra = `(${fields.map((f) => `${f} LIKE ?`).join(" OR ")})`;
    fields.forEach(() => params.push(like));
    where = d.where === "1=1" ? extra : `${d.where} AND ${extra}`;
    label += `_\u641C\u7D22_${q}`;
  }
  return { where, params, label };
}
__name(recordWhereClause, "recordWhereClause");
__name2(recordWhereClause, "recordWhereClause");
function safeParseScreenshots(s) {
  try {
    const v = JSON.parse(s || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
__name(safeParseScreenshots, "safeParseScreenshots");
__name2(safeParseScreenshots, "safeParseScreenshots");
function todayLocal() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
__name(todayLocal, "todayLocal");
__name2(todayLocal, "todayLocal");
function localDateTime() {
  const d = /* @__PURE__ */ new Date();
  const pad = /* @__PURE__ */ __name2((n) => String(n).padStart(2, "0"), "pad");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
__name(localDateTime, "localDateTime");
__name2(localDateTime, "localDateTime");
var SESSION_DAYS = 7;
var PBKDF2_ITERATIONS = 1e5;
var SESSION_COOKIE = "at_session";
function randomHex(n) {
  const arr = crypto.getRandomValues(new Uint8Array(n));
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomHex, "randomHex");
__name2(randomHex, "randomHex");
async function pbkdf2Hex(password, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: PBKDF2_ITERATIONS }, key, 256);
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(pbkdf2Hex, "pbkdf2Hex");
__name2(pbkdf2Hex, "pbkdf2Hex");
async function verifyPassword(password, salt, hash) {
  return await pbkdf2Hex(password, salt) === hash;
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
function getCookie(request, name) {
  const c = request.headers.get("Cookie") || "";
  for (const part of c.split(";")) {
    const i2 = part.indexOf("=");
    if (i2 > 0 && part.slice(0, i2).trim() === name) return decodeURIComponent(part.slice(i2 + 1).trim());
  }
  return null;
}
__name(getCookie, "getCookie");
__name2(getCookie, "getCookie");
function sessionCookie(token, maxAge) {
  return `${SESSION_COOKIE}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}
__name(sessionCookie, "sessionCookie");
__name2(sessionCookie, "sessionCookie");
function clearCookie() {
  return `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}
__name(clearCookie, "clearCookie");
__name2(clearCookie, "clearCookie");
async function currentUser(request, env22) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const row = await env22.DB.prepare("SELECT u.id, u.username, u.role, u.manager_name, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?").bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return row;
}
__name(currentUser, "currentUser");
__name2(currentUser, "currentUser");
function unescapeXml(s) {
  return String(s).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, "&");
}
__name(unescapeXml, "unescapeXml");
__name2(unescapeXml, "unescapeXml");
async function inflateRaw(data) {
  const ds = new DecompressionStream("deflate-raw");
  const stream = new Blob([data]).stream().pipeThrough(ds);
  const ab = await new Response(stream).arrayBuffer();
  return new Uint8Array(ab);
}
__name(inflateRaw, "inflateRaw");
__name2(inflateRaw, "inflateRaw");
async function readZipU8(buffer) {
  const u82 = new Uint8Array(buffer);
  const dv = new DataView(buffer);
  const len = buffer.byteLength;
  let eocd = -1;
  for (let i2 = len - 22; i2 >= 0; i2--) {
    if (u82[i2] === 80 && u82[i2 + 1] === 75 && u82[i2 + 2] === 5 && u82[i2 + 3] === 6) {
      eocd = i2;
      break;
    }
  }
  if (eocd < 0) return null;
  const cdSize = dv.getUint32(eocd + 12, true);
  const cdOffset = dv.getUint32(eocd + 16, true);
  const files = {};
  const decoder = new TextDecoder();
  let pos = cdOffset;
  const end = cdOffset + cdSize;
  while (pos + 46 <= end) {
    if (dv.getUint32(pos, true) !== 33639248) break;
    const method = dv.getUint16(pos + 10, true);
    const compSize = dv.getUint32(pos + 20, true);
    const uncompSize = dv.getUint32(pos + 24, true);
    const nameLen = dv.getUint16(pos + 28, true);
    const extraLen = dv.getUint16(pos + 30, true);
    const commentLen = dv.getUint16(pos + 32, true);
    const localOffset = dv.getUint32(pos + 42, true);
    const name = decoder.decode(u82.slice(pos + 46, pos + 46 + nameLen));
    const lnameLen = dv.getUint16(localOffset + 26, true);
    const lextraLen = dv.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + lnameLen + lextraLen;
    const data = u82.slice(dataStart, dataStart + compSize);
    if (method === 0) {
      files[name] = data;
    } else if (method === 8) {
      files[name] = await inflateRaw(data);
    }
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}
__name(readZipU8, "readZipU8");
__name2(readZipU8, "readZipU8");
function parseSharedStrings(xml) {
  const arr = [];
  const re = /<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g;
  let m;
  while (m = re.exec(xml)) {
    const texts = [...m[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((x2) => unescapeXml(x2[1])).join("");
    arr.push(texts);
  }
  return arr;
}
__name(parseSharedStrings, "parseSharedStrings");
__name2(parseSharedStrings, "parseSharedStrings");
function cellCol(ref3) {
  let col = 0;
  for (let i2 = 0; i2 < ref3.length; i2++) {
    const ch = ref3.charCodeAt(i2);
    if (ch >= 65 && ch <= 90) col = col * 26 + (ch - 64);
    else break;
  }
  return col - 1;
}
__name(cellCol, "cellCol");
__name2(cellCol, "cellCol");
function parseSheet(xml, shared) {
  const rows = [];
  const rowRe = /<row(?:\s[^>]*?r="(\d+)")?[^>]*>([\s\S]*?)<\/row>/g;
  let m;
  while (m = rowRe.exec(xml)) {
    const rowNum = parseInt(m[1], 10) || 0;
    const vals = [];
    const cellRe = /<c\b([^>]*)>([\s\S]*?)<\/c>/g;
    let cm;
    while (cm = cellRe.exec(m[2])) {
      const rMatch = cm[1].match(/r="([A-Z]+\d+)"/);
      if (!rMatch) continue;
      const col = cellCol(rMatch[1]);
      const tMatch = cm[1].match(/t="([^"]+)"/);
      const t = tMatch ? tMatch[1] : "";
      const vMatch = cm[2].match(/<v>([\s\S]*?)<\/v>/);
      const isMatch = cm[2].match(/<is>([\s\S]*?)<\/is>/);
      let val = "";
      if (t === "s" && vMatch) {
        const idx = parseInt(vMatch[1], 10);
        val = shared[idx] != null ? shared[idx] : "";
      } else if (t === "inlineStr" && isMatch) {
        val = [...isMatch[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((x2) => unescapeXml(x2[1])).join("");
      } else if (vMatch) {
        val = vMatch[1];
      }
      while (vals.length <= col) vals.push("");
      vals[col] = val;
    }
    if (rowNum > 0) rows[rowNum - 1] = vals;
  }
  return rows.filter((r) => r && r.some((c) => String(c).trim() !== ""));
}
__name(parseSheet, "parseSheet");
__name2(parseSheet, "parseSheet");
async function parseXlsx(buffer) {
  const files = await readZipU8(buffer);
  if (!files) throw new Error("\u65E0\u6CD5\u89E3\u6790 Excel \u6587\u4EF6\uFF08\u8BF7\u4E0A\u4F20 .xlsx \u683C\u5F0F\uFF09");
  const decoder = new TextDecoder();
  const sharedXml = decoder.decode(files["xl/sharedStrings.xml"] || new Uint8Array(0));
  const sheetXml = decoder.decode(files["xl/worksheets/sheet1.xml"] || new Uint8Array(0));
  const shared = parseSharedStrings(sharedXml);
  return parseSheet(sheetXml, shared);
}
__name(parseXlsx, "parseXlsx");
__name2(parseXlsx, "parseXlsx");
async function login(request, env22) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) return json({ error: "\u8BF7\u8F93\u5165\u7528\u6237\u540D\u548C\u5BC6\u7801" }, 400);
  const user = await env22.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  if (!user) return json({ error: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF" }, 401);
  const ok = await verifyPassword(password, user.salt, user.password_hash);
  if (!ok) return json({ error: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF" }, 401);
  const token = randomHex(32);
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await env22.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
  await env22.DB.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)").bind(token, user.id, localDateTime(), expires.toISOString()).run();
  return new Response(JSON.stringify({ user: { id: user.id, username: user.username, role: user.role, manager_name: user.manager_name } }), {
    headers: { ...JSON_HEADERS, "Set-Cookie": sessionCookie(token, SESSION_DAYS * 86400) }
  });
}
__name(login, "login");
__name2(login, "login");
async function logout(request, env22) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) await env22.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return new Response(JSON.stringify({ ok: true }), { headers: { ...JSON_HEADERS, "Set-Cookie": clearCookie() } });
}
__name(logout, "logout");
__name2(logout, "logout");
async function me(request, env22) {
  const user = await currentUser(request, env22);
  if (!user) return json({ error: "\u672A\u767B\u5F55" }, 401);
  return json({ user });
}
__name(me, "me");
__name2(me, "me");
async function handleUsers(request, env22, path, method, caller) {
  if (caller.role !== "admin") return json({ error: "\u65E0\u6743\u9650" }, 403);
  if (path === "/api/users" && method === "GET") {
    const { results } = await env22.DB.prepare("SELECT id, username, role, manager_name, created_at FROM users ORDER BY id ASC").all();
    return json(results);
  }
  if (path === "/api/users" && method === "POST") {
    const body = await request.json().catch(() => ({}));
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const managerName = String(body.manager_name || "").trim();
    if (!username || !password) return json({ error: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
    if (password.length < 4) return json({ error: "\u5BC6\u7801\u81F3\u5C11 4 \u4F4D" }, 400);
    if (!managerName) return json({ error: "\u8BF7\u586B\u5199\u7ECF\u7406\u59D3\u540D" }, 400);
    const salt = randomHex(16);
    const hash = await pbkdf2Hex(password, salt);
    try {
      const { meta } = await env22.DB.prepare("INSERT INTO users (username, password_hash, salt, role, manager_name, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(username, hash, salt, "manager", managerName, localDateTime()).run();
      return json({ id: Number(meta.last_row_id), username, role: "manager", manager_name: managerName });
    } catch {
      return json({ error: "\u7528\u6237\u540D\u5DF2\u5B58\u5728" }, 400);
    }
  }
  const m = path.match(/^\/api\/users\/(\d+)$/);
  if (m) {
    const uid = m[1];
    if (method === "DELETE") {
      if (caller && Number(caller.id) === Number(uid)) return json({ error: "\u4E0D\u80FD\u5220\u9664\u5F53\u524D\u767B\u5F55\u8D26\u53F7" }, 400);
      const u = await env22.DB.prepare("SELECT id FROM users WHERE id = ?").bind(uid).first();
      if (!u) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
      await env22.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(uid).run();
      await env22.DB.prepare("DELETE FROM dealers WHERE manager_id = ?").bind(uid).run();
      await env22.DB.prepare("DELETE FROM users WHERE id = ?").bind(uid).run();
      return json({ ok: true });
    }
    if (method === "PUT") {
      const body = await request.json().catch(() => ({}));
      if (body.manager_name !== void 0) {
        await env22.DB.prepare("UPDATE users SET manager_name = ? WHERE id = ?").bind(String(body.manager_name).trim(), uid).run();
      }
      if (body.password) {
        if (String(body.password).length < 4) return json({ error: "\u5BC6\u7801\u81F3\u5C11 4 \u4F4D" }, 400);
        const salt = randomHex(16);
        const hash = await pbkdf2Hex(String(body.password), salt);
        await env22.DB.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?").bind(hash, salt, uid).run();
      }
      return json({ ok: true });
    }
  }
  return json({ error: "\u63A5\u53E3\u4E0D\u5B58\u5728" }, 404);
}
__name(handleUsers, "handleUsers");
__name2(handleUsers, "handleUsers");
async function importProducts(request, env22) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "\u65E0\u6CD5\u89E3\u6790\u4E0A\u4F20\u5185\u5BB9" }, 400);
  }
  const file = form.get("product_file");
  if (!file) return json({ error: "\u672A\u9009\u62E9\u6587\u4EF6" }, 400);
  const buf = await file.arrayBuffer();
  let rows;
  try {
    rows = await parseXlsx(buf);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  if (rows.length < 2) return json({ error: "\u8868\u683C\u6570\u636E\u4E3A\u7A7A\uFF0C\u81F3\u5C11\u9700\u8981\u8868\u5934\u548C\u4E00\u884C\u6570\u636E" }, 400);
  const headers = rows[0].map((h) => String(h).trim());
  const nameIdx = headers.findIndex((h) => h.includes("\u4EA7\u54C1\u540D\u79F0") || h.includes("\u5546\u54C1\u540D\u79F0") || h.includes("\u4EA7\u54C1\u540D") || /product/i.test(h));
  const priceIdx = headers.findIndex((h) => h.includes("\u5355\u4EF7") || /price/i.test(h));
  if (nameIdx < 0) return json({ error: "\u672A\u627E\u5230\u300C\u4EA7\u54C1\u540D\u79F0\u300D\u5217" }, 400);
  if (priceIdx < 0) return json({ error: "\u672A\u627E\u5230\u300C\u5355\u4EF7\u300D\u5217" }, 400);
  let added = 0, updated = 0, skipped = 0;
  for (let i2 = 1; i2 < rows.length; i2++) {
    const name = String(rows[i2][nameIdx] || "").trim();
    if (!name) {
      skipped++;
      continue;
    }
    const price = Number(String(rows[i2][priceIdx] || "").trim());
    if (!Number.isFinite(price) || price < 0) {
      skipped++;
      continue;
    }
    const exists = await env22.DB.prepare("SELECT id FROM products WHERE name = ?").bind(name).first();
    if (exists) {
      await env22.DB.prepare("UPDATE products SET price = ? WHERE id = ?").bind(price, exists.id).run();
      updated++;
    } else {
      await env22.DB.prepare("INSERT INTO products (name, price) VALUES (?, ?)").bind(name, price).run();
      added++;
    }
  }
  return json({ added, updated, skipped, total: rows.length - 1 });
}
__name(importProducts, "importProducts");
__name2(importProducts, "importProducts");
async function importDealers(request, env22, user) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "\u65E0\u6CD5\u89E3\u6790\u4E0A\u4F20\u5185\u5BB9" }, 400);
  }
  const file = form.get("dealer_file");
  if (!file) return json({ error: "\u672A\u9009\u62E9\u6587\u4EF6" }, 400);
  const buf = await file.arrayBuffer();
  let rows;
  try {
    rows = await parseXlsx(buf);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  if (rows.length < 2) return json({ error: "\u8868\u683C\u6570\u636E\u4E3A\u7A7A\uFF0C\u81F3\u5C11\u9700\u8981\u8868\u5934\u548C\u4E00\u884C\u6570\u636E" }, 400);
  const headers = rows[0].map((h) => String(h).trim());
  const nameIdx = headers.findIndex((h) => h.includes("\u7ECF\u9500\u5546") || h.includes("\u5BA2\u6237") || /dealer/i.test(h));
  const cardHolderIdx = headers.findIndex((h) => h.includes("\u94F6\u884C\u5361\u59D3\u540D") || h.includes("\u6301\u5361\u4EBA") || h.includes("\u59D3\u540D") && !h.includes("\u7ECF\u9500\u5546"));
  const cardIdx = headers.findIndex((h) => h.includes("\u5361\u53F7") || /card/i.test(h));
  const bankIdx = headers.findIndex((h) => (h.includes("\u5F00\u6237\u884C") || h.includes("\u94F6\u884C") || /bank/i.test(h)) && !h.includes("\u94F6\u884C\u5361\u59D3\u540D"));
  if (nameIdx < 0) return json({ error: "\u672A\u627E\u5230\u300C\u7ECF\u9500\u5546\u540D\u79F0\u300D\u5217" }, 400);
  let added = 0, updated = 0, skipped = 0;
  for (let i2 = 1; i2 < rows.length; i2++) {
    const name = String(rows[i2][nameIdx] || "").trim();
    if (!name) {
      skipped++;
      continue;
    }
    const cardHolder = cardHolderIdx >= 0 ? String(rows[i2][cardHolderIdx] || "").trim() : "";
    const card = cardIdx >= 0 ? String(rows[i2][cardIdx] || "").trim() : "";
    const bank = bankIdx >= 0 ? String(rows[i2][bankIdx] || "").trim() : "";
    const exists = await env22.DB.prepare("SELECT id FROM dealers WHERE manager_id = ? AND dealer_name = ?").bind(user.id, name).first();
    if (exists) {
      await env22.DB.prepare("UPDATE dealers SET card_holder = ?, card_no = ?, bank = ? WHERE id = ?").bind(cardHolder, card, bank, exists.id).run();
      updated++;
    } else {
      await env22.DB.prepare("INSERT INTO dealers (manager_id, dealer_name, card_holder, card_no, bank, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(user.id, name, cardHolder, card, bank, localDateTime()).run();
      added++;
    }
  }
  return json({ added, updated, skipped, total: rows.length - 1 });
}
__name(importDealers, "importDealers");
__name2(importDealers, "importDealers");
async function changeMyPassword(request, env22, user) {
  const body = await request.json().catch(() => ({}));
  const oldPassword = String(body.old_password || "");
  const newPassword = String(body.new_password || "");
  if (newPassword.length < 4) return json({ error: "\u65B0\u5BC6\u7801\u81F3\u5C11 4 \u4F4D" }, 400);
  const row = await env22.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  if (!row) return json({ error: "\u7528\u6237\u4E0D\u5B58\u5728" }, 404);
  const ok = await verifyPassword(oldPassword, row.salt, row.password_hash);
  if (!ok) return json({ error: "\u539F\u5BC6\u7801\u9519\u8BEF" }, 400);
  const salt = randomHex(16);
  const hash = await pbkdf2Hex(newPassword, salt);
  await env22.DB.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?").bind(hash, salt, user.id).run();
  return json({ ok: true });
}
__name(changeMyPassword, "changeMyPassword");
__name2(changeMyPassword, "changeMyPassword");
function templateFile(type) {
  const isProduct = type === "product";
  const headers = isProduct ? [{ header: "\u4EA7\u54C1\u540D\u79F0", width: 24, style: 2 }, { header: "\u5355\u4EF7", width: 14, style: 4 }] : [{ header: "\u7ECF\u9500\u5546\u540D\u79F0", width: 20, style: 2 }, { header: "\u94F6\u884C\u5361\u59D3\u540D", width: 14, style: 2 }, { header: "\u5361\u53F7", width: 26, style: 2 }, { header: "\u5F00\u6237\u884C", width: 22, style: 2 }];
  const buf = makeXlsx({ headers, rows: [], hyperlinks: [], sheetName: isProduct ? "\u5546\u54C1" : "\u7ECF\u9500\u5546" });
  const fname = isProduct ? "\u5546\u54C1\u5BFC\u5165\u6A21\u677F.xlsx" : "\u7ECF\u9500\u5546\u5BFC\u5165\u6A21\u677F.xlsx";
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fname)}`
    }
  });
}
__name(templateFile, "templateFile");
__name2(templateFile, "templateFile");
var index_default = {
  async fetch(request, env22) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path.startsWith("/files/")) {
        const fuser = await currentUser(request, env22);
        if (!fuser) return json({ error: "\u8BF7\u5148\u767B\u5F55" }, 401);
        return serveFile(request, env22, decodeURIComponent(path.slice("/files/".length)));
      }
      if (!path.startsWith("/api/")) {
        if (env22.ASSETS) return env22.ASSETS.fetch(request);
        return new Response("Not Found", { status: 404 });
      }
      const method = request.method;
      if (path === "/api/login" && method === "POST") return login(request, env22);
      if (path === "/api/logout" && method === "POST") return logout(request, env22);
      if (path === "/api/me" && method === "GET") return me(request, env22);
      const user = await currentUser(request, env22);
      if (!user) return json({ error: "\u8BF7\u5148\u767B\u5F55" }, 401);
      if (path === "/api/me/password" && method === "PUT") return changeMyPassword(request, env22, user);
      if (path === "/api/users" || /^\/api\/users\//.test(path)) {
        return handleUsers(request, env22, path, method, user);
      }
      if (path === "/api/products/import" && method === "POST") return importProducts(request, env22);
      if (path === "/api/dealers/import" && method === "POST") return importDealers(request, env22, user);
      if (path === "/api/dealers" && method === "GET") {
        const q = String(url.searchParams.get("q") || "").trim();
        const res = q ? await env22.DB.prepare("SELECT * FROM dealers WHERE manager_id = ? AND dealer_name LIKE ? ORDER BY dealer_name ASC LIMIT 20").bind(user.id, `%${q}%`).all() : await env22.DB.prepare("SELECT * FROM dealers WHERE manager_id = ? ORDER BY dealer_name ASC").bind(user.id).all();
        return json(res.results);
      }
      const dealerMatch = path.match(/^\/api\/dealers\/(\d+)$/);
      if (dealerMatch && method === "DELETE") {
        const { meta } = await env22.DB.prepare("DELETE FROM dealers WHERE id = ? AND manager_id = ?").bind(dealerMatch[1], user.id).run();
        if (meta.changes === 0) return json({ error: "\u7ECF\u9500\u5546\u4E0D\u5B58\u5728" }, 404);
        return json({ ok: true });
      }
      if (path === "/api/template" && method === "GET") {
        return templateFile(String(url.searchParams.get("type") || ""));
      }
      if (path === "/api/products" && method === "GET") {
        const { results } = await env22.DB.prepare("SELECT * FROM products ORDER BY id ASC").all();
        return json(results);
      }
      if (path === "/api/products" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const name = String(body.name || "").trim();
        const price = Number(body.price);
        if (!name) return json({ error: "\u4EA7\u54C1\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
        if (!Number.isFinite(price) || price < 0) return json({ error: "\u5355\u4EF7\u4E0D\u5408\u6CD5" }, 400);
        try {
          const { meta } = await env22.DB.prepare("INSERT INTO products (name, price) VALUES (?, ?)").bind(name, price).run();
          return json({ id: Number(meta.last_row_id), name, price });
        } catch {
          return json({ error: "\u4EA7\u54C1\u5DF2\u5B58\u5728\uFF1A" + name }, 400);
        }
      }
      const productMatch = path.match(/^\/api\/products\/(\d+)$/);
      if (productMatch) {
        const id = productMatch[1];
        if (method === "PUT") {
          const body = await request.json().catch(() => ({}));
          const name = String(body.name || "").trim();
          const price = Number(body.price);
          if (!name) return json({ error: "\u4EA7\u54C1\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
          if (!Number.isFinite(price) || price < 0) return json({ error: "\u5355\u4EF7\u4E0D\u5408\u6CD5" }, 400);
          try {
            const { meta } = await env22.DB.prepare("UPDATE products SET name = ?, price = ? WHERE id = ?").bind(name, price, id).run();
            if (meta.changes === 0) return json({ error: "\u4EA7\u54C1\u4E0D\u5B58\u5728" }, 404);
            return json({ id: Number(id), name, price });
          } catch {
            return json({ error: "\u4EA7\u54C1\u5DF2\u5B58\u5728\uFF1A" + name }, 400);
          }
        }
        if (method === "DELETE") {
          const { meta } = await env22.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
          if (meta.changes === 0) return json({ error: "\u4EA7\u54C1\u4E0D\u5B58\u5728" }, 404);
          return json({ ok: true });
        }
      }
      if (path === "/api/records" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const r = parseRecord(body);
        if (!r.manager && user.manager_name) r.manager = user.manager_name;
        if (!r.product_name) return json({ error: "\u8BF7\u586B\u5199\u4EA7\u54C1\u540D\u79F0" }, 400);
        if (!r.aftersale_type) return json({ error: "\u8BF7\u9009\u62E9\u552E\u540E\u7C7B\u578B" }, 400);
        if (!r.reason) return json({ error: "\u8BF7\u586B\u5199\u552E\u540E\u539F\u56E0" }, 400);
        if (!r.original_tracking) return json({ error: "\u8BF7\u586B\u5199\u539F\u5FEB\u9012\u5355\u53F7" }, 400);
        if (r.aftersale_type === "\u9000\u8D27\u9000\u6B3E" && !r.return_tracking) return json({ error: "\u9000\u8D27\u9000\u6B3E\u9700\u586B\u5199\u9000\u56DE\u5FEB\u9012\u5355\u53F7" }, 400);
        if (!r.dealer) return json({ error: "\u8BF7\u586B\u5199\u7ECF\u9500\u5546" }, 400);
        if (!r.payee_name) return json({ error: "\u8BF7\u586B\u5199\u94F6\u884C\u5361\u59D3\u540D" }, 400);
        if (!r.card_no) return json({ error: "\u8BF7\u586B\u5199\u5361\u53F7" }, 400);
        if (!r.bank) return json({ error: "\u8BF7\u586B\u5199\u5F00\u6237\u884C" }, 400);
        const sql = `INSERT INTO records (reg_date, product_name, quantity, unit_price, refund_amount, aftersale_type, reason, original_tracking, return_tracking, screenshots, dealer, payee_name, card_no, bank, manager, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const { meta } = await env22.DB.prepare(sql).bind(
          r.reg_date,
          r.product_name,
          r.quantity,
          r.unit_price,
          r.refund_amount,
          r.aftersale_type,
          r.reason,
          r.original_tracking,
          r.return_tracking,
          r.screenshots,
          r.dealer,
          r.payee_name,
          r.card_no,
          r.bank,
          r.manager,
          r.created_at
        ).run();
        return json({ id: Number(meta.last_row_id), ...r, screenshots: safeParseScreenshots(r.screenshots) });
      }
      if (path === "/api/records" && method === "GET") {
        const { where, params } = recordWhereClause(Object.fromEntries(url.searchParams));
        const { results } = await env22.DB.prepare(`SELECT * FROM records WHERE ${where} ORDER BY id DESC`).bind(...params).all();
        for (const row of results) row.screenshots = safeParseScreenshots(row.screenshots);
        return json(results);
      }
      const recordMatch = path.match(/^\/api\/records\/(\d+)$/);
      if (recordMatch && method === "DELETE") {
        const { meta } = await env22.DB.prepare("DELETE FROM records WHERE id = ?").bind(recordMatch[1]).run();
        if (meta.changes === 0) return json({ error: "\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 404);
        return json({ ok: true });
      }
      if (path === "/api/upload" && method === "POST") {
        return uploadFiles(request, env22);
      }
      if (path === "/api/cleanup" && method === "POST") {
        if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
        const days = Number(url.searchParams.get("days")) || DEFAULT_KEEP_DAYS;
        const removed = await cleanupOrphanFiles(env22, days);
        return json({ removed, keepDays: days });
      }
      if (path === "/api/cleanup-all" && method === "POST") {
        if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
        const days = Number(url.searchParams.get("days")) || 30;
        const removed = await cleanupAllOldFiles(env22, days);
        return json({ removed, days });
      }
      if (path === "/api/export" && method === "GET") {
        return exportExcel(request, env22, Object.fromEntries(url.searchParams));
      }
      if (path.startsWith("/api/vouchers")) {
        const result = await handleVouchers(request, env22, path, method, user, url);
        if (result) return result;
      }
      if (path.startsWith("/api/templates")) {
        const result = await handleTemplates(request, env22, path, method, user, url);
        if (result) return result;
      }
      return json({ error: "\u63A5\u53E3\u4E0D\u5B58\u5728" }, 404);
    } catch (e) {
      console.error("Handler error:", e);
      return json({ error: "\u670D\u52A1\u5668\u9519\u8BEF\uFF1A" + e.message }, 500);
    }
  }
};
function parseRecord(body) {
  const r = {};
  for (const f of [
    "reg_date",
    "product_name",
    "quantity",
    "unit_price",
    "refund_amount",
    "aftersale_type",
    "reason",
    "original_tracking",
    "return_tracking",
    "screenshots",
    "dealer",
    "payee_name",
    "card_no",
    "bank",
    "manager"
  ]) {
    r[f] = body[f] !== void 0 && body[f] !== null ? body[f] : "";
  }
  r.quantity = Math.max(1, parseInt(r.quantity, 10) || 1);
  r.unit_price = Number(r.unit_price) || 0;
  r.refund_amount = Number(r.refund_amount) || 0;
  r.screenshots = JSON.stringify(Array.isArray(r.screenshots) ? r.screenshots : []);
  r.reg_date = isDate(r.reg_date) ? r.reg_date : todayLocal();
  r.created_at = localDateTime();
  return r;
}
__name(parseRecord, "parseRecord");
__name2(parseRecord, "parseRecord");
async function uploadFiles(request, env22) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "\u65E0\u6CD5\u89E3\u6790\u4E0A\u4F20\u5185\u5BB9" }, 400);
  }
  const files = form.getAll("images").filter((f) => f && typeof f === "object" && f.arrayBuffer);
  if (files.length === 0) return json({ error: "\u672A\u63A5\u6536\u5230\u6587\u4EF6" }, 400);
  if (files.length > MAX_IMAGES) return json({ error: `\u5355\u6B21\u6700\u591A\u4E0A\u4F20 ${MAX_IMAGES} \u5F20` }, 400);
  const now = /* @__PURE__ */ new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const urls = [];
  for (const file of files) {
    const type = file.type || "";
    if (!type.startsWith("image/")) {
      return json({ error: "\u4EC5\u652F\u6301\u4E0A\u4F20\u56FE\u7247\u6587\u4EF6" }, 400);
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return json({ error: "\u5355\u5F20\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 10MB" }, 400);
    }
    const extMatch = (file.name || "").match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : ".png";
    const key = `${ymd}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buf = await file.arrayBuffer();
    await env22.FILES.put(key, buf, {
      httpMetadata: { contentType: type },
      customMetadata: { uploadedAt: String(Date.now()) }
    });
    urls.push(`/files/${key}`);
  }
  return json({ urls });
}
__name(uploadFiles, "uploadFiles");
__name2(uploadFiles, "uploadFiles");
async function serveFile(request, env22, key) {
  if (!key) return new Response("Not Found", { status: 404 });
  const obj = await env22.FILES.get(key);
  if (!obj) return new Response("Not Found", { status: 404 });
  const headers = new Headers({
    "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable"
  });
  const range = request.headers.get("Range");
  if (range) {
    const size = obj.size;
    const m = range.match(/bytes=(\d*)-(\d*)/);
    if (m) {
      let start = m[1] ? parseInt(m[1], 10) : 0;
      let end = m[2] ? parseInt(m[2], 10) : size - 1;
      if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
      end = Math.min(end, size - 1);
      const partial = await env22.FILES.get(key, { range: { offset: start, length: end - start + 1 } });
      headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
      headers.set("Accept-Ranges", "bytes");
      return new Response(partial.body, { status: 206, headers });
    }
  }
  headers.set("Accept-Ranges", "bytes");
  return new Response(obj.body, { headers });
}
__name(serveFile, "serveFile");
__name2(serveFile, "serveFile");
async function getReferencedKeys(env22) {
  const refs = /* @__PURE__ */ new Set();
  const { results } = await env22.DB.prepare("SELECT screenshots FROM records").all();
  for (const row of results) {
    for (const u of safeParseScreenshots(row.screenshots)) {
      const m = String(u).match(/\/files\/(.+)$/);
      if (m) refs.add(m[1]);
    }
  }
  const { results: trows } = await env22.DB.prepare("SELECT data FROM template_records").all();
  for (const row of trows) {
    let data = {};
    try {
      data = JSON.parse(row.data || "{}");
    } catch {
      data = {};
    }
    collectFileRefs(data, refs);
  }
  const { results: vrows } = await env22.DB.prepare("SELECT file_key FROM vouchers").all();
  for (const r of vrows) if (r.file_key) refs.add(r.file_key);
  return refs;
}
__name(getReferencedKeys, "getReferencedKeys");
__name2(getReferencedKeys, "getReferencedKeys");
function collectFileRefs(value, refs) {
  if (Array.isArray(value)) {
    for (const v of value) collectFileRefs(v, refs);
  } else if (typeof value === "string") {
    const m = value.match(/\/files\/(.+)$/);
    if (m) refs.add(m[1]);
  } else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) collectFileRefs(value[k], refs);
  }
}
__name(collectFileRefs, "collectFileRefs");
__name2(collectFileRefs, "collectFileRefs");
async function cleanupOrphanFiles(env22, keepDays) {
  const refs = await getReferencedKeys(env22);
  const cutoff = Date.now() - keepDays * 24 * 60 * 60 * 1e3;
  let removed = 0;
  let cursor;
  do {
    const listed = await env22.FILES.list({ cursor, limit: 1e3 });
    for (const obj of listed.objects) {
      if (refs.has(obj.key)) continue;
      const head = await env22.FILES.head(obj.key).catch(() => null);
      if (!head) continue;
      const uploadedAt = head.customMetadata?.uploadedAt ? Number(head.customMetadata.uploadedAt) : head.uploaded?.getTime?.();
      if (uploadedAt && uploadedAt < cutoff) {
        await env22.FILES.delete(obj.key);
        removed++;
      }
    }
    cursor = listed.truncated ? listed.cursor : void 0;
  } while (cursor);
  return removed;
}
__name(cleanupOrphanFiles, "cleanupOrphanFiles");
__name2(cleanupOrphanFiles, "cleanupOrphanFiles");
async function cleanupAllOldFiles(env22, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1e3;
  let removed = 0;
  let cursor;
  do {
    const listed = await env22.FILES.list({ cursor, limit: 1e3 });
    for (const obj of listed.objects) {
      const head = await env22.FILES.head(obj.key).catch(() => null);
      if (!head) continue;
      const uploadedAt = head.customMetadata?.uploadedAt ? Number(head.customMetadata.uploadedAt) : head.uploaded?.getTime?.();
      if (uploadedAt && uploadedAt < cutoff) {
        await env22.FILES.delete(obj.key);
        removed++;
      }
    }
    cursor = listed.truncated ? listed.cursor : void 0;
  } while (cursor);
  return removed;
}
__name(cleanupAllOldFiles, "cleanupAllOldFiles");
__name2(cleanupAllOldFiles, "cleanupAllOldFiles");
async function exportExcel(request, env22, query) {
  const { where, params, label } = recordWhereClause(query);
  const { results } = await env22.DB.prepare(`SELECT * FROM records WHERE ${where} ORDER BY reg_date ASC, id ASC`).bind(...params).all();
  const origin = new URL(request.url).origin;
  const absolute = /* @__PURE__ */ __name2((u) => u.startsWith("http") ? u : origin + u, "absolute");
  const headers = EXCEL_HEADERS.map((h) => ({ header: h.header, width: h.width, style: DATA_STYLE[h.key] }));
  const rows = results.map((row) => {
    const shots = safeParseScreenshots(row.screenshots);
    return [
      row.reg_date,
      row.product_name,
      row.quantity,
      Number(row.unit_price),
      Number(row.refund_amount),
      row.aftersale_type,
      row.reason,
      row.original_tracking,
      row.return_tracking,
      shots.map(absolute).join("\n"),
      row.dealer,
      row.payee_name,
      row.card_no,
      row.bank,
      row.manager
    ];
  });
  const hyperlinks = [];
  results.forEach((row, i2) => {
    const shots = safeParseScreenshots(row.screenshots);
    if (shots.length > 0) {
      hyperlinks.push({ row: i2 + 2, col: 9, url: absolute(shots[0]) });
    }
  });
  const buf = makeXlsx({
    headers,
    rows,
    hyperlinks,
    sheetName: `\u552E\u540E\u767B\u8BB0${label || "_\u5168\u90E8"}`
  });
  const fname = `\u552E\u540E\u767B\u8BB0${label || "_\u5168\u90E8"}.xlsx`;
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fname)}`
    }
  });
}
__name(exportExcel, "exportExcel");
__name2(exportExcel, "exportExcel");
var FIELD_TYPES = ["text", "number", "date", "select", "image", "product", "dealer", "manager"];
var STYLE_BY_TYPE = { number: 4, date: 3, image: 6, text: 2, select: 3, product: 2, dealer: 3, manager: 3 };
var WIDTH_BY_TYPE = { number: 10, date: 12, image: 46, text: 24, select: 14, product: 24, dealer: 14, manager: 12 };
function normalizeFields(raw) {
  if (!Array.isArray(raw)) return { error: "\u5B57\u6BB5\u914D\u7F6E\u5FC5\u987B\u662F\u6570\u7EC4" };
  const seen = /* @__PURE__ */ new Set();
  const fields = [];
  let sort = 0;
  for (const f of raw) {
    const label = String(f && f.label || "").trim();
    const key = String(f && f.key || "").trim();
    const type = String(f && f.type || "text").trim();
    if (!label) return { error: "\u5B58\u5728\u672A\u547D\u540D\u7684\u5B57\u6BB5" };
    if (!key) return { error: `\u5B57\u6BB5\u300C${label}\u300D\u7F3A\u5C11\u5B57\u6BB5\u6807\u8BC6` };
    if (!/^[a-z][a-z0-9_]*$/.test(key)) return { error: `\u5B57\u6BB5\u300C${label}\u300D\u7684\u6807\u8BC6\u53EA\u80FD\u662F\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF` };
    if (seen.has(key)) return { error: `\u5B57\u6BB5\u6807\u8BC6\u91CD\u590D\uFF1A${key}` };
    seen.add(key);
    if (!FIELD_TYPES.includes(type)) return { error: `\u5B57\u6BB5\u300C${label}\u300D\u7684\u7C7B\u578B\u4E0D\u5408\u6CD5` };
    const options = [];
    if (type === "select") {
      const opts = (Array.isArray(f.options) ? f.options : []).map((o) => String(o).trim()).filter(Boolean);
      if (opts.length === 0) return { error: `\u4E0B\u62C9\u5B57\u6BB5\u300C${label}\u300D\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u9009\u9879` };
      options.push(...opts);
    }
    const conds = Array.isArray(f.condition_required) ? f.condition_required.filter((c) => c && c.field && c.value !== void 0 && c.value !== null) : [];
    fields.push({
      key,
      label,
      type,
      required: !!f.required,
      in_list: f.in_list !== false,
      dup_check: !!f.dup_check,
      options,
      condition_required: conds.map((c) => ({ field: String(c.field), value: String(c.value) })),
      target: String(f.target || ""),
      targets: f.targets && typeof f.targets === "object" ? { name: String(f.targets.name || ""), card: String(f.targets.card || ""), bank: String(f.targets.bank || "") } : {},
      default_today: !!f.default_today,
      sort: sort++
    });
  }
  if (fields.length === 0) return { error: "\u6A21\u677F\u81F3\u5C11\u9700\u8981\u4E00\u4E2A\u767B\u8BB0\u5B57\u6BB5" };
  return { fields };
}
__name(normalizeFields, "normalizeFields");
__name2(normalizeFields, "normalizeFields");
function parseFieldList(s) {
  try {
    const arr = JSON.parse(s || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
__name(parseFieldList, "parseFieldList");
__name2(parseFieldList, "parseFieldList");
async function getTemplateRow(env22, id) {
  const row = await env22.DB.prepare("SELECT * FROM templates WHERE id = ?").bind(id).first();
  if (!row) return null;
  row.fields = parseFieldList(row.fields);
  return row;
}
__name(getTemplateRow, "getTemplateRow");
__name2(getTemplateRow, "getTemplateRow");
function serializeTemplate(t) {
  return { id: Number(t.id), name: t.name, fields: Array.isArray(t.fields) ? t.fields : parseFieldList(t.fields), enabled: !!t.enabled, created_at: t.created_at, updated_at: t.updated_at };
}
__name(serializeTemplate, "serializeTemplate");
__name2(serializeTemplate, "serializeTemplate");
function searchableFields(fields) {
  return fields.filter((f) => f.in_list && f.type !== "image");
}
__name(searchableFields, "searchableFields");
__name2(searchableFields, "searchableFields");
function primaryDateKey(fields) {
  const f = fields.find((x2) => x2.type === "date");
  return f ? f.key : null;
}
__name(primaryDateKey, "primaryDateKey");
__name2(primaryDateKey, "primaryDateKey");
function templateRecordWhere(template, query) {
  const params = [];
  const conds = [];
  let label = "";
  const dk = primaryDateKey(template.fields);
  const dateExpr = dk ? `json_extract(data, '$.${dk}')` : "substr(created_at, 1, 10)";
  if (isDate(query.date)) {
    conds.push(`${dateExpr} = ?`);
    params.push(query.date);
    label = `-${query.date}`;
  }
  if (isDate(query.start) && isDate(query.end)) {
    conds.push(`${dateExpr} >= ? AND ${dateExpr} <= ?`);
    params.push(query.start, query.end);
    label = `-${query.start}_\u81F3_${query.end}`;
  } else if (isDate(query.start)) {
    conds.push(`${dateExpr} >= ?`);
    params.push(query.start);
    label = `-${query.start}_\u8D77`;
  } else if (isDate(query.end)) {
    conds.push(`${dateExpr} <= ?`);
    params.push(query.end);
    label = `-\u622A\u81F3_${query.end}`;
  }
  const q = String(query.q || "").trim();
  if (q) {
    const keys = searchableFields(template.fields);
    if (keys.length > 0) {
      const like = `%${q}%`;
      const extra = `(${keys.map((k) => `lower(json_extract(data, '$.${k.key}')) LIKE ?`).join(" OR ")})`;
      keys.forEach(() => params.push(like.toLowerCase()));
      conds.push(extra);
      label += `_\u641C\u7D22_${q}`;
    }
  }
  const where = conds.length ? conds.join(" AND ") : "1=1";
  return { where, params, label };
}
__name(templateRecordWhere, "templateRecordWhere");
__name2(templateRecordWhere, "templateRecordWhere");
function normalizeRecordData(template, raw, user) {
  const data = {};
  for (const f of template.fields) {
    const v = raw[f.key];
    if (f.type === "image") {
      data[f.key] = Array.isArray(v) ? v.map((x2) => String(x2)) : [];
    } else if (f.type === "number") {
      const s = String(v == null ? "" : v).trim();
      if (s === "") {
        data[f.key] = "";
      } else {
        const n = Number(s);
        data[f.key] = Number.isFinite(n) ? n : "";
      }
    } else if (f.type === "date") {
      const s = String(v == null ? "" : v).trim();
      data[f.key] = f.default_today && !s ? todayLocal() : s;
    } else if (f.type === "manager") {
      const s = String(v == null ? "" : v).trim();
      data[f.key] = s || (user && user.manager_name ? user.manager_name : "");
    } else {
      data[f.key] = String(v == null ? "" : v).trim();
    }
  }
  return applyComputedFields(template, data);
}
__name(normalizeRecordData, "normalizeRecordData");
__name2(normalizeRecordData, "normalizeRecordData");
function applyComputedFields(template, data) {
  const keys = new Set((template.fields || []).map((f) => f.key));
  if (keys.has("payable_amount") && keys.has("unit_price") && keys.has("quantity")) {
    const price = Number(data.unit_price);
    const qty = Number(data.quantity);
    if (data.unit_price !== "" && data.quantity !== "" && Number.isFinite(price) && Number.isFinite(qty)) {
      data.payable_amount = Math.round(price * qty * 100) / 100;
    } else {
      data.payable_amount = "";
    }
  }
  return data;
}
__name(applyComputedFields, "applyComputedFields");
__name2(applyComputedFields, "applyComputedFields");
function recordRequiredError(template, data) {
  const fieldMap = {};
  for (const f of template.fields) fieldMap[f.key] = f;
  for (const f of template.fields) {
    const isEmpty = f.type === "image" ? data[f.key].length === 0 : String(data[f.key] == null ? "" : data[f.key]).trim() === "";
    if (isEmpty) {
      if (f.required) return `\u8BF7\u586B\u5199${f.label}`;
      if (f.condition_required) {
        for (const c of f.condition_required) {
          const cf = fieldMap[c.field];
          if (cf && String(data[c.field] == null ? "" : data[c.field]) === c.value) {
            return `\u8BF7\u586B\u5199${f.label}`;
          }
        }
      }
    }
  }
  return null;
}
__name(recordRequiredError, "recordRequiredError");
__name2(recordRequiredError, "recordRequiredError");
async function checkDupRecord(env22, template, data) {
  for (const f of template.fields) {
    if (!f.dup_check) continue;
    const v = String(data[f.key] == null ? "" : data[f.key]).trim();
    if (!v) continue;
    const row = await env22.DB.prepare("SELECT id FROM template_records WHERE template_id = ? AND json_extract(data, ?) = ? LIMIT 1").bind(template.id, `$.${f.key}`, v).first();
    if (row) return f.label;
  }
  return null;
}
__name(checkDupRecord, "checkDupRecord");
__name2(checkDupRecord, "checkDupRecord");
async function listTemplates(env22, includeDisabled) {
  const sql = includeDisabled ? "SELECT * FROM templates ORDER BY id ASC" : "SELECT * FROM templates WHERE enabled = 1 ORDER BY id ASC";
  const { results } = await env22.DB.prepare(sql).all();
  return json(results.map(serializeTemplate));
}
__name(listTemplates, "listTemplates");
__name2(listTemplates, "listTemplates");
async function createTemplate(request, env22) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return json({ error: "\u8BF7\u586B\u5199\u6A21\u677F\u540D\u79F0" }, 400);
  const { fields, error: error4 } = normalizeFields(body.fields);
  if (error4) return json({ error: error4 }, 400);
  const now = localDateTime();
  const { meta } = await env22.DB.prepare("INSERT INTO templates (name, fields, enabled, created_at, updated_at) VALUES (?, ?, 1, ?, ?)").bind(name, JSON.stringify(fields), now, now).run();
  return json({ id: Number(meta.last_row_id), name, fields, enabled: true, created_at: now, updated_at: now });
}
__name(createTemplate, "createTemplate");
__name2(createTemplate, "createTemplate");
async function updateTemplate(request, env22, id) {
  const t = await getTemplateRow(env22, id);
  if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
  const body = await request.json().catch(() => ({}));
  if (body.name !== void 0 && String(body.name).trim()) {
    await env22.DB.prepare("UPDATE templates SET name = ?, updated_at = ? WHERE id = ?").bind(String(body.name).trim(), localDateTime(), id).run();
  }
  if (body.enabled !== void 0) {
    await env22.DB.prepare("UPDATE templates SET enabled = ?, updated_at = ? WHERE id = ?").bind(body.enabled ? 1 : 0, localDateTime(), id).run();
  }
  if (body.fields !== void 0) {
    const { fields, error: error4 } = normalizeFields(body.fields);
    if (error4) return json({ error: error4 }, 400);
    await env22.DB.prepare("UPDATE templates SET fields = ?, updated_at = ? WHERE id = ?").bind(JSON.stringify(fields), localDateTime(), id).run();
  }
  const updated = await getTemplateRow(env22, id);
  return json(serializeTemplate(updated));
}
__name(updateTemplate, "updateTemplate");
__name2(updateTemplate, "updateTemplate");
async function deleteTemplate(env22, id) {
  const t = await getTemplateRow(env22, id);
  if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
  const cnt = await env22.DB.prepare("SELECT COUNT(*) AS c FROM template_records WHERE template_id = ?").bind(id).first();
  if (Number(cnt.c) > 0) return json({ error: "\u8BE5\u6A21\u677F\u4E0B\u5DF2\u6709\u767B\u8BB0\u8BB0\u5F55\uFF0C\u8BF7\u5148\u6E05\u7A7A\u8BB0\u5F55\u540E\u518D\u5220\u9664\u6A21\u677F" }, 400);
  await env22.DB.prepare("DELETE FROM templates WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
__name(deleteTemplate, "deleteTemplate");
__name2(deleteTemplate, "deleteTemplate");
async function copyTemplate(env22, id) {
  const t = await getTemplateRow(env22, id);
  if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
  const now = localDateTime();
  const { meta } = await env22.DB.prepare("INSERT INTO templates (name, fields, enabled, created_at, updated_at) VALUES (?, ?, 0, ?, ?)").bind(`${t.name}\uFF08\u526F\u672C\uFF09`, JSON.stringify(t.fields), now, now).run();
  return json({ id: Number(meta.last_row_id), name: `${t.name}\uFF08\u526F\u672C\uFF09`, fields: t.fields, enabled: false, created_at: now, updated_at: now });
}
__name(copyTemplate, "copyTemplate");
__name2(copyTemplate, "copyTemplate");
async function listTemplateRecords(request, env22, template, query) {
  const { where, params } = templateRecordWhere(template, query);
  const { results } = await env22.DB.prepare(`SELECT id, data, created_at FROM template_records WHERE template_id = ? AND ${where} ORDER BY id DESC`).bind(template.id, ...params).all();
  const { results: vrows } = await env22.DB.prepare("SELECT record_id, COUNT(*) AS c FROM vouchers WHERE template_id = ? AND record_id IS NOT NULL AND status = 'linked' GROUP BY record_id").bind(template.id).all();
  const vmap = Object.fromEntries(vrows.map((v) => [Number(v.record_id), Number(v.c)]));
  return json(results.map((r) => {
    let data = {};
    try {
      data = JSON.parse(r.data || "{}");
    } catch {
      data = {};
    }
    return { id: Number(r.id), data, created_at: r.created_at, voucher_count: vmap[Number(r.id)] || 0 };
  }));
}
__name(listTemplateRecords, "listTemplateRecords");
__name2(listTemplateRecords, "listTemplateRecords");
async function createTemplateRecord(request, env22, template, user) {
  const body = await request.json().catch(() => ({}));
  const data = normalizeRecordData(template, body, user);
  const reqErr = recordRequiredError(template, data);
  if (reqErr) return json({ error: reqErr }, 400);
  const dupLabel = await checkDupRecord(env22, template, data);
  if (dupLabel) return json({ error: `\u300C${dupLabel}\u300D\u5DF2\u5B58\u5728\u76F8\u540C\u7684\u503C\uFF0C\u7981\u6B62\u91CD\u590D\u767B\u8BB0` }, 400);
  const { meta } = await env22.DB.prepare("INSERT INTO template_records (template_id, data, created_at) VALUES (?, ?, ?)").bind(template.id, JSON.stringify(data), localDateTime()).run();
  return json({ id: Number(meta.last_row_id), data, created_at: localDateTime() });
}
__name(createTemplateRecord, "createTemplateRecord");
__name2(createTemplateRecord, "createTemplateRecord");
async function deleteTemplateRecord(env22, template, rid) {
  const rec = await env22.DB.prepare("SELECT id FROM template_records WHERE id = ? AND template_id = ?").bind(rid, template.id).first();
  if (!rec) return json({ error: "\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 404);
  const vc = await env22.DB.prepare("SELECT COUNT(*) AS c FROM vouchers WHERE record_id = ?").bind(rid).first();
  if (Number(vc.c) > 0) return json({ error: `\u8BE5\u8BB0\u5F55\u5DF2\u5173\u8054 ${Number(vc.c)} \u5F20\u4ED8\u6B3E\u51ED\u8BC1\uFF0C\u7981\u6B62\u5220\u9664\u3002\u53EF\u5728\u4ED8\u6B3E\u51ED\u8BC1\u5F85\u5904\u7406\u4E2D\u79FB\u9664\u51ED\u8BC1\u540E\u518D\u5220\u9664` }, 400);
  const { meta } = await env22.DB.prepare("DELETE FROM template_records WHERE id = ? AND template_id = ?").bind(rid, template.id).run();
  if (meta.changes === 0) return json({ error: "\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 404);
  return json({ ok: true });
}
__name(deleteTemplateRecord, "deleteTemplateRecord");
__name2(deleteTemplateRecord, "deleteTemplateRecord");
async function exportTemplateExcel(request, env22, template, query) {
  const { where, params, label } = templateRecordWhere(template, query);
  const { results } = await env22.DB.prepare(`SELECT id, data, created_at FROM template_records WHERE template_id = ? AND ${where} ORDER BY created_at ASC, id ASC`).bind(template.id, ...params).all();
  const origin = new URL(request.url).origin;
  const absolute = __name2((u) => u.startsWith("http") ? u : origin + u, "absolute");
  const cols = searchableFields(template.fields);
  const rows = [];
  const hyperlinks = [];
  results.forEach((r, i2) => {
    let data = {};
    try {
      data = JSON.parse(r.data || "{}");
    } catch {
      data = {};
    }
    const cells = cols.map((f) => {
      if (f.type === "image") {
        const shots = Array.isArray(data[f.key]) ? data[f.key] : [];
        return shots.map(absolute).join("\n");
      }
      if (f.type === "number") {
        const n = Number(data[f.key]);
        return Number.isFinite(n) ? n : "";
      }
      return String(data[f.key] == null ? "" : data[f.key]);
    });
    rows.push(cells);
    const imgCol = cols.findIndex((f) => f.type === "image");
    if (imgCol >= 0) {
      const shots = Array.isArray(data[cols[imgCol].key]) ? data[cols[imgCol].key] : [];
      if (shots.length > 0) hyperlinks.push({ row: i2 + 2, col: imgCol, url: absolute(shots[0]) });
    }
  });
  const headers = cols.map((f) => ({ header: f.label, width: WIDTH_BY_TYPE[f.type] || 24, style: STYLE_BY_TYPE[f.type] || 2 }));
  const buf = makeXlsx({ headers, rows, hyperlinks, sheetName: `${template.name}${label || "_\u5168\u90E8"}`.slice(0, 28) });
  const fname = `${template.name}${label || "_\u5168\u90E8"}.xlsx`;
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fname)}`
    }
  });
}
__name(exportTemplateExcel, "exportTemplateExcel");
__name2(exportTemplateExcel, "exportTemplateExcel");
async function handleTemplates(request, env22, path, method, user, url) {
  if (path === "/api/templates" && method === "GET") return listTemplates(env22, false);
  if (path === "/api/templates/all" && method === "GET") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    return listTemplates(env22, true);
  }
  if (path === "/api/templates" && method === "POST") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    return createTemplate(request, env22);
  }
  const copyMatch = path.match(/^\/api\/templates\/(\d+)\/copy$/);
  if (copyMatch && method === "POST") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    return copyTemplate(env22, copyMatch[1]);
  }
  const expMatch = path.match(/^\/api\/templates\/(\d+)\/export$/);
  if (expMatch && method === "GET") {
    const t = await getTemplateRow(env22, expMatch[1]);
    if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    if (!t.enabled && user.role !== "admin") return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return exportTemplateExcel(request, env22, t, Object.fromEntries(url.searchParams));
  }
  const recDelMatch = path.match(/^\/api\/templates\/(\d+)\/records\/(\d+)$/);
  if (recDelMatch && method === "DELETE") {
    const t = await getTemplateRow(env22, recDelMatch[1]);
    if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return deleteTemplateRecord(env22, t, recDelMatch[2]);
  }
  const recMatch = path.match(/^\/api\/templates\/(\d+)\/records$/);
  if (recMatch) {
    const t = await getTemplateRow(env22, recMatch[1]);
    if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    if (!t.enabled && user.role !== "admin") return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    if (method === "GET") return listTemplateRecords(request, env22, t, Object.fromEntries(url.searchParams));
    if (method === "POST") return createTemplateRecord(request, env22, t, user);
  }
  const tMatch = path.match(/^\/api\/templates\/(\d+)$/);
  if (tMatch) {
    const t = await getTemplateRow(env22, tMatch[1]);
    if (!t) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    if (!t.enabled && user.role !== "admin") return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    if (method === "GET") return json(serializeTemplate(t));
    if (method === "PUT") {
      if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
      return updateTemplate(request, env22, tMatch[1]);
    }
    if (method === "DELETE") {
      if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
      return deleteTemplate(env22, tMatch[1]);
    }
  }
  return null;
}
__name(handleTemplates, "handleTemplates");
__name2(handleTemplates, "handleTemplates");
function voucherJson(row) {
  return {
    id: Number(row.id),
    template_id: Number(row.template_id),
    record_id: row.record_id != null ? Number(row.record_id) : null,
    order_no: row.order_no,
    file_key: row.file_key,
    file_name: row.file_name,
    name: row.name || "",
    card_no: row.card_no || "",
    amount: row.amount || "",
    status: row.status,
    uploaded_by: row.uploaded_by != null ? Number(row.uploaded_by) : null,
    created_at: row.created_at
  };
}
__name(voucherJson, "voucherJson");
__name2(voucherJson, "voucherJson");
function normCard(s) {
  return String(s == null ? "" : s).replace(/\s+/g, "");
}
__name(normCard, "normCard");
__name2(normCard, "normCard");
function amountEq(a, b) {
  const x2 = Number(a), y = Number(b);
  return isFinite(x2) && isFinite(y) && Math.abs(x2 - y) < 5e-3;
}
__name(amountEq, "amountEq");
__name2(amountEq, "amountEq");
function semanticFieldKeys(fields) {
  const keys = { card: null, name: null, amount: null };
  for (const f of fields || []) {
    const l = String(f.label || "");
    if (f.type === "number" && !keys.amount && /金额|退款/.test(l)) keys.amount = f.key;
    else if (f.type === "text" && !keys.card && /卡号/.test(l)) keys.card = f.key;
    else if (f.type === "text" && !keys.name && /姓名/.test(l)) keys.name = f.key;
  }
  return keys;
}
__name(semanticFieldKeys, "semanticFieldKeys");
__name2(semanticFieldKeys, "semanticFieldKeys");
function dataOf(r) {
  try {
    return JSON.parse(r.data || "{}");
  } catch {
    return {};
  }
}
__name(dataOf, "dataOf");
__name2(dataOf, "dataOf");
function matchRecords(voucher, recs, keys) {
  const vCard = voucher.card_no ? normCard(voucher.card_no) : null;
  const vName = voucher.name ? String(voucher.name).trim() : null;
  const vAmt = voucher.amount ? Number(voucher.amount) : null;
  const out = [];
  for (const r of recs) {
    const d = r.data;
    let ok = true;
    if (keys.card && vCard) {
      const rc = normCard(d[keys.card]);
      if (!rc || rc !== vCard) ok = false;
    }
    if (ok && keys.name && vName) {
      const rn = String(d[keys.name] == null ? "" : d[keys.name]).trim();
      if (!rn || rn !== vName) ok = false;
    }
    if (ok && keys.amount && vAmt != null) {
      const ra = Number(d[keys.amount]);
      if (!isFinite(ra) || !amountEq(ra, vAmt)) ok = false;
    }
    if (ok) out.push(r);
  }
  return out;
}
__name(matchRecords, "matchRecords");
__name2(matchRecords, "matchRecords");
function findHeaderRow(rows) {
  for (let i2 = 0; i2 < Math.min(rows.length, 12); i2++) {
    const joined = (rows[i2] || []).map((c) => String(c == null ? "" : c)).join("|");
    if (/订单/.test(joined) && (/卡号/.test(joined) || /金额/.test(joined) || /姓名/.test(joined))) return i2;
  }
  return 0;
}
__name(findHeaderRow, "findHeaderRow");
__name2(findHeaderRow, "findHeaderRow");
function headerIndex(header, patterns) {
  for (let i2 = 0; i2 < header.length; i2++) {
    const h = String(header[i2] == null ? "" : header[i2]).replace(/\s+/g, "");
    for (const p of patterns) if (h.includes(p)) return i2;
  }
  return -1;
}
__name(headerIndex, "headerIndex");
__name2(headerIndex, "headerIndex");
function extractOrderNo(fileName) {
  let base = String(fileName || "").replace(/\.pdf$/i, "").trim();
  const m = base.match(/RECEIPT_?(.+)$/i);
  if (m) base = m[1];
  return base.trim();
}
__name(extractOrderNo, "extractOrderNo");
__name2(extractOrderNo, "extractOrderNo");
async function parseXlsxU8(u82) {
  const copy = new Uint8Array(u82.length);
  copy.set(u82);
  return parseXlsx(copy.buffer);
}
__name(parseXlsxU8, "parseXlsxU8");
__name2(parseXlsxU8, "parseXlsxU8");
async function loadTemplateRecords(env22, templateId) {
  const { results } = await env22.DB.prepare("SELECT id, data FROM template_records WHERE template_id = ?").bind(templateId).all();
  return results.map((r) => ({ id: Number(r.id), data: dataOf(r) }));
}
__name(loadTemplateRecords, "loadTemplateRecords");
__name2(loadTemplateRecords, "loadTemplateRecords");
async function importVouchers(request, env22, template, user) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "\u65E0\u6CD5\u89E3\u6790\u4E0A\u4F20\u5185\u5BB9" }, 400);
  }
  const zipFile = form.get("zip");
  if (!zipFile || typeof zipFile.arrayBuffer !== "function") return json({ error: "\u8BF7\u9009\u62E9\u4ED8\u6B3E\u51ED\u8BC1\u538B\u7F29\u5305\uFF08zip\uFF09" }, 400);
  const buf = await zipFile.arrayBuffer();
  let files;
  try {
    files = await readZipU8(buf);
  } catch {
    files = null;
  }
  if (!files) return json({ error: "\u65E0\u6CD5\u89E3\u6790\u538B\u7F29\u5305\uFF0C\u8BF7\u4E0A\u4F20 zip \u683C\u5F0F" }, 400);
  const xlsxName = Object.keys(files).find((n) => /\.xlsx$/i.test(n));
  if (!xlsxName) return json({ error: "\u538B\u7F29\u5305\u5185\u672A\u627E\u5230\u6C47\u603B\u8868\uFF08.xlsx\uFF09" }, 400);
  const pdfNames = Object.keys(files).filter((n) => /\.pdf$/i.test(n));
  if (pdfNames.length === 0) return json({ error: "\u538B\u7F29\u5305\u5185\u672A\u627E\u5230\u56DE\u6267 PDF" }, 400);
  let rows = [];
  try {
    rows = await parseXlsxU8(files[xlsxName]);
  } catch {
    rows = [];
  }
  if (rows.length === 0) return json({ error: "\u65E0\u6CD5\u89E3\u6790\u6C47\u603B\u8868\u5185\u5BB9" }, 400);
  const hr = findHeaderRow(rows);
  const header = rows[hr];
  const colOrder = headerIndex(header, ["\u4E1A\u52A1\u8BA2\u5355\u53F7", "\u8BA2\u5355\u53F7"]);
  const colName = headerIndex(header, ["\u6536\u6B3E\u4EBA", "\u6237\u540D", "\u59D3\u540D"]);
  const colCard = headerIndex(header, ["\u5361\u53F7"]);
  const colAmount = headerIndex(header, ["\u91D1\u989D"]);
  if (colOrder < 0) return json({ error: "\u6C47\u603B\u8868\u672A\u627E\u5230\u8BA2\u5355\u53F7\u5217\uFF08\u4E1A\u52A1\u8BA2\u5355\u53F7/\u8BA2\u5355\u53F7\uFF09" }, 400);
  const summary = {};
  for (let i2 = hr + 1; i2 < rows.length; i2++) {
    const row = rows[i2];
    const order = String(row[colOrder] == null ? "" : row[colOrder]).trim();
    if (!order) continue;
    summary[order] = {
      name: colName >= 0 ? String(row[colName] == null ? "" : row[colName]).trim() : "",
      card: colCard >= 0 ? String(row[colCard] == null ? "" : row[colCard]).trim() : "",
      amount: colAmount >= 0 ? String(row[colAmount] == null ? "" : row[colAmount]).trim() : ""
    };
  }
  const { results: existRows } = await env22.DB.prepare("SELECT order_no FROM vouchers WHERE template_id = ?").bind(template.id).all();
  const existed = new Set(existRows.map((r) => r.order_no));
  const keys = semanticFieldKeys(template.fields);
  const recs = await loadTemplateRecords(env22, template.id);
  const now = /* @__PURE__ */ new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const linked = [], pending = [], unmatched = [];
  let skipped = 0;
  for (const name of pdfNames) {
    const orderNo = extractOrderNo(name);
    if (!orderNo) {
      skipped++;
      continue;
    }
    if (existed.has(orderNo)) {
      skipped++;
      continue;
    }
    existed.add(orderNo);
    const info4 = summary[orderNo] || { name: "", card: "", amount: "" };
    const key = `${ymd}/voucher/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
    await env22.FILES.put(key, files[name], {
      httpMetadata: { contentType: "application/pdf" },
      customMetadata: { uploadedAt: String(Date.now()) }
    });
    const v = { order_no: orderNo, name: info4.name, card_no: normCard(info4.card), amount: info4.amount };
    let status = "unmatched", recordId = null, matches = [];
    if (v.name || v.card_no || v.amount) {
      matches = matchRecords(v, recs, keys);
      if (matches.length === 1) {
        status = "linked";
        recordId = matches[0].id;
      } else if (matches.length > 1) {
        status = "pending";
      }
    }
    await env22.DB.prepare(
      "INSERT INTO vouchers (template_id, record_id, order_no, file_key, file_name, name, card_no, amount, status, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(template.id, recordId, orderNo, key, name, v.name, v.card_no, v.amount, status, user.id, localDateTime()).run();
    const item = { order_no: orderNo, name: v.name, card_no: v.card_no, amount: v.amount, candidates: matches.length };
    if (status === "linked") linked.push(item);
    else if (status === "pending") pending.push(item);
    else unmatched.push(item);
  }
  return json({
    imported: linked.length + pending.length + unmatched.length,
    skipped,
    linked: linked.length,
    pending: pending.length,
    unmatched: unmatched.length,
    summaryName: xlsxName,
    message: `\u5DF2\u5BFC\u5165 ${linked.length + pending.length + unmatched.length} \u5F20\u56DE\u6267\uFF1A\u81EA\u52A8\u6302\u63A5 ${linked.length}\u3001\u5F85\u786E\u8BA4 ${pending.length}\u3001\u672A\u5339\u914D ${unmatched.length}\u3001\u8DF3\u8FC7\u91CD\u590D ${skipped}`
  });
}
__name(importVouchers, "importVouchers");
__name2(importVouchers, "importVouchers");
async function pendingVouchers(request, env22, template) {
  const { results } = await env22.DB.prepare("SELECT * FROM vouchers WHERE template_id = ? AND status IN ('pending','unmatched') ORDER BY id DESC").bind(template.id).all();
  const keys = semanticFieldKeys(template.fields);
  const recs = await loadTemplateRecords(env22, template.id);
  return json(results.map((row) => {
    const v = voucherJson(row);
    let matches = [];
    if (v.name || v.card_no || v.amount) matches = matchRecords(v, recs, keys);
    const candidates = matches.map((m) => {
      const info4 = {};
      for (const f of template.fields || []) {
        if (f.type === "image") continue;
        if (/快递单号|单号|日期|数量|原因|金额|姓名|卡号/.test(String(f.label || ""))) {
          const val = m.data[f.key];
          if (val !== void 0 && val !== null && val !== "" && val !== 0) {
            info4[f.label] = Array.isArray(val) ? `${val.length} \u5F20` : String(val);
          }
        }
      }
      return { id: m.id, info: info4 };
    });
    return { ...v, file_url: `/files/${v.file_key}`, candidates };
  }));
}
__name(pendingVouchers, "pendingVouchers");
__name2(pendingVouchers, "pendingVouchers");
async function linkVoucher(request, env22, template, id) {
  const row = await env22.DB.prepare("SELECT * FROM vouchers WHERE id = ? AND template_id = ?").bind(id, template.id).first();
  if (!row) return json({ error: "\u51ED\u8BC1\u4E0D\u5B58\u5728" }, 404);
  const body = await request.json().catch(() => ({}));
  const rid = body.record_id === null || body.record_id === void 0 || body.record_id === "" ? null : Number(body.record_id);
  if (rid !== null) {
    const rec = await env22.DB.prepare("SELECT id FROM template_records WHERE id = ? AND template_id = ?").bind(rid, template.id).first();
    if (!rec) return json({ error: "\u76EE\u6807\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 400);
  }
  const status = rid === null ? "unmatched" : "linked";
  await env22.DB.prepare("UPDATE vouchers SET record_id = ?, status = ?, uploaded_by = ? WHERE id = ?").bind(rid, status, 1, id).run();
  const updated = await env22.DB.prepare("SELECT * FROM vouchers WHERE id = ?").bind(id).first();
  return json(voucherJson(updated));
}
__name(linkVoucher, "linkVoucher");
__name2(linkVoucher, "linkVoucher");
async function removeVoucher(env22, template, id) {
  const row = await env22.DB.prepare("SELECT * FROM vouchers WHERE id = ? AND template_id = ?").bind(id, template.id).first();
  if (!row) return json({ error: "\u51ED\u8BC1\u4E0D\u5B58\u5728" }, 404);
  await env22.FILES.delete(row.file_key).catch(() => {
  });
  await env22.DB.prepare("DELETE FROM vouchers WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
__name(removeVoucher, "removeVoucher");
__name2(removeVoucher, "removeVoucher");
async function recordVouchers(env22, template, recordId) {
  const { results } = await env22.DB.prepare("SELECT * FROM vouchers WHERE template_id = ? AND record_id = ? AND status = 'linked' ORDER BY id ASC").bind(template.id, recordId).all();
  return json(results.map((r) => ({ ...voucherJson(r), file_url: `/files/${r.file_key}` })));
}
__name(recordVouchers, "recordVouchers");
__name2(recordVouchers, "recordVouchers");
async function handleVouchers(request, env22, path, method, user, url) {
  const importMatch = path === "/api/vouchers/import";
  if (importMatch && method === "POST") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    const tid = Number(url.searchParams.get("template_id"));
    const template = await getTemplateRow(env22, tid);
    if (!template) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return importVouchers(request, env22, template, user);
  }
  const pendingMatch = path === "/api/vouchers/pending";
  if (pendingMatch && method === "GET") {
    const tid = Number(url.searchParams.get("template_id"));
    const template = await getTemplateRow(env22, tid);
    if (!template) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return pendingVouchers(request, env22, template);
  }
  const recVouchers = path === "/api/vouchers" && method === "GET";
  if (recVouchers) {
    const tid = Number(url.searchParams.get("template_id"));
    const rid = Number(url.searchParams.get("record_id"));
    const template = await getTemplateRow(env22, tid);
    if (!template) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    const rec = await env22.DB.prepare("SELECT id FROM template_records WHERE id = ? AND template_id = ?").bind(rid, tid).first();
    if (!rec) return json({ error: "\u8BB0\u5F55\u4E0D\u5B58\u5728" }, 404);
    return recordVouchers(env22, template, rid);
  }
  const linkMatch = path.match(/^\/api\/vouchers\/(\d+)\/link$/);
  if (linkMatch && method === "POST") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    const tid = Number(url.searchParams.get("template_id"));
    const template = await getTemplateRow(env22, tid);
    if (!template) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return linkVoucher(request, env22, template, Number(linkMatch[1]));
  }
  const delMatch = path.match(/^\/api\/vouchers\/(\d+)$/);
  if (delMatch && method === "DELETE") {
    if (user.role !== "admin") return json({ error: "\u4EC5\u7BA1\u7406\u5458\u53EF\u6267\u884C" }, 403);
    const tid = Number(url.searchParams.get("template_id"));
    const template = await getTemplateRow(env22, tid);
    if (!template) return json({ error: "\u6A21\u677F\u4E0D\u5B58\u5728" }, 404);
    return removeVoucher(env22, template, Number(delMatch[1]));
  }
  return null;
}
__name(handleVouchers, "handleVouchers");
__name2(handleVouchers, "handleVouchers");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map