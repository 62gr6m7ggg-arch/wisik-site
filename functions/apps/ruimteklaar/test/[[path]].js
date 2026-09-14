import {handleTestRequest} from '../../../../tools/ruimteklaar-review/server.mjs';
import {assets} from '../../../../tools/ruimteklaar-review/generated-assets.mjs';
export const onRequest=({request,env})=>handleTestRequest(request,env,assets);
