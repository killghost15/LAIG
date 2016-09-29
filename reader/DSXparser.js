function DSXparser(){
  this.reader = new CGFXMLreader();
}

DSXparser.prototype.constructor = function (application) {

};

DSXparser.prototype.getBoolean = function (element, attributeName, required) {
  return this.reader.getBoolean(element, attributeName, required);
};

DSXparser.prototype.getErrorMessage = function () {
  return this.reader.getErrorMessage();
};

DSXparser.prototype.getFloat = function (element, attributeName, required) {
  return this.reader.getFloat(element, attributeName, required);
};

DSXparser.prototype.getInteger = function (element, attributeName, required) {
  return this.reader.getInteger(element, attributeName, required);
};

DSXparser.prototype.getItem = function (element, attributeName, choices, required) {
  return this.reader.getItem(element, attributeName, choices, required);
};

DSXparser.prototype.getRGBA = function (element, attributeName, required) {
  return this.reader.getRGBA(element, attributeName, required);
};

DSXparser.prototype.getString = function (element, attributeName, required) {
  return this.reader.getString(element, attributeName, required);
};

DSXparser.prototype.getVector2 = function (element, attributeName, required) {
  return this.reader.getVector2(element, attributeName, required);
};

DSXparser.prototype.getVector3 = function (element, attributeName, required) {
  return this.reader.getVector3(element, attributeName, required);
};

DSXparser.prototype.hasAttribute = function (element, attributeName) {
  return this.reader.hasAttribute(element, attributeName);
};

DSXparser.prototype.getR = function (element, attributeName, required) {
  
};

DSXparser.prototype.getG = function (element, attributeName, required) {

};

DSXparser.prototype.getB = function (element, attributeName, required) {

};

DSXparser.prototype.getA = function (element, attributeName, required) {

};
