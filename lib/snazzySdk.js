class SnazzySdk {
  constructor() {
    this.apiKey = undefined;
    this.webhookToken = undefined;
    this.foreignId = undefined;
    this.personExists = false;
  }

  init() {

  }

  setId() {

  }

  setAttribute() {

  }

  addNote() {

  }

  executeRequest(url, body) {
    if (!this.apiKey) {
      return { error: 'No API key set!' };
    }
  }

  executeWebhookRequest(body) {
    if (!this.apiKey) {
      return { error: 'No webhook token set!' };
    }
  }
}


module.exports = { SnazzySdk };
