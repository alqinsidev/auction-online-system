import 'dotenv/config';
import * as amqp from 'amqplib';
import { AmqpPublishPayload } from 'src/common/interface/amqp/amqp.interface';
import * as Sentry from '@sentry/node';

const amqpHelper = {
  publishMessage: async (payload: AmqpPublishPayload, delay = 0) => {
    try {
      const connection = await amqp.connect(process.env.AMQP_URL);
      const channel = await connection.createChannel();
      const exchangeName = 'AUCTION_EXCHANGE';
      const headers = {
        'x-delay': delay,
      };
      channel.publish(exchangeName, '', Buffer.from(JSON.stringify(payload)), {
        headers,
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  },
};

export default amqpHelper;
