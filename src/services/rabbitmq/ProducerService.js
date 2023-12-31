const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SEVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    setTimeout(() => connection.close(), 1000);
  }
}

module.exports = ProducerService;