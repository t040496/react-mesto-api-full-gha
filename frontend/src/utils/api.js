
class Api {
  constructor(options) {
    this._serverUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }

  getUserInfo() {
    return this._request(`${this._serverUrl}/users/me`, {
      headers: this._headers
    })
  }

  setUserInfo(userData) {
    return this._request(`${this._serverUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: `${userData.name}`,
        about: `${userData.about}`
      })
    })
  }

  setUserAvatar(avatarData) {
    return this._request(`${this._serverUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: `${avatarData.avatar}`
      })
    })
  }

  getInitialCards() {
    return this._request(`${this._serverUrl}/cards`, {
      headers: this._headers
    })
  }

  sendNewCardInfo(cardData) {
    return this._request(`${this._serverUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: `${cardData.name}`,
        link: `${cardData.link}`
      })
    })
  }

  deleteCard(id) {
    return this._request(`${this._serverUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
  }

  setCardLike(id) {
    return this._request(`${this._serverUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: this._headers
    })
  }

  deleteCardLike(id) {
    return this._request(`${this._serverUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._headers
    })
  }
}

export const api = new Api({
  baseUrl: 'https://api.imesto.students.nomoreparties.sbs',
  headers: {
    authorization: 'e8064865-8470-48c7-9ead-ad84498413da',
    'Content-Type': 'application/json'
  }
})
