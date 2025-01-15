import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guards';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/repory.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }

    @Post()
    @UseGuards(AuthGuard) //to make sure that the user is actully signed in before they can create a report
    @Serialize(ReportDto) //serialize the outc+going response folloing the rules we set up inside the report DTO i.e. will no longer show user's info
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) { //now we have both the body and the user!
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }
}
