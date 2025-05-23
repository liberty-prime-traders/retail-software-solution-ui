import {JoinRequest} from '../join-request/join-request.model'

export interface EndUserJoinRequest extends JoinRequest {
  fullName: string;
}
