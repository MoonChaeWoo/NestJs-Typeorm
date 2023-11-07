import {
    Column,
    CreateDateColumn, Entity, Generated, OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn
} from "typeorm";
import {ProfileModel} from "./profile.entity";
import {JoinColumn} from "typeorm";
import {PostModel} from "./post.entity";
import {Post} from "@nestjs/common";

export enum Role{
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class UserModel{

    // @PrimaryGeneratedColumn()
    // 자동으로 UID를 생성한다.

    // Primary Column은 모든 테이블에 필수 존재

    // @PrimaryColumn()
    // PrimaryColumn()은 UID를 수동생성해줘야함.

    // @PrimaryGeneratedColumn('uuid')
    // ex) asgasdgasdfa-asdfasfSaf
    // 위와같은 형식이며 절대 값이 겹치지않음.
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    email: string;

    // @Column({
    //     // DB에서 인지하는 컬럼 타입
    //     // 미설정 시 자동으로 유추됨
    //     type : 'varchar',
    //     // 데이터베이스 컬럼이름
    //     // 미설정 시 프로퍼티 이름으로 자동유추됨
    //     name : 'title',
    //     // 값의 길이
    //     // 입력 할 수 있는 글자의 길이 설정
    //     length : 300,
    //     // default : true (null 입력 가능)
    //     nullable : true,
    //     // false 면 처음 저장할 때 값으로 고정
    //     // false일 땐 이후에는 값 변경이 불가능
    //     update : true,
    //     // 기본값은 true
    //     // find()를 실행할 때 기본으로 값을 불러올지 설정
    //     // 아래와 같이 옵션을 줘야하며 필요한 값들도 저렇게 설정해야함.
    //     // find({
    //     //     select : {
    //     //           id : true,
    //     //           title : true
    //     //      }
    //     // })
    //     select : true,
    //     // 아무것도 입력하지 않았을 시 기본이 되는값
    //     default : 'default value',
    //     // 컬럼 중에서 유일무이한 갑이 돼어야하는지 설정
    //     // 기본값은 false
    //     unique : false
    // })
    // title : string;

    @Column({
        type : 'enum',
        enum : Role,
        default : Role.USER,
    })
    role: Role;

    // 데이터 생성 일자
    // 데이터가 생성되는 날짜와 시간이 자동입력
    @CreateDateColumn({
        name : 'create_at'
    })
    createAt : Date;

    // 데이터 생성 일자
    // 데이터가 업뎃되는 날짜와 시간이 자동입력
    @UpdateDateColumn({
        name : 'update_at'
    })
    updateAt : Date;

    // 데이터가 업데이트 될 때마다 1씩 증가
    // 처음 생성값은 1
    // save() 함수가 몇번 불렸는지 기억한다.
    @VersionColumn()
    version: number;

    // @Generated()
    // @Generated('increment')
    // -> 데이터가 생성될 시 자동으로 1씩 올라감
    // -> 하지만 UID는 아님

    // @Generated('uuid')
    // -> 데이터 생성 시 UID가 아닌 hash값이 주입
    @Column({
        name : 'additional_id'
    })
    @Generated('uuid')
    additionalId : number;

    @OneToOne(() => ProfileModel, (profile)=> profile.user, {
        // find() 실행할 때마다 항상 같이 가져올 relation을 자동으로 가져오도록 해준다.
        // 즉 자스 find쿼리에서 relations:{tags: true}  이렇게 안해도 자동으로 된다는 의미.
        eager : false,
        // 기본값은 false이다.
        // 저장할 때 relation을 한번에 같이 저장가능여부
        // 즉 연결된 다른 테이블에 pk를 넘겨서 한번에 자동으로 데이터들의 pk와 fk를 저장해줌
        cascade : true,
        // 기본값은 true
        // null 가능 여부
        // false를 하면 관계가 연결된 값을 함께 넣어주지 않으면 오류 발생
        nullable : true,
        // 관계가 삭제됐을 때 즉 profile 컬럼의 데이터가 삭제됐을 때
        // no action : 아무것도 안함
        // casecade : 참조하는 Row도 같이 삭제
        // set null : 참조하는 Row에서 참조 id를 null로 변경
        // set default : 기본 세팅으로 설정 (테이블의 기본 세팅)
        // restrict : 참조하고 있는 Row가 있는 경우 참조 당하는 Row 삭제 불가
        //            즉 참조를 당하고 있다면 삭제가 안된다는 의미.
        onDelete : 'CASCADE'
    })
    profile:ProfileModel;
    @OneToMany(() => PostModel, (posts) => posts.author)
    posts : PostModel[];

    @Column({
        default : 0
    })
    count : number;
}