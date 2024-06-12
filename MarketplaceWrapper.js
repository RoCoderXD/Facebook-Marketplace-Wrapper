const { JSDOM } = require('jsdom');




function logCLIOutputFormat(marketplaceItems) {
    for (let i=1; i<marketplaceItems.length; i++) 
        {
            let listing = marketplaceItems[i]["node"]["listing"];
            console.log("\n\n---------------------------------------------------------------------\n");
            console.log(`Title: ${listing["marketplace_listing_title"]}`);
            console.log(`Location: ${listing["location"]["reverse_geocode"]["city_page"]["display_name"]}`);
            if (listing["strikethrough_price"] !== null) {
                console.log(`Price: ${listing["listing_price"]["formatted_amount"]}`);
                console.log(`--Reduced from: ${listing["strikethrough_price"]["formatted_amount"]}--`);
            } else {
                console.log(`Price: ${listing["listing_price"]["formatted_amount"]}`);
                console.log("--No Discount--");
            }
            //console.log(`${marketplaceItems[i]["node"]["listing"]["custom_sub_titles_with_rendering_flags"][0]["subtitle"]}`);
            console.log(`URL: https://www.facebook.com/marketplace/item/${listing["id"]}/`);
            console.log("---------------------------------------------------------------------\n");
        }
}










module.exports = {
version: "0.0.1",



/**
 * Returns a list of location names and their ids guessed based on the text provided.
 * @param {string} text The name of a location to look for.
 * 
 * @example
 * let locationChoices = searchLocations("Chicago")
 */
searchLocations: async function(text) {
    let locationIdSearch = await fetch("https://www.facebook.com/api/graphql/", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
            "priority": "u=1, i",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-asbd-id": "129477",
            "x-fb-friendly-name": "MarketplaceSearchAddressDataSourceQuery",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `variables=%7B%22params%22%3A%7B%22caller%22%3A%22MARKETPLACE%22%2C%22country_filter%22%3Anull%2C%22integration_strategy%22%3A%22STRING_MATCH%22%2C%22page_category%22%3A%5B%22CITY%22%2C%22SUBCITY%22%2C%22NEIGHBORHOOD%22%2C%22POSTAL_CODE%22%5D%2C%22query%22%3A%22${encodeURIComponent(text)}%22%2C%22search_type%22%3A%22PLACE_TYPEAHEAD%22%2C%22viewer_coordinates%22%3Anull%7D%7D&server_timestamps=true&doc_id=7321914954515895`,
        "method": "POST"
    });
    let locationIdSearchResponse = await locationIdSearch.text();
    let locationIdSearchArray = JSON.parse(locationIdSearchResponse);

    let locationArray = {};

    let importantJSONSection = locationIdSearchArray["data"]["city_street_search"]["street_results"]["edges"];
    for (let i=0; i<importantJSONSection.length; i++) { // Loop through the JSON to get the important information.
        let location = importantJSONSection[i];
        locationArray[`${location["node"]["single_line_address"]}`] = location["node"]["page"]["id"]
    }

    return locationArray;
},








/**
 * Creates the query's filter section based on the user's preferences.
 * 
 * @param {number} minPrice The minimum price of the listings. Use -1 for no filtering by minimum price.
 * @param {number} maxPrice The maximum price of the listings. Use -1 for no filtering by maximum price.
 * @param {string} deliveryMethod The delivery method for the listings. Choose from "all", "local_pick_up", or "shipping". Use "All" for no filtering by delivery method.
 * @param {string[]} itemCondition The condition of the items. Choose from "new", "used_like_new", "used_good", and "used_fair". Leave array empty for no filtering by condition.
 * @param {string} daysSinceListed The number of days since the listings were listed. Choose from "all", "1", "7", or "30". Use "All" for no filtering by days since listed.
 * @param {string} availability The availability of the listings. Choose from "available"(in) and "sold"(out). Use "available" for default Marketplace search.
 * @param {string} priceType The price type of the listings. Choose from "discounted" and "normal". Use "normal" for default Marketplace search.
 * 
 * @example
 * let queryFilters = createSearchQuery(-1, -1, "all", [], "all", "available", "normal")
 */
