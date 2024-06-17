# Hygen Configuration
***
Create in the root project a file named .hygen.js, following the next structure:

```javascript
const helpers = require("@irontec-voip/ivoz-ui/hygen/lib");

module.exports = {
  templates: `${__dirname}/node_modules/@irontec-voip/ivoz-ui/hygen/templates`,
  helpers: {
    ...helpers,
    url: () => "https://10.189.2.23/isbc/api/docs.json",
  },
};
```
### Where

**templates**: Makes a reference to the location of the generator templates.<br>
**helpers**: This is an object used to register the helper functions/params used to perform actions such as code formatting, API calls, and so on.<br>
**url**: Function which returns a URL string where is located the API's specification to work with.<br>

#### Methods
```javascript
formattedEntityProperties(url, args)

//Output:
  name?: T;
  type?: T;
  domain?: T;
  host?: T;
  port?: T;
  id?: T;
  socket?: T;
```
```javascript
formattedEntity(url, args)

//Output:
  'name': {
    label: _('Name'),
  },
  'type': {
    label: _('Type'),
    enum: {
      Ivoz_Business: 'Ivoz Business',
      Other: 'Other',
    },
  },
  'domain': {
    label: _('Domain'),
  },
  'host': {
    label: _('Host'),
  },
  'port': {
    label: _('Port'),
  },
  'id': {
    label: _('Id'),
  },
  'socket': {
    label: _('Socket'),
  },
```
```javascript
properties(url, args)

//Output:
'name',
'type',
'type',
'domain',
'host',
'port',
'id',
'socket',
```
