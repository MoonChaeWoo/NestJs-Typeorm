import {Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserModel} from "./entity/user.entity";
import {ProfileModel} from "./entity/profile.entity";
import {PostModel} from "./entity/post.entity";
import {TagModel} from "./entity/tag.entity";

@Controller()
export class AppController {
  constructor(
      @InjectRepository(UserModel)
      private readonly userRepository : Repository<UserModel>,
      @InjectRepository(ProfileModel)
      private readonly profileRepository : Repository<ProfileModel>,
      @InjectRepository(PostModel)
      private readonly postRepository : Repository<PostModel>,
      @InjectRepository(TagModel)
      private readonly tagRepository : Repository<TagModel>
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
      // 어떤 프로퍼티를 선택할지 설택
      // 기본은 모든 프로퍼티를 가져온다.
      // 만약 select를 정의하지 않는다면 모든 것들을 가져오고
      // 정의하지 않았을 시 정의된 프로퍼티만 가져온다.
      select : {
        id : true,
        version : true,
        profile : {
          id : true
        }
      },
      // where의 키값에 대한 조건들은 AND로 묶이게 된다.
      // OR조건을 주고 싶다면 배열형태로 주면 된다.
      where : [
          {
            id : 1,
            //version : 1 이건 id = 1AND version = 1; 로 된다는 의미이다.
          },
          {
            version : 1 // 이땐 id = 1 OR version = 1; 로 된다.
          },
          {
            profile : {
              id : 3
            }
          }
      ],
      // 관계를 가져오는 법
      // 엔티티에서 eager을 true 한다면 따로 find에서 옵션을 주지 않아도
      // 값이 관계에 대한 값은 불러와진다.
      // relations 옵션을 추가하는 순간부터 select와 where등에 사용이 가능해진다.
      relations: {
        profile : true
      },
      // 오름차순, 내림차순 정의 가능
      order : {
        id : 'ASC'
      },
      // 처음 몇개를 생략할지 갯수를 작성한다.
      skip : 1,
      // 몇개를 가져올 지 갯수를 작성한다.
      take : 2,
    });
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
        email: 'tyche0322@naver.com',
        profile : {
          profileImg : 'asdf.jpg'
        }
    });

    // const profile = await this.profileRepository.save({
    //   profileImg : 'profileTest.jpg',
    //   user
    // });

    return user;
  }

  @Post('user/post')
  async createUserPosts(){
    const user = await this.userRepository.save({
      email: 'tyche0322@naver.com'
    });

    const posts = await this.postRepository.save({
      title : 'postTitle',
      author : user
    });

    return user;
  }

  @Get('posts/posts')
  async readPosts(){
    return await this.postRepository.find({
      relations : {
        tags : true
      }
    });
  }

  @Get('posts/tags')
  async readTags(){
    return await this.tagRepository.find({
      relations : {
        posts : true
      }
    });
  }

  @Post('posts/tags')
  async createPostsTags(){
    const post1 = await this.postRepository.save({
      title : 'test_Many_To_Many Test1'
    });

    const post2 = await this.postRepository.save({
      title : 'test_Many_To_Many Test2'
    });

    const tag = await this.tagRepository.save({
        name : 'tag_Test',
        posts : [post1, post2]
    });

    return [post1, post2];
  }
}
