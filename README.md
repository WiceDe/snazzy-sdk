# Snazzy SDK

The purpose of this SDK is to offer a number of simple function to create and update persons within SnazzyContacts. Users will be able ot include this SDK as part of their website, letting them create persons within their SnazzyContacts account whenever a website visitor takes certain actions, such as filling out a contact form.

## API

### snazzySDK.init()

Initialise the sdk.


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

```
sdk.addAction({
  actionType: 'click’,
  boundToSelector: '#thisButton’,
  actionDataSelector: '#input1, #input2’,
  beforeSendCallBack: null,
  eventName: 'My Event 1’,
});
```

### snazzySDK.setAttribute()

```
sdk.setAttribute(type, value)
```
### snazzySDK.addContactData()

```
addContactData(type, value, categories)
```

### snazzySDK.addAddress()

```
addAddress(street, streetNumber, zipcode, city, categories)
```

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

In any case you first have to create an instance of the sdk and Initialise it.

```
sdk = new snazzySdk;
sdk.init();
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
  actionType: 'click’,
  boundToSelector: '#thisButton’,
  actionDataSelector: '#input1, #input2’,
  beforeSendCallBack: null,
  eventName: 'My Event 1’,
});
```

### Manual workflow

Manually preparing and sending data:

Empty the body data if you want to prepare a new entry after one was send (optional)

```
sdk.createNew()
```

Execute one or more of the following command to aggregate data:

Setting a attribute of a person or organization entry

Example:

```
sdk.setAttribute('firstName', 'Jane')
sdk.setAttribute('lastName', 'Doe')
```

addContactData(type, value, categories)

Example: addContactData('phone', '12345678')

addAddress(street, streetNumber, zipcode, city, categories)

addNote(content)

send() // sending the data
