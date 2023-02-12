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
    taskOrder: string[];
}

export interface Group {
    uuid: string;
    createdBy: string;
    name: string;
    description: string;
    dateCreated: number;
    sharedWith: string[];
    taskOrder: string[];
}

export interface ShareRequest {
    from: string;
    groupId: string;
    to: string;
}
