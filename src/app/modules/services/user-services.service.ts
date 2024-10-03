import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../share/environment';
import { ISkill, ITask } from '../share/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<{ token: string }> {
    const url = `${environment.authApi}/login`;
    const body = { email, password };

    return this.http.post<{ token: string }>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  registerUser(username: string, email: string, password: string): Observable<{ message: string; userId: string }> {
    const url = `${environment.authApi}/register`;  
    const body = { username, email, password };

    return this.http.post<{ message: string; userId: string }>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  getTasks(): Observable<ITask[]> {
    const url = `${environment.tasksApi}/list`;
    return this.http.get<ITask[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createTask(taskData: Partial<ITask>): Observable<ITask> {
    const url = `${environment.tasksApi}`;

    return this.http.post<ITask>(url, taskData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(taskId: string): Observable<ITask> {
    const url = `${environment.tasksApi}/${taskId}`;
    return this.http.get<ITask>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addPersonToTask(taskId: string, fullName: string, age: number, skills: ISkill[]): Observable<ITask> {
    const url = `${environment.tasksApi}/${taskId}/persons`;
    const body = { fullName, age, skills };
    return this.http.post<ITask>(url, body, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  removePersonFromTask(taskId: string, personId: string): Observable<ITask> {
    const url = `${environment.tasksApi}/delete-persona/${taskId}/persons/${personId}`;
    return this.http.delete<ITask>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(taskId: string, taskData: Partial<ITask>): Observable<ITask> {
    const url = `${environment.tasksApi}/update-task/${taskId}`;
    return this.http.patch<ITask>(url, taskData, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(taskId: string): Observable<{ message: string; task: ITask }> {
    const url = `${environment.tasksApi}/delete-task/${taskId}`;
    return this.http.delete<{ message: string; task: ITask }>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(error);
  }
}
