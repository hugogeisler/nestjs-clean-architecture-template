import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from '@infrastructure/common/filter/exception.filter';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@infrastructure/common/interceptors/logger.interceptor';
import { ResponseFormat, ResponseInterceptor } from '@infrastructure/common/interceptors/response.interceptor';
import { ILogger } from '@domain/logger/logger.interface';

(async () => {
    const env = process.env.NODE_ENV;
    const app = await NestFactory.create(AppModule);

    // ----------------------------------------------------
    // Get modules
    // ----------------------------------------------------
    const logger = app.get<ILogger>(LoggerService);

    // ----------------------------------------------------
    // Set Server
    // ----------------------------------------------------
    app.use(cookieParser());

    // Filter
    app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

    // Pipe
    app.useGlobalPipes(new ValidationPipe());

    // Interceptors
    app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Base routing
    app.setGlobalPrefix('v1');

    // ----------------------------------------------------
    // Add Swagger documentation
    // ----------------------------------------------------
    if (env !== 'production') {
        const config = new DocumentBuilder().addBearerAuth().setTitle('Documentation API').setVersion('1.0.0').build();
        const document = SwaggerModule.createDocument(app, config, {
            extraModels: [ResponseFormat],
            deepScanRoutes: true,
        });
        SwaggerModule.setup('api', app, document);
    }

    // ----------------------------------------------------
    // Start NestJS application
    // ----------------------------------------------------
    await app.listen(process.env.PORT);
    logger.log('main', `Application is running on ${await app.getUrl()} 🚀`);
})();
