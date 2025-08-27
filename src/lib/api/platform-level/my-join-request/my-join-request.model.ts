import {JoinRequest} from '../../util/join-request/join-request.model'

export interface MyJoinRequest extends JoinRequest {
  domain: string;
}
