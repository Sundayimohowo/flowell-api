import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';
import { MailModule } from 'src/mail/mail.module';
import { CartService } from 'src/cart/cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Collections } from 'src/utils/enums/collections.enum';
import { CartSchema } from 'src/entity/carts';
import { ProductSchema } from 'src/entity/products';
import { ProductService } from 'src/products/products.service';
import { UploadService } from 'src/services/upload/upload.service';

@Module({
  imports: [
    UsersModule,
    PasswordModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
    MailModule,
    MongooseModule.forFeature([
      { name: Collections.carts, schema: CartSchema },
    ]),
    MongooseModule.forFeature([
      { name: Collections.products, schema: ProductSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, CartService, ProductService, UploadService],
})
export class AuthModule {}
