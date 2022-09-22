export interface Task {
    uuid: string;
    groupId: null | string;
    header: string;
    body: null | string;
    dateCreated: Date;
    dueDate: null | Date;
    complete: boolean;
    dateCompleted: null | Date;
}

export interface Group {
    uuid: string;
    name: string;
    taskOrder: string[];
}
