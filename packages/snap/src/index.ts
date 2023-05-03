// eslint-disable-next-line import/no-unassigned-import
import './polyfill-intl';
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { AuthHandler, FetchHandler, W3CCredential } from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
import { ExtensionService } from './services/Extension.service';
import { IdentityServices } from './services/Identity.services';
import { confirmRpcDialog } from './rpc/methods';
// import { confirmDialog } from './rpc/dialog';

const byteEncoder = new TextEncoder();

const getParams = (data: unknown) => {
  return data;
};
const RequestType = {
  Auth: 'auth',
  CredentialOffer: 'credentialOffer',
  Proof: 'proof',
};
const detectRequest = (unpackedMessage: { type: any; body: any }) => {
  const { type, body } = unpackedMessage;
  const { scope = [] } = body;

  if (type.includes('request') && scope.length) {
    return RequestType.Proof;
  } else if (type.includes('offer')) {
    return RequestType.CredentialOffer;
  } else if (type.includes('request')) {
    return RequestType.Auth;
  }
  return RequestType.Auth;
};

const credB = JSON.parse(`{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld",
        "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.jsonld"
    ],
    "credentialSchema": {
        "id": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v4.json",
        "type": "JsonSchemaValidator2018"
    },
    "credentialStatus": {
        "id": "https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL/claims/revocation/status/1566104920",
        "revocationNonce": 1566104920,
        "type": "SparseMerkleTreeProof"
    },
    "credentialSubject": {
        "birthday": 19960424,
        "documentType": 839753,
        "id": "did:iden3:polygon:mumbai:wxaBAnqoizRzz53dnEpoLMk1iCCryffSVwqYyiprH",
        "type": "KYCAgeCredential"
    },
    "expirationDate": "2030-01-01T00:00:00Z",
    "id": "https://dev.polygonid.me/api/v1/identities/did:polygonid:polygon:mumbai:2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL/claims/d7418d98-d913-11ed-99d1-0242ac1a0006",
    "issuanceDate": "2023-04-12T09:24:35.73566264Z",
    "issuer": "did:polygonid:polygon:mumbai:2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL",
    "proof": [
        {
            "coreClaim": "508991bcf0336ba99935ef498d797ec92a00000000000000000000000000000001124774ca0208a1eb55c70940d64d79c4df6401a3f0fa2dd8b0faa01d300e0047423b0099dbd031ea927be5e58af6a9e8e52336d83218e6a5868201074a0a0c000000000000000000000000000000000000000000000000000000000000000058dd585d0000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "issuerData": {
                "authCoreClaim": "cca3371a6cb1b715004407e325bd993c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a90c8c580beff1120575db23734df8f3d7e11af911d37246d817d3fcc853f326492a7a26a53a97065a2d74af463c66769127791e98a7bbddfd32dabb01d51a290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                "credentialStatus": {
                    "id": "https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL/claims/revocation/status/0",
                    "revocationNonce": 0,
                    "type": "SparseMerkleTreeProof"
                },
                "id": "did:polygonid:polygon:mumbai:2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL",
                "mtp": {
                    "existence": true,
                    "siblings": [
                        "0",
                        "7965197209431136715339141401393539059743040108993498212938367131625570657029"
                    ]
                },
                "state": {
                    "claimsTreeRoot": "b88d919a87ca278aefe621a55f06700a3dbc86575710e2ef5e076f356886c82b",
                    "value": "2ec563f5c07bd4ea3bdcf3493cbb9b9da4a877b791b3b23c809c66d9eb80551f"
                }
            },
            "signature": "be8d73e10d514ec94dc1359bfe5adc95d829adca53175d956ea6bfe2c2070d8f084e85faab0e3e0c65fa2c835c23855701ddde16f7caff92149a5776ae25f901",
            "type": "BJJSignature2021"
        },
        {
            "coreClaim": "508991bcf0336ba99935ef498d797ec92a00000000000000000000000000000001124774ca0208a1eb55c70940d64d79c4df6401a3f0fa2dd8b0faa01d300e0047423b0099dbd031ea927be5e58af6a9e8e52336d83218e6a5868201074a0a0c000000000000000000000000000000000000000000000000000000000000000058dd585d0000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "issuerData": {
                "id": "did:polygonid:polygon:mumbai:2qJ689kpoJxcSzB5sAFJtPsSBSrHF5dq722BHMqURL",
                "state": {
                    "blockNumber": 34276182,
                    "blockTimestamp": 1681291605,
                    "claimsTreeRoot": "553a8c9737417a2451b205a6d6dab8b9d12dbca539ce2e29960db82ad081d02b",
                    "revocationTreeRoot": "97e2612af7e098ac6d9629d62851d1ab3c7f32e4e4ea76c16055e288d6a7202a",
                    "rootOfRoots": "e42da24f9cf4046f40579cf8d2e2822c989d87f889af90e6bc4f58390ed09811",
                    "txId": "0xd12109aefb826ec3db2c55cecb5c77123d136745ace343249a845f442a798481",
                    "value": "3b22dccdf133f2a04fea5d6fe14bc94e2105fdff36a12f7e11d159a146b4f413"
                }
            },
            "mtp": {
                "existence": true,
                "siblings": [
                    "13926740282067115129233907971570230247401090348881701915086363833622604826050",
                    "16579394524878603388294864734352824041781142149623842383681571231240360749771",
                    "563468445375939050453119791484709768838259773270815668422689838502318949069",
                    "16904827079940751828097374250454513548272306180764617514797174104080804991454",
                    "9981210364085002389337837162630534056326991907722569189925018615243219946226",
                    "13756736789391450343381156905795975679800478639208358852534154269813600781763",
                    "0",
                    "15122940222444859791744187269828506673690128675425031426454030228236992735636",
                    "0",
                    "7574588108185869866750753710423322037786329559305741011050523304779667456590"
                ]
            },
            "type": "Iden3SparseMerkleTreeProof"
        }
    ],
    "type": [
        "VerifiableCredential",
        "KYCAgeCredential"
    ]
}`);
const authMethod = async (
  identity: { did: DID; credential: W3CCredential },
  urlParam: string,
) => {
  const { packageMgr, proofService, credWallet } =
    ExtensionService.getExtensionServiceInstance();

  // eslint-disable-next-line no-debugger
  debugger;
  const authHandler = new AuthHandler(packageMgr, proofService, credWallet);

  const msgBytes = byteEncoder.encode(atob(urlParam));
  // const _did = DID.parse(LocalStorageServices.getActiveAccountDid());
  const authRes = await authHandler.handleAuthorizationRequestForGenesisDID(
    identity.did,
    msgBytes,
  );
  // eslint-disable-next-line no-debugger
  debugger;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const url = authRes.authRequest.body.callbackUrl;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const body = new FormData();
  return await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body: new FormData(authRes.token),
    body: authRes.token,
  });
};

