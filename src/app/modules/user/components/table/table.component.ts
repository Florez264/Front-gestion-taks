import {Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle, SlicePipe} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faCalendarPlus,
  faCheckCircle,
  faCogs,
  faCrown, faEdit, faExpandArrowsAlt,
  faEye,
  faEyeSlash,
  faFilter,
  faLock,
  faMedal, faPlus, faRedoAlt,
  faStar,
  faTrash,
  faUnlock,
  faUser,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router';
import { IPerson, ISkill, ITask } from 'src/app/modules/share/models/task.model';
import { UserServicesService } from 'src/app/modules/services/user-services.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  imports: [SlicePipe, NgForOf, FormsModule, NgClass, FaIconComponent, NgIf, NgStyle, ReactiveFormsModule],
  standalone: true,
})
export class TableComponent {

  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | null = null;

  showCreateTaskModal: boolean = false;
  showAddPersonModal: boolean = false;

  showTaskDetailsModal = false;

  showEditTaskModal = false;
  editTaskForm: FormGroup;
  selectedTask: ITask | null = null;
  showModal: boolean = false;
  selectedTaskId: string | null = null;
  newPerson = {
    fullName: '',
    age: 0,
    skills: ''
  };

  newTask: Partial<ITask> = {
    name: '',
    dueDate: new Date(),
    completed: false,
  };
  selectedUser: any = null;

  @Input() data: any[] = [];
  @Input() filterText: string = '';
  @Input() pageSize: number = 10;
  activeDropdown: string | null = null;

  currentPage: number = 1;
  paginatedData: any[] = [];
  selectedRoles: string = "";

  constructor(
    private router: Router,
    private userService: UserServicesService,
    private fb: FormBuilder,
  )  {
    this.editTaskForm = this.fb.group({
      name: ['', Validators.required],
      dueDate: ['', Validators.required],
      completed: [false, Validators.required],
    });
  }


