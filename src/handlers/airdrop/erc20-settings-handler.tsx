/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { cloneDeep } from 'lodash-es';
import { mintclub } from 'mint.club-v2-sdk';
import { parse } from 'valibot';
import { ValidationError } from '../../../errors/ValidationError';
import {
  COMMON_ACTIONS,
  COMMON_ROUTES,
  CURVES,
  NETWORKS,
  SETTINGS,
} from '../../common/config';
import { CommonFrame } from '../../common/getStep';
import {
  CreateERC20State,
  ERC20Context,
  ERC20NavigationState,
  ERC20RouteEnv,
} from '../../create-erc20';
import { StepComponent } from '../../helpers/StepComponent';
import { baseFrameNavigator } from '../../navigators/baseFrameNavigator';
import { ERC20Schema } from '../../schemas/erc20-schema';
import { ERC20NameStep } from '../../steps/erc20/step-name';
import { ERC20SettingsStep } from '../../steps/erc20/step-settings';
import { BaseTokenStep } from '../../steps/settings/step-base-token';
import { ConfirmBaseTokenStep } from '../../steps/settings/step-confirm-base-token';
import { CreatorAllocationStep } from '../../steps/settings/step-creator-allocation';
import { CurveSelectStep } from '../../steps/settings/step-curve-type';
import { InitialPriceStep } from '../../steps/settings/step-initial-price';
import { FinalPriceStep } from '../../steps/settings/step-max-price';
import { MaxSupplyStep } from '../../steps/settings/step-max-supply';
import { NetworkSelectStep } from '../../steps/settings/step-network-select';
import { ERC20SymbolStep } from '../../steps/erc20/step-symbol';
import { retry } from '../../../utils/retry';

export async function ERC20SettingsHandler(
  context: ERC20Context<typeof COMMON_ROUTES.settings>,
) {
  return baseFrameNavigator<
    CreateERC20State,
    ERC20RouteEnv,
    typeof COMMON_ROUTES.settings,
    ERC20NavigationState
  >({
    path: COMMON_ROUTES.settings,
    context,
    isSettings: true,
    steps: [],
    overrideFrame: (state) => {
      const { settings: currentSetting, chain } = state;
      const { buttonValue } = context;

      let frameToReturn: CommonFrame | undefined;
      // If the buttonValue is COMMON_ACTIONS.SETTINGS, then we don't want to validate

      if (currentSetting === SETTINGS.NAME) {
        frameToReturn = ERC20NameStep;
      } else if (currentSetting === SETTINGS.SYMBOL) {
        frameToReturn = ERC20SymbolStep;
      } else if (currentSetting === SETTINGS.CHAIN) {
        frameToReturn = NetworkSelectStep;
      } else if (currentSetting === SETTINGS.BASE_TOKEN) {
        frameToReturn = BaseTokenStep(chain);
      } else if (
        buttonValue === COMMON_ACTIONS.SET_BASE_TOKEN &&
        state.newBaseToken
      ) {
        frameToReturn = ConfirmBaseTokenStep(state.newBaseToken);
      } else if (currentSetting === SETTINGS.MAX_SUPPLY) {
        frameToReturn = MaxSupplyStep;
      } else if (currentSetting === SETTINGS.CREATOR_ALLOCATION) {
        frameToReturn = CreatorAllocationStep;
      } else if (currentSetting === SETTINGS.CURVE) {
        frameToReturn = CurveSelectStep;
      } else if (currentSetting === SETTINGS.INITIAL_PRICE) {
        frameToReturn = InitialPriceStep;
      } else if (currentSetting === SETTINGS.FINAL_PRICE) {
        frameToReturn = FinalPriceStep;
      } else {
        frameToReturn = ERC20SettingsStep({
          state: state,
          previousState: state,
          extraParams: state,
        });
      }

      frameToReturn = cloneDeep(frameToReturn);

      if (frameToReturn && typeof frameToReturn.image !== 'string') {
        frameToReturn.image = StepComponent({
          title: frameToReturn.title,
          children: frameToReturn.image,
          description: 'Settings',
        });
      }

      return frameToReturn;
    },
    deriveState: async (previousState) => {
      const { inputText, buttonValue } = context;
      if (buttonValue === NETWORKS.BASE || buttonValue === NETWORKS.OPTIMISM) {
        previousState.chain = buttonValue;
      } else if (buttonValue === COMMON_ACTIONS.SET_NAME) {
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
      } else if (buttonValue === COMMON_ACTIONS.SET_BASE_TOKEN) {
        parse(ERC20Schema.entries.baseToken.entries.address, inputText);
        const baseToken = mintclub
          .network(previousState.chain)
          .token(inputText as string);

        const [name, symbol, decimals] = await Promise.all([
          baseToken.getName(),
          baseToken.getSymbol(),
          baseToken.getDecimals(),
        ]);

        previousState.newBaseToken = {
          address: inputText as string,
          name,
          symbol,
          decimals,
        };
      } else if (buttonValue === COMMON_ACTIONS.CONFIRM_BASE_TOKEN) {
        previousState.baseToken = previousState.newBaseToken!;
        previousState.newBaseToken = undefined;
      } else if (buttonValue === COMMON_ACTIONS.SET_MAX_SUPPLY) {
        parse(ERC20Schema.entries.maxSupply, inputText);
        const value = Number(inputText);
        if (value < previousState.creatorAllocation) {
          throw new ValidationError(
            'Max supply should be greater than creator allocation',
          );
        }

        let stepCount = Math.min(Math.ceil(value / 10), 100);

        previousState.maxSupply = value;
        previousState.stepCount = stepCount;
      } else if (buttonValue === COMMON_ACTIONS.SET_CREATOR_ALLOCATION) {
        parse(ERC20Schema.entries.creatorAllocation, inputText);
        const value = Number(inputText);
        if (value > previousState.maxSupply) {
          throw new ValidationError(
            'Creator allocation should be less than max supply',
          );
        }
        previousState.creatorAllocation = value;
      } else if (
        buttonValue === CURVES.LINEAR ||
        buttonValue === CURVES.EXPONENTIAL ||
        buttonValue === CURVES.LOGARITHMIC ||
        buttonValue === CURVES.FLAT
      ) {
        previousState.curveType = buttonValue;
      } else if (buttonValue === COMMON_ACTIONS.SET_INITIAL_PRICE) {
        parse(ERC20Schema.entries.initialPrice, inputText);
        previousState.initialPrice = Number(inputText);
      } else if (buttonValue === COMMON_ACTIONS.SET_FINAL_PRICE) {
        parse(ERC20Schema.entries.finalPrice, inputText);

        const value = Number(inputText);

        if (value < (previousState.initialPrice ?? 0)) {
          throw new ValidationError(
            `Final price should be greater than initial price of ${previousState.initialPrice}`,
          );
        }

        previousState.finalPrice = value;
      }
    },
  });
}
