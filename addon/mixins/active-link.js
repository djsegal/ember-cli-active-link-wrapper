import Ember from 'ember';

// these are not currently editable in Ember
const transitioningInClass  = 'ember-transitioning-in';
const transitioningOutClass = 'ember-transitioning-out';

export default Ember.Mixin.create({

  classNameBindings: ['_active','_disabled','_transitioningIn','_transitioningOut'],
  linkSelector: 'a.ember-view',

  initChildLinkViews: Ember.on('init', function(){
    this.set('primaryLinkViews', Ember.A());
    this.set('backupLinkViews', Ember.A());
  }),

  buildChildLinkViews: Ember.on('didRender', function(){
    Ember.run.schedule('afterRender', this, function() {
      this.set('primaryLinkViews', this._buildChildLinkViews());
    });

    Ember.run.next(this, function() {
      this.set('backupLinkViews', this._buildChildLinkViews());
    });
  }),

  _buildChildLinkViews: function() {
    let childLinkSelector = this.get('linkSelector');
    let childLinkElements = this.$(childLinkSelector);

    let childLinkViews = childLinkElements.toArray().map(view =>
      this._viewRegistry[view.id]
    );

    return Ember.A(childLinkViews);
  },

  childLinkViews: Ember.computed('primaryLinkViews', 'backupLinkViews', function(){
    let childLinkViews = this.get('primaryLinkViews');
    if (childLinkViews.length > 0) {
      return childLinkViews;
    }
    return this.get('backupLinkViews');
  }),

  _transitioningIn: Ember.computed('childLinkViews.@each.transitioningIn', function(){
    if (this.get('childLinkViews').isAny('transitioningIn')) {
      return transitioningInClass;
    }
  }),

  _transitioningOut: Ember.computed('childLinkViews.@each.transitioningOut', function(){
    if (this.get('childLinkViews').isAny('transitioningOut')) {
      return transitioningOutClass;
    }
  }),

  hasActiveLinks: Ember.computed('childLinkViews.@each.active', function(){
    return this.get('childLinkViews').isAny('active');
  }),

  activeClass: Ember.computed('childLinkViews.@each.active', function(){
    let activeLink = this.get('childLinkViews').findBy('active');
    return (activeLink ? activeLink.get('active') : 'active');
  }),

  _active: Ember.computed('hasActiveLinks', 'activeClass', function(){
    return (this.get('hasActiveLinks') ? this.get('activeClass') : false);
  }),

  allLinksDisabled: Ember.computed('childLinkViews.@each.disabled', function(){
    return this.get('childLinkViews').isEvery('disabled');
  }),

  disabledClass: Ember.computed('childLinkViews.@each.disabled', function(){
    let disabledLink = this.get('childLinkViews').findBy('disabled');
    return (disabledLink ? disabledLink.get('disabled') : 'disabled');
  }),

  _disabled: Ember.computed('allLinksDisabled', 'disabledClass', function(){
    return (this.get('allLinksDisabled') ? this.get('disabledClass') : false);
  })

});
