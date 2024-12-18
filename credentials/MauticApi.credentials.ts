import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

// the OmniFlow nodes still use original mauticApi
// So this file is mostly to fill the eslint requirement
export class MauticApi implements ICredentialType {
  name = 'omniflowApi';

  displayName = 'OmniFlow API';

  // eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-not-http-url
  documentationUrl = 'mautic';

  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      placeholder: 'https://name.mautic.net',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.url.replace(new RegExp("/$"), "")}}',
      url: '/api/users/self',
    },
  };
}