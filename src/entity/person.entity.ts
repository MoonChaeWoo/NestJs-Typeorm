import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {UserModel} from "./user.entity";

export class Name{
    @Column()
    _first: string;

    @Column()
    _last: string;
}

@Entity()
export class StudentModel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => Name)
    name: Name;

    @Column()
    class: string;
}

@Entity()
export class TeacherModel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column(() => Name)
    name: Name;

    @Column()
    salary: number;
}