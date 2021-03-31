export const logOptions =
    process.env.NODE_ENV === 'production'
        ? {}
        : {
              prettyPrint: {
                  colorize: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss TT',
                  ignore: 'pid,hostname',
              },
          }
