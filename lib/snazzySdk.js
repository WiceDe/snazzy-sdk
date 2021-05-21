class SnazzySdk {
  constructor({ apiKey, webhookToken, foreignUid }) {
    this.apiKey = apiKey;
    this.webhookToken = webhookToken;
    this.foreignUid = foreignUid || (Math.random() + 1).toString(36).substring(7); // Initialises a reasonably random foreign uid
    this.snazzyUid = undefined;
    this.personExists = false;

    this.permittedAttributes = [
      'firstName',
      'lastName',
      'middleName',
      'title',
      'salutation',
      'gender',
      'nickname',
      'birthday',
      'jobTitle',
      'displayName',
    ];

    this.permittedContactData = [
      'email',
      'phone',
      'mobile',
      'xing',
      'facebook',
      'twitter',
      'web',
      'fax',
    ];
  }

  init() {

  }

  setId(id) {
    this.foreignUid = id;
  }

  setAttribute(type, value) {
    if (!this.permittedAttributes.includes(type)) {
      return { error: 'Invalid Attribute' };
    }
  }

  addContactData(type, value) {
    if (!this.permittedContactData.includes(type)) {
      return { error: 'Invalid Contact Data Type' };
    }
  }

  addNote(content) {
    if (!content || typeof content !== 'string') {
      return { error: 'Invalid Content ' };
    }
  }

  async executeRequest(url, body) {
    if (!this.apiKey) {
      return { error: 'No API key set' };
    }
  }

  async executeWebhookRequest(body) {
    if (!this.apiKey) {
      return { error: 'No webhook token set' };
    }
  }
}


module.exports = { SnazzySdk };
