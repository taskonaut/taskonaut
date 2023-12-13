export interface Task {
    uuid: string;
    ownerUid: string;
    groupId: string | null;
    complete: boolean;
    name: string;
    description: string;
    dueDate: number | null;
    subtasks: Task[];
}

export interface Group {
    uuid: string;
    ownerUid: string;
    name: string;
    sharedWith: string[];
    tasks: Task[];
}

export interface ShareRequest {
    from: string;
    groupId: string;
    to: string;
}
