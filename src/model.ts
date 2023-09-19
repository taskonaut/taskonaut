export interface Task {
    uuid: string;
    parentId: undefined | string;
    createdBy: string;
    header: string;
    body: undefined | string;
    dateCreated: number;
    dueDate: undefined | number;
    complete: boolean;
    dateCompleted: undefined | null | number;
    subtasks: Task[];
}

export interface Group {
    uuid: string;
    ownerId: string;
    name: string;
    description: string;
    dateCreated: number;
    sharedWith: string[];
    tasks: Task[];
}

export interface ShareRequest {
    from: string;
    groupId: string;
    to: string;
}
