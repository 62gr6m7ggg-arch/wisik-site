import {handleReview} from '../../../../server/ruimteklaar-test-auth.mjs';
import {assets} from '../../../../server/ruimteklaar-test-assets.mjs';
export function onRequest({request,env}){return handleReview(request,env,assets)}
