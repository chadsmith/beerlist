import qs from 'qs';

const CLIENT_ID = '8389a169fb4e9b53ed5c8abe873f3745';

export const REDIRECT_URL = 'http://opensourcebeer.com/';

export const LOGIN_URL = `https://untappd.com/oauth/authenticate/?${qs.stringify({
  response_type: 'token',
  client_id: CLIENT_ID,
  redirect_url: REDIRECT_URL,
})}`;

export const login = url =>
  (dispatch) => {
    const { access_token: token } = qs.parse(url.split('#')[1]);
    dispatch({ type: 'LOGIN', token });
  };

export const getBeer = (beer) =>
  (dispatch, getState) =>
    fetch(`https://api.untappd.com/v4/beer/info/${beer.id}?${qs.stringify({
      access_token: getState().api.token,
    })}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(({ response }) => response.beer)
      .then(beer => {
        const {
          bid: id,
          beer_name: name,
          beer_abv: abv,
          beer_ibu: ibu,
          beer_style: style,
          beer_label: beerLabel,
          brewery: {
            brewery_name: brewery,
            brewery_label: breweryLabel,
          },
          stats: {
            user_count,
          },
        } = beer;
        const label = beerLabel.includes('default') && !breweryLabel.includes('default') ? breweryLabel : beerLabel;
        return {
          id,
          name,
          abv,
          ibu,
          style,
          brewery,
          label,
          tried: user_count > 0,
        };
      })
      .then(beer =>
        dispatch({
          type: 'SET_BEER',
          beer,
        })
      );

export const search = (q, offset) =>
  (dispatch, getState) =>
    fetch(`https://api.untappd.com/v4/search/beer?${qs.stringify({
      access_token: getState().api.token,
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
            beer_label: beerLabel,
          },
          brewery: {
            brewery_name: brewery,
            brewery_label: breweryLabel,
          },
          have_had: tried,
        } = item;
        const label = beerLabel.includes('default') && !breweryLabel.includes('default') ? breweryLabel : beerLabel;
        return {
          id,
          name,
          abv,
          ibu,
          style,
          brewery,
          label,
          tried,
        };
      }));
