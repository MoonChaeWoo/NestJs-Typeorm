import {Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserModel} from "./entity/user.entity";

@Controller()
export class AppController {
  constructor(
      @InjectRepository(UserModel)
      private readonly userRepository : Repository<UserModel>
  ) {}

  @Post('users')
  postUsers(){
    return this.userRepository.save({
      //title : 'test_title'
    });
  }

  @Get('users')
  getUsers(){
    return this.userRepository.find({
      select : {
        id : true,
        title : true
      }
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id : string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id)
      }
    });
    return this.userRepository.save({...user, title : user.title + '0'});
  }
}