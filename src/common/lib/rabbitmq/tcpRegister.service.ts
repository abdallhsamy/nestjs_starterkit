import { Transport } from '@nestjs/microservices';
import serverConfig from '@lib/serverConfig/serverConfig';
const tcpModuleStyle: any = (name: string, host: string, port: number) => {
  return {
    name: name,
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
      retryAttempts: serverConfig.SERVICE_RETRY_ATTEMPTS,
      retryDelay: serverConfig.SERVICE_RETRY_DELAY,
    },
  };
};
export { tcpModuleStyle };
