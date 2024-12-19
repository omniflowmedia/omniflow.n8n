import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OmniflowApi implements ICredentialType {
  name = 'omniflowApi';

  displayName = 'OmniFlow API';
  icon?: 'file:omniflow.png';

  // eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-not-http-url
  documentationUrl = 'mautic';

  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      placeholder: 'https://name.omniflow-ams.com',
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