import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

//console.log(User); //the user entity class is undefined just because the code in it hasn't been executed yet because of cirular dependency, so we will comment it out

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    approved: boolean;

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    lng: number;

    @Column()
    lat: number;

    @Column()
    mileage: number;

    //ManyToMan makes changes to the database a new column is added to the reports table automatically (user_id col is used to assosiate tables i.e. FK Forigen Key)
    @ManyToOne(() => User, (user) => user.reports) //
    user: User;
}