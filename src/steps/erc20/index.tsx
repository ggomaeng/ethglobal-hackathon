import { NetworkSelectStep } from '../settings/step-network-select';
import { ERC20CompleteStep } from './step-complete';
import { ERC20DeployStep } from './step-deploy';
import { ERC20NameStep } from './step-name';
import { ERC20StartStep } from './step-start-token';
import { ERC20SymbolStep } from './step-symbol';

export const CREATE_ERC20_STEPS = [
  ERC20StartStep,
  NetworkSelectStep,
  ERC20NameStep,
  ERC20SymbolStep,
  ERC20DeployStep,
  ERC20CompleteStep,
];
