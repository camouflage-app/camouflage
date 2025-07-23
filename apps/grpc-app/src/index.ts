
import CamouflageGrpc, { CamouflageGrpcConfig } from "@camouflage/grpc";
import * as protoloader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
const config: CamouflageGrpcConfig = {
    "log": {
        "enable": true, // enables or disables the logs
        "level": "trace" // // if enable=true, sets the log level. Available options are "fatal", "error", "warn", "info", "debug", "trace"
    },
    "host": "0.0.0.0", // host part of the address on which you'd want grpc server to listen on
    "port": 8082, // port part of the address on which you'd want grpc server to listen on
    "ssl": {
        "enable": false, // enables or disabled ssl, if disabled credentials will be created using grpc.ServerCredentials.createInsecure()
        "cert": "", // if enable=true, required config for .cert file
        "key": "", // if enable=true, required config for .key file
        "rootCert": "" // Optionally, provide location to root cert
    },
    "mocksDir": "/Users/shubhendumadhukar/Documents/camouflage/grpcMocks", // location of the mocks folder
    "monitoring": {
        "enable": true, // enables or disables monitoring
        "port": 40000 // required port for monitoring server
    }
}
const camouflageGrpc = new CamouflageGrpc(config);
const handlers = camouflageGrpc.getHandlers();

const blogPackageDef = protoloader.loadSync("/Users/shubhendumadhukar/Documents/camouflage/blog.proto", {});
const blogGrpcObject = grpc.loadPackageDefinition(blogPackageDef);
const blogPackage = blogGrpcObject.blogPackage;

if (handlers) {
    // @ts-ignore
    camouflageGrpc.addService(blogPackage.BlogService.service, {
        createBlog: handlers.unaryHandler,
    });
}

camouflageGrpc.start();