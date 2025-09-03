import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { TcpPool } from '../tcp/tcp-pool';
const targets = [ { host: process.env.INVENTORY_HOST_1 as string, port: Number(process.env.INVENTORY_PORT_1) }, { host: process.env.INVENTORY_HOST_2 as string, port: Number(process.env.INVENTORY_PORT_2) } ];
@Controller('inventory')
export class InventoryController {
  private pool = new TcpPool(targets);
  private async send<T>(pattern: any, data: any): Promise<T> {
    const t = this.pool.next();
    const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: t.host, port: t.port } });
    return await firstValueFrom(client.send<T>(pattern, data).pipe(timeout(10000)));
  }

  @UseGuards(JwtAuthGuard) @Get('products') findAll() { return this.send({ cmd: 'inventory.findAll' }, {}); }
  @UseGuards(JwtAuthGuard) @Get('products/:id') findOne(@Param('id') id: string) { return this.send({ cmd: 'inventory.findOne' }, { id }); }
  @UseGuards(JwtAuthGuard) @Post('products') create(@Body() dto: any) { return this.send({ cmd: 'inventory.create' }, dto); }
  @UseGuards(JwtAuthGuard) @Patch('products/:id') update(@Param('id') id: string, @Body() dto: any) { return this.send({ cmd: 'inventory.update' }, { id, ...dto }); }
  @UseGuards(JwtAuthGuard) @Delete('products/:id') remove(@Param('id') id: string) { return this.send({ cmd: 'inventory.remove' }, { id }); }

}
