/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { parse } from 'valibot';
import { COMMON_ACTIONS } from '../../common/config';
import {
  CreateERC20State,
  ERC20Context,
  ERC20NavigationState,
  ERC20RouteEnv,
} from '../../create-erc20';
import { baseFrameNavigator } from '../../navigators/baseFrameNavigator';
import { ERC20Schema } from '../../schemas/erc20-schema';
import { CREATE_ERC20_STEPS } from '../../steps/erc20';
import { mintclub } from 'mint.club-v2-sdk';
import { ValidationError } from '../../../errors/ValidationError';
import { retry } from '../../../utils/retry';

export async function erc20Handler(context: ERC20Context<'/'>) {
  return baseFrameNavigator<
    CreateERC20State,
    ERC20RouteEnv,
    '/',
    ERC20NavigationState
  >({
    path: '/',
    context,
    steps: CREATE_ERC20_STEPS,
    deriveState: async (previousState) => {
      const { inputText, buttonValue } = context;

      if (buttonValue === COMMON_ACTIONS.SET_NAME) {
        parse(ERC20Schema.entries.name, inputText);
        previousState.name = inputText!;
      } else if (buttonValue === COMMON_ACTIONS.SET_SYMBOL) {
        parse(ERC20Schema.entries.symbol, inputText);
        const symbol = inputText!;

        const exists = await retry(() =>
          mintclub.network(previousState.chain).token(symbol).exists(),
        );

        if (exists) {
          throw new ValidationError('Token with this symbol already exists');
        }

        previousState.symbol = inputText!;
      }
    },
  });
}
