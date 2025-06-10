import {JoinRequest} from '../util/join-request/join-request.model'

export interface EndUserJoinRequest extends JoinRequest {
  fullName: string;
}
