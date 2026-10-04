export type FailureSummary = {
    cause: string;
    nextStep: string;
    tags: string[];
};

export function summarizeFailure(log : string): FailureSummary{
    const text = log.toLowerCase();

    if (text.includes('expected') && text.includes('received')) {
  return {
    cause: 'Assertion mismatch — element was found, value was wrong',
    nextStep: 'Compare expected vs received in the error; fix the expect or the app data',
    tags: ['assert'],
      };
    }

    if(text.includes('timeout') || text.includes('waiting for ')) {
        return{
          cause: 'Likely timing or locator wait - element not ready in time',
          nextStep: 'Open Playwright trace; check locator; prefer auto-wait over sleep',
          tags: ['timing', 'locator'],
        };
    }

    if (text.includes('tobevisible') || text.includes('not found') || text.includes('strict mode violation')) {
        return {

            cause: 'Likely missing or wrong element/locator',
            nextStep: 'Re-check data-test / getByRole; confirm you navigated to the right page',
            tags: ['locator', 'ui'],
        };
    }

    if(text.includes('net::') || text.includes('econnrefused') || text.includes('enotfound')) {
        return{
            cause: 'Likely network / server unreachable',
            nextStep: 'Check URL, VPN, and whether the API/site is up',
            tags: ['network'],
        };
    }

    if(text.includes('ssl') || text.includes('certificate')){
        return{
            cause: 'Likely missing/invalid cert ',
            nextStep: 'Check if cert/auth is valid, verify TLS version is compatible',
            tags: ['cert'],
        };
    }

    if(text.includes('401') || text.includes('unauthorized') || text.includes('authentication failed')){
        return{
            cause: 'Unable to authenricate client, not logged in/ bad cridnetials',
            nextStep: 'Check token/cookie/API key is present and not expired, Re-login / refresh session before the request',
            tags:['authentication']
        };
    }

    return {
        cause: 'Unknown — no clear keyword match',
        nextStep: 'Paste full error + trace; narrow with expect error message',
        tags: ['unknown'],
    };
}