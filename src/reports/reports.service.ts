import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report> //now we can add write information into our database
    ) {} 

    createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto) {
        return this.repo
            .createQueryBuilder()
            //.select('*')
            .select('AVG(price)', 'price')
            .where('make = :make', {make}) //take a look at the make column of every row, then find the column where the make column is equal :make (which will come from the object next to it (estimateDto.make)) the reson for the colon syntax : is to address sql injection exploits
            //if we added a second where statment here, it would cancel out the previous where statement, which is why we use andWhere
            .andWhere('model = :model', {model})
            //.andWhere('lng - :lng', {lng}) //here we're just taking the lng of a report and subtracting some other lng from it, but we want it to be +/-10 degrees so instead we will use BETWEEN
            .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
            .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
            .andWhere('year - :year BETWEEN -3 AND 3', {year}) //+ or - 3 years
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC') //ABS is to get the absolute value
            .setParameters({mileage}) //you can't pass the mileage the same way we did to year, lat, lng... in orderBy, because orderBy doesn't take a parameter object as a second argument
            .limit(3) //only 3
            //.getRawMany() //returns all the data and reports (Many records)
            .getRawOne() //because we're using AVG
    }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user; //now we have setup our assosiation. this extracts just the user id from our user entity instance
        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });
        if(!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
      }
}
