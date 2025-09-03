import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { TcpPool } from '../tcp/tcp-pool';
const targets = [ { host: process.env.AUTH_HOST_1 as string, port: Number(process.env.AUTH_PORT_1) } ];
@Controller('auth')
export class AuthController {
  private pool = new TcpPool(targets);
  private async send<T>(pattern: any, data: any): Promise<T> {
    const t = this.pool.next();
    const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: t.host, port: t.port } });
    return await firstValueFrom(client.send<T>(pattern, data).pipe(timeout(10000)));
  }

  @Post('register') async register(@Body() dto: any) { return this.send({ cmd: 'auth.register' }, dto); }
  @Post('login') async login(@Body() dto: any) { return this.send({ cmd: 'auth.login' }, dto); }

}
