import {Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserModel} from "./entity/user.entity";
import {ProfileModel} from "./entity/profile.entity";

@Controller()
export class AppController {
  constructor(
      @InjectRepository(UserModel)
      private readonly userRepository : Repository<UserModel>,
      @InjectRepository(ProfileModel)
      private readonly profileRepository : Repository<ProfileModel>
  ) {}

  @Post('users')
  postUsers(){
    return this.userRepository.save({
      //title : 'test_title'
    });
  }

  @Get('users')
  getUsers(){
    return this.userRepository.find({relations:{
      profile: true
      }}/*{
      select : {
        id : true,
        title : true
      }
    }*/);
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id : string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id)
      }
    });
    return this.userRepository.save({...user/*, title : user.title + '0'*/});
  }

  @Post('user/profile')
  async createUserAndProfile(){
    const user = await this.userRepository.save({
        email: 'tyche0322@naver.com'
    });

    const profile = await this.profileRepository.save({
      profileImg : 'profileTest.jpg',
      user
    });

    return user;
  }
}