export const receiveMethod = async (
  identity: { did: DID; credential: W3CCredential },
  urlParam: string,
) => {
  const { packageMgr, credWallet } =
    ExtensionService.getExtensionServiceInstance();
  const fetchHandler = new FetchHandler(packageMgr);

  const msgBytes = byteEncoder.encode(atob(urlParam));
  const credentials = await fetchHandler.handleCredentialOffer(
    identity.did,
    msgBytes,
  );
  console.log(credentials);
  // eslint-disable-next-line no-debugger
  debugger;
  await credWallet.saveAll(credentials);
  return 'SAVED';
};

export const proofMethod = async (
  identity: { did: DID; credential: W3CCredential },
  urlParam: string,
) => {
  const { packageMgr, proofService, credWallet } =
    ExtensionService.getExtensionServiceInstance();
  const authHandler = new AuthHandler(packageMgr, proofService, credWallet);
  const msgBytes = byteEncoder.encode(atob(urlParam));
  const authRequest = await authHandler.parseAuthorizationRequest(msgBytes);

  const { body } = authRequest;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { scope = [] } = body;

  if (scope.length > 1) {
    throw new Error('not support 2 scope');
  }
  const [zkpReq] = scope;
  await credWallet.saveAll([credB]);
  const [firstCredential] = await credWallet.findByQuery(zkpReq.query);
  // eslint-disable-next-line no-debugger
  debugger;
  const response = await authHandler.generateAuthorizationResponse(
    identity.did,
    0,
    authRequest,
    [
      {
        credential: firstCredential,
        req: zkpReq,
        credentialSubjectProfileNonce: 0,
      },
    ],
  );
  // eslint-disable-next-line no-debugger
  debugger;
  const url = authRequest.body?.callbackUrl;
  return await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: response.token,
  });
};
(() => console.log('test'))();

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log('Request:', JSON.stringify(request, null, 4));
  console.log('Origin:', origin);

  console.log(request);
  switch (request.method) {
    case 'handleRequest': {
      console.log(window);
      console.log(request.params);
      await ExtensionService.init();
      console.log('finish await ExtensionService.init();');

      const seedPhrase: Uint8Array = new TextEncoder().encode(
        'seedseedseedseedseedseedseedxxxx',
      );
      const identity = await IdentityServices.createIdentity(seedPhrase);
      console.log('await IdentityServices.createIdentity();');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const requestBase64 = getParams(request.params)?.request;
      const bb = ExtensionService.getExtensionServiceInstance();
      console.log('bb');
      console.log(bb);
      const { packageMgr, credWallet } =
        ExtensionService.getExtensionServiceInstance();
      const msgBytes = byteEncoder.encode(atob(requestBase64));
      const { unpackedMessage } = await packageMgr.unpack(msgBytes);
      const typeRequest = detectRequest(unpackedMessage);
      console.log(typeRequest);
      let dialogContent = null;
      switch (typeRequest) {
        case RequestType.Auth: {
          dialogContent = panel([
            heading('Authorization'),
            divider(),
            text(`Reason: ${unpackedMessage.body.reason}`),
            text(`From: ${unpackedMessage.from}`),
          ]);
          const res = await confirmRpcDialog(dialogContent);
          if (res) {
            await authMethod(identity, requestBase64);
          }
          break;
        }

        case RequestType.CredentialOffer: {
          dialogContent = [
            heading('Credentials'),
            divider(),
            text(`From: ${unpackedMessage.from}`),
          ];
          const credsUI = unpackedMessage.body.credentials.reduce(
            (acc: any, cred: any) => {
              return acc.concat([
                divider(),
                text(cred.description),
                text(cred.id),
              ]);
            },
            [],
          );
          dialogContent = panel([...dialogContent, ...credsUI]);
          const res = await confirmRpcDialog(dialogContent);
          if (res) {
            await receiveMethod(identity, requestBase64);
          }
          console.log(await credWallet.list());
          // eslint-disable-next-line no-debugger
          debugger;
          break;
        }

        case RequestType.Proof: {
          // eslint-disable-next-line no-debugger
          debugger;
          await proofMethod(identity, requestBase64);
          break;
        }
        default:
          console.log(`not found request: ${typeRequest}`);
          break;
      }
      // await authMethod(identity, requestBase64);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert', // Type can be 'Alert', 'Confirmation' or 'Prompt'
          content: panel([
            heading(`${typeRequest}`),
            text('Current request finished'),
            divider(),
          ]),
        },
      });
    }

    case 'get_store': {
      // await snap.request({
      //   method: 'snap_manageState',
      //   params: { operation: 'update', newState: { hello: 'world2' } },
      // });

      return await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      });

      // console.log(persistedData);
      //
      // return await snap.request({
      //   method: 'snap_manageState',
      //   params: { operation: 'clear' },
      // });
    }

    case 'clear_store': {
      return await snap.request({
        method: 'snap_manageState',
        params: { operation: 'clear' },
      });
    }

    default: {
      console.error('Method not found');
      throw new Error('Method not found');
    }
  }
};
