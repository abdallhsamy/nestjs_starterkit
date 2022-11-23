import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import serverConfig from "../serverConfig/serverConfig";
const MQ_USER = serverConfig.MQ_USER;
const MQ_PASS = serverConfig.MQ_PASS;
const MQ_URL = serverConfig.MQ_URL;

const rmqServiceStyle: any = (queue: string, provideName: string) => {
  return {
    provide: provideName,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          noAck: true,
          urls: [`amqp://${MQ_USER}:${MQ_PASS}@${MQ_URL}`],
          queue: queue,
        },
      });
    },
  };
};
const rmqModuleStyle: any = (queue: string, name: string) => {
  return {
    name: name,
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${MQ_USER}:${MQ_PASS}@${MQ_URL}`],
      queue: queue,
      // queueOptions: {
      //   durable: false,
      // },
    },
  };
};

export { rmqServiceStyle, rmqModuleStyle };
