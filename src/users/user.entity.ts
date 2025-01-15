import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from "typeorm";
import { Report } from "../reports/report.entity";

//console.log(Report); //can't use because of cirular dependancy. A function bellow solves this issue.

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    admin: boolean;

    //OneToMany doesn't cause a change to the database. 
    @OneToMany(() => Report, (report) => report.user) //() => Report a function that is returning a report entity class //This function solves the cirular dependancy issue
    reports: Report[];

    @AfterInsert()
    logInsert(){
        console.log('inserted User with id', this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log('Updated User with id', this.id);
    }

    @AfterRemove()
    logRemove(){
        console.log('Removed User with id', this.id);
    }
}