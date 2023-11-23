import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { config } from '../config';

@Module({
  imports: [
    AccountsModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}