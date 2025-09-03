import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      success: true,
      message: 'Gateway activo para Carlosdoño',
      service: 'api-gateway servicio orrquestador',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
