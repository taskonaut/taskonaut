export interface Task {
    uuid: string;
    projectId: null | string;
    header: string;
    body: string;
    dateCreated: Date;
    dueDate: null | Date;
    complete: boolean;
    dateCompleted: null | Date;
}

export interface List {
    uuid: string;
    name: string;
    taskOrder: string[];
}
