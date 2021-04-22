
export class PublicComment {
  // Database fields
  id: number;
  revisionCount: number;
  createTimestamp: Date = null;
  updateTimestamp: Date = null;
  createUser: string;
  updateUser: string;
  feedback: string;
  name: string;
  location: string;
  description: string;
  email: string;
  phoneNumber: string;
  responseDetails: string;
  responseCode: string;



  constructor(obj?: any) {
    // Database fields
    this.id = (obj && obj.id) || null;
    this.revisionCount = (obj && obj.revisionCount) || null;
    this.createTimestamp = (obj && obj.createTimestamp) || null;
    this.createUser = (obj && obj.createUser) || null;
    this.updateTimestamp = (obj && obj.updateTimestamp) || null;
    this.updateUser = (obj && obj.updateUser) || null;
    this.name = (obj && obj.name) || null;
    this.feedback = (obj && obj.feedback) || null;
    this.location = (obj && obj.location) || null;
    this.description = (obj && obj.description) || null;
    this.email = (obj && obj.email) || null;
    this.phoneNumber = (obj && obj.phoneNumber) || null;
    this.responseDetails = (obj && obj.responseDetails) || null;
    this.responseCode = (obj && obj.responseCode) || null;


    if (obj && obj.createTimestamp) {
      this.createTimestamp = new Date(obj.createTimestamp);
    }

    if (obj && obj.updateTimestamp) {
      this.updateTimestamp = new Date(obj.updateTimestamp);
    }

    if (obj && obj.description) {
      // replace \\n (JSON format) with newlines
      this.description = obj.description.replace(/\\n/g, '\n');
    }

    if (obj && obj.responseDetails) {
      // replace \\n (JSON format) with newlines
      this.responseDetails = obj.responseDetails.replace(/\\n/g, '\n');
    }
  }
}
