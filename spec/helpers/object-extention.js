function equals(object1, object2) {
  for (propName in object1) {
      if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
          return false;
      }
      else if (typeof object1[propName] != typeof object2[propName]) {
          return false;
      }
  }
  for(propName in object2) {
      if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
          return false;
      }
      else if (typeof object1[propName] != typeof object2[propName]) {
          return false;
      }
      if(!object1.hasOwnProperty(propName))
        continue;

        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
            if (!object1[propName].equals(object2[propName])) return false;
      }
      else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        if (!object1[propName].equals(object2[propName]))
            return false;
      }
      else if(object1[propName] != object2[propName]) {
         return false;
      }
  }
  return true;
};