/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { cloneDeep } from 'lodash-es';
import { mintclub } from 'mint.club-v2-sdk';
import { parse } from 'valibot';
import { ValidationError } from '../../../errors/ValidationError';
import { getStatus } from '../../../services/IpfsService';
import {
  COMMON_ACTIONS,
  COMMON_ROUTES,
  CURVES,
  NETWORKS,
  NFT_ACTIONS,
  SETTINGS,
} from '../../common/config';
import { CommonFrame } from '../../common/getStep';
import {
  CreateERC1155State,
  ERC1155Context,
  ERC1155NavigationState,
  ERC1155RouteEnv,
} from '../../create-erc1155';
import { StepComponent } from '../../helpers/StepComponent';
import { baseFrameNavigator } from '../../navigators/baseFrameNavigator';
import { ERC1155Schema } from '../../schemas/erc1155-schema';
import { ERC1155CollectionNameStep } from '../../steps/erc1155/step-collection-name';
import { ERC1155SettingsStep } from '../../steps/erc1155/step-settings';
import { BaseTokenStep } from '../../steps/settings/step-base-token';
import { ConfirmBaseTokenStep } from '../../steps/settings/step-confirm-base-token';
import { CreatorAllocationStep } from '../../steps/settings/step-creator-allocation';
import { CurveSelectStep } from '../../steps/settings/step-curve-type';
import { InitialPriceStep } from '../../steps/settings/step-initial-price';
import { FinalPriceStep } from '../../steps/settings/step-max-price';
import { MaxSupplyStep } from '../../steps/settings/step-max-supply';
import { NetworkSelectStep } from '../../steps/settings/step-network-select';
import { UploadImageStep } from '../../steps/settings/step-upload-image';

export async function ERC1155SettingsHandler(
  context: ERC1155Context<typeof COMMON_ROUTES.settings>,
) {
  return baseFrameNavigator<
    CreateERC1155State,
    ERC1155RouteEnv,
    typeof COMMON_ROUTES.settings,
    ERC1155NavigationState
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
        frameToReturn = ERC1155CollectionNameStep;
      } else if (currentSetting === SETTINGS.IMAGE) {
        frameToReturn = UploadImageStep({
          user: context.var.interactor,
        });
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
        frameToReturn = ERC1155SettingsStep({
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
      if (
        buttonValue === NFT_ACTIONS.PFP ||
        buttonValue === NFT_ACTIONS.UPLOAD
      ) {
        const imgUrl =
          buttonValue === NFT_ACTIONS.PFP
            ? context.var.interactor?.pfpUrl
            : inputText;
        parse(ERC1155Schema.entries.imageUrl, imgUrl);
        previousState.imageUrl = imgUrl;
      } else if (
        buttonValue === NETWORKS.BASE ||
        buttonValue === NETWORKS.OPTIMISM
      ) {
        previousState.chain = buttonValue;
      } else if (buttonValue === COMMON_ACTIONS.SET_NAME) {
        parse(ERC1155Schema.entries.collectionName, inputText);
        previousState.collectionName = inputText;
      } else if (buttonValue === COMMON_ACTIONS.SET_BASE_TOKEN) {
        parse(ERC1155Schema.entries.baseToken.entries.address, inputText);
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
        parse(ERC1155Schema.entries.maxSupply, inputText);
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
        parse(ERC1155Schema.entries.creatorAllocation, inputText);
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
        parse(ERC1155Schema.entries.initialPrice, inputText);
        previousState.initialPrice = Number(inputText);
      } else if (buttonValue === COMMON_ACTIONS.SET_FINAL_PRICE) {
        parse(ERC1155Schema.entries.finalPrice, inputText);

        const value = Number(inputText);

        if (value < (previousState.initialPrice ?? 0)) {
          throw new ValidationError(
            `Final price should be greater than initial price of ${previousState.initialPrice}`,
          );
        }

        previousState.finalPrice = value;
      } else if (buttonValue === COMMON_ACTIONS.REFRESH) {
        const refreshed = await getStatus(previousState.ipfsStatus?.id!);
        if (!refreshed) throw new ValidationError('IPFS status not found');
        previousState.ipfsStatus = refreshed;
        if (refreshed.status === 'SUCCESS') {
          console.log(previousState);
          //do last validation before moving to deploy step
          parse(ERC1155Schema, previousState);
        }
      }
    },
  });
}
