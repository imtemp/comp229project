import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user.service';
import { Question } from '../../models/question';
import { Survey } from '../../models/survey';
import { SurveyService } from './survey.service';

@Injectable({ providedIn: 'root' })
export class SurveyResolver implements Resolve<Survey> {
    constructor(
        private service: SurveyService,
        private userService: UserService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        if (state.url == '/') {
            return this.service.listSurveys();
        } else if (state.url == '/my-surveys') {
            return this.service.listUserSurveys(this.userService.getUser().id);
        }

        const includeSubmissions = state.url.startsWith('/responses') || state.url.startsWith('/stats');
        return this.service.fetchSurvey(route.paramMap.get('id'), includeSubmissions);
    }
}
