import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
@Controller()
export class AuthController {
  constructor(private readonly svc: AuthService) {}
  @MessagePattern({ cmd: 'auth.register' }) register(@Payload() dto: any) { return this.svc.register(dto.email, dto.password); }
  @MessagePattern({ cmd: 'auth.login' }) login(@Payload() dto: any) { return this.svc.login(dto.email, dto.password); }
}
