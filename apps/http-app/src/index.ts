import CamouflageHttp, { CamouflageHttpConfig } from "@camouflage/http";

const config: CamouflageHttpConfig = {
    "mode": "development",
    "log": {
        "enable": true, // enables or disables the logs entirely
        "level": "trace", // if enable=true, sets the log level. Available options are "fatal", "error", "warn", "info", "debug", "trace"
        "disableRequestLogs": true // if not disabled, each incoming request will be logged.
    },
    "http": {
        "enable": true, // enables or disables http server
        "port": 8080 // port on which http server would be available
    },
    "mocksDir": "/Users/shubhendumadhukar/Documents/camouflage/mocks"
};

const camouflageHttp = new CamouflageHttp(config);
camouflageHttp.start();