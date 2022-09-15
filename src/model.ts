export interface Task {
    uuid: string;
    header: string;
    body: string;
    dateCreated: Date;
    dueDate: Date;
    dateCompleted: Date;
}

export interface List {
    uuid: string;
    name: string;
    tasks: Task[];
}
