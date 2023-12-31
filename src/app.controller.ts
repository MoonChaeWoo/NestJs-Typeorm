import {Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {
  Between,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from "typeorm";
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

  @Post('sample')
  async sample(){
    // 모델에 해당되는 객체 생성 - 저장은 안함

   const user1 = this.userRepository.create({
     email : 'test@google.com',
   });

   // const user2 = await this.userRepository.save(user1)
   // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 수정한
    // 해당 모델에 대한 타입의 객체를 생성해냄
    // 간단하게 {...user, email : 'test'} 이렇게 함
    // DB에 저장하지는 않음
    const user3 = this.userRepository.preload({
      id : 101,
      email : 'preloadTest@google.com'
    });

    // 삭제하기
    // pk의 대한 값만 넣어준다
    await this.userRepository.delete(101);

    // increment({원하는 컬럼 : 찾는 값, 값을 증가 시키고 싶은 컬럼, 몇씩 올릴건지 양})
    // await this.userRepository.increment({
    //   id : 1
    // }, 'count', 2)

    // increment와 반대로 값을 줄임, 사용법은 위과 같음
    // await this.userRepository.decrement({
    //   id : 1
    // }, 'count', 2)

    // 갯수 count 기능
    // const count = this.userRepository.count({
    //   where : {
    //     id : MoreThanOrEqual(100)
    //   }
    // })

    // 해당 컬럼의 합계에 대한 기능
    // 두번째에는 컬럼의 조건에 만족하는 컬럼의 합계를 구해준다.
    // const sum = this.userRepository.sum('count',{
    //   id : LessThan(10)
    // });

    const avg = this.userRepository.average('count', {
      id : LessThan(10)
    })

    const min = this.userRepository.minimum('count', {
      id : LessThan(10)
    })

    const max = this.userRepository.maximum('count', {
      id : LessThan(10)
    })

    const userOne = this.userRepository.findOne({
      where : {
        id : LessThan(10)
      }
    })

    // 조건에 해당하는 데이터들을 반환하고 마지막에 총 갯수를 반환해줌
    const userFindCount = this.userRepository.findAndCount({
      where : {
        id : LessThan(5)
      }
    })
    return userFindCount;
  }

  @Post('users')
  postUsers(){
    for(let i = 0; i <100; i++){
      this.userRepository.save({
        email : `email_test${i}@google.com`
      });
    }
    return true;
  }

  @Get('users')
  getUsers(){
    return this.userRepository.find({
      // 어떤 프로퍼티를 선택할지 설택
      // 기본은 모든 프로퍼티를 가져온다.
      // 만약 select를 정의하지 않는다면 모든 것들을 가져오고
      // 정의하지 않았을 시 정의된 프로퍼티만 가져온다.
      // select : {
      //   id : true,
      //   version : true,
      //   profile : {
      //     id : true
      //   }
      // },
      // where의 키값에 대한 조건들은 AND로 묶이게 된다.
      // OR조건을 주고 싶다면 배열형태로 주면 된다.
      where : {
        // id : Not(1),
        // id가 1이 아닌 것들을 선택

        // id : LessThan(10),
        // 보다 작은 값을 찾을 때 사용한다.

        // id : LessThanOrEqual(10),
        // 작거나 같은 값을 선택할 때 사용한다.

        // id : MoreThan(10),
        // 보다 큰 것을 찾을 때 사용한다.

        // id : MoreThanOrEqual(10),
        // 보다 크거나 같은 값을 찾을 때 사용한다.

        // id : 1 또는 id : Equal(1),

        // like와 같은 기능
        // %를 꼭 넣어주어야한다.
        // 앞에 어떤 글자가 와도 된다. %google
        // email: Like('%google'),

        // 대소문자 구별 안하는 like
        // email : ILike('%google%'),

        // 사이값
        // id : Between(10, 15),

        // 해당되는 여러개의 값
        // id : In(1, 3, 5, 7, 10),

        // null인것을 찾기
        //id : IsNull(),
      },
      // 관계를 가져오는 법
      // 엔티티에서 eager을 true 한다면 따로 find에서 옵션을 주지 않아도
      // 값이 관계에 대한 값은 불러와진다.
      // relations 옵션을 추가하는 순간부터 select와 where등에 사용이 가능해진다.
      // relations: {
      //   profile : true
      // },
      // 오름차순, 내림차순 정의 가능
      // order : {
      //   id : 'ASC'
      // },
      // 처음 몇개를 생략할지 갯수를 작성한다.
      // skip : 1,
      // 몇개를 가져올 지 갯수를 작성한다.
      // take : 2,

      order : { id : 'ASC'}
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
