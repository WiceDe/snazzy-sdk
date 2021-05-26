# Snazzy SDK

The purpose of this SDK is to offer a number of simple function to create and update persons within SnazzyContacts. Users will be able to include this SDK as part of their website, letting them create persons within their SnazzyContacts account whenever a website visitor takes certain actions, such as filling out a contact form.

## API

Before using the SDK a new instance has to be created.

```
sdk = new window.snazzySdk({ webhookUrl: 'URL OF YOUR WEBHOOK' });
```

Optionally the an id can be directly specified on creation time via the attribute:

foreignUid

If 'skipInit:true' is set the init process will not executed on creation and has to be called manually as explained below.

### Async loading

Instead of waiting for script load you can also make the snazzySDK load asynchronous by creating in the following manner:

```
<script async src="https://api.snazzycontacts.com/sdk.js"></script>
<script>
function sdkLoaded() {
  // SDK is loaded do something here ...
}

window.snazzySdk = {
  settings: {
    webhookUrl: 'YOUR WEBHOOK'
  },
  callback: sdkLoaded,
}
</script>
```

### snazzySDK.init()

Initialise the sdk. This call is only required if you have specified skipInit on instance creation for compactibility reasons.

```
sdk.init();
```

### snazzySDK.setWebhookUrl()

You need to set a webhook to send an match data. The url can also set when creating the sdk instance. If changed later the newest webhookUrl will be used for sending.

```
sdk.setWebhookUrl(url)
```

### snazzySDK.setId()

Optional you can set a foreignId at any time. If not set a random identifier will be generated.

```
sdk.setId(id)
```

### snazzySDK.createNew()

Clear any previously set data. If a data object is provided the data will be set to the object.

```
sdk.createNew(data)
```

### snazzySDK.addAction()

Define an action that is execute when an DOM event on one or more specified elements is triggered (see also action based workflow below).

#### actionType

Any valid event on the browser window, including 'click', 'mouseenter', 'mouseleave', 'mousemove', 'blur' and 'beforeunload'.

Further more 'document.visible' and 'document.visible' for document visibilitychange events and 'error' which fires on page errors.

#### boundToSelector

A DOM selectors-string specifying the element on which to listen for an action.

Example: Selecting all have the class "button" and the class "submit-button"
```
.button.submit-button
```

#### actionDataSelector

A string of selectors specifiying the element(s) from which data will be take if the action is executed. Elements have to be separated with a ",". If several elements match the selector each of them will be added to the data send via the sdk.

Example 1: Selecting all fields with the class "fields" from the specified form with id #form1

```
#form1 .fields
```

Example 2: Selecting only the elements with the ids "field1" and "field2"
```
#field1, #field2
```

you can also select elements without id or class with the standard DOM selectors. For example "form" would select all forms on a page.

#### beforeSendCallBack (optional)

Field for providing an optional callback function that will be executed before any data is send. The provided function will receive the action object and the prepared data.

If the callback function returns false no data will be send. Otherwise the returned data will be send.

```
callback(action, data)
```

#### webhookUrl (optional)

If a url is supplied in the webhookUrl field of the action that url will be used for instead of any globally set url.

#### Example for addAction:
```
sdk.addAction({
  actionType: 'click',
  boundToSelector: '#thisButton',
  actionDataSelector: '#input1, #input2',
  beforeSendCallBack: null,
  eventName: 'My Event 1',
  webhookUrl: false,
});
```

### snazzySDK.setAttribute()

```
sdk.setAttribute(type, value)
```

Example 1: setAttribute('firstName', 'Joe')

Example 1: setAttribute('categories', 'Category1, Category2')

### snazzySDK.addContactData()

```
addContactData(type, value, categories)
```

Example: addContactData('phone', '+49 123456')

The optional variable categories can be one or more categories as comma separated string "Category1, Category2".

### snazzySDK.addAddress()

```
addAddress(street, streetNumber, zipcode, city, categories)
```

Example: addAddress('Someroad', '12', '12345', 'Somecity')

The optional variable categories can be one or more categories as comma separated string "Category1, Category2".

### snazzySDK.addNote()

```
addNote(content)
```

### snazzySDK.send()

```
send()
```

## Usage

Data can either be send manually when desired (manual workflow) or automatically when an DOM event on one or more specified elements is triggered (action based workflow) .

In any case you first have to create an instance of the sdk.

```
sdk = new window.snazzySdk({ webhookUrl: 'URL OF YOUR WEBHOOK' });
```

Optional you can set a foreignId at any time. If not set a random identifier will be generated.

```
sdk.setId(id)
```

### Action based workflow

Automatically sending data based on events:

```
addAction(action)
```

Example:
```
sdk.addAction({
  actionType: 'click',
  boundToSelector: '#thisButton',
  actionDataSelector: '#input1, #input2',
  beforeSendCallBack: null,
  eventName: 'My Event 1',
  webhookUrl: false,
});
```

### Manual workflow

Manually preparing and sending data:

Empty the body data if you want to prepare a new entry after one was send (optional)

```
sdk.createNew()
```

Execute one or more of the following command to aggregate data:

Setting a attribute of a person or organization entry.

Example:

```
sdk.setAttribute('firstName', 'Jane')
sdk.setAttribute('lastName', 'Doe')
```

addContactData(type, value, categories)

Example: addContactData('phone', '12345678', 'Category1, Category2')

addAddress(street, streetNumber, zipcode, city, categories)

addNote(content)

send() // sending the data
