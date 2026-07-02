import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CourtsModule } from './courts/courts.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const databaseUrl = cfg.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: databaseUrl.includes('railway.internal')
              ? false
              : { rejectUnauthorized: false },
          };
        }
        return {
          type: 'postgres' as const,
          host: cfg.get('DB_HOST', 'localhost'),
          port: +cfg.get('DB_PORT', 5432),
          username: (cfg.get('DB_USERNAME', 'postgres') as string).trim(),
          password: (cfg.get('DB_PASSWORD', '') as string).trim(),
          database: cfg.get('DB_NAME', 'sportsbook'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    CourtsModule,
    BookingsModule,
    ReviewsModule,
    AiModule,
  ],
})
export class AppModule {}