export class District {

    id: number;
    revisionCount: number;
    createTimestamp: Date = null;
    updateTimestamp: Date = null;
    createUser: string;
    updateUser: string;
    name: string;

    constructor(obj?: any) {
        // Database fields
        this.id = (obj && obj.id) || null;
        this.revisionCount = (obj && obj.revisionCount) || null;
        this.createTimestamp = (obj && obj.createTimestamp) || null;
        this.updateTimestamp = (obj && obj.updateTimestamp) || null;
        this.createUser = (obj && obj.createUser) || null;
        this.updateUser = (obj && obj.updateUser) || null;
        this.name = (obj && obj.name) || null;

        if (obj && obj.createTimestamp) {
            this.createTimestamp = new Date(obj.createTimestamp);
        }

        if (obj && obj.updateTimestamp) {
            this.updateTimestamp = new Date(obj.updateTimestamp);
        }
    }

}

