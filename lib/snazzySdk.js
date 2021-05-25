class SnazzySdk {
  constructor({ apiKey, webhookToken, foreignUid }) {
    this.url = apiUrl || 'https://snazzycontacts.com/api/';
    this.apiKey = apiKey;
    this.webhookToken = webhookToken;
    this.foreignUid = foreignUid || (Math.random() + 1).toString(36).substring(7); // Initialises a reasonably random foreign uid
    this.snazzyUid = undefined;
    this.personExists = false;
    this.eventListeners = {};
    this.actions = {};

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
    window.onerror = function(error, url, line) {
      handleEvent('error', error, url, line);
    }

    document.addEventListener("visibilitychange", {
      if (document.hidden) {
        handleEvent('document.hidden');
      } else {
        handleEvent('document.visible');
      }
    }, false);
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

  handleEvent(type, event, arg2, arg3) {
     if(event && event.target) {
       console.log('type', type);
       console.log('event.target', event.target);

       if(type in this.actions) {
         let length = this.actions[type].length;
         for(i=0;i<length;i+=1) {
           console.log(this.actions[type][i].boundToSelector);
           if(event.target.matches(this.actions[type][i].boundToSelector)){
             this.executeAction(this.actions[type][i]);
           }
         }
       }
       event.target.matches()
     } else if(type === 'error') {
       if(type in this.actions) {
         let length = this.actions[type].length;
         for(i=0;i<length;i+=1) {
           errorData = { error: event, url: arg2, line: arg3};
           this.executeAction(this.actions[type][i], errorData);
         }
       }
     }
  }

  // {
  //  actionType: 'click’,
  //  boundToSelector: '#thisButton’,
  //  actionDataSelector: '#input1, #input2’,
  //  beforeSendCallBack: null,
  //  eventName: 'My Event 1’,
  // }

  addAction(action){
    required = ['actionType', 'boundToSelector', 'actionDataSelector'];
    for(i=0;i<required.length;i++) {
      if(!(required[i] in action)) {
        window.console && console.log(required[i] + ' is required for an action!');
        return false;
      }
    }

    if(!(action.actionTyp in this.actions)) {
      this.actions[action.actionType] = [];
    }

    this.actions[action.actionType].push(action);

    if(!(action.actionType in this.eventListeners)){
      try {
        this.eventListeners[action.actionTyp] = document.body.addEventListener(action.actionType, handleEvent);
      } catch(e) {
        window.console && console.log(e);
      }
    }
  }

  executeAction(action, additionalData) {
    console.log('Executing action:', action);
    data = {};
    if(additionalData) data = Object.assign({}, additionalData);
    if(action.eventName) data['eventName'] = action.eventName;

    selectorList = action.actionDataSelector.split(',');
    for(i=0;i<selectorList.length;i++){
      elements = document.querySelectorAll(selectorList[i]);

      for(index in elements) {
        name = ('name' in elements[index] && elements[index].name.trim() !== '')?
          elements[index].name : selectorList[i] + ' ' + index;

        value = '';
        if('value' in elements[index]) {
          value = elements[index].value;
        } else if('innerHtml' in elements[index]) {
          value = elements[index].innerHtml;
        }

        dataName = name;
        j = 1;
        while(dataName in data) {
          dataName = name + ' ' + j;
          j++;
        }
        data[dataName] = value;
      }
    }

    console.log('Data:', data);
    doSend = true;
    if(action.beforeSendCallBack) {
      console.log('Calling callback:', action.beforeSendCallBack);
      doSend = action.beforeSendCallBack(action, data);
    }

    if(doSend) {
      this.executeWebhookRequest(body)
    }
  }

  post(url, apiKey, data, callback) {
    try {
    	req = new(this.XMLHttpRequest);
    	req.open('POST', url, true);
    	req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.setRequestHeader('token', 'Bearer ' + apiKey);
    	req.onreadystatechange = function () {
    		req.readyState > 3 && callback && callback(req.responseText, req);
    	};
      if(typeof data !== 'string') data = JSON.stringify(data)
    	req.send(data)
    } catch (e) {
      window.console && console.log(e);
    }
  }

  executeRequest(body) {
    if (!this.apiKey) {
      return { error: 'No API key set' };
    }

    this.post(this.apiUrl + '?id=' + this.foreignUid, this.apiKey, body);
  }

  executeWebhookRequest(body) {
    if (!this.apiKey) {
      return { error: 'No webhook token set' };
    }

    this.post(this.apiUrl + '?id=' + this.foreignUid, this.apiKey, body);
  }
}


module.exports = { SnazzySdk };
