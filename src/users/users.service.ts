import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string){
        const user = this.repo.create({email, password});

        return this.repo.save(user);
    }

    findOne(id: number) {
        if (!id) {
            return null; //if we didn't do this null would return the first id in the list
        }
        return this.repo.findOneBy({id}); //returns 1 record or more
    }

    find(email: string) {
        return this.repo.find({where: {email}}) //returns an array of all the records that match the search criteria. if no results are foun dwe get an empty array
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }
}
