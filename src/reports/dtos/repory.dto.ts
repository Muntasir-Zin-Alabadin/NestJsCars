import { Expose, Transform } from "class-transformer";
import { User } from "src/users/user.entity";

export class ReportDto {
    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    lng: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    mileage: number;
    @Expose()
    approved: boolean;

    @Transform(({obj}) => obj.user.id) //take the original report entity that we're trying to format through the dto and we mark it as "obj" then look at its user property then get that user's id
    @Expose()
    userId: number;
}