createQueryFilters: function(minPrice, maxPrice, deliveryMethod, itemCondition, daysSinceListed, availability, priceType) {
    let searchQuery = "";
    // Check if the variable configurations are at their defaults or not
    if (availability !== "available") {
        searchQuery += `availability=out%20of%20stock&`;
    }
    if (minPrice !== -1) {
        searchQuery += `minPrice=${minPrice}&`;
    }
    if (maxPrice !== -1) {
        searchQuery += `maxPrice=${maxPrice}&`;
    }
    if (daysSinceListed !== "all") {
        searchQuery += `daysSinceListed=${daysSinceListed}&`;
    }
    if (deliveryMethod !== "all") {
        searchQuery += `deliveryMethod=${deliveryMethod}&`;
    }
    if (itemCondition.length > 0) {
        searchQuery += `itemCondition=${itemCondition.join("%2C")}&`;
    }

    return searchQuery;
},







/**
 * // Returns listings in the specified location
 * @param {string} queryFilters The query created by createSearchQuery. If you aren't using any filters, use an empty string.
 * @param {string} locationId The Marketplace location id. Can be gotten from searchLocations().
 * @param {string} itemName The text to search on Marketplace for.
 * @param {boolean} logCLIOutputFormat Default: false. Whether to log the results in a log-friendly format additionally.
 * 
 * @example
 * let queryFilters = createSearchQuery(-1, -1, "all", [], "all", "available", "normal")
 * let locationChoices = searchLocations("Chicago")
 * 
 * let listings = getListings(query, locationChoices["Chicago, Michigan"], "certain item")
 */
getListings: async function(queryFilters, locationId, itemName, cliOutputFormat = false) {
    let url = "";
    let encodedItemName = encodeURIComponent(itemName);

    if (queryFilters == "") {
        //console.log("Using default URL.");
        url = `https://www.facebook.com/marketplace/${locationId}/search/?query=${encodedItemName}`;
    }else{
        //console.log("Using custom URL.")
        url = `https://www.facebook.com/marketplace/${locationId}/search/?${queryFilters}query=${encodedItemName}&exact=false`;
        //console.log(url);
    }

    var marketFetch = await fetch(url, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.6",
          "cache-control": "max-age=0",
          "priority": "u=0, i",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "sec-gpc": "1",
          "upgrade-insecure-requests": "1",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
      });

    var marketResponseText = await marketFetch.text(); // get the response as text
    try {
        const dom = new JSDOM(marketResponseText);
            
        // Get all script tags
        let scriptTags = dom.window.document.querySelectorAll('script');
            
            
        let jsonStrings = [];
        scriptTags.forEach(script => {
            let content = script.textContent.trim();
            if (content.includes('"marketplace_search":')) {
                let startIndex = content.indexOf('"marketplace_search":'); // Find the important section of the JSON selected.
                let endIndex = content.indexOf('"extensions"', startIndex); // Find the last unique identifiable section of the JSON selected.
            
                //console.log(`Found "marketplace_search" at index ${startIndex}, end index ${endIndex}`); // Debugging: Log the indices
            
                if (endIndex !== -1) { // if the endIndex isn't f**ked up, do the cool stuff
                    let jsonString = content.substring(startIndex, endIndex - 2); // Takes piece of the determined JSON and -2 to remove the last comma and closing bracket that's before "extensions":.
                    jsonStrings.push(jsonString);
                } else {
                    console.log('End index not found for "marketplace_search"');
                }
            }
        });
            
        // Parse and optionally log each listing.
        let items = {};
        jsonStrings.forEach(jsonString => {
            try {
                let wrappedJsonString = `{${jsonString}}`;
                let jsonData = JSON.parse(wrappedJsonString);
                let marketplaceItems = jsonData["marketplace_search"]["feed_units"]["edges"]

                if (cliOutputFormat) {
                        logCLIOutputFormat(marketplaceItems)
                }


                    
                // Create the object for the listings. Gotta add more stuff to this.

                for (let i=1; i<marketplaceItems.length; i++) {
                    let listing = marketplaceItems[i]["node"]["listing"];
                    items[`${listing["marketplace_listing_title"]}`] = {
                        title: listing["marketplace_listing_title"],
                        location: listing["location"]["reverse_geocode"]["city_page"]["display_name"],
                        price: listing["listing_price"]["formatted_amount"],
                        discounted: listing["strikethrough_price"] !== null ? true : false,
                        previousPrice: listing["strikethrough_price"] !== null ? listing["strikethrough_price"]["formatted_amount"] : null, // What was the price before the discount?
                        url: `https://www.facebook.com/marketplace/item/${listing["id"]}/`
                    }
                }


            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    } catch (error) {
        console.error("Error parsing HTML:", error);
    }

    return items;
}
}