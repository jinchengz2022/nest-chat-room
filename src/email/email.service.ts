import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.163.com',
      port: 25,
      secure: false,
      auth: {
        user: 'jinchengz202011@163.com',
        pass: 'LLesL6aeTD2cusG7',
      },
    });
  }

  async sendMail(params: { to: string; subject: string; html?: any }) {
    return this.transporter.sendMail({
      from: {
        name: '',
        address: 'jinchengz202011@163.com',
      },
      ...params,
    });
  }
}
