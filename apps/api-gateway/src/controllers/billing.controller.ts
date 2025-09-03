import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { TcpPool } from '../tcp/tcp-pool';
const targets = [ { host: process.env.BILLING_HOST_1 as string, port: Number(process.env.BILLING_PORT_1) }, { host: process.env.BILLING_HOST_2 as string, port: Number(process.env.BILLING_PORT_2) } ];
@Controller('billing')
export class BillingController {
  private pool = new TcpPool(targets);
  private async send<T>(pattern: any, data: any): Promise<T> {
    const t = this.pool.next();
    const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: t.host, port: t.port } });
    return await firstValueFrom(client.send<T>(pattern, data).pipe(timeout(10000)));
  }

  @UseGuards(JwtAuthGuard) @Get('invoices') findAll() { return this.send({ cmd: 'billing.findAll' }, {}); }
  @UseGuards(JwtAuthGuard) @Post('invoices') create(@Body() dto: any, @Req() req: any) { return this.send({ cmd: 'billing.create' }, { ...dto, userId: req.user.sub }); }
  @UseGuards(JwtAuthGuard) @Post('invoices/:id/return') returnItem(@Param('id') id: string, @Body() dto: any) { return this.send({ cmd: 'billing.return' }, { invoiceId: id, ...dto }); }

}
