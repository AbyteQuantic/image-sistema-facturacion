import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { TcpPool } from '../tcp/tcp-pool';
const targets = [ { host: process.env.CUSTOMERS_HOST_1 as string, port: Number(process.env.CUSTOMERS_PORT_1) } ];
@Controller('customers')
export class CustomersController {
  private pool = new TcpPool(targets);
  private async send<T>(pattern: any, data: any): Promise<T> {
    const t = this.pool.next();
    const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: t.host, port: t.port } });
    return await firstValueFrom(client.send<T>(pattern, data).pipe(timeout(10000)));
  }

  @UseGuards(JwtAuthGuard) @Get() findAll() { return this.send({ cmd: 'customers.findAll' }, {}); }
  @UseGuards(JwtAuthGuard) @Post() create(@Body() dto: any) { return this.send({ cmd: 'customers.create' }, dto); }
  @UseGuards(JwtAuthGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.send({ cmd: 'customers.update' }, { id, ...dto }); }
  @UseGuards(JwtAuthGuard) @Delete(':id') remove(@Param('id') id: string) { return this.send({ cmd: 'customers.remove' }, { id }); }

}
