import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function omniflowApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query?: IDataObject,
	uri?: string,
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0, 'credentials') as string;

	const options: IRequestOptions = {
		headers: {},
		method,
		qs: query,
		uri: uri || `/api${endpoint}`,
		body,
		json: true,
	};

	try {
		let returnData;

		if (authenticationMethod === 'credentials') {
			const credentials = await this.getCredentials('omniflowApi');
			const baseUrl = credentials.url as string;

			options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
			returnData = await this.helpers.requestWithAuthentication.call(this, 'omniflowApi', options);
		} else {
			const credentials = await this.getCredentials('omniflowOAuth2Api');
			const baseUrl = credentials.url as string;

			options.uri = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${options.uri}`;
			returnData = await this.helpers.requestOAuth2.call(this, 'omniflowOAuth2Api', options, {
				includeCredentialsOnRefreshOnBody: true,
			});
		}

		if (returnData.errors) {
			// They seem to sometimes return 200 status but still error.
			throw new NodeApiError(this.getNode(), returnData as JsonObject);
		}

		return returnData;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated mautic endpoint
 * and return all results
 */
export async function omniflowApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 30;
	query.start = 0;

	do {
		responseData = await omniflowApiRequest.call(this, method, endpoint, body, query);
		const values = Object.values(responseData[propertyName] as IDataObject[]);
		returnData.push.apply(returnData, values);
		query.start += query.limit;
	} while (
		responseData.total !== undefined &&
		returnData.length - parseInt(responseData.total as string, 10) < 0
	);

	return returnData;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}
