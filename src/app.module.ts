import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModel} from "./entity/user.entity";
import {StudentModel, TeacherModel} from "./entity/person.entity";
import {AirplaneModel, BookModel, CarModel, ComputerModel, SingleBaseModel} from "./entity/inheritance.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot({
    type: 'postgres',
    host : 'localhost',
    port : 5433,
    username : 'postgres',
    password : 'postgres',
    database : 'typeorm_study',
    entities : [
        UserModel,
        StudentModel,
        TeacherModel,
        BookModel,
        CarModel,
        SingleBaseModel,
        ComputerModel,
        AirplaneModel
    ],
    synchronize : true
  }),
      TypeOrmModule.forFeature([
          UserModel,
          StudentModel,
          TeacherModel
      ])
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
