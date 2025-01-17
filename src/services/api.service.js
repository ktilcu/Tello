import {
  getEpisodesEndpoint,
  getShowEndpointWithEmbeds,
} from '../helpers/tv-maze.helpers';

const unwrap = (response) => {
  if (response.status !== 200) {
    console.error('Error fetching data', response.status, response);
    throw new Error(response);
  }

  return response.json();
};

const getAuthHeaders = (token) =>
  new Headers({
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

export const getAuthUserData = ({ token }) => {
  const headers = getAuthHeaders(token);

  return fetch('/api/users/me', { headers }).then(unwrap);
};

export const postNewlyTrackedShows = ({ token, shows }) => {
  const headers = getAuthHeaders(token);

  const options = {
    method: 'POST',
    body: JSON.stringify({ shows }),
    headers,
  };

  return fetch('/api/shows/create', options).then(unwrap);
};

export const updateShow = (token, show) => {
  const headers = getAuthHeaders(token);

  const options = {
    method: 'PUT',
    body: JSON.stringify(show),
    headers,
  };

  return fetch(`/api/shows/${show.id}`, options).then(unwrap);
}

export const getEpisodesForShow = ({ showId }) => {
  return fetch(getEpisodesEndpoint(showId)).then(unwrap);
};

export const getShowWithEmbeddedEpisodesAndNextEpisode = ({ showId }) => {
  return fetch(
    getShowEndpointWithEmbeds(showId, 'episodes', 'nextepisode')
  ).then(unwrap);
};

export const patchEpisodes = ({ token, showId, episodeIds, markAs }) => {
  const headers = getAuthHeaders(token);

  const options = {
    method: 'PATCH',
    body: JSON.stringify({ episodeIds, markAs }),
    headers,
  };

  return fetch(`/api/shows/${showId}/episodes`, options).then(unwrap);
};

export const deleteShow = ({ token, showId }) => {
  const headers = getAuthHeaders(token);

  const options = { method: 'DELETE', headers };

  return fetch(`/api/shows/${showId}`, options).then(unwrap);
};
