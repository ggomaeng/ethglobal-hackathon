/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { chainStringToId, mintclub } from 'mint.club-v2-sdk';
import { parse } from 'valibot';
import { ValidationError } from '../../../errors/ValidationError';
import { getStatus, uploadToIpfs } from '../../../services/IpfsService';
import { COMMON_ACTIONS, NFT_ACTIONS } from '../../common/config';
import {
  CreateERC1155State,
  ERC1155Context,
  ERC1155NavigationState,
  ERC1155RouteEnv,
} from '../../create-erc1155';
import { baseFrameNavigator } from '../../navigators/baseFrameNavigator';
import { ERC1155Schema } from '../../schemas/erc1155-schema';
import { CREATE_ERC1155_STEPS } from '../../steps/erc1155';

export async function erc1155Handler(context: ERC1155Context<'/'>) {
  return baseFrameNavigator<
    CreateERC1155State,
    ERC1155RouteEnv,
    '/',
    ERC1155NavigationState
  >({
    path: '/',
    context,
    steps: CREATE_ERC1155_STEPS,
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
      } else if (buttonValue === COMMON_ACTIONS.SET_NAME) {
        parse(ERC1155Schema.entries.collectionName, inputText);
        previousState.collectionName = inputText;
      } else if (buttonValue === NFT_ACTIONS.IPFS) {
        const chainId = chainStringToId(previousState.chain);
        const status = await uploadToIpfs({
          url: previousState.imageUrl!,
          collectionName: previousState.collectionName!,
          chainId,
        });
        previousState.ipfsStatus = status;
      } else if (buttonValue === COMMON_ACTIONS.REFRESH) {
        const refreshed = await getStatus(previousState.ipfsStatus?.id!);
        console.log({ refreshed });
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
