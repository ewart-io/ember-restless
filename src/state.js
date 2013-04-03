/*
 * State
 * Mixin for managing REST lifecycle state
 */
(function() {

'use strict';

RESTless.State = Em.Mixin.create( Em.Evented, {
  /* 
   * isLoaded: model has downloaded from REST service
   */
  isLoaded: false,
  /* 
   * isDirty: model has changes that have not yet been saved to REST service
   */
  isDirty: false,
  /* 
   * isSaving: model is in the process of saving to REST service
   */
  isSaving: false,
  /* 
   * isError: model has been marked as invalid after response from REST service
   */
  isError: false,
  /* 
   * errors: error message json returned from REST service
   */
  errors: null,

  /* 
   * clearErrors: (helper) reset isError flag, clear error messages
   */
  clearErrors: function() {
    this.setProperties({ 'isError': false, 'errors': null });
  },

  /* 
   * copyState: copies the current state to a cloned object
   */
  copyState: function(clone) {
    return clone.setProperties({
      isLoaded: this.get('isLoaded'),
      isDirty:  this.get('isDirty'),
      isSaving: this.get('isSaving'),
      isError:  this.get('isError'),
      errors:   this.get('errors')
    });
  },

  /* 
   * _triggerEvent: (internal) helper method to trigger lifecycle events
   */
  _triggerEvent: function(name, data) {
    Em.run(this, function() {
      this.trigger(name, data);
    });
  },

  /* 
   * _onError: (internal) helper method for handling error responses
   * Parses error json, sets error properties, and triggers error events
   */
  _onError: function(errorResponse) {
    var errorJson;
    try { errorJson = $.parseJSON(errorResponse); } catch(e){}
    this.setProperties({ 'isError': true, 'errors': errorJson });
    this._triggerEvent('becameError', this.get('errors'));
  }
});

})();