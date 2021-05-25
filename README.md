# Snazzy SDK

The purpose of this SDK is to offer a number of simple function to create and update persons within SnazzyContacts. Users will be able to include this SDK as part of their website, letting them create persons within their SnazzyContacts account whenever a website visitor takes certain actions, such as filling out a contact form.

## API

Before using the SDK a new instance has to be created.

```
sdk = new snazzySdk;
```

### snazzySDK.init()

Initialise the sdk.

```
sdk.init();
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

Example 1: Selecting all fields with the class "fields" from the specified form1
```
#form1 .fields
```

Example 2: Selecting only the elements with the ids "field1" and "field2"
```
#field1, #field2
```

#### beforeSendCallBack (optional)

Field for providing an optional callback function that will be executed before any data is send. The provided function will receive the action object and the prepared data.

If the callback function returns false no data will be send. Otherwise the returned data will be send.

```
callback(action, data)
```

#### Example for addAction:
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
