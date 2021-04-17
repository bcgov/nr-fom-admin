export class WorkflowState {

    code: string;
    description: string;

    constructor(obj?: any) {
        // Database fields
        this.code = (obj && obj.id) || null;
        this.description = (obj && obj.description) || null;
    }

}

