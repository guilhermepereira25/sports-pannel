export const options = {
    url: process.env.API_ENDPOINT, 
    path: '', // path is set in the function that calls this
    params: {}, // params are set in the function that calls this
    method: 'GET', // is never a post request so setting this to GET
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': process.env.API_RAPIDAPI_HOST,
        'X-RapidAPI-Key': process.env.API_RAPIDAPI_KEY,
    },
}