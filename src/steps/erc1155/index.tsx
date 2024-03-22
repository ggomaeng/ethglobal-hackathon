import { CollectionNameStep } from '../settings/step-collection-name';
import { IpfsStep } from './step-ipfs';
import { StartStep } from '../settings/step-start-nft';
import { UploadImageStep } from '../settings/step-upload-image';
import { DeployStep } from './step-deploy';
import { CompleteStep } from './step-complete';

export const CREATE_ERC1155_STEPS = [
  StartStep,
  UploadImageStep,
  CollectionNameStep,
  DeployStep,
  IpfsStep,
  CompleteStep,
];
