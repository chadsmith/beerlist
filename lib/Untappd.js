/* global fetch */
import qs from 'qs';

const CLIENT_ID = 'YOUR_UNTAPPD_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_UNTAPPD_CLIENT_SECRET';

export default (q, offset) =>
  fetch(`https://api.untappd.com/v4/search/beer?${qs.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    q,
    offset,
  })}`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(res => res.json())
    .then(({ response }) => {
      const { beers = {}, homebrew = {} } = response;
      return [].concat(beers.items, homebrew.items);
    })
    .then(items => items.map((item) => {
      const {
        beer: {
          bid: id,
          beer_name: name,
          beer_abv: abv,
          beer_ibu: ibu,
          beer_style: style,
        },
        brewery: { brewery_name: brewery },
      } = item;
      return {
        id,
        name,
        abv,
        ibu,
        style,
        brewery,
      };
    }));
