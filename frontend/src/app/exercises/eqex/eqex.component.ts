import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ExerciseService } from 'src/app/exercise-service/exercise.service';
import { EqEx, Exercise } from 'src/app/exercise-service/exercises';
import { Role, RoleGuardService } from 'src/app/guards/role-guard.service';
import { serverMockEnabled } from 'src/app/helper/tests/tests.config';
import { removeMathTabIndex } from 'src/app/helper/utils';
import { image } from 'src/app/server-routes';
import {
  ExerciseComponentType,
  ExerciseInflationService as InflationService,
  SubmitButtonState,
} from '../inflation.service/inflation.service';
declare var MathJax: any;

class Unknown {
  private formatRegex = /^[+-]?\d*(?:[,\.]\d+)?(?:[eE][+-]?\d+)?$/;
  isWrongFormat = false;
  isCorrect = false;
  isWrong = false;

  name: string;
  unit: string;
  input: string = '';
  constructor(unknown: [string, string]) {
    this.name = unknown[0];
    this.unit = unknown[1];
  }

  checkFormat() {
    this.isCorrect = false;
    this.isWrong = false;
    this.isWrongFormat = !this.formatRegex.test(this.input);
  }

  setAnswerCorrectness(value: boolean) {
    this.isCorrect = false;
    this.isWrong = false;
    this.isWrongFormat = false;
    if (value) this.isCorrect = true;
    else this.isWrong = true;
  }
}

@Component({
  selector: 'app-eqex',
  templateUrl: './eqex.component.html',
  styleUrls: ['./eqex.component.scss'],
})
export class EqExComponent implements ExerciseComponentType, AfterViewInit {
  @Output() loaded = new BehaviorSubject<number | null>(null);
  @Output() submitButtonState = new EventEmitter<SubmitButtonState>();

  private loadedImages: boolean[] = [];
  isLoading = true;
  isSubmitted = false;

  exercise: EqEx | null;
  images?: string[];
  private imgAlts?: string[];
  unknowns: Unknown[] = [];

  private isUser: boolean;
  constructor(
    inflationService: InflationService,
    private exerciseService: ExerciseService,
    accountService: AccountService
  ) {
    const account = accountService.currentAccount.getValue();
    this.isUser = account
      ? RoleGuardService.getRole(account) === Role.USER
      : true;

    this.exercise = inflationService.getExercise<EqEx>();
    if (!this.exercise) this.onLoaded(InflationService.InflationError);
    else {
      this.imgAlts = this.exercise.content.img;
      this.images = serverMockEnabled
        ? this.exercise.content.img
        : this.getImages(this.exercise.content.img);
      this.unknowns = this.exercise.content.unknowns.map(
        (unknown) => new Unknown(unknown)
      );
      if (this.exercise.content.correct) {
        for (
          let i = 0;
          i < this.exercise.content.correct.length && i < this.unknowns.length;
          i++
        ) {
          this.unknowns[i].input = this.exercise.content.correct[i].toString();
          this.unknowns[i].isCorrect = true;
        }
      }

      if (!this.images || this.images.length === 0) this.onLoaded();
    }
  }

  getTextAsMath(text: string): string {
    return `\\(${text}\\)`;
  }

  submitAnswers() {
    if (this.exercise) {
      this.isSubmitted = true;
      this.submitButtonState.emit('loading');
      const answers = this.unknowns.map((unknown) =>
        unknown.input.length > 0
          ? Number(unknown.input.replace(',', '.'))
          : null
      );
      return this.exerciseService
        .submitAnswers(
          this.exercise.subjectId,
          this.exercise.id,
          answers,
          EqEx.isEqExAnswer,
          this.unknowns.length
        )
        .then((results) => {
          if (this.exercise && this.isUser)
            return this.setLocalDone(this.exercise.id, results);
          for (let i = 0; i < results.length; i++)
            this.unknowns[i].setAnswerCorrectness(results[i]);
        })
        .finally(() => {
          this.isSubmitted = false;
          this.submitButtonState.emit('active');
        });
    } else return Promise.reject({ status: InflationService.InflationError });
  }

  setLocalDone(name: string, answers: boolean[]) {
    if (this.exercise)
      Exercise.setDone('EqEx', name, this.exercise.subjectId, answers);
  }

  ngAfterViewInit() {
    MathJax.typeset();
    removeMathTabIndex();
  }

  onImageLoaded() {
    this.loadedImages.push(true);
    if (this.loadedImages.length === this.images?.length && this.isLoading)
      this.onLoaded();
  }

  private onLoaded(error: number | null = null) {
    this.loaded.next(error);
    this.isLoading = false;
  }

  checkIfSubmitDisabled() {
    this.submitButtonState.emit(
      this.unknowns.some(
        (unknown) => unknown.isWrongFormat || unknown.input.trim().length === 0
      )
        ? 'disabled'
        : 'active'
    );
  }

  private getImages(paths: string[] | undefined): string[] | undefined {
    if (!this.exercise || !paths) return undefined;
    const img: string[] = [];
    for (const path of paths) img.push(image(this.exercise.subjectId, path));
    return img;
  }

  getImageAlt(i: number): string {
    let alt = 'B????d wczytywania obrazka';
    const images = this.imgAlts;
    if (images && Array.isArray(images) && i < images.length)
      alt += ` ${images[i]}`;
    return alt;
  }
}
