import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}
  async register(email: string, password: string) {
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Este mail ya esta registrado carlosdoño!');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, passwordHash });
    await this.repo.save(user);
    return { id: user.id, email: user.email };
  }
  async login(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('La embarro con el password, valide otravez carlosdoño!');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('La embarro con el password, valide otravez carlosdoño!');
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'supersecret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    return { access_token: token };
  }
}
