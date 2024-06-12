# Facebook Marketplace Wrapper
---

This is a small little project I've made to allow easier access to Facebook Marketplace's API to get listings by name with filters.
Currently, it can get listings and supports most of the basic filter options.

**KEEP IN MIND, THIS IS BARELY FINISHED AND IN A DIRTY STATE. LOTS ISN'T IMPLEMENTED YET.**

At the bottom there is a list of implemented and coming features.


## Documentation (WIP)
---

### Functions
==*searchLocations*==
Gets the list of locations suggested by Facebook with their names and internal id.
This is quite basic yet with lots of information not returned.

**EXAMPLE**
```
const Marketplace = require('./MarketplaceWrapper.js');

let suggestedLocations = await Marketplace.searchLocations(locationName);
// Prints the first suggested location
console.log(suggestedLocations[1]);
```
