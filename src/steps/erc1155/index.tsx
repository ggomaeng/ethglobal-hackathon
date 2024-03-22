import { ERC1155CollectionNameStep } from './step-collection-name';
import { ERC1155IpfsStep } from './step-ipfs';
import { ERC1155StartStep } from './step-start-nft';
import { UploadImageStep } from '../settings/step-upload-image';
import { ERC1155DeployStep } from './step-deploy';
import { ERC1155CompleteStep } from './step-complete';

export const CREATE_ERC1155_STEPS = [
  ERC1155StartStep,
  UploadImageStep,
  ERC1155CollectionNameStep,
  ERC1155DeployStep,
  ERC1155IpfsStep,
  ERC1155CompleteStep,
];