  ngOnInit(): void {
    this.updatePaginatedData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterText'] || changes['data']) {
      this.updatePaginatedData();
    }
  }

  getFilteredData(): any[] {
    return this.data
        .filter(item =>
            (item.name?.toLowerCase().includes(this.filterText.toLowerCase()) ||
                item.uuid?.toLowerCase().includes(this.filterText.toLowerCase()) ||
                item.role?.toLowerCase().includes(this.filterText.toLowerCase()))
        )
        .filter(item => this.selectedRoles.length === 0 || this.selectedRoles.includes(item.role));
  }

  updatePaginatedData() {
    let filteredData = this.getFilteredData();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = filteredData.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredData().length / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  isLastElement(item: any): boolean {
    const index = this.paginatedData.findIndex((i: any) => i.uuid === item.uuid);
    return index === this.paginatedData.length - 1 || index === this.paginatedData.length - 2 || index === this.paginatedData.length - 3;
  }



  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }


  blockUser(item: any) {

    this.activeDropdown = null;
  }

  deleteUser(item: any) {}



  openCreateTaskModal() {
    this.showCreateTaskModal = true;
  }

  closeCreateTaskModal() {
    this.showCreateTaskModal = false;
    this.newTask = { name: '', dueDate: new Date(), completed: false };
  }

  openAddPersonModal(taskId: string) {
    this.selectedTaskId = taskId;
    this.showAddPersonModal = true;
  }

  closeAddPersonModal() {
    this.showAddPersonModal = false;
    this.newPerson = { fullName: '', age: 0, skills: '' };
  }


  submitTask() {
    if (this.newTask.name && this.newTask.dueDate) {
      this.userService.createTask(this.newTask).subscribe(
        response => {
          Swal.fire('Éxito', 'Tarea creada exitosamente', 'success');
          this.closeCreateTaskModal();
          this.router.navigate(['home'])
          this.updatePaginatedData();
        },
        error => {
          Swal.fire('Error', 'No se pudo crear la tarea', 'error');
        }
      );
    }
  }

  submitAddPerson() {
    if (this.selectedTaskId) {
      const skillsArray: ISkill[] = this.newPerson.skills.split(',').map(skill => ({ name: skill.trim() }));
      this.userService.addPersonToTask(this.selectedTaskId, this.newPerson.fullName, this.newPerson.age, skillsArray)
        .subscribe(
          response => {
            Swal.fire('Éxito', 'Persona añadida a la tarea', 'success');
            this.closeAddPersonModal();
            this.router.navigate(['home'])
          },
          error => {
            Swal.fire('Error', 'Hubo un problema al añadir la persona', 'error');
          }
        );
    }
  }


  viewTaskDetails(taskId: string) {
    this.userService.getTaskById(taskId).subscribe((task) => {
      task.persons.forEach((person) => (person['showDetails'] = false));
      this.selectedTask = task;
      this.showTaskDetailsModal = true;
    });
  }

  closeTaskDetailsModal() {
    this.showTaskDetailsModal = false;
  }

  togglePersonDetails(person: IPerson) {
    person.showDetails = !person.showDetails;
  }

    confirmRemovePerson(taskId?: string, personId?: string) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removePersonFromTask(taskId!, personId!);
        }
      });
    }

    removePersonFromTask(taskId: string, personId: string) {
      this.userService.removePersonFromTask(taskId, personId).subscribe({
        next: (updatedTask) => {
          this.selectedTask = updatedTask;
          Swal.fire('Eliminada', 'La persona ha sido eliminada de la tarea.', 'success');
          this.router.navigate(['home'])
        },
        error: (error) => {
          Swal.fire('Error', 'Ocurrió un error al eliminar la persona.', 'error');
        }
      });
    }


    openEditTaskModal(task: ITask) {
      this.selectedTask = task;
      this.editTaskForm.patchValue({
        name: task.name,
        dueDate: task.dueDate,
        completed: task.completed,
      });
      this.showEditTaskModal = true;
    }

    closeEditTaskModal() {
      this.showEditTaskModal = false;
    }

    onSubmitEditTask() {
      if (this.editTaskForm.invalid) return;

      const updatedTaskData: Partial<ITask> = this.editTaskForm.value;
      this.userService.updateTask(this.selectedTask!._id, updatedTaskData).subscribe({
        next: (updatedTask) => {
          this.selectedTask = updatedTask;
          Swal.fire('Actualizada', 'La tarea ha sido actualizada correctamente.', 'success');
          this.closeEditTaskModal();
          this.router.navigate(['home']);
        },
        error: (error) => {
          Swal.fire('Error', 'Hubo un problema al actualizar la tarea.', 'error');
        }
      });
    }

    confirmDeleteTask(taskId: string) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteTask(taskId);
        }
      });
    }

    deleteTask(taskId: string) {
      this.userService.deleteTask(taskId).subscribe({
        next: (response) => {
          Swal.fire('Eliminado', response.message, 'success');
          this.updatePaginatedData();
          this.router.navigate(['home']);
        },
        error: (error) => {
          Swal.fire('Error', 'Ocurrió un error al eliminar la tarea.', 'error');
        }
      });
    }


  protected readonly faUserTie = faUserTie;
  protected readonly faFilter = faFilter;

  protected readonly faEye = faEye;
  protected readonly faPlus = faPlus;
  protected readonly faEdit = faEdit;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faTrash = faTrash;
  protected readonly faLock = faLock;
  protected readonly faUnlock = faUnlock;
  protected readonly faCogs = faCogs;
  protected readonly faCheckCircle = faCheckCircle;
  faCrown = faCrown;
  faMedal = faMedal;
  faStar = faStar;
  faUser = faUser;

  protected readonly faExpandArrowsAlt = faExpandArrowsAlt;
  protected readonly faRedoAlt = faRedoAlt;
  protected readonly faCalendarPlus = faCalendarPlus;
}
