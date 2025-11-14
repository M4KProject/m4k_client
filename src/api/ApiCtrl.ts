import { PbAuthColl, PbColl } from "pblite";
import { Sync } from "./sync";
import {
  ApplicationModel,
  DeviceModel,
  GroupModel,
  JobModel,
  MediaModel,
  MemberModel,
  UserModel,
} from './models';

export class ApiCtrl {
    device = new Sync<DeviceModel>('devices');
    group = new Sync<GroupModel>('groups');
    job = new Sync<JobModel>('jobs');
    media = new Sync<MediaModel>('medias');
    member = new Sync<MemberModel>('members');
    
    applicationColl = new PbColl<ApplicationModel>('applications');
    userColl = new PbAuthColl<UserModel>('users');
    
    
}