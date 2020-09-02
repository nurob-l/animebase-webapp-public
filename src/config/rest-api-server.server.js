module.exports = process.env.NODE_ENV === 'production'
  ? {
      // 用https会报错！！！
      // (node:18112) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'data' of undefined
      //     at main.900d8f569ff4de61a8b0.js:1:8983
      //     at processTicksAndRejections (internal/process/task_queues.js:93:5)
      // (node:18112) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing ins
      // ide of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejectio
      // n id: 3)
      // (node:18112) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejection
      // s that are not handled will terminate the Node.js process with a non-zero exit code.
      // host: `https://localhost:3000`
      host: `http://localhost:3000`
    }
  : {
      host: `http://localhost:3000`
    }
