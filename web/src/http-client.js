/**
 * @file HTTP client utility
 */

/**
 * Builds a URL with encoded query args from the given object.
 *
 * @param {string} endpoint
 * @param {object} params
 * @return {string} Parameterized and encoded URL
 */
export function buildURL(endpoint, params) {
    return `${endpoint.startsWith('/') ? 'api' : ''}${endpoint}${
        params
            ? `?${Object.entries(params)
                .filter(([k, v]) => v !== null && 'undefined' !== typeof v)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&')}`
            : ''
    }`;
}

/**
 * Sends a GET request to the given endpoint
 *
 * @param {string} endpoint Endpoint to send to
 * @param {object} options Request options
 */
export async function GET(endpoint, options) {
    return await request(
        {
            method: 'GET',
            endpoint,
        },
        options,
    );
}

/**
 * Sends a POST request to the given endpoint
 *
 * @param {string} endpoint Endpoint to send to
 * @param {object} body Any JSON serializable body
 * @param {object} options Request options
 */
export async function POST(endpoint, body, options) {
    return await request(
        {
            method: 'POST',
            endpoint,
            body: JSON.stringify(body),
        },
        options,
    );
}

/**
 * Sends a PUT request to the given endpoint
 *
 * @param {string} endpoint Endpoint to send to
 * @param {object} body Any JSON serializable body
 * @param {object} options Request options
 */
export async function PUT(endpoint, body, options) {
    return await request(
        {
            method: 'PUT',
            endpoint,
            body: JSON.stringify(body),
        },
        options,
    );
}

/**
 * Sends a DELETE request to the given endpoint
 *
 * @param {string} endpoint Endpoint to send to
 * @param {object} options Request options
 */
export async function DELETE(endpoint, options) {
    return await request(
        {
            method: 'DELETE',
            endpoint,
        },
        options,
    );
}

/**
 * Performs a multipart/form-data file upload
 *
 * @param {string} endpoint Endpoint to upload to
 * @param {FormData} body FormData object with Files
 * @param {object} options Optional request configuration options
 */
export async function UPLOAD(endpoint, body, options) {
    return await request(
        {
            method: options ? (options.method || 'POST') : 'POST',
            endpoint,
            body,
        },
        Object.assign({}, options || {}, { omitContentType: true }),
    );
}

/**
 * Sends a request to the HTTP API
 *
 * @param {object} req Request object to send
 * @param {object} options Request options
 */
export async function request(req, options = { raw: false, omitContentType: false, terminateSessionOn401: true }) {

    const payload = {
        method: req.method,
        headers: {},
        credentials: 'include',
    };

    if ('GET' !== req.method && 'DELETE' !== req.method) {
        payload.body = req.body;
    }

    if (!options.omitContentType) {
        payload.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`/api/${req.endpoint}`, payload);

    let body = null;

    // We try to parse the body first, thereby also providing it to the 401
    // handling
    try {
        body = options.raw ? await response.blob() : await response.json();
    } catch (err) {
        if (err instanceof SyntaxError) {
            console.error('Response is not valid JSON');
        } else {
            console.error('Unknown error while parsing JSON');
        }

        return Promise.reject(null);
    }

    const apiResponse = {
        headers: response.headers,
        ok: response.ok,
        statusText: response.statusText,
        status: response.status,
        url: response.url,
        body,
    };

    logInteraction(req, apiResponse);
    // apiResponse.headers.forEach(header => console.log("##### HEADERS..: " + header));


    // If the API is not available, set the availability status
    // and return
    if (502 === apiResponse.status || 504 === apiResponse.status) {
        console.error('Application unreachable, status code = %d', apiResponse.status);

        return Promise.reject(apiResponse);
    }

    // If we get back a 401, the session of the user might have expired
    // or does not exist at all
    if (401 === apiResponse.status) {
        if (options.terminateSessionOn401) {
            // location.reload();
        }

        return Promise.reject(apiResponse);
    }

    // If the response is not okay for another reason, display a reasonable error
    // message to the user
    if (!apiResponse.ok) {
        return Promise.reject(apiResponse);
    }

    return Promise.resolve(apiResponse);
}

// The following things will be removed by webpack tree-shaking

/**
 * Logs information about the given request and response to the console
 * Does not log in non-dev.
 *
 * @param {object} request Request sent
 * @param {object} response Response received
 */
function logInteraction(request, response) {
    console.log(
        `%c${new Date().toISOString()} HTTP %c${request.method} %s %c${response.status} ${response.statusText}`,
        'color: gray;',
        'background: none; color #000; padding: 1px 5px',
        request.endpoint,
        !response.ok
            ? 'color: #fff;padding: 1px 4px;border-radius: 2px;background-color: red;'
            : 'color: #fff;padding: 1px 4px;border-radius: 2px;background-color: green;',
        response.body,
        JSON.stringify(response.headers),
    );
}