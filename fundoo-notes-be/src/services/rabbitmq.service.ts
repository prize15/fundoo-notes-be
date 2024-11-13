// src/services/rabbitmq.service.ts
import amqplib, { Connection, Channel } from 'amqplib';
import Logger from '../config/logger';

class RabbitMQService {
  private connection!: Connection;
  private channel!: Channel;
  private queueName: string;

  constructor() {
    this.queueName = process.env.QUEUE_NAME as string;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL as string);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      Logger.logger.info('Producer connected to RabbitMQ');
    } catch (error) {
      Logger.logger.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  public async sendMessage(message: string): Promise<void> {
    try {
      this.channel.sendToQueue(this.queueName, Buffer.from(message), { persistent: true });
      Logger.logger.info(`Message sent to queue: ${message}`);
    } catch (error) {
      Logger.logger.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }
}

export default new RabbitMQService();
