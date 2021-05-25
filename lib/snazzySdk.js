class SnazzySdk {
  constructor(data) {
    if(!data || !data.apiKey) {
      if(window.console) console.log('No api key specified but required!');
      return false;
    }

    this.apiUrl = data.apiUrl || 'https://api.snazzycontacts.com/api/webhook/';
    this.apiKey = data.apiKey;
    this.webhookToken = data.webhookToken;
    this.foreignUid = data.foreignUid || (Math.random() + 1).toString(36).substring(7); // Initialises a reasonably random foreign uid
    // this.snazzyUid = undefined;
    // this.personExists = false;
    this.eventListeners = {};
    this.actions = {};
    this.body = {};

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

    if(!data.skipInit) this.init();
  }

  init() {
    window.onerror = function(error, url, line) {
      this.handleEvent('error', error, url, line);
    }.bind(this);

    document.addEventListener("visibilitychange", function(){
      if (document.hidden) {
        this.handleEvent('document.visible');
      } else {
        this.handleEvent('document.hidden');
      }
    }.bind(this), false);
  }

  createNew(data) {
    if(data && typeof data === 'object') {
      this.body = data;
    }
  }

  setId(id) {
    this.foreignUid = id;
  }

  setAttribute(type, value) {
    if (!this.permittedAttributes.includes(type)) {
      return { error: 'Invalid Attribute' };
    }

    this.body[type] = value;
  }

  addContactData(type, value, categories) {
    if (!this.permittedContactData.includes(type)) {
      return { error: 'Invalid Contact Data Type' };
    }

    if(!('contactData' in this.body)) this.body.contactData = [];
    this.body.contactData.push({
      type,
      value,
      categories,
    });
  }

  addAddress(street, streetNumber, zipcode, city, categories) {
    if(!('addresses' in this.body)) this.body.addresses = [];
    this.body.addresses.push({
      street,
      streetNumber,
      zipcode,
      city,
      categories,
    });
  }

  addNote(content) {
    if (!content || typeof content !== 'string') {
      return { error: 'Invalid Content ' };
    }

    if(!('notes' in this.body)) this.body.notes = [];

    this.body.notes.push(content);
  }

  handleEvent(type, event, arg2, arg3) {
    console.log('In handle event');
    console.log(type, event, arg2, arg3);
    console.log(event.target);
    console.log((event && event.target));
    console.log('this.actions', this.actions);
     if(event && event.target) {
       console.log('type', type);
       console.log('event.target', event.target);

       if(type in this.actions) {
         var length = this.actions[type].length;
         for(var i=0;i<length;i+=1) {
           console.log(this.actions[type][i].boundToSelector);
           if(event.target.matches(this.actions[type][i].boundToSelector)){
             this.executeAction(this.actions[type][i]);
           }
         }
       }
     } else if(type === 'error' || type === 'document.visible' || type === 'document.hidden') {
       if(type in this.actions) {
         var length = this.actions[type].length;
         for(var j=0;j<length;j+=1) {
           var additionalData = (type === 'error')? { error: event, url: arg2, line: arg3} : { event };
           this.executeAction(this.actions[type][j], additionalData);
         }
       }
     }
  }

  addAction(action){
    console.log('Adding action');
    var required = ['actionType', 'boundToSelector', 'actionDataSelector'];
    for(var i=0;i<required.length;i++) {
      if(!(required[i] in action)) {
        if(window.console) console.log(required[i] + ' is required for an action!');
        return false;
      }
    }

    if(!(action.actionTyp in this.actions)) {
      this.actions[action.actionType] = [];
    }

    this.actions[action.actionType].push(action);

    if(!(action.actionType in this.eventListeners)){
      console.log('Adding new event listener');
      try {
        var that = this;
        this.eventListeners[action.actionTyp] = window.addEventListener(action.actionType, function(event) {that.handleEvent(action.actionType, event)});
      } catch(e) {
        if(window.console) console.log(e);
      }

      console.log(this.eventListeners[action.actionTyp]);
    }
  }

  executeAction(action, additionalData) {
    console.log('Executing action:', action);
    var data = {};
    if(additionalData) data = Object.assign({}, additionalData);
    if(action.eventName) data.eventName = action.eventName;

    var selectorList = action.actionDataSelector.split(',');
    for(var i=0;i<selectorList.length;i++){
      var elements = document.querySelectorAll(selectorList[i]);

      for(var j=0; j<elements.length; j++) {
        console.log('elements[j]', elements[j]);
        var name = (elements[j] && 'name' in elements[j] && elements[j].name.trim() !== '')?
          elements[j].name : selectorList[i] + ' ' + j;

        var value = '';
        if('value' in elements[j]) {
          value = elements[j].value;
        } else if('innerHTML' in elements[j]) {
          value = elements[j].innerHTML;
        }

        var dataName = name;
        var j = 1;
        while(dataName in data) {
          dataName = name + ' ' + j;
          j++;
        }
        data[dataName] = value;
      }
    }

    console.log('Data:', data);
    var doSend = true;
    if(action.beforeSendCallBack) {
      console.log('Calling callback:', action.beforeSendCallBack);
      var result = action.beforeSendCallBack(action, data);
      if(result === false){
        doSend = false;
      } else {
        data = result;
      }

    }

    if(doSend) {
      this.executeWebhookRequest(data);
    }
  }

  post(url, apiKey, data, callback) {
    try {
    	var req = new XMLHttpRequest();
    	req.open('POST', url, true);
    	req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.setRequestHeader('token', 'Bearer ' + apiKey);
    	req.onreadystatechange = function () {
    		if(req.readyState > 3 && callback) callback(req.responseText, req);
    	};
      if(typeof data !== 'string') data = JSON.stringify(data);
    	req.send(data);
    } catch (e) {
      if(window.console) console.log(e);
    }
  }

  executeWebhookRequest(body) {
    if (!this.apiKey) {
      return { error: 'No webhook token set' };
    }

    this.post(this.apiUrl + '?id=' + this.foreignUid, this.apiKey, body);
  }

  send() {
    this.executeWebhookRequest(this.body);
  }
}


window.snazzySdk = SnazzySdk;
