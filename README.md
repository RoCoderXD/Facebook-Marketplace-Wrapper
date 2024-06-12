# Facebook Marketplace Wrapper


This is a small little project I've made to allow easier access to Facebook Marketplace's API to get listings by name with filters.
Currently, it can get listings and supports most of the basic filter options. This only returns a certain number of listings
which I'm guessing is Facebook's doing as this doesn't allow you to login to Facebook (Later? I don't quite know).

**KEEP IN MIND, THIS IS BARELY FINISHED AND IN A DIRTY STATE. LOTS ISN'T IMPLEMENTED YET.**

At the bottom, there will be a list of implemented and coming features.


## Documentation (WIP)


## Functions
### *searchLocations*
Gets the list of locations suggested by Facebook with their names and internal id.
This is quite basic with lots of information not returned.

**EXAMPLE**
```
const Marketplace = require('./MarketplaceWrapper.js');

let suggestedLocations = await Marketplace.searchLocations("Chicago");
// Logs the first suggested location's name.
console.log(suggestedLocations);
```
```
Example return:
{
  'Chicago Lawn': '109445852407186',
  'Chicago, Illinois': '108659242498155',
  'South Chicago': '132202160150141',
  'West Chicago, Illinois': '113743478636336',
  'New Chicago': '970203796335965',
  'North Chicago, Illinois': '103794029659599',
  'Chicago Heights, Illinois': '109321495760338',
  'Chicago Ridge, Illinois': '108179855868754',
  'East Chicago, Indiana': '107726489256895',
  'South Lawndale, Chicago': '108000342556515'
}
```
