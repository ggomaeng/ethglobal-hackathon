// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable react/jsx-key */
// /** @jsxImportSource frog/jsx */

// import {
//   BackButton,
//   NextButton,
// } from '@api/common/Buttons';
// import { DerivativeStepParams } from '@api/navigators/derivativeFrameNavgiator';
// import { colors as COLORS } from '@constants/tailwind';
// import { NEXT_PUBLIC_ROOT_URL } from '@env/client-env';
// import { getSubscriptNumber } from '@utils/numbers';
// import { CHAIN_MAP, SdkSupportedChainIds } from 'mint.club-v2-sdk';

// export async function ReviewStep({ extraParams }: DerivativeStepParams) {
//   const {
//     id,
//     buyRoyalty,
//     sellRoyalty,
//     initialPrice,
//     finalPrice,
//     stepCount,
//     chainId,
//     curveType,
//     baseToken,
//     maxSupply,
//     creatorAllocation,
//     collectionType,
//     imageUrl,
//     name,
//   } = extraParams;

//   const chain = CHAIN_MAP[chainId as SdkSupportedChainIds];
//   let curveImage = '';

//   if (curveType === 'LINEAR') curveImage = '/curve-linear.png';
//   else if (curveType === 'EXPONENTIAL') curveImage = '/curve-exponential.png';
//   else if (curveType === 'LOGARITHMIC') curveImage = '/curve-log.png';
//   else if (curveType === 'FLAT') curveImage = '/curve-flat.png';

//   return {
//     title: 'Review NFT Details',
//     image: (
//       <div
//         tw="relative flex h-full w-full flex-col flex-col p-10 text-2xl text-white"
//         style={{
//           gap: 8,
//         }}
//       >
//         <div tw="flex items-center" style={{ gap: 12 }}>
//           <div tw="flex text-3xl leading-none">{name}</div>
//           <div tw="text-gray-500">-</div>
//           <div tw="flex items-center text-lg text-gray-500">
//             {collectionType} Collection{' '}
//             <span tw="ml-2">
//               {collectionType === 'DERIVATIVE' ? '🤝' : '🖼️'}
//             </span>
//           </div>
//         </div>

//         <div tw="mt-2 flex w-full items-start justify-start">
//           <div tw="flex items-start">
//             <img src={imageUrl!} alt="collection" width="90" height="90" />

//             <div tw="ml-5 flex flex-col">
//               <div tw="flex" style={{ gap: 20 }}>
//                 <img
//                   tw="flex"
//                   src={`${NEXT_PUBLIC_ROOT_URL}/api/random/${id}?size=${30}&t=${Math.random()}`}
//                   width="30"
//                   height="30"
//                   alt=""
//                 />

//                 <img
//                   tw="flex"
//                   src={`${NEXT_PUBLIC_ROOT_URL}/api/random/${id}?size=${30}&t=${Math.random()}`}
//                   width="30"
//                   height="30"
//                   alt=""
//                 />
//                 <img
//                   tw="flex"
//                   src={`${NEXT_PUBLIC_ROOT_URL}/api/random/${id}?size=${30}&t=${Math.random()}`}
//                   width="30"
//                   height="30"
//                   alt=""
//                 />

//                 <img
//                   tw="flex"
//                   src={`${NEXT_PUBLIC_ROOT_URL}/api/random/${id}?size=${30}&t=${Math.random()}`}
//                   width="30"
//                   height="30"
//                   alt=""
//                 />

//                 <img
//                   tw="flex"
//                   src={`${NEXT_PUBLIC_ROOT_URL}/api/random/${id}?size=${30}&t=${Math.random()}`}
//                   width="30"
//                   height="30"
//                   alt=""
//                 />
//               </div>

//               <div tw="mt-4 flex flex-col items-start text-base text-gray-500">
//                 <div tw="flex items-center">
//                   <img src={chain.icon} alt="chain" width="16" height="16" />
//                   <div
//                     tw="mx-2 flex"
//                     style={{
//                       color: chain.color,
//                     }}
//                   >
//                     {chain.name} Chain
//                   </div>

//                   <div tw="flex items-center text-white">
//                     <div tw="mr-1">Mintable with</div>
//                     <div
//                       tw="flex"
//                       style={{
//                         color: COLORS.primary,
//                       }}
//                     >
//                       ${baseToken?.symbol}
//                     </div>
//                   </div>
//                 </div>

//                 <div
//                   tw="text-sm text-white"
//                   style={{
//                     fontFamily: 'roboto',
//                   }}
//                 >
//                   {baseToken?.address}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div tw="my-10 flex h-[2px] w-full bg-gray-500" />

//         <div tw="flex w-full flex-col items-start justify-start text-lg">
//           <div tw="text-base text-yellow-500">Curve Information</div>
//           <div tw="flex flex-col justify-start">
//             <div tw="flex items-center" style={{ gap: 4 }}>
//               <div
//                 tw="flex items-center"
//                 style={{
//                   color: COLORS.primary,
//                   gap: 8,
//                 }}
//               >
//                 <img src={curveImage} width={16} height={16} alt="curve" />
//                 {curveType}
//               </div>
//               <div>Bonding Curve with </div>
//               <div
//                 tw="flex"
//                 style={{
//                   color: COLORS.primary,
//                 }}
//               >
//                 {stepCount}
//               </div>

//               <div>Steps starting from</div>

//               <div
//                 tw="flex"
//                 style={{
//                   color: COLORS.primary,
//                 }}
//               >
//                 {getSubscriptNumber({
//                   number: initialPrice!,
//                 })}{' '}
//                 {baseToken?.symbol}
//               </div>

//               <div>and Ending at</div>

//               <div
//                 tw="flex"
//                 style={{
//                   color: COLORS.primary,
//                 }}
//               >
//                 {getSubscriptNumber({
//                   number: finalPrice!,
//                 })}{' '}
//                 {baseToken?.symbol}
//               </div>
//             </div>
//           </div>

//           <div tw="mt-5 text-base text-yellow-500">Token Information</div>
//           <div tw="flex w-full items-center" style={{ gap: 2 }}>
//             <div>Max Supply</div>
//             <div
//               tw="flex"
//               style={{
//                 color: COLORS.primary,
//               }}
//             >
//               {getSubscriptNumber({
//                 number: maxSupply!,
//               })}
//             </div>

//             <div tw="mx-1">/</div>

//             <div>Creator Allocation</div>
//             <div
//               tw="flex"
//               style={{
//                 color: COLORS.primary,
//               }}
//             >
//               {getSubscriptNumber({
//                 number: creatorAllocation!,
//               })}
//             </div>
//           </div>

//           <div
//             tw="flex w-full items-center text-sm text-gray-500"
//             style={{ gap: 2 }}
//           >
//             <div>Buy Royalty</div>
//             <div
//               tw="flex"
//               style={{
//                 color: COLORS.primary,
//               }}
//             >
//               {(buyRoyalty ?? 0 / 1000)?.toFixed(2)}%
//             </div>

//             <div tw="mx-1">/</div>
//             <div>Sell Royalty</div>
//             <div
//               tw="flex"
//               style={{
//                 color: COLORS.primary,
//               }}
//             >
//               {(sellRoyalty ?? 0 / 1000)?.toFixed(2)}%
//             </div>
//           </div>
//         </div>
//       </div>
//     ),

//     intents: [<BackButton />, <NextButton name="🚀 Deploy" />],
//   };
// }
