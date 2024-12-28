import { Module } from '@nestjs/common';
import { FireflyIIIService } from './firefly-iii.service';

@Module({
  providers: [FireflyIIIService]
})
export class FireflyIiiModule {}
