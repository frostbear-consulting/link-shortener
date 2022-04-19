/**
 * Sets the title of the page
 *
 * @param {string} title Title to set
 */
export function useTitle(title) {
    document.title = `${title} - Link Shortener 1.0`;
}

/**
 * Converts the given error object to a string
 * by either returning the error message from
 * its body if it is an API error; or stringifying
 * it.
 *
 * @param {object} err
 * @returns {string}
 */
export function useError(err) {
    if (err.body && err.body.error) {
        return err.body.error;
    }
    return JSON.stringify(err);
}