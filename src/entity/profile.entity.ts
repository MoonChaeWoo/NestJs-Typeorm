import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {JoinColumn} from "typeorm";
import {UserModel} from "./user.entity";

@Entity()
export class ProfileModel{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> UserModel/*, (user) => user.profile*/)
    // referencedColumnName 속성을 생략하면 자동으로 대상 테이블의 pk 값으로 지정 된다.
    @JoinColumn({name : 'user_id'})
    user: UserModel;

    @Column()
    profileImg: string;
}