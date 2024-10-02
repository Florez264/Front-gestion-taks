import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { debounceTime } from 'rxjs/operators';
import { faCommentDots, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgIf } from "@angular/common";
import { ITask } from '../../share/models/task.model';
import { UserServicesService } from '../../services/user-services.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [TableComponent, ReactiveFormsModule, FaIconComponent, NgIf],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {

    tasks: ITask[] = [];
    filteredTask: ITask[] = [];
    searchControl = new FormControl('');
    selectedStatus: boolean | null = null;
    dropdownOpen: boolean = false;

    constructor(private taskService: UserServicesService) {}

    ngOnInit(): void {
        this.loadTasks();

        this.searchControl.valueChanges
            .pipe(debounceTime(300))
            .subscribe((searchTerm: string | null) => {
                this.filterTasks(searchTerm || '');
            });
    }

    private loadTasks(): void {
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTask = tasks.map(task => ({
            ...task,
            personCount: task.persons.length
          }));
        },
        error: (error) => {
          console.error('Error fetching tasks', error);
        }
      });
    }



    private filterTasks(searchTerm: string): void {
        let filtered = this.tasks;

        if (this.selectedStatus !== null) {
            filtered = filtered.filter(task => task.completed === this.selectedStatus);
        }

        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.name?.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredTask = filtered;
    }

    filterStatus(completed: boolean | null): void {
        this.selectedStatus = completed;
        this.filterTasks(this.searchControl.value || '');
        this.toggleDropdown();
    }

    toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
    }

    protected readonly faCommentDots = faCommentDots;
    protected readonly faSearch = faSearch;
    protected readonly faFilter = faFilter;
}
