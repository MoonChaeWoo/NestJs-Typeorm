import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserModel} from "./user.entity";

@Entity()
export class PostModel{
    @PrimaryGeneratedColumn()
    id : number;

    // OneToMany과 ManyToOne에선 무조건 ManyToOne입장에서 OneToMany의 pk id를 갖게 된다
    // 즉 그렇다는건 이 관계에선 @JoinColumn이 필요가 없다.
    // JoinColumn은 컬럼의 이름을 설정을 한다면 꼭 작성해서 옵션을 주어야한다.
    @ManyToOne(() => UserModel, (user) => user.posts)
    @JoinColumn({name : 'author_id'})
    author : UserModel;

    @Column()
    title : string;


}