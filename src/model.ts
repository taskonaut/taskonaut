export interface Task {
    uuid: string;
    header: string;
    body: string;
    dateCreated: Date;
    dueDate: null | Date;
    dateCompleted: null | Date;
}

export interface List {
    uuid: string;
    name: string;
    taskOrder: string[];
    tasks: Task[];
}
