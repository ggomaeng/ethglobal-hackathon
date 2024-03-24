import { StepData } from '../../common/getStep';
import { Community1155ExtraParams } from '../../community-1155';
import { FlatPriceStep } from './step-flat-price';
import { MaxSupplyStep } from '../settings/step-max-supply';
import { UploadImageStep } from '../settings/step-upload-image';
import { ERC1155CollectionNameStep } from './step-collection-name';
import { Community1155CompleteStep } from './step-complete';
import { Community1155IpfsStep } from './step-ipfs';
import { Community1155StartStep } from './step-start-community1155';
import { Community1155DeployStep } from './step-deploy';

export const CREATE_COMMUNITY1155_STEPS = (
  params?: Community1155ExtraParams,
) => {
  const steps: StepData[] = [
    Community1155StartStep,
    UploadImageStep,
    ERC1155CollectionNameStep,
  ];

  if (!params?.maxSupply) {
    steps.push(MaxSupplyStep);
  }

  if (!params?.price) {
    steps.push(FlatPriceStep);
  }

  steps.push(
    Community1155DeployStep,
    Community1155IpfsStep,
    Community1155CompleteStep,
  );

  return steps;
};
