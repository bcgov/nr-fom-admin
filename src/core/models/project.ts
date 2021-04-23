import { District } from './district';
import { ForestClient } from './forestclient';
import { PublicComment } from './publiccomment';
import { WorkflowStateCode } from './workflowstatecode';

export class Project {
  // Database fields
  id: number;
  revisionCount: number;
  createTimestamp: string | Date = null;
  createUser: string;
  updateTimestamp: string | Date = null;
  updateUser: string;
  name: string;
  description: string;
  commentingOpenDate: string | Date = null;
  commentingClosedDate: string | Date = null;
  fspId: number;
  districtId: number;
  forestClientId?: string;
  // workflow_state_code: string;
  district?: District;
  forestClient?: ForestClient;
  workflowStateCode?: WorkflowStateCode;
  publicComments?: PublicComment[] = [];


  constructor(obj?: any) {
    // Database fields
    this.id = (obj && obj.id) || null;
    this.revisionCount = (obj && obj.revisionCount) || null;
    this.createTimestamp = (obj && obj.createTimestamp) || null;
    this.createUser = (obj && obj.createUser) || null;
    this.updateTimestamp = (obj && obj.updateTimestamp) || null;
    this.updateUser = (obj && obj.updateUser) || null;
    this.name = (obj && obj.name) || null;
    this.description = (obj && obj.description) || null;
    this.commentingOpenDate = (obj && obj.commentingOpenDate) || null;
    this.commentingClosedDate = (obj && obj.commentingClosedDate) || null;
    this.fspId = (obj && obj.fspId) || null;
    this.districtId = (obj && obj.districtId) || null; // not zero
    this.forestClientId = (obj && obj.forestClientId) || null;
    // this.workflow_state_code = (obj && obj.workflow_state_code) || null;
    this.district = (obj && obj.district) || null;
    this.forestClient = (obj && obj.forestClient) || null;
    this.workflowStateCode = (obj && obj.workflowStateCode) || null;
    // this.publicComments = (obj && obj.publicComments) || null;
    this.publicComments = new Array<PublicComment>();

    // if (obj && obj.createTimestamp) {
    //   this.createTimestamp = new Date(obj.createTimestamp);
    // }

    // if (obj && obj.updateTimestamp) {
    //   this.updateTimestamp = new Date(obj.updateTimestamp);
    // }

    // if (obj && obj.commentingOpenDate) {
    //   this.commentingOpenDate = new Date(obj.commentingOpenDate);
    // }

    // if (obj && obj.commentingClosedDate) {
    //   this.commentingClosedDate = new Date(obj.commentingClosedDate);
    // }

    if (obj && obj.description) {
      // replace \\n (JSON format) with newlines
      this.description = obj.description.replace(/\\n/g, '\n');
    }
  }
}
